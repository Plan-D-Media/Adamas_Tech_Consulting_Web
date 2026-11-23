#!/usr/bin/env node
/**
 * Rasterise the finalised design SVGs (design-ref/exports/new-design) to PNG for comparison and for
 * transcribing outlined copy.
 *
 *   node scripts/qa/render-new-design.mjs            # all four page SVGs at 1x (native 1440)
 *   node scripts/qa/render-new-design.mjs --scale 2  # 2x, for reading small type
 *   node scripts/qa/render-new-design.mjs "Cloud.svg"
 *
 * Writes design-ref/renders/new-design/<name>[@2x].png. One file at a time: these are 1440 x 4000-8500
 * frames with 24-40 embedded bitmaps each, so the peak is a few hundred MB per image.
 */
import { mkdirSync, readFileSync, readdirSync } from "node:fs";
import { basename, join } from "node:path";
import sharp from "sharp";

const SRC = "design-ref/exports/new-design";
const OUT = "design-ref/renders/new-design";

const argv = process.argv.slice(2);
const scaleIdx = argv.indexOf("--scale");
const scale = scaleIdx === -1 ? 1 : Number(argv[scaleIdx + 1]);
const names = argv.filter((a, i) => !a.startsWith("--") && i !== scaleIdx + 1);

const PAGES = [
  "Cloud.svg",
  "Managed Services.svg",
  "Case Study_SAP_Cement industry.svg",
  "Case Study_Kubernetes.svg",
];

const targets = names.length
  ? names
  : readdirSync(SRC).filter((f) => PAGES.includes(f));

mkdirSync(OUT, { recursive: true });
sharp.cache(false);
sharp.concurrency(1);

for (const file of targets) {
  const src = join(SRC, file);
  const stem = basename(file, ".svg");
  const out = join(OUT, `${stem}${scale === 1 ? "" : `@${scale}x`}.png`);
  const buf = readFileSync(src);
  // The frames carry an explicit px width, so density 72 renders 1:1; scale by density to keep vectors sharp.
  const img = sharp(buf, { density: 72 * scale, limitInputPixels: false, unlimited: true });
  const info = await img.png({ compressionLevel: 6 }).toFile(out);
  console.log(`${out}  ${info.width}x${info.height}  ${(info.size / 1e6).toFixed(1)} MB`);
}
