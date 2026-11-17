import { PrismaClient } from "@prisma/client";
import type { Page } from "@playwright/test";

/** True when the server under test renders DRAFT rows (set by playwright.config.ts from .env or the environment). */
export const draftsOn = process.env.E2E_PREVIEW_DRAFTS === "true";

/** Strings that must never reach the public configuration (brief, audit part 4). */
export const DRAFT_STRINGS = ["100% Satisfied", "100% SATISFIED", "Zero Risk", "ZERO RISK", "500+", "[Placeholder]", "Lorem", "TBD", "Middle East", ">Draft<", "to be confirmed", "TO BE CONFIRMED"];

export const E2E_EMAIL_DOMAIN = "e2e.invalid";
export const testEmail = (tag: string) => `e2e-${tag}-${Date.now()}@${E2E_EMAIL_DOMAIN}`;

let prisma: PrismaClient | null = null;
function db() {
  if (!process.env.E2E_DATABASE_URL) return null;
  prisma ??= new PrismaClient({ datasources: { db: { url: process.env.E2E_DATABASE_URL } } });
  return prisma;
}

/** Remove every row the suite created and the rate-limit windows it consumed, so reruns start clean. */
export async function cleanupForms() {
  const p = db();
  if (!p) return;
  await p.contactSubmission.deleteMany({ where: { email: { endsWith: `@${E2E_EMAIL_DOMAIN}` } } });
  await p.eventRegistration.deleteMany({ where: { email: { endsWith: `@${E2E_EMAIL_DOMAIN}` } } });
  await p.rateLimitHit.deleteMany({ where: { OR: [{ key: { startsWith: "contact:" } }, { key: { startsWith: "event-registration:" } }] } });
}

export async function countContactRows(email: string) {
  const p = db();
  return p ? p.contactSubmission.count({ where: { email } }) : -1;
}

/** The stored enquiry for an address (null without a database URL or when nothing was stored). */
export async function findContactRow(email: string) {
  const p = db();
  return p ? p.contactSubmission.findFirst({ where: { email }, orderBy: { createdAt: "desc" } }) : null;
}

export async function disconnectDb() {
  await prisma?.$disconnect();
  prisma = null;
}

/** The first visible event slug, or null when no event is visible in this configuration. */
export async function visibleEventPath(page: Page): Promise<string | null> {
  const res = await page.request.get("/sitemap.xml");
  const xml = await res.text();
  const m = /<loc>[^<]*?(\/insights\/events\/[^<\/]+)<\/loc>/.exec(xml);
  return m ? m[1] : null;
}

/**
 * Internal paths that are a deliberate redirect rather than a page. Since the 17 Nov 2026 scope change
 * solutions have no pages here, so "/solutions" (and anything under it) 301s to the Products & Solutions
 * section of the visitor's regional homepage.
 */
export const REDIRECTING_PATHS = /^\/solutions(\/|$)/;

/** The region homepage URL with the solutions anchor that "/solutions" must land on. */
export const SOLUTIONS_TARGET = /^\/(in|uk|gcc)\/(\?[^#]*)?#products-solutions$/;

/**
 * Final status of an internal link, allowing the one documented redirect: a path in REDIRECTING_PATHS must
 * answer 301 and its target must answer 200. Anything else must answer 200 directly.
 */
export async function linkOk(request: import("@playwright/test").APIRequestContext, href: string): Promise<string | null> {
  const res = await request.get(href, { maxRedirects: 0 });
  // "/" is the geo decision point, not a page: the logo and the "Home" breadcrumb on every region-less page point at
  // it on purpose (components/nav/LogoLink.tsx, proxy.ts rule 1), and it answers a 307 to the visitor's regional
  // homepage. The redirect is the documented behaviour; what matters is that it lands on a 200 in one hop.
  if (href === "/") {
    if (res.status() !== 307) return `/ -> ${res.status()} (expected the geo 307)`;
    const target = (res.headers()["location"] ?? "").replace(/^https?:\/\/[^/]+/, "");
    if (!/^\/(in|uk|gcc)\/$/.test(target)) return `/ -> 307 ${target} (expected a region homepage)`;
    const home = await request.get(target, { maxRedirects: 0 });
    return home.status() === 200 ? null : `/ -> ${target} -> ${home.status()}`;
  }
  if (!REDIRECTING_PATHS.test(href)) return res.status() === 200 ? null : `${href} -> ${res.status()}`;
  if (res.status() !== 301) return `${href} -> ${res.status()} (expected a 301 to the homepage section)`;
  const loc = res.headers()["location"] ?? "";
  const path = loc.replace(/^https?:\/\/[^/]+/, "");
  if (!SOLUTIONS_TARGET.test(path)) return `${href} -> 301 ${path} (expected a region homepage with #products-solutions)`;
  const target = await request.get(path.split("#")[0], { maxRedirects: 0 });
  return target.status() === 200 ? null : `${href} -> ${path} -> ${target.status()}`;
}

/** Internal hrefs on a page, de-duplicated, without fragments and mailto/tel links. */
export async function internalLinks(page: Page): Promise<string[]> {
  const hrefs = await page.$$eval("a[href]", (as) => as.map((a) => (a as HTMLAnchorElement).getAttribute("href") || ""));
  const out = new Set<string>();
  for (const h of hrefs) {
    if (!h || h.startsWith("#") || /^(mailto|tel|https?):/.test(h)) continue;
    out.add(h.split("#")[0]);
  }
  return [...out];
}

/** Mark every reveal element as revealed so screenshots and visibility checks do not wait on GSAP. */
export async function settleReveals(page: Page) {
  await page.evaluate(() => document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => el.setAttribute("data-revealed", "")));
}
