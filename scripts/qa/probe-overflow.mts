/** Probe: which element causes the horizontal overflow on the pillar pages. */
import { chromium } from "playwright";
const base = (process.argv[2] ?? "http://localhost:3100").replace(/\/$/, "");
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
const page = await ctx.newPage();
for (const route of ["/services/digital-transformation", "/services/ai-services", "/services/cloud-services", "/services/ai-services/computer-vision"]) {
  await page.goto(`${base}${route}`, { waitUntil: "load" });
  await page.waitForTimeout(1200);
  const total = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < total; y += 700) { await page.evaluate((yy) => window.scrollTo(0, yy), y); await page.waitForTimeout(60); }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(1500);
  const r = await page.evaluate(() => {
    const vw = document.documentElement.clientWidth;
    const sw = document.documentElement.scrollWidth;
    const wide = Array.from(document.querySelectorAll<HTMLElement>("body *")).filter((el) => el.getBoundingClientRect().right > vw + 2).map((el) => ({ tag: el.tagName.toLowerCase(), cls: el.className.toString().slice(0, 70), right: Math.round(el.getBoundingClientRect().right), w: Math.round(el.getBoundingClientRect().width), section: el.closest("section")?.getAttribute("data-compare") ?? el.closest("section")?.getAttribute("aria-labelledby") }));
    // outermost offenders only: those whose parent is not wide
    const outer = wide.filter((w) => !/cases/.test(String(w.section))).slice(0, 10); const rail = document.querySelector<HTMLElement>("[aria-label=\"Case studies\"]"); (outer as unknown[]).push({ railScrollLeft: rail?.scrollLeft, railOverflowX: rail ? getComputedStyle(rail).overflowX : null, transforms: Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]")).filter((e) => e.style.transform).length });
    const li = document.querySelector<HTMLElement>("[aria-label=\"Case studies\"] li:last-child"); const chain: unknown[] = []; let e: HTMLElement | null = li; while (e && e !== document.body) { const cs = getComputedStyle(e); chain.push({ tag: e.tagName, cls: e.className.toString().slice(0, 40), ox: cs.overflowX, oy: cs.overflowY, sw: e.scrollWidth, cw: e.clientWidth, transform: cs.transform !== "none" ? cs.transform.slice(0, 30) : "", pos: cs.position }); e = e.parentElement; } return { vw, sw, count: wide.length, outer, chain };
  });
  console.log(route, JSON.stringify(r, null, 1).slice(0, 1800));
  if (r.sw > r.vw) await page.screenshot({ path: `docs/qa/evidence/drafts/responsive/probe-overflow-${route.replace(/\W+/g, "-")}.png`, fullPage: true });
}
await browser.close();
