/**
 * Mobile Lighthouse, three runs per URL, median per metric (performance, LCP, CLS, TBT, INP where present, FCP, SI),
 * plus the largest contributors from the median run (DOM size, script transfer per route, image weight, font weight,
 * main-thread breakdown). Run alone: the laptop's scores vary run to run (docs/design-notes.md round 7).
 *
 * Usage: node scripts/qa/lighthouse.mjs <baseUrl> <label> [runs=3] [paths...]
 * Output: docs/qa/evidence/<label>/lighthouse/{*.json, lighthouse.md}
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const [base = "http://localhost:3100", label = "drafts", runsArg = "3", ...pathsArg] = process.argv.slice(2);
const runs = Number(runsArg);
const paths = pathsArg.length ? pathsArg : ["/in/", "/uk/", "/gcc/", "/services/cloud-services", "/insights/events/house-of-lords-2026"];
const outDir = path.join("docs", "qa", "evidence", label, "lighthouse");
fs.mkdirSync(outDir, { recursive: true });
const npx = process.platform === "win32" ? "npx.cmd" : "npx";
const env = { ...process.env, CHROME_PATH: process.env.CHROME_PATH ?? "C:/Program Files/Google/Chrome/Application/chrome.exe", npm_config_cache: process.env.npm_config_cache ?? "E:/npm-cache" };

const median = (xs) => {
  const s = [...xs].filter((x) => typeof x === "number" && !Number.isNaN(x)).sort((a, b) => a - b);
  return s.length ? s[Math.floor(s.length / 2)] : null;
};
const ms = (v) => (v == null ? "n/a" : `${Math.round(v)} ms`);
const kb = (b) => `${Math.round(b / 1024)} KB`;

const md = [`# Lighthouse (mobile) ${label} ${base} ${new Date().toISOString()}`, "", `Median of ${runs} runs per URL, run alone on the development laptop (Lighthouse CLI, default mobile emulation: Moto G Power, 4x CPU slowdown).`, ""];
const summary = [];
for (const p of paths) {
  const slug = p.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "") || "root";
  const results = [];
  for (let i = 1; i <= runs; i++) {
    const out = path.join(outDir, `${slug}-run${i}.json`);
    try {
      execFileSync(npx, ["--yes", "lighthouse", `${base}${p}`, "--output=json", `--output-path=${out}`, "--quiet", "--chrome-flags=--headless=new --no-sandbox", "--only-categories=performance,accessibility,best-practices,seo", "--throttling-method=simulate"], { env, stdio: "pipe", shell: process.platform === "win32" });
      results.push(JSON.parse(fs.readFileSync(out, "utf8")));
      const a = results[results.length - 1].audits;
      console.log(`${p} run ${i}: perf ${Math.round(results[results.length - 1].categories.performance.score * 100)} LCP ${ms(a["largest-contentful-paint"].numericValue)} TBT ${ms(a["total-blocking-time"].numericValue)} CLS ${a["cumulative-layout-shift"].numericValue.toFixed(3)}`);
    } catch (e) {
      console.log(`${p} run ${i} failed: ${String(e).split("\n")[0]}`);
    }
  }
  if (!results.length) {
    md.push(`## ${p}`, "", "All runs failed.", "");
    continue;
  }
  const num = (id) => median(results.map((r) => r.audits[id]?.numericValue));
  const score = (cat) => median(results.map((r) => Math.round((r.categories[cat]?.score ?? 0) * 100)));
  const perf = score("performance");
  const lcp = num("largest-contentful-paint");
  const cls = num("cumulative-layout-shift");
  const tbt = num("total-blocking-time");
  const fcp = num("first-contentful-paint");
  const si = num("speed-index");
  const tti = num("interactive");
  const inp = num("interaction-to-next-paint");
  // Representative run: the one whose performance score equals the median (or the middle one).
  const rep = results.find((r) => Math.round(r.categories.performance.score * 100) === perf) ?? results[Math.floor(results.length / 2)];
  const a = rep.audits;
  const items = (id) => a[id]?.details?.items ?? [];
  const byType = {};
  for (const it of items("network-requests")) byType[it.resourceType] = (byType[it.resourceType] ?? 0) + (it.transferSize ?? 0);
  const scripts = items("network-requests").filter((i) => i.resourceType === "Script").sort((x, y) => (y.transferSize ?? 0) - (x.transferSize ?? 0)).slice(0, 8);
  const images = items("network-requests").filter((i) => i.resourceType === "Image").sort((x, y) => (y.transferSize ?? 0) - (x.transferSize ?? 0)).slice(0, 6);
  const fonts = items("network-requests").filter((i) => i.resourceType === "Font");
  const mainThread = items("mainthread-work-breakdown");
  const bootup = items("bootup-time").slice(0, 6);
  const lcpEl = a["largest-contentful-paint-element"]?.details?.items?.[0]?.items?.[0]?.node?.snippet ?? a["largest-contentful-paint-element"]?.details?.items?.[0]?.node?.snippet ?? "n/a";
  const dom = a["dom-size"]?.numericValue;
  summary.push({ p, perf, a11y: score("accessibility"), bp: score("best-practices"), seo: score("seo"), lcp, cls, tbt, inp, fcp, si, tti, dom, script: byType.Script ?? 0, image: byType.Image ?? 0, font: byType.Font ?? 0, doc: byType.Document ?? 0 });
  md.push(`## ${p}`, "", `| Metric | Median |`, `|---|---|`, `| Performance | ${perf} |`, `| Accessibility | ${score("accessibility")} |`, `| Best practices | ${score("best-practices")} |`, `| SEO | ${score("seo")} (noindex on staging is expected) |`, `| LCP | ${ms(lcp)} |`, `| CLS | ${cls == null ? "n/a" : cls.toFixed(3)} |`, `| TBT | ${ms(tbt)} |`, `| INP | ${inp == null ? "not measured by lab Lighthouse (field metric)" : ms(inp)} |`, `| FCP | ${ms(fcp)} |`, `| Speed Index | ${ms(si)} |`, `| TTI | ${ms(tti)} |`, `| DOM size | ${dom ?? "n/a"} elements |`, "", `Per-run performance: ${results.map((r) => Math.round(r.categories.performance.score * 100)).join(", ")}; TBT: ${results.map((r) => Math.round(r.audits["total-blocking-time"].numericValue)).join(", ")} ms; LCP: ${results.map((r) => Math.round(r.audits["largest-contentful-paint"].numericValue)).join(", ")} ms.`, "", `LCP element: \`${String(lcpEl).replace(/`/g, "'").slice(0, 160)}\``, "", `Transfer by type: document ${kb(byType.Document ?? 0)}, script ${kb(byType.Script ?? 0)}, stylesheet ${kb(byType.Stylesheet ?? 0)}, image ${kb(byType.Image ?? 0)}, font ${kb(byType.Font ?? 0)}, other ${kb(byType.Other ?? 0)}; requests ${items("network-requests").length}.`, "", "Largest scripts:", ...scripts.map((s) => `- ${kb(s.transferSize ?? 0)} ${s.url.replace(base, "")}`), "", "Largest images:", ...images.map((s) => `- ${kb(s.transferSize ?? 0)} ${s.url.replace(base, "").slice(0, 120)}`), "", `Fonts: ${fonts.map((f) => `${kb(f.transferSize ?? 0)} ${f.url.split("/").pop()}`).join(", ") || "none"}`, "", "Main-thread work:", ...mainThread.map((m) => `- ${m.groupLabel}: ${ms(m.duration)}`), "", "Script evaluation by origin/file (bootup-time):", ...bootup.map((b) => `- ${b.url.replace(base, "").slice(0, 100)}: total ${ms(b.total)}, scripting ${ms(b.scripting)}`), "", "Failing performance audits in the median run:", ...Object.values(a).filter((x) => x.score != null && x.score < 0.9 && x.scoreDisplayMode === "numeric" || (x.score != null && x.score < 0.5 && x.scoreDisplayMode === "binary")).filter((x) => rep.categories.performance.auditRefs.some((r) => r.id === x.id)).map((x) => `- ${x.title}: ${x.displayValue ?? ""}`), "");
}
const table = ["| URL | Perf | A11y | BP | SEO | LCP | CLS | TBT | FCP | SI | DOM | Script | Images | Fonts |", "|---|---|---|---|---|---|---|---|---|---|---|---|---|---|", ...summary.map((s) => `| ${s.p} | ${s.perf} | ${s.a11y} | ${s.bp} | ${s.seo} | ${ms(s.lcp)} | ${s.cls?.toFixed(3)} | ${ms(s.tbt)} | ${ms(s.fcp)} | ${ms(s.si)} | ${s.dom} | ${kb(s.script)} | ${kb(s.image)} | ${kb(s.font)} |`), ""];
const head = md.slice(0, 4);
const body = md.slice(4).filter((l, i) => !(i < table.length && table.includes(l)));
fs.writeFileSync(path.join(outDir, "lighthouse.md"), [...head, ...table, ...body].join("\n") + "\n");
console.log(table.join("\n"));
