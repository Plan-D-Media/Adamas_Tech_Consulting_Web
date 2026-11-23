#!/usr/bin/env node
/**
 * Fetch several Figma nodes at full depth with a gap between calls, for when
 * scripts/figma-node-full.mjs trips the API's rate limit (429).
 *
 *   node scripts/qa/figma-fetch-slow.mjs --file <key> --gap 20000 8185:796 8185:1473
 *
 * Writes design-ref/figma/full/node-<id>.json, the same shape figma-band.mjs reads.
 * Token from .env.local or .env; never printed.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const argv = process.argv.slice(2);
const val = (f, d) => { const i = argv.indexOf(f); return i === -1 ? d : argv[i + 1]; };
const FILE = val("--file", "vpITDkp55Gla7w1HEP6zaL");
const GAP = Number(val("--gap", 20000));
const ids = argv.filter((a, i) => !a.startsWith("--") && argv[i - 1] !== "--file" && argv[i - 1] !== "--gap");

function token() {
  for (const f of [".env.local", ".env"]) {
    if (!existsSync(f)) continue;
    const m = /^\s*FIGMA_TOKEN\s*=\s*(.+)\s*$/m.exec(readFileSync(f, "utf8"));
    if (m) return m[1].trim().replace(/^["']|["']$/g, "");
  }
  return process.env.FIGMA_TOKEN ?? "";
}
const T = token();
mkdirSync("design-ref/figma/full", { recursive: true });
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

for (const raw of ids) {
  const id = raw.replace("-", ":");
  const out = join("design-ref/figma/full", `node-${id.replace(":", "-")}.json`);
  if (existsSync(out)) { console.log(`skip ${id} (already saved)`); continue; }
  for (let attempt = 1; attempt <= 4; attempt += 1) {
    const res = await fetch(`https://api.figma.com/v1/files/${FILE}/nodes?ids=${encodeURIComponent(id)}`, {
      headers: { "X-Figma-Token": T },
    });
    if (res.ok) {
      writeFileSync(out, JSON.stringify(await res.json()));
      console.log(`ok   ${id} -> ${out}`);
      break;
    }
    console.log(`     ${id} attempt ${attempt}: HTTP ${res.status}`);
    await wait(GAP * attempt);
  }
  await wait(GAP);
}
console.log("done");
