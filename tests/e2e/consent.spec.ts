import { expect, test, type Page } from "@playwright/test";

/**
 * Cookie consent and Google Tag Manager (17 November 2026).
 *
 * The suite adapts to the build under test, because the container ID is inlined at build time: when
 * NEXT_PUBLIC_GTM_ID is set, the full banner flow is asserted; when it is empty, the assertion is that none of it
 * exists at all. Either way the central promise is checked the same way, by watching the network: no request to a
 * Google host before the visitor agrees.
 */

const GOOGLE_HOSTS = /googletagmanager\.com|google-analytics\.com|analytics\.google\.com/;

/** Records every Google request a page makes, so "nothing loaded" can be asserted rather than assumed. */
function watchGoogle(page: Page): string[] {
  const seen: string[] = [];
  page.on("request", (r) => {
    if (GOOGLE_HOSTS.test(r.url())) seen.push(r.url());
  });
  // Never actually reach Google from the test machine: the assertion is about the attempt, not the response.
  void page.route(GOOGLE_HOSTS, (route) => route.fulfill({ status: 204, body: "" }));
  return seen;
}

async function analyticsConfigured(page: Page): Promise<boolean> {
  return (await page.locator("[data-cookie-settings]").count()) > 0;
}

test.describe("cookie consent", () => {
  test("nothing from Google is requested before the visitor chooses", async ({ page }) => {
    const google = watchGoogle(page);
    await page.goto("/in/");
    await page.waitForLoadState("load");
    await page.waitForTimeout(1500);
    expect(google, google.join("\n")).toEqual([]);

    const configured = await analyticsConfigured(page);
    const banner = page.locator("[data-consent-banner]");
    if (!configured) {
      test.info().annotations.push({ type: "info", description: "NEXT_PUBLIC_GTM_ID is empty: no banner, no tags, nothing to consent to" });
      await expect(banner).toHaveCount(0);
      expect(await page.evaluate(() => document.cookie.includes("consent="))).toBe(false);
      return;
    }
    await expect(banner).toBeVisible();
    await expect(banner.locator("[data-consent='accept']")).toBeVisible();
    await expect(banner.locator("[data-consent='reject']")).toBeVisible();
    await expect(banner.locator("[data-consent='manage']")).toBeVisible();
    expect(await page.evaluate(() => document.cookie.includes("consent="))).toBe(false);
  });

  test("rejecting stores the choice, closes the banner and still loads nothing", async ({ page }) => {
    const google = watchGoogle(page);
    await page.goto("/in/");
    if (!(await analyticsConfigured(page))) return;
    await page.locator("[data-consent='reject']").click();
    await expect(page.locator("[data-consent-banner]")).toHaveCount(0);
    expect(await page.evaluate(() => document.cookie)).toMatch(/consent=1%3Aa0m0|consent=1:a0m0/);
    await page.waitForTimeout(1200);
    expect(google, google.join("\n")).toEqual([]);

    // The choice survives a navigation: no second ask, still nothing loaded.
    await page.goto("/about");
    await page.waitForTimeout(800);
    await expect(page.locator("[data-consent-banner]")).toHaveCount(0);
    expect(google, google.join("\n")).toEqual([]);
  });

  test("accepting loads Tag Manager, and only then", async ({ page }) => {
    const google = watchGoogle(page);
    await page.goto("/in/");
    if (!(await analyticsConfigured(page))) return;
    expect(google).toEqual([]);
    await page.locator("[data-consent='accept']").click();
    await expect(page.locator("[data-consent-banner]")).toHaveCount(0);
    expect(await page.evaluate(() => document.cookie)).toMatch(/consent=1%3Aa1m1|consent=1:a1m1/);
    await expect.poll(() => google.length, { timeout: 5000 }).toBeGreaterThan(0);
    expect(google.some((u) => /googletagmanager\.com\/gtm\.js/.test(u))).toBe(true);

    // Consent Mode was told "denied" before the update, in that order.
    const pushed = await page.evaluate(() => (window as unknown as { dataLayer?: unknown[] }).dataLayer?.map((e) => JSON.stringify(e)) ?? []);
    const consentEvents = pushed.filter((e) => e.includes("consent"));
    expect(consentEvents.length, pushed.join("\n")).toBeGreaterThanOrEqual(2);
    expect(consentEvents[0]).toContain("default");
    expect(consentEvents[0]).toContain("denied");
    expect(consentEvents[1]).toContain("update");
    expect(consentEvents[1]).toContain("granted");
  });

  test("the footer reopens the banner so a choice can be changed", async ({ page }) => {
    await page.goto("/in/");
    if (!(await analyticsConfigured(page))) return;
    await page.locator("[data-consent='reject']").click();
    await expect(page.locator("[data-consent-banner]")).toHaveCount(0);

    const settings = page.locator("[data-cookie-settings]").first();
    await settings.scrollIntoViewIfNeeded();
    await settings.click();
    const banner = page.locator("[data-consent-banner]");
    await expect(banner).toBeVisible();
    // Reopens in "manage" mode, with the stored answer reflected and focus moved into the banner.
    await expect(banner.locator("[data-consent='save']")).toBeVisible();
    const boxes = banner.locator("input[type='checkbox']");
    await expect(boxes).toHaveCount(2);
    expect(await boxes.nth(0).isChecked()).toBe(false);
    expect(await page.evaluate(() => document.activeElement?.tagName)).toBe("H2");

    // Agreeing to analytics only grants that one signal.
    await boxes.nth(0).check();
    await banner.locator("[data-consent='save']").click();
    expect(await page.evaluate(() => document.cookie)).toMatch(/consent=1%3Aa1m0|consent=1:a1m0/);
  });

  test("the cookie policy describes the build it is served from", async ({ page }) => {
    await page.goto("/cookie-policy");
    const configured = await analyticsConfigured(page);
    const body = (await page.locator("main").innerText()).toLowerCase();
    expect(body).toContain("region");
    if (configured) {
      expect(body).toContain("measurement cookies, only if you agree");
      expect(body).toContain("_ga");
      expect(body).not.toContain("no analytics, advertising or tracking cookies");
    } else {
      expect(body).toContain("no analytics, advertising or tracking cookies");
      expect(body).not.toContain("measurement cookies, only if you agree");
    }
  });
});
