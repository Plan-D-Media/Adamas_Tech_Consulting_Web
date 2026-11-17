/**
 * QA memory pass (audit part 6): client-side navigation across 20+ pages in one tab, forcing GC and sampling the
 * JS heap, DOM node count, event listeners and script time after each page via the Chrome DevTools Protocol.
 * A steadily rising heap or listener count after GC points at a leak; runaway ScriptDuration at an infinite render loop.
 *
 * Usage: PLAYWRIGHT_BROWSERS_PATH=E:/ms-playwright MSYS_NO_PATHCONV=1 npx tsx scripts/qa/memory.mts <baseUrl> <label>
 * Output: docs/qa/evidence/<label>/memory.md
 */
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const base = (process.argv[2] ?? "http://localhost:3100").replace(/\/$/, "");
const label = process.argv[3] ?? "public";
const outDir = path.join("docs", "qa", "evidence", label);
fs.mkdirSync(outDir, { recursive: true });

const ROUTES = ["/in/", "/services/cloud-services", "/uk/", "/services/cloud-services/migration-modernization", "/insights/events/house-of-lords-2026", "/gcc/", "/about", "/services/digital-transformation", "/solutions", "/case-studies", "/in/", "/services/ai-services", "/insights/events", "/uk/", "/services/cloud-services/devops-secops", "/credentials", "/gcc/", "/solutions/arivoo", "/privacy-policy", "/in/", "/services/cloud-services", "/uk/"];

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
const cdp = await ctx.newCDPSession(page);
await cdp.send("Performance.enable");
await cdp.send("HeapProfiler.enable");
const errors: string[] = [];
page.on("console", (m) => m.type() === "error" && errors.push(m.text().slice(0, 160)));
page.on("pageerror", (e) => errors.push(String(e).slice(0, 160)));

const rows: { step: number; route: string; heapMB: number; nodes: number; listeners: number; scriptMs: number; layoutCount: number; recalcCount: number; mode: string }[] = [];
let prevScript = 0;
async function sample(step: number, route: string, mode: string) {
  await cdp.send("HeapProfiler.collectGarbage");
  await page.waitForTimeout(300);
  await cdp.send("HeapProfiler.collectGarbage");
  const { metrics } = await cdp.send("Performance.getMetrics");
  const m = Object.fromEntries(metrics.map((x) => [x.name, x.value]));
  const script = m.ScriptDuration * 1000;
  rows.push({ step, route, heapMB: +(m.JSHeapUsedSize / 1048576).toFixed(1), nodes: m.Nodes, listeners: m.JSEventListeners, scriptMs: Math.round(script - prevScript), layoutCount: m.LayoutCount, recalcCount: m.RecalcStyleCount, mode });
  prevScript = script;
  console.log(`${step} ${route} [${mode}] heap ${rows[rows.length - 1].heapMB} MB nodes ${m.Nodes} listeners ${m.JSEventListeners} script +${rows[rows.length - 1].scriptMs}ms`);
}

await page.goto(`${base}${ROUTES[0]}`, { waitUntil: "load" });
await page.waitForTimeout(2500);
// Wake the lazy motion libraries so the baseline includes them.
await page.mouse.move(300, 300);
await page.mouse.wheel(0, 800);
await page.waitForTimeout(2500);
await sample(0, ROUTES[0], "initial load");

for (let i = 1; i < ROUTES.length; i++) {
  const route = ROUTES[i];
  // Client-side navigation: use the Next router through a link when one exists, else push via history + Next (fallback: goto).
  const navigated = await page.evaluate(async (href) => {
    const a = document.querySelector<HTMLAnchorElement>(`a[href="${href}"]`);
    if (a) {
      a.click();
      return true;
    }
    return false;
  }, route);
  if (!navigated) await page.goto(`${base}${route}`, { waitUntil: "load" });
  else await page.waitForURL((u) => u.pathname === route || u.pathname === route.replace(/\/$/, ""), { timeout: 30_000 }).catch(() => {});
  await page.waitForTimeout(1200);
  await page.mouse.wheel(0, 1200);
  await page.waitForTimeout(400);
  await page.mouse.wheel(0, -1200);
  await page.waitForTimeout(900);
  await sample(i, route, navigated ? "client nav" : "full load");
}

// A long idle on the homepage: ScriptDuration should stay flat (no render loop).
await page.waitForTimeout(100);
const { metrics: m1 } = await cdp.send("Performance.getMetrics");
await page.mouse.move(5, 5);
await page.waitForTimeout(10_000);
const { metrics: m2 } = await cdp.send("Performance.getMetrics");
const s1 = Object.fromEntries(m1.map((x) => [x.name, x.value]));
const s2 = Object.fromEntries(m2.map((x) => [x.name, x.value]));
const idleScript = Math.round((s2.ScriptDuration - s1.ScriptDuration) * 1000);
const idleLayouts = s2.LayoutCount - s1.LayoutCount;
const idleRecalc = s2.RecalcStyleCount - s1.RecalcStyleCount;
await browser.close();

const first = rows[0];
const last = rows[rows.length - 1];
const homes = rows.filter((r) => r.route === "/in/");
const md = [
  `# Memory pass ${label} (${base}) ${new Date().toISOString()}`,
  "",
  "| Step | Route | Mode | Heap MB (after GC) | DOM nodes | Listeners | Script ms since previous |",
  "|---|---|---|---|---|---|---|",
  ...rows.map((r) => `| ${r.step} | ${r.route} | ${r.mode} | ${r.heapMB} | ${r.nodes} | ${r.listeners} | ${r.scriptMs} |`),
  "",
  `- Heap after GC: ${first.heapMB} MB at the start, ${last.heapMB} MB after ${rows.length - 1} navigations (${(last.heapMB - first.heapMB).toFixed(1)} MB change).`,
  `- /in/ visited ${homes.length} times: heap ${homes.map((h) => h.heapMB).join(" -> ")} MB, nodes ${homes.map((h) => h.nodes).join(" -> ")}, listeners ${homes.map((h) => h.listeners).join(" -> ")}.`,
  `- Idle 10 s on the last page (pointer parked): script ${idleScript} ms, ${idleLayouts} layouts, ${idleRecalc} style recalcs.`,
  `- Console errors during the pass: ${errors.length ? errors.join(" || ") : "none"}.`,
  "",
  "Reading: a leak shows as heap and listener counts rising on every return to the same route; a render loop shows as hundreds of ms of script per second while idle.",
];
fs.writeFileSync(path.join(outDir, "memory.md"), md.join("\n") + "\n");
console.log(md.slice(-6).join("\n"));
