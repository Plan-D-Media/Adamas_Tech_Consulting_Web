#!/usr/bin/env node
/**
 * Phase 2 run chain (Swayang, 17 November 2026).
 *
 * One heavy job at a time, in order, each logged. Nothing here is interactive: start it and read the
 * log. Stops at the first failing step so a later step never reports green on a broken build.
 *
 *   node scripts/qa/phase2-chain.mjs            # run the whole chain
 *   node scripts/qa/phase2-chain.mjs --from 3   # resume from step 3
 *   node scripts/qa/phase2-chain.mjs --dry      # print the plan and the preflight only
 *
 * Steps:
 *   0  check:config          config-time import gate + real config load (cheap, always first)
 *   1  drafts build          PREVIEW_DRAFTS=true  SHOW_DRAFT_BADGES=true -> .next-drafts
 *   2  public build          PREVIEW_DRAFTS=false                        -> .next-public
 *   3  final regression      playwright e2e against the public build on 3100
 *   4a GTM dummy build       public build with a dummy NEXT_PUBLIC_GTM_ID (it is inlined at build time)
 *   4b GTM dummy check       tests/e2e/consent.spec.ts against that build
 *   6  review server         next start on 3000 against the DRAFTS build, left running
 *
 * The two builds use separate distDirs (next.config.ts reads NEXT_DIST_DIR), so step 5 can serve the
 * drafts build without rebuilding it after the public build.
 *
 * Preflight, both hard gates:
 *   - PostgreSQL reachable on localhost:5432. The build prerenders pages from the local `adamas`
 *     database; with the database down `next build` fails at the static-check stage.
 *   - at least FREE_MEM_FLOOR_MB free, the brief's 4 GB floor for builds.
 */

import { spawn } from "node:child_process";
import { createConnection } from "node:net";
import { appendFileSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { freemem } from "node:os";

const root = process.cwd();
const EVIDENCE = join(root, "docs", "qa", "evidence", "phase2", "build");
const LOG = join(EVIDENCE, "chain.log");
const FREE_MEM_FLOOR_MB = 4096;
const DRAFTS_DIST = ".next-drafts";
const PUBLIC_DIST = ".next-public";
const GTM_DIST = ".next-gtm";
/** Never a real container: the consent suite only needs a well-formed ID to switch the banner on. */
const DUMMY_GTM_ID = process.env.CHAIN_GTM_ID ?? "GTM-TEST123";
const REVIEW_PORT = 3000;
const E2E_PORT = 3100;

const argv = process.argv.slice(2);
const dry = argv.includes("--dry");
const fromIdx = argv.indexOf("--from");
const from = fromIdx >= 0 ? Number(argv[fromIdx + 1]) : 0;

mkdirSync(EVIDENCE, { recursive: true });

function log(line) {
  const stamp = new Date().toISOString().replace("T", " ").slice(0, 19);
  const text = `[${stamp}] ${line}`;
  console.log(text);
  try {
    appendFileSync(LOG, text + "\n");
  } catch {
    /* logging must never fail the chain */
  }
}

/* ----------------------------------------------------------------- preflight */

function tcpOpen(host, port, timeout = 3000) {
  return new Promise((resolve) => {
    const sock = createConnection({ host, port });
    const done = (ok) => {
      sock.destroy();
      resolve(ok);
    };
    sock.setTimeout(timeout);
    sock.once("connect", () => done(true));
    sock.once("timeout", () => done(false));
    sock.once("error", () => done(false));
  });
}

async function preflight() {
  const problems = [];

  const pg = await tcpOpen("127.0.0.1", 5432);
  log(`preflight: PostgreSQL on 127.0.0.1:5432 -> ${pg ? "reachable" : "NOT reachable"}`);
  if (!pg) {
    problems.push(
      [
        "PostgreSQL is not reachable on localhost:5432.",
        "  The build prerenders pages from the local `adamas` database, so it will fail at static-check.",
        "  Start it (the Windows service needs an elevated shell):",
        "    Start-Service postgresql-x64-16",
      ].join("\n")
    );
  }

  const freeMb = Math.round(freemem() / 1024 / 1024);
  log(`preflight: free memory -> ${freeMb} MB (floor ${FREE_MEM_FLOOR_MB} MB)`);
  if (freeMb < FREE_MEM_FLOOR_MB) {
    problems.push(
      `Free memory is ${freeMb} MB, below the ${FREE_MEM_FLOOR_MB} MB floor for builds.\n` +
        "  Close other applications, or pass --force to override (not recommended: builds get OOM-killed)."
    );
  }

  const port3000 = await tcpOpen("127.0.0.1", REVIEW_PORT);
  const port3100 = await tcpOpen("127.0.0.1", E2E_PORT);
  log(`preflight: port ${REVIEW_PORT} -> ${port3000 ? "IN USE" : "free"}, port ${E2E_PORT} -> ${port3100 ? "IN USE" : "free"}`);
  if (port3000) problems.push(`Port ${REVIEW_PORT} is already in use; stop the server on it first.`);
  if (port3100) problems.push(`Port ${E2E_PORT} is already in use; stop the server on it first.`);

  if (problems.length > 0 && !argv.includes("--force")) {
    log(`preflight FAILED with ${problems.length} problem(s):`);
    for (const p of problems) console.error("\n  - " + p);
    console.error("\nChain not started. Fix the above and run it again.");
    process.exit(1);
  }
  log("preflight OK");
}

/* ---------------------------------------------------------------- step runner */

function run(cmd, args, { env = {}, label, logFile } = {}) {
  return new Promise((resolve) => {
    const started = Date.now();
    log(`START ${label}: ${cmd} ${args.join(" ")}`);
    const out = logFile ? join(EVIDENCE, logFile) : null;
    if (out) writeFileSync(out, `# ${label}\n# ${cmd} ${args.join(" ")}\n\n`);

    const child = spawn(cmd, args, {
      cwd: root,
      shell: true,
      env: { ...process.env, ...env },
      stdio: ["ignore", "pipe", "pipe"],
    });

    const tail = [];
    const onChunk = (buf) => {
      const text = buf.toString();
      if (out) appendFileSync(out, text);
      for (const line of text.split(/\r?\n/)) {
        if (!line.trim()) continue;
        tail.push(line);
        if (tail.length > 40) tail.shift();
      }
    };
    child.stdout.on("data", onChunk);
    child.stderr.on("data", onChunk);

    child.on("close", (code) => {
      const secs = Math.round((Date.now() - started) / 1000);
      if (code === 0) {
        log(`PASS  ${label} (${secs}s)${out ? ` -> ${logFile}` : ""}`);
      } else {
        log(`FAIL  ${label} (exit ${code}, ${secs}s)${out ? ` -> ${logFile}` : ""}`);
        console.error(`\n--- last ${tail.length} line(s) of ${label} ---`);
        for (const l of tail) console.error("  " + l);
        console.error("--- end ---\n");
      }
      resolve(code ?? 1);
    });
  });
}

/* ---------------------------------------------------------------- the chain */

const PLAYWRIGHT_ENV = { PLAYWRIGHT_BROWSERS_PATH: process.env.PLAYWRIGHT_BROWSERS_PATH ?? "E:/ms-playwright" };

const steps = [
  {
    n: 0,
    label: "step 0 - check:config",
    go: () => run("npm", ["run", "check:config", "--silent"], { label: "step 0 - check:config", logFile: "chain-0-check-config.log" }),
  },
  {
    n: 1,
    label: "step 1 - drafts build",
    go: () =>
      run("npx", ["next", "build"], {
        label: "step 1 - drafts build",
        logFile: "chain-1-build-drafts.log",
        env: {
          NEXT_DIST_DIR: DRAFTS_DIST,
          PREVIEW_DRAFTS: "true",
          SHOW_DRAFT_BADGES: "true",
          NODE_OPTIONS: "--max-old-space-size=4096",
        },
      }),
  },
  {
    n: 2,
    label: "step 2 - public build",
    go: () =>
      run("npx", ["next", "build"], {
        label: "step 2 - public build",
        logFile: "chain-2-build-public.log",
        env: {
          NEXT_DIST_DIR: PUBLIC_DIST,
          PREVIEW_DRAFTS: "false",
          SHOW_DRAFT_BADGES: "false",
          NODE_OPTIONS: "--max-old-space-size=4096",
        },
      }),
  },
  {
    n: 3,
    label: "step 3 - final regression (e2e, public build)",
    go: () =>
      run("npm", ["run", "test:e2e"], {
        label: "step 3 - final regression",
        logFile: "chain-3-e2e-public.log",
        env: {
          ...PLAYWRIGHT_ENV,
          NEXT_DIST_DIR: PUBLIC_DIST,
          PREVIEW_DRAFTS: "false",
          SHOW_DRAFT_BADGES: "false",
          NODE_OPTIONS: "--max-old-space-size=3072",
        },
      }),
  },
  {
    // NEXT_PUBLIC_GTM_ID is inlined at build time, so the dummy container needs its own build: the
    // consent suite asserts the full banner flow only when a container ID is present. Steps 1 and 2
    // are both built with it empty, which is what ships unless the client supplies a real container.
    n: 4,
    label: "step 4a - GTM dummy-container build",
    go: () =>
      run("npx", ["next", "build"], {
        label: "step 4a - GTM dummy-container build",
        logFile: "chain-4a-build-gtm.log",
        env: {
          NEXT_DIST_DIR: GTM_DIST,
          PREVIEW_DRAFTS: "false",
          SHOW_DRAFT_BADGES: "false",
          NEXT_PUBLIC_GTM_ID: DUMMY_GTM_ID,
          NODE_OPTIONS: "--max-old-space-size=4096",
        },
      }),
  },
  {
    n: 5,
    label: "step 4b - GTM dummy-container check (consent suite)",
    go: () =>
      run("npx", ["playwright", "test", "tests/e2e/consent.spec.ts"], {
        label: "step 4b - GTM dummy-container check",
        logFile: "chain-4b-consent-gtm.log",
        env: {
          ...PLAYWRIGHT_ENV,
          NEXT_DIST_DIR: GTM_DIST,
          PREVIEW_DRAFTS: "false",
          SHOW_DRAFT_BADGES: "false",
          NEXT_PUBLIC_GTM_ID: DUMMY_GTM_ID,
          NODE_OPTIONS: "--max-old-space-size=3072",
        },
      }),
  },
];

/* -------------------------------------------------------------------- main */

log("=".repeat(78));
log(`Phase 2 chain starting (from step ${from})`);

if (dry) {
  log("--dry: plan only");
  for (const s of steps) log(`  ${s.label}`);
  log(`  step 6 - review server: next start -p ${REVIEW_PORT} against ${DRAFTS_DIST} (left running)`);
  await preflight();
  process.exit(0);
}

await preflight();

for (const s of steps) {
  if (s.n < from) {
    log(`SKIP  ${s.label} (--from ${from})`);
    continue;
  }
  const code = await s.go();
  if (code !== 0) {
    log(`CHAIN STOPPED at ${s.label}. Later steps not run.`);
    log(`Resume with: node scripts/qa/phase2-chain.mjs --from ${s.n}`);
    process.exit(1);
  }
}

/* ------------------------------------------- step 5: leave the review server up */

if (!existsSync(join(root, DRAFTS_DIST))) {
  log(`step 6 SKIPPED: ${DRAFTS_DIST} does not exist (the drafts build did not run).`);
  process.exit(1);
}

log(`step 6 - starting the review server on ${REVIEW_PORT} against the DRAFTS build (${DRAFTS_DIST})`);
const serverLog = join(EVIDENCE, "chain-6-server-3000-drafts.log");
writeFileSync(serverLog, `# next start -p ${REVIEW_PORT} (distDir ${DRAFTS_DIST}, PREVIEW_DRAFTS=true)\n\n`);

const server = spawn("npx", ["next", "start", "-p", String(REVIEW_PORT)], {
  cwd: root,
  shell: true,
  detached: true,
  env: {
    ...process.env,
    NEXT_DIST_DIR: DRAFTS_DIST,
    PREVIEW_DRAFTS: "true",
    SHOW_DRAFT_BADGES: "true",
    NODE_OPTIONS: "--max-old-space-size=3072",
  },
  stdio: ["ignore", "pipe", "pipe"],
});
server.stdout.on("data", (b) => appendFileSync(serverLog, b.toString()));
server.stderr.on("data", (b) => appendFileSync(serverLog, b.toString()));

// Wait for it to answer before declaring the chain done.
let up = false;
for (let i = 0; i < 40; i++) {
  await new Promise((r) => setTimeout(r, 1000));
  if (await tcpOpen("127.0.0.1", REVIEW_PORT, 1000)) {
    up = true;
    break;
  }
}

if (!up) {
  log(`step 6 FAILED: nothing answering on ${REVIEW_PORT} after 40s. See ${serverLog}`);
  process.exit(1);
}

writeFileSync(join(EVIDENCE, "chain-6-server.pid"), String(server.pid ?? ""));
server.unref();

log(`PASS  step 6 - review server up: http://localhost:${REVIEW_PORT}/in/  (pid ${server.pid}, drafts build)`);
log("CHAIN COMPLETE. The review server is left running on purpose; stop it when the review is done:");
log(`  Stop-Process -Id ${server.pid}`);
log("=".repeat(78));
process.exit(0);
