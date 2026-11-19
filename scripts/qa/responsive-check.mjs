#!/usr/bin/env node
/**
 * Horizontal overflow and stacking check at the four review widths (brief round 8 section 4).
 *
 *   PLAYWRIGHT_BROWSERS_PATH=E:/ms-playwright node scripts/qa/responsive-check.mjs http://localhost:3000 /about /services/cloud-services
 *
 * For each page and width it reports the document overflow, then the `data-compare` sections that overflow and any
 * individual element wider than the viewport, so a band that breaks the page is named rather than just counted.
 */
import { chromium } from "playwright";

const base = (process.argv[2] ?? "http://localhost:3000").replace(/\/$/, "");
const routes = process.argv.slice(3);
if (routes.length === 0) routes.push("/about");
const WIDTHS = [1440, 1024, 768, 390];

const browser = await chromium.launch();
const rows = [];
for (const route of routes) {
  for (const width of WIDTHS) {
    const ctx = await browser.newContext({ viewport: { width, height: width < 700 ? 844 : 900 }, reducedMotion: "reduce", deviceScaleFactor: 1 });
    const page = await ctx.newPage();
    const res = await page.goto(`${base}${route}`, { waitUntil: "load", timeout: 60000 });
    await page.addStyleTag({ content: "[data-reveal]{opacity:1!important;transform:none!important} nextjs-portal{display:none!important}" });
    await page.evaluate(() => document.querySelectorAll("[data-reveal]").forEach((el) => el.setAttribute("data-revealed", "")));
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += window.innerHeight) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 70));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(500);

    const info = await page.evaluate((vw) => {
      const doc = document.documentElement;
      const overflow = doc.scrollWidth - doc.clientWidth;
      const sections = [...document.querySelectorAll("[data-compare]")]
        .map((s) => ({ id: s.getAttribute("data-compare"), over: Math.round(s.getBoundingClientRect().right - vw) }))
        .filter((s) => s.over > 1);
      // The widest offenders, ignoring anything deliberately clipped by an ancestor with overflow hidden/clip.
      const wide = [];
      for (const el of document.querySelectorAll("body *")) {
        const r = el.getBoundingClientRect();
        if (r.width <= vw + 1 || r.width === 0) continue;
        let clipped = false;
        for (let p = el.parentElement; p; p = p.parentElement) {
          const o = getComputedStyle(p).overflowX;
          if (o === "hidden" || o === "clip" || o === "auto" || o === "scroll") { clipped = true; break; }
        }
        if (!clipped) wide.push(`${el.tagName.toLowerCase()}.${String(el.className).split(" ")[0] || "?"} ${Math.round(r.width)}px`);
        if (wide.length > 4) break;
      }
      return { overflow, sections, wide };
    }, width);

    rows.push(
      `| ${route} | ${width} | ${res?.status()} | ${info.overflow > 1 ? `**${info.overflow}px**` : "none"} | ${info.sections.length ? info.sections.map((s) => `${s.id} +${s.over}`).join(", ") : "-"} | ${info.wide.length ? info.wide.join("; ") : "-"} |`,
    );
    await ctx.close();
  }
}
await browser.close();

console.log("| Page | Width | Status | Document overflow | Sections past the viewport | Unclipped wide elements |");
console.log("|---|---|---|---|---|---|");
for (const r of rows) console.log(r);
