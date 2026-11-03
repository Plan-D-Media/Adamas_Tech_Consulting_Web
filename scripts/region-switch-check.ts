/**
 * Production QA for the regional homepages (run against `next start`, not `next dev`, which never prefetches).
 * 1. JavaScript disabled: on the homepages and the pages with forms (contact, event), the h1 and every form are
 *    visible, and the HTML has no hidden streaming segment (<div hidden id="S:…">) that would need JS to reveal.
 * 2. JavaScript on: open the region switcher, let the per-link prefetches land, go OFFLINE, then pick each other region.
 *    The destination can only render if the navigation was served from the prefetch, i.e. it was instant.
 * Usage: npx tsx scripts/region-switch-check.ts http://localhost:3100
 */
import { chromium } from "playwright";

const base = process.argv[2] ?? "http://localhost:3100";
const REGIONS = ["in", "uk", "ae"] as const;
const NOJS_PATHS = ["/in/", "/uk/", "/ae/", "/contact", "/insights/events/house-of-lords-2026", "/solutions/arivoo", "/case-studies/face-recognition"];

(async () => {
  const b = await chromium.launch();
  let failed = false;
  const fail = (m: string) => {
    failed = true;
    console.log("  FAIL:", m);
  };

  console.log("— No JavaScript —");
  const nojs = await b.newContext({ javaScriptEnabled: false, viewport: { width: 1280, height: 900 } });
  for (const r of NOJS_PATHS) {
    const p = await nojs.newPage();
    const res = await p.goto(`${base}${r}`, { waitUntil: "load" });
    const html = (await res?.text()) ?? "";
    const h1 = p.locator("main h1").first();
    const forms = p.locator("form");
    const nForms = await forms.count();
    let visibleForms = 0;
    for (let i = 0; i < nForms; i++) if (await forms.nth(i).isVisible()) visibleForms++;
    const hiddenSegments = (html.match(/<div hidden id="S:\d+"/g) ?? []).length;
    console.log(
      `${r} status=${res?.status()} h1Visible=${await h1.isVisible()} "${(await h1.textContent())?.trim().slice(0, 50)}" forms=${visibleForms}/${nForms} visible hiddenSegments=${hiddenSegments}`,
    );
    if (!(await h1.isVisible())) fail(`${r} h1 not visible without JS`);
    if (visibleForms !== nForms) fail(`${r} has hidden forms without JS`);
    if (hiddenSegments) fail(`${r} HTML has ${hiddenSegments} hidden streaming segment(s)`);
    await p.close();
  }
  await nojs.close();

  console.log("— Switcher with JavaScript (offline after prefetch) —");
  for (const from of REGIONS) {
    for (const to of REGIONS.filter((x) => x !== from)) {
      const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
      const p = await ctx.newPage();
      await p.route(/player\.vimeo\.com/, (rt) => rt.abort());
      await p.goto(`${base}/${from}/`, { waitUntil: "networkidle" });
      // All three homepages share the hero headline; the region wrapper's lang (en-IN / en-GB / en-AE) tells them apart.
      const langOf = () => p.locator("main div[lang]").first().getAttribute("lang");
      const before = await langOf();
      await p.locator("header button[aria-controls]", { hasText: /India|UK|GCC|Region/ }).first().click();
      const option = p.locator(`header a[href="/${to}/"]`).first();
      await option.waitFor({ state: "visible" });
      await p.waitForLoadState("networkidle");
      await p.waitForTimeout(800);
      await ctx.setOffline(true);
      const t = Date.now();
      await option.click();
      let ok = true;
      try {
        await p.waitForURL(`**/${to}/`, { timeout: 3000 });
        await p.waitForFunction((prev) => {
          const d = document.querySelector("main div[lang]");
          return !!d && d.getAttribute("lang") !== prev && !!document.querySelector("main h1");
        }, before, { timeout: 3000 });
      } catch {
        ok = false;
      }
      const ms = Date.now() - t;
      const after = await langOf().catch(() => null);
      console.log(`/${from}/ → /${to}/ offline: ${ok ? "rendered" : "DID NOT RENDER"} in ${ms}ms (lang ${before} → ${after}, url ${new URL(p.url()).pathname})`);
      if (!ok) fail(`/${from}/ → /${to}/ was not served from the prefetch`);
      await ctx.close();
    }
  }
  await b.close();
  console.log(failed ? "RESULT: FAIL" : "RESULT: PASS");
  process.exit(failed ? 1 : 0);
})().catch((e) => {
  console.error("FAILED:", String(e).split("\n")[0]);
  process.exit(1);
});
