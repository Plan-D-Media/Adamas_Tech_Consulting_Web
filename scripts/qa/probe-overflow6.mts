/** Probe (BUG-007): which box lets the case-study rail widen the document, and what GSAP left on the items. */
import { chromium } from "playwright";
const base = (process.argv[2] ?? "http://localhost:3100").replace(/\/+$/, "");
const path = process.argv[3] ?? "/services/ai-services";
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await ctx.newPage();
await page.goto(base + path, { waitUntil: "load" });
await page.waitForTimeout(800);
const snapshot = () =>
  page.evaluate(() => {
    const ul = document.querySelector<HTMLElement>('ul[aria-label="Case studies"]')!;
    const li = ul.firstElementChild as HTMLElement;
    const chain: string[] = [];
    let el: HTMLElement | null = ul;
    while (el) {
      const cs = getComputedStyle(el);
      chain.push(`${el.tagName.toLowerCase()}${el.id ? "#" + el.id : ""}[${el.getAttribute("data-compare") ?? ""}] sw=${el.scrollWidth} cw=${el.clientWidth} ox=${cs.overflowX} oy=${cs.overflowY} pos=${cs.position} display=${cs.display} contain=${cs.contain} transform=${cs.transform}`);
      el = el.parentElement;
    }
    return {
      docOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      ulStyle: ul.getAttribute("style"),
      ulClass: ul.className,
      liStyle: li.getAttribute("style"),
      liRevealed: li.hasAttribute("data-revealed"),
      htmlClass: document.documentElement.className,
      htmlStyle: document.documentElement.getAttribute("style"),
      bodyStyle: document.body.getAttribute("style"),
      chain,
    };
  });
console.log("BEFORE", JSON.stringify(await snapshot(), null, 1));
const total = await page.evaluate(() => document.body.scrollHeight);
await page.mouse.move(400, 400);
for (let y = 0; y < total; y += 700) {
  await page.evaluate((yy) => window.scrollTo(0, yy), y);
  await page.waitForTimeout(60);
}
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(2000);
console.log("AFTER", JSON.stringify(await snapshot(), null, 1));
await browser.close();
