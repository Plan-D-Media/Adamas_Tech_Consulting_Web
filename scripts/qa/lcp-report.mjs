/**
 * LCP evidence from Lighthouse JSON runs, for the before-and-after comparison (17 Nov 2026).
 *
 * Pulls out the few numbers that actually explain an LCP, rather than the score: the element Lighthouse picked, the
 * four LCP phases (TTFB, load delay, load time, render delay), Google's own LCP discovery checklist (is
 * fetchpriority=high applied, is the request discoverable in the HTML, is lazy loading off), the paint timings
 * observed in the trace, main-thread script evaluation, and the transfer weight per resource type. The median run
 * per URL is used, chosen by LCP so the reported phases belong to the run whose LCP is quoted.
 *
 * Usage:
 *   node scripts/qa/lcp-report.mjs <label> [label2 ...]
 * Reads docs/qa/evidence/<label>/lighthouse/*.json (as written by scripts/qa/lighthouse.mjs) and writes
 * docs/qa/evidence/phase2/lcp-<label>[-vs-<label2>].md, printing the same table to stdout.
 */
import fs from "node:fs";
import path from "node:path";

const labels = process.argv.slice(2);
if (labels.length === 0) {
  console.error("usage: node scripts/qa/lcp-report.mjs <label> [label2 ...]");
  process.exit(1);
}

const ms = (v) => (typeof v === "number" ? `${Math.round(v)} ms` : "n/a");
const kb = (b) => (typeof b === "number" ? `${Math.round(b / 1024)} KB` : "n/a");

function runsFor(label) {
  const dir = path.join("docs", "qa", "evidence", label, "lighthouse");
  if (!fs.existsSync(dir)) return {};
  const byUrl = {};
  for (const f of fs.readdirSync(dir).filter((n) => n.endsWith(".json"))) {
    let r;
    try {
      r = JSON.parse(fs.readFileSync(path.join(dir, f), "utf8"));
    } catch {
      continue;
    }
    const url = new URL(r.finalDisplayedUrl ?? r.finalUrl ?? r.requestedUrl).pathname;
    (byUrl[url] ??= []).push(r);
  }
  return byUrl;
}

/** The run whose LCP is the median, so the phases quoted belong to the LCP quoted. */
function medianRun(runs) {
  const sorted = [...runs].sort((a, b) => (a.audits["largest-contentful-paint"]?.numericValue ?? 0) - (b.audits["largest-contentful-paint"]?.numericValue ?? 0));
  return sorted[Math.floor(sorted.length / 2)];
}

function extract(run) {
  const a = run.audits;
  const metrics = a.metrics?.details?.items?.[0] ?? {};
  const phaseRows = a["largest-contentful-paint-element"]?.details?.items ?? [];
  const phases = {};
  for (const group of phaseRows) for (const row of group.items ?? []) if (row.phase) phases[row.phase] = row.timing;
  const elementItem = phaseRows.flatMap((g) => g.items ?? []).find((i) => i.node) ?? phaseRows.find((g) => g.node);
  const element = (elementItem?.node ?? elementItem)?.snippet ?? a["largest-contentful-paint-element"]?.details?.items?.[0]?.items?.[0]?.node?.snippet ?? null;

  // Google's LCP discovery checklist: the three things that decide whether an above-the-fold image paints early.
  const checklist = (a["lcp-discovery-insight"] ?? a["prioritize-lcp-image"])?.details?.items?.find((i) => i.type === "checklist")?.items ?? {};
  const bootup = a["bootup-time"]?.details?.items ?? [];
  const byType = {};
  for (const item of a["resource-summary"]?.details?.items ?? []) byType[item.resourceType] = item.transferSize;

  return {
    score: Math.round((run.categories?.performance?.score ?? 0) * 100),
    lcp: a["largest-contentful-paint"]?.numericValue,
    fcp: a["first-contentful-paint"]?.numericValue,
    tbt: a["total-blocking-time"]?.numericValue,
    tti: a.interactive?.numericValue,
    cls: a["cumulative-layout-shift"]?.numericValue,
    element: element ? String(element).replace(/\s+/g, " ").slice(0, 90) : null,
    phases,
    priorityHinted: checklist.priorityHinted?.value,
    requestDiscoverable: checklist.requestDiscoverable?.value,
    eagerlyLoaded: checklist.eagerlyLoaded?.value,
    observedFirstPaint: metrics.observedFirstPaint,
    observedFcp: metrics.observedFirstContentfulPaint,
    observedLcp: metrics.observedLargestContentfulPaint,
    observedLoad: metrics.observedLoad,
    scriptEval: a["mainthread-work-breakdown"]?.details?.items?.find((i) => /Script Evaluation/i.test(i.group ?? i.groupLabel ?? ""))?.duration,
    scriptTotal: bootup.reduce((sum, i) => sum + (i.scripting ?? 0), 0),
    scriptKb: byType.script,
    totalKb: byType.total,
    domNodes: a["dom-size"]?.numericValue,
  };
}

const data = {};
for (const label of labels) {
  const byUrl = runsFor(label);
  data[label] = {};
  for (const [url, runs] of Object.entries(byUrl)) data[label][url] = { ...extract(medianRun(runs)), runs: runs.length };
}

const urls = [...new Set(labels.flatMap((l) => Object.keys(data[l] ?? {})))].sort();
const out = [`# LCP evidence ${labels.join(" vs ")} (${new Date().toISOString()})`, ""];
out.push("Median run per URL, chosen by LCP, so the phases belong to the run whose LCP is quoted. Lighthouse mobile, simulated throttling.", "");
out.push("| URL | Run | Perf | LCP | FCP | TBT | TTI | Render delay | fetchpriority=high | Script eval | Script KB | DOM |");
out.push("|---|---|---|---|---|---|---|---|---|---|---|---|");
for (const url of urls) {
  for (const label of labels) {
    const d = data[label]?.[url];
    if (!d) continue;
    out.push(
      `| ${url} | ${label} (${d.runs}) | ${d.score} | ${ms(d.lcp)} | ${ms(d.fcp)} | ${ms(d.tbt)} | ${ms(d.tti)} | ${ms(d.phases["Render Delay"])} | ${d.priorityHinted === undefined ? "n/a" : d.priorityHinted ? "yes" : "NO"} | ${ms(d.scriptEval ?? d.scriptTotal)} | ${kb(d.scriptKb)} | ${d.domNodes ?? "n/a"} |`,
    );
  }
}
out.push("");

for (const url of urls) {
  out.push(`## ${url}`, "");
  for (const label of labels) {
    const d = data[label]?.[url];
    if (!d) continue;
    out.push(`### ${label}`, "");
    out.push(`- LCP element: \`${d.element ?? "not reported"}\``);
    out.push(`- phases: ${Object.entries(d.phases).map(([k, v]) => `${k} ${ms(v)}`).join(", ") || "not reported"}`);
    out.push(`- LCP image checklist: fetchpriority=high ${d.priorityHinted ? "applied" : "NOT applied"}, discoverable in the HTML ${d.requestDiscoverable ? "yes" : "no"}, lazy loading off ${d.eagerlyLoaded ? "yes" : "no"}`);
    out.push(`- observed in the trace: first paint ${ms(d.observedFirstPaint)}, FCP ${ms(d.observedFcp)}, LCP ${ms(d.observedLcp)}, load event ${ms(d.observedLoad)}`);
    out.push(`- main thread: script evaluation ${ms(d.scriptEval)}, total scripting across files ${ms(d.scriptTotal)}`);
    out.push(`- transfer: script ${kb(d.scriptKb)}, total ${kb(d.totalKb)}; DOM ${d.domNodes ?? "n/a"} elements`, "");
  }
}

const name = `lcp-${labels.join("-vs-")}.md`;
const file = path.join("docs", "qa", "evidence", "phase2", name);
fs.mkdirSync(path.dirname(file), { recursive: true });
fs.writeFileSync(file, out.join("\n") + "\n");
console.log(out.join("\n"));
console.log(`\n-> ${file}`);
