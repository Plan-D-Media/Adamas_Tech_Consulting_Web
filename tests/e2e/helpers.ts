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
