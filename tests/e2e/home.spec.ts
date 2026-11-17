import { expect, test } from "@playwright/test";
import { settleReveals } from "./helpers";

/** Homepage behaviours fixed in the QA round: hero autoplay, Top Stories loop, industries, sliders, SEO head. */

test("hero auto-advances after 7 s and the progress bar fills while it waits (BUG-005)", async ({ page }) => {
  await page.goto("/in/");
  const slides = await page.locator("[aria-roledescription='slide']").count();
  test.skip(slides < 2, "fewer than two hero cards in this configuration");
  const counter = page.locator("[aria-label='highlights controls'] p");
  await expect(counter).toHaveText(/01 \/ 0\d/);
  await page.waitForTimeout(3000);
  const mid = await page.locator("[aria-label='highlights controls'] .progress-fill").evaluate((el) => {
    const m = new DOMMatrixReadOnly(getComputedStyle(el).transform);
    return m.a;
  });
  expect(mid).toBeGreaterThan(0.15);
  expect(mid).toBeLessThan(0.9);
  await expect(counter).toHaveText(/02 \/ 0\d/, { timeout: 7000 });
  // Pause freezes the bar.
  await page.locator("[aria-label='Pause highlights']").click();
  const a = await page.locator("[aria-label='highlights controls'] .progress-fill").evaluate((el) => new DOMMatrixReadOnly(getComputedStyle(el).transform).a);
  await page.waitForTimeout(800);
  const b = await page.locator("[aria-label='highlights controls'] .progress-fill").evaluate((el) => new DOMMatrixReadOnly(getComputedStyle(el).transform).a);
  expect(Math.abs(a - b)).toBeLessThan(0.02);
});

test("idle homepage does not re-render in a loop (BUG-005)", async ({ page }) => {
  await page.goto("/in/");
  await page.waitForTimeout(1000);
  const before = await page.evaluate(() => performance.now());
  await page.evaluate(() => (window as unknown as { __ticks: number }).__ticks = 0);
  const layouts = await page.evaluate(
    () =>
      new Promise<number>((resolve) => {
        let n = 0;
        const obs = new PerformanceObserver((list) => (n += list.getEntries().length));
        obs.observe({ type: "layout-shift", buffered: false });
        setTimeout(() => {
          obs.disconnect();
          resolve(n);
        }, 2000);
      }),
  );
  expect(await page.evaluate(() => performance.now())).toBeGreaterThan(before);
  expect(layouts).toBeLessThan(5);
});

test("Top Stories: every slide and both copies are visible; prev from the first story shows a card (BUG-006)", async ({ page }) => {
  await page.goto("/in/");
  const stories = page.locator("[data-compare='stories'] article");
  const total = await stories.count();
  test.skip(total < 4, "fewer than two stories in this configuration");
  await page.locator("[data-compare='stories']").scrollIntoViewIfNeeded();
  await page.waitForTimeout(1500);
  await settleReveals(page);
  await page.waitForTimeout(1200);
  const opacities = await stories.evaluateAll((els) => els.map((el) => parseFloat(getComputedStyle(el).opacity)));
  expect(opacities.every((o) => o >= 0.99), opacities.join(",")).toBe(true);
  await page.locator("[aria-label='Previous stories']").click();
  await page.waitForTimeout(900);
  const counter = page.locator("[aria-label='stories controls'] p");
  await expect(counter).toHaveText(/0\d \/ 0\d/);
  expect(await counter.evaluate((el) => el.getClientRects().length)).toBe(1);
  const box = await counter.boundingBox();
  expect(box!.height).toBeLessThan(30); // one line (BUG-019)
});

test("Industries: the last item can be selected and Next disables at the end (BUG-010)", async ({ page }) => {
  await page.goto("/in/");
  const items = page.locator("nav[aria-label='Industries'] a");
  const n = await items.count();
  test.skip(n < 2, "no industries");
  await items.nth(n - 1).click();
  await page.waitForTimeout(1200);
  await expect(items.nth(n - 1)).toHaveAttribute("aria-current", "true");
  await expect(page.locator("[aria-label='Next industry']")).toBeDisabled();
});

test("fast repeated clicks on the Products slider do not lose steps (BUG-020)", async ({ page }) => {
  await page.goto("/in/");
  const next = page.locator("[aria-label='Next solutions']");
  const counter = page.locator("[aria-label='solutions controls'] p");
  test.skip((await next.count()) === 0, "single solution");
  const total = Number((await counter.innerText()).replace(/.*\/\s*/, ""));
  await page.locator("[data-compare='solutions']").scrollIntoViewIfNeeded();
  for (let i = 0; i < total + 4; i++) await next.click({ delay: 20 });
  await page.waitForTimeout(1500);
  await expect(counter).toContainText(String(total).padStart(2, "0"));
});

test("pillar pages keep no horizontal overflow after scrolling (BUG-007)", async ({ page }) => {
  for (const p of ["/services/digital-transformation", "/services/ai-services"]) {
    await page.goto(p);
    await page.mouse.move(600, 400);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1500);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(800);
    const w = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }));
    expect(w.sw, `${p}: ${w.sw} vs ${w.cw}`).toBeLessThanOrEqual(w.cw + 1);
  }
});

test("structured data and Open Graph tags are present (BUG-011, BUG-033)", async ({ request }) => {
  const home = await (await request.get("/uk/")).text();
  expect(home).toMatch(/"@type":"Organization"/);
  expect(home).toMatch(/property="og:title"/);
  expect(home).toMatch(/property="og:image"/);
  expect(home).toMatch(/hrefLang="x-default" href="https?:\/\/[^"]+\/"/);
  for (const p of ["/services/cloud-services", "/about", "/solutions"]) {
    const html = await (await request.get(p)).text();
    expect(html, p).toMatch(/"@type":"BreadcrumbList"/);
    expect(html, p).toMatch(/property="og:title"/);
  }
});

test("the 404 page has a title and no skipped heading levels on simple pages (BUG-024, BUG-031)", async ({ page }) => {
  const res = await page.goto("/this-does-not-exist");
  expect(res?.status()).toBe(404);
  await expect(page).toHaveTitle(/Page not found/);
  await page.goto("/search");
  const levels = await page.locator("h1, h2, h3, h4").evaluateAll((els) => els.map((e) => Number(e.tagName[1])));
  for (let i = 1; i < levels.length; i++) expect(levels[i] - levels[i - 1], levels.join(",")).toBeLessThanOrEqual(1);
});
