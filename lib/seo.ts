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
