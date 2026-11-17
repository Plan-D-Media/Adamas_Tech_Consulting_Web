import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPage } from "@/lib/data/pages";
import { plain } from "@/lib/placeholder";
import { breadcrumbJsonLd, pageMetadata, type Crumb } from "@/lib/seo";
import { analyticsConfigured } from "@/lib/consent";
import { JsonLd } from "@/components/seo/JsonLd";
import { Placeholder } from "@/components/Placeholder";
import { LegalDocument } from "@/components/legal/LegalDocument";

const PATH = "/cookie-policy";
const FALLBACK_TITLE = "Cookie Policy";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata(await getPage(PATH, "legal"), PATH, FALLBACK_TITLE);
}

/**
 * Two sections of the policy describe the same thing from opposite sides, so exactly one of them is right for
 * any given build: "analytics-cookies" lists the Google cookies and only makes sense when a Tag Manager
 * container is configured, while "no-analytics-advertising-or-tracking-cookies" states their absence and only
 * makes sense when none is. Filtering here keeps both versions of the text in the database, so the page tells
 * the truth the moment analytics is switched on or off, with no content edit (17 Nov 2026).
 */
const OMIT = analyticsConfigured ? ["no-analytics-advertising-or-tracking-cookies"] : ["analytics-cookies"];

export default async function LegalPage() {
  const page = await getPage(PATH, "legal");
  if (!page) notFound();
  const blocks = page.blocks;
  const title = plain(page.title) || FALLBACK_TITLE;
  const crumbs: Crumb[] = [{ name: title, path: PATH }];
  // No migrated text (or blocks that failed validation): keep the interim shell rather than an empty document.
  if (!blocks || blocks.sections.length === 0) return <Placeholder eyebrow={page.eyebrow} title={title} crumbs={crumbs} />;
  const sections = blocks.sections.filter((s) => !OMIT.includes(s.id));
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <LegalDocument title={title} eyebrow={plain(page.eyebrow)} crumbs={crumbs} blocks={{ ...blocks, sections }} />
    </>
  );
}
