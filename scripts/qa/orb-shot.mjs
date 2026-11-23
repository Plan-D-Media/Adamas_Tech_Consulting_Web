import { chromium } from "playwright";
const base = process.argv[2] ?? "http://localhost:3000";
const out = process.argv[3];
const browser = await chromium.launch({ args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
await page.goto(`${base}/in/`, { waitUntil: "load", timeout: 90000 });
// Let the page hydrate before scrolling: the orb's gate is an effect, so it cannot observe anything until then.
await page.waitForTimeout(2000);
const sec = page.locator("[data-compare='difference']");
await page.evaluate(() => document.querySelector("[data-compare='difference']")?.scrollIntoView({ block: "center" }));
await page.waitForTimeout(6000);
const info = await page.evaluate(() => {
  const host = document.querySelector("[data-compare='difference'] canvas");
  const poster = document.querySelector("[data-compare='difference'] img[src*='difference-network']");
  const stage = document.querySelector("[data-compare='difference'] [data-drawn]");
  return {
    canvas: host ? `${host.width}x${host.height}` : "none",
    canvasAriaHidden: host?.getAttribute("aria-hidden") ?? "none",
    posterOpacity: poster ? getComputedStyle(poster).opacity : "none",
    staged: !!stage,
    caption: document.querySelector("[data-compare='difference'] p.text-center")?.textContent?.trim(),
  };
});
console.log(JSON.stringify(info, null, 2));
await sec.screenshot({ path: out });
await browser.close();
