import type { Metadata } from "next";
import { getPillars } from "@/lib/data/services";
import { getBlocks } from "@/lib/data/site";
import { plain } from "@/lib/placeholder";
import { Placeholder } from "@/components/Placeholder";

export const metadata: Metadata = {
  title: "Services",
  description: "Cloud, digital transformation and AI services from AdamasTech Consulting.",
  alternates: { canonical: "/services" },
};

export default async function ServicesPage() {
  const [pillars, blocks] = await Promise.all([getPillars(), getBlocks(null)]);
  const header = blocks["services.overview"];
  return (
    <Placeholder
      eyebrow={header?.eyebrow}
      title={plain(header?.heading) || "Services"}
      intro={plain(header?.body) || null}
      links={pillars.map((p) => ({ label: plain(p.name), href: p.href }))}
      linksLabel="Service pillars"
    />
  );
}
