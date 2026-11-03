import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { db, visible } from "@/lib/db";
import { mediaSelect, toMedia, type Media } from "@/lib/media";
import type { CaseCardData } from "./home";
import { caseCardInclude, titleBodies, toCaseCard, type FaqData, type SeoData, type TitleBody } from "./mappers";

export interface ServiceLink {
  slug: string;
  name: string;
  descriptor: string | null;
  href: string;
}

export interface PillarSummary {
  slug: string;
  name: string;
  tagline: string | null;
  summary: string | null;
  outcomeLine: string | null;
  image: Media | null;
  href: string;
  services: ServiceLink[];
}

export interface PillarPageData extends PillarSummary, SeoData {
  challenge: string | null;
  faqs: FaqData[];
  caseStudies: CaseCardData[];
}

export interface ServicePageData extends SeoData {
  slug: string;
  name: string;
  descriptor: string | null;
  summary: string | null;
  whoFor: string | null;
  whatWeDo: TitleBody[];
  image: Media | null;
  steps: TitleBody[];
  technologies: string[];
  faqs: FaqData[];
  caseStudies: CaseCardData[];
  pillar: { slug: string; name: string; href: string };
  siblings: ServiceLink[];
}

const pillarHref = (slug: string) => `/services/${slug}`;
const serviceHref = (pillar: string, slug: string) => `/services/${pillar}/${slug}`;

export async function getPillars(): Promise<PillarSummary[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("services");
  const rows = await db.servicePillar.findMany({
    where: visible,
    orderBy: { sortOrder: "asc" },
    include: { image: mediaSelect, services: { where: visible, orderBy: { sortOrder: "asc" } } },
  });
  return rows.map((p) => ({
    slug: p.slug,
    name: p.name,
    tagline: p.tagline,
    summary: p.summary,
    outcomeLine: p.outcomeLine,
    image: toMedia(p.image),
    href: pillarHref(p.slug),
    services: p.services.map((s) => ({ slug: s.slug, name: s.name, descriptor: s.descriptor, href: serviceHref(p.slug, s.slug) })),
  }));
}

export async function getPillar(slug: string): Promise<PillarPageData | null> {
  "use cache";
  cacheLife("hours");
  cacheTag("services", `pillar:${slug}`);
  const p = await db.servicePillar.findFirst({
    where: { slug, ...visible },
    include: {
      image: mediaSelect,
      services: { where: visible, orderBy: { sortOrder: "asc" } },
      faqs: { where: visible, orderBy: { sortOrder: "asc" } },
      caseStudies: { where: visible, orderBy: { sortOrder: "asc" }, include: caseCardInclude },
    },
  });
  if (!p) return null;
  return {
    slug: p.slug,
    name: p.name,
    tagline: p.tagline,
    summary: p.summary,
    outcomeLine: p.outcomeLine,
    challenge: p.challenge,
    image: toMedia(p.image),
    href: pillarHref(p.slug),
    services: p.services.map((s) => ({ slug: s.slug, name: s.name, descriptor: s.descriptor, href: serviceHref(p.slug, s.slug) })),
    faqs: p.faqs.map((f) => ({ question: f.question, answer: f.answer })),
    caseStudies: p.caseStudies.map(toCaseCard),
    seoTitle: p.seoTitle,
    seoDescription: p.seoDescription,
    noindex: p.noindex,
  };
}

export async function getService(pillarSlug: string, slug: string): Promise<ServicePageData | null> {
  "use cache";
  cacheLife("hours");
  cacheTag("services", `service:${pillarSlug}/${slug}`);
  const s = await db.service.findFirst({
    where: { slug, ...visible, pillar: { slug: pillarSlug, ...visible } },
    include: {
      image: mediaSelect,
      pillar: { include: { services: { where: visible, orderBy: { sortOrder: "asc" } } } },
      steps: { where: visible, orderBy: { sortOrder: "asc" } },
      technologies: { where: visible, orderBy: { name: "asc" } },
      faqs: { where: visible, orderBy: { sortOrder: "asc" } },
      caseStudies: { where: visible, orderBy: { sortOrder: "asc" }, include: caseCardInclude },
    },
  });
  if (!s) return null;
  return {
    slug: s.slug,
    name: s.name,
    descriptor: s.descriptor,
    summary: s.summary,
    whoFor: s.whoFor,
    whatWeDo: titleBodies(s.whatWeDo),
    image: toMedia(s.image),
    steps: s.steps.map((st) => ({ title: st.title, body: st.body ?? undefined })),
    technologies: s.technologies.map((t) => t.name),
    faqs: s.faqs.map((f) => ({ question: f.question, answer: f.answer })),
    caseStudies: s.caseStudies.map(toCaseCard),
    pillar: { slug: s.pillar.slug, name: s.pillar.name, href: pillarHref(s.pillar.slug) },
    siblings: s.pillar.services
      .filter((x) => x.slug !== s.slug)
      .map((x) => ({ slug: x.slug, name: x.name, descriptor: x.descriptor, href: serviceHref(s.pillar.slug, x.slug) })),
    seoTitle: s.seoTitle,
    seoDescription: s.seoDescription,
    noindex: s.noindex,
  };
}

/** Every pillar/service pair, for generateStaticParams. */
export async function getServiceParams(): Promise<{ pillar: string; service: string }[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("services");
  const rows = await db.service.findMany({ where: { ...visible, pillar: visible }, select: { slug: true, pillar: { select: { slug: true } } } });
  return rows.map((r) => ({ pillar: r.pillar.slug, service: r.slug }));
}
