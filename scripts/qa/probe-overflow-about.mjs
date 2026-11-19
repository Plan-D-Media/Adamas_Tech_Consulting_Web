import { chromium } from "playwright";
const base = (process.argv[2] ?? "http://localhost:3000").replace(/\/$/, "");
const route = process.argv[3] ?? "/about";
const width = Number(process.argv[4] ?? 1024);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: "reduce" });
await page.goto(`${base}${route}`, { waitUntil: "load" });
await page.evaluate(() => document.querySelectorAll("[data-reveal]").forEach((el) => el.setAttribute("data-revealed", "")));
await page.waitForTimeout(800);
console.log(await page.evaluate((vw) => {
  const out = [];
  for (const el of document.querySelectorAll("body *")) {
    const r = el.getBoundingClientRect();
    if (r.right <= vw + 1 || r.width === 0 || r.height === 0) continue;
    const sec = el.closest("[data-compare]")?.getAttribute("data-compare") ?? "?";
    out.push({ over: Math.round(r.right - vw), sec, tag: el.tagName.toLowerCase(), cls: String(el.className).slice(0, 70) });
  }
  out.sort((a, b) => b.over - a.over);
  return out.slice(0, 8).map((o) => `+${o.over}px  [${o.sec}]  ${o.tag}.${o.cls}`).join("\n") || "nothing past the viewport";
}, width));
console.log("document overflow:", await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth));
await browser.close();
