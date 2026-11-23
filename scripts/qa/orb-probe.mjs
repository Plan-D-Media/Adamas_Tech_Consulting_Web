import { chromium } from "playwright";
const base = process.argv[2] ?? "http://localhost:3000";
const browser = await chromium.launch({ args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
page.on("console", (m) => { if (m.type() === "error" || m.type() === "warning") console.log("  console:", m.text().slice(0, 160)); });
page.on("pageerror", (e) => console.log("  pageerror:", e.message.slice(0, 200)));
await page.goto(`${base}/in/`, { waitUntil: "load", timeout: 90000 });
await page.waitForTimeout(1500);
console.log(JSON.stringify(await page.evaluate(() => {
  const sec = document.querySelector("[data-compare='difference']");
  const stage = sec?.querySelector(":scope > div");
  const hydrated = !!Object.keys(stage ?? {}).find((k) => k.startsWith("__react"));
  const r = stage?.getBoundingClientRect();
  return {
    stageTag: stage?.tagName,
    stageClass: stage?.className?.slice(0, 60),
    hydratedRoot: !!document.querySelector("#__next, body")?.innerHTML && hydrated,
    reactKeys: Object.keys(stage ?? {}).filter((k) => k.startsWith("__react")).slice(0, 2),
    rect: r ? { top: Math.round(r.top), height: Math.round(r.height) } : null,
    webgl: (() => { try { const c = document.createElement("canvas"); return !!(c.getContext("webgl2") || c.getContext("webgl")); } catch { return "throw"; } })(),
    reduced: matchMedia("(prefers-reduced-motion: reduce)").matches,
    narrow: matchMedia("(max-width: 767.98px)").matches,
    saveData: navigator.connection?.saveData ?? null,
  };
}), null, 2));
await page.evaluate(() => document.querySelector("[data-compare='difference']")?.scrollIntoView({ block: "center" }));
await page.waitForTimeout(5000);
console.log(JSON.stringify(await page.evaluate(() => ({
  drawn: !!document.querySelector("[data-compare='difference'] [data-drawn]"),
  canvases: document.querySelectorAll("[data-compare='difference'] canvas").length,
}))));
await browser.close();
