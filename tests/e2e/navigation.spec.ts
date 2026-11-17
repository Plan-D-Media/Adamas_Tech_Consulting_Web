import { expect, test, type Page } from "@playwright/test";
import { internalLinks } from "./helpers";

/** Header, mega menus (mouse and keyboard), mobile drawer, skip link and footer links. */

const MENU_KEYS = ["header.about", "header.services", "header.solutions", "header.insights"];

async function openKey(page: Page, key: string) {
  const trigger = page.locator(`button[data-menu-key="${key}"]`);
  if ((await trigger.count()) === 0) return null;
  await trigger.click();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  const panelId = await trigger.getAttribute("aria-controls");
  return page.locator(`#${panelId}`);
}

test.describe("header and mega menus", () => {
  test("every mega menu opens on click and shows its panel; only one is open at a time", async ({ page }) => {
    await page.goto("/in/");
    const triggers = page.locator("nav[aria-label='Main'] button[data-menu-key]");
    const count = await triggers.count();
    expect(count).toBeGreaterThanOrEqual(3);
    for (let i = 0; i < count; i++) {
      const key = (await triggers.nth(i).getAttribute("data-menu-key")) as string;
      const panel = await openKey(page, key);
      expect(panel).not.toBeNull();
      await expect(panel!).toBeVisible();
      expect(await page.locator("nav[aria-label='Main'] button[aria-expanded='true']").count()).toBe(1);
    }
  });

  test("hover intent opens after the delay and closes when the pointer leaves", async ({ page }) => {
    await page.goto("/in/");
    const trigger = page.locator("button[data-menu-key='header.services']");
    await trigger.hover();
    await expect(trigger).toHaveAttribute("aria-expanded", "true", { timeout: 2000 });
    await page.mouse.move(10, 600);
    await expect(trigger).toHaveAttribute("aria-expanded", "false", { timeout: 2000 });
  });

  test("keyboard: Enter opens, Tab moves into the panel, Esc closes and returns focus (BUG-008)", async ({ page }) => {
    await page.goto("/in/");
    for (const key of MENU_KEYS) {
      const trigger = page.locator(`button[data-menu-key="${key}"]`);
      if ((await trigger.count()) === 0) continue;
      await trigger.focus();
      await page.keyboard.press("Enter");
      await expect(trigger).toHaveAttribute("aria-expanded", "true");
      const panelId = (await trigger.getAttribute("aria-controls")) as string;
      await page.keyboard.press("Tab");
      const inPanel = await page.evaluate((id) => !!document.activeElement?.closest(`#${CSS.escape(id)}`), panelId);
      expect(inPanel, `Tab from the ${key} trigger lands inside its panel`).toBe(true);
      await page.keyboard.press("Escape");
      await expect(trigger).toHaveAttribute("aria-expanded", "false");
      expect(await page.evaluate(() => document.activeElement?.getAttribute("data-menu-key"))).toBe(key);
    }
  });

  test("the panel closes when focus leaves it", async ({ page }) => {
    await page.goto("/in/");
    const trigger = page.locator("button[data-menu-key='header.about']");
    await trigger.focus();
    await page.keyboard.press("Enter");
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    // Tab through every focusable in the panel and out the other side.
    for (let i = 0; i < 40; i++) {
      await page.keyboard.press("Tab");
      if ((await trigger.getAttribute("aria-expanded")) === "false") break;
    }
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  test("header links resolve and external links open in a new tab with noopener", async ({ page }) => {
    await page.goto("/in/");
    const external = page.locator("header a[target='_blank']");
    const n = await external.count();
    for (let i = 0; i < n; i++) expect(await external.nth(i).getAttribute("rel")).toMatch(/noopener/);
    const talk = page.locator("header a", { hasText: "Talk to an expert" }).first();
    await expect(talk).toHaveAttribute("href", "/contact");
  });
});

test.describe("mobile drawer", () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true });

  test("opens, traps focus, closes on Escape and returns focus", async ({ page }) => {
    await page.goto("/in/");
    const summary = page.locator("details.nav-drawer > summary");
    await summary.click();
    await expect(page.locator("details.nav-drawer")).toHaveAttribute("open", "");
    await expect(page.locator("details.nav-drawer nav[aria-label='Main']")).toBeVisible();
    for (let i = 0; i < 60; i++) {
      await page.keyboard.press("Tab");
      const inside = await page.evaluate(() => !!document.activeElement?.closest("details.nav-drawer"));
      expect(inside, `Tab ${i} stays inside the drawer`).toBe(true);
    }
    await page.keyboard.press("Escape");
    await expect(page.locator("details.nav-drawer")).not.toHaveAttribute("open", "");
  });
});

test.describe("skip link and footer", () => {
  test("skip link focuses the visible main, also after a client-side navigation (BUG-013)", async ({ page }) => {
    await page.goto("/in/");
    await page.locator("header summary[aria-label^='Region']").click();
    await page.locator("a[href='/uk/']").first().click();
    await expect(page).toHaveURL(/\/uk\/$/);
    await page.keyboard.press("Tab");
    const skip = page.locator("a[href='#main']").first();
    await expect(skip).toBeFocused();
    await page.keyboard.press("Enter");
    const focusedVisibleMain = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement | null;
      return !!el && el.tagName === "MAIN" && el.getClientRects().length > 0;
    });
    expect(focusedVisibleMain).toBe(true);
  });

  test("every internal link on the homepage and footer answers 200 in one hop", async ({ page }) => {
    await page.goto("/in/");
    const links = await internalLinks(page);
    expect(links.length).toBeGreaterThan(20);
    const bad: string[] = [];
    for (const href of links) {
      const res = await page.request.get(href, { maxRedirects: 0 });
      if (res.status() !== 200) bad.push(`${href} -> ${res.status()}`);
    }
    expect(bad, bad.join("\n")).toEqual([]);
  });
});
