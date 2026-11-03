/** Splits full-page screenshots into viewport-height slices for review: screenshots/<page>/<width>-slices/NN.png */
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const [file, sliceH = "1400"] = process.argv.slice(2);
(async () => {
  const meta = await sharp(file).metadata();
  const h = Number(sliceH);
  const dir = file.replace(/\.png$/, "-slices");
  fs.mkdirSync(dir, { recursive: true });
  for (let y = 0, i = 0; y < (meta.height ?? 0); y += h, i++) {
    const height = Math.min(h, (meta.height ?? 0) - y);
    await sharp(file).extract({ left: 0, top: y, width: meta.width ?? 0, height }).toFile(path.join(dir, `${String(i).padStart(2, "0")}.png`));
  }
  console.log(dir, fs.readdirSync(dir).length, "slices");
})();
