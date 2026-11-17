/** Probe: does the pillar-page horizontal overflow need GSAP (block its chunks), and which chunks load lazily. */
import { chromium } from "playwright";
const base = (process.argv[2] ?? "http://localhost:3100").replace(/\/+$/, "");
const browser = await chromium.launch();
async function run(label: string, block: RegExp | null) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  const blocked: string[] = [];
  if (block) await page.route(block, (r) => { blocked.push(r.request().url().split("/").pop()!); r.abort(); });
  await page.goto(base + "/services/ai-services", { waitUntil: "load" });
  await page.waitForTimeout(1000);
  const total = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < total; y += 700) { await page.evaluate((yy) => window.scrollTo(0, yy), y); await page.waitForTimeout(60); }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(2000);
  const r = await page.evaluate(() => ({ overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth, pinSpacers: document.querySelectorAll(".pin-spacer").length, htmlStyle: document.documentElement.getAttribute("style"), bodyStyle: document.body.getAttribute("style"), lenis: document.documentElement.classList.contains("lenis"), revealedInline: Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]")).filter((e) => e.style.opacity).length }));
  console.log(label, JSON.stringify(r), "blocked:", blocked.join(",") || "none");
  await ctx.close();
}
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await ctx.newPage();
const urls: string[] = [];
page.on("response", (r) => r.url().includes("/_next/static/chunks/") && urls.push(r.url().split("/").pop()!));
await page.goto(base + "/services/ai-services", { waitUntil: "load" });
await page.waitForTimeout(500);
const before = urls.length;
await page.mouse.move(300, 300);
await page.mouse.wheel(0, 600);
await page.waitForTimeout(3000);
const lazy = urls.slice(before);
console.log("chunks on load:", before, "lazy after interaction:", lazy.join(", "));
await ctx.close();
await run("normal:", null);
if (lazy.length) await run("lazy chunks blocked:", new RegExp(lazy.map((l) => l.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")));
await browser.close();
