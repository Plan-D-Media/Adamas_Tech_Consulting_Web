import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { db, visible } from "@/lib/db";
import { plain } from "@/lib/placeholder";
import { solutionHref } from "./home";
import { getPageLinks } from "./pages";

/**
 * Site-search index: one small, cached list (title, descriptor, href, type) rendered into /search and filtered
 * in the browser. Reading searchParams on the server would make the route dynamic under cacheComponents; this
 * keeps /search fully static. Placeholder names are shown without brackets; instruction-only copy is dropped.
 */

export type SearchType = "Service" | "Solution" | "Case study" | "Event" | "Page";

export interface SearchItem {
  type: SearchType;
  title: string;
  descriptor: string;
  href: string;
  /** Extra words that should match but are not shown (pillar name, client, label…). */
  keywords: string;
  external: boolean;
}

const text = (s: string | null | undefined) => {
  const t = plain(s);
  return t === "" ? "" : t;
};

/** Short descriptor: drop placeholder instructions ("[Placeholder] …."), keep the first ~180 characters. */
function descriptor(...candidates: (string | null | undefined)[]): string {
  for (const c of candidates) {
    if (!c || /^\s*\[Placeholder\]/i.test(c)) continue;
    const t = c.replace(/\s+/g, " ").trim();
    if (t) return t.length > 180 ? `${t.slice(0, 177).replace(/\s+\S*$/, "")}…` : t;
  }
  return "";
}

/** Static pages that are not Page rows but are worth finding. */
const STATIC_PAGES: Omit<SearchItem, "external">[] = [
  { type: "Page", title: "Services", descriptor: "Cloud, digital transformation and AI services.", href: "/services", keywords: "overview capabilities" },
  { type: "Page", title: "Case studies", descriptor: "", href: "/case-studies", keywords: "success stories results clients" },
  { type: "Page", title: "Solutions", descriptor: "", href: "/solutions", keywords: "products platforms" },
  { type: "Page", title: "Events", descriptor: "", href: "/insights/events", keywords: "insights" },
];

export async function getSearchIndex(): Promise<SearchItem[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("search", "services", "blocks");

  const [pillars, solutions, cases, events, pages] = await Promise.all([
    db.servicePillar.findMany({ where: visible, orderBy: { sortOrder: "asc" }, include: { services: { where: visible, orderBy: { sortOrder: "asc" } } } }),
    db.solution.findMany({ where: visible, orderBy: { sortOrder: "asc" }, include: { parent: { select: { name: true } } } }),
    db.caseStudy.findMany({ where: visible, orderBy: { sortOrder: "asc" }, include: { industry: { select: { title: true, tabLabel: true } } } }),
    db.event.findMany({ where: visible, orderBy: { startsAt: "asc" } }),
    getPageLinks(),
  ]);

  const items: SearchItem[] = [];

  for (const p of pillars) {
    items.push({
      type: "Service",
      title: text(p.name),
      descriptor: descriptor(p.tagline, p.summary),
      href: `/services/${p.slug}`,
      keywords: p.services.map((s) => text(s.name)).join(" "),
      external: false,
    });
    for (const s of p.services) {
      items.push({
        type: "Service",
        title: text(s.name),
        descriptor: descriptor(s.descriptor, s.summary),
        href: `/services/${p.slug}/${s.slug}`,
        keywords: text(p.name),
        external: false,
      });
    }
  }

  for (const s of solutions) {
    const href = solutionHref(s);
    items.push({
      type: "Solution",
      title: text(s.name),
      descriptor: descriptor(s.tagline, s.summary),
      href,
      keywords: [s.parent?.name, s.kind === "AI_SOLUTION" ? "AI" : ""].filter(Boolean).join(" "),
      external: /^https?:\/\//.test(href),
    });
  }

  for (const c of cases) {
    items.push({
      type: "Case study",
      title: text(c.title),
      descriptor: descriptor(c.summary, c.clientDescriptor),
      href: `/case-studies/${c.slug}`,
      keywords: [c.label, c.clientDescriptor, c.headlineMetric, c.industry?.title, c.industry?.tabLabel].map(text).join(" "),
      external: false,
    });
  }

  for (const e of events) {
    items.push({
      type: "Event",
      title: text(e.title),
      descriptor: descriptor(e.summary, e.eyebrow),
      href: `/insights/events/${e.slug}`,
      keywords: [e.venueName, e.eyebrow].map(text).join(" "),
      external: false,
    });
  }

  for (const p of pages) {
    items.push({ type: "Page", title: text(p.title), descriptor: descriptor(p.intro), href: p.path, keywords: text(p.eyebrow), external: false });
  }
  for (const p of STATIC_PAGES) if (!items.some((i) => i.href === p.href)) items.push({ ...p, external: false });

  return items.filter((i) => i.title);
}
