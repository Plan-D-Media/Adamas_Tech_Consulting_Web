import type { PillarData } from "@/lib/data/home";
import type { Block } from "@/lib/data/site";
import { plain } from "@/lib/placeholder";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ServicesTabs } from "@/components/home/ServicesTabs";

/**
 * Our Services (Figma Frame 12459): tint-50 band, header, three pillar tabs with a blue underline, then the active
 * pillar's panel: image card (551x556, caption, "01" badge) and copy, sub-service links in two columns, "Explore"
 * outline button. Pillars and sub-services come from the database with the sitemap names.
 */
export function Services({ block, pillars }: { block: Block; pillars: PillarData[] }) {
  if (pillars.length === 0) return null;
  return (
    <section aria-labelledby="services-heading" data-compare="services" className="bg-tint-50 py-16 lg:py-[104px]">
      <div className="container-site">
        <SectionHeader id="services-heading" eyebrow={plain(block.eyebrow)} heading={plain(block.heading)} body={plain(block.body)} headingClassName="max-w-[45rem]" />
        <ServicesTabs
          pillars={pillars.map((p, i) => ({
            slug: p.slug,
            name: plain(p.name),
            // Figma caption on the image card is the pillar's outcome line ("Cloud that Scales your Organisation").
            tagline: p.outcomeLine ? plain(p.outcomeLine) : p.tagline ? plain(p.tagline) : null,
            summary: p.summary ? plain(p.summary) : null,
            image: p.image ? { url: p.image.url, alt: p.image.alt } : null,
            index: i + 1,
            href: `/services/${p.slug}`,
            services: p.services.map((s) => ({ name: plain(s.name), href: s.href })),
          }))}
        />
      </div>
    </section>
  );
}
