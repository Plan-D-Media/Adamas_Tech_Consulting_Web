/**
 * Homepage QA (brief section 11): full-page screenshots at 1920/1440/1280/1024/768/390, horizontal-overflow check,
 * heading-orphan check, console errors, and a no-JavaScript pass that confirms every section and form is visible.
 * Usage: MSYS_NO_PATHCONV=1 tsx scripts/home-qa.mts [baseUrl] [path] [label]
 * Output: screenshots/<label>/home/<region>-<width>.png
 */
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const base = (process.argv[2] ?? "http://localhost:3100").replace(/\/$/, "");
const route = process.argv[3] ?? "/in/";
const label = process.argv[4] ?? "round5";
const region = route.replace(/\//g, "") || "root";
const dir = path.join("screenshots", label, "home");
fs.mkdirSync(dir, { recursive: true });

const browser = await chromium.launch();
try {
  for (const width of [1920, 1440, 1280, 1024, 768, 390]) {
    const ctx = await browser.newContext({ viewport: { width, height: 1000 }, reducedMotion: "reduce" });
    const page = await ctx.newPage();
    const errors: string[] = [];
    page.on("console", (m) => m.type() === "error" && errors.push(m.text().slice(0, 160)));
    page.on("pageerror", (e) => errors.push(e.message.slice(0, 160)));
    await page.goto(`${base}${route}`, { waitUntil: "load" });
    await page.addStyleTag({ content: "[data-reveal]{opacity:1!important} *{animation:none!important;transition:none!important}" });
    const total = await page.evaluate(() => document.body.scrollHeight);
    for (let y = 0; y < total; y += 900) {
      await page.evaluate((yy) => window.scrollTo(0, yy), y);
      await page.waitForTimeout(40);
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(400);
    const info = await page.evaluate(() => {
      const overflow = document.documentElement.scrollWidth - document.documentElement.clientWidth;
      const wide = [...document.querySelectorAll<HTMLElement>("body *")]
        .filter((el) => el.getBoundingClientRect().right > document.documentElement.clientWidth + 1 && getComputedStyle(el).position !== "fixed")
        .slice(0, 4)
        .map((el) => `${el.tagName.toLowerCase()}.${String(el.className).split(" ").slice(0, 3).join(".")}`);
      const orphans = [...document.querySelectorAll<HTMLElement>("h1,h2,h3")]
        .filter((h) => {
          const words = (h.textContent ?? "").trim().split(/\s+/);
          if (words.length < 4) return false;
          const range = document.createRange();
          range.selectNodeContents(h);
          const rects = [...range.getClientRects()].map((r) => Math.round(r.top));
          const lines = [...new Set(rects)];
          if (lines.length < 2) return false;
          const last = words[words.length - 1];
          const span = document.createElement("span");
          span.textContent = last;
          h.appendChild(span);
          const lastTop = Math.round(span.getBoundingClientRect().top);
          const lastLineRects = [...range.getClientRects()].filter((r) => Math.round(r.top) === lastTop);
          span.remove();
          const lastLineWidth = Math.max(...lastLineRects.map((r) => r.width), 0);
          return lastLineWidth < 60;
        })
        .map((h) => (h.textContent ?? "").trim().slice(0, 50));
      return { overflow, wide, orphans, h1: document.querySelectorAll("h1").length, height: document.body.scrollHeight };
    });
    await page.screenshot({ path: path.join(dir, `${region}-${width}.png`), fullPage: true });
    console.log(`${width}px: height ${info.height}, h1 x${info.h1}, overflow ${info.overflow}px ${info.wide.length ? JSON.stringify(info.wide) : ""}, orphans ${info.orphans.length ? JSON.stringify(info.orphans) : "none"}, console errors ${errors.length}${errors.length ? ": " + errors.join(" | ") : ""}`);
    await ctx.close();
  }

  // No JavaScript: every section present and visible, forms present.
  const nojs = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1440, height: 1000 } });
  const p = await nojs.newPage();
  await p.goto(`${base}${route}`, { waitUntil: "load" });
  // Passed as a string: tsx/esbuild would otherwise inject a `__name` helper that does not exist in the page.
  const r = (await p.evaluate(`(() => {
    const visible = (el) => { const s = getComputedStyle(el); const b = el.getBoundingClientRect(); return s.display !== "none" && s.visibility !== "hidden" && parseFloat(s.opacity) > 0 && b.height > 0; };
    const sections = [...document.querySelectorAll("[data-compare]")].map((s) => s.dataset.compare + ":" + (visible(s) ? "ok" : "HIDDEN"));
    const hiddenReveals = [...document.querySelectorAll("[data-reveal]")].filter((el) => !visible(el)).length;
    const forms = document.querySelectorAll("form").length;
    const navLinks = document.querySelectorAll("header nav a").length;
    const tabPanels = [...document.querySelectorAll('[role="tabpanel"]')].filter(visible).length;
    return { sections, hiddenReveals, forms, navLinks, tabPanels };
  })()`)) as { sections: string[]; hiddenReveals: number; forms: number; navLinks: number; tabPanels: number };
  await p.screenshot({ path: path.join(dir, `${region}-nojs-1440.png`), fullPage: true });
  console.log(`no-JS: sections ${r.sections.join(", ")}; hidden reveal elements ${r.hiddenReveals}; forms ${r.forms}; header nav links ${r.navLinks}; visible tab panels ${r.tabPanels}`);
  await nojs.close();
} finally {
  await browser.close();
}
