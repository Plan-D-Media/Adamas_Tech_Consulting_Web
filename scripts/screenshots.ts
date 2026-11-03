/**
 * Milestone QA screenshots at the brief's breakpoints.
 * Usage: npm run screenshots -- [baseUrl] [paths...]   (defaults: http://localhost:3000, /in/)
 * Output: screenshots/<path>/<width>.png (full page) + <width>-fold.png (first viewport)
 * Also reports horizontal overflow and console errors per page.
 */
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const WIDTHS = [360, 768, 1024, 1280, 1440];
const [base = "http://localhost:3000", ...paths] = process.argv.slice(2);
const targets = paths.length ? paths : ["/in/"];
const OUT = path.resolve(process.cwd(), "screenshots");

async function main() {
  const browser = await chromium.launch();
  for (const p of targets) {
    const dir = path.join(OUT, p.replace(/^\/|\/$/g, "").replace(/\//g, "_") || "root");
    fs.mkdirSync(dir, { recursive: true });
    for (const width of WIDTHS) {
      const height = width < 768 ? 780 : width < 1280 ? 1000 : 900;
      const ctx = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1, reducedMotion: "no-preference" });
      // Vimeo challenges headless browsers; block it so captures show the posters.
      await ctx.route(/player\.vimeo\.com|vimeocdn|challenges\.cloudflare/, (r) => r.abort());
      const page = await ctx.newPage();
      const errors: string[] = [];
      page.on("console", (m) => m.type() === "error" && !/vimeo|cloudflare|Content Security Policy|ERR_FAILED/i.test(m.text() + (m.location().url ?? "")) && errors.push(m.text()));
      page.on("pageerror", (e) => errors.push(String(e)));
      await page.goto(base + p, { waitUntil: "networkidle", timeout: 90_000 });
      await page.waitForTimeout(1500);
      await page.screenshot({ path: path.join(dir, `${width}-fold.png`) });
      // Mid-page frame: the pinned "What we do" explorer with motion on.
      const pinned = await page.$("[aria-label='Service pillars']");
      if (pinned && width >= 1024) {
        await page.evaluate(() => {
          const s = document.querySelector("[aria-label='Service pillars']")?.closest("section");
          if (s) window.scrollTo(0, s.getBoundingClientRect().top + window.scrollY + window.innerHeight * 1.2);
        });
        await page.waitForTimeout(1200);
        await page.screenshot({ path: path.join(dir, `${width}-explorer.png`) });
      }
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      // Full page in a reduced-motion context: static states, no pinning (a pinned section can't be captured full-page).
      const still = await browser.newContext({ viewport: { width, height }, reducedMotion: "reduce" });
      await still.route(/player\.vimeo\.com|vimeocdn|challenges\.cloudflare/, (r) => r.abort());
      const sp = await still.newPage();
      sp.on("pageerror", (e) => errors.push(String(e)));
      await sp.goto(base + p, { waitUntil: "networkidle", timeout: 90_000 });
      await sp.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 600) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 80));
        }
        window.scrollTo(0, 0);
      });
      await sp.waitForTimeout(600);
      await sp.screenshot({ path: path.join(dir, `${width}.png`), fullPage: true });
      await still.close();
      console.log(`${p} @${width}: overflow=${overflow}px errors=${errors.length}${errors.length ? "\n  " + errors.slice(0, 5).join("\n  ") : ""}`);
      await ctx.close();
    }
  }
  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
