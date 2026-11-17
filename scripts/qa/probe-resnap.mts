/** Probe: do the horizontal rails jump when the page is scrolled vertically (reveal transforms re-snapping scroll-snap rails)? */
import { chromium } from "playwright";
const base = (process.argv[2] ?? "http://localhost:3100").replace(/\/+$/, "");
const browser = await chromium.launch();
async function run(width: number, reduced: boolean, wheel: boolean) {
  const ctx = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: reduced ? "reduce" : "no-preference" });
  const page = await ctx.newPage();
  await page.goto(`${base}/in/`, { waitUntil: "load" });
  await page.waitForTimeout(1500);
  const read = () => page.evaluate(() => ({ stories: document.querySelector('[role="group"][aria-label="stories controls"] p')?.textContent?.replace(/\s+/g, " ").trim(), storiesLeft: Math.round(document.querySelector<HTMLElement>('[aria-label="Stories"]')!.scrollLeft), industry: Array.from(document.querySelectorAll('nav[aria-label="Industries"] a')).findIndex((a) => a.getAttribute("aria-current") === "true") + 1, railLeft: Math.round(document.querySelector<HTMLElement>('[aria-label="Industry details"]')!.scrollLeft), overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth }));
  const before = await read();
  if (wheel) {
    await page.mouse.move(width / 2, 450);
    for (let i = 0; i < 40; i++) {
      await page.mouse.wheel(0, 400);
      await page.waitForTimeout(80);
    }
  } else {
    const total = await page.evaluate(() => document.body.scrollHeight);
    for (let y = 0; y < total; y += 600) {
      await page.evaluate((yy) => window.scrollTo(0, yy), y);
      await page.waitForTimeout(60);
    }
  }
  await page.waitForTimeout(2000);
  const after = await read();
  console.log(`${width}px reduced=${reduced} ${wheel ? "wheel" : "scrollTo"}: before ${JSON.stringify(before)} -> after ${JSON.stringify(after)}`);
  await ctx.close();
}
await run(1440, false, false);
await run(1440, false, true);
await run(1440, true, false);
await run(768, false, false);
await run(768, true, false);
await browser.close();
