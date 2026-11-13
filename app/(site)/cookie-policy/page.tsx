import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPage } from "@/lib/data/pages";
import { plain } from "@/lib/placeholder";
import { pageMetadata } from "@/lib/seo";
import { Placeholder } from "@/components/Placeholder";

const PATH = "/cookie-policy";
const FALLBACK_TITLE = "Cookie Policy";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata(await getPage(PATH, "legal"), PATH, FALLBACK_TITLE);
}

export default async function LegalPage() {
  const page = await getPage(PATH, "legal");
  if (!page) notFound();
  const blocks = page.blocks;
  return <Placeholder eyebrow={page.eyebrow} title={plain(page.title)} intro={blocks?.updated ? `Last updated ${blocks.updated}. ${blocks.sections.length} sections loaded.` : null} />;
}
