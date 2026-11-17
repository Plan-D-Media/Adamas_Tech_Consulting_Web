#!/usr/bin/env node
/**
 * Config-time import gate (Swayang, 17 November 2026).
 *
 * `next.config.ts` and everything it pulls in are loaded outside the webpack/turbopack graph, so the
 * tsconfig `paths` aliases ("@/lib/consent") are NOT resolved there: the loader reads the specifier
 * literally and looks for `lib/lib/consent`. `tsc --noEmit` and `eslint` both pass on such a file,
 * because the alias is valid TypeScript -- only loading the config actually fails. That is the bug
 * this script exists to catch.
 *
 * Two passes:
 *   1. Static walk of the import graph from next.config.ts, following relative specifiers. Any
 *      tsconfig-alias import anywhere in that graph fails with the exact file and specifier.
 *   2. A real config load through Next's own loader (`next/dist/server/config`, the same entry point
 *      `next build` and `next dev` use), which is the authoritative check.
 *
 * Run it before reporting any change to next.config.ts or one of its dependencies as done:
 *
 *   npm run check:config
 *
 * Cheap and single-process: no build, no server, no memory floor needed.
 */

import { existsSync, readFileSync, statSync } from "node:fs";
import { dirname, isAbsolute, join, relative, resolve } from "node:path";
import { createRequire } from "node:module";

const root = process.cwd();
const ENTRY = "next.config.ts";

/* ------------------------------------------------------------------ helpers */

const tsconfig = JSON.parse(readFileSync(join(root, "tsconfig.json"), "utf8"));
/** Alias prefixes from tsconfig `paths`, e.g. ["@/"] for `"@/*": ["./*"]`. */
const aliasPrefixes = Object.keys(tsconfig?.compilerOptions?.paths ?? {}).map((k) => k.replace(/\*$/, ""));

const EXTS = [".ts", ".tsx", ".mts", ".cts", ".js", ".jsx", ".mjs", ".cjs", ".json"];

function resolveFile(spec, fromFile) {
  const base = resolve(dirname(fromFile), spec);
  const candidates = [base, ...EXTS.map((e) => base + e), ...EXTS.map((e) => join(base, "index" + e))];
  for (const c of candidates) {
    if (existsSync(c) && statSync(c).isFile()) return c;
  }
  return null;
}

/**
 * Import/export/require specifiers in a source file. Deliberately a regex scan rather than a parser:
 * this gate must run with zero extra dependencies and the only thing it needs is the specifier text.
 * Line comments and block comments are stripped first so a commented-out import cannot fail the gate.
 */
function specifiers(src) {
  const code = src
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/(^|[^:\\])\/\/[^\n]*/g, "$1");
  const out = [];
  const patterns = [
    // import ... from "x" / export ... from "x" / import "x"
    /\b(?:import|export)\b[^;'"`]*?\bfrom\s*['"]([^'"]+)['"]/g,
    /\bimport\s*['"]([^'"]+)['"]/g,
    // import("x"), require("x")
    /\b(?:import|require)\s*\(\s*['"]([^'"]+)['"]\s*\)/g,
  ];
  for (const re of patterns) {
    let m;
    while ((m = re.exec(code)) !== null) out.push(m[1]);
  }
  return [...new Set(out)];
}

const rel = (p) => relative(root, p).split("\\").join("/");

/* ----------------------------------------------------------- pass 1: static */

const entry = join(root, ENTRY);
if (!existsSync(entry)) {
  console.error(`check-config-load: ${ENTRY} not found in ${root}`);
  process.exit(1);
}

const visited = new Set();
const graph = [];
const problems = [];
const unresolved = [];

/** @param {string} file @param {string[]} trail */
function walk(file, trail) {
  if (visited.has(file)) return;
  visited.add(file);
  graph.push({ file, depth: trail.length });

  let src;
  try {
    src = readFileSync(file, "utf8");
  } catch (err) {
    unresolved.push({ from: file, spec: "(unreadable)", reason: String(err) });
    return;
  }

  for (const spec of specifiers(src)) {
    const aliased = aliasPrefixes.find((p) => spec.startsWith(p));
    if (aliased) {
      problems.push({ file, spec, trail });
      continue;
    }
    if (spec.startsWith(".")) {
      const target = resolveFile(spec, file);
      if (!target) {
        unresolved.push({ from: file, spec });
        continue;
      }
      walk(target, [...trail, file]);
      continue;
    }
    if (isAbsolute(spec)) {
      problems.push({ file, spec, trail, absolute: true });
    }
    // Bare specifiers (node:fs, next, react, ...) resolve through node_modules and are fine.
  }
}

walk(entry, []);

console.log(`Config-time import graph (${graph.length} file${graph.length === 1 ? "" : "s"}):`);
for (const { file, depth } of graph) {
  console.log(`  ${"  ".repeat(depth)}${depth === 0 ? "" : "-> "}${rel(file)}`);
}

let failed = false;

if (problems.length > 0) {
  failed = true;
  console.error(`\nFAIL: ${problems.length} alias import(s) in the config-time graph.`);
  console.error("These pass tsc and eslint but break `next build`/`next dev`, which load the config");
  console.error("outside the bundler and do not resolve tsconfig `paths`. Use a relative path.\n");
  for (const p of problems) {
    console.error(`  ${rel(p.file)}`);
    console.error(`    ${p.absolute ? "absolute" : "alias"} import: "${p.spec}"`);
    if (p.trail.length > 0) {
      console.error(`    reached from: ${p.trail.map(rel).join(" -> ")}`);
    }
  }
}

if (unresolved.length > 0) {
  failed = true;
  console.error(`\nFAIL: ${unresolved.length} relative import(s) that do not resolve to a file.`);
  for (const u of unresolved) {
    console.error(`  ${rel(u.from)}: "${u.spec}"${u.reason ? ` (${u.reason})` : ""}`);
  }
}

if (!failed) {
  console.log("\nPASS (static): every specifier in the graph is relative or a bare package.");
}

/* ------------------------------------------------- pass 2: real config load */

console.log("\nLoading next.config.ts through Next's own loader...");

let loadFailed = false;
try {
  // Load it the way Next itself does, with require: the CJS interop here is double-wrapped
  // (`exports.default.default`), so unwrap until a function falls out.
  const req = createRequire(import.meta.url);
  let loadConfig = req("next/dist/server/config");
  while (loadConfig && typeof loadConfig !== "function" && "default" in loadConfig) loadConfig = loadConfig.default;
  if (typeof loadConfig !== "function") throw new TypeError("next/dist/server/config did not export a loader");
  const { PHASE_PRODUCTION_BUILD } = req("next/dist/shared/lib/constants");
  const config = await loadConfig(PHASE_PRODUCTION_BUILD, root);
  const headers = typeof config.headers === "function" ? await config.headers() : [];
  const headerCount = Array.isArray(headers) ? headers.reduce((n, h) => n + (h.headers?.length ?? 0), 0) : 0;
  console.log(
    `PASS (load): config loaded. headers() -> ${Array.isArray(headers) ? headers.length : 0} rule(s), ` +
      `${headerCount} header(s); images.remotePatterns -> ${config.images?.remotePatterns?.length ?? 0}.`
  );
} catch (err) {
  loadFailed = true;
  console.error("FAIL (load): Next could not load next.config.ts.\n");
  console.error(err?.stack ?? String(err));
}

process.exit(failed || loadFailed ? 1 : 0);
