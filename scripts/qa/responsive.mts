/**
 * QA responsive pass (audit part 2): pages x viewports x engines.
 * Checks horizontal overflow, clipped or truncated text, overlapping text, heading orphans, image aspect ratio,
 * small touch targets (< 24px) and whether the sticky header covers anchor targets. Full-page screenshots in Chromium.
 *
 * Usage: PLAYWRIGHT_BROWSERS_PATH=E:/ms-playwright MSYS_NO_PATHCONV=1 npx tsx scripts/qa/responsive.mts <baseUrl> <label> [engines=chromium,firefox,webkit] [pages=/in/,...]
 * Output: docs/qa/evidence/<label>/responsive/{responsive.json,responsive.md,<engine>/<page>-<w>x<h>.png}
 */
import { chromium, firefox, webkit, type Browser, type BrowserType } from "playwright";
import fs from "node:fs";
import path from "node:path";

const base = (process.argv[2] ?? "http://localhost:3100").replace(/\/$/, "");
const label = process.argv[3] ?? "public";
const engines = (process.argv[4] ?? "chromium,firefox,webkit").split(",");
const pages = (process.argv[5] ?? "/in/,/uk/,/gcc/,/services/cloud-services,/services/cloud-services/migration-modernization,/services/digital-transformation,/insights/events/house-of-lords-2026,/about,/case-studies,/search,/no-such-page-qa").split(",");
const VIEWPORTS: [number, number][] = [[1920, 1080], [1440, 900], [1366, 768], [1280, 800], [1024, 768], [768, 1024], [414, 896], [390, 844], [360, 740]];
const outDir = path.join("docs", "qa", "evidence", label, "responsive");
fs.mkdirSync(outDir, { recursive: true });

const ENGINES: Record<string, BrowserType> = { chromium, firefox, webkit };

interface Result {
  engine: string;
  page: string;
  viewport: string;
  status: number | null;
  overflowPx: number;
  wideElements: string[];
  clipped: string[];
  overlaps: string[];
  orphans: string[];
  badAspect: string[];
  smallTargets: string[];
  anchorCovered: string[];
  consoleErrors: string[];
  height: number;
  screenshot?: string;
}

const CHECK = `(() => {
  const vw = document.documentElement.clientWidth;
  const desc = (el) => el.tagName.toLowerCase() + (el.id ? "#" + el.id : "") + (el.className && typeof el.className === "string" ? "." + el.className.trim().split(/\\s+/).slice(0, 2).join(".") : "") + ' "' + ((el.textContent || "").trim().replace(/\\s+/g, " ").slice(0, 40)) + '"';
  const visible = (el) => { const s = getComputedStyle(el); if (s.display === "none" || s.visibility === "hidden" || parseFloat(s.opacity) === 0) return false; const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
  const all = Array.from(document.querySelectorAll("body *"));
  const overflowPx = document.documentElement.scrollWidth - vw;
  const wideElements = all.filter((el) => { const r = el.getBoundingClientRect(); return r.right > vw + 1 && r.width > 0 && getComputedStyle(el).position !== "fixed"; }).filter((el) => { let p = el.parentElement; while (p && p !== document.body) { const o = getComputedStyle(p).overflowX; if (o === "hidden" || o === "clip" || o === "auto" || o === "scroll") return false; p = p.parentElement; } return true; }).slice(0, 6).map(desc);
  // Text leaves: elements with a direct non-empty text node.
  const leaves = all.filter((el) => visible(el) && Array.from(el.childNodes).some((n) => n.nodeType === 3 && n.textContent.trim().length > 1) && !["SCRIPT", "STYLE", "NOSCRIPT", "OPTION"].includes(el.tagName));
  const clipped = leaves.filter((el) => { const s = getComputedStyle(el); const hid = /hidden|clip/.test(s.overflowX) || /hidden|clip/.test(s.overflowY) || s.textOverflow === "ellipsis"; if (!hid) return false; return el.scrollWidth > el.clientWidth + 2 || el.scrollHeight > el.clientHeight + 2; }).map((el) => desc(el) + " [scroll " + el.scrollWidth + "x" + el.scrollHeight + " vs " + el.clientWidth + "x" + el.clientHeight + "]").slice(0, 12);
  // Overlapping text: two text leaves whose boxes intersect substantially and neither contains the other.
  const rects = leaves.slice(0, 900).map((el) => ({ el, r: el.getBoundingClientRect() }));
  const overlaps = []; const seen = new Set();
  for (let i = 0; i < rects.length; i++) for (let j = i + 1; j < rects.length; j++) {
    const a = rects[i], b = rects[j];
    if (a.el.contains(b.el) || b.el.contains(a.el)) continue;
    const x = Math.min(a.r.right, b.r.right) - Math.max(a.r.left, b.r.left); const y = Math.min(a.r.bottom, b.r.bottom) - Math.max(a.r.top, b.r.top);
    if (x <= 2 || y <= 2) continue;
    const area = x * y; const small = Math.min(a.r.width * a.r.height, b.r.width * b.r.height);
    if (area < 0.25 * small || small < 40) continue;
    // Same stacking context overlay (e.g. text over a gradient) is fine; only flag text-on-text where both are opaque text leaves.
    const k = desc(a.el) + " <> " + desc(b.el); if (seen.has(k)) continue; seen.add(k); overlaps.push(k); if (overlaps.length > 10) break;
  }
  const orphans = Array.from(document.querySelectorAll("h1,h2,h3")).filter(visible).filter((h) => {
    const words = (h.textContent || "").trim().split(/\\s+/); if (words.length < 4) return false;
    const range = document.createRange(); range.selectNodeContents(h);
    const tops = Array.from(new Set(Array.from(range.getClientRects()).map((r) => Math.round(r.top)))); if (tops.length < 2) return false;
    const lastTop = Math.max(...tops); const lastLine = Array.from(range.getClientRects()).filter((r) => Math.round(r.top) === lastTop);
    const w = Math.max(...lastLine.map((r) => r.width), 0); const fs = parseFloat(getComputedStyle(h).fontSize);
    // Orphan: the last line holds one short word (narrower than about 6 characters).
    return w < fs * 3.2;
  }).map(desc);
  const badAspect = Array.from(document.querySelectorAll("img")).filter((i) => visible(i) && i.naturalWidth > 0 && !/cover|contain/.test(getComputedStyle(i).objectFit)).filter((i) => { const r = i.getBoundingClientRect(); const nat = i.naturalWidth / i.naturalHeight; const ren = r.width / r.height; return Math.abs(nat - ren) / nat > 0.04; }).map((i) => (i.getAttribute("src") || "").slice(0, 80) + " natural " + i.naturalWidth + "x" + i.naturalHeight + " rendered " + Math.round(i.getBoundingClientRect().width) + "x" + Math.round(i.getBoundingClientRect().height)).slice(0, 8);
  const targets = Array.from(document.querySelectorAll("a[href], button, summary, input:not([type=hidden]), select, textarea, [role=button], [role=tab]")).filter(visible);
  const smallTargets = vw < 800 ? targets.filter((t) => { const r = t.getBoundingClientRect(); return (r.width < 24 || r.height < 24) && !t.closest("p, h1, h2, h3, li > span"); }).map((t) => desc(t) + " " + Math.round(t.getBoundingClientRect().width) + "x" + Math.round(t.getBoundingClientRect().height)).slice(0, 10) : [];
  return { overflowPx, wideElements, clipped, overlaps, orphans, badAspect, smallTargets, height: document.documentElement.scrollHeight };
})()`;

const ANCHORS = `(() => {
  const header = document.querySelector("header");
  const hb = header ? header.getBoundingClientRect().bottom : 0;
  const out = [];
  const links = Array.from(document.querySelectorAll('a[href^="#"]')).filter((a) => a.getAttribute("href").length > 1 && document.querySelector(a.getAttribute("href"))).slice(0, 4);
  for (const a of links) {
    const id = a.getAttribute("href");
    const t = document.querySelector(id);
    t.scrollIntoView();
    const top = t.getBoundingClientRect().top;
    const hb2 = header ? header.getBoundingClientRect().bottom : 0;
    if (top < hb2 - 1 && getComputedStyle(header).position === "sticky") out.push(id + " top " + Math.round(top) + " under header bottom " + Math.round(hb2));
  }
  window.scrollTo(0, 0);
  return { headerBottom: hb, covered: out, scrollPaddingTop: getComputedStyle(document.documentElement).scrollPaddingTop };
})()`;

const results: Result[] = [];
for (const engineName of engines) {
  const type = ENGINES[engineName];
  if (!type) continue;
  let browser: Browser;
  try {
    browser = await type.launch();
  } catch (e) {
    console.log(`${engineName}: launch failed: ${String(e).split("\n")[0]}`);
    continue;
  }
  fs.mkdirSync(path.join(outDir, engineName), { recursive: true });
  for (const route of pages) {
    for (const [w, h] of VIEWPORTS) {
      // Firefox and WebKit: a representative subset to keep the run within time.
      if (engineName !== "chromium" && ![1440, 1024, 390].includes(w)) continue;
      const ctx = await browser.newContext({ viewport: { width: w, height: h }, reducedMotion: "reduce", isMobile: engineName === "chromium" && w < 800, hasTouch: w < 800, deviceScaleFactor: 1 });
      const page = await ctx.newPage();
      const consoleErrors: string[] = [];
      page.on("console", (m) => m.type() === "error" && consoleErrors.push(m.text().slice(0, 200)));
      page.on("pageerror", (e) => consoleErrors.push("PAGEERR " + String(e).slice(0, 200)));
      let status: number | null = null;
      try {
        const resp = await page.goto(`${base}${route}`, { waitUntil: "load", timeout: 60_000 });
        status = resp?.status() ?? null;
        await page.addStyleTag({ content: "*{animation:none!important;transition:none!important} .marquee-track{animation:none!important}" });
        await page.waitForTimeout(900);
        await page.evaluate(() => document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => el.setAttribute("data-revealed", "")));
        const total = await page.evaluate(() => document.body.scrollHeight);
        for (let y = 0; y < total; y += Math.max(400, h - 100)) {
          await page.evaluate((yy) => window.scrollTo(0, yy), y);
          await page.waitForTimeout(50);
        }
        await page.evaluate(() => window.scrollTo(0, 0));
        await page.waitForTimeout(500);
      } catch (e) {
        consoleErrors.push("NAV FAILED " + String(e).split("\n")[0]);
      }
      const data = (await page.evaluate(CHECK).catch((e) => ({ error: String(e) }))) as Record<string, unknown>;
      const anchors = (await page.evaluate(ANCHORS).catch(() => ({ covered: [] }))) as { covered: string[] };
      await page.evaluate(() => window.scrollTo(0, 0)).catch(() => {});
      let shot: string | undefined;
      const name = `${route.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "") || "root"}-${w}x${h}.png`;
      try {
        if (engineName === "chromium") await page.screenshot({ path: path.join(outDir, engineName, name), fullPage: true });
        else await page.screenshot({ path: path.join(outDir, engineName, name), fullPage: w === 390 });
        shot = path.join(engineName, name);
      } catch (e) {
        consoleErrors.push("SCREENSHOT FAILED " + String(e).split("\n")[0]);
      }
      const r: Result = {
        engine: engineName,
        page: route,
        viewport: `${w}x${h}`,
        status,
        overflowPx: (data.overflowPx as number) ?? -1,
        wideElements: (data.wideElements as string[]) ?? [],
        clipped: (data.clipped as string[]) ?? [],
        overlaps: (data.overlaps as string[]) ?? [],
        orphans: (data.orphans as string[]) ?? [],
        badAspect: (data.badAspect as string[]) ?? [],
        smallTargets: (data.smallTargets as string[]) ?? [],
        anchorCovered: anchors.covered ?? [],
        consoleErrors,
        height: (data.height as number) ?? 0,
        screenshot: shot,
      };
      results.push(r);
      const issues = [r.overflowPx > 0 && `overflow ${r.overflowPx}px`, r.clipped.length && `clipped ${r.clipped.length}`, r.overlaps.length && `overlaps ${r.overlaps.length}`, r.orphans.length && `orphans ${r.orphans.length}`, r.badAspect.length && `aspect ${r.badAspect.length}`, r.smallTargets.length && `small targets ${r.smallTargets.length}`, r.anchorCovered.length && `anchors covered ${r.anchorCovered.length}`, r.consoleErrors.length && `console ${r.consoleErrors.length}`].filter(Boolean);
      console.log(`${engineName} ${route} ${w}x${h}: ${status} ${issues.join(", ") || "clean"}`);
      await ctx.close();
    }
  }
  await browser.close();
}

fs.writeFileSync(path.join(outDir, "responsive.json"), JSON.stringify(results, null, 2));
const md: string[] = [`# Responsive pass ${label} (${base}) ${new Date().toISOString()}`, "", "| Engine | Page | Viewport | Status | Overflow | Clipped | Overlaps | Orphans | Aspect | Small targets | Anchors covered | Console | Height |", "|---|---|---|---|---|---|---|---|---|---|---|---|---|"];
for (const r of results) md.push(`| ${r.engine} | ${r.page} | ${r.viewport} | ${r.status} | ${r.overflowPx} | ${r.clipped.length} | ${r.overlaps.length} | ${r.orphans.length} | ${r.badAspect.length} | ${r.smallTargets.length} | ${r.anchorCovered.length} | ${r.consoleErrors.length} | ${r.height} |`);
md.push("", "## Details (only rows with findings)", "");
for (const r of results) {
  const has = r.overflowPx > 0 || r.clipped.length || r.overlaps.length || r.orphans.length || r.badAspect.length || r.smallTargets.length || r.anchorCovered.length || r.consoleErrors.length;
  if (!has) continue;
  md.push(`### ${r.engine} ${r.page} ${r.viewport} (${r.screenshot ?? "no screenshot"})`, "");
  if (r.overflowPx > 0) md.push(`- overflow ${r.overflowPx}px: ${r.wideElements.join("; ")}`);
  if (r.clipped.length) md.push(`- clipped/truncated text: ${r.clipped.join("; ")}`);
  if (r.overlaps.length) md.push(`- overlapping text: ${r.overlaps.join("; ")}`);
  if (r.orphans.length) md.push(`- heading orphans: ${r.orphans.join("; ")}`);
  if (r.badAspect.length) md.push(`- image aspect: ${r.badAspect.join("; ")}`);
  if (r.smallTargets.length) md.push(`- small targets: ${r.smallTargets.join("; ")}`);
  if (r.anchorCovered.length) md.push(`- anchors under sticky header: ${r.anchorCovered.join("; ")}`);
  if (r.consoleErrors.length) md.push(`- console: ${r.consoleErrors.join(" || ")}`);
  md.push("");
}
fs.writeFileSync(path.join(outDir, "responsive.md"), md.join("\n") + "\n");
console.log(`Wrote ${path.join(outDir, "responsive.md")} (${results.length} runs)`);
