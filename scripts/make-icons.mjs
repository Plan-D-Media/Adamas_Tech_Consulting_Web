#!/usr/bin/env node
/**
 * Generates the whole favicon / app-icon set from the brand mark (round 9).
 *
 *   node scripts/make-icons.mjs
 *
 * Source: design-src/brand/mark.svg (the circular monogram, cropped out of the full lockup by
 * scripts/tighten-svg.mjs). The full lockup is unreadable at 16px, so every icon uses the mark alone.
 *
 * Outputs, all picked up by Next's metadata file conventions
 * (node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/01-metadata/app-icons.md):
 *
 *   app/favicon.ico     16 + 32 + 48, PNG-encoded inside the ICO container, transparent
 *   app/icon.svg        the mark itself, so the tab icon stays sharp at any size
 *   app/apple-icon.png  180x180 on white - iOS composites a transparent icon onto black
 *   public/icon-192.png, public/icon-512.png   for the web app manifest (app/manifest.ts)
 *
 * The PNG icons sit on white with the mark inset, which keeps them legible as an Android adaptive icon too (the
 * mask crops to the centre ~80%).
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const MARK = path.join(root, "design-src/brand/mark.svg");
if (!fs.existsSync(MARK)) {
  console.error(`${MARK} is missing. Run scripts/tighten-svg.mjs first.`);
  process.exit(1);
}
const svg = fs.readFileSync(MARK);

/** The mark at `size`, transparent. */
async function transparent(size) {
  return sharp(svg, { density: 1200 }).resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
}

/** The mark inset on a white square, for iOS and Android launchers. */
async function onWhite(size, insetPercent = 18) {
  const inner = Math.round(size * (1 - (insetPercent * 2) / 100));
  const mark = await sharp(svg, { density: 1200 }).resize(inner, inner, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
  const offset = Math.round((size - inner) / 2);
  return sharp({ create: { width: size, height: size, channels: 4, background: "#ffffff" } })
    .composite([{ input: mark, left: offset, top: offset }])
    .png({ compressionLevel: 9 })
    .toBuffer();
}

/**
 * Minimal ICO container holding PNG images (supported by every browser since IE11).
 * Header: reserved(2)=0, type(2)=1, count(2). Then one 16-byte directory entry per image, then the PNG bytes.
 */
function ico(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);

  const entries = [];
  const payloads = [];
  let offset = 6 + images.length * 16;
  for (const { size, data } of images) {
    const e = Buffer.alloc(16);
    e.writeUInt8(size >= 256 ? 0 : size, 0); // 0 means 256
    e.writeUInt8(size >= 256 ? 0 : size, 1);
    e.writeUInt8(0, 2); // palette colours
    e.writeUInt8(0, 3); // reserved
    e.writeUInt16LE(1, 4); // colour planes
    e.writeUInt16LE(32, 6); // bits per pixel
    e.writeUInt32LE(data.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += data.length;
    entries.push(e);
    payloads.push(data);
  }
  return Buffer.concat([header, ...entries, ...payloads]);
}

const outs = [];

// favicon.ico - 16/32/48
const icoImages = [];
for (const size of [16, 32, 48]) icoImages.push({ size, data: await transparent(size) });
const icoPath = path.join(root, "app/favicon.ico");
fs.writeFileSync(icoPath, ico(icoImages));
outs.push(`app/favicon.ico        ${icoImages.map((i) => i.size).join("/")}  ${(fs.statSync(icoPath).size / 1024).toFixed(1)}KB`);

// icon.svg - the mark, already optimised by the asset pipeline into public/media/brand/mark.svg
const markOptimised = path.join(root, "public/media/brand/mark.svg");
const iconSvg = path.join(root, "app/icon.svg");
fs.copyFileSync(fs.existsSync(markOptimised) ? markOptimised : MARK, iconSvg);
outs.push(`app/icon.svg           vector  ${(fs.statSync(iconSvg).size / 1024).toFixed(1)}KB`);

// apple-icon.png - 180x180 on white
const apple = path.join(root, "app/apple-icon.png");
fs.writeFileSync(apple, await onWhite(180));
outs.push(`app/apple-icon.png     180x180 ${(fs.statSync(apple).size / 1024).toFixed(1)}KB`);

// Web app manifest icons
for (const size of [192, 512]) {
  const p = path.join(root, `public/icon-${size}.png`);
  fs.writeFileSync(p, await onWhite(size));
  outs.push(`public/icon-${size}.png   ${size}x${size} ${(fs.statSync(p).size / 1024).toFixed(1)}KB`);
}

console.log(outs.join("\n"));
