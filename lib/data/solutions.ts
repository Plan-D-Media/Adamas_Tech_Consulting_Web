import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { badge, db, visible } from "@/lib/db";
import { mediaSelect, toMedia, type Media } from "@/lib/media";
import { solutionHref, type CaseCardData } from "./home";
import { caseCardInclude, type FaqData, type SeoData, type TitleBody } from "./mappers";
import { clearedResults, safeCaseCard } from "./caseStudies";

export type SolutionKind = "PRODUCT" | "AI_SOLUTION" | "ARIVOO_MODULE";

/** A solution as listed on the overview and in "more solutions" grids. */
export interface SolutionListItem {
  slug: string;
  kind: SolutionKind;
  name: string;
  tagline: string | null;
  summary: string | null;
  /** Where cards and menus link: the external site when `externalUrl` is set, otherwise the page. */
  href: string;
  external: boolean;
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
  href: string;
  external: boolean;
  image: Media | null;
}

export interface SolutionPageData extends SeoData {
  slug: string;
  kind: SolutionKind;
  name: string;
  tagline: string | null;
  summary: string | null;
  body: string | null;
  externalUrl: string | null;
  image: Media | null;
  modules: SolutionModule[];
  features: TitleBody[];
  screenshots: { image: Media; caption: string | null }[];
  integrations: string[];
  caseStudies: CaseCardData[];
  /** Cleared result figures of the first linked case study, for the "in practice" band. */
  practiceResults: { value: string; label: string }[];
  faqs: FaqData[];
  more: SolutionListItem[];
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
  return { slug: c.slug, name: c.name, tagline: c.tagline, summary: c.summary, href: solutionHref(c), external: !!c.externalUrl, image: toMedia(c.image) };
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
    href: solutionHref(s),
    external: !!s.externalUrl,
    image: toMedia(s.image),
    draft: badge(s.status),
    modules: s.children.map(toModule),
    proof: first ? { metric: first.headlineMetric, label: first.metricLabel, href: `/case-studies/${first.slug}` } : null,
    cases: cards,
  };
}

/** Top-level solutions (products and AI solutions) in menu order; Arivoo modules ride along as `modules`. */
export async function getSolutions(): Promise<SolutionListItem[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("solutions");
  const rows = await listRows();
  return rows.map(toListItem);
}

export async function getSolution(slug: string): Promise<SolutionPageData | null> {
  "use cache";
  cacheLife("hours");
  cacheTag("solutions", `solution:${slug}`);
  // Arivoo modules live on arivoo.in, so they have no page of their own here.
  const s = await db.solution.findFirst({
    where: { slug, ...visible, kind: { not: "ARIVOO_MODULE" } },
    include: {
      image: mediaSelect,
      children: { where: visible, orderBy: { sortOrder: "asc" }, include: { image: mediaSelect } },
      features: { where: visible, orderBy: { sortOrder: "asc" } },
      screenshots: { orderBy: { sortOrder: "asc" }, include: { image: mediaSelect } },
      integrations: { where: visible, orderBy: { name: "asc" } },
      caseStudies: { where: visible, orderBy: { sortOrder: "asc" }, include: { ...caseCardInclude, results: { orderBy: { sortOrder: "asc" } } } },
      faqs: { where: visible, orderBy: { sortOrder: "asc" } },
    },
  });
  if (!s) return null;
  const all = await listRows();
  return {
    slug: s.slug,
    kind: s.kind,
    name: s.name,
    tagline: s.tagline,
    summary: s.summary,
    body: s.body,
    externalUrl: s.externalUrl,
    image: toMedia(s.image),
    modules: s.children.map(toModule),
    features: s.features.map((f) => ({ title: f.title, body: f.body ?? undefined })),
    screenshots: s.screenshots.flatMap((x) => {
      const image = toMedia(x.image);
      return image ? [{ image, caption: x.caption }] : [];
    }),
    integrations: s.integrations.map((t) => t.name),
    caseStudies: s.caseStudies.map(safeCaseCard),
    practiceResults: s.caseStudies[0] ? clearedResults(s.caseStudies[0].slug, s.caseStudies[0].results).map((r) => ({ value: r.value, label: r.label })) : [],
    faqs: s.faqs.map((f) => ({ question: f.question, answer: f.answer })),
    // Same kind first, then the rest, so the "more" grid stays relevant.
    more: all
      .filter((x) => x.slug !== s.slug)
      .sort((a, b) => Number(b.kind === s.kind) - Number(a.kind === s.kind))
      .map(toListItem),
    seoTitle: s.seoTitle,
    seoDescription: s.seoDescription,
    noindex: s.noindex,
  };
}

/** Every solution with a page (all visible solutions except the Arivoo modules), for generateStaticParams. */
export async function getSolutionParams(): Promise<{ slug: string }[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("solutions");
  const rows = await db.solution.findMany({ where: { ...visible, kind: { not: "ARIVOO_MODULE" } }, select: { slug: true } });
  return rows.map((r) => ({ slug: r.slug }));
}
