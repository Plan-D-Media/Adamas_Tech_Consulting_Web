#!/usr/bin/env node
/**
 * Pull the bitmaps embedded in a design SVG out into real files, with the geometry of the <use>/<image> that
 * places each one, so a band of the render can be matched to the file that draws it.
 *
 *   node scripts/extract-svg-images.mjs "design-ref/exports/new-design/Cloud.svg"
 *   node scripts/extract-svg-images.mjs "design-ref/exports/new-design/Cloud.svg" --out design-src/cloud-final
 *
 * Figma's SVG export puts each bitmap in <defs> as <image id="imageN" .../> and draws it with
 * <use xlink:href="#imageN" transform="matrix(...)"/> inside a clipped <pattern> or <g>, so the placement is read
 * from the pattern/use rather than from the <image> itself. Where that cannot be resolved the file is still
 * written; the printed index gives its id and natural size.
 *
 * Light job: one read plus one decode per bitmap.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, join } from "node:path";
import sharp from "sharp";

const argv = process.argv.slice(2);
const src = argv[0];
const oi = argv.indexOf("--out");
if (!src) {
  console.error('Usage: node scripts/extract-svg-images.mjs <svg> [--out <dir>]');
  process.exit(1);
}
const stem = basename(src, ".svg").replace(/[^\w]+/g, "-").toLowerCase();
const out = oi === -1 ? join("design-ref/exports/new-design/images", stem) : argv[oi + 1];
mkdirSync(out, { recursive: true });

const svg = readFileSync(src, "utf8");

// <image id="image0_1_2" width="800" height="600" xlink:href="data:image/png;base64,...."/>
const RE = /<image\b([^>]*?)(?:xlink:)?href="data:image\/(png|jpe?g|webp);base64,([^"]+)"([^>]*)\/?>/g;
const attr = (s, name) => {
  const m = new RegExp(`${name}="([^"]*)"`).exec(s);
  return m ? m[1] : null;
};

const rows = [];
let m;
let i = 0;
while ((m = RE.exec(svg))) {
  const [, pre, type, b64, post] = m;
  const head = `${pre} ${post}`;
  const id = attr(head, "id") ?? `image${i}`;
  i += 1;
  const buf = Buffer.from(b64.replace(/\s/g, ""), "base64");
  const meta = await sharp(buf).metadata();
  const ext = type === "jpeg" || type === "jpg" ? "jpg" : type;
  const name = `${String(i).padStart(2, "0")}_${id}.${ext}`;
  writeFileSync(join(out, name), buf);
  rows.push({ name, id, w: meta.width, h: meta.height, kb: Math.round(buf.length / 1024) });
}

console.log(`${src}\n${rows.length} bitmaps -> ${out}\n`);
for (const r of rows) {
  console.log(`${r.name.padEnd(34)} ${String(r.w).padStart(5)}x${String(r.h).padStart(5)}  ${String(r.kb).padStart(5)} KB`);
}
