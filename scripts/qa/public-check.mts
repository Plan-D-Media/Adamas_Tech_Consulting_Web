/**
 * Public-configuration check (PREVIEW_DRAFTS=false), run against a dev server because the production build fails
 * in this configuration (BUG-001). Checks: draft strings and placeholder tags on the key pages, the event page
 * status, every homepage link's status (dead links to DRAFT content), the sitemap, and React hydration warnings
 * in the browser console (dev mode reports them; production does not).
 *
 * Usage: PLAYWRIGHT_BROWSERS_PATH=E:/ms-playwright MSYS_NO_PATHCONV=1 npx tsx scripts/qa/public-check.mts <baseUrl> <label>
 * Output: docs/qa/evidence/<label>/{crawl.md,dead-links.md,hydration.md}
 */
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const base = (process.argv[2] ?? "http://localhost:3101").replace(/\/+$/, "");
const label = process.argv[3] ?? "public";
const outDir = path.join("docs", "qa", "evidence", label);
fs.mkdirSync(outDir, { recursive: true });

const PAGES = ["/in/", "/uk/", "/gcc/", "/services/cloud-services", "/services/cloud-services/migration-modernization", "/services/digital-transformation", "/services/ai-services", "/insights/events/house-of-lords-2026", "/insights/events", "/solutions", "/case-studies", "/case-studies/sap-treasury-cash-forecasting", "/about", "/contact"];
const DRAFT_STRINGS = ["100% Satisfied", "100% SATISFIED", "Zero Risk", "ZERO RISK", "30%", "500+", "DRAFT", "Draft", "to be confirmed", "TO BE CONFIRMED", "[", "Lorem", "TBD", "Middle East"];

async function get(url: string) {
  for (let i = 0; i < 3; i++) {
    try {
      const r = await fetch(url, { redirect: "manual", headers: { connection: "close" } });
      return { status: r.status, location: r.headers.get("location"), text: await r.text() };
    } catch {
      await new Promise((res) => setTimeout(res, 800));
    }
  }
  return { status: 0, location: null, text: "" };
}

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const rows: string[] = ["# Public configuration (PREVIEW_DRAFTS=false) crawl", "", `Base ${base}, ${new Date().toISOString()} (dev server; the production build cannot be made in this configuration, see BUG-001).`, "", "| URL | Status | H1 | Draft strings found | Placeholder tags | Links on page | Dead links |", "|---|---|---|---|---|---|---|"];
const dead: string[] = ["# Dead links from the public homepages and key pages", ""];
const hydration: string[] = ["# Hydration and console warnings (dev server)", ""];
const seenLinks = new Map<string, number>();
for (const route of PAGES) {
  const page = await ctx.newPage();
  const consoleMsgs: string[] = [];
  page.on("console", (m) => (m.type() === "error" || m.type() === "warning") && consoleMsgs.push(`${m.type()}: ${m.text().replace(/\s+/g, " ").slice(0, 400)}`));
  page.on("pageerror", (e) => consoleMsgs.push(`pageerror: ${String(e).slice(0, 300)}`));
  let status: number | null = null;
  try {
    const resp = await page.goto(`${base}${route}`, { waitUntil: "load", timeout: 120_000 });
    status = resp?.status() ?? null;
    await page.waitForTimeout(2500);
    const total = await page.evaluate(() => document.body.scrollHeight);
    for (let y = 0; y < total; y += 800) {
      await page.evaluate((yy) => window.scrollTo(0, yy), y);
      await page.waitForTimeout(50);
    }
    await page.waitForTimeout(1500);
  } catch (e) {
    consoleMsgs.push(`NAV FAILED ${String(e).split("\n")[0]}`);
  }
  const data = (await page.evaluate(`(() => {
    const text = document.body ? document.body.innerText : "";
    const h1 = document.querySelectorAll("h1").length;
    const tags = Array.from(document.querySelectorAll("*")).filter((el) => el.children.length === 0 && /to be confirmed|DRAFT/i.test(el.textContent || "") && el.closest("main")).map((el) => (el.textContent || "").trim().slice(0, 40));
    const links = Array.from(new Set(Array.from(document.querySelectorAll("a[href]")).map((a) => a.getAttribute("href") || "").filter((h) => h.startsWith("/") && !h.startsWith("//")).map((h) => h.split("#")[0]).filter(Boolean)));
    return { text, h1, tags, links };
  })()`).catch(() => ({ text: "", h1: 0, tags: [], links: [] }))) as { text: string; h1: number; tags: string[]; links: string[] };
  const found = DRAFT_STRINGS.filter((s) => data.text.includes(s)).map((s) => `${s} x${data.text.split(s).length - 1}`);
  // Only count a bracket when it is a placeholder, not a CSS token.
  const deadHere: string[] = [];
  for (const href of data.links) {
    if (!seenLinks.has(href)) {
      const r = await get(`${base}${href}`);
      let final = r.status;
      if (r.status >= 300 && r.status < 400 && r.location) final = (await get(new URL(r.location, base).toString())).status;
      seenLinks.set(href, final);
    }
    const st = seenLinks.get(href)!;
    if (st >= 400 || st === 0) deadHere.push(`${href} (${st})`);
  }
  rows.push(`| ${route} | ${status} | ${data.h1} | ${found.join(", ") || "none"} | ${data.tags.length ? data.tags.slice(0, 6).join("; ") : "none"} | ${data.links.length} | ${deadHere.length} |`);
  if (deadHere.length) dead.push(`## ${route}`, "", ...deadHere.map((d) => `- ${d}`), "");
  const hyd = consoleMsgs.filter((m) => /hydrat|did not match|server rendered|Warning:|Each child|key/i.test(m));
  hydration.push(`## ${route} (${status})`, "", ...(consoleMsgs.length ? consoleMsgs.map((m) => `- ${m}`) : ["- (no console errors or warnings)"]), "", `Hydration-related: ${hyd.length}`, "");
  console.log(`${route}: ${status} h1=${data.h1} drafts=[${found.join(", ")}] tags=${data.tags.length} links=${data.links.length} dead=${deadHere.length} console=${consoleMsgs.length} hydration=${hyd.length}`);
  await page.close();
}
await browser.close();
const sitemap = await get(`${base}/sitemap.xml`);
const urls = [...sitemap.text.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(/^https?:\/\/[^/]+/, ""));
rows.push("", `Sitemap: ${urls.length} URLs. Contains the event page: ${urls.includes("/insights/events/house-of-lords-2026")}. Contains case studies: ${urls.filter((u) => u.startsWith("/case-studies/")).length}.`, "", `Event page direct request: ${(await get(`${base}/insights/events/house-of-lords-2026`)).status}; calendar: ${(await get(`${base}/insights/events/house-of-lords-2026/calendar`)).status}; draft case study: ${(await get(`${base}/case-studies/sap-treasury-cash-forecasting`)).status}; draft solution /solutions/ai-solution-4: ${(await get(`${base}/solutions/ai-solution-4`)).status}.`);
fs.writeFileSync(path.join(outDir, "crawl.md"), rows.join("\n") + "\n");
fs.writeFileSync(path.join(outDir, "dead-links.md"), (dead.length > 2 ? dead : [...dead, "none"]).join("\n") + "\n");
fs.writeFileSync(path.join(outDir, "hydration.md"), hydration.join("\n") + "\n");
console.log(rows.slice(-3).join("\n"));
