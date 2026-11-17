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
 * Solutions are not gated here: since the 17 Nov 2026 scope change they have no pages on this site, so a
 * solution link is an external URL and its own reader decides whether the row can be shown at all
 * (lib/data/solutions.ts).
 */

type Kind = "case-studies" | "insights/events";

const DETAIL = /^\/(case-studies|insights\/events)\/([^/?#]+)\/?(?:[?#].*)?$/;
const LISTING: Record<Kind, string> = { "case-studies": "/case-studies", "insights/events": "/insights/events" };

export function detailTarget(href: string | null | undefined): { kind: Kind; slug: string } | null {
  const m = href ? DETAIL.exec(href) : null;
  return m ? { kind: m[1] as Kind, slug: m[2] } : null;
}

async function visibleSlugs(): Promise<Record<Kind, string[]>> {
  "use cache";
  cacheLife("hours");
  cacheTag("links", "case-studies", "events");
  const [cases, events] = await Promise.all([
    db.caseStudy.findMany({ where: visible, select: { slug: true } }),
    db.event.findMany({ where: visible, select: { slug: true } }),
  ]);
  return {
    "case-studies": cases.map((r) => r.slug),
    "insights/events": events.map((r) => r.slug),
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
  const slugs = await visibleSlugs();
  const visibleHref = (href: string | null | undefined) => {
    const t = detailTarget(href);
    return !t || slugs[t.kind].includes(t.slug);
  };
  const fallback = <T extends string | null | undefined>(href: T): T | string => {
    const t = detailTarget(href);
    return t && !slugs[t.kind].includes(t.slug) ? LISTING[t.kind] : href;
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
