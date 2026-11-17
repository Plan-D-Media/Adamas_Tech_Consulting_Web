#!/usr/bin/env node
/**
 * Runs `prisma generate` when the build needs it, and only then.
 *
 * On Vercel (and any CI) node_modules is restored from a cache, so the client that `@prisma/client`'s install hook
 * would have produced may be missing or stale: generate every time there.
 *
 * On a developer machine the client is already there from `npm install`, and on Windows a second `prisma generate`
 * fails with `EPERM: operation not permitted, rename ... query_engine-windows.dll.node` whenever any Node process
 * still holds the engine (a dev server, Prisma Studio, a test run). Regenerating it on every local build would make
 * `npm run build` fail for a reason that has nothing to do with the build, so it is skipped when the client exists.
 *
 * Force it with `PRISMA_GENERATE=1`, skip it with `PRISMA_GENERATE=0`.
 */
import { existsSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const root = process.cwd();
const clientDir = join(root, "node_modules", ".prisma", "client");
const forced = process.env.PRISMA_GENERATE;
const onCi = !!(process.env.VERCEL || process.env.CI);

const reason = forced === "1" ? "PRISMA_GENERATE=1" : !existsSync(clientDir) ? "the generated client is missing" : onCi ? "running on CI or Vercel" : null;

if (forced === "0" || !reason) {
  console.log(`prisma generate: skipped (${forced === "0" ? "PRISMA_GENERATE=0" : "the generated client is already present"})`);
  process.exit(0);
}

console.log(`prisma generate: running (${reason})`);
const res = spawnSync("npx", ["prisma", "generate"], { stdio: "inherit", shell: true });
process.exit(res.status ?? 1);
