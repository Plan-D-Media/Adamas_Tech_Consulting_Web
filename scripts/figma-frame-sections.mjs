#!/usr/bin/env node
/**
 * List the top-level sections of named Figma frames (Swayang, 17 November 2026).
 *
 *   node scripts/figma-frame-sections.mjs 274:1617 274:2667 274:8299
 *
 * Fetches each node at depth=2 (cheap: the section list, not the whole subtree), saves the JSON to
 * design-ref/figma/node-<id>.json and prints each direct child with its size, so frames can be
 * mapped to routes and sections. Token from FIGMA_TOKEN in .env.local; never printed.
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const FILE_KEY = "vpITDkp55Gla7w1HEP6zaL";
const OUT_DIR = join(root, "design-ref", "figma");

function readToken() {
  for (const f of [".env.local", ".env"]) {
    const p = join(root, f);
    if (!existsSync(p)) continue;
    const m = /^\s*FIGMA_TOKEN\s*=\s*(.+)\s*$/m.exec(readFileSync(p, "utf8"));
    if (m) return m[1].trim().replace(/^["']|["']$/g, "");
  }
  return process.env.FIGMA_TOKEN ?? "";
}

const token = readToken();
if (!token) {
  console.error("figma-frame-sections: FIGMA_TOKEN not found.");
  process.exit(1);
}

const ids = process.argv.slice(2).filter((a) => /^\d+[:-]\d+$/.test(a)).map((a) => a.replace("-", ":"));
if (ids.length === 0) {
  console.error("Usage: node scripts/figma-frame-sections.mjs <id> [<id> ...]");
  process.exit(1);
}

mkdirSync(OUT_DIR, { recursive: true });

const url = `https://api.figma.com/v1/files/${FILE_KEY}/nodes?ids=${encodeURIComponent(ids.join(","))}&depth=2`;
const res = await fetch(url, { headers: { "X-Figma-Token": token } });
if (!res.ok) {
  console.error(`GET nodes -> ${res.status} ${res.statusText}: ${(await res.text()).slice(0, 300)}`);
  process.exit(1);
}
const data = await res.json();

for (const id of ids) {
  const doc = data.nodes?.[id]?.document;
  if (!doc) {
    console.log(`\n=== ${id}: NOT FOUND in the file ===`);
    continue;
  }
  writeFileSync(join(OUT_DIR, `node-${id.replace(":", "-")}.json`), JSON.stringify(data.nodes[id], null, 2));
  const b = doc.absoluteBoundingBox;
  const kids = doc.children ?? [];
  console.log(`\n=== ${id}  "${doc.name}"  ${b ? Math.round(b.width) + "x" + Math.round(b.height) : "?"}  (${kids.length} sections) ===`);
  for (const [i, c] of kids.entries()) {
    const cb = c.absoluteBoundingBox;
    const h = cb ? Math.round(cb.height) : "?";
    const w = cb ? Math.round(cb.width) : "?";
    console.log(`  ${String(i + 1).padStart(2)}. ${String(w).padStart(5)} x ${String(h).padStart(5)}  ${c.id.padEnd(14)} ${c.type.padEnd(9)} ${c.name}`);
  }
}

console.log(`\nSaved node JSON to design-ref/figma/node-*.json`);
