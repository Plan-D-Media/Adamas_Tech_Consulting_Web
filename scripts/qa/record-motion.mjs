#!/usr/bin/env node
/**
 * Short screen recordings of the two moving parts of /services/cloud-services, for the client to review without
 * running the site: the clientele marquee (auto-scroll, then paused by hover) and the testimonial row
 * (base drift, then reacting to scroll velocity, then paused by hover).
 *
 *   PLAYWRIGHT_BROWSERS_PATH=E:/ms-playwright node scripts/qa/record-motion.mjs http://localhost:3000
 *
 * Writes WebM video to docs/qa/evidence/cloud-final/recordings/. One browser, one clip at a time.
 */
import { mkdirSync, readdirSync, renameSync, rmSync } from "node:fs";
import { join } from "node:path";
import { chromium } from "playwright";

const base = (process.argv[2] ?? "http://localhost:3000").replace(/\/$/, "");
const OUT = "docs/qa/evidence/cloud-final/recordings";
rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

/** Put the pointer in the middle of a locator's box, without waiting for a stable box. */
async function hoverCentre(page, locator) {
  const box = await locator.boundingBox();
  if (box) await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
}

async function clip(name, run) {
  const dir = join(OUT, `.tmp-${name}`);
  const browser = await chromium.launch();
  const ctx = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    recordVideo: { dir, size: { width: 1280, height: 720 } },
  });
  const page = await ctx.newPage();
  try {
    await run(page);
  } finally {
    await ctx.close();
    await browser.close();
  }
  const file = readdirSync(dir).find((f) => f.endsWith(".webm"));
  if (file) renameSync(join(dir, file), join(OUT, `${name}.webm`));
  rmSync(dir, { recursive: true, force: true });
  console.log(`${OUT}/${name}.webm`);
}

await clip("clientele-marquee", async (page) => {
  await page.goto(`${base}/services/cloud-services`, { waitUntil: "load" });
  const strip = page.locator("[data-compare='cs-clients']");
  await page.evaluate(() => document.querySelector("[data-compare='cs-clients']")?.scrollIntoView({ block: "center" }));
  await wait(600);
  await wait(5000); // running
  // Hovering a specific <li> is unreliable while the track moves (the first one translates off the left edge),
  // so the pointer is put at the middle of the strip instead.
  await hoverCentre(page, strip);
  await wait(2500);
  await page.mouse.move(10, 10);
  await wait(1500); // running again
  await page.locator("[data-compare='cs-clients'] button").click(); // paused by the button
  await wait(2000);
});

await clip("testimonial-velocity", async (page) => {
  await page.goto(`${base}/services/cloud-services`, { waitUntil: "load" });
  const row = page.locator("[data-compare='cs-testimonials']");
  await page.evaluate(() => document.querySelector("[data-compare='cs-testimonials']")?.scrollIntoView({ block: "center" }));
  await wait(600);
  await wait(2500); // base drift
  // Scroll down, then back up, so the row speeds up and then reverses.
  for (let i = 0; i < 14; i += 1) {
    await page.mouse.wheel(0, 90);
    await wait(60);
  }
  await wait(1200);
  for (let i = 0; i < 16; i += 1) {
    await page.mouse.wheel(0, -90);
    await wait(60);
  }
  await wait(1500);
  await hoverCentre(page, row); // paused, still readable
  await wait(2500);
});

console.log("done");
