/**
 * Worst-case contrast of the white hero type against the photograph behind it, measured on a real screenshot.
 * The design itself fails here (see components/about/AboutHero.tsx), so this is the check that our wash fixes it.
 *   PLAYWRIGHT_BROWSERS_PATH=E:/ms-playwright node scripts/qa/hero-contrast.mjs http://localhost:3000 /about
 */
import { chromium } from "playwright";
import sharp from "sharp";

const base = (process.argv[2] ?? "http://localhost:3000").replace(/\/$/, "");
const route = process.argv[3] ?? "/about";
const lin = (c) => { const s = c / 255; return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4; };

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1000 } });
await page.goto(`${base}${route}`, { waitUntil: "load" });
await page.waitForTimeout(1500);
// The union of the hero's own text boxes: exactly where white type sits.
const box = await page.evaluate(() => {
  const hero = document.querySelector("[data-compare='about-hero'], [data-compare='case-hero'], [data-dark-hero]");
  if (!hero) return null;
  const els = [...hero.querySelectorAll("h1,h2,p")].filter((e) => e.textContent.trim());
  if (!els.length) return null;
  const r = els.map((e) => e.getBoundingClientRect());
  return {
    left: Math.max(0, Math.floor(Math.min(...r.map((x) => x.left)))),
    top: Math.max(0, Math.floor(Math.min(...r.map((x) => x.top)))),
    width: Math.ceil(Math.max(...r.map((x) => x.right)) - Math.min(...r.map((x) => x.left))),
    height: Math.ceil(Math.max(...r.map((x) => x.bottom)) - Math.min(...r.map((x) => x.top))),
  };
});
if (!box) { console.log("no hero text found"); await browser.close(); process.exit(0); }
// Hide the type, so what is measured is the backdrop the type sits on, not the type itself.
await page.evaluate(() => {
  const hero = document.querySelector("[data-compare='about-hero'], [data-compare='case-hero'], [data-dark-hero]");
  hero?.querySelectorAll("h1,h2,p,nav,ol").forEach((e) => (e.style.visibility = "hidden"));
});
await page.waitForTimeout(200);
const shot = await page.screenshot();
await browser.close();

const { data, info } = await sharp(shot).extract(box).blur(6).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const lums = [];
for (let i = 0; i < data.length; i += info.channels) lums.push(0.2126 * lin(data[i]) + 0.7152 * lin(data[i + 1]) + 0.0722 * lin(data[i + 2]));
lums.sort((a, b) => a - b);
const p = (q) => lums[Math.floor(q * (lums.length - 1))];
const cr = (L) => 1.05 / (L + 0.05);
console.log(`${route} hero text box ${box.width}x${box.height} at ${box.left},${box.top}`);
for (const q of [0.5, 0.9, 0.95, 0.99, 1]) console.log(`  p${q * 100}  white-on-backdrop ${cr(p(q)).toFixed(2)}:1`);
console.log(`  verdict (large text needs 3:1): ${cr(p(1)) >= 3 ? "PASS everywhere" : cr(p(0.99)) >= 3 ? "PASS to p99" : "FAIL"}`);
