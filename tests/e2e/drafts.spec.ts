import { expect, test } from "@playwright/test";
import { DRAFT_STRINGS, draftsOn, internalLinks } from "./helpers";

/**
 * Draft-content leak check. With PREVIEW_DRAFTS=false nothing marked DRAFT, no placeholder tag and no unverified
 * figure may appear on any sitemap URL, and no link on those pages may point at a missing page (BUG-002, BUG-014).
 * With drafts previewed the assertions are skipped (the configuration is reported) but the dead-link check still runs.
 */

async function sitemapPaths(request: import("@playwright/test").APIRequestContext): Promise<string[]> {
  const xml = await (await request.get("/sitemap.xml")).text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
}

test("the sitemap lists only canonical URLs that answer 200", async ({ request }) => {
  const paths = await sitemapPaths(request);
  expect(paths.length).toBeGreaterThan(20);
  const bad: string[] = [];
  for (const p of paths) {
    const res = await request.get(p, { maxRedirects: 0 });
    if (res.status() !== 200) bad.push(`${p} -> ${res.status()}`);
    if (p !== "/" && !/^\/(in|uk|gcc)\/$/.test(p) && p.endsWith("/")) bad.push(`${p}: trailing slash on an inner page`);
  }
  expect(bad, bad.join("\n")).toEqual([]);
});

test(`no draft content or placeholder tag on any sitemap page (drafts ${draftsOn ? "ON: assertion skipped" : "off"})`, async ({ request }) => {
  const paths = await sitemapPaths(request);
  const hits: string[] = [];
  for (const p of paths) {
    const html = await (await request.get(p)).text();
    // Strip the hydration payload and class attributes: percentages in gradient stops are not content.
    const text = html.replace(/<script[\s\S]*?<\/script>/g, "").replace(/class="[^"]*"/g, "");
    for (const s of DRAFT_STRINGS) if (text.includes(s)) hits.push(`${p}: "${s}"`);
    if (/(^|[^\w.])30%/.test(text.replace(/<[^>]+>/g, " "))) hits.push(`${p}: "30%"`);
  }
  if (draftsOn) {
    test.info().annotations.push({ type: "info", description: `PREVIEW_DRAFTS=true: ${hits.length} draft strings present by design` });
    return;
  }
  expect(hits, hits.join("\n")).toEqual([]);
});

test("every internal link on the homepages and key templates answers 200 (no links to unpublished pages)", async ({ page }) => {
  const pages = ["/in/", "/uk/", "/gcc/", "/services/cloud-services", "/services/digital-transformation", "/services/ai-services", "/solutions", "/case-studies", "/insights/events", "/about", "/contact"];
  const checked = new Map<string, number>();
  const bad: string[] = [];
  for (const p of pages) {
    await page.goto(p);
    for (const href of await internalLinks(page)) {
      if (!checked.has(href)) {
        const res = await page.request.get(href, { maxRedirects: 0 });
        checked.set(href, res.status());
      }
      const status = checked.get(href)!;
      if (status !== 200) bad.push(`${p}: ${href} -> ${status}`);
    }
  }
  expect(bad, bad.join("\n")).toEqual([]);
});

test("the mega menus carry no featured card for an unpublished page", async ({ page }) => {
  await page.goto("/in/");
  const triggers = page.locator("nav[aria-label='Main'] button[data-menu-key]");
  const n = await triggers.count();
  const bad: string[] = [];
  for (let i = 0; i < n; i++) {
    await triggers.nth(i).click();
    const panelId = await triggers.nth(i).getAttribute("aria-controls");
    const links = await page.locator(`#${panelId} a[href]`).evaluateAll((as) => as.map((a) => (a as HTMLAnchorElement).getAttribute("href") || ""));
    for (const href of links) {
      if (!href.startsWith("/")) continue;
      const res = await page.request.get(href, { maxRedirects: 0 });
      if (res.status() !== 200) bad.push(`${href} -> ${res.status()}`);
    }
    await page.keyboard.press("Escape");
  }
  expect(bad, bad.join("\n")).toEqual([]);
});
