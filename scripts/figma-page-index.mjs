#!/usr/bin/env node
/**
 * List the top-level frames on one Figma page, with id, name and size, so the right frame can be picked
 * before fetching it at full depth.
 *
 *   node scripts/figma-page-index.mjs --file IldSD5373EYodtZ2XH17uk 7586:47704
 *
 * Writes design-ref/figma/page-index-<id>.json and prints a table. Light job: one depth=1 request.
 * Token from FIGMA_TOKEN in .env.local or .env; never printed.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const argv = process.argv.slice(2);
const fileIdx = argv.indexOf("--file");
const FILE_KEY = fileIdx >= 0 ? argv[fileIdx + 1] : "vpITDkp55Gla7w1HEP6zaL";
const nodeId = argv.filter((a, i) => !a.startsWith("--") && i !== fileIdx + 1)[0];

if (!nodeId) {
  console.error("Usage: node scripts/figma-page-index.mjs [--file <key>] <pageNodeId>");
  process.exit(1);
}

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
  console.error("FIGMA_TOKEN not found.");
  process.exit(1);
}

const id = nodeId.replace("-", ":");
const url = `https://api.figma.com/v1/files/${FILE_KEY}/nodes?ids=${encodeURIComponent(id)}&depth=1`;
const res = await fetch(url, { headers: { "X-Figma-Token": token } });
if (!res.ok) {
  console.error(`HTTP ${res.status} for node ${id} in file ${FILE_KEY}`);
  console.error(await res.text());
  process.exit(2);
}
const json = await res.json();
const doc = json.nodes?.[id]?.document;
if (!doc) {
  console.error(`Node ${id} not in the response.`);
  process.exit(3);
}

const dir = join(root, "design-ref/figma");
mkdirSync(dir, { recursive: true });
const outPath = join(dir, `page-index-${id.replace(":", "-")}.json`);
writeFileSync(outPath, JSON.stringify(json, null, 2));

const rows = (doc.children ?? []).map((c) => ({
  id: c.id,
  type: c.type,
  name: c.name,
  w: Math.round(c.absoluteBoundingBox?.width ?? 0),
  h: Math.round(c.absoluteBoundingBox?.height ?? 0),
  x: Math.round(c.absoluteBoundingBox?.x ?? 0),
  y: Math.round(c.absoluteBoundingBox?.y ?? 0),
}));

console.log(`page "${doc.name}" (${id}) in ${FILE_KEY}: ${rows.length} children\n`);
for (const r of rows) {
  console.log(`${r.id.padEnd(14)} ${String(r.w).padStart(5)}x${String(r.h).padStart(5)}  ${r.type.padEnd(9)} ${r.name}`);
}
console.log(`\n${outPath}`);
