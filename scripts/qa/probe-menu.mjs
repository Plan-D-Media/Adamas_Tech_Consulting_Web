/**
 * Probe for the portalled mega menu (round 8): keyboard open, hover-out close, and how much of each depends on
 * hydration having finished (a dev server hydrates far later than a production build, which is what
 * tests/e2e/navigation.spec.ts assumes).
 *
 *   PLAYWRIGHT_BROWSERS_PATH=E:/ms-playwright node scripts/qa/probe-menu.mjs http://localhost:3000
 */
import { chromium } from "playwright";

const base = (process.argv[2] ?? "http://localhost:3000").replace(/\/$/, "");
const ABOUT = 'button[data-menu-key="header.about"]';
const SERVICES = 'button[data-menu-key="header.services"]';

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
const errors = [];
page.on("console", (m) => { if (m.type() === "error") errors.push("console: " + m.text().slice(0, 200)); });
page.on("pageerror", (e) => errors.push("pageerror: " + String(e).slice(0, 300)));

async function fresh(wait) {
  await page.goto(`${base}/in/`, { waitUntil: "load" });
  if (wait) await page.waitForTimeout(wait);
}

// 1. Keyboard open, settled.
await fresh(1500);
await page.locator(ABOUT).focus();
await page.keyboard.press("Enter");
await page.waitForTimeout(400);
console.log("settled   Enter -> aria-expanded:", await page.locator(ABOUT).getAttribute("aria-expanded"));
console.log("          host at body:", await page.evaluate(() => document.querySelector("[data-menu-panel-host]")?.parentElement?.tagName));

// 2. Tab from the trigger lands in the panel (BUG-008 regression).
await page.keyboard.press("Tab");
console.log("          Tab lands in panel:", await page.evaluate(() => !!document.activeElement?.closest("[data-menu-panel-host]")));
await page.keyboard.press("Escape");
console.log("          Esc returns focus:", await page.evaluate(() => document.activeElement?.getAttribute("data-menu-key")));

// 3. Hover-out closes.
await fresh(1500);
await page.locator(SERVICES).hover();
await page.waitForTimeout(500);
const opened = await page.locator(SERVICES).getAttribute("aria-expanded");
console.log("          hover -> aria-expanded:", opened, "| element at (10,600):", await page.evaluate(() => document.elementFromPoint(10, 600)?.className?.toString().slice(0, 40)));
await page.mouse.move(10, 600);
await page.waitForTimeout(900);
console.log("          pointer away -> aria-expanded:", await page.locator(SERVICES).getAttribute("aria-expanded"));

// 3b. Tabbing out the far side of the panel closes it and continues the header's tab order.
await fresh(1500);
await page.locator(ABOUT).focus();
await page.keyboard.press("Enter");
await page.waitForTimeout(300);
let tabs = 0;
for (; tabs < 40; tabs++) {
  await page.keyboard.press("Tab");
  if ((await page.locator(ABOUT).getAttribute("aria-expanded")) === "false") break;
}
console.log("          Tab out closes after", tabs + 1, "tabs; focus now:", await page.evaluate(() => {
  const a = document.activeElement;
  return a ? `${a.tagName} ${a.getAttribute("data-menu-key") ?? (a.textContent ?? "").trim().slice(0, 24)}` : "none";
}));

// 4. Hydration sensitivity: Enter with no settle wait, then the same page once settled.
await fresh(0);
await page.locator(ABOUT).focus();
await page.keyboard.press("Enter");
await page.waitForTimeout(300);
console.log("no-wait   Enter -> aria-expanded:", await page.locator(ABOUT).getAttribute("aria-expanded"));
await page.waitForTimeout(3000);
await page.locator(ABOUT).focus();
await page.keyboard.press("Enter");
await page.waitForTimeout(300);
console.log("after 3s  Enter -> aria-expanded:", await page.locator(ABOUT).getAttribute("aria-expanded"));

console.log("errors:", errors.length ? errors.join("\n  ") : "none");
await browser.close();
