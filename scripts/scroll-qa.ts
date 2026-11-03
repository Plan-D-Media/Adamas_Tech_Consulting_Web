/**
 * Scroll-behaviour QA for the pinned rails across engines (brief §5).
 * Usage: tsx scripts/scroll-qa.ts [baseUrl] [path]
 * On /about the same checks run against the pinned company journey (.journey), plus year-marker clicks and a
 * reduced-motion check; on mobile it checks the vertical, unpinned timeline instead of the swipe rail.
 * Engines: Chromium, Edge (installed channel), Firefox and WebKit (Playwright builds under E:\ms-playwright).
 * ENGINES=webkit,firefox limits the run. Prints one PASS/FAIL line per check and writes screenshots/round2/scroll-qa/<engine>-*.png.
 */
import { chromium, firefox, webkit, type Browser, type Page } from "playwright";
import fs from "node:fs";
import path from "node:path";

const [base = "http://localhost:3000", p = "/in/"] = process.argv.slice(2);
const OUT = path.resolve("screenshots", "round2", "scroll-qa");
fs.mkdirSync(OUT, { recursive: true });
const PW_E = "E:\\ms-playwright";

function exe(prefix: string, rel: string): string | undefined {
  if (!fs.existsSync(PW_E)) return undefined;
  const dir = fs.readdirSync(PW_E).filter((d) => d.startsWith(prefix)).sort().pop();
  return dir ? path.join(PW_E, dir, rel) : undefined;
}

const engines: { name: string; launch: () => Promise<Browser> }[] = [
  { name: "chromium", launch: () => chromium.launch() },
  { name: "edge", launch: () => chromium.launch({ channel: "msedge" }) },
  { name: "firefox", launch: () => firefox.launch({ executablePath: exe("firefox-", "firefox\\firefox.exe") }) },
  { name: "webkit", launch: () => webkit.launch({ executablePath: exe("webkit-", "Playwright.exe") }) },
];

const results: string[] = [];
const check = (engine: string, name: string, ok: boolean, detail = "") => {
  const line = `${ok ? "PASS" : "FAIL"}  ${engine.padEnd(8)} ${name}${detail ? `  (${detail})` : ""}`;
  results.push(line);
  console.log(line);
};

const JOURNEY = p.startsWith("/about");
const RAIL = JOURNEY ? ".journey" : 'section.rail[aria-labelledby="solutions-heading"]';
const TRACK = JOURNEY ? ".journey-track" : ".rail-track";

/** Geometry of the first pinned rail: document offsets of its spacer and the track's current x. */
async function geo(page: Page) {
  return page.evaluate(([sel, trackSel]) => {
    const s = document.querySelector<HTMLElement>(sel)!;
    const host = s.parentElement?.classList.contains("pin-spacer") ? s.parentElement! : s;
    const track = s.querySelector<HTMLElement>(trackSel)!;
    const m = new DOMMatrixReadOnly(getComputedStyle(track).transform);
    const r = host.getBoundingClientRect();
    const next = host.nextElementSibling as HTMLElement | null;
    return {
      pinned: s.hasAttribute("data-pinned"),
      top: r.top + scrollY,
      height: host.offsetHeight,
      sectionTop: s.getBoundingClientRect().top,
      x: m.m41,
      distance: (() => {
        const last = track.lastElementChild as HTMLElement;
        return Math.max(0, last.offsetLeft + last.offsetWidth + (parseFloat(getComputedStyle(track).paddingRight) || 0) - track.clientWidth);
      })(),
      nextGap: next ? Math.round(next.getBoundingClientRect().top - r.bottom) : 0,
      scrollY,
    };
  }, [RAIL, TRACK] as const);
}

const jump = async (page: Page, y: number) => {
  await page.evaluate((v) => window.scrollTo(0, v), y);
  await page.waitForTimeout(1600); // scrub (0.9s) + snap settle
};

async function desktop(engine: string, browser: Browser) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await ctx.route(/player\.vimeo\.com|vimeocdn|challenges\.cloudflare/, (r) => r.abort());
  const page = await ctx.newPage();
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  await page.addInitScript(() => {
    (window as unknown as { __cls: number }).__cls = 0;
    try {
      new PerformanceObserver((l) => {
        for (const e of l.getEntries() as (PerformanceEntry & { value: number; hadRecentInput: boolean })[]) if (!e.hadRecentInput) (window as unknown as { __cls: number }).__cls += e.value;
      }).observe({ type: "layout-shift", buffered: true });
    } catch {}
  });
  await page.goto(base + p, { waitUntil: "networkidle", timeout: 120_000 });
  await page.waitForTimeout(2500);

  let g = await geo(page);
  check(engine, "rail pins on desktop", g.pinned, `distance ${g.distance}px`);
  check(engine, "pinned distance = horizontal distance", Math.abs(g.height - 900 - g.distance) <= 2, `spacer ${g.height} vs ${900 + g.distance}`);

  await jump(page, g.top - 300);
  g = await geo(page);
  check(engine, "before pin: track at start", Math.abs(g.x) < 2, `x ${g.x.toFixed(1)}`);

  await jump(page, g.top + Math.round(g.distance * 0.5));
  g = await geo(page);
  check(engine, "mid pin: section held at top", Math.abs(g.sectionTop) <= 2, `top ${g.sectionTop.toFixed(1)}`);
  check(engine, "mid pin: track moved", g.x < -50, `x ${g.x.toFixed(0)}`);
  await page.screenshot({ path: path.join(OUT, `${engine}-mid-pin.png`) });

  await jump(page, g.top + g.distance + 400);
  g = await geo(page);
  check(engine, "after pin: track at end", Math.abs(g.x + g.distance) <= 2, `x ${g.x.toFixed(0)} / -${g.distance}`);
  check(engine, "after pin: no gap or overlap", g.nextGap === 0, `gap ${g.nextGap}`);

  await jump(page, g.top + Math.round(g.distance * 0.3));
  g = await geo(page);
  check(engine, "scroll up reverses", g.x > -g.distance + 50 && g.x < 0, `x ${g.x.toFixed(0)}`);

  // Resize mid-pin → everything recalculates.
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.waitForTimeout(1500);
  g = await geo(page);
  check(engine, "resize recalculates spacer", Math.abs(g.height - 800 - g.distance) <= 2, `spacer ${g.height} vs ${800 + g.distance}`);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.waitForTimeout(1500);

  // Refresh mid-pin → restored position with a consistent pin state.
  g = await geo(page);
  const y = g.top + Math.round(g.distance * 0.6);
  await jump(page, y);
  await page.reload({ waitUntil: "networkidle" });
  await page.waitForTimeout(3000);
  g = await geo(page);
  const expected = -Math.min(g.distance, Math.max(0, g.scrollY - g.top));
  check(engine, "refresh mid-page restores pin state", Math.abs(g.x - expected) < g.distance * 0.2 + 30, `scrollY ${Math.round(g.scrollY)}, x ${g.x.toFixed(0)} ~ ${expected.toFixed(0)}`);

  // Keyboard paging passes through the pinned section.
  await jump(page, g.top - 900);
  await page.mouse.click(5, 450);
  const startY = await page.evaluate(() => scrollY);
  for (let i = 0; i < 12; i++) {
    await page.keyboard.press("PageDown");
    await page.waitForTimeout(250);
  }
  const endY = await page.evaluate(() => scrollY);
  check(engine, "PageDown passes through the pin", endY - startY > g.distance, `moved ${Math.round(endY - startY)}px`);

  if (JOURNEY) {
    // Year markers: clicking one scrolls to that milestone, which becomes the active (full-opacity) one.
    await jump(page, g.top + 5);
    for (const i of [5, 2]) {
      await page.click(`[data-journey-marker="${i}"]`);
      await page.waitForTimeout(2200);
      const r = await page.evaluate((k) => {
        const cur = document.querySelector("[data-journey-marker][aria-current]")?.getAttribute("data-journey-marker");
        const items = [...document.querySelectorAll<HTMLElement>("[data-journey-item]")];
        const lit = document.querySelectorAll("[data-journey-marker][data-lit]").length;
        const box = items[k].getBoundingClientRect();
        return { cur, lit, opacity: Number(items[k].style.opacity), visible: box.left >= -2 && box.right <= innerWidth + 2 };
      }, i);
      check(engine, `click year marker ${i + 1} activates it`, r.cur === String(i) && r.lit === i + 1 && r.opacity > 0.98 && r.visible, JSON.stringify(r));
    }
    // Keyboard: Tab from marker 1 to marker 3 brings milestone 3 active.
    await page.locator('[data-journey-marker="0"]').focus();
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    await page.waitForTimeout(1800);
    const kb = await page.evaluate(() => document.querySelector("[data-journey-marker][aria-current]")?.getAttribute("data-journey-marker"));
    check(engine, "Tab to year marker 3 brings it active", kb === "2", `active ${kb}`);
    await page.screenshot({ path: path.join(OUT, `${engine}-about-journey.png`) });
  } else {
    // Focus inside the rail brings the focused card into view.
    await jump(page, g.top + 5);
    const focusedVisible = await page.evaluate(async (sel) => {
      const links = document.querySelectorAll<HTMLElement>(`${sel} .rail-track li a`);
      const target = links[links.length - 1];
      target.focus();
      await new Promise((r) => setTimeout(r, 1800));
      const r = target.closest("li")!.getBoundingClientRect();
      return r.left >= -2 && r.right <= innerWidth + 2;
    }, RAIL);
    check(engine, "focus brings the last card into view", focusedVisible);
  }

  // Anchor link (services overview "Jump to") lands below the header.
  await page.goto(base + "/services", { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  await page.click('a[href="#ai-services"]');
  await page.waitForTimeout(2000);
  const anchorTop = await page.evaluate(() => document.getElementById("ai-services-h")!.getBoundingClientRect().top);
  check(engine, "anchor link lands in view", anchorTop > 40 && anchorTop < 500, `heading at ${Math.round(anchorTop)}px`);

  const cls = await page.evaluate(() => (window as unknown as { __cls: number }).__cls);
  if (engine === "chromium" || engine === "edge") check(engine, "CLS < 0.1 (services page)", cls < 0.1, cls.toFixed(3));
  check(engine, "no console errors", errors.length === 0, errors.slice(0, 2).join(" | "));
  await ctx.close();
}

async function mobile(engine: string, browser: Browser) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: engine !== "firefox" });
  await ctx.route(/player\.vimeo\.com|vimeocdn|challenges\.cloudflare/, (r) => r.abort());
  const page = await ctx.newPage();
  await page.goto(base + p, { waitUntil: "networkidle", timeout: 120_000 });
  await page.waitForTimeout(2000);
  if (JOURNEY) {
    const items = page.locator("[data-journey-item]");
    const n = await items.count();
    for (let i = 0; i < n; i++) {
      await items.nth(i).scrollIntoViewIfNeeded();
      await page.waitForTimeout(350);
    }
    await page.waitForTimeout(1200);
    const j = await page.evaluate(() => {
      const w = document.querySelector<HTMLElement>(".journey")!;
      const boxes = [...document.querySelectorAll<HTMLElement>("[data-journey-item]")].map((e) => e.getBoundingClientRect());
      const stacked = boxes.every((b, i) => i === 0 || b.top >= boxes[i - 1].bottom - 1);
      const sameLeft = boxes.every((b) => Math.abs(b.left - boxes[0].left) < 2);
      const shown = [...document.querySelectorAll<HTMLElement>("[data-journey-item] [data-reveal]")].every((e) => Number(getComputedStyle(e).opacity) > 0.98);
      const line = getComputedStyle(document.querySelector(".journey-line")!).display !== "none";
      return { pinned: w.hasAttribute("data-pinned"), spacer: !!w.parentElement?.classList.contains("pin-spacer"), stacked, sameLeft, shown, line, overflowX: document.documentElement.scrollWidth > innerWidth };
    });
    check(engine, "390px: journey not pinned", !j.pinned && !j.spacer);
    check(engine, "390px: vertical timeline (stacked, line on the left)", j.stacked && j.sameLeft && j.line, JSON.stringify(j));
    check(engine, "390px: milestones revealed after scrolling", j.shown);
    check(engine, "390px: no horizontal page scroll", !j.overflowX);
    await page.screenshot({ path: path.join(OUT, `${engine}-390-journey.png`) });
    await ctx.close();
    return;
  }
  const r = await page.evaluate((sel) => {
    const s = document.querySelector<HTMLElement>(sel)!;
    s.scrollIntoView();
    const ul = s.querySelector<HTMLElement>(".rail-track")!;
    ul.scrollLeft = ul.clientWidth * 0.9;
    return { pinned: s.hasAttribute("data-pinned"), spacer: !!s.parentElement?.classList.contains("pin-spacer"), overflowX: document.documentElement.scrollWidth > innerWidth, snap: getComputedStyle(ul).scrollSnapType };
  }, RAIL);
  await page.waitForTimeout(800);
  const counter = await page.$eval(`${RAIL} p[aria-hidden]`, (e) => e.textContent);
  check(engine, "390px: no pin, native swipe rail", !r.pinned && !r.spacer && r.snap.includes("x"), r.snap);
  check(engine, "390px: counter follows swipe", !!counter && !counter.startsWith("01"), counter ?? "");
  check(engine, "390px: no horizontal page scroll", !r.overflowX);
  await page.screenshot({ path: path.join(OUT, `${engine}-390-rail.png`) });
  await ctx.close();
}

/** Reduced motion on desktop: static timeline, nothing pinned, every milestone visible at full opacity. */
async function reduced(engine: string, browser: Browser) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
  await ctx.route(/player\.vimeo\.com|vimeocdn|challenges\.cloudflare/, (r) => r.abort());
  const page = await ctx.newPage();
  await page.goto(base + p, { waitUntil: "networkidle", timeout: 120_000 });
  await page.waitForTimeout(2000);
  const r = await page.evaluate(() => {
    const w = document.querySelector<HTMLElement>(".journey")!;
    w.scrollIntoView();
    const els = [...document.querySelectorAll<HTMLElement>("[data-journey-item], [data-journey-item] [data-reveal]")];
    return { pinned: w.hasAttribute("data-pinned"), allVisible: els.every((e) => Number(getComputedStyle(e).opacity) > 0.98 && getComputedStyle(e).transform === "none") };
  });
  check(engine, "reduced motion: static timeline, all visible", !r.pinned && r.allVisible, JSON.stringify(r));
  await ctx.close();
}

(async () => {
  const only = process.env.ENGINES?.split(",");
  for (const e of engines.filter((x) => !only || only.includes(x.name))) {
    let browser: Browser;
    try {
      browser = await e.launch();
    } catch (err) {
      check(e.name, "launch", false, String(err).split("\n")[0]);
      continue;
    }
    try {
      await desktop(e.name, browser);
      if (e.name === "chromium" || e.name === "webkit" || e.name === "firefox") await mobile(e.name, browser);
      if (JOURNEY) await reduced(e.name, browser);
    } catch (err) {
      check(e.name, "run", false, String(err).split("\n")[0]);
    }
    await browser.close();
  }
  fs.writeFileSync(path.join(OUT, "results.txt"), results.join("\n") + "\n");
  const fails = results.filter((l) => l.startsWith("FAIL")).length;
  console.log(`\n${results.length - fails}/${results.length} passed`);
})();
