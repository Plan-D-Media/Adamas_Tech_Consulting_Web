import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import type { RegionCode } from "@prisma/client";
import { db, visible } from "@/lib/db";
import { mediaSelect, toMedia, type Media } from "@/lib/media";
import { solutionHref, type CaseCardData } from "./home";
import { caseCardInclude, titleBodies, toCaseCard, type SeoData, type TitleBody } from "./mappers";

/**
 * Figures the source content contradicts (see the CONFLICT notes in content/caseStudies.ts and CONTENT_TODO.md).
 * They are never rendered: the headline shows "Result to be confirmed" and the result row is dropped.
 * Interim until the schema has a per-figure `verified` flag (requested in docs/round2-notes/solutions-cases.md).
 */
const CONFLICTING_HEADLINE = new Set(["sap-business-partner-workflow", "sap-fiori-btp-capex-real-estate", "steel-plate-inspection"]);
const UNVERIFIED_RESULTS: Record<string, string[]> = {
  // "97%" vs "cut by ¾" on the live page.
  "sap-business-partner-workflow": ["97%"],
  // Repeats the inter-company case's figure for the same 8-10 → 2-3 day range; flagged "confirm".
  "sap-bank-communication-management": ["75%"],
};

/**
 * Solution steps that are a real sequence (collect → annotate → train → evaluate) and so are numbered.
 * Everything else is a set of capabilities. Interim until the schema can say so.
 */
const SEQUENCED_SOLUTION = new Set(["ai-traffic-monitoring"]);

const PENDING_METRIC = "[Placeholder]";

/** Case card with conflicting headline figures withheld (the card then shows "Result to be confirmed"). */
export function safeCaseCard(row: Parameters<typeof toCaseCard>[0]): CaseCardData {
  const c = toCaseCard(row);
  return CONFLICTING_HEADLINE.has(c.slug) ? { ...c, headlineMetric: PENDING_METRIC, metricLabel: null } : c;
}

/** Result rows with withheld figures removed. */
export function clearedResults<T extends { value: string }>(slug: string, results: T[]): T[] {
  const hidden = UNVERIFIED_RESULTS[slug] ?? [];
  return results.filter((r) => !hidden.includes(r.value));
}

export interface Facet {
  value: string;
  label: string;
}

export interface CaseListItem extends CaseCardData {
  industry: string | null;
  pillars: string[];
}

export interface CaseListing {
  items: CaseListItem[];
  industries: Facet[];
  pillars: Facet[];
}

export interface CaseStudyPageData extends SeoData {
  slug: string;
  label: string;
  title: string;
  summary: string | null;
  headlineMetric: string | null;
  metricLabel: string | null;
  clientDescriptor: string | null;
  overview: string | null;
  challenge: string | null;
  solution: TitleBody[];
  solutionIsSequence: boolean;
  quote: string | null;
  quoteBy: string | null;
  image: Media | null;
  industry: { slug: string; label: string } | null;
  regions: RegionCode[];
  results: { value: string; label: string }[];
  technologies: string[];
  services: { name: string; href: string }[];
  pillars: { name: string; href: string }[];
  /** Linked solutions, each on its own website (they have no pages here since 17 Nov 2026). */
  solutions: { name: string; href: string }[];
  related: CaseCardData[];
}

/** Every visible case study with its facet keys; facets list only values that at least one story carries. */
export async function getCaseListing(): Promise<CaseListing> {
  "use cache";
  cacheLife("hours");
  cacheTag("case-studies");
  const rows = await db.caseStudy.findMany({
    where: visible,
    orderBy: { sortOrder: "asc" },
    include: {
      ...caseCardInclude,
      industry: { select: { slug: true, tabLabel: true, sortOrder: true, status: true } },
      pillars: { where: visible, select: { slug: true, name: true, sortOrder: true } },
    },
  });

  const industries = new Map<string, { label: string; order: number }>();
  const pillars = new Map<string, { label: string; order: number }>();
  const items = rows.map((r) => {
    const ind = r.industry && visible.status.in.includes(r.industry.status) ? r.industry : null;
    if (ind) industries.set(ind.slug, { label: ind.tabLabel, order: ind.sortOrder });
    for (const p of r.pillars) pillars.set(p.slug, { label: p.name, order: p.sortOrder });
    return { ...safeCaseCard(r), industry: ind?.slug ?? null, pillars: r.pillars.map((p) => p.slug) };
  });
  const facets = (m: Map<string, { label: string; order: number }>) =>
    [...m.entries()].sort((a, b) => a[1].order - b[1].order).map(([value, v]) => ({ value, label: v.label }));

  return { items, industries: facets(industries), pillars: facets(pillars) };
}

export async function getCaseStudy(slug: string): Promise<CaseStudyPageData | null> {
  "use cache";
  cacheLife("hours");
  cacheTag("case-studies", `case-study:${slug}`);
  const c = await db.caseStudy.findFirst({
    where: { slug, ...visible },
    include: {
      image: mediaSelect,
      industry: true,
      results: { orderBy: { sortOrder: "asc" } },
      technologies: { where: visible, orderBy: { name: "asc" } },
      services: { where: { ...visible, pillar: visible }, orderBy: { sortOrder: "asc" }, include: { pillar: { select: { slug: true } } } },
      pillars: { where: visible, orderBy: { sortOrder: "asc" } },
      solutions: { where: visible, orderBy: { sortOrder: "asc" } },
    },
  });
  if (!c) return null;

  const industry = c.industry && visible.status.in.includes(c.industry.status) ? c.industry : null;
  const pillarIds = c.pillars.map((p) => p.id);
  const candidates = await db.caseStudy.findMany({
    where: {
      ...visible,
      slug: { not: c.slug },
      OR: [...(industry ? [{ industryId: industry.id }] : []), ...(pillarIds.length ? [{ pillars: { some: { id: { in: pillarIds } } } }] : [])],
    },
    orderBy: { sortOrder: "asc" },
    include: { ...caseCardInclude, pillars: { select: { id: true } } },
  });
  // Rank: same industry and same pillar first, then either.
  const related = candidates
    .map((r) => ({ r, score: (industry && r.industryId === industry.id ? 2 : 0) + (r.pillars.some((p) => pillarIds.includes(p.id)) ? 1 : 0) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 6)
    .map(({ r }) => safeCaseCard(r));

  const metricWithheld = CONFLICTING_HEADLINE.has(c.slug);

  return {
    slug: c.slug,
    label: c.label,
    title: c.title,
    summary: c.summary,
    headlineMetric: metricWithheld ? null : c.headlineMetric,
    metricLabel: metricWithheld ? null : c.metricLabel,
    clientDescriptor: c.clientDescriptor,
    overview: c.overview,
    challenge: c.challenge,
    solution: titleBodies(c.solution),
    solutionIsSequence: SEQUENCED_SOLUTION.has(c.slug),
    quote: c.quote,
    quoteBy: c.quoteBy,
    image: toMedia(c.image),
    industry: industry ? { slug: industry.slug, label: industry.tabLabel } : null,
    regions: c.regions,
    results: clearedResults(c.slug, c.results).map((r) => ({ value: r.value, label: r.label })),
    technologies: c.technologies.map((t) => t.name),
    services: c.services.map((s) => ({ name: s.name, href: `/services/${s.pillar.slug}/${s.slug}` })),
    pillars: c.pillars.map((p) => ({ name: p.name, href: `/services/${p.slug}` })),
    // Solutions have no pages here: a solution with no website URL is dropped rather than linked (17 Nov 2026).
    solutions: c.solutions.flatMap((s) => {
      const href = solutionHref(s);
      return href ? [{ name: s.name, href }] : [];
    }),
    related,
    seoTitle: c.seoTitle,
    seoDescription: c.seoDescription,
    noindex: c.noindex,
  };
}

export async function getCaseStudyParams(): Promise<{ slug: string }[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("case-studies");
  const rows = await db.caseStudy.findMany({ where: visible, select: { slug: true } });
  return rows.map((r) => ({ slug: r.slug }));
}
