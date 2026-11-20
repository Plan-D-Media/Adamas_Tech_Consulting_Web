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
 * Optional on rasters: "crop": [left, top, width, height] as fractions of the source (Figma STRETCH fills: the
 * imageTransform [[a,0,tx],[0,d,ty]] maps to [tx, ty, a, d]), applied before the resize; "fit" (sharp fit, default
 * "cover"; use "fill" with a crop so the cropped region stretches exactly like Figma's box); "enlarge": true lets a
 * source smaller than the target scale up (Figma stretches the hero backdrop beyond its pixel size).
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { optimize } from "svgo";

const root = process.cwd();
const manifest = JSON.parse(fs.readFileSync(path.join(root, "scripts/assets.manifest.json"), "utf8"));
const only = process.argv.includes("--only") ? process.argv[process.argv.indexOf("--only") + 1] : null;
const outRoot = path.join(root, "public/media");

/**
 * Returns a raster buffer from a file: PNG/JPEG/WebP as-is, the base64 image embedded in an SVG wrapper, or a
 * rasterisation of a true vector at `width` px (used for the brand logos, which are real SVGs).
 */
async function rasterFrom(file, width = 2048) {
  const buf = fs.readFileSync(file);
  if (!file.toLowerCase().endsWith(".svg")) return buf;
  const svg = buf.toString("utf8");
  const m = svg.match(/data:image\/(png|jpe?g|webp);base64,([A-Za-z0-9+/=\s]+)/);
  if (m) return Buffer.from(m[2].replace(/\s/g, ""), "base64");
  // A true vector (the brand logos): rasterise it, large enough for the biggest scale the entry asks for. The
  // designer's other SVGs are raster wrappers, which is why the embedded-image path comes first.
  const target = Math.max(1, Math.round(width * 2));
  return await sharp(buf, { density: 600 }).resize({ width: target }).png().toBuffer();
}

async function processRaster(entry) {
  const maxScale = Math.max(...(entry.scales ?? [1, 2]));
  let src = await rasterFrom(path.join(root, entry.src), entry.width * maxScale);
  let meta = await sharp(src).metadata();
  if (entry.crop) {
    const [l, t, w, h] = entry.crop;
    const region = {
      left: Math.max(0, Math.round(l * meta.width)),
      top: Math.max(0, Math.round(t * meta.height)),
      width: Math.min(meta.width, Math.round(w * meta.width)),
      height: Math.min(meta.height, Math.round(h * meta.height)),
    };
    region.width = Math.min(region.width, meta.width - region.left);
    region.height = Math.min(region.height, meta.height - region.top);
    src = await sharp(src).extract(region).png().toBuffer();
    meta = await sharp(src).metadata();
  }
  const results = [];
  for (const scale of entry.scales ?? [1, 2]) {
    const width = Math.round(entry.width * scale);
    if (!entry.enlarge && width > meta.width * 1.05) {
      results.push(`skip ${scale}x (source ${meta.width}px < ${width}px)`);
      continue;
    }
    const height = entry.height ? Math.round(entry.height * scale) : undefined;
    const base = sharp(src).resize({ width, height, fit: entry.fit ?? "cover", position: entry.position ?? "centre", withoutEnlargement: !entry.enlarge });
    const suffix = scale === 1 ? "" : `@${scale}x`;
    const outBase = path.join(outRoot, `${entry.out}${suffix}`);
    fs.mkdirSync(path.dirname(outBase), { recursive: true });
    await base.clone().avif({ quality: entry.avifQuality ?? 55 }).toFile(`${outBase}.avif`);
    await base.clone().webp({ quality: entry.webpQuality ?? 80 }).toFile(`${outBase}.webp`);
    const a = fs.statSync(`${outBase}.avif`).size;
    const w = fs.statSync(`${outBase}.webp`).size;
    // `png: true` for assets that have to work where AVIF/WebP do not: Organization JSON-LD (Google asks for a
    // raster in a widely supported format) and HTML email clients.
    let p = 0;
    if (entry.png) {
      await base.clone().png({ compressionLevel: 9, palette: true }).toFile(`${outBase}.png`);
      p = fs.statSync(`${outBase}.png`).size;
    }
    results.push(`${scale}x ${width}${height ? "x" + height : ""} avif ${(a / 1024).toFixed(0)}KB webp ${(w / 1024).toFixed(0)}KB${p ? ` png ${(p / 1024).toFixed(0)}KB` : ""}`);
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
