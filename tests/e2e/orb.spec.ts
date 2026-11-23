import { expect, test, type Page } from "@playwright/test";

/**
 * The 3D lattice at the centre of "Why Organisations Choose Adamas" (/in/, /uk/, /gcc/).
 *
 * The contract, in order of importance: the poster is always in the server HTML at its final size, `three` is
 * never fetched unless 3D is actually wanted, and the canvas is hidden from assistive technology while the
 * caption stays real text.
 */

const SECTION = "[data-compare='difference']";

/** Hydrate, then bring the section into view; the gate is an effect, so it cannot observe anything sooner. */
async function reach(page: Page, path = "/in/") {
  await page.goto(path, { waitUntil: "load" });
  await page.waitForTimeout(1200);
  await page.evaluate((sel) => document.querySelector(sel)?.scrollIntoView({ block: "center" }), SECTION);
}

test.describe("ecosystem orb", () => {
  test("renders the 3D lattice, hides it from assistive technology, keeps the caption as text", async ({ page }) => {
    await reach(page);
    const canvas = page.locator(`${SECTION} canvas`);
    await expect(canvas).toHaveCount(1, { timeout: 15000 });
    await expect(canvas).toHaveAttribute("aria-hidden", "true");

    // The heading is real HTML text, centred over the orb - not baked into the canvas.
    await expect(page.locator(SECTION).getByText("One connected delivery ecosystem")).toBeVisible();

    // The poster fades out once the first frame has painted, but stays in the DOM as the fallback layer.
    const poster = page.locator(`${SECTION} img[src*='difference-network']`);
    await expect(poster).toHaveCount(1);
    await expect.poll(async () => poster.evaluate((el) => getComputedStyle(el).opacity), { timeout: 15000 }).toBe("0");
  });

  test("the entrance sequence runs and leaves every card visible", async ({ page }) => {
    await reach(page);
    await expect(page.locator(`${SECTION} [data-stage='ecosystem'][data-drawn]`)).toHaveCount(1, { timeout: 15000 });
    const cards = page.locator(`${SECTION} .ecosystem-card`);
    expect(await cards.count()).toBe(6);
    // Nothing may be left behind at opacity 0 by the staged reveal.
    await expect
      .poll(async () => cards.evaluateAll((els) => els.filter((e) => parseFloat(getComputedStyle(e).opacity) < 0.99).length), { timeout: 15000 })
      .toBe(0);
  });

  test("the poster reserves the box, so the 3D causes no layout shift", async ({ page }) => {
    // offsetWidth/Height, not getBoundingClientRect: the entrance scales the orb to 0.82, and a transform moves
    // pixels without moving layout - which is exactly what "no layout shift" means (and what CLS ignores).
    const box = (sel: string) =>
      page.evaluate((s) => {
        const el = document.querySelector(s) as HTMLElement | null;
        return el ? { w: el.offsetWidth, h: el.offsetHeight } : null;
      }, sel);

    const POSTER = `${SECTION} img[src*='difference-network']`;
    await page.goto("/in/", { waitUntil: "load" });
    const before = await box(POSTER);
    expect(before, "the poster must be in the server HTML").not.toBeNull();

    await page.waitForTimeout(1200);
    await page.evaluate((sel) => document.querySelector(sel)?.scrollIntoView({ block: "center" }), SECTION);
    await expect(page.locator(`${SECTION} canvas`)).toHaveCount(1, { timeout: 20000 });

    const after = await box(POSTER);
    expect(after).toEqual(before);
  });

  test("reduced motion: the poster only, and three is never fetched", async ({ browser }) => {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
    const requests: string[] = [];
    ctx.on("request", (r) => {
      if (r.url().includes("/_next/") && /three/i.test(r.url())) requests.push(r.url());
    });
    const page = await ctx.newPage();
    await reach(page);
    await page.waitForTimeout(2500);
    expect(await page.locator(`${SECTION} canvas`).count()).toBe(0);
    await expect(page.locator(`${SECTION} img[src*='difference-network']`)).toBeVisible();
    expect(requests, "three must not be downloaded under reduced motion").toEqual([]);
    await ctx.close();
  });

  test("under 768px: the poster only, and three is never fetched", async ({ browser }) => {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const requests: string[] = [];
    ctx.on("request", (r) => {
      if (r.url().includes("/_next/") && /three/i.test(r.url())) requests.push(r.url());
    });
    const page = await ctx.newPage();
    await reach(page);
    await page.waitForTimeout(2500);
    expect(await page.locator(`${SECTION} canvas`).count()).toBe(0);
    expect(requests, "three must not be downloaded on a phone").toEqual([]);
    await ctx.close();
  });
});

test.describe("ecosystem orb without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("the flat poster is the server HTML on all three homepages, and every card is visible", async ({ page }) => {
    for (const path of ["/in/", "/uk/", "/gcc/"]) {
      await page.goto(path);
      await expect(page.locator(`${SECTION} img[src*='difference-network']`), path).toBeVisible();
      expect(await page.locator(`${SECTION} canvas`).count(), path).toBe(0);
      const hidden = await page
        .locator(`${SECTION} .ecosystem-card`)
        .evaluateAll((els) => els.filter((e) => parseFloat(getComputedStyle(e).opacity) < 0.99).length);
      expect(hidden, path).toBe(0);
    }
  });
});
