#!/usr/bin/env node
/**
 * Runs a heavy command (tsc, playwright, seed) only when no other agent is running one.
 * This machine is memory-constrained and the user's dev server must never be starved.
 * Usage: node scripts/with-lock.mjs <command> [args...]
 */
import { mkdirSync, rmdirSync, statSync } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";

const LOCK = path.resolve(".heavy.lock");
const STALE_MS = 15 * 60 * 1000;
const wait = (ms) => Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);

for (;;) {
  try {
    mkdirSync(LOCK);
    break;
  } catch {
    try {
      if (Date.now() - statSync(LOCK).mtimeMs > STALE_MS) rmdirSync(LOCK);
    } catch {}
    wait(3000);
  }
}
let code = 1;
try {
  const [cmd, ...args] = process.argv.slice(2);
  const r = spawnSync(cmd, args, { stdio: "inherit", shell: true });
  code = r.status ?? 1;
} finally {
  try {
    rmdirSync(LOCK);
  } catch {}
}
process.exit(code);
