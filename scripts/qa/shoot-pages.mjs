#!/usr/bin/env node
/**
 * Full-page screenshots of SEVERAL routes at one width, into a folder of your choosing - for spot-checking a set
 * of pages that share a template. `shoot.mjs` next to it does one page at two review widths and reports its
 * outline; this one trades that for breadth.
 *
 *   PLAYWRIGHT_BROWSERS_PATH=E:/ms-playwright node scripts/qa/shoot-pages.mjs <outDir> <baseUrl> <width> <route...>
 */
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { chromium } from "playwright";

const [out, base, widthArg, ...routes] = process.argv.slice(2);
const width = Number(widthArg || 1440);
mkdirSync(out, { recursive: true });
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width, height: 1000 }, reducedMotion: "reduce", deviceScaleFactor: 1 });
const page = await ctx.newPage();
for (const r of routes) {
  await page.goto(`${base.replace(/\/$/, "")}${r}`, { waitUntil: "load", timeout: 60000 });
  await page.addStyleTag({ content: "[data-reveal]{opacity:1!important;transform:none!important} *{transition:none!important;animation:none!important} nextjs-portal{display:none!important}" });
  await page.waitForTimeout(900);
  const name = (r.replace(/^\//, "").replace(/\//g, "-") || "home") + ".png";
  await page.screenshot({ path: join(out, name), fullPage: true });
  console.log(join(out, name));
}
await browser.close();
