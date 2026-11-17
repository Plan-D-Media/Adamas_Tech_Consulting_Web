/**
 * Probe for the two open interaction failures of the Phase 2 retest (17 Nov 2026):
 *  1. "skip link still reaches the visible main after a client-side region switch": where is focus after the switch,
 *     where does the first Tab land, and does Enter on the skip link focus the visible <main>?
 *  2. "tabbing never lands on an element hidden by the reveal pre-state": which element is the one invisible stop?
 * No injected styles. Usage: PLAYWRIGHT_BROWSERS_PATH=E:/ms-playwright MSYS_NO_PATHCONV=1 npx tsx scripts/qa/probe-focus.mts <baseUrl> <label>
 * Output: docs/qa/evidence/<label>/probe-focus.md
 */
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const base = (process.argv[2] ?? "http://localhost:3100").replace(/\/$/, "");
const label = process.argv[3] ?? "phase2-drafts";
const outDir = path.join("docs", "qa", "evidence", label);
fs.mkdirSync(outDir, { recursive: true });
const lines: string[] = [`# Focus probe ${label} (${base}) ${new Date().toISOString()}`, ""];
const log = (s: string) => {
  lines.push(s);
  console.log(s);
};

const browser = await chromium.launch();
try {
  // ── 1. Skip link after the region switch ───────────────────────────────
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const describe = () =>
    page.evaluate(() => {
      const el = document.activeElement as HTMLElement | null;
      if (!el) return "none";
      const main = el.closest("main");
      const header = el.closest("header");
      const route = main ?? header;
      const routeIndex = route ? Array.from(document.querySelectorAll(route.tagName)).indexOf(route) : -1;
      return `${el.tagName.toLowerCase()}${el.id ? "#" + el.id : ""} href=${el.getAttribute("href")} "${(el.innerText || el.getAttribute("aria-label") || "").trim().replace(/\s+/g, " ").slice(0, 30)}" visible=${el.getClientRects().length > 0} in ${route ? route.tagName.toLowerCase() + "[" + routeIndex + "]" : "body"}`;
    });
  await page.goto(`${base}/in/`, { waitUntil: "load" });
  await page.waitForTimeout(800);
  log("## Skip link after the region switch (same steps as interactions.mts)");
  await page.locator("header .region-switcher summary").first().click();
  await page.locator("header .region-switcher ul a[href='/uk/']").click();
  await page.waitForURL(/\/uk\//, { timeout: 20_000 });
  await page.waitForTimeout(400);
  log(`- focus after the switch: ${await describe()}`);
  const dom = await page.evaluate(() => ({ headers: document.querySelectorAll("header").length, mains: document.querySelectorAll("main").length, hiddenHeaders: Array.from(document.querySelectorAll("header")).map((h) => h.getClientRects().length === 0), skipLinks: document.querySelectorAll("a[href='#main']").length }));
  log(`- DOM: ${JSON.stringify(dom)}`);
  for (let i = 1; i <= 4; i++) {
    await page.keyboard.press("Tab");
    log(`- Tab ${i}: ${await describe()}`);
    if (await page.evaluate(() => document.activeElement?.getAttribute("href") === "#main")) break;
  }
  await page.keyboard.press("Enter");
  await page.waitForTimeout(200);
  log(`- after Enter: ${await describe()}`);
  // Same again, but the e2e way (Playwright's toBeFocused retries): is the difference timing?
  await page.goto(`${base}/in/`, { waitUntil: "load" });
  await page.waitForTimeout(800);
  await page.locator("header summary[aria-label^='Region']").click();
  await page.locator("a[href='/uk/']").first().click();
  await page.waitForURL(/\/uk\/$/);
  log(`- (e2e steps) focus after the switch: ${await describe()}`);
  await page.keyboard.press("Tab");
  log(`- (e2e steps) first Tab: ${await describe()}`);
  await ctx.close();

  // ── 2. The invisible tab stop ──────────────────────────────────────────
  log("");
  log("## Invisible tab stops over 120 Tabs on /in/ (1280, no forced reveals)");
  const ctx2 = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const p2 = await ctx2.newPage();
  await p2.goto(`${base}/in/`, { waitUntil: "load" });
  await p2.waitForTimeout(500);
  for (let i = 1; i <= 120; i++) {
    await p2.keyboard.press("Tab");
    const info = await p2.evaluate(() => {
      const el = document.activeElement as HTMLElement | null;
      if (!el || el === document.body) return null;
      let e: HTMLElement | null = el;
      let min = 1;
      let minAt = "";
      while (e) {
        const o = parseFloat(getComputedStyle(e).opacity);
        if (o < min) {
          min = o;
          minAt = `${e.tagName.toLowerCase()}${e.className && typeof e.className === "string" ? "." + e.className.split(" ").slice(0, 3).join(".") : ""}`;
        }
        e = e.parentElement;
      }
      if (min >= 0.1) return null;
      const next = el.nextElementSibling as HTMLElement | null;
      const ns = next ? getComputedStyle(next) : null;
      return {
        el: `${el.tagName.toLowerCase()}${el.getAttribute("name") ? "[name=" + el.getAttribute("name") + "]" : ""}${el.getAttribute("aria-label") ? "[" + el.getAttribute("aria-label") + "]" : ""}`,
        section: el.closest("section")?.getAttribute("aria-labelledby") ?? "?",
        reveal: !!el.closest("[data-reveal]"),
        revealed: !!el.closest("[data-reveal]")?.hasAttribute("data-revealed"),
        minOpacity: min,
        minAt,
        ownOpacity: getComputedStyle(el).opacity,
        nextSibling: next ? `${next.tagName.toLowerCase()} outline=${ns!.outlineStyle} ${ns!.outlineWidth} opacity=${ns!.opacity}` : "none",
      };
    });
    if (info) log(`- Tab ${i}: ${JSON.stringify(info)}`);
  }
  await ctx2.close();
} finally {
  await browser.close();
  fs.writeFileSync(path.join(outDir, "probe-focus.md"), lines.join("\n"));
  console.log(`-> ${path.join(outDir, "probe-focus.md")}`);
}
