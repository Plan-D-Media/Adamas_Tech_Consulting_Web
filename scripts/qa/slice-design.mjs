#!/usr/bin/env node
/**
 * Slice a tall design render into readable horizontal bands so each one can be opened on its own.
 *
 *   node scripts/qa/slice-design.mjs "design-ref/renders/new-design/Cloud.png" 900
 *   node scripts/qa/slice-design.mjs "design-ref/renders/new-design/Cloud.png" 900 --scale 2
 *
 * Writes <dir>/slices/<stem>/<nn>_<top>-<bottom>.png. Bands overlap by 60px so nothing is cut mid-line.
 */
import { mkdirSync, rmSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import sharp from "sharp";

const argv = process.argv.slice(2);
const src = argv[0];
const band = Number(argv[1] ?? 900);
const si = argv.indexOf("--scale");
const scale = si === -1 ? 1 : Number(argv[si + 1]);
const OVERLAP = 60;

if (!src) {
  console.error('Usage: node scripts/qa/slice-design.mjs <png> [bandHeight] [--scale n]');
  process.exit(1);
}

sharp.cache(false);
sharp.concurrency(1);

const stem = basename(src, ".png");
const out = join(dirname(src), "slices", stem);
rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });

const meta = await sharp(src).metadata();
const W = meta.width ?? 0;
const H = meta.height ?? 0;

let i = 0;
for (let top = 0; top < H; top += band) {
  const h = Math.min(band + OVERLAP, H - top);
  if (h <= 0) break;
  i += 1;
  const name = `${String(i).padStart(2, "0")}_${top}-${top + h}.png`;
  const img = sharp(src).extract({ left: 0, top, width: W, height: h });
  if (scale !== 1) img.resize({ width: Math.round(W * scale), kernel: "lanczos3" });
  await img.png({ compressionLevel: 6 }).toFile(join(out, name));
  console.log(`${join(out, name)}  ${top}..${top + h}`);
}
console.log(`\n${i} bands from ${stem} (${W}x${H})`);
