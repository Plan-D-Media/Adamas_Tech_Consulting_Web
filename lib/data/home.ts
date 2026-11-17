import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { badge, db, visible, visibleStatuses } from "@/lib/db";
import { linkGate } from "@/lib/data/links";
import { mediaSelect, mediaUrl, toMedia, type Media } from "@/lib/media";
import type { RegionCode } from "@/lib/region";

export interface HeroSlideData {
  id: string;
  navLabel: string;
  eyebrow: string | null;
  headline: string;
  body: string | null;
  ctaLabel: string;
  ctaHref: string;
  vimeoId: string | null;
  videoUrl: string | null;
  poster: Media | null;
}

export interface PromoBanner {
  eyebrow?: string;
  heading: string;
  body?: string;
  ctaLabel: string;
  ctaHref: string;
  external?: boolean;
}

export interface LogoData {
  name: string;
  kind: "PARTNER" | "CERTIFICATION" | "CLIENT";
  logo: Media | null;
}

export interface StatData {
  key: string;
  value: string;
  numeric: number | null;
  prefix: string | null;
  suffix: string | null;
  label: string;
}

export interface PillarData {
  slug: string;
  name: string;
  tagline: string | null;
  summary: string | null;
  outcomeLine: string | null;
  image: Media | null;
  services: { slug: string; name: string; descriptor: string | null; href: string }[];
}

export interface SolutionCardData {
  slug: string;
  kind: "PRODUCT" | "AI_SOLUTION" | "ARIVOO_MODULE";
  name: string;
  tagline: string | null;
  summary: string | null;
  href: string;
  external: boolean;
  image: Media | null;
  draft: boolean;
  children: { name: string; href: string; external: boolean }[];
}

export interface IndustryData {
  slug: string;
  tabLabel: string;
  title: string;
  body: string;
  image: Media | null;
  /** DRAFT row previewed with PREVIEW_DRAFTS (badged with SHOW_DRAFT_BADGES): copy not yet confirmed by the client. */
  draft: boolean;
}

export interface CaseCardData {
  slug: string;
  label: string;
  title: string;
  headlineMetric: string;
  metricLabel: string | null;
  clientDescriptor: string | null;
  summary: string | null;
  image: Media | null;
  draft: boolean;
}

export interface EventCardData {
  slug: string;
  title: string;
  eyebrow: string | null;
  summary: string | null;
  startsAt: string;
  endsAt: string | null;
  timezone: string;
  venueName: string | null;
  venueAddress: string | null;
  image: Media | null;
  registrationOpen: boolean;
  draft: boolean;
  needsReview: boolean;
}

export interface AnnouncementData {
  id: string;
  label: string;
  text: string;
  href: string | null;
}

/** A figure from the approved design that the client has not verified yet (hero trust row, Client Outcomes metric). */
export interface ClaimData {
  key: string;
  value: string;
  label: string;
  placement: string;
  draft: boolean;
}

export interface HomeData {
  region: RegionCode;
  seoTitle: string | null;
  seoDescription: string | null;
  ogImage: Media | null;
  slides: HeroSlideData[];
  announcements: AnnouncementData[];
  promoBanner: PromoBanner | null;
  showTrustStrip: boolean;
  showWhyUs: boolean;
  eventProminence: "HIDDEN" | "STANDARD" | "FEATURED";
  event: EventCardData | null;
  serviceCards: { title: string; body: string | null; href: string | null }[];
  logos: LogoData[];
  stats: StatData[];
  pillars: PillarData[];
  solutions: SolutionCardData[];
  industries: IndustryData[];
  caseStudies: CaseCardData[];
  /** Unverified figures shown as designed; DRAFT rows only appear when drafts are previewed, and carry the draft badge. */
  claims: ClaimData[];
}

export function solutionHref(s: { slug: string; externalUrl: string | null }) {
  return s.externalUrl ?? `/solutions/${s.slug}`;
}

export async function getHome(region: RegionCode): Promise<HomeData | null> {
  "use cache";
  cacheLife("hours");
  cacheTag("home", `home:${region}`);

  const home = await db.regionHome.findFirst({
    where: { region, status: "PUBLISHED" },
    include: {
      ogImage: mediaSelect,
      heroSlides: {
        where: visible,
        orderBy: { sortOrder: "asc" },
        include: { poster: mediaSelect, video: { select: { key: true } } },
      },
      serviceCards: { where: visible, orderBy: { sortOrder: "asc" } },
      featuredEvent: { include: { image: mediaSelect } },
    },
  });
  if (!home) return null;

  const now = new Date();
  const [logos, stats, pillars, solutions, industries, caseStudies, announcements, claims] = await Promise.all([
    db.logoItem.findMany({ where: { ...visible, regions: { has: region } }, include: { logo: mediaSelect }, orderBy: { sortOrder: "asc" } }),
    db.stat.findMany({
      where: { status: "PUBLISHED", verified: true, regions: { has: region }, placements: { has: "trust-strip" } },
      orderBy: { sortOrder: "asc" },
    }),
    db.servicePillar.findMany({
      where: visible,
      orderBy: { sortOrder: "asc" },
      include: { image: mediaSelect, services: { where: visible, orderBy: { sortOrder: "asc" } } },
    }),
    db.solution.findMany({
      where: { ...visible, parentId: null },
      orderBy: { sortOrder: "asc" },
      include: { image: mediaSelect, children: { where: visible, orderBy: { sortOrder: "asc" } } },
    }),
    db.industry.findMany({ where: visible, orderBy: { sortOrder: "asc" }, include: { image: mediaSelect } }),
    db.caseStudy.findMany({
      where: { ...visible, featuredIn: { has: region } },
      orderBy: { sortOrder: "asc" },
      include: { image: mediaSelect },
      take: 8,
    }),
    db.announcement.findMany({
      where: {
        ...visible,
        regions: { has: region },
        AND: [{ OR: [{ startsAt: null }, { startsAt: { lte: now } }] }, { OR: [{ endsAt: null }, { endsAt: { gte: now } }] }],
      },
      orderBy: { sortOrder: "asc" },
    }),
    db.stat.findMany({
      where: { ...visible, regions: { has: region }, placements: { hasSome: ["hero-trust", "outcome"] } },
      orderBy: { sortOrder: "asc" },
    }),
  ]);

  const ev = home.featuredEvent;
  const eventVisible = !!ev && visibleStatuses.includes(ev.status);
  // Hero cards that advertise an unpublished case study, event or solution are left out (lib/data/links.ts).
  const links = await linkGate();

  return {
    region,
    seoTitle: home.seoTitle,
    seoDescription: home.seoDescription,
    ogImage: toMedia(home.ogImage),
    slides: home.heroSlides.filter((s) => links.visible(s.ctaHref)).map((s) => ({
      id: s.id,
      navLabel: s.navLabel,
      eyebrow: s.eyebrow,
      headline: s.headline,
      body: s.body,
      ctaLabel: s.ctaLabel,
      ctaHref: s.ctaHref,
      vimeoId: s.vimeoId,
      videoUrl: s.video ? mediaUrl(s.video.key) : null,
      poster: toMedia(s.poster),
    })),
    announcements: announcements.map((a) => ({ id: a.id, label: a.label, text: a.text, href: a.href })),
    promoBanner: (home.promoBanner as PromoBanner | null) ?? null,
    showTrustStrip: home.showTrustStrip,
    showWhyUs: home.showWhyUs,
    eventProminence: home.eventProminence,
    event:
      eventVisible && ev
        ? {
            slug: ev.slug,
            title: ev.title,
            eyebrow: ev.eyebrow,
            summary: ev.summary,
            startsAt: ev.startsAt.toISOString(),
            endsAt: ev.endsAt?.toISOString() ?? null,
            timezone: ev.timezone,
            venueName: ev.venueName,
            venueAddress: ev.venueAddress,
            image: toMedia(ev.image),
            registrationOpen: ev.registrationOpen,
            draft: badge(ev.status),
            needsReview: ev.needsReview,
          }
        : null,
    serviceCards: home.serviceCards.map((c) => ({ title: c.title, body: c.body, href: c.href })),
    logos: logos.map((l) => ({ name: l.name, kind: l.kind, logo: toMedia(l.logo) })),
    stats: stats.map((s) => ({ key: s.key, value: s.value, numeric: s.numeric, prefix: s.prefix, suffix: s.suffix, label: s.label })),
    pillars: pillars.map((p) => ({
      slug: p.slug,
      name: p.name,
      tagline: p.tagline,
      summary: p.summary,
      outcomeLine: p.outcomeLine,
      image: toMedia(p.image),
      services: p.services.map((s) => ({ slug: s.slug, name: s.name, descriptor: s.descriptor, href: `/services/${p.slug}/${s.slug}` })),
    })),
    solutions: solutions.map((s) => ({
      slug: s.slug,
      kind: s.kind,
      name: s.name,
      tagline: s.tagline,
      summary: s.summary,
      href: solutionHref(s),
      external: !!s.externalUrl,
      image: toMedia(s.image),
      draft: badge(s.status),
      children: s.children.map((c) => ({ name: c.name, href: solutionHref(c), external: !!c.externalUrl })),
    })),
    industries: industries.map((i) => ({ slug: i.slug, tabLabel: i.tabLabel, title: i.title, body: i.body, image: toMedia(i.image), draft: badge(i.status) })),
    caseStudies: caseStudies.map((c) => ({
      slug: c.slug,
      label: c.label,
      title: c.title,
      headlineMetric: c.headlineMetric,
      metricLabel: c.metricLabel,
      clientDescriptor: c.clientDescriptor,
      summary: c.summary,
      image: toMedia(c.image),
      draft: badge(c.status),
    })),
    claims: claims.map((s) => ({
      key: s.key,
      value: s.value,
      label: s.label,
      placement: s.placements.find((p) => p === "hero-trust" || p === "outcome") ?? s.placements[0] ?? "",
      draft: badge(s.status),
    })),
  };
}

