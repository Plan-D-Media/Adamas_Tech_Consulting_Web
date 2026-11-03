/**
 * Per-section screenshots for design reviews.
 * Usage: tsx scripts/section-shots.ts <label> [baseUrl] [paths...]
 * Output: screenshots/<label>/<path>/<width>/NN-<section>.png  (1440 and 390 wide)
 * Uses a reduced-motion context so every section is captured in its settled state (pins off).
 */
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const WIDTHS = [1440, 390];
const [label = "shots", base = "http://localhost:3000", ...paths] = process.argv.slice(2);
const targets = paths.length ? paths : ["/in/", "/uk/", "/ae/"];

async function main() {
  const browser = await chromium.launch();
  for (const p of targets) {
    for (const width of WIDTHS) {
      const dir = path.resolve("screenshots", label, p.replace(/^\/|\/$/g, "").replace(/\//g, "_") || "root", String(width));
      fs.mkdirSync(dir, { recursive: true });
      const ctx = await browser.newContext({ viewport: { width, height: width < 768 ? 844 : 900 }, reducedMotion: "reduce" });
      await ctx.route(/player\.vimeo\.com|vimeocdn|challenges\.cloudflare/, (r) => r.abort());
      const page = await ctx.newPage();
      await page.goto(base + p, { waitUntil: "networkidle", timeout: 120_000 });
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 500) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 60));
        }
        window.scrollTo(0, 0);
      });
      await page.waitForTimeout(500);
      const sections = await page.$$("main section:not(section section), footer");
      let i = 0;
      for (const s of sections) {
        const box = await s.boundingBox();
        if (!box || box.height < 40) continue;
        const name = (await s.evaluate((el) => el.getAttribute("aria-label") || el.getAttribute("aria-labelledby") || el.querySelector("h1,h2,p")?.textContent || el.tagName))
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .slice(0, 40);
        i += 1;
        await s.screenshot({ path: path.join(dir, `${String(i).padStart(2, "0")}-${name}.png`) });
      }
      console.log(`${p} @${width}: ${i} sections`);
      await ctx.close();
    }
  }
  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
