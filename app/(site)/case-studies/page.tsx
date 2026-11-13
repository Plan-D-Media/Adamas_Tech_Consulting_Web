import type { Metadata } from "next";
import { getCaseListing } from "@/lib/data/caseStudies";
import { getBlocks } from "@/lib/data/site";
import { plain } from "@/lib/placeholder";
import { Placeholder } from "@/components/Placeholder";

export const metadata: Metadata = {
  title: "Case studies",
  description: "Success stories from AdamasTech Consulting’s cloud, digital transformation and AI work.",
  alternates: { canonical: "/case-studies" },
};

export default async function CaseStudiesPage() {
  const [listing, blocks] = await Promise.all([getCaseListing(), getBlocks(null)]);
  const header = blocks["caseStudies.overview"];
  return (
    <Placeholder
      eyebrow={header?.eyebrow}
      title={plain(header?.heading) || "Case studies"}
      intro={plain(header?.body) || `${listing.items.length} case studies across ${listing.industries.length} industries loaded.`}
      links={listing.items.map((c) => ({ label: plain(c.title), href: `/case-studies/${c.slug}` }))}
      linksLabel="Case studies"
    />
  );
}
