import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { badge, db, visible } from "@/lib/db";
import { mediaSelect, toMedia, type Media } from "@/lib/media";
import { previewingDrafts } from "@/lib/preview";
import type { CaseCardData } from "./home";
import { caseCardInclude } from "./mappers";
import { safeCaseCard } from "./caseStudies";

export type SolutionKind = "PRODUCT" | "AI_SOLUTION" | "ARIVOO_MODULE";

/**
 * Solutions have no pages on this site (scope change, 17 Nov 2026): each one links out to its own website, so a row
 * is only linkable when it carries an `externalUrl`. Rows without one are kept in the database with their copy
 * ready, so that adding the URL and publishing the row is the only change needed; until then they are DRAFT and the
 * public site never shows them. In the drafts preview they are listed without a link, so the missing URL is visible.
 */
export interface SolutionListItem {
  slug: string;
  kind: SolutionKind;
  name: string;
  tagline: string | null;
  summary: string | null;
  /** The product's own website; null when the client has not supplied it yet (preview only). */
  href: string | null;
  image: Media | null;
  draft: boolean;
  modules: SolutionModule[];
  /** Headline outcome from the first linked case study whose figure is cleared for display. */
  proof: { metric: string; label: string | null; href: string } | null;
  /** Linked case studies (visible only), for "in practice" rails. */
  cases: CaseCardData[];
}

export interface SolutionModule {
  slug: string;
  name: string;
  tagline: string | null;
  summary: string | null;
  href: string | null;
  image: Media | null;
}

const listInclude = {
  image: mediaSelect,
  children: { where: visible, orderBy: { sortOrder: "asc" }, include: { image: mediaSelect } },
  caseStudies: { where: visible, orderBy: { sortOrder: "asc" }, include: caseCardInclude },
} as const;

type ListRow = Awaited<ReturnType<typeof listRows>>[number];

function listRows() {
  return db.solution.findMany({
    where: { ...visible, parentId: null },
    orderBy: { sortOrder: "asc" },
    include: listInclude,
  });
}

function toModule(c: { slug: string; name: string; tagline: string | null; summary: string | null; externalUrl: string | null; image: Parameters<typeof toMedia>[0] }): SolutionModule {
  return { slug: c.slug, name: c.name, tagline: c.tagline, summary: c.summary, href: c.externalUrl, image: toMedia(c.image) };
}

function toListItem(s: ListRow): SolutionListItem {
  const cards = s.caseStudies.map(safeCaseCard);
  const first = cards.find((c) => !/^\[/.test(c.headlineMetric));
  return {
    slug: s.slug,
    kind: s.kind,
    name: s.name,
    tagline: s.tagline,
    summary: s.summary,
    href: s.externalUrl,
    image: toMedia(s.image),
    draft: badge(s.status),
    modules: s.children.map(toModule).filter((m) => previewingDrafts || m.href),
    proof: first ? { metric: first.headlineMetric, label: first.metricLabel, href: `/case-studies/${first.slug}` } : null,
    cases: cards,
  };
}

/**
 * Top-level solutions (products and AI solutions) in menu order; Arivoo modules ride along as `modules`.
 * A solution with no website URL is dropped unless drafts are being previewed: it has nowhere to link to.
 */
export async function getSolutions(): Promise<SolutionListItem[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("solutions");
  const rows = await listRows();
  return rows.map(toListItem).filter((s) => previewingDrafts || s.href);
}
