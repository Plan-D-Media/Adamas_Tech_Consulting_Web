import { expect, test } from "@playwright/test";
import { SOLUTIONS_TARGET, draftsOn } from "./helpers";

/**
 * Solutions have no pages on this site (scope change, 17 Nov 2026). This suite holds that contract:
 * every solution link leaves the site in a new tab with rel="noopener" and a visible external marker, nothing
 * links to a /solutions/<slug> page any more, "/solutions" and anything under it 301 to the Products & Solutions
 * section of the visitor's regional homepage, and the sitemap lists no solution URL.
 *
 * External destinations are never requested: the site is not responsible for their response codes, so only the
 * href, target and rel are asserted.
 */

const HOMES = ["/in/", "/uk/", "/gcc/"];

/** Hosts a solution link may point at. Add one here when a client supplies another product website. */
const KNOWN_PRODUCT_HOSTS = ["arivoo.in"];

test.describe("solutions link out", () => {
  test("every homepage has the Products & Solutions section the anchor points at", async ({ page }) => {
    for (const home of HOMES) {
      await page.goto(home);
      const section = page.locator("#products-solutions");
      await expect(section, home).toHaveCount(1);
      await expect(section.locator("h2")).toContainText(/\w/);
    }
  });

  test("/solutions 301s to the region homepage section, with the region from the cookie", async ({ request }) => {
    const plain = await request.get("/solutions", { maxRedirects: 0 });
    expect(plain.status()).toBe(301);
    const to = (plain.headers()["location"] ?? "").replace(/^https?:\/\/[^/]+/, "");
    expect(to).toMatch(SOLUTIONS_TARGET);

    // The cookie decides the region; the query string survives the hop.
    for (const region of ["in", "uk", "gcc"]) {
      const res = await request.get("/solutions?utm_source=qa", { maxRedirects: 0, headers: { cookie: `region=${region}` } });
      expect(res.status(), region).toBe(301);
      const loc = (res.headers()["location"] ?? "").replace(/^https?:\/\/[^/]+/, "");
      expect(loc, region).toBe(`/${region}/?utm_source=qa#products-solutions`);
    }

    // The old legacy cookie value still maps to the Gulf homepage.
    const legacy = await request.get("/solutions", { maxRedirects: 0, headers: { cookie: "region=ae" } });
    expect((legacy.headers()["location"] ?? "").replace(/^https?:\/\/[^/]+/, "")).toBe("/gcc/#products-solutions");
  });

  test("old solution URLs land on the same section in one hop", async ({ request }) => {
    for (const path of ["/solutions/arivoo", "/solutions/smart-parking", "/solutions/ai-solution-4", "/solutions/anything-at-all"]) {
      const res = await request.get(path, { maxRedirects: 0 });
      expect(res.status(), path).toBe(301);
      const loc = (res.headers()["location"] ?? "").replace(/^https?:\/\/[^/]+/, "");
      expect(loc, path).toMatch(SOLUTIONS_TARGET);
      const target = await request.get(loc.split("#")[0], { maxRedirects: 0 });
      expect(target.status(), `${path} -> ${loc}`).toBe(200);
    }
  });

  test("the old SAP Treasury URL lands on a service page, not a solution", async ({ request }) => {
    const res = await request.get("/sap-treasury-investment-and-cash-management-implementation", { maxRedirects: 0 });
    expect(res.status()).toBe(301);
    const loc = (res.headers()["location"] ?? "").replace(/^https?:\/\/[^/]+/, "");
    expect(loc).toBe("/services/digital-transformation/sap");
    expect((await request.get(loc, { maxRedirects: 0 })).status()).toBe(200);
  });

  test("no page links to a /solutions/<slug> page any more", async ({ page }) => {
    for (const p of [...HOMES, "/case-studies", "/about", "/contact", "/services/ai-services"]) {
      await page.goto(p);
      const hrefs = await page.$$eval("a[href]", (as) => as.map((a) => a.getAttribute("href") ?? ""));
      expect(hrefs.filter((h) => /^\/solutions\/.+/.test(h)), p).toEqual([]);
    }
  });

  test("the sitemap lists no solution URL", async ({ request }) => {
    const xml = await (await request.get("/sitemap.xml")).text();
    const paths = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
    expect(paths.filter((p) => p.startsWith("/solutions"))).toEqual([]);
  });

  test("solution links open in a new tab with noopener and an external marker", async ({ page }) => {
    await page.goto("/in/");
    // Open the Solutions mega menu so its links are in the DOM, then read the section and the footer too.
    const trigger = page.locator("button[data-menu-key='header.solutions']");
    if ((await trigger.count()) > 0) await trigger.click();

    const links = page.locator("#products-solutions a[href^='http'], nav[aria-label='Main'] a[href^='http'], footer a[href^='http']");
    const n = await links.count();
    expect(n, "the homepage carries at least one product link").toBeGreaterThan(0);

    const bad: string[] = [];
    for (let i = 0; i < n; i++) {
      const a = links.nth(i);
      const [href, target, rel, html] = await Promise.all([a.getAttribute("href"), a.getAttribute("target"), a.getAttribute("rel"), a.innerHTML()]);
      const host = new URL(href as string).host.replace(/^www\./, "");
      // Social links are external too; only check the product links here, and leave social to the header suite.
      if (!KNOWN_PRODUCT_HOSTS.includes(host)) continue;
      if (target !== "_blank") bad.push(`${href}: target=${target}`);
      if (!/noopener/.test(rel ?? "")) bad.push(`${href}: rel=${rel}`);
      // The external-link icon (components/ui/Icon.tsx) or the screen-reader note must be present.
      if (!/svg|opens in a new tab/i.test(html)) bad.push(`${href}: no external marker`);
    }
    expect(bad, bad.join("\n")).toEqual([]);
  });

  test(`solutions without a website URL are not shown (drafts ${draftsOn ? "ON: assertion skipped" : "off"})`, async ({ page }) => {
    await page.goto("/in/");
    const cards = page.locator("#products-solutions article");
    const n = await cards.count();
    expect(n).toBeGreaterThan(0);
    if (draftsOn) {
      test.info().annotations.push({ type: "info", description: `PREVIEW_DRAFTS=true: ${n} cards, including any without a URL` });
      return;
    }
    // With drafts off every card must carry a link: a card with no product website has nowhere to go.
    for (let i = 0; i < n; i++) {
      await expect(cards.nth(i).locator("a[href^='http']").first(), `card ${i} has a product link`).toHaveCount(1);
    }
    await expect(page.locator("#products-solutions")).not.toContainText("Link to be confirmed");
  });
});
