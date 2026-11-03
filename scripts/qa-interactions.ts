/**
 * Captures interactive states the full-page screenshots can't show.
 * Usage: npx tsx scripts/qa-interactions.ts [baseUrl] [path]
 * Output: screenshots/interactions/*.png
 */
import { chromium, type Page } from "playwright";
import fs from "node:fs";
import path from "node:path";

const [base = "http://localhost:3000", p = "/in/"] = process.argv.slice(2);
const OUT = path.resolve("screenshots", "interactions");
fs.mkdirSync(OUT, { recursive: true });

async function shot(page: Page, name: string) {
  await page.waitForTimeout(700);
  await page.screenshot({ path: path.join(OUT, `${name}.png`) });
  console.log("✓", name);
}

(async () => {
  const browser = await chromium.launch();
  const block = /player\.vimeo\.com|vimeocdn|challenges\.cloudflare/;

  // Desktop: mega-menus, keyboard, scrolled header, pinned explorer
  const d = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await d.route(block, (r) => r.abort());
  await d.goto(base + p, { waitUntil: "networkidle" });
  await d.hover("header nav >> text=Services");
  await shot(d, "desktop-mega-services");
  await d.hover("header nav >> text=Solutions");
  await shot(d, "desktop-mega-solutions");
  await d.hover("header nav >> text=Insights");
  await shot(d, "desktop-menu-insights");
  await d.keyboard.press("Escape");
  await d.mouse.move(700, 600);
  // Keyboard: focus the Services trigger, open with ArrowDown
  await d.focus("header nav button:has-text('Services')");
  await d.keyboard.press("ArrowDown");
  await shot(d, "desktop-mega-keyboard");
  await d.keyboard.press("Escape");
  const focused = await d.evaluate(() => document.activeElement?.textContent?.trim());
  console.log("  focus after Esc:", focused);
  await d.evaluate(() => window.scrollTo(0, 1200));
  await d.waitForTimeout(300);
  await d.evaluate(() => window.scrollTo(0, 1100));
  await shot(d, "desktop-header-solid");
  for (const [i, frac] of [0.3, 1.1, 1.9].entries()) {
    await d.evaluate((f) => {
      const s = document.querySelector("[aria-label='Service pillars']")?.closest("section");
      if (s) window.scrollTo(0, s.getBoundingClientRect().top + window.scrollY + window.innerHeight * f);
    }, frac);
    await shot(d, `desktop-explorer-${i + 1}`);
  }
  await d.close();

  // Mobile: drawer + accordion
  const m = await browser.newPage({ viewport: { width: 360, height: 780 }, hasTouch: true, isMobile: true });
  await m.route(block, (r) => r.abort());
  await m.goto(base + p, { waitUntil: "networkidle" });
  await shot(m, "mobile-fold");
  await m.click("button:has-text('Open menu')");
  await shot(m, "mobile-drawer");
  await m.click("[role=dialog] button:has-text('Services')");
  await shot(m, "mobile-drawer-services");
  await m.close();

  await browser.close();
})();
