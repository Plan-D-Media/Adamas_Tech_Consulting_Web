/** Probe: is the GSAP reveal of the case-study rail items what expands the document width? Widths 1280/1440/1920. */
import { chromium } from "playwright";
const base = (process.argv[2] ?? "http://localhost:3100").replace(/\/$/, "");
const browser = await chromium.launch();
async function run(width: number, preReveal: boolean) {
  const ctx = await browser.newContext({ viewport: { width, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(`${base}/services/ai-services`, { waitUntil: "load" });
  await page.waitForTimeout(1000);
  if (preReveal) await page.evaluate(() => document.querySelectorAll<HTMLElement>('[aria-label="Case studies"] [data-reveal]').forEach((el) => el.setAttribute("data-revealed", "")));
  const total = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < total; y += 700) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await page.waitForTimeout(60);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(1500);
  const sw = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  console.log(`width ${width} preReveal=${preReveal}: overflow ${sw}px`);
  await ctx.close();
}
for (const w of [1280, 1440, 1920]) await run(w, false);
await run(1280, true);
await browser.close();
