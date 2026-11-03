import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPage } from "@/lib/data/pages";
import { plain } from "@/lib/placeholder";
import { PageHero } from "@/components/layout/PageHero";
import { LegalDocument } from "./LegalDocument";
import { pageMetadata } from "./meta";

/** Shared template for /privacy-policy, /terms-of-use and /cookie-policy (Page rows with template "legal"). */
export async function legalMetadata(path: string): Promise<Metadata> {
  const page = await getPage(path, "legal");
  return pageMetadata(page, path);
}

export async function LegalPage({ path }: { path: string }) {
  const page = await getPage(path, "legal");
  if (!page) notFound();
  const blocks = page.blocks ?? { sections: [], pending: "[Placeholder] Policy text." };
  return (
    <>
      <PageHero
        crumbs={[{ label: plain(page.title) }]}
        eyebrow={page.eyebrow}
        title={page.title}
        intro={blocks.updated ? `Last updated ${blocks.updated}` : null}
        art="doc"
        artVariant={2}
        size="sm"
      />
      <LegalDocument blocks={blocks} />
    </>
  );
}
