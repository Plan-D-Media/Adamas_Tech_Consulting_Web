import { expect, test, type Page } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import { cleanupForms, disconnectDb, findContactRow, settleReveals, testEmail } from "./helpers";

/**
 * Contact page (/contact, built in QA Phase 2): H1, breadcrumb, structured data, every "Talk to an expert" button,
 * region awareness (cookie), the enquiry form end to end with and without JavaScript, and the two review captures.
 */

const SHOTS = path.join("docs", "qa", "evidence", "phase2-contact");

test.beforeAll(async () => {
  await cleanupForms();
  fs.mkdirSync(SHOTS, { recursive: true });
});
test.afterAll(async () => {
  await cleanupForms();
  await disconnectDb();
});

async function fill(page: Page, v: { name?: string; email?: string; phone?: string; message?: string; consent?: boolean }) {
  const f = page.locator('[data-compare="contact"] form');
  if (v.name !== undefined) await f.locator('input[name="name"]').fill(v.name);
  if (v.email !== undefined) await f.locator('input[name="email"]').fill(v.email);
  if (v.phone !== undefined) await f.locator('input[name="phone"]').fill(v.phone);
  if (v.message !== undefined) await f.locator('textarea[name="message"]').fill(v.message);
  if (v.consent) await f.locator('input[name="consent"]').check({ force: true });
  return f;
}

test.describe("contact page", () => {
  test("renders with one H1, a breadcrumb, BreadcrumbList and ContactPage structured data, metadata and the form", async ({ page }) => {
    const res = await page.goto("/contact");
    expect(res?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("h1")).toContainText(/open to talk/i);
    const crumb = page.locator("nav[aria-label='Breadcrumb']");
    await expect(crumb).toBeVisible();
    await expect(crumb.locator("a[href='/']")).toHaveText("Home");
    await expect(crumb.locator("[aria-current='page']")).toHaveText("Contact");
    const types = await page.locator("script[type='application/ld+json']").evaluateAll((els) => els.map((e) => (JSON.parse(e.textContent || "{}") as { "@type": string })["@type"]));
    expect(types).toEqual(expect.arrayContaining(["Organization", "BreadcrumbList", "ContactPage"]));
    expect(await page.title()).toMatch(/Contact us/i);
    expect(await page.locator("meta[name='description']").getAttribute("content")).toBeTruthy();
    expect(await page.locator("link[rel='canonical']").getAttribute("href")).toMatch(/\/contact$/);
    await expect(page.locator('[data-compare="contact"] form')).toBeVisible();
    await expect(page.locator("[data-contact-channels] article")).toHaveCount(3);
    expect(await page.locator("[data-compare='presence'] article").count()).toBeGreaterThanOrEqual(3);
    // Heading order: H1 then H2s only.
    const levels = await page.locator("main h1, main h2, main h3").evaluateAll((els) => els.map((e) => Number(e.tagName[1])));
    for (let i = 1; i < levels.length; i++) expect(levels[i] - levels[i - 1]).toBeLessThanOrEqual(1);
  });

  test('every "Talk to an expert" button on the homepage and a service page leads to /contact', async ({ page }) => {
    for (const p of ["/in/", "/services/cloud-services"]) {
      await page.goto(p);
      const hrefs = await page.locator("a", { hasText: /Talk to an expert/i }).evaluateAll((as) => as.map((a) => (a as HTMLAnchorElement).getAttribute("href") || ""));
      expect(hrefs.length, p).toBeGreaterThan(0);
      for (const h of hrefs) expect(h, p).toMatch(/^\/contact(\?|$)/);
    }
  });

  test("is region-aware: the GCC cookie puts the GCC contacts and the Dubai office first", async ({ page, context }) => {
    await context.addCookies([{ name: "region", value: "gcc", domain: "localhost", path: "/" }]);
    await page.goto("/contact");
    const current = page.locator("[data-contact-channels] article[data-current-region]");
    await expect(current).toHaveCount(1);
    await expect(current).toContainText("GCC");
    await expect(current).toContainText("+971");
    const nearest = page.locator("[data-compare='presence'] article[data-nearest]");
    await expect(nearest).toHaveCount(1);
    await expect(nearest).toContainText("Dubai");
    await expect(nearest).toContainText("Your nearest office");
    // The phone selector follows the region too.
    expect(await page.locator('[data-compare="contact"] select[name="country"]').inputValue()).toBe("United Arab Emirates");
  });

  test("the India cookie highlights Bengaluru and shows the India office hours", async ({ page, context }) => {
    await context.addCookies([{ name: "region", value: "in", domain: "localhost", path: "/" }]);
    await page.goto("/contact");
    const current = page.locator("[data-contact-channels] article[data-current-region]");
    await expect(current).toContainText("India");
    await expect(current).toContainText("+91");
    await expect(page.locator("[data-compare='presence'] article[data-nearest]")).toContainText("Bengaluru");
  });

  test("validates, then stores the enquiry with /contact and the service hint as its source and lands on /thank-you", async ({ page }) => {
    await page.goto("/contact?service=sap");
    const f = await fill(page, {});
    await f.locator('button[type="submit"]').click();
    await expect(f.locator("[role='status']")).toContainText(/problem/i);
    const email = testEmail("contact-page");
    await fill(page, { name: "E2E Contact Page", email, phone: "+447700900123", message: "Contact page regression test, please ignore.", consent: true });
    await f.locator('button[type="submit"]').click();
    await expect(page).toHaveURL(/\/thank-you$/);
    const row = await findContactRow(email);
    expect(row).not.toBeNull();
    expect(row?.sourcePath).toBe("/contact?service=sap");
    expect(row?.serviceContext).toBe("sap");
    expect(row?.country).toBeTruthy();
  });

  test("review captures at 1440 and 390 (viewport only)", async ({ page }) => {
    for (const [w, h] of [
      [1440, 900],
      [390, 844],
    ]) {
      await page.setViewportSize({ width: w, height: h });
      await page.goto("/contact");
      await settleReveals(page);
      await page.waitForTimeout(300);
      await page.screenshot({ path: path.join(SHOTS, `contact-${w}.png`), fullPage: false });
      await page.locator('[data-compare="contact"]').scrollIntoViewIfNeeded();
      await page.waitForTimeout(300);
      await page.screenshot({ path: path.join(SHOTS, `contact-${w}-form.png`), fullPage: false });
      // No horizontal overflow at either width.
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow, `${w}px`).toBeLessThanOrEqual(0);
    }
  });
});

test.describe("contact page without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("the form submits and the page is complete", async ({ page }) => {
    await page.goto("/contact");
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator("[data-contact-channels] article")).toHaveCount(3);
    expect(await page.locator("[data-compare='presence'] article").count()).toBeGreaterThanOrEqual(3);
    const email = testEmail("contact-nojs");
    await fill(page, { name: "E2E No JS", email, message: "Contact page without JavaScript, please ignore.", consent: true });
    await page.locator('[data-compare="contact"] form button[type="submit"]').click();
    await expect(page).toHaveURL(/\/thank-you$/);
    const row = await findContactRow(email);
    expect(row).not.toBeNull();
    expect(row?.sourcePath).toBe("/contact");
  });
});
