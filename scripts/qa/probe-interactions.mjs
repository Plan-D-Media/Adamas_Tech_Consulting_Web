// Reproduce the two interaction failures and report the DOM facts behind them.
// usage: node probe-interactions.mjs [base]
import { chromium } from "playwright";

const base = process.argv[2] ?? "http://localhost:3100";
const browser = await chromium.launch();
const ctx = await browser.newContext({ baseURL: base, viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

console.log("===== A. skip link after a client-side region switch =====");
await page.goto("/in/");
await page.locator("header summary[aria-label^='Region']").click();
await page.locator("a[href='/uk/']").first().click();
await page.waitForURL(/\/uk\/$/);
const before = await page.evaluate(() => {
  const el = document.activeElement;
  return { tag: el?.tagName, href: el?.getAttribute?.("href"), cls: el?.className?.slice?.(0, 60) };
});
console.log("activeElement right after navigation:", JSON.stringify(before));
console.log(
  "skip links in DOM:",
  JSON.stringify(
    await page.$$eval("a[href='#main']", (as) =>
      as.map((a) => ({ visible: a.getClientRects().length > 0, hidden: !!a.closest("[hidden],[inert],[style*='display: none']") })),
    ),
  ),
);
console.log("mains in DOM:", JSON.stringify(await page.$$eval("main", (ms) => ms.map((m) => ({ id: m.id, boxes: m.getClientRects().length })))));
await page.keyboard.press("Tab");
const after = await page.evaluate(() => {
  const el = document.activeElement;
  return { tag: el?.tagName, href: el?.getAttribute?.("href"), text: el?.textContent?.trim().slice(0, 40) };
});
console.log("activeElement after one Tab:", JSON.stringify(after));

console.log("\n===== B. contact consent checkbox after a failed submit =====");
await page.goto("/contact?service=sap");
const form = page.locator('[data-compare="contact"] form');
await form.locator('button[type="submit"]').click();
await page.waitForTimeout(1500);
console.log("status banner:", (await form.locator("[role='status']").count()) ? (await form.locator("[role='status']").innerText()).slice(0, 60) : "NONE");

const cb = form.locator('input[name="consent"]');
console.log("checkbox count:", await cb.count());
const facts = await cb.first().evaluate((el) => {
  const r = el.getBoundingClientRect();
  const topEl = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
  return {
    checked: el.checked,
    disabled: el.disabled,
    rect: { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) },
    topElement: topEl ? topEl.tagName + "." + String(topEl.className).slice(0, 40) : null,
    insideLabel: !!el.closest("label"),
    formsOnPage: document.querySelectorAll('[data-compare="contact"] form').length,
  };
});
console.log("checkbox facts:", JSON.stringify(facts));

await cb.first().evaluate((el) => {
  window.__ev = [];
  el.addEventListener("click", (e) => window.__ev.push(`click target=${e.target.tagName} checked=${e.target.checked}`));
  el.closest("label")?.addEventListener("click", (e) => window.__ev.push(`label-click target=${e.target.tagName}`));
});
await cb.first().click({ force: true });
await page.waitForTimeout(400);
console.log("after click -> checked:", await cb.first().evaluate((el) => el.checked));
console.log("events:", JSON.stringify(await page.evaluate(() => window.__ev)));

// Second attempt: click again and watch for a React re-render resetting it.
await cb.first().click({ force: true });
await page.waitForTimeout(400);
console.log("after 2nd click -> checked:", await cb.first().evaluate((el) => el.checked));

console.log("");
console.log("===== C. the suite's exact order: fill four fields, then tick consent =====");
const page2 = await ctx.newPage();
await page2.goto("/contact?service=sap");
const f2 = page2.locator('[data-compare="contact"] form');
await f2.locator('button[type="submit"]').click();
await page2.waitForTimeout(1200);
await f2.locator('input[name="name"]').fill("E2E Probe");
await f2.locator('input[name="email"]').fill("probe@e2e.invalid");
await f2.locator('input[name="phone"]').fill("+447700900123");
await f2.locator('textarea[name="message"]').fill("Probe message.");
const cb2 = f2.locator('input[name="consent"]');
const rectOf = (l) => l.evaluate((el) => { const r = el.getBoundingClientRect(); return { x: Math.round(r.x + r.width / 2), y: Math.round(r.y + r.height / 2) }; });
const errCount = () => f2.locator("p.text-\[\#B4600A\]").count().catch(() => -1);
const r1 = await rectOf(cb2);
console.log("checkbox centre before mousedown:", JSON.stringify(r1), "field errors:", await errCount());
await page2.mouse.move(r1.x, r1.y);
await page2.mouse.down();
await page2.waitForTimeout(300);
const r2 = await rectOf(cb2);
console.log("checkbox centre after mousedown :", JSON.stringify(r2), "field errors:", await errCount());
console.log("element now under the cursor    :", await page2.evaluate(([x, y]) => { const el = document.elementFromPoint(x, y); return el ? el.tagName + " " + String(el.className).slice(0, 30) : null; }, [r1.x, r1.y]));
await page2.mouse.up();
await page2.waitForTimeout(200);
console.log("immediately after click :", await cb2.evaluate((el) => el.checked));
await page2.waitForTimeout(100);
console.log("after 100ms            :", await cb2.evaluate((el) => el.checked));
await page2.waitForTimeout(900);
console.log("after 1s               :", await cb2.evaluate((el) => el.checked));

console.log("");
console.log("===== D. tick consent FIRST, then edit another field =====");
const page3 = await ctx.newPage();
await page3.goto("/contact");
const f3 = page3.locator('[data-compare="contact"] form');
const cb3 = f3.locator('input[name="consent"]');
await cb3.evaluate((el) => el.click());
console.log("after ticking          :", await cb3.evaluate((el) => el.checked));
await f3.locator('input[name="name"]').fill("Someone");
await f3.locator('input[name="email"]').fill("not-an-email");
await f3.locator('input[name="email"]').blur();
await page3.waitForTimeout(600);
console.log("after a blur re-render :", await cb3.evaluate((el) => el.checked));

await browser.close();
