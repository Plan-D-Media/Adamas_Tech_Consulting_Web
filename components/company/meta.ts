import type { Metadata } from "next";
import { optionalCopy, plain } from "@/lib/placeholder";

/** Metadata for a Page row: SEO fields first, then the title and intro; placeholders never leak into <head>. */
export function pageMetadata(
  page: { title: string; intro: string | null; seoTitle: string | null; seoDescription: string | null; noindex: boolean } | null,
  path: string,
  fallbackTitle?: string,
): Metadata {
  if (!page) return fallbackTitle ? { title: fallbackTitle } : {};
  const description = page.seoDescription ?? optionalCopy(page.intro)?.text;
  return {
    title: page.seoTitle ?? plain(page.title),
    description: description || undefined,
    alternates: { canonical: path },
    robots: page.noindex ? { index: false, follow: true } : undefined,
  };
}

/** Hero intro only when it is real copy (an instruction-only placeholder renders nothing rather than "to be confirmed"). */
export function heroIntro(intro: string | null | undefined): string | null {
  return optionalCopy(intro) ? (intro as string) : null;
}

/** Initials for a monogram portrait: "KayCee (Koushik Chatterjee)" → "KC". */
export function initials(name: string): string {
  const base = plain(name).replace(/\(.*?\)/g, " ").trim();
  const words = base.split(/\s+/).filter(Boolean);
  if (!words.length) return "";
  const first = words[0];
  const caps = first.match(/[A-Z]/g);
  if (words.length === 1 && caps && caps.length >= 2) return caps.slice(0, 2).join("");
  return (first[0] + (words.length > 1 ? words[words.length - 1][0] : "")).toUpperCase();
}
