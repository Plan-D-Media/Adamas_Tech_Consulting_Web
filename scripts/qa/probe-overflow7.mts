/** Probe (BUG-007): which CSS stops the pillar page from widening after the reveal pass, and does the page still scroll sideways. */
import { chromium } from "playwright";
const base = (process.argv[2] ?? "http://localhost:3100").replace(/\/+$/, "");
const path = process.argv[3] ?? "/services/ai-services";
const browser = await chromium.launch();
const variants: [string, string][] = [
  ["none", ""],
  ["html clip", "html{overflow-x:clip}"],
  ["main clip", "main{overflow-x:clip}"],
  ["rail section contain", "[data-compare='cases']{contain:paint}"],
  ["rail ul overflow hidden + scroll", "ul[aria-label='Case studies']{overflow-x:scroll}"],
];
if (process.argv[4]) variants.splice(1, variants.length - 1, ["argv css", process.argv[4]]);
for (const [label, css] of variants) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(base + path, { waitUntil: "load" });
  if (css) await page.addStyleTag({ content: css });
  await page.waitForTimeout(800);
  const total = await page.evaluate(() => document.body.scrollHeight);
  await page.mouse.move(400, 400);
  for (let y = 0; y < total; y += 700) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await page.waitForTimeout(60);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(2000);
  const r = await page.evaluate(() => {
    const before = window.scrollX;
    window.scrollTo(3000, 0);
    const moved = window.scrollX - before;
    window.scrollTo(0, 0);
    return { overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth, sidewaysScroll: moved };
  });
  console.log(label.padEnd(36), JSON.stringify(r));
  await ctx.close();
}
await browser.close();
