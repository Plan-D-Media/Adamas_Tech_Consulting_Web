/**
 * Processes the designer's exports into web assets under public/media/ (served through MEDIA_BASE_URL).
 * Sources (never edited): design-src/ (SVG exports) and design-ref/ (Figma image fills and node exports).
 * Driven by scripts/assets.manifest.json; every output is listed in docs/asset-manifest.md.
 *
 * Usage: node scripts/process-assets.mjs [--only <id>]
 *
 * Entry kinds:
 *   raster  : a PNG/JPEG/WebP source (or an SVG that wraps a base64 raster) -> AVIF + WebP at 1x and 2x of `width`
 *   vector  : a true SVG -> optimised with SVGO, written as .svg (icons that are used as <img>, e.g. flags)
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { optimize } from "svgo";

const root = process.cwd();
const manifest = JSON.parse(fs.readFileSync(path.join(root, "scripts/assets.manifest.json"), "utf8"));
const only = process.argv.includes("--only") ? process.argv[process.argv.indexOf("--only") + 1] : null;
const outRoot = path.join(root, "public/media");

/** Returns a raster buffer from a file: PNG/JPEG/WebP as-is, or the base64 image embedded in an SVG wrapper. */
function rasterFrom(file) {
  const buf = fs.readFileSync(file);
  if (!file.toLowerCase().endsWith(".svg")) return buf;
  const svg = buf.toString("utf8");
  const m = svg.match(/data:image\/(png|jpe?g|webp);base64,([A-Za-z0-9+/=\s]+)/);
  if (!m) throw new Error(`${file}: no embedded raster found`);
  return Buffer.from(m[2].replace(/\s/g, ""), "base64");
}

async function processRaster(entry) {
  const src = rasterFrom(path.join(root, entry.src));
  const meta = await sharp(src).metadata();
  const results = [];
  for (const scale of entry.scales ?? [1, 2]) {
    const width = Math.round(entry.width * scale);
    if (width > meta.width * 1.05) {
      results.push(`skip ${scale}x (source ${meta.width}px < ${width}px)`);
      continue;
    }
    const height = entry.height ? Math.round(entry.height * scale) : undefined;
    const base = sharp(src).resize({ width, height, fit: entry.fit ?? "cover", position: entry.position ?? "centre", withoutEnlargement: true });
    const suffix = scale === 1 ? "" : `@${scale}x`;
    const outBase = path.join(outRoot, `${entry.out}${suffix}`);
    fs.mkdirSync(path.dirname(outBase), { recursive: true });
    await base.clone().avif({ quality: entry.avifQuality ?? 55 }).toFile(`${outBase}.avif`);
    await base.clone().webp({ quality: entry.webpQuality ?? 80 }).toFile(`${outBase}.webp`);
    const a = fs.statSync(`${outBase}.avif`).size;
    const w = fs.statSync(`${outBase}.webp`).size;
    results.push(`${scale}x ${width}${height ? "x" + height : ""} avif ${(a / 1024).toFixed(0)}KB webp ${(w / 1024).toFixed(0)}KB`);
  }
  if (entry.blur) {
    const b = await sharp(src).resize({ width: 16 }).webp({ quality: 40 }).toBuffer();
    results.push(`blur data:image/webp;base64,${b.toString("base64").slice(0, 24)}...`);
    fs.writeFileSync(path.join(outRoot, `${entry.out}.blur.txt`), `data:image/webp;base64,${b.toString("base64")}`);
  }
  return `${entry.id}: source ${meta.width}x${meta.height} ${meta.format} -> ${results.join("; ")}`;
}

function processVector(entry) {
  const svg = fs.readFileSync(path.join(root, entry.src), "utf8");
  const { data } = optimize(svg, {
    multipass: true,
    plugins: ["preset-default", "removeDimensions"],
  });
  const out = path.join(outRoot, `${entry.out}.svg`);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, data);
  return `${entry.id}: svg ${svg.length} -> ${data.length} bytes`;
}

for (const entry of manifest.assets) {
  if (only && entry.id !== only) continue;
  try {
    console.log(entry.kind === "vector" ? processVector(entry) : await processRaster(entry));
  } catch (e) {
    console.error(`${entry.id}: FAILED ${e.message}`);
    process.exitCode = 1;
  }
}
