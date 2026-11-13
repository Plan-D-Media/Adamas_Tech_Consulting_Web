/**
 * Screenshots of the frosted mega-menu panels (designer decision, round 7): every header panel open over the dark
 * hero (scrollY 0) and over a light section (scrolled), plus the mobile drawer at 390px over both.
 * Usage: PLAYWRIGHT_BROWSERS_PATH=E:/ms-playwright MSYS_NO_PATHCONV=1 tsx scripts/menu-shots.mts [baseUrl] [route] [label]
 * Output: screenshots/<label>/menu/<panel>-<hero|light>.png
 */
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const base = (process.argv[2] ?? "http://localhost:3100").replace(/\/$/, "");
const route = process.argv[3] ?? "/in/";
const label = process.argv[4] ?? "round7";
const dir = path.join("screenshots", label, "menu");
fs.mkdirSync(dir, { recursive: true });

const browser = await chromium.launch();
try {
  const ctx = await browser.newContext({ viewport: { width: 1920, height: 1000 }, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto(`${base}${route}`, { waitUntil: "load" });
  await page.addStyleTag({ content: "[data-reveal]{opacity:1!important;transform:none!important} *{transition:none!important;animation:none!important} nextjs-portal{display:none!important}" });
  await page.waitForTimeout(1500);
  const keys = await page.$$eval("button[data-menu-key]", (els) => els.map((e) => e.getAttribute("data-menu-key")!));
  for (const [where, y] of [
    ["hero", 0],
    ["light", 1500],
  ] as const) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await page.waitForTimeout(500);
    for (const key of keys) {
      await page.click(`button[data-menu-key="${key}"]`);
      await page.waitForTimeout(450);
      await page.screenshot({ path: path.join(dir, `${key.replace(/[^a-z0-9]+/gi, "-")}-${where}.png`), clip: { x: 0, y: 0, width: 1920, height: 1000 } });
      await page.keyboard.press("Escape");
      await page.waitForTimeout(150);
    }
  }
  await ctx.close();

  const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce", isMobile: true, hasTouch: true });
  const m = await mobile.newPage();
  await m.goto(`${base}${route}`, { waitUntil: "load" });
  await m.addStyleTag({ content: "*{transition:none!important;animation:none!important} nextjs-portal{display:none!important}" });
  await m.waitForTimeout(1200);
  for (const [where, y] of [
    ["hero", 0],
    ["light", 1400],
  ] as const) {
    await m.evaluate((yy) => window.scrollTo(0, yy), y);
    await m.waitForTimeout(400);
    await m.click(".nav-drawer > summary");
    await m.waitForTimeout(400);
    await m.screenshot({ path: path.join(dir, `drawer-${where}.png`) });
    await m.keyboard.press("Escape");
    await m.waitForTimeout(200);
  }
  await mobile.close();
  console.log(`saved ${keys.length * 2 + 2} screenshots to ${dir}`);
} finally {
  await browser.close();
}
