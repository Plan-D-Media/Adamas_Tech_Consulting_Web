import type { Metadata } from "next";
import { mediaUrl } from "@/lib/media";
import { optionalCopy, plain } from "@/lib/placeholder";

/** Page metadata helpers shared by the route files (moved from the prototype's components/company/meta.ts). */

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
export const SITE_NAME = "AdamasTech Consulting";

/** Absolute URL for a site path or an already-absolute media URL. */
export function absoluteUrl(pathOrUrl: string): string {
  return /^https?:\/\//.test(pathOrUrl) ? pathOrUrl : `${siteUrl}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`;
}

/** Share image used when a row has no Open Graph image of its own (the hero artwork from the approved design). */
export const defaultOgImage = () => absoluteUrl(mediaUrl("images/home/hero-bg.webp"));

/** Open Graph and Twitter card tags for a page (brief section 10: every page carries them; QA BUG-011). */
export function openGraphFor(title: string, description: string | undefined, path: string, image?: string | null): Pick<Metadata, "openGraph" | "twitter"> {
  const img = image ? absoluteUrl(image) : defaultOgImage();
  return {
    openGraph: { type: "website", siteName: SITE_NAME, title, description, url: path, images: [{ url: img }] },
    twitter: { card: "summary_large_image", title, description, images: [img] },
  };
}

/** Metadata for a Page row: SEO fields first, then the title and intro; placeholders never leak into <head>. */
export function pageMetadata(
  page: { title: string; intro: string | null; seoTitle: string | null; seoDescription: string | null; noindex: boolean } | null,
  path: string,
  fallbackTitle?: string,
): Metadata {
  if (!page) return fallbackTitle ? { title: fallbackTitle, ...openGraphFor(fallbackTitle, undefined, path) } : {};
  const description = page.seoDescription ?? optionalCopy(page.intro)?.text;
  const title = page.seoTitle ?? plain(page.title);
  return {
    title,
    description: description || undefined,
    alternates: { canonical: path },
    robots: page.noindex ? { index: false, follow: true } : undefined,
    ...openGraphFor(title, description || undefined, path),
  };
}

/** Hero intro only when it is real copy (an instruction-only placeholder renders nothing rather than "to be confirmed"). */
export function heroIntro(intro: string | null | undefined): string | null {
  return optionalCopy(intro) ? (intro as string) : null;
}

export interface Crumb {
  name: string;
  path: string;
}

/** schema.org BreadcrumbList for an inner page; the Home crumb is added first (brief section 10). */
export function breadcrumbJsonLd(crumbs: Crumb[]) {
  const items = [{ name: "Home", path: "/" }, ...crumbs];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, item: absoluteUrl(c.path) })),
  };
}

/** schema.org Organization, emitted on every page by the site chrome. */
export function organizationJsonLd(opts: { sameAs: string[]; phones: { phone: string; region: string }[] }) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: `${siteUrl}/`,
    logo: absoluteUrl(mediaUrl("brand/logo.webp")),
    ...(opts.sameAs.length ? { sameAs: opts.sameAs } : {}),
    ...(opts.phones.length
      ? { contactPoint: opts.phones.map((p) => ({ "@type": "ContactPoint", telephone: p.phone, contactType: "sales", areaServed: p.region })) }
      : {}),
  };
}

/**
 * schema.org Service for a pillar or sub-service page (INNER_PAGES.md section 3). `provider` is the Organization
 * the chrome already emits; `areaServed` carries the three delivery regions the site sells into.
 */
export function serviceJsonLd(opts: { name: string; description?: string | null; path: string; image?: string | null; category?: string | null }) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: opts.name,
    url: absoluteUrl(opts.path),
    ...(opts.description ? { description: opts.description } : {}),
    ...(opts.image ? { image: absoluteUrl(opts.image) } : {}),
    ...(opts.category ? { serviceType: opts.category } : {}),
    provider: { "@type": "Organization", name: SITE_NAME, url: `${siteUrl}/` },
    areaServed: ["IN", "GB", "IE", "AE", "SA", "QA", "KW", "BH", "OM"],
  };
}

/** schema.org Article for a case-study detail page (INNER_PAGES.md section 3). */
export function articleJsonLd(opts: { headline: string; description?: string | null; path: string; image?: string | null; published?: string | null; modified?: string | null }) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: opts.headline,
    mainEntityOfPage: absoluteUrl(opts.path),
    ...(opts.description ? { description: opts.description } : {}),
    ...(opts.image ? { image: absoluteUrl(opts.image) } : {}),
    ...(opts.published ? { datePublished: opts.published } : {}),
    ...(opts.modified ? { dateModified: opts.modified } : {}),
    author: { "@type": "Organization", name: SITE_NAME, url: `${siteUrl}/` },
    publisher: { "@type": "Organization", name: SITE_NAME, url: `${siteUrl}/` },
  };
}

/**
 * schema.org JobPosting for a published vacancy (INNER_PAGES.md section 3: published jobs only).
 * `hiringOrganization` is the Organization the chrome already emits.
 */
export function jobPostingJsonLd(opts: {
  title: string;
  description?: string | null;
  path: string;
  location?: string | null;
  region?: string | null;
  type?: string | null;
  remote?: boolean;
  posted?: string | null;
  closes?: string | null;
}) {
  const COUNTRY: Record<string, string> = { IN: "IN", UK: "GB", GCC: "AE" };
  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: opts.title,
    url: absoluteUrl(opts.path),
    ...(opts.description ? { description: opts.description } : {}),
    ...(opts.posted ? { datePosted: opts.posted.slice(0, 10) } : {}),
    ...(opts.closes ? { validThrough: opts.closes } : {}),
    ...(opts.type ? { employmentType: opts.type.toUpperCase().replace(/[^A-Z]+/g, "_") } : {}),
    ...(opts.remote ? { jobLocationType: "TELECOMMUTE" } : {}),
    ...(opts.location || opts.region
      ? {
          jobLocation: {
            "@type": "Place",
            address: {
              "@type": "PostalAddress",
              ...(opts.location ? { addressLocality: opts.location } : {}),
              ...(opts.region && COUNTRY[opts.region] ? { addressCountry: COUNTRY[opts.region] } : {}),
            },
          },
        }
      : {}),
    hiringOrganization: { "@type": "Organization", name: SITE_NAME, url: `${siteUrl}/` },
  };
}
