import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPage } from "@/lib/data/pages";
import { getOffices, getRegions } from "@/lib/data/site";
import { plain } from "@/lib/placeholder";
import { heroIntro, pageMetadata } from "@/lib/seo";
import { Placeholder } from "@/components/Placeholder";

const PATH = "/contact";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata(await getPage(PATH, "contact"), PATH, "Contact us");
}

/** The enquiry form (app/contact/actions.ts) is wired back in when this page is rebuilt to Figma. */
export default async function ContactPage() {
  const [page, regions, offices] = await Promise.all([getPage(PATH, "contact"), getRegions(), getOffices()]);
  if (!page) notFound();
  return (
    <Placeholder
      eyebrow={page.eyebrow}
      title={plain(page.title)}
      intro={heroIntro(page.intro) ?? `${regions.length} regional contacts and ${offices.length} offices loaded.`}
      links={regions.filter((r) => r.email).map((r) => ({ label: `${r.label}: ${r.email}`, href: `mailto:${r.email}`, external: true }))}
      linksLabel="Email us"
    />
  );
}
