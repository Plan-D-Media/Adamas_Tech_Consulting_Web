import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { badge, db, visible } from "@/lib/db";
import { mediaSelect, toMedia, type Media } from "@/lib/media";
import type { RegionCode } from "@/lib/region";
import { optionalCopy, plain } from "@/lib/placeholder";

// ── Types returned to components ───────────────────────────────────────

export interface FeaturedCard {
  kind: "case-study" | "event";
  href: string;
  eyebrow: string;
  title: string;
  metric?: string;
  image: Media | null;
  date?: string;
}

export interface NavLink {
  key: string | null;
  label: string;
  descriptor: string | null;
  href: string | null;
  external: boolean;
  comingSoon: boolean;
  draft: boolean;
  children: NavLink[];
  featured: FeaturedCard | null;
}

export interface RegionInfo {
  code: RegionCode;
  slug: string;
  label: string;
  locale: string;
  hreflang: string[];
  phone: string | null;
  phoneHref: string | null;
  whatsapp: string | null;
  email: string | null;
  featuredOfficeSlug: string | null;
}

export interface OfficeInfo {
  slug: string;
  label: string;
  city: string;
  country: string;
  region: RegionCode;
  addressLines: string[];
  phone: string | null;
  phoneHref: string | null;
  lat: number | null;
  lng: number | null;
}

// ── Queries ────────────────────────────────────────────────────────────

const navInclude = {
  featuredCaseStudy: { include: { image: mediaSelect } },
  featuredEvent: { include: { image: mediaSelect } },
} as const;

type NavRow = Awaited<ReturnType<typeof loadNavRows>>[number];

async function loadNavRows(menu: "HEADER" | "FOOTER" | "LEGAL" | "SOCIAL") {
  return db.navItem.findMany({ where: { menu, ...visible }, include: navInclude, orderBy: { sortOrder: "asc" } });
}

function featuredFrom(row: NavRow): FeaturedCard | null {
  const cs = row.featuredCaseStudy;
  if (cs) {
    return {
      kind: "case-study",
      href: `/case-studies/${cs.slug}`,
      eyebrow: cs.label,
      title: plain(cs.title),
      metric: cs.headlineMetric,
      image: toMedia(cs.image),
    };
  }
  const ev = row.featuredEvent;
  if (ev) {
    return {
      kind: "event",
      href: `/insights/events/${ev.slug}`,
      eyebrow: plain(ev.eyebrow) || "Event",
      title: plain(ev.title),
      image: toMedia(ev.image),
      date: ev.startsAt.toISOString(),
    };
  }
  return null;
}

function buildTree(rows: NavRow[]): NavLink[] {
  const byParent = new Map<string | null, NavRow[]>();
  for (const r of rows) {
    const list = byParent.get(r.parentId) ?? [];
    list.push(r);
    byParent.set(r.parentId, list);
  }
  const build = (parentId: string | null): NavLink[] =>
    (byParent.get(parentId) ?? []).map((r) => ({
      key: r.key,
      // Menus never show placeholder brackets: "[AI Product A]" → "AI Product A"; instruction descriptors are dropped.
      label: plain(r.label),
      descriptor: optionalCopy(r.descriptor)?.text ?? null,
      href: r.href,
      external: r.external,
      comingSoon: r.comingSoon,
      draft: badge(r.status),
      children: build(r.id),
      featured: featuredFrom(r),
    }));
  return build(null);
}

export async function getNavigation() {
  "use cache";
  cacheLife("hours");
  cacheTag("nav");
  const [header, footer, legal, social] = await Promise.all([
    loadNavRows("HEADER"),
    loadNavRows("FOOTER"),
    loadNavRows("LEGAL"),
    loadNavRows("SOCIAL"),
  ]);
  return { header: buildTree(header), footer: buildTree(footer), legal: buildTree(legal), social: buildTree(social) };
}

export async function getRegions(): Promise<RegionInfo[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("regions");
  const rows = await db.region.findMany({ include: { featuredOffice: { select: { slug: true } } }, orderBy: { sortOrder: "asc" } });
  return rows.map((r) => ({
    code: r.code,
    slug: r.slug,
    label: r.label,
    locale: r.locale,
    hreflang: r.hreflang,
    phone: r.phone,
    phoneHref: r.phoneHref,
    whatsapp: r.whatsapp,
    email: r.email,
    featuredOfficeSlug: r.featuredOffice?.slug ?? null,
  }));
}

export async function getOffices(): Promise<OfficeInfo[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("offices");
  const rows = await db.office.findMany({ where: { status: "PUBLISHED" }, orderBy: { sortOrder: "asc" } });
  return rows.map((o) => ({
    slug: o.slug,
    label: o.label,
    city: o.city,
    country: o.country,
    region: o.region,
    addressLines: o.addressLines,
    phone: o.phone,
    phoneHref: o.phoneHref,
    lat: o.lat,
    lng: o.lng,
  }));
}

/**
 * Section copy by key. A region-specific row overrides the global row.
 */
export interface Block {
  eyebrow: string | null;
  heading: string | null;
  body: string | null;
  ctaLabel: string | null;
  ctaHref: string | null;
  extra: Record<string, unknown> | null;
}

export async function getBlocks(region: RegionCode | null): Promise<Record<string, Block>> {
  "use cache";
  cacheLife("hours");
  cacheTag("blocks");
  const rows = await db.contentBlock.findMany({
    where: { ...visible, OR: [{ region: null }, ...(region ? [{ region }] : [])] },
    orderBy: { sortOrder: "asc" },
  });
  const out: Record<string, Block> = {};
  // Global rows first, region rows override.
  for (const r of [...rows].sort((a, b) => Number(!!a.region) - Number(!!b.region))) {
    out[r.key] = {
      eyebrow: r.eyebrow,
      heading: r.heading,
      body: r.body,
      ctaLabel: r.ctaLabel,
      ctaHref: r.ctaHref,
      extra: (r.extra as Record<string, unknown> | null) ?? null,
    };
  }
  return out;
}

export const emptyBlock: Block = { eyebrow: null, heading: null, body: null, ctaLabel: null, ctaHref: null, extra: null };
