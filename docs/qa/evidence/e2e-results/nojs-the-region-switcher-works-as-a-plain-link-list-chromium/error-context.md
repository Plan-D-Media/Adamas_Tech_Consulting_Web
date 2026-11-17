# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: nojs.spec.ts >> the region switcher works as a plain link list
- Location: tests\e2e\nojs.spec.ts:66:5

# Error details

```
Error: locator.click: Error: strict mode violation: locator('summary[aria-label^=\'Region\']') resolved to 2 elements:
    1) <summary aria-label="Region: India. Change region" class="flex cursor-pointer select-none items-center gap-3 whitespace-nowrap font-ui transition-colors duration-(--duration-fast) h-10 rounded-sm px-3 text-[0.875rem] text-black hover:bg-white/60">…</summary> aka getByRole('banner').getByLabel('Region: India. Change region')
    2) <summary aria-label="Region: India. Change region" class="flex cursor-pointer select-none items-center gap-3 whitespace-nowrap font-ui transition-colors duration-(--duration-fast) h-11 rounded-xs border border-navy-700 px-3 text-[0.875rem] font-semibold text-white hover:border-grey-300">…</summary> aka getByRole('contentinfo').getByLabel('Region: India. Change region')

Call log:
  - waiting for locator('summary[aria-label^=\'Region\']')

```

# Test source

```ts
  1  | import { expect, test } from "@playwright/test";
  2  | import { cleanupForms, disconnectDb, testEmail, visibleEventPath } from "./helpers";
  3  | 
  4  | /** Without JavaScript every section is visible, the drawer and accordions work and both forms submit. */
  5  | 
  6  | test.use({ javaScriptEnabled: false });
  7  | 
  8  | test.afterAll(async () => {
  9  |   await cleanupForms();
  10 |   await disconnectDb();
  11 | });
  12 | 
  13 | test("homepage: every section renders visibly, nothing is left at opacity 0", async ({ page }) => {
  14 |   await page.goto("/in/");
  15 |   const sections = page.locator("main section");
  16 |   expect(await sections.count()).toBeGreaterThanOrEqual(10);
  17 |   const hidden = await page.evaluate(() =>
  18 |     Array.from(document.querySelectorAll<HTMLElement>("main [data-reveal], main section"))
  19 |       .filter((el) => parseFloat(getComputedStyle(el).opacity) < 1 || getComputedStyle(el).visibility === "hidden")
  20 |       .map((el) => el.tagName + (el.id ? `#${el.id}` : "")),
  21 |   );
  22 |   expect(hidden).toEqual([]);
  23 |   await expect(page.locator("h1")).toBeVisible();
  24 |   // The slider track is a plain scroll container: all stories are in the DOM, no copies.
  25 |   const stories = page.locator("[data-compare='stories'] article");
  26 |   expect(await stories.count()).toBeGreaterThan(0);
  27 |   expect(await page.locator("[data-compare='stories'] article[aria-hidden='true']").count()).toBe(0);
  28 | });
  29 | 
  30 | test("service template and event page render without JavaScript", async ({ page }) => {
  31 |   await page.goto("/services/cloud-services");
  32 |   expect(await page.locator("main section").count()).toBeGreaterThanOrEqual(8);
  33 |   await expect(page.locator("h1")).toBeVisible();
  34 |   // Tab panels for no-JS visitors are all in the document.
  35 |   expect(await page.locator("[data-tabs] [data-nojs-panel]").count()).toBeGreaterThanOrEqual(0);
  36 |   const path = await visibleEventPath(page);
  37 |   if (path) {
  38 |     await page.goto(path);
  39 |     await expect(page.locator("h1")).toBeVisible();
  40 |   }
  41 | });
  42 | 
  43 | test("mobile drawer and its accordions work as <details>", async ({ page }) => {
  44 |   await page.setViewportSize({ width: 390, height: 844 });
  45 |   await page.goto("/in/");
  46 |   await page.locator("details.nav-drawer > summary").click();
  47 |   await expect(page.locator("details.nav-drawer nav[aria-label='Main']")).toBeVisible();
  48 |   const first = page.locator("details.nav-drawer details").first();
  49 |   await first.locator("summary").click();
  50 |   await expect(first).toHaveAttribute("open", "");
  51 | });
  52 | 
  53 | test("the contact form posts and lands on the thank-you page", async ({ page }) => {
  54 |   await page.goto("/in/");
  55 |   const f = page.locator('[data-compare="contact"] form');
  56 |   await f.locator('input[name="name"]').fill("E2E NoJS");
  57 |   await f.locator('input[name="email"]').fill(testEmail("nojs"));
  58 |   await f.locator('input[name="phone"]').fill("+919999999998");
  59 |   await f.locator('textarea[name="message"]').fill("No-JavaScript regression submission, please ignore.");
  60 |   await f.locator('input[name="consent"]').check();
  61 |   await f.locator('button[type="submit"]').click();
  62 |   await expect(page).toHaveURL(/\/thank-you/, { timeout: 20000 });
  63 |   await expect(page.locator("h1")).toBeVisible();
  64 | });
  65 | 
  66 | test("the region switcher works as a plain link list", async ({ page }) => {
  67 |   await page.goto("/in/");
> 68 |   await page.locator("summary[aria-label^='Region']").click();
     |                                                       ^ Error: locator.click: Error: strict mode violation: locator('summary[aria-label^=\'Region\']') resolved to 2 elements:
  69 |   await page.locator("a[href='/uk/']").first().click();
  70 |   await expect(page).toHaveURL(/\/uk\/$/);
  71 | });
  72 | 
```