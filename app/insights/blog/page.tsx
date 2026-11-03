import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { RevealScope } from "@/components/motion/RevealScope";
import { InnerCta } from "@/components/sections/InnerCta";
import { NewsletterForm } from "@/components/newsletter/NewsletterForm";
import { VisualLinkCard } from "../_components/VisualLinkCard";

export const metadata: Metadata = {
  title: "Blog",
  description: "The AdamasTech Consulting blog is coming soon. Subscribe to hear when it launches.",
  alternates: { canonical: "/insights/blog" },
};

/** Blog: coming soon. The hero carries the one action (subscribe); below, where to go in the meantime. */
export default function BlogPage() {
  return (
    <RevealScope>
      <PageHero
        crumbs={[{ label: "Insights", href: "/insights" }, { label: "Blog" }]}
        eyebrow="Insights"
        title="Blog"
        intro="Our blog is coming soon. Subscribe and we will email you when the first articles are published."
        art="doc"
        artVariant={0}
        size="lg"
        aside={
          <div className="rounded-card bg-navy-950/60 p-6 ring-1 ring-white/15 backdrop-blur-md md:p-8" data-spotlight>
            <p className="eyebrow text-sky-300">Newsletter</p>
            <p className="mt-3 font-display text-h3 font-bold text-white">Be first to read it</p>
            <NewsletterForm tone="dark" permalink="/insights/blog" className="relative mt-6" />
          </div>
        }
      >
        <p className="mt-8 inline-flex items-center gap-2.5 rounded-full bg-white/10 px-4 py-2 text-small font-semibold text-white ring-1 ring-white/20">
          <span className="relative flex size-2.5">
            <span className="absolute inline-flex size-full rounded-full bg-orange-500 opacity-60 motion-safe:animate-ping" />
            <span className="relative inline-flex size-2.5 rounded-full bg-orange-500" />
          </span>
          Coming soon
        </p>
      </PageHero>

      <section aria-labelledby="meantime-h" className="section-y tone-white">
        <div className="container-site">
          <SectionHeader id="meantime-h" eyebrow="In the meantime" heading="Explore our work" />
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 md:mt-16 lg:grid-cols-3 lg:gap-6">
            <li data-reveal>
              <VisualLinkCard href="/insights/events" eyebrow="Insights" title="Events" body="Upcoming dates, venues and registration." icon="calendar" variant={0} cta="See events" />
            </li>
            <li data-reveal>
              <VisualLinkCard href="/case-studies" eyebrow="Proof" title="Case studies" body="Results from our client engagements." icon="chart" variant={1} cta="Read the stories" />
            </li>
            <li data-reveal>
              <VisualLinkCard href="/services" eyebrow="What we do" title="Services" body="Cloud, digital transformation and AI services." icon="layers" variant={2} cta="Explore services" />
            </li>
          </ul>
        </div>
      </section>

      <InnerCta />
    </RevealScope>
  );
}
