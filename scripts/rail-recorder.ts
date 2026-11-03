/**
 * Records the scroll-driven sections in motion for review (video + frame sequence) and checks pin geometry.
 * Usage: tsx scripts/rail-recorder.ts [baseUrl] [path] [label]
 * Output: screenshots/<label>/motion/<path>/ (frames: NN-<section>-<step>.png, video: *.webm)
 * Scrolls with real wheel input so Lenis and ScrollTrigger behave as they do for a visitor.
 */
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const [base = "http://localhost:3000", p = "/in/", label = "round2"] = process.argv.slice(2);
const W = 1440;
const H = 900;

async function main() {
  const out = path.resolve("screenshots", label, "motion", p.replace(/^\/|\/$/g, "").replace(/\//g, "_") || "root");
  fs.mkdirSync(out, { recursive: true });
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: W, height: H }, recordVideo: { dir: out, size: { width: W, height: H } } });
  await ctx.route(/player\.vimeo\.com|vimeocdn|challenges\.cloudflare/, (r) => r.abort());
  const page = await ctx.newPage();
  const errors: string[] = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(String(e)));

  await page.goto(base + p, { waitUntil: "networkidle", timeout: 120_000 });
  await page.waitForTimeout(2500); // Lenis starts on idle

  const rails = await page.$$eval("section.rail", (els) => els.map((e) => e.getAttribute("aria-labelledby") ?? "rail"));
  console.log("rails:", rails.join(", "));

  for (const [ri, id] of rails.entries()) {
    const sel = `section.rail[aria-labelledby="${id}"]`;
    // Approach: wheel down until the section top is just below the viewport top.
    for (let guard = 0; guard < 200; guard++) {
      const top = await page.$eval(sel, (e) => e.getBoundingClientRect().top);
      if (top < 160) break;
      await page.mouse.wheel(0, Math.min(240, top - 80));
      await page.waitForTimeout(60);
    }
    await page.waitForTimeout(700);
    const info = await page.$eval(sel, (e: HTMLElement) => {
      const spacer = e.parentElement?.classList.contains("pin-spacer") ? (e.parentElement as HTMLElement) : null;
      const track = e.querySelector<HTMLElement>(".rail-track")!;
      return {
        pinned: e.hasAttribute("data-pinned"),
        sectionH: e.offsetHeight,
        spacerH: spacer?.offsetHeight ?? null,
        distance: track.scrollWidth - track.clientWidth,
      };
    });
    console.log(id, JSON.stringify(info));

    // Through the pin: frames every ~third of a card.
    const steps = 14;
    const stepPx = Math.max(120, Math.round((info.distance + 200) / steps));
    for (let s = 0; s <= steps; s++) {
      await page.screenshot({ path: path.join(out, `${String(ri + 1).padStart(2, "0")}-${id}-${String(s).padStart(2, "0")}.png` ) });
      await page.mouse.wheel(0, stepPx);
      await page.waitForTimeout(450);
    }
    // After the pin: the next section must follow without a gap or overlap.
    await page.waitForTimeout(800);
    const after = await page.$eval(sel, (e) => {
      const host = e.parentElement?.classList.contains("pin-spacer") ? e.parentElement : e;
      const next = host.nextElementSibling as HTMLElement | null;
      const r = host.getBoundingClientRect();
      return { bottom: Math.round(r.bottom), nextTop: next ? Math.round(next.getBoundingClientRect().top) : null, counter: e.querySelector("p[aria-hidden]")?.textContent };
    });
    console.log(id, "after pin:", JSON.stringify(after));
    await page.screenshot({ path: path.join(out, `${String(ri + 1).padStart(2, "0")}-${id}-zz-after.png`) });

    // Reverse a little: scrolling up re-enters the pin cleanly.
    for (let s = 0; s < 4; s++) {
      await page.mouse.wheel(0, -stepPx);
      await page.waitForTimeout(350);
    }
    await page.screenshot({ path: path.join(out, `${String(ri + 1).padStart(2, "0")}-${id}-zz-reverse.png`) });
    for (let s = 0; s < 6; s++) {
      await page.mouse.wheel(0, stepPx);
      await page.waitForTimeout(250);
    }
  }

  console.log("console errors:", errors.length ? errors : "none");
  await ctx.close();
  await browser.close();
  for (const f of fs.readdirSync(out)) if (f.endsWith(".webm")) console.log("video:", path.join(out, f));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
