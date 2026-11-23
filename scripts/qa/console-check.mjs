#!/usr/bin/env node
/**
 * Browser console errors and warnings per route, including React's hydration and DOM-attribute complaints,
 * which only the development build reports.
 *
 *   PLAYWRIGHT_BROWSERS_PATH=E:/ms-playwright node scripts/qa/console-check.mjs http://localhost:3000 /in/ /uk/
 *
 * Scrolls the page to the bottom first, so anything that only mounts near the viewport (the homepage's 3D orb,
 * lazy images, the reveal tweens) has run before the page is judged. Next's own dev-overlay chatter and the
 * Fast Refresh notices are filtered; everything else is printed with its location.
 *
 * One class of message is reported separately rather than counted as a fault: next/image's "was detected as
 * the Largest Contentful Paint" advice. Scrolling the whole page makes a below-the-fold image the largest
 * thing ever painted, so the advisory fires for images that are not the real LCP - and following it (marking
 * them `priority`) would make LCP worse. Run with --no-scroll to judge the page as a visitor who never
 * scrolls, which is the state those warnings are about.
 */
import { chromium } from "playwright";

const argv = process.argv.slice(2);
/** --no-scroll judges the page as a visitor who never scrolls, which is how next/image decides the LCP. */
const scrollThrough = !argv.includes("--no-scroll");
const base = (argv[0] ?? "http://localhost:3000").replace(/\/$/, "");
const routes = argv.slice(1).filter((a) => !a.startsWith("--"));
if (routes.length === 0) routes.push("/in/");

/** next/image's LCP advice, which a scripted full-page scroll triggers spuriously (see the docblock). */
const LCP_ADVISORY = /was detected as the Largest Contentful Paint/i;

/** Noise from the dev server itself, not from the site. */
const IGNORE = [
  /\[Fast Refresh\]/i,
  /Download the React DevTools/i,
  /react-devtools/i,
  /Next\.js \(/i,
  /webpack-hmr|turbopack-hmr/i,
  /\[HMR\]/i,
];

const browser = await chromium.launch();
let total = 0;
let advisoryTotal = 0;

for (const route of routes) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const found = [];
  const advisories = [];

  page.on("console", (msg) => {
    const type = msg.type();
    if (type !== "error" && type !== "warning") return;
    const text = msg.text();
    if (IGNORE.some((re) => re.test(text))) return;
    const loc = msg.location();
    const line = `[${type}] ${text}${loc?.url ? `  (${loc.url}:${loc.lineNumber})` : ""}`;
    if (scrollThrough && LCP_ADVISORY.test(text)) advisories.push(line);
    else found.push(line);
  });
  page.on("pageerror", (err) => found.push(`[pageerror] ${err.message}`));

  await page.goto(`${base}${route}`, { waitUntil: "load", timeout: 90000 });
  if (scrollThrough)
    await page.evaluate(async () => {
      const step = window.innerHeight;
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 160));
      }
      window.scrollTo(0, 0);
    });
  await page.waitForTimeout(1500);

  const tail = advisories.length ? `  (+${advisories.length} LCP advisory from the scripted scroll)` : "";
  console.log(`${route.padEnd(36)} ${found.length === 0 ? "clean" : `${found.length} message(s)`}${tail}`);
  for (const f of found) console.log(`    ${f}`);
  total += found.length;
  advisoryTotal += advisories.length;
  await ctx.close();
}

await browser.close();
console.log(`\n${total} console error(s)/warning(s) across ${routes.length} route(s)`);
if (advisoryTotal) console.log(`${advisoryTotal} next/image LCP advisory message(s) from the scripted scroll - not faults`);
process.exit(total === 0 ? 0 : 1);
