#!/usr/bin/env node
/**
 * Figma fetch for the inner pages (Swayang, 17 November 2026).
 *
 * Reads the new frames the designer added under node 328:2099, saves the node JSON to
 * design-ref/figma/ and reports every frame with its size, so the frames can be mapped to routes.
 * Also re-fetches the file at depth=2 and compares the file version / lastModified against the
 * stored design-ref/figma/file-depth2.json, so a change to the already-approved Home Page, Mega Menu
 * or Cloud Services frames is reported rather than silently picked up.
 *
 *   node scripts/figma-inner-pages.mjs            # fetch + report
 *   node scripts/figma-inner-pages.mjs --renders  # also queue PNG render URLs for the new frames
 *
 * The token comes from FIGMA_TOKEN in .env.local and is never printed.
 * Light job: two or three HTTPS calls, no build, no browser.
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const FILE_KEY = "vpITDkp55Gla7w1HEP6zaL";
const START_NODE = "328:2099";
const OUT_DIR = join(root, "design-ref", "figma");
const RENDER_DIR = join(root, "design-ref", "renders");

/* ------------------------------------------------------------------- token */

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
  console.error("figma-inner-pages: FIGMA_TOKEN not found in .env.local, .env or the environment.");
  process.exit(1);
}

async function figma(path) {
  const url = `https://api.figma.com/v1/${path}`;
  const res = await fetch(url, { headers: { "X-Figma-Token": token } });
  if (!res.ok) {
    throw new Error(`GET /v1/${path} -> ${res.status} ${res.statusText}: ${(await res.text()).slice(0, 300)}`);
  }
  return res.json();
}

mkdirSync(OUT_DIR, { recursive: true });

/* ------------------------------------------- 1. file at depth 2 + drift check */

console.log("Fetching file at depth=2 ...");
const depth2 = await figma(`files/${FILE_KEY}?depth=2`);
writeFileSync(join(OUT_DIR, "file-depth2-latest.json"), JSON.stringify(depth2, null, 2));

console.log(`\nFile: ${depth2.name}`);
console.log(`  lastModified : ${depth2.lastModified}`);
console.log(`  version      : ${depth2.version}`);

const prevPath = join(OUT_DIR, "file-depth2.json");
let prev = null;
if (existsSync(prevPath)) {
  prev = JSON.parse(readFileSync(prevPath, "utf8"));
  console.log(`\nStored fetch (design-ref/figma/file-depth2.json):`);
  console.log(`  lastModified : ${prev.lastModified}`);
  console.log(`  version      : ${prev.version}`);
  console.log(
    depth2.version === prev.version
      ? "  -> UNCHANGED: the file has not been touched since the last fetch."
      : "  -> CHANGED: the file has been edited since the last fetch (expected: the new inner pages)."
  );
}

/** name -> {id, page, w, h, childCount} for every top-level frame, from a depth=2 document. */
function topLevelFrames(doc) {
  const out = [];
  for (const page of doc.children ?? []) {
    for (const node of page.children ?? []) {
      const b = node.absoluteBoundingBox;
      out.push({
        page: page.name,
        pageId: page.id,
        id: node.id,
        name: node.name,
        type: node.type,
        w: b ? Math.round(b.width) : null,
        h: b ? Math.round(b.height) : null,
      });
    }
  }
  return out;
}

const framesNow = topLevelFrames(depth2.document);
const pages = [...new Set(framesNow.map((f) => f.page))];

console.log(`\nPages in the file (${pages.length}):`);
for (const p of pages) {
  const n = framesNow.filter((f) => f.page === p).length;
  console.log(`  ${p} -- ${n} top-level frame(s)`);
}

/* --------------------------------- 2. drift on the already-approved frames */

const APPROVED = /home\s*page|mega\s*menu|cloud\s*service/i;
if (prev) {
  const before = new Map(topLevelFrames(prev.document).map((f) => [f.id, f]));
  const touched = [];
  for (const f of framesNow) {
    if (!APPROVED.test(f.name)) continue;
    const b = before.get(f.id);
    if (!b) {
      touched.push(`ADDED   ${f.page} / ${f.name} (${f.id}) ${f.w}x${f.h}`);
    } else if (b.name !== f.name || b.w !== f.w || b.h !== f.h) {
      touched.push(`CHANGED ${f.page} / ${b.name} (${f.id}) ${b.w}x${b.h} -> ${f.name} ${f.w}x${f.h}`);
    }
  }
  for (const [id, b] of before) {
    if (APPROVED.test(b.name) && !framesNow.some((f) => f.id === id)) {
      touched.push(`REMOVED ${b.page} / ${b.name} (${id})`);
    }
  }
  console.log(`\nApproved frames (Home Page / Mega Menu / Cloud Services) drift check:`);
  if (touched.length === 0) {
    console.log("  none added, renamed, resized or removed at top level.");
    console.log("  (Top-level geometry only; a change inside a frame needs the per-node compare.)");
  } else {
    for (const t of touched) console.log(`  ${t}`);
    console.log("  -> ASK BEFORE APPLYING any of the above.");
  }
}

/* ------------------------------------------------- 3. the new node subtree */

console.log(`\nFetching node ${START_NODE} ...`);
const nodeDoc = await figma(`files/${FILE_KEY}/nodes?ids=${encodeURIComponent(START_NODE)}`);
writeFileSync(join(OUT_DIR, "inner-pages.json"), JSON.stringify(nodeDoc, null, 2));

const startNode = nodeDoc.nodes?.[START_NODE]?.document;
if (!startNode) {
  console.error(`figma-inner-pages: node ${START_NODE} not present in the response.`);
  process.exit(1);
}

console.log(`\nStart node: "${startNode.name}" (${startNode.type}, ${startNode.id})`);

/** The page that holds the start node, and every top-level frame on it. */
const startPage = framesNow.find((f) => f.id === START_NODE);
if (startPage) {
  const siblings = framesNow.filter((f) => f.page === startPage.page);
  console.log(`\nFrames on page "${startPage.page}" (${siblings.length}):`);
  for (const f of siblings) {
    const mark = f.id === START_NODE ? " <= start node" : "";
    console.log(`  ${String(f.w).padStart(5)} x ${String(f.h).padStart(5)}  ${f.id.padEnd(12)} ${f.name}${mark}`);
  }
} else {
  console.log(`\n(Node ${START_NODE} is not a top-level frame; it sits inside one.)`);
}

/** Frames directly under the start node, which is where the per-page designs live. */
const IGNORE = /hcltech|about our company/i;
const children = (startNode.children ?? []).map((c) => {
  const b = c.absoluteBoundingBox;
  return {
    id: c.id,
    name: c.name,
    type: c.type,
    w: b ? Math.round(b.width) : null,
    h: b ? Math.round(b.height) : null,
    ignored: IGNORE.test(c.name),
  };
});

console.log(`\nFrames under ${START_NODE} (${children.length}):`);
for (const c of children) {
  const mark = c.ignored ? "  [IGNORED: HCLTech reference layer]" : "";
  console.log(`  ${String(c.w).padStart(5)} x ${String(c.h).padStart(5)}  ${c.id.padEnd(14)} ${c.type.padEnd(8)} ${c.name}${mark}`);
}

const usable = children.filter((c) => !c.ignored);
writeFileSync(
  join(OUT_DIR, "inner-pages-frames.json"),
  JSON.stringify({ fileKey: FILE_KEY, startNode: START_NODE, version: depth2.version, lastModified: depth2.lastModified, frames: children }, null, 2)
);

console.log(`\nSaved:`);
console.log(`  design-ref/figma/file-depth2-latest.json`);
console.log(`  design-ref/figma/inner-pages.json`);
console.log(`  design-ref/figma/inner-pages-frames.json  (${usable.length} usable frame(s))`);

/* ------------------------------------------------------- 4. optional renders */

if (process.argv.includes("--renders")) {
  mkdirSync(RENDER_DIR, { recursive: true });
  const ids = usable.map((c) => c.id);
  if (ids.length === 0) {
    console.log("\nNo usable frames to render.");
  } else {
    console.log(`\nRequesting PNG renders for ${ids.length} frame(s) at 2x ...`);
    const imgs = await figma(`images/${FILE_KEY}?ids=${encodeURIComponent(ids.join(","))}&format=png&scale=2`);
    writeFileSync(join(OUT_DIR, "inner-pages-renders.json"), JSON.stringify(imgs, null, 2));
    const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);
    for (const c of usable) {
      const url = imgs.images?.[c.id];
      if (!url) {
        console.log(`  SKIP ${c.name}: no render URL returned`);
        continue;
      }
      const res = await fetch(url);
      if (!res.ok) {
        console.log(`  SKIP ${c.name}: download ${res.status}`);
        continue;
      }
      const file = join(RENDER_DIR, `${slug(c.name)}.png`);
      writeFileSync(file, Buffer.from(await res.arrayBuffer()));
      console.log(`  saved design-ref/renders/${slug(c.name)}.png`);
    }
  }
}

console.log("\nDone.");
