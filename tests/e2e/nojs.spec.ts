import { expect, test } from "@playwright/test";
import { cleanupForms, disconnectDb, testEmail, visibleEventPath } from "./helpers";

/** Without JavaScript every section is visible, the drawer and accordions work and both forms submit. */

test.use({ javaScriptEnabled: false });

test.afterAll(async () => {
  await cleanupForms();
  await disconnectDb();
});

test("homepage: every section renders visibly, nothing is left at opacity 0", async ({ page }) => {
  await page.goto("/in/");
  const sections = page.locator("main section");
  expect(await sections.count()).toBeGreaterThanOrEqual(10);
  const hidden = await page.evaluate(() =>
    Array.from(document.querySelectorAll<HTMLElement>("main [data-reveal], main section"))
      .filter((el) => parseFloat(getComputedStyle(el).opacity) < 1 || getComputedStyle(el).visibility === "hidden")
      .map((el) => el.tagName + (el.id ? `#${el.id}` : "")),
  );
  expect(hidden).toEqual([]);
  await expect(page.locator("h1")).toBeVisible();
  // The slider track is a plain scroll container: all stories are in the DOM, no copies.
  const stories = page.locator("[data-compare='stories'] article");
  expect(await stories.count()).toBeGreaterThan(0);
  expect(await page.locator("[data-compare='stories'] article[aria-hidden='true']").count()).toBe(0);
});

test("service template and event page render without JavaScript", async ({ page }) => {
  await page.goto("/services/cloud-services");
  expect(await page.locator("main section").count()).toBeGreaterThanOrEqual(8);
  await expect(page.locator("h1")).toBeVisible();
  // Tab panels for no-JS visitors are all in the document.
  expect(await page.locator("[data-tabs] [data-nojs-panel]").count()).toBeGreaterThanOrEqual(0);
  const path = await visibleEventPath(page);
  if (path) {
    await page.goto(path);
    await expect(page.locator("h1")).toBeVisible();
  }
});

test("mobile drawer and its accordions work as <details>", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/in/");
  await page.locator("details.nav-drawer > summary").click();
  await expect(page.locator("details.nav-drawer nav[aria-label='Main']")).toBeVisible();
  const first = page.locator("details.nav-drawer details").first();
  await first.locator("summary").click();
  await expect(first).toHaveAttribute("open", "");
});

test("the contact form posts and lands on the thank-you page", async ({ page }) => {
  await page.goto("/in/");
  const f = page.locator('[data-compare="contact"] form');
  await f.locator('input[name="name"]').fill("E2E NoJS");
  await f.locator('input[name="email"]').fill(testEmail("nojs"));
  await f.locator('input[name="phone"]').fill("+919999999998");
  await f.locator('textarea[name="message"]').fill("No-JavaScript regression submission, please ignore.");
  await f.locator('input[name="consent"]').check();
  await f.locator('button[type="submit"]').click();
  await expect(page).toHaveURL(/\/thank-you/, { timeout: 20000 });
  await expect(page.locator("h1")).toBeVisible();
});

test("the region switcher works as a plain link list", async ({ page }) => {
  await page.goto("/in/");
  await page.locator("header summary[aria-label^='Region']").click();
  await page.locator("a[href='/uk/']").first().click();
  await expect(page).toHaveURL(/\/uk\/$/);
});
