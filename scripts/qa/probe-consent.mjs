#!/usr/bin/env node
/**
 * Reproduce the consent suite's "the footer reopens the banner" step against a build that has a Tag Manager
 * container ID, and report what the footer control is doing.
 *
 *   node scripts/qa/probe-consent.mjs [base]
 */
import { chromium } from "playwright";

const base = process.argv[2] ?? "http://localhost:3100";
const browser = await chromium.launch();
const page = await browser.newPage({ baseURL: base, viewport: { width: 1280, height: 720 } });
page.on("pageerror", (e) => console.log("  [pageerror]", String(e).slice(0, 200)));
page.on("console", (m) => m.type() === "error" && console.log("  [console error]", m.text().slice(0, 200)));

await page.goto("/in/", { waitUntil: "load" });
const state = async (label) => {
  const info = await page.evaluate(() => {
    const el = document.querySelector("[data-cookie-settings]");
    const banner = document.querySelector("[data-consent-banner]");
    return {
      settingsInDom: !!el,
      settingsBoxes: el ? el.getClientRects().length : 0,
      settingsDisplay: el ? getComputedStyle(el).display : null,
      settingsParentDisplay: el?.parentElement ? getComputedStyle(el.parentElement).display : null,
      bannerInDom: !!banner,
      hydrated: !!document.querySelector("[data-consent='reject']"),
    };
  });
  console.log(label, JSON.stringify(info));
};

await state("on load            :");
await page.locator("[data-consent='reject']").click();
await page.waitForTimeout(800);
await state("after reject       :");
await page.waitForTimeout(2500);
await state("2.5s after reject  :");

const count = await page.locator("[data-cookie-settings]").count();
console.log("locator count after reject:", count);
if (count) {
  await page.locator("[data-cookie-settings]").first().click();
  await page.waitForTimeout(600);
  console.log("banner reopened:", await page.locator("[data-consent-banner]").count());
}
await browser.close();
