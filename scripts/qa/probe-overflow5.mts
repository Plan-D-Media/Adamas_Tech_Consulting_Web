/** Probe (BUG-007): after the scroll pass, which elements extend past the viewport on a pillar page? */
import { chromium } from "playwright";
const base = (process.argv[2] ?? "http://localhost:3100").replace(/\/+$/, "");
const path = process.argv[3] ?? "/services/ai-services";
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await ctx.newPage();
await page.goto(base + path, { waitUntil: "load" });
await page.waitForTimeout(800);
const total = await page.evaluate(() => document.body.scrollHeight);
await page.mouse.move(400, 400);
for (let y = 0; y < total; y += 700) {
  await page.evaluate((yy) => window.scrollTo(0, yy), y);
  await page.waitForTimeout(60);
}
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(2000);
const r = await page.evaluate(() => {
  const cw = document.documentElement.clientWidth;
  const out: string[] = [];
  for (const el of Array.from(document.querySelectorAll<HTMLElement>("body *"))) {
    const b = el.getBoundingClientRect();
    if (b.right > cw + 2 && b.width > 0) {
      const cs = getComputedStyle(el);
      out.push(`${el.tagName.toLowerCase()}${el.id ? "#" + el.id : ""}.${(el.className && typeof el.className === "string" ? el.className : "").split(" ").slice(0, 4).join(".")} right=${Math.round(b.right)} w=${Math.round(b.width)} transform=${cs.transform} pos=${cs.position} section=${el.closest("section")?.getAttribute("data-compare") ?? "-"}`);
    }
  }
  return { overflow: document.documentElement.scrollWidth - cw, count: out.length, sample: out.slice(0, 25) };
});
console.log(JSON.stringify(r, null, 1));
await browser.close();
