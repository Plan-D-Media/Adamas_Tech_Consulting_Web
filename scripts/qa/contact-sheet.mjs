// Contact sheet of extracted design bitmaps, so each can be identified by eye.
// node <this> <dir> <out.png> [cols] [cell]
import { readdirSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const [dir, out, colsArg = "6", cellArg = "230"] = process.argv.slice(2);
const cols = Number(colsArg);
const cell = Number(cellArg);
const label = 22;

const files = readdirSync(dir).filter((f) => /\.(png|jpg|jpeg|webp)$/i.test(f)).sort();
const rows = Math.ceil(files.length / cols);
const W = cols * cell;
const H = rows * (cell + label);

const comps = [];
for (let i = 0; i < files.length; i += 1) {
  const x = (i % cols) * cell;
  const y = Math.floor(i / cols) * (cell + label);
  const buf = await sharp(join(dir, files[i]))
    .resize({ width: cell - 8, height: cell - 8, fit: "contain", background: { r: 255, g: 255, b: 255 } })
    .png()
    .toBuffer();
  comps.push({ input: buf, left: x + 4, top: y + 4 });
  const n = files[i].split("_")[0];
  const svg = `<svg width="${cell}" height="${label}"><rect width="${cell}" height="${label}" fill="#111"/><text x="4" y="15" font-family="monospace" font-size="13" fill="#fff">${n} ${files[i].replace(/^\d+_image/, "img").replace(/_\d+_\d+\.\w+$/, "")}</text></svg>`;
  comps.push({ input: Buffer.from(svg), left: x, top: y + cell });
}

await sharp({ create: { width: W, height: H, channels: 3, background: { r: 230, g: 232, b: 236 } } })
  .composite(comps)
  .png()
  .toFile(out);
console.log(`${out}  ${W}x${H}  ${files.length} images`);
