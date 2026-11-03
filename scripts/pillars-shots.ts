/**
 * Screenshots of the homepage pillars explorer ("Driving Growth Through Innovative Solutions").
 * Usage: tsx scripts/pillars-shots.ts [baseUrl] [label] [--video]
 * Output: screenshots/<label>/pillars/
 *   <w>x<h>-pinned.png  viewport at the start of the pin, header shown (scrolled down then back up a little)
 *   <w>x<h>-last.png    viewport on the last pillar
 *   390-section.png     the whole section on a phone (first pillar open)
 *   metrics.json        gaps between the content and the frame edges / header, per viewport and pillar
 * --video records real wheel scrolling through the pin at 1440×900.
 * --engine=firefox|webkit runs the desktop sizes in that engine (Playwright builds under E:\ms-playwright) and
 * only writes metrics-<engine>.json (no screenshots).
 */
import { chromium, firefox, webkit, type Browser, type Page } from "playwright";
import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const video = args.includes("--video");
const [base = "http://localhost:3000", label = "before"] = args.filter((a) => !a.startsWith("--"));
const OUT = path.resolve("screenshots", label, "pillars");
const engine = (args.find((a) => a.startsWith("--engine=")) ?? "--engine=chromium").slice(9);
const PW_E = "E:/ms-playwright";
const exe = (prefix: string, rel: string) => {
  const dir = fs.existsSync(PW_E) ? fs.readdirSync(PW_E).filter((d) => d.startsWith(prefix)).sort().pop() : undefined;
  return dir ? path.join(PW_E, dir, rel) : undefined;
};
const launch = (): Promise<Browser> =>
  engine === "firefox"
    ? firefox.launch({ executablePath: exe("firefox-", "firefox/firefox.exe") })
    : engine === "webkit"
      ? webkit.launch({ executablePath: exe("webkit-", "Playwright.exe") })
      : chromium.launch();
const shotsOn = engine === "chromium";
fs.mkdirSync(OUT, { recursive: true });
const PAGE = "/in/";
const SECTION = "section:has([role=tablist][aria-label='Service pillars'])";
const metrics: Record<string, unknown> = {};

async function open(p: Page) {
  await p.goto(base + PAGE, { waitUntil: "networkidle", timeout: 120_000 });
  await p.addStyleTag({ content: "iframe{visibility:hidden}" });
  await p.waitForTimeout(2500);
}

/** Gaps (px) inside the viewport: header bottom → eyebrow top, last link/tab bottom → frame bottom. */
const measure = (p: Page) =>
  p.evaluate(`(() => {
    const s = document.querySelector(${JSON.stringify(SECTION)});
    const r = s.getBoundingClientRect();
    const header = document.querySelector("header");
    const hb = header ? Math.max(0, header.getBoundingClientRect().bottom) : 0;
    const eyebrow = s.querySelector("h2").previousElementSibling || s.querySelector("h2");
    const panel = s.querySelector("[role=tabpanel]");
    const els = [...s.querySelectorAll("[role=tab], [role=tabpanel] a, [role=tabpanel] img")].filter((e) => e.getBoundingClientRect().height > 0);
    const bottom = Math.max(...els.map((e) => e.getBoundingClientRect().bottom));
    const frameBottom = Math.min(innerHeight, r.bottom);
    return {
      pinned: !!s.querySelector(".pin-spacer") || getComputedStyle(s.firstElementChild).position === "fixed" || s.firstElementChild.style.position === "fixed",
      headerBottom: Math.round(hb),
      topGap: Math.round(eyebrow.getBoundingClientRect().top - Math.max(hb, r.top)),
      bottomGap: Math.round(frameBottom - bottom),
      headingToTabs: Math.round(s.querySelector("[role=tablist]").getBoundingClientRect().top - s.querySelector("h2").parentElement.querySelector("h2").getBoundingClientRect().bottom),
      descToLinks: panel && panel.querySelector("ul") ? Math.round(panel.querySelector("ul").getBoundingClientRect().top - panel.querySelector("ul").previousElementSibling.getBoundingClientRect().bottom) : null,
      clipped: bottom > frameBottom + 1,
    };
  })()`);

async function desktop(w: number, h: number) {
  const b = await launch();
  const ctx = await b.newContext({ viewport: { width: w, height: h }, ...(video && w === 1440 ? { recordVideo: { dir: OUT, size: { width: w, height: h } } } : {}) });
  await ctx.route(/player\.vimeo\.com|vimeocdn|challenges\.cloudflare/, (r) => r.abort());
  const p = await ctx.newPage();
  await open(p);
  const top = await p.evaluate(`(() => { const s = document.querySelector(${JSON.stringify(SECTION)}); return s.getBoundingClientRect().top + scrollY; })()`) as number;
  const key = `${w}x${h}`;
  const out: Record<string, unknown> = {};
  if (video && w === 1440) {
    // Real wheel input from above the section to past it.
    await p.evaluate((y) => window.scrollTo(0, y), Math.max(0, top - 700));
    await p.waitForTimeout(1200);
    for (let i = 0; i < 60; i++) {
      await p.mouse.wheel(0, 110);
      await p.waitForTimeout(110);
    }
    await p.waitForTimeout(800);
    for (let i = 0; i < 6; i++) {
      await p.mouse.wheel(0, -90);
      await p.waitForTimeout(120);
    }
    await p.waitForTimeout(1200);
  }
  // Start of the pin, with the header revealed (scroll down past the start, then back up).
  await p.evaluate((y) => window.scrollTo(0, y), top + 260);
  await p.waitForTimeout(500);
  await p.evaluate((y) => window.scrollTo(0, y), top + 20);
  await p.waitForTimeout(1500);
  out.first = await measure(p);
  if (shotsOn) await p.screenshot({ path: path.join(OUT, `${key}-pinned.png`) });
  // Last pillar: near the end of the pin.
  const end = await p.evaluate(`(() => { const s = document.querySelector(${JSON.stringify(SECTION)}); const sp = s.querySelector(".pin-spacer"); return sp ? sp.getBoundingClientRect().top + scrollY + sp.offsetHeight - innerHeight - 40 : null; })()`) as number | null;
  if (end) {
    // Middle pillar too (each pillar has its own copy length).
    await p.evaluate((y) => window.scrollTo(0, y), (top + end) / 2 + 30);
    await p.waitForTimeout(400);
    await p.evaluate((y) => window.scrollTo(0, y), (top + end) / 2);
    await p.waitForTimeout(1500);
    out.mid = await measure(p);
    if (shotsOn) await p.screenshot({ path: path.join(OUT, `${key}-mid.png`) });
    await p.evaluate((y) => window.scrollTo(0, y), end + 30);
    await p.waitForTimeout(400);
    await p.evaluate((y) => window.scrollTo(0, y), end);
    await p.waitForTimeout(1500);
    out.last = await measure(p);
    if (shotsOn) await p.screenshot({ path: path.join(OUT, `${key}-last.png`) });
  }
  // Bottom edge: the section's end meeting the next section (scrolled just past the pin).
  await p.evaluate(`(() => { const s = document.querySelector(${JSON.stringify(SECTION)}); const r = s.getBoundingClientRect(); window.scrollTo(0, r.bottom + scrollY - innerHeight * 0.7); })()`);
  await p.waitForTimeout(1500);
  if (shotsOn) await p.screenshot({ path: path.join(OUT, `${key}-exit.png`) });
  metrics[key] = out;
  await ctx.close();
  await b.close();
}

async function mobile() {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  await ctx.route(/player\.vimeo\.com|vimeocdn|challenges\.cloudflare/, (r) => r.abort());
  const p = await ctx.newPage();
  await open(p);
  const box = await p.evaluate(`(() => { const s = document.querySelector(${JSON.stringify(SECTION)}); s.scrollIntoView(); const r = s.getBoundingClientRect(); return { y: r.top + scrollY, h: r.height }; })()`) as { y: number; h: number };
  await p.waitForTimeout(1500);
  metrics["390"] = await p.evaluate(`(() => {
    const s = document.querySelector(${JSON.stringify(SECTION)});
    const r = s.getBoundingClientRect();
    const first = s.querySelector(".container-site > div > div, h2").getBoundingClientRect();
    const last = [...s.querySelectorAll("ul.lg\\\\:hidden a, ul.lg\\\\:hidden button")].filter((e) => e.getBoundingClientRect().height > 0).pop().getBoundingClientRect();
    return { topGap: Math.round(first.top - r.top), bottomGap: Math.round(r.bottom - last.bottom) };
  })()`);
  if (shotsOn) await p.screenshot({ path: path.join(OUT, "390-section.png"), fullPage: true, clip: { x: 0, y: Math.max(0, box.y - 40), width: 390, height: box.h + 120 } });
  await ctx.close();
  await b.close();
}

(async () => {
  for (const [w, h] of [[1440, 900], [1366, 768], [1280, 720], [1280, 700], [1024, 800], [1024, 700]]) await desktop(w, h);
  if (shotsOn) await mobile();
  fs.writeFileSync(path.join(OUT, shotsOn ? "metrics.json" : `metrics-${engine}.json`), JSON.stringify(metrics, null, 2));
  console.log(JSON.stringify(metrics, null, 2));
  console.log("out:", OUT);
})().catch((e) => {
  console.error("FAILED:", String(e).split("\n")[0]);
  process.exit(1);
});
