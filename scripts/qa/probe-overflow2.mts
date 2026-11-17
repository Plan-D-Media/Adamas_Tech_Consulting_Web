/** Probe: isolate the cause of the document-level horizontal overflow on pillar pages after the GSAP reveal. */
import { chromium } from "playwright";
const base = (process.argv[2] ?? "http://localhost:3100").replace(/\/$/, "");
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
const page = await ctx.newPage();
await page.goto(`${base}/services/ai-services`, { waitUntil: "load" });
await page.waitForTimeout(1000);
const sw = () => page.evaluate(() => document.documentElement.scrollWidth);
console.log("at load:", await sw());
// Reveal everything by attribute only (CSS), no GSAP.
await page.evaluate(() => document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => el.setAttribute("data-revealed", "")));
await page.waitForTimeout(300);
console.log("after attribute reveal (no GSAP):", await sw());
// Now load GSAP by scrolling.
const total = await page.evaluate(() => document.body.scrollHeight);
for (let y = 0; y < total; y += 700) {
  await page.evaluate((yy) => window.scrollTo(0, yy), y);
  await page.waitForTimeout(60);
}
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(1500);
console.log("after scrolling with GSAP:", await sw());
const info = await page.evaluate(() => {
  const html = document.documentElement;
  const body = document.body;
  const ul = document.querySelector<HTMLElement>('[aria-label="Case studies"]')!;
  const lis = Array.from(ul.querySelectorAll<HTMLElement>("li"));
  const rightmost = Array.from(document.querySelectorAll<HTMLElement>("body *")).reduce((m, el) => Math.max(m, el.getBoundingClientRect().right), 0);
  return {
    htmlOverflowX: getComputedStyle(html).overflowX,
    bodyOverflowX: getComputedStyle(body).overflowX,
    htmlClass: html.className,
    htmlSW: html.scrollWidth,
    bodySW: body.scrollWidth,
    ulSW: ul.scrollWidth,
    ulCW: ul.clientWidth,
    ulScrollLeft: ul.scrollLeft,
    liStyles: lis.map((l) => l.getAttribute("style")).slice(0, 3),
    liRevealed: lis.filter((l) => l.hasAttribute("data-revealed")).length,
    rightmost,
    lenis: !!(window as unknown as { lenis?: unknown }).lenis,
    scrollX: window.scrollX,
  };
});
console.log(JSON.stringify(info, null, 1));
// Experiments
const exp = async (label: string, fn: () => void) => {
  await page.evaluate(fn);
  await page.waitForTimeout(200);
  console.log(label, await sw());
};
await exp("clear li inline styles:", () => document.querySelectorAll<HTMLElement>('[aria-label="Case studies"] li').forEach((l) => l.removeAttribute("style")));
await exp("ul overflow-x hidden:", () => ((document.querySelector<HTMLElement>('[aria-label="Case studies"]')!.style.overflowX = "hidden"), undefined));
await exp("ul overflow-x auto again, snap none:", () => { const u = document.querySelector<HTMLElement>('[aria-label="Case studies"]')!; u.style.overflowX = "auto"; u.style.scrollSnapType = "none"; });
await exp("html overflow-x hidden:", () => ((document.documentElement.style.overflowX = "hidden"), undefined));
await exp("html overflow-x restored:", () => ((document.documentElement.style.overflowX = ""), undefined));
// Can the window actually scroll sideways?
const canScroll = await page.evaluate(() => { window.scrollTo(3000, 0); const x = window.scrollX; window.scrollTo(0, 0); return x; });
console.log("window.scrollX after scrollTo(3000):", canScroll);
const edge = await page.evaluate(() => Array.from(document.querySelectorAll<HTMLElement>("*")).map((el) => ({ right: Math.round(el.getBoundingClientRect().right), tag: el.tagName, cls: el.className?.toString().slice(0, 50), inBody: document.body.contains(el) })).filter((e) => e.right > 1300 && !/^(LI|A|DIV|IMG|SPAN|P|H3)$/.test(e.tag) || (e.right > 4400 && e.right < 4600)).slice(0, 15));
console.log("edge elements:", JSON.stringify(edge));
const docScroller = await page.evaluate(() => ({ scrollingElement: document.scrollingElement?.tagName, htmlStyle: document.documentElement.getAttribute("style"), bodyStyle: document.body.getAttribute("style"), htmlRules: Array.from(document.styleSheets).flatMap((ss) => { try { return Array.from(ss.cssRules); } catch { return []; } }).filter((r) => /lenis/.test((r as CSSStyleRule).selectorText ?? "")).map((r) => r.cssText.slice(0, 160)) }));
console.log(JSON.stringify(docScroller, null, 1));
// Touch context: no Lenis
const tctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, hasTouch: true });
const tp = await tctx.newPage();
await tp.addInitScript(() => { const mm = window.matchMedia; window.matchMedia = (q: string) => (q.includes("pointer: coarse") ? ({ matches: true, addEventListener() {}, removeEventListener() {} } as unknown as MediaQueryList) : mm.call(window, q)); });
await tp.goto(base + "/services/ai-services", { waitUntil: "load" });
await tp.waitForTimeout(1000);
const t2 = await tp.evaluate(() => document.body.scrollHeight);
for (let y = 0; y < t2; y += 700) { await tp.evaluate((yy) => window.scrollTo(0, yy), y); await tp.waitForTimeout(60); }
await tp.evaluate(() => window.scrollTo(0, 0));
await tp.waitForTimeout(1500);
console.log("coarse pointer (no Lenis) after scroll:", await tp.evaluate(() => ({ sw: document.documentElement.scrollWidth, lenis: document.documentElement.classList.contains("lenis") })));
await tctx.close();
await browser.close();
