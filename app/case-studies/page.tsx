import type { Metadata } from "next";
import { getCaseListing } from "@/lib/data/caseStudies";
import { emptyBlock, getBlocks } from "@/lib/data/site";
import { isPlaceholder } from "@/lib/placeholder";
import { PageHero } from "@/components/layout/PageHero";
import { Img } from "@/components/media/Img";
import { CaseExplorer } from "@/components/case-studies/CaseExplorer";
import { ArrowLink, ButtonLink } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { RevealScope } from "@/components/motion/RevealScope";
import { InnerCta } from "@/components/sections/InnerCta";

export const metadata: Metadata = {
  title: "Case studies",
  description: "Success stories from AdamasTech Consulting's cloud, digital transformation and AI work.",
  alternates: { canonical: "/case-studies" },
};

/** Case-study index: every visible story, filterable by industry and service pillar (client-side, so the route stays static). */
export default async function CaseStudiesPage() {
  const [listing, blocks] = await Promise.all([getCaseListing(), getBlocks(null)]);
  const intro = blocks["home.caseStudies"] ?? emptyBlock;
  // Hero mosaic: the first four stories with photography and a cleared headline figure.
  const mosaic = listing.items.filter((c) => c.image && !isPlaceholder(c.headlineMetric)).slice(0, 4);

  return (
    <RevealScope>
      <PageHero
        crumbs={[{ label: "Case studies" }]}
        eyebrow={intro.eyebrow ?? "Case studies"}
        title={intro.heading ?? "Case studies"}
        intro={intro.body}
        art="chart"
        artVariant={1}
        size="lg"
        actions={
          <>
            <ButtonLink href="/contact" arrow>
              Talk to an expert
            </ButtonLink>
            <ArrowLink href="#stories" tone="dark">
              Browse the stories
            </ArrowLink>
          </>
        }
        aside={
          mosaic.length === 4 ? (
            <div aria-hidden="true" className="hidden grid-cols-2 gap-3 lg:grid">
              {mosaic.map((c, i) => (
                <div key={c.slug} className={i % 2 === 1 ? "relative aspect-[4/5] translate-y-8 overflow-hidden rounded-card ring-1 ring-white/15" : "relative aspect-[4/5] overflow-hidden rounded-card ring-1 ring-white/15"}>
                  <Img media={c.image} sizes="200px" alt="" />
                  <span className="absolute inset-0 bg-linear-to-t from-navy-950/70 via-transparent to-transparent" />
                  <span className="absolute bottom-3 left-3 font-display-wide text-h4 font-bold tabular-nums text-white">{c.headlineMetric}</span>
                </div>
              ))}
            </div>
          ) : undefined
        }
      />

      <section id="stories" aria-labelledby="stories-h" className="section-y tone-white scroll-mt-(--header-h)">
        <div className="container-site">
          <SectionHeader id="stories-h" eyebrow="Success stories" heading="Explore our work" />
          <div className="mt-10 md:mt-14">
            <CaseExplorer items={listing.items} industries={listing.industries} pillars={listing.pillars} />
          </div>
        </div>
      </section>

      <InnerCta />
    </RevealScope>
  );
}
