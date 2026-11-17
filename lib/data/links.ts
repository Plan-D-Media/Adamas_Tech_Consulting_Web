import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { db, visible } from "@/lib/db";

/**
 * Links from teaser content (hero cards, Top Stories, Client Outcomes, nav featured cards, section CTAs) to the
 * detail pages are gated by the target row's own status. With PREVIEW_DRAFTS off, a card that advertises an
 * unpublished case study or event is dropped and a section CTA falls back to the listing page, so the public
 * site never links to a page that does not exist and never repeats an unverified figure through a teaser
 * (QA BUG-002 and BUG-014, 16 Nov 2026). With drafts previewed every link stays as seeded.
 *
 * Service pillars and sub-services are gated the same way (QA BUG-038, 17 Nov 2026): the "Computer Vision" menu row
 * was PUBLISHED while its Service row was DRAFT, so the header linked to a URL that answers a redirect. A hidden
 * sub-service now falls back to its pillar page, a hidden pillar to "/services".
 *
 * Solutions are not gated here: since the 17 Nov 2026 scope change they have no pages on this site, so a
 * solution link is an external URL and its own reader decides whether the row can be shown at all
 * (lib/data/solutions.ts).
 */

type Kind = "case-studies" | "insights/events";

const DETAIL = /^\/(case-studies|insights\/events)\/([^/?#]+)\/?(?:[?#].*)?$/;
const LISTING: Record<Kind, string> = { "case-studies": "/case-studies", "insights/events": "/insights/events" };

/** "/services/<pillar>" and "/services/<pillar>/<service>", the two shapes the service templates answer on. */
const SERVICE = /^\/services\/([^/?#]+)(?:\/([^/?#]+))?\/?(?:[?#].*)?$/;

export function detailTarget(href: string | null | undefined): { kind: Kind; slug: string } | null {
  const m = href ? DETAIL.exec(href) : null;
  return m ? { kind: m[1] as Kind, slug: m[2] } : null;
}

/** The pillar and (optional) sub-service a services URL points at. */
export function serviceTarget(href: string | null | undefined): { pillar: string; service: string | null } | null {
  const m = href ? SERVICE.exec(href) : null;
  return m ? { pillar: m[1], service: m[2] ?? null } : null;
}

async function visibleSlugs(): Promise<{ detail: Record<Kind, string[]>; services: string[] }> {
  "use cache";
  cacheLife("hours");
  cacheTag("links", "case-studies", "events", "services");
  const [cases, events, pillars, services] = await Promise.all([
    db.caseStudy.findMany({ where: visible, select: { slug: true } }),
    db.event.findMany({ where: visible, select: { slug: true } }),
    db.servicePillar.findMany({ where: visible, select: { slug: true } }),
    db.service.findMany({ where: { ...visible, pillar: visible }, select: { slug: true, pillar: { select: { slug: true } } } }),
  ]);
  return {
    detail: {
      "case-studies": cases.map((r) => r.slug),
      "insights/events": events.map((r) => r.slug),
    },
    // Visible service URLs, both shapes: "<pillar>" and "<pillar>/<service>".
    services: [...pillars.map((p) => p.slug), ...services.map((s) => `${s.pillar.slug}/${s.slug}`)],
  };
}

export interface LinkGate {
  /** True unless the href points at a detail page whose row is not visible. */
  visible(href: string | null | undefined): boolean;
  /** The href itself, or the section listing when it points at an unpublished detail page. */
  fallback<T extends string | null | undefined>(href: T): T | string;
  /** Deep copy of a JSON payload with teaser items that link to unpublished pages removed and CTAs redirected. */
  prune<T>(value: T): T;
}

const isRecord = (v: unknown): v is Record<string, unknown> => !!v && typeof v === "object" && !Array.isArray(v);

/** One lookup per request: resolve the published slugs once, then gate any number of links synchronously. */
export async function linkGate(): Promise<LinkGate> {
  const { detail: slugs, services } = await visibleSlugs();
  /** A services URL is visible when its own row is visible; a sub-service also needs a visible pillar. */
  const serviceVisible = (href: string | null | undefined) => {
    const s = serviceTarget(href);
    return !s || services.includes(s.service ? `${s.pillar}/${s.service}` : s.pillar);
  };
  const visibleHref = (href: string | null | undefined) => {
    const t = detailTarget(href);
    if (t) return slugs[t.kind].includes(t.slug);
    return serviceVisible(href);
  };
  const fallback = <T extends string | null | undefined>(href: T): T | string => {
    const t = detailTarget(href);
    if (t) return slugs[t.kind].includes(t.slug) ? href : LISTING[t.kind];
    // A hidden sub-service falls back to its pillar page when that is published, otherwise to the services listing
    // (the same landing places lib/data/unpublished.ts uses for a direct hit on the URL).
    const s = serviceTarget(href);
    if (!s || serviceVisible(href)) return href;
    return s.service && services.includes(s.pillar) ? `/services/${s.pillar}` : "/services";
  };
  const prune = <T,>(value: T): T => {
    if (Array.isArray(value)) {
      // Lists of teasers: a card for an unpublished page is dropped rather than pointed at the listing.
      return value.filter((item) => !(isRecord(item) && typeof item.href === "string" && !visibleHref(item.href))).map(prune) as T;
    }
    if (isRecord(value)) {
      const out: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(value)) {
        if (isRecord(v) && typeof v.href === "string" && !visibleHref(v.href)) continue; // a single feature card
        out[k] = typeof v === "string" && /href$/i.test(k) ? fallback(v) : prune(v);
      }
      return out as T;
    }
    return value;
  };
  return { visible: visibleHref, fallback, prune };
}
