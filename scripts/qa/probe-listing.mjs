import { chromium } from "playwright";
const base = (process.argv[2] ?? "http://localhost:3000").replace(/\/$/, "");
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(`${base}/case-studies`, { waitUntil: "load" });
await page.waitForTimeout(1200);
console.log(await page.evaluate(() => {
  const cards = [...document.querySelectorAll("a[href^='/case-studies/']")].filter((a) => a.querySelector("h3"));
  return `cards rendered: ${cards.length}\n` + cards.map((a, i) => {
    const img = a.querySelector("img");
    return `  ${i + 1}. ${img ? `fetchpriority=${img.getAttribute("fetchpriority") ?? "-"} loading=${img.getAttribute("loading") ?? "-"}` : "NO IMAGE"}  ${a.querySelector("h3").textContent.trim().slice(0, 34)}`;
  }).join("\n");
}));
console.log("show-more href:", await page.evaluate(() => document.querySelector("a[href*='page=']")?.getAttribute("href") ?? "none"));
const ctx2 = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1440, height: 900 } });
const p2 = await ctx2.newPage();
await p2.goto(`${base}/case-studies?page=2`, { waitUntil: "load" });
console.log("no-JS ?page=2 cards:", await p2.evaluate(() => [...document.querySelectorAll("a[href^='/case-studies/']")].filter((a) => a.querySelector("h3")).length));
await browser.close();
