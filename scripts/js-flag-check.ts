/**
 * Checks the `js` flag in the root layout (next/script, beforeInteractive) and the no-flash / no-JS behaviour.
 * Usage: tsx scripts/js-flag-check.ts [baseUrl] [paths...]
 * Per path, with JS: console errors/warnings mentioning "script tag"; when html.js appears vs first paint; whether the
 * pre-reveal hero state (gated on @media (scripting: enabled)) already applies at first paint.
 * Without JS: no js class, scripting media query off, hero copy and [data-reveal] content visible.
 */
import { chromium } from "playwright";

const [base = "http://localhost:3000", ...rest] = process.argv.slice(2);
const paths = rest.length ? rest : ["/in/", "/uk/", "/ae/", "/about", "/contact"];
let fail = 0;
const check = (name: string, ok: boolean, info = "") => {
  if (!ok) fail++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${info ? "  " + info : ""}`);
};

// Runs before any page script: records first paint and the moment html gets the js class.
const INIT = `(() => {
  window.__flag = { classAt: null, fcp: null, hiddenAtPaint: null };
  // documentElement does not exist yet when this runs, so watch the document itself.
  new MutationObserver(() => {
    const f = window.__flag;
    if (f.classAt === null && document.documentElement && document.documentElement.classList.contains("js")) f.classAt = performance.now();
    if (f.hiddenAtPaint === null) {
      // The first time a later-slide hero element is parsed, read its style: what the first paint will use.
      const el = document.querySelector(".hero-copy:not(.is-in):not(.hero-intro) [data-fade]");
      if (el) f.hiddenAtPaint = getComputedStyle(el).opacity;
    }
  }).observe(document, { subtree: true, childList: true, attributes: true, attributeFilter: ["class"] });
  new PerformanceObserver((l) => { for (const e of l.getEntries()) if (e.name === "first-contentful-paint") window.__flag.fcp = e.startTime; })
    .observe({ type: "paint", buffered: true });
})()`;

(async () => {
  const b = await chromium.launch();
  for (const p of paths) {
    const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
    await ctx.route(/player\.vimeo\.com|vimeocdn|challenges\.cloudflare/, (r) => r.abort());
    await ctx.addInitScript(INIT);
    const page = await ctx.newPage();
    const msgs: string[] = [];
    page.on("console", (m) => {
      if (m.type() === "error" || m.type() === "warning") msgs.push(`${m.type()}: ${m.text().slice(0, 160)}`);
    });
    page.on("pageerror", (e) => msgs.push(`pageerror: ${String(e).slice(0, 160)}`));
    await page.goto(base + p, { waitUntil: "networkidle", timeout: 120_000 });
    await page.waitForTimeout(2500);
    const f = (await page.evaluate("({ ...window.__flag, has: document.documentElement.classList.contains('js'), scripting: matchMedia('(scripting: enabled)').matches })")) as {
      classAt: number | null; fcp: number | null; hiddenAtPaint: string | null; has: boolean; scripting: boolean;
    };
    const scriptMsgs = msgs.filter((m) => /script tag/i.test(m));
    check(`${p} no "script tag" console error`, scriptMsgs.length === 0, scriptMsgs.join(" | "));
    check(`${p} html.js set`, f.has, `classAt ${f.classAt?.toFixed(0)}ms, FCP ${f.fcp?.toFixed(0)}ms`);
    check(`${p} reveal gate active from first paint`, f.scripting && ((f.hiddenAtPaint === null || f.hiddenAtPaint === "0")), `hero hidden-state opacity at first frame: ${f.hiddenAtPaint}`);
    console.log(`      console errors/warnings: ${msgs.length ? msgs.join(" | ") : "none"}`);
    await ctx.close();

    const nojs = await b.newContext({ viewport: { width: 1440, height: 900 }, javaScriptEnabled: false });
    const q = await nojs.newPage();
    await q.goto(base + p, { waitUntil: "load", timeout: 120_000 });
    await q.waitForTimeout(2500); // let the CSS-only first-slide entrance finish
    const r = (await q.evaluate(`(() => {
      const vis = (e) => { const s = getComputedStyle(e); return s.opacity !== "0" && s.visibility !== "hidden" && s.display !== "none" && !/translate3d\\(0px, 105%/.test(s.transform); };
      const hero = [...document.querySelectorAll(".hero-copy [data-w], .hero-copy [data-fade]")];
      const rev = [...document.querySelectorAll("[data-reveal]")];
      return { has: document.documentElement.classList.contains("js"), scripting: matchMedia("(scripting: enabled)").matches,
        hero: hero.length, heroHidden: hero.filter((e) => getComputedStyle(e).opacity === "0").length,
        reveal: rev.length, revealHidden: rev.filter((e) => !vis(e)).length, h1: !!document.querySelector("h1") };
    })()`)) as { has: boolean; scripting: boolean; hero: number; heroHidden: number; reveal: number; revealHidden: number; h1: boolean };
    check(`${p} no-JS: no js class, scripting off`, !r.has && !r.scripting);
    check(`${p} no-JS: everything visible`, r.h1 && r.heroHidden === 0 && r.revealHidden === 0, `hero ${r.hero} (${r.heroHidden} hidden), [data-reveal] ${r.reveal} (${r.revealHidden} hidden)`);
    await nojs.close();
  }
  await b.close();
  console.log(fail ? `${fail} FAILED` : "all passed");
  process.exit(fail ? 1 : 0);
})();
