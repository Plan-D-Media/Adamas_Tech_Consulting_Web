#!/usr/bin/env node
/**
 * The homepage orb's fallbacks: in every case below the flat poster must be the only thing rendered, no canvas
 * may exist, and the `three` chunk must never be requested.
 *
 *   PLAYWRIGHT_BROWSERS_PATH=E:/ms-playwright node scripts/qa/orb-fallbacks.mjs http://localhost:3000
 */
import { chromium } from "playwright";

const base = (process.argv[2] ?? "http://localhost:3000").replace(/\/$/, "");
const GL = ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"];

async function probe(label, contextOptions, { noWebGL = false, launchArgs = GL } = {}) {
  const browser = await chromium.launch({ args: launchArgs });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, ...contextOptions });
  const requested = [];
  ctx.on("request", (r) => {
    if (/three/i.test(r.url()) && r.url().includes("/_next/")) requested.push(r.url());
  });
  const page = await ctx.newPage();
  if (noWebGL) {
    // Make every context request fail, the way a blocklisted driver does.
    await page.addInitScript(() => {
      const orig = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = function (type, ...rest) {
        if (typeof type === "string" && type.startsWith("webgl")) return null;
        return orig.call(this, type, ...rest);
      };
    });
  }
  await page.goto(`${base}/in/`, { waitUntil: "load", timeout: 90000 });
  await page.waitForTimeout(1800);
  await page.evaluate(() => document.querySelector("[data-compare='difference']")?.scrollIntoView({ block: "center" }));
  await page.waitForTimeout(4000);
  const r = await page.evaluate(() => {
    const sec = document.querySelector("[data-compare='difference']");
    const poster = sec?.querySelector("img[src*='difference-network']");
    return {
      canvases: sec?.querySelectorAll("canvas").length ?? -1,
      posterVisible: poster ? getComputedStyle(poster).opacity !== "0" && poster.getBoundingClientRect().width > 0 : false,
      posterBox: poster ? Math.round(poster.getBoundingClientRect().width) : 0,
    };
  });
  const ok = r.canvases === 0 && r.posterVisible && requested.length === 0;
  console.log(`${label.padEnd(26)} canvases=${r.canvases} poster=${r.posterVisible ? `yes (${r.posterBox}px)` : "NO"} threeRequests=${requested.length}  ${ok ? "PASS" : "FAIL"}`);
  await browser.close();
  return ok;
}

const results = [];
results.push(await probe("reduced motion", { reducedMotion: "reduce" }));
results.push(await probe("narrow (390px)", { viewport: { width: 390, height: 844 } }));
results.push(await probe("no JavaScript", { javaScriptEnabled: false }));
results.push(await probe("no WebGL", {}, { noWebGL: true }));

const failed = results.filter((x) => !x).length;
console.log(`\n${results.length - failed}/${results.length} fallbacks correct`);
process.exit(failed === 0 ? 0 : 1);
