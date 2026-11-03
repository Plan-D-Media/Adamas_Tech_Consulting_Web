/**
 * Screenshots and a scroll recording of the company journey on /about.
 * Usage: tsx scripts/journey-shots.ts [baseUrl] [label]
 * Output: screenshots/<label>/journey/: 390-section.png, 1440-section-static.png (reduced motion),
 *         1440-pinned-NN.png (frames through the pin) and a .webm of real wheel scrolling through the section.
 */
import { chromium, type Page } from "playwright";
import fs from "node:fs";
import path from "node:path";

const [base = "http://localhost:3100", label = "round3"] = process.argv.slice(2);
const OUT = path.resolve("screenshots", label, "journey");
fs.mkdirSync(OUT, { recursive: true });
const BLOCK = (p: Page) => p.addStyleTag({ content: "iframe{visibility:hidden}" });

async function sectionShot(page: Page, file: string) {
  // Story section = intro + journey; capture it whole (pin spacer included when pinned).
  const box = await page.evaluate(() => {
    const s = document.getElementById("story")!;
    const r = s.getBoundingClientRect();
    return { y: r.top + scrollY, h: r.height };
  });
  await page.evaluate((y) => window.scrollTo(0, y), box.y);
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(OUT, file), fullPage: true, clip: { x: 0, y: box.y, width: page.viewportSize()!.width, height: box.h } });
}

(async () => {
  const b = await chromium.launch();

  // 390: vertical timeline (reveal on scroll; scroll through first so every milestone has revealed).
  {
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
    await ctx.route(/player\.vimeo\.com|vimeocdn|challenges\.cloudflare/, (r) => r.abort());
    const p = await ctx.newPage();
    await p.goto(`${base}/about`, { waitUntil: "networkidle" });
    await BLOCK(p);
    const h = await p.evaluate(() => document.body.scrollHeight);
    for (let y = 0; y < h; y += 400) {
      await p.evaluate((v) => window.scrollTo(0, v), y);
      await p.waitForTimeout(120);
    }
    await p.waitForTimeout(800);
    await sectionShot(p, "390-section.png");
    await ctx.close();
  }

  // 1440 reduced motion: static timeline, everything visible.
  {
    const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
    await ctx.route(/player\.vimeo\.com|vimeocdn|challenges\.cloudflare/, (r) => r.abort());
    const p = await ctx.newPage();
    await p.goto(`${base}/about`, { waitUntil: "networkidle" });
    await BLOCK(p);
    await sectionShot(p, "1440-section-static.png");
    await ctx.close();
  }

  // 1440 pinned: frames + video, scrolling with real wheel input (Lenis + ScrollTrigger as for a visitor).
  {
    const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, recordVideo: { dir: OUT, size: { width: 1440, height: 900 } } });
    await ctx.route(/player\.vimeo\.com|vimeocdn|challenges\.cloudflare/, (r) => r.abort());
    const p = await ctx.newPage();
    await p.goto(`${base}/about`, { waitUntil: "networkidle" });
    await BLOCK(p);
    await p.waitForTimeout(2500); // Lenis starts on idle
    await sectionShot(p, "1440-section-unpinned-top.png").catch(() => {});
    await p.evaluate(() => window.scrollTo(0, 0));
    await p.waitForTimeout(600);
    // Approach the journey block.
    for (let guard = 0; guard < 200; guard++) {
      const top = await p.$eval(".journey", (e) => e.getBoundingClientRect().top);
      if (top < 40) break;
      await p.mouse.wheel(0, Math.min(200, top));
      await p.waitForTimeout(70);
    }
    await p.waitForTimeout(1200);
    let frame = 0;
    const shot = async () => p.screenshot({ path: path.join(OUT, `1440-pinned-${String(frame++).padStart(2, "0")}.png`) });
    await shot();
    const distance = await p.evaluate(() => {
      const spacer = document.querySelector(".journey")!.parentElement!;
      return spacer.classList.contains("pin-spacer") ? spacer.offsetHeight - innerHeight : 0;
    });
    console.log("pin distance:", distance);
    for (let moved = 0; moved < distance + 300; moved += 120) {
      await p.mouse.wheel(0, 120);
      await p.waitForTimeout(90);
      if (moved % 480 === 0) {
        await p.waitForTimeout(900);
        await shot();
      }
    }
    await p.waitForTimeout(1200);
    await shot();
    // Click a year marker on the way back: scroll up into the pin, then click marker 02.
    for (let i = 0; i < 12; i++) {
      await p.mouse.wheel(0, -150);
      await p.waitForTimeout(80);
    }
    await p.waitForTimeout(1500);
    const marker = p.locator('[data-journey-marker="1"]');
    if (await marker.isVisible()) {
      await marker.click();
      await p.waitForTimeout(1800);
      await shot();
      console.log("after clicking marker 02, active:", await p.$eval("[data-journey-marker][aria-current]", (e) => e.getAttribute("data-journey-marker")).catch(() => "none"));
    }
    await ctx.close();
    const vids = fs.readdirSync(OUT).filter((f) => f.endsWith(".webm"));
    console.log("video:", vids.map((v) => path.join(OUT, v)).join(", "));
  }
  await b.close();
  console.log("out:", OUT);
})().catch((e) => {
  console.error("FAILED:", String(e).split("\n")[0]);
  process.exit(1);
});
