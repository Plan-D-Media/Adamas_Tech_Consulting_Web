/** Probe: does the region switch leave two headers in the DOM? Also: Case Studies link count, Insights panel keyboard reach. */
import { chromium } from "playwright";
import fs from "node:fs";

const base = (process.argv[2] ?? "http://localhost:3100").replace(/\/$/, "");
const out = "docs/qa/evidence/drafts/interactions";
fs.mkdirSync(out, { recursive: true });
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
const errs: string[] = [];
page.on("console", (m) => m.type() === "error" && errs.push(m.text().slice(0, 300)));
page.on("pageerror", (e) => errs.push("PAGEERR " + String(e).slice(0, 300)));
await page.goto(`${base}/in/`, { waitUntil: "load" });
await page.waitForTimeout(1500);
const count = () => page.evaluate(() => ({ headers: document.querySelectorAll("header").length, topbars: document.querySelectorAll(".topbar").length, mains: document.querySelectorAll("main").length, footers: document.querySelectorAll("footer").length, h1: document.querySelectorAll("h1").length, url: location.pathname }));
console.log("before", JSON.stringify(await count()));
await page.locator("header .region-switcher summary").first().click();
await page.locator("header .region-switcher ul a[href='/uk/']").first().click();
await page.waitForURL(/\/uk\//);
for (const t of [50, 300, 1000, 3000, 6000]) {
  await page.waitForTimeout(t === 50 ? 50 : t - (t === 300 ? 50 : t === 1000 ? 300 : t === 3000 ? 1000 : 3000));
  console.log(`after ${t}ms`, JSON.stringify(await count()));
}
await page.screenshot({ path: `${out}/probe-after-switch-uk.png`, fullPage: false });
// Which header is visible?
const vis = await page.evaluate(() => Array.from(document.querySelectorAll("header")).map((h) => { const r = h.getBoundingClientRect(); return { top: r.top, height: r.height, display: getComputedStyle(h).display, text: (h.textContent || "").replace(/\s+/g, " ").slice(0, 60) }; }));
console.log("headers", JSON.stringify(vis));
// Switch back and forth twice more
for (const r of ["gcc", "in", "uk"]) {
  await page.locator("header .region-switcher summary").first().click();
  await page.locator(`header .region-switcher ul a[href='/${r}/']`).first().click();
  await page.waitForURL(new RegExp(`/${r}/`));
  await page.waitForTimeout(1500);
  console.log(`after switch to ${r}`, JSON.stringify(await count()));
}
// Inner page then back
await page.locator("header nav a[href='/case-studies']").first().click().catch(async () => page.goto(`${base}/case-studies`));
await page.waitForURL(/case-studies/);
await page.waitForTimeout(1500);
console.log("after inner page", JSON.stringify(await count()));
await page.goBack();
await page.waitForTimeout(1500);
console.log("after back", JSON.stringify(await count()));
await page.screenshot({ path: `${out}/probe-after-back.png`, fullPage: true });

// Case Studies link count in desktop nav only
await page.goto(`${base}/in/`, { waitUntil: "load" });
await page.waitForTimeout(1000);
const cs = await page.evaluate(() => Array.from(document.querySelectorAll("header nav a")).filter((a) => /Case Studies/.test(a.textContent || "")).map((a) => ({ href: a.getAttribute("href"), visible: a.getBoundingClientRect().width > 0, nav: a.closest("nav")?.getAttribute("aria-label"), inDrawer: !!a.closest("[data-drawer]") })));
console.log("case studies links", JSON.stringify(cs));

// Insights panel keyboard reach
await page.locator('button[data-menu-key="header.insights"]').focus();
await page.keyboard.press("Enter");
await page.waitForTimeout(200);
const seq: string[] = [];
for (let i = 0; i < 6; i++) {
  await page.keyboard.press("Tab");
  await page.waitForTimeout(60);
  seq.push(await page.evaluate(() => { const el = document.activeElement as HTMLElement; return `${el.tagName}:${(el.innerText || el.getAttribute("aria-label") || "").trim().slice(0, 25)} open=${document.querySelectorAll('button[data-menu-key][aria-expanded="true"]').length}`; }));
}
console.log("insights Tab sequence:", seq.join(" -> "));
await page.locator('button[data-menu-key="header.about"]').focus();
await page.keyboard.press("Enter");
await page.waitForTimeout(200);
const seq2: string[] = [];
for (let i = 0; i < 7; i++) {
  await page.keyboard.press("Tab");
  await page.waitForTimeout(60);
  seq2.push(await page.evaluate(() => { const el = document.activeElement as HTMLElement; return `${el.tagName}:${(el.innerText || el.getAttribute("aria-label") || "").trim().slice(0, 25)} open=${document.querySelectorAll('button[data-menu-key][aria-expanded="true"]').length}`; }));
}
console.log("about Tab sequence:", seq2.join(" -> "));
console.log("console errors:", errs.length ? errs.join(" | ") : "none");
await browser.close();
