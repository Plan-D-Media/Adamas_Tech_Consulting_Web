/** Probe: initial state of the Industries selector and the Top Stories slider at several widths (BUG-006, BUG-016). */
import { chromium } from "playwright";
const base = (process.argv[2] ?? "http://localhost:3100").replace(/\/+$/, "");
const browser = await chromium.launch();
for (const w of [390, 768, 1024, 1280, 1440, 1920]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 900 }, hasTouch: w < 800 });
  const page = await ctx.newPage();
  await page.goto(`${base}/in/`, { waitUntil: "load" });
  await page.waitForTimeout(2000);
  const r = await page.evaluate(() => {
    const cur = Array.from(document.querySelectorAll('nav[aria-label="Industries"] a')).findIndex((a) => a.getAttribute("aria-current") === "true");
    const rail = document.querySelector<HTMLElement>('[aria-label="Industry details"]')!;
    const stories = document.querySelector<HTMLElement>('[aria-label="Stories"]')!;
    const counter = document.querySelector('[role="group"][aria-label="stories controls"] p')?.textContent?.replace(/\s+/g, " ").trim();
    return { industry: cur + 1, railScrollLeft: rail.scrollLeft, railClient: rail.clientWidth, cardW: (rail.firstElementChild as HTMLElement).getBoundingClientRect().width, storiesCounter: counter, storiesScrollLeft: stories.scrollLeft, storiesClient: stories.clientWidth };
  });
  console.log(`${w}px: ${JSON.stringify(r)}`);
  await ctx.close();
}
await browser.close();
