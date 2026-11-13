/**
 * Cuts the Figma-baked artwork used by the design fixture page (/figma-fixture, FIGMA_FIXTURE=1) out of the
 * Figma image fills in design-ref/ (gitignored) and writes it to public/media/figma-fixture/ (gitignored).
 * The homepage hero cards in the approved design are one flattened sheet (fill 94e1e948…, 1717x916) that the
 * three card rectangles crop with STRETCH image transforms; the fixture shows those crops as-is so the pixel
 * comparison sees the designer's cards rather than the rebuilt ones.
 *
 * Usage: node scripts/figma-fixture.mjs
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const fills = path.join(root, "design-ref/fills");
const out = path.join(root, "public/media/figma-fixture");
fs.mkdirSync(out, { recursive: true });

/** Figma STRETCH fill: imageTransform [[a,0,tx],[0,d,ty]] shows the source region x: tx..tx+a, y: ty..ty+d. */
async function crop(ref, xf, width, height, name) {
  const src = path.join(fills, `${ref}.png`);
  const meta = await sharp(src).metadata();
  const [a, tx, d, ty] = xf;
  await sharp(src)
    .extract({ left: Math.round(tx * meta.width), top: Math.round(ty * meta.height), width: Math.round(a * meta.width), height: Math.round(d * meta.height) })
    .resize(width, height, { fit: "fill" })
    .png()
    .toFile(path.join(out, name));
  console.log(`${name}: ${width}x${height} from ${ref.slice(0, 8)}`);
}

const SHEET = "94e1e9486b9413101b022ed7aeb806ee3107dab8";
// Home Page 236:1395 > Frame 47: Rectangle 3793 / 3794 / 3798.
await crop(SHEET, [0.3021354079246521, 0.04687955230474472, 0.30506405234336853, 0.40209177136421204], 401, 217, "hero-card-1.png");
await crop(SHEET, [0.28840792179107666, 0.3562820553779602, 0.30619773268699646, 0.40172791481018066], 381, 217, "hero-card-2.png");
await crop(SHEET, [0.3032582104206085, 0.6532520651817322, 0.30619773268699646, 0.40172791481018066], 401, 217, "hero-card-3.png");
// Top Stories card image (Rectangle 3800, the same fill on all three cards).
await crop("84b59bd63841271edfc0f39efdd89edd0d2b2c4f", [0.865014374256134, 0.06749279052019119, 0.9945205450057983, 0.002739726100116968], 561, 363, "story.png");
