import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

/**
 * A detail URL whose row exists but is not visible (DRAFT with drafts off, or ARCHIVED) falls back to its section
 * listing with a temporary redirect, as the brief's redirect note asks for unpublished case studies; URLs that match
 * no row at all stay 404s. Used by the dynamic routes after their visible lookup returns nothing (QA BUG-002: the
 * legacy WordPress redirects point at case studies and the event that are still DRAFT).
 */
type Kind = "case-studies" | "insights/events" | "services";

const LISTING: Record<Kind, string> = { "case-studies": "/case-studies", "insights/events": "/insights/events", services: "/services" };

async function rowExists(kind: Kind, slug: string): Promise<boolean> {
  "use cache";
  cacheLife("hours");
  cacheTag("links", "case-studies", "events", "services");
  switch (kind) {
    case "case-studies":
      return !!(await db.caseStudy.findUnique({ where: { slug }, select: { id: true } }));
    case "insights/events":
      return !!(await db.event.findUnique({ where: { slug }, select: { id: true } }));
    case "services":
      return !!(await db.servicePillar.findUnique({ where: { slug }, select: { id: true } })) || !!(await db.service.findFirst({ where: { slug }, select: { id: true } }));
  }
}

/** Call after the visible lookup failed: redirects to the listing when the row exists but is hidden, otherwise returns. */
export async function redirectIfUnpublished(kind: Kind, slug: string): Promise<void> {
  if (await rowExists(kind, slug)) redirect(LISTING[kind]);
}
