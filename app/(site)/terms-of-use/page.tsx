import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPage } from "@/lib/data/pages";
import { plain } from "@/lib/placeholder";
import { breadcrumbJsonLd, pageMetadata, type Crumb } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { Placeholder } from "@/components/Placeholder";
import { LegalDocument } from "@/components/legal/LegalDocument";

const PATH = "/terms-of-use";
const FALLBACK_TITLE = "Terms of Use";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata(await getPage(PATH, "legal"), PATH, FALLBACK_TITLE);
}

export default async function LegalPage() {
  const page = await getPage(PATH, "legal");
  if (!page) notFound();
  const blocks = page.blocks;
  const title = plain(page.title) || FALLBACK_TITLE;
  const crumbs: Crumb[] = [{ name: title, path: PATH }];
  // No migrated text (or blocks that failed validation): keep the interim shell rather than an empty document.
  if (!blocks || blocks.sections.length === 0) return <Placeholder eyebrow={page.eyebrow} title={title} crumbs={crumbs} />;
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <LegalDocument title={title} eyebrow={plain(page.eyebrow)} crumbs={crumbs} blocks={blocks} />
    </>
  );
}
