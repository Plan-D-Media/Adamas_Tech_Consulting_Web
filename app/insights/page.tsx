import type { Metadata } from "next";
import { getEvents } from "@/lib/data/events";
import { PageHero } from "@/components/layout/PageHero";
import { Eyebrow, SectionHeader } from "@/components/ui/SectionHeader";
import { RevealScope } from "@/components/motion/RevealScope";
import { InnerCta } from "@/components/sections/InnerCta";
import { NewsletterForm } from "@/components/newsletter/NewsletterForm";
import { shortDate } from "@/components/events/format";
import { VisualLinkCard } from "./_components/VisualLinkCard";

export const metadata: Metadata = {
  title: "Insights",
  description: "Events and the AdamasTech Consulting blog.",
  alternates: { canonical: "/insights" },
};

const pill = (text: string) => (
  <span className="inline-flex items-center rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-navy-950">{text}</span>
);

/** Insights hub: signposts to Events and the Blog, plus the newsletter. */
export default async function InsightsPage() {
  const { upcoming } = await getEvents();
  const next = upcoming[0];

  return (
    <RevealScope>
      <PageHero crumbs={[{ label: "Insights" }]} eyebrow="Insights" title="Insights" intro="Events and articles from AdamasTech Consulting." art="spark" artVariant={2} />

      <section aria-labelledby="hub-h" className="section-y tone-white">
        <div className="container-site">
          <SectionHeader id="hub-h" eyebrow="Explore" heading="Events and the blog" />
          <ul className="mt-12 grid gap-4 md:mt-16 md:grid-cols-2 lg:gap-6">
            <li data-reveal>
              <VisualLinkCard
                href="/insights/events"
                eyebrow="Events"
                title="Events"
                body="Upcoming dates, venues and registration."
                icon="calendar"
                variant={0}
                size="lg"
                cta="See events"
                badge={next ? pill(`Next: ${shortDate(next.startsAt, next.timezone)}`) : undefined}
              />
            </li>
            <li data-reveal>
              <VisualLinkCard href="/insights/blog" eyebrow="Blog" title="Blog" body="Our blog is coming soon. Subscribe to be told when it launches." icon="doc" variant={1} size="lg" cta="Get notified" badge={pill("Coming soon")} />
            </li>
          </ul>
        </div>
      </section>

      <section aria-labelledby="news-h" className="section-y tone-mist">
        <div className="container-site grid-12 items-end gap-y-8">
          <div className="col-span-4 md:col-span-8 lg:col-span-5" data-reveal>
            <Eyebrow>Newsletter</Eyebrow>
            <h2 id="news-h" className="mt-4 text-h2 text-navy-950">
              Stay in the loop
            </h2>
            <p className="mt-5 max-w-[44ch] text-lead text-grey-700">New events and articles, straight to your inbox.</p>
          </div>
          <div className="col-span-4 md:col-span-8 lg:col-span-6 lg:col-start-7" data-reveal>
            <NewsletterForm permalink="/insights" className="relative" />
          </div>
        </div>
      </section>

      <InnerCta />
    </RevealScope>
  );
}
