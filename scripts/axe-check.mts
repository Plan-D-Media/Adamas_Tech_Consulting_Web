/**
 * Accessibility audit with axe-core (brief section 11): runs axe on each route at 1280px and 390px, with the mobile
 * drawer and every mega-menu panel opened, and lists violations by impact.
 * Usage: PLAYWRIGHT_BROWSERS_PATH=E:/ms-playwright MSYS_NO_PATHCONV=1 tsx scripts/axe-check.mts [baseUrl] [label] [routes...]
 * Output: screenshots/<label>/axe/<route>.json and a summary on stdout.
 */
import { chromium, type Page } from "playwright";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const axeSource = fs.readFileSync(require.resolve("axe-core/axe.min.js"), "utf8");

const base = (process.argv[2] ?? "http://localhost:3100").replace(/\/$/, "");
const label = process.argv[3] ?? "round7";
const routes = process.argv.length > 4 ? process.argv.slice(4) : ["/in/", "/uk/", "/gcc/"];
const outDir = path.join("screenshots", label, "axe");
fs.mkdirSync(outDir, { recursive: true });

interface Violation {
  id: string;
  impact: string;
  help: string;
  nodes: { target: string[]; html: string; failureSummary?: string }[];
}

async function run(page: Page, context: string): Promise<Violation[]> {
  await page.addScriptTag({ content: axeSource });
  const result = (await page.evaluate(`axe.run(document, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "best-practice"] } })`)) as { violations: Violation[] };
  return result.violations.map((v) => ({ ...v, help: `${v.help} [${context}]`, nodes: v.nodes.map((n) => ({ target: n.target, html: n.html.slice(0, 140), failureSummary: n.failureSummary?.slice(0, 220) })) }));
}

const browser = await chromium.launch();
const summary: string[] = [];
try {
  for (const route of routes) {
    const all: Violation[] = [];
    for (const width of [1280, 390]) {
      const ctx = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: "reduce" });
      const page = await ctx.newPage();
      await page.goto(`${base}${route}`, { waitUntil: "load" });
      await page.waitForTimeout(1200);
      await page.evaluate(() => document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => el.setAttribute("data-revealed", "")));
      all.push(...(await run(page, `${width}px`)));
      if (width === 1280) {
        for (const key of await page.$$eval("button[data-menu-key]", (els) => els.map((e) => e.getAttribute("data-menu-key")!))) {
          await page.click(`button[data-menu-key="${key}"]`);
          await page.waitForTimeout(400);
          all.push(...(await run(page, `menu ${key}`)));
          await page.keyboard.press("Escape");
        }
      } else {
        await page.click(".nav-drawer > summary");
        await page.waitForTimeout(300);
        all.push(...(await run(page, "drawer open")));
      }
      await ctx.close();
    }
    // De-duplicate by rule + first target.
    const seen = new Set<string>();
    const unique = all.filter((v) => {
      const k = `${v.id}|${v.nodes[0]?.target.join(" ")}`;
      return !seen.has(k) && !!seen.add(k);
    });
    const name = route.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "") || "root";
    fs.writeFileSync(path.join(outDir, `${name}.json`), JSON.stringify(unique, null, 2));
    const counts = { critical: 0, serious: 0, moderate: 0, minor: 0 } as Record<string, number>;
    for (const v of unique) counts[v.impact] = (counts[v.impact] ?? 0) + 1;
    summary.push(`${route}: critical ${counts.critical}, serious ${counts.serious}, moderate ${counts.moderate}, minor ${counts.minor}`);
    for (const v of unique) summary.push(`  [${v.impact}] ${v.id}: ${v.help} (${v.nodes.length} node${v.nodes.length === 1 ? "" : "s"}; e.g. ${v.nodes[0]?.target.join(" ")})`);
  }
} finally {
  await browser.close();
}
fs.writeFileSync(path.join(outDir, "summary.txt"), summary.join("\n") + "\n");
console.log(summary.join("\n"));
