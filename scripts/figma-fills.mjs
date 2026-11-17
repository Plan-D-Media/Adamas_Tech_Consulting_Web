#!/usr/bin/env node
/**
 * Download Figma image fills into design-ref/fills/<imageRef>.png, the sources scripts/assets.manifest.json reads.
 *
 *   node scripts/figma-fills.mjs <imageRef> [<imageRef> ...]
 *   node scripts/figma-fills.mjs --refresh <imageRef>   # re-fetch the file's image-fill URLs first (they expire)
 *
 * The imageRef of a node is `fills[].imageRef` in the node JSON (design-ref/figma/full/…); the ref → URL map comes
 * from GET /v1/files/:key/images, cached in design-ref/figma/image-fills.json. Light job: one or two HTTPS calls
 * plus one download per ref. Token from FIGMA_TOKEN in .env.local; never printed.
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const FILE_KEY = "vpITDkp55Gla7w1HEP6zaL";
const FILLS_DIR = join(root, "design-ref", "fills");
const INDEX = join(root, "design-ref", "figma", "image-fills.json");

function readToken() {
  for (const f of [".env.local", ".env"]) {
    const p = join(root, f);
    if (!existsSync(p)) continue;
    const m = /^\s*FIGMA_TOKEN\s*=\s*(.+)\s*$/m.exec(readFileSync(p, "utf8"));
    if (m) return m[1].trim().replace(/^["']|["']$/g, "");
  }
  return process.env.FIGMA_TOKEN ?? "";
}

const argv = process.argv.slice(2);
const refresh = argv.includes("--refresh");
const refs = argv.filter((a) => /^[0-9a-f]{40}$/i.test(a));
if (refs.length === 0) {
  console.error("Usage: node scripts/figma-fills.mjs [--refresh] <imageRef> [<imageRef> ...]");
  process.exit(1);
}

mkdirSync(FILLS_DIR, { recursive: true });

async function loadIndex(force) {
  if (!force && existsSync(INDEX)) {
    const j = JSON.parse(readFileSync(INDEX, "utf8"));
    const map = j.meta?.images ?? j.images;
    if (map) return map;
  }
  const token = readToken();
  if (!token) {
    console.error("figma-fills: FIGMA_TOKEN not found in .env.local, .env or the environment.");
    process.exit(1);
  }
  const res = await fetch(`https://api.figma.com/v1/files/${FILE_KEY}/images`, { headers: { "X-Figma-Token": token } });
  if (!res.ok) {
    console.error(`GET images -> ${res.status} ${res.statusText}`);
    process.exit(1);
  }
  const j = await res.json();
  writeFileSync(INDEX, JSON.stringify(j, null, 2));
  console.log(`refreshed design-ref/figma/image-fills.json (${Object.keys(j.meta?.images ?? j.images ?? {}).length} fills)`);
  return j.meta?.images ?? j.images;
}

let map = await loadIndex(refresh);

for (const ref of refs) {
  const out = join(FILLS_DIR, `${ref}.png`);
  let url = map[ref];
  if (!url) {
    console.log(`${ref}: not in the cached index, refreshing ...`);
    map = await loadIndex(true);
    url = map[ref];
  }
  if (!url) {
    console.log(`${ref}: FAILED - no URL for this ref in the file`);
    process.exitCode = 1;
    continue;
  }
  let res = await fetch(url);
  if (res.status === 403) {
    // The S3 links in the cached index expire; one refresh gives fresh ones.
    map = await loadIndex(true);
    res = await fetch(map[ref]);
  }
  if (!res.ok) {
    console.log(`${ref}: FAILED - download ${res.status}`);
    process.exitCode = 1;
    continue;
  }
  const buf = Buffer.from(await res.arrayBuffer());
  writeFileSync(out, buf);
  console.log(`${ref}: saved design-ref/fills/${ref}.png (${(buf.length / 1024).toFixed(0)} KB)`);
}
