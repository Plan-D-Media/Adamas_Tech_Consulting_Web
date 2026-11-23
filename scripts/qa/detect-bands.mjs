#!/usr/bin/env node
/**
 * Find a tall design render's section boundaries by watching the left gutter's background colour.
 *
 *   node scripts/qa/detect-bands.mjs "design-ref/renders/new-design/Cloud.png"
 *   node scripts/qa/detect-bands.mjs "design-ref/renders/new-design/Cloud.png" --x 4 --w 40
 *
 * The designs in design-ref/exports/new-design have no Figma JSON to read bands off (the frames in the Figma file
 * are older than the zip), so the bands are measured from the pixels instead: for every row it takes the median
 * colour of a narrow strip in the page gutter, where no content is drawn, and reports each run of one colour.
 * Light job: one decode plus a row scan.
 */
import sharp from "sharp";

const argv = process.argv.slice(2);
const src = argv[0];
const num = (flag, dflt) => {
  const i = argv.indexOf(flag);
  return i === -1 ? dflt : Number(argv[i + 1]);
};
const X = num("--x", 4);
const W = num("--w", 40);
const MIN_RUN = num("--min", 24);

if (!src) {
  console.error("Usage: node scripts/qa/detect-bands.mjs <png> [--x n] [--w n] [--min n]");
  process.exit(1);
}

sharp.cache(false);
const { data, info } = await sharp(src)
  .extract({ left: X, top: 0, width: W, height: (await sharp(src).metadata()).height })
  .raw()
  .toBuffer({ resolveWithObject: true });

const { width, height, channels } = info;
const key = (y) => {
  // Median of the strip keeps a stray antialiased pixel from splitting a band.
  const r = [];
  const g = [];
  const b = [];
  for (let x = 0; x < width; x += 1) {
    const i = (y * width + x) * channels;
    r.push(data[i]);
    g.push(data[i + 1]);
    b.push(data[i + 2]);
  }
  const mid = (a) => a.sort((p, q) => p - q)[a.length >> 1];
  return `${mid(r)},${mid(g)},${mid(b)}`;
};

const runs = [];
let start = 0;
let cur = key(0);
for (let y = 1; y < height; y += 1) {
  const k = key(y);
  if (k !== cur) {
    runs.push({ from: start, to: y, colour: cur });
    start = y;
    cur = k;
  }
}
runs.push({ from: start, to: height, colour: cur });

const merged = [];
for (const run of runs) {
  const last = merged[merged.length - 1];
  if (run.to - run.from < MIN_RUN && last) last.to = run.to;
  else merged.push({ ...run });
}

console.log(`${src}  ${height} rows, gutter x=${X}..${X + W}\n`);
console.log("  from     to  height  background");
for (const r of merged) {
  console.log(`${String(r.from).padStart(6)} ${String(r.to).padStart(6)} ${String(r.to - r.from).padStart(7)}  rgb(${r.colour})`);
}
