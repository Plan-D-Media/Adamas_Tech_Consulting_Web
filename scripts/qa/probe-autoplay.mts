/** Probe: hero autoplay with no pointer or focus interaction at all; samples the progress bar over 9 seconds. */
import { chromium } from "playwright";
const base = (process.argv[2] ?? "http://localhost:3100").replace(/\/$/, "");
const browser = await chromium.launch();
for (const headed of [false]) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const errs: string[] = [];
  page.on("console", (m) => (m.type() === "error" || m.type() === "warning") && errs.push(m.text().slice(0, 200)));
  await page.goto(`${base}/in/`, { waitUntil: "load" });
  const samples: string[] = [];
  for (let t = 0; t <= 9000; t += 1500) {
    const s = await page.evaluate(() => {
      const bar = document.querySelector('[role="group"][aria-label="highlights controls"] span.w-\\[34px\\] span') as HTMLElement | null;
      const counter = document.querySelector('[role="group"][aria-label="highlights controls"] p')?.textContent?.trim();
      const pause = document.querySelector('button[aria-label*="highlights"][aria-pressed]');
      return `${counter} bar=${bar?.style.width ?? "none"} pause=${pause?.getAttribute("aria-label")}/${pause?.getAttribute("aria-pressed")} vis=${document.visibilityState} focus=${document.hasFocus()} reduce=${matchMedia("(prefers-reduced-motion: reduce)").matches}`;
    });
    samples.push(`${t}ms: ${s}`);
    await page.waitForTimeout(1500);
  }
  console.log(`headed=${headed}\n` + samples.join("\n"));
  // Is the track scrolled?
  console.log("track scrollLeft:", await page.evaluate(() => (document.querySelector('[aria-roledescription="carousel"]') as HTMLElement).scrollLeft));
  console.log("console:", errs.join(" | ") || "none");
  await ctx.close();
}
await browser.close();
