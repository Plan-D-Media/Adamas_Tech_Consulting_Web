#!/usr/bin/env node
/**
 * Crops an SVG's canvas to its artwork by rewriting the root viewBox, so a logo exported with generous whitespace
 * sits flush in the box a component gives it.
 *
 *   node scripts/tighten-svg.mjs <in.svg> <out.svg> [padPercent]
 *
 * The bounds are measured by rasterising at 4x and trimming the transparent border, then converted back to SVG user
 * units. Nothing inside the document is touched, so gradients, masks and ids keep working.
 */
import fs from "node:fs";
import sharp from "sharp";

const [input, output, padArg] = process.argv.slice(2);
if (!input || !output) {
  console.error("Usage: node scripts/tighten-svg.mjs <in.svg> <out.svg> [padPercent]");
  process.exit(1);
}
const pad = Number(padArg ?? 0);

const svg = fs.readFileSync(input, "utf8");
const vb = /viewBox\s*=\s*"([-\d.eE]+)\s+([-\d.eE]+)\s+([-\d.eE]+)\s+([-\d.eE]+)"/.exec(svg);
if (!vb) {
  console.error(`${input}: no viewBox on the root element`);
  process.exit(1);
}
const [vx, vy, vw, vh] = vb.slice(1).map(Number);

// Rasterise at 4x the viewBox width, then trim the transparent border to find the artwork.
const scale = 4;
const raster = await sharp(Buffer.from(svg), { density: 72 * scale })
  .resize({ width: Math.round(vw * scale) })
  .png()
  .toBuffer();
const { info } = await sharp(raster).trim({ threshold: 1 }).toBuffer({ resolveWithObject: true });
const full = await sharp(raster).metadata();

// sharp reports where the trimmed region starts and how big it is, both in raster pixels.
const pxPerUnitX = (full.width ?? vw * scale) / vw;
const pxPerUnitY = (full.height ?? vh * scale) / vh;
const left = (info.trimOffsetLeft ?? 0) * -1;
const top = (info.trimOffsetTop ?? 0) * -1;

let nx = vx + left / pxPerUnitX;
let ny = vy + top / pxPerUnitY;
let nw = info.width / pxPerUnitX;
let nh = info.height / pxPerUnitY;

if (pad > 0) {
  const px = (nw * pad) / 100;
  const py = (nh * pad) / 100;
  nx -= px;
  ny -= py;
  nw += px * 2;
  nh += py * 2;
}

const round = (n) => Math.round(n * 100) / 100;
const nextViewBox = `viewBox="${round(nx)} ${round(ny)} ${round(nw)} ${round(nh)}"`;

// Replace the root viewBox and drop the fixed width/height so the SVG scales to its box.
let out = svg.replace(vb[0], nextViewBox);
const rootEnd = out.indexOf(">", out.indexOf("<svg"));
const head = out.slice(0, rootEnd).replace(/\s(width|height)\s*=\s*"[^"]*"/g, "");
out = head + out.slice(rootEnd);

fs.writeFileSync(output, out);
console.log(`${input}
  viewBox ${vx} ${vy} ${vw} ${vh}  ->  ${round(nx)} ${round(ny)} ${round(nw)} ${round(nh)}   (aspect ${round(nw / nh)}:1)
  wrote ${output}`);
