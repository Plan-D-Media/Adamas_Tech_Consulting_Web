/**
 * QA for the main navigation order: desktop labels, keyboard Tab order through the header, ArrowDown into the
 * first menu, mobile drawer order and footer column order.
 * Usage: npx tsx scripts/nav-order-check.ts http://localhost:3000
 */
import { chromium } from "playwright";

const base = process.argv[2] ?? "http://localhost:3000";
const txt = (s: string | null) => (s ?? "").split(String.fromCharCode(10)).join(" ").replace(/ +/g, " ").trim();

(async () => {
  const b = await chromium.launch();
  const d = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await d.goto(`${base}/about`, { waitUntil: "networkidle" });
  const labels = await d.locator('nav[aria-label="Main"] > ul > li').allTextContents();
  console.log("desktop :", labels.map(txt).join(" · "));

  // Tab from the skip link through the header and record the focus order.
  await d.goto(`${base}/about`, { waitUntil: "networkidle" });
  await d.keyboard.press("Tab");
  const order: string[] = [];
  for (let i = 0; i < 11; i++) {
    order.push(await d.evaluate(`(() => { const e = document.activeElement; return (e.getAttribute("aria-label") || e.textContent || e.tagName).split(String.fromCharCode(10)).join(" ").trim().slice(0, 28) || e.tagName; })()`));
    await d.keyboard.press("Tab");
  }
  console.log("tab     :", order.join(" → "));

  // ArrowDown on the first trigger opens its panel and focuses its first link.
  await d.locator('nav[aria-label="Main"] button').first().focus();
  await d.keyboard.press("ArrowDown");
  await d.waitForTimeout(400);
  console.log("arrow↓  :", txt(await d.evaluate("document.activeElement.textContent")));
  await d.keyboard.press("Escape");

  const footer = await d.locator('footer nav[aria-label="Footer"] > div > :first-child, footer nav[aria-label="Footer"] h3, footer nav[aria-label="Footer"] p.eyebrow').allTextContents();
  console.log("footer  :", footer.map(txt).filter(Boolean).join(" · "));

  const m = await b.newPage({ viewport: { width: 390, height: 844 } });
  await m.goto(`${base}/about`, { waitUntil: "networkidle" });
  await m.getByRole("button", { name: "Open menu" }).click();
  await m.waitForTimeout(600);
  const drawer = await m.evaluate(`(() => { const p = document.querySelector('[role="dialog"]'); if (!p) return "no dialog"; return [...p.querySelectorAll(":scope nav > ul > li > button, :scope nav > ul > li > a")].map(e => e.textContent.trim().split(String.fromCharCode(10))[0]).join(" · "); })()`);
  console.log("drawer  :", drawer);
  await b.close();
})().catch((e) => {
  console.error("FAILED:", String(e).split(String.fromCharCode(10))[0]);
  process.exit(1);
});
