#!/usr/bin/env node
/**
 * Brand logo check (round 9): the header and footer marks at the two review widths, at 1x and 2x, with the
 * rendered box, the intrinsic size and whether the aspect is preserved.
 *
 *   PLAYWRIGHT_BROWSERS_PATH=E:/ms-playwright node scripts/qa/logo-check.mjs http://localhost:3000
 *
 * Writes crops to docs/qa/evidence/brand/.
 */
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const base = (process.argv[2] ?? "http://localhost:3000").replace(/\/$/, "");
const outDir = path.join("docs", "qa", "evidence", "brand");
fs.mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch();
const rows = [];
for (const width of [1440, 390]) {
  for (const dpr of [1, 2]) {
    const ctx = await browser.newContext({ viewport: { width, height: 900 }, deviceScaleFactor: dpr, reducedMotion: "reduce" });
    const page = await ctx.newPage();
    await page.goto(`${base}/in/`, { waitUntil: "load" });
    await page.waitForTimeout(1200);

    const info = await page.evaluate(() => {
      const out = [];
      for (const [where, sel] of [
        ["header", "header img[src*='brand/logo']"],
        ["footer", "footer img[src*='brand/logo']"],
      ]) {
        const el = document.querySelector(sel);
        if (!el) { out.push({ where, missing: true }); continue; }
        const r = el.getBoundingClientRect();
        out.push({
          where,
          src: el.getAttribute("src"),
          attrW: el.getAttribute("width"),
          attrH: el.getAttribute("height"),
          boxW: Math.round(r.width * 10) / 10,
          boxH: Math.round(r.height * 10) / 10,
          natural: `${el.naturalWidth}x${el.naturalHeight}`,
          complete: el.complete && el.naturalWidth > 0,
        });
      }
      return out;
    });

    for (const i of info) {
      if (i.missing) { rows.push(`| ${width} | ${dpr}x | ${i.where} | NOT FOUND | | | |`); continue; }
      const boxAspect = Math.round((i.boxW / i.boxH) * 100) / 100;
      const attrAspect = Math.round((Number(i.attrW) / Number(i.attrH)) * 100) / 100;
      rows.push(
        `| ${width} | ${dpr}x | ${i.where} | ${i.src?.split("/").pop()} | ${i.attrW}x${i.attrH} (${attrAspect}) | ${i.boxW}x${i.boxH} (${boxAspect}) | ${i.complete ? "loaded" : "FAILED"} |`,
      );
    }

    // Crops for the eye: the header bar and the top of the footer.
    if (dpr === 2) {
      const header = await page.locator("header").first();
      await header.screenshot({ path: path.join(outDir, `header-${width}@2x.png`) });
      const logo = page.locator("footer img[src*='brand/logo']").first();
      if (await logo.count()) {
        // The footer is below the fold: scroll it in, or the clip falls outside the screenshot.
        await logo.scrollIntoViewIfNeeded();
        await page.waitForTimeout(400);
        await logo.screenshot({ path: path.join(outDir, `footer-logo-${width}@2x.png`) });
      }
    }
    // The scrolled ("sticky") header: the band turns navy but the bar itself stays white glass, so the colour
    // logo is still the right artwork. Captured once, at the desktop width.
    if (dpr === 2 && width === 1440) {
      await page.evaluate(() => window.scrollTo(0, 600));
      await page.waitForTimeout(700);
      const state = await page.evaluate(() => {
        const bar = document.querySelector(".headerbar");
        return {
          scrolled: document.querySelector("header")?.classList.contains("is-scrolled") ?? false,
          barBg: bar ? getComputedStyle(bar, "::before").backgroundColor : "?",
          src: document.querySelector("header img[src*='brand/logo']")?.getAttribute("src") ?? "?",
        };
      });
      rows.push(`| ${width} | ${dpr}x | header (scrolled) | ${state.src.split("/").pop()} | is-scrolled=${state.scrolled} | bar ${state.barBg} | - |`);
      await page.locator("header").first().screenshot({ path: path.join(outDir, "header-1440-scrolled@2x.png") });
    }

    await ctx.close();
  }
}
await browser.close();

console.log("| Width | DPR | Where | File | width/height attrs | Rendered box | Image |");
console.log("|---|---|---|---|---|---|---|");
for (const r of rows) console.log(r);
console.log(`\ncrops: ${outDir}`);
