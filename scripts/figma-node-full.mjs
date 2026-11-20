#!/usr/bin/env node
/**
 * Fetch Figma nodes at FULL depth, plus their PNG renders (Swayang, 17 November 2026).
 *
 *   node scripts/figma-node-full.mjs 274:1617 274:8299 274:2667
 *   node scripts/figma-node-full.mjs 274:1617 --no-render
 *   node scripts/figma-node-full.mjs 274:1617 --scale 1
 *
 * `figma-frame-sections.mjs` fetches at depth=2, which is enough to band a frame into sections but
 * not to build from: text, fills and auto-layout live deeper. This fetches the whole subtree, one
 * request per node so a single huge frame never blocks the others, and writes:
 *
 *   design-ref/figma/full/node-<id>.json   the whole subtree
 *   design-ref/renders/<slug>.png          the frame render (2x by default)
 *
 * Light job: one HTTPS call per node plus one render download. No build, no browser.
 * Token from FIGMA_TOKEN in .env.local or .env; never printed.
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
/**
 * The approved v2 file. The November 2026 revamp lives in a second file, so the key can be overridden:
 *   node scripts/figma-node-full.mjs --file IldSD5373EYodtZ2XH17uk 8705:3814
 */
const DEFAULT_FILE_KEY = "vpITDkp55Gla7w1HEP6zaL";
const fileIdx = process.argv.indexOf("--file");
const FILE_KEY = fileIdx >= 0 ? process.argv[fileIdx + 1] : DEFAULT_FILE_KEY;
const OUT_DIR = join(root, "design-ref", "figma", "full");
const RENDER_DIR = join(root, "design-ref", "renders");

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
  console.error("figma-node-full: FIGMA_TOKEN not found in .env.local, .env or the environment.");
  process.exit(1);
}

const argv = process.argv.slice(2);
const ids = argv.filter((a) => /^\d+[:-]\d+$/.test(a)).map((a) => a.replace("-", ":"));
const render = !argv.includes("--no-render");
const scaleIdx = argv.indexOf("--scale");
const scale = scaleIdx >= 0 ? Number(argv[scaleIdx + 1]) || 2 : 2;

if (ids.length === 0) {
  console.error("Usage: node scripts/figma-node-full.mjs <id> [<id> ...] [--no-render] [--scale N]");
  process.exit(1);
}

mkdirSync(OUT_DIR, { recursive: true });
if (render) mkdirSync(RENDER_DIR, { recursive: true });

async function figma(path) {
  const res = await fetch(`https://api.figma.com/v1/${path}`, { headers: { "X-Figma-Token": token } });
  if (!res.ok) throw new Error(`GET /v1/${path} -> ${res.status} ${res.statusText}: ${(await res.text()).slice(0, 300)}`);
  return res.json();
}

const slug = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);

/** Deepest nesting level and node count, so a truncated fetch is obvious in the log. */
function stats(n, d = 0) {
  let count = 1;
  let depth = d;
  let texts = n.type === "TEXT" ? 1 : 0;
  for (const c of n.children ?? []) {
    const s = stats(c, d + 1);
    count += s.count;
    texts += s.texts;
    depth = Math.max(depth, s.depth);
  }
  return { count, depth, texts };
}

for (const id of ids) {
  console.log(`\n=== ${id} ===`);
  let data;
  try {
    data = await figma(`files/${FILE_KEY}/nodes?ids=${encodeURIComponent(id)}`);
  } catch (err) {
    console.error(`  FAILED: ${err.message}`);
    process.exitCode = 1;
    continue;
  }
  const entry = data.nodes?.[id];
  const doc = entry?.document;
  if (!doc) {
    console.error(`  NOT FOUND in the file.`);
    process.exitCode = 1;
    continue;
  }

  const file = join(OUT_DIR, `node-${id.replace(":", "-")}.json`);
  const json = JSON.stringify(entry, null, 2);
  writeFileSync(file, json);
  const b = doc.absoluteBoundingBox;
  const s = stats(doc);
  console.log(`  "${doc.name}"  ${b ? Math.round(b.width) + "x" + Math.round(b.height) : "?"}`);
  console.log(`  nodes ${s.count}, max depth ${s.depth}, text nodes ${s.texts}, ${(json.length / 1048576).toFixed(1)} MB`);
  console.log(`  saved design-ref/figma/full/node-${id.replace(":", "-")}.json`);

  if (!render) continue;
  try {
    const imgs = await figma(`images/${FILE_KEY}?ids=${encodeURIComponent(id)}&format=png&scale=${scale}`);
    const url = imgs.images?.[id];
    if (!url) {
      console.log(`  render: no URL returned (the frame may be too tall for ${scale}x)`);
      continue;
    }
    const res = await fetch(url);
    if (!res.ok) {
      console.log(`  render: download ${res.status}`);
      continue;
    }
    const png = join(RENDER_DIR, `${slug(doc.name)}.png`);
    writeFileSync(png, Buffer.from(await res.arrayBuffer()));
    console.log(`  saved design-ref/renders/${slug(doc.name)}.png (${scale}x)`);
  } catch (err) {
    console.log(`  render FAILED: ${err.message}`);
  }
}

console.log("\nDone.");
