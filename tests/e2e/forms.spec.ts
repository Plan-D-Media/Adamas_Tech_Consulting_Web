import { expect, test, type Page } from "@playwright/test";
import { cleanupForms, countContactRows, disconnectDb, testEmail, visibleEventPath } from "./helpers";

/** Contact form (homepage) and event registration: validation, honeypot, double submit, success, country selector. */

// Start and finish clean: earlier runs (or the audit scripts) may have used up the rate-limit window.
test.beforeAll(async () => {
  await cleanupForms();
});
test.afterAll(async () => {
  await cleanupForms();
  await disconnectDb();
});

async function fillContact(page: Page, v: { name?: string; email?: string; phone?: string; message?: string; consent?: boolean }) {
  const f = page.locator('[data-compare="contact"] form');
  if (v.name !== undefined) await f.locator('input[name="name"]').fill(v.name);
  if (v.email !== undefined) await f.locator('input[name="email"]').fill(v.email);
  if (v.phone !== undefined) await f.locator('input[name="phone"]').fill(v.phone);
  if (v.message !== undefined) await f.locator('textarea[name="message"]').fill(v.message);
  if (v.consent) await f.locator('input[name="consent"]').check({ force: true });
  return f;
}

test.describe("contact form", () => {
  test("required fields and formats are validated inline and on submit", async ({ page }) => {
    await page.goto("/in/");
    const f = await fillContact(page, {});
    await f.locator('button[type="submit"]').click();
    await expect(f.locator("[role='status']")).toContainText(/problem/i);
    expect(await f.locator("[aria-invalid='true']").count()).toBeGreaterThanOrEqual(3);
    await f.locator('input[name="email"]').fill("not-an-email");
    await f.locator('input[name="email"]').blur();
    await expect(f.locator('input[name="email"]')).toHaveAttribute("aria-invalid", "true");
    const describedBy = await f.locator('input[name="email"]').getAttribute("aria-describedby");
    expect(describedBy).toBeTruthy();
  });

  test("the phone country selector defaults to the region, is labelled and shows a focus ring (BUG-009)", async ({ page }) => {
    await page.goto("/gcc/");
    const select = page.locator('[data-compare="contact"] select[name="country"]');
    expect(await select.inputValue()).toBe("United Arab Emirates");
    expect(await select.getAttribute("aria-label")).toBeTruthy();
    await select.focus();
    await page.keyboard.press("Tab");
    await page.keyboard.press("Shift+Tab");
    await expect(select).toBeFocused();
    const ring = await page.evaluate(() => {
      const s = document.querySelector('[data-compare="contact"] select[name="country"]') as HTMLElement;
      const box = s.nextElementSibling as HTMLElement;
      const cs = getComputedStyle(box);
      return { width: cs.outlineWidth, style: cs.outlineStyle };
    });
    expect(ring.style).not.toBe("none");
    expect(parseFloat(ring.width)).toBeGreaterThanOrEqual(2);
  });

  test("the honeypot stores nothing and answers as if it worked", async ({ page }) => {
    await page.goto("/in/");
    const email = testEmail("honeypot");
    const f = await fillContact(page, { name: "E2E Bot", email, phone: "+919999999999", message: "Honeypot test", consent: true });
    await f.locator('input[name="company_website"]').evaluate((el: HTMLInputElement) => (el.value = "http://spam.example"));
    await f.locator('button[type="submit"]').click();
    await expect(page).toHaveURL(/\/thank-you/);
    const rows = await countContactRows(email);
    if (rows >= 0) expect(rows).toBe(0);
  });

  test("a valid submission saves one row and lands on the thank-you page; double submit saves one", async ({ page }) => {
    await page.goto("/uk/");
    const email = testEmail("contact");
    const f = await fillContact(page, { name: "E2E Person", email, phone: "+447700900000", message: "Regression test message, please ignore.", consent: true });
    const button = f.locator('button[type="submit"]');
    await button.click();
    await button.click({ force: true, trial: false }).catch(() => {});
    await expect(page).toHaveURL(/\/thank-you/, { timeout: 15000 });
    await expect(page.locator("h1:visible")).toHaveCount(1);
    const rows = await countContactRows(email);
    if (rows >= 0) expect(rows).toBe(1);
  });

  test("HTML in a field is escaped where it is shown back", async ({ page }) => {
    await page.goto("/in/");
    const payload = `<img src=x onerror="document.title='pwned'">`;
    const f = await fillContact(page, { name: payload, email: "bad", message: "x" });
    await f.locator('button[type="submit"]').click();
    await expect(f.locator("[role='status']")).toContainText(/problem/i);
    expect(await f.locator('input[name="name"]').inputValue()).toBe(payload);
    expect(await page.title()).not.toContain("pwned");
    expect(await page.locator("img[src='x']").count()).toBe(0);
  });
});

test.describe("event registration", () => {
  test("registers once, refuses a duplicate, validates fields", async ({ page }) => {
    const path = await visibleEventPath(page);
    test.skip(!path, "no visible event in this configuration");
    await page.goto(path!);
    const form = page.locator("form#register");
    if ((await form.count()) === 0) {
      await expect(page.locator("[role='status']")).toBeVisible();
      return; // registration closed: the closed state renders instead of the form
    }
    await form.locator('button[type="submit"]').click();
    await expect(form.locator("[role='alert'], [role='status']").first()).toBeVisible();
    expect(await form.locator("[aria-invalid='true']").count()).toBeGreaterThanOrEqual(2);

    const email = testEmail("register");
    await form.locator('input[name="name"]').fill("E2E Attendee");
    await form.locator('input[name="email"]').fill(email);
    const company = form.locator('input[name="company"]');
    if (await company.count()) await company.fill("E2E Ltd");
    await form.locator('input[name="consent"]').check({ force: true });
    await form.locator('button[type="submit"]').click();
    await expect(page.locator("text=/registration received|you are registered|confirmed/i").first()).toBeVisible({ timeout: 15000 });

    await page.goto(path!);
    await form.locator('input[name="name"]').fill("E2E Attendee");
    await form.locator('input[name="email"]').fill(email.toUpperCase());
    if (await company.count()) await company.fill("E2E Ltd");
    await form.locator('input[name="consent"]').check({ force: true });
    await form.locator('button[type="submit"]').click();
    await expect(page.locator("text=/already registered/i").first()).toBeVisible({ timeout: 15000 });
  });

  test("the calendar file is served as text/calendar", async ({ page }) => {
    const path = await visibleEventPath(page);
    test.skip(!path, "no visible event in this configuration");
    const res = await page.request.get(`${path}/calendar`);
    expect(res.status()).toBe(200);
    expect(res.headers()["content-type"]).toContain("text/calendar");
    const body = await res.text();
    expect(body).toContain("BEGIN:VCALENDAR");
    expect(body).toContain("BEGIN:VEVENT");
  });
});
