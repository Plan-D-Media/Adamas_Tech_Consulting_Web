/**
 * Header, mega-menu, region switcher, drawer and footer screenshots for comparison with the Figma renders.
 * Usage: tsx scripts/chrome-shots.mts [baseUrl] [label]   (default http://localhost:3100, "round5")
 * Output: screenshots/<label>/chrome/*.png
 */
import { chromium, type Page } from "playwright";
import fs from "node:fs";
import path from "node:path";

const base = (process.argv[2] ?? "http://localhost:3100").replace(/\/$/, "");
const label = process.argv[3] ?? "round5";
const dir = path.join("screenshots", label, "chrome");
fs.mkdirSync(dir, { recursive: true });

const shot = (p: Page, name: string, full = false) => p.screenshot({ path: path.join(dir, `${name}.png`), fullPage: full });

const browser = await chromium.launch();
try {
  // Desktop at the Figma frame width.
  const d = await browser.newPage({ viewport: { width: 1920, height: 1000 }, deviceScaleFactor: 1 });
  await d.goto(`${base}/in/`, { waitUntil: "networkidle" });
  await shot(d, "1920-header");
  for (const key of ["header.about", "header.services", "header.solutions", "header.insights"]) {
    const trigger = d.locator(`button[data-menu-key="${key}"]`);
    if (!(await trigger.count())) {
      console.log("no trigger for", key);
      continue;
    }
    await trigger.hover();
    await d.waitForTimeout(400);
    await shot(d, `1920-menu-${key.split(".")[1]}`);
    await d.keyboard.press("Escape");
    await d.waitForTimeout(250);
  }
  await d.locator("header .region-switcher summary").first().click();
  await d.waitForTimeout(200);
  await shot(d, "1920-region-switcher");
  await d.keyboard.press("Escape");
  await d.mouse.wheel(0, 600);
  await d.waitForTimeout(400);
  await shot(d, "1920-header-scrolled");
  await d.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await d.waitForTimeout(400);
  await shot(d, "1920-footer");
  await d.close();

  for (const width of [1440, 1280, 1024]) {
    const p = await browser.newPage({ viewport: { width, height: 900 } });
    await p.goto(`${base}/in/`, { waitUntil: "networkidle" });
    await shot(p, `${width}-header`);
    const overflow = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    console.log(`${width}: horizontal overflow ${overflow}px`);
    await p.close();
  }

  // Mobile drawer.
  const m = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  await m.goto(`${base}/in/`, { waitUntil: "networkidle" });
  await shot(m, "390-header");
  await m.locator(".nav-drawer > summary").click();
  await m.waitForTimeout(300);
  await shot(m, "390-drawer");
  await m.locator(".nav-drawer details > summary").nth(1).click();
  await m.waitForTimeout(300);
  await shot(m, "390-drawer-services", true);
  const overflow = await m.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  console.log(`390: horizontal overflow ${overflow}px`);
  await m.close();

  // No-JS: nav links present and drawer openable through <details>.
  const nojs = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const n = await nojs.newPage();
  await n.goto(`${base}/in/`);
  const links = await n.locator("header nav a").count();
  console.log(`no-JS: ${links} header nav links in the HTML`);
  await n.locator(".nav-drawer > summary").click();
  await shot(n, "390-nojs-drawer");
  await nojs.close();
} finally {
  await browser.close();
}
console.log("done:", dir);
