import type { MetadataRoute } from "next";
import { getRegions } from "@/lib/data/site";
import { getPillars } from "@/lib/data/services";
import { getCaseStudyParams } from "@/lib/data/caseStudies";
import { getEventParams } from "@/lib/data/events";
import { getPageLinks } from "@/lib/data/pages";

/** Utility pages that are never listed (also noindex / disallowed in robots.ts). */
const UNLISTED = new Set(["/thank-you", "/search"]);

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

/**
 * XML sitemap, read from the DB: regional homepages (with hreflang alternates; homepages only),
 * then the global inner pages. Drafts never appear (the data readers only return visible rows,
 * and production never previews drafts).
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [regions, pillars, cases, events, pages] = await Promise.all([
    getRegions(),
    getPillars(),
    getCaseStudyParams(),
    getEventParams(),
    getPageLinks(),
  ]);
  const languages: Record<string, string> = { "x-default": `${siteUrl}/` };
  for (const r of regions) for (const tag of r.hreflang) languages[tag] = `${siteUrl}/${r.slug}/`;

  const homes: MetadataRoute.Sitemap = regions.map((r) => ({
    url: `${siteUrl}/${r.slug}/`,
    changeFrequency: "weekly",
    priority: 1,
    alternates: { languages },
  }));

  const page = (path: string, priority = 0.6): MetadataRoute.Sitemap[number] => ({ url: `${siteUrl}${path}`, changeFrequency: "monthly", priority });
  const services: MetadataRoute.Sitemap = [
    page("/services", 0.9),
    ...pillars.flatMap((p) => [page(p.href, 0.8), ...p.services.map((s) => page(s.href, 0.7))]),
  ];

  // No /solutions entries: solutions link out to their own websites and "/solutions" 301s to the homepage
  // section, and a sitemap must only list canonical URLs that answer 200 (17 Nov 2026).
  const rest: MetadataRoute.Sitemap = [
    page("/case-studies", 0.8),
    ...cases.map((c) => page(`/case-studies/${c.slug}`, 0.6)),
    page("/insights", 0.5),
    page("/insights/events", 0.7),
    ...events.map((e) => page(`/insights/events/${e.slug}`, 0.8)),
    page("/insights/blog", 0.3),
    ...pages.filter((p) => !UNLISTED.has(p.path)).map((p) => page(p.path, p.path.startsWith("/about") || p.path === "/contact" ? 0.7 : 0.3)),
  ];

  // De-duplicate in case a Page row shares a path with a template route.
  const seen = new Set<string>();
  return [...homes, ...services, ...rest].filter((e) => !seen.has(e.url) && !!seen.add(e.url));
}
