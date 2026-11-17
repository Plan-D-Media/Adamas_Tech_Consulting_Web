#!/usr/bin/env node
/**
 * Review screenshots for a page at the two review widths (INNER_PAGES.md section 6).
 *
 *   node scripts/qa/shoot.mjs http://localhost:3100/about about drafts
 *   node scripts/qa/shoot.mjs http://localhost:3100/about about public 1440
 *
 * Writes docs/qa/evidence/inner-pages/<label>-<width>.png (full page) and reports the page height, any horizontal
 * overflow and the heading outline, so a section that has collapsed is obvious without opening the image.
 * Reveals are forced on first: the capture is of the settled page, not the pre-animation state.
 */
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { chromium } from "playwright";

const [url, name = "page", label = "drafts", ...widthArgs] = process.argv.slice(2);
if (!url) {
  console.error("Usage: node scripts/qa/shoot.mjs <url> [name] [label] [width ...]");
  process.exit(1);
}
const widths = widthArgs.length ? widthArgs.map(Number) : [1440, 390];
const dir = join("docs", "qa", "evidence", "inner-pages");
mkdirSync(dir, { recursive: true });

const browser = await chromium.launch();
for (const width of widths) {
  const page = await browser.newPage({ viewport: { width, height: width >= 1024 ? 900 : 844 }, deviceScaleFactor: 1 });
  const res = await page.goto(url, { waitUntil: "load", timeout: 45000 });
  await page.evaluate(() => document.querySelectorAll("[data-reveal]").forEach((el) => el.setAttribute("data-revealed", "")));
  // Walk the page so every lazy image starts loading, then wait for them: a full-page screenshot does not
  // scroll by itself, so below-the-fold images would otherwise be captured as their blur placeholder.
  await page.evaluate(async () => {
    const step = window.innerHeight;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 120));
    }
    window.scrollTo(0, 0);
  });
  // Bounded: an image that never finishes (one left outside the viewport, a 404) must not hang the capture.
  await page.evaluate(() =>
    Promise.race([
      Promise.all([...document.images].filter((i) => !i.complete).map((i) => new Promise((r) => { i.onload = i.onerror = r; }))),
      new Promise((r) => setTimeout(r, 8000)),
    ]),
  );
  await page.waitForTimeout(900);
  const file = join(dir, `${name}-${label}-${width}.png`);
  await page.screenshot({ path: file, fullPage: true });

  const info = await page.evaluate(() => ({
    height: document.documentElement.scrollHeight,
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    sections: [...document.querySelectorAll("[data-compare]")].map((s) => `${s.getAttribute("data-compare")}:${Math.round(s.getBoundingClientRect().height)}`),
    headings: [...document.querySelectorAll("h1,h2,h3")].map((h) => `${h.tagName} ${h.textContent.trim().slice(0, 44)}`),
  }));
  console.log(`${file}  ${res?.status()}  height ${info.height}  overflow ${info.overflow}`);
  console.log(`  sections: ${info.sections.join(" | ")}`);
  if (width === widths[0]) info.headings.forEach((h) => console.log(`  ${h}`));
}
await browser.close();
