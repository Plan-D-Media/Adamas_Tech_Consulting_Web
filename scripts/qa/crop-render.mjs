#!/usr/bin/env node
/**
 * Crop a horizontal band out of a tall Figma render so a section can be looked at on its own.
 *
 *   node scripts/qa/crop-render.mjs design-ref/renders/about-us.png 0 530 hero
 *
 * Writes design-ref/renders/crops/<name>.png (scaled to 960 wide, which is enough to read the design and small
 * enough to open quickly). Light job: one sharp call.
 */
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import sharp from "sharp";

const [src, topArg, heightArg, name = "crop"] = process.argv.slice(2);
if (!src || topArg === undefined || heightArg === undefined) {
  console.error("Usage: node scripts/qa/crop-render.mjs <png> <top> <height> [name]");
  process.exit(1);
}

const top = Number(topArg);
const height = Number(heightArg);
const out = join(dirname(src), "crops", `${name}.png`);
mkdirSync(dirname(out), { recursive: true });

const img = sharp(src);
const meta = await img.metadata();
const h = Math.min(height, (meta.height ?? 0) - top);
await img
  .extract({ left: 0, top, width: meta.width ?? 0, height: h })
  .resize({ width: 960 })
  .toFile(out);
console.log(`${out}  (source ${meta.width}x${meta.height}, band ${top}..${top + h})`);
