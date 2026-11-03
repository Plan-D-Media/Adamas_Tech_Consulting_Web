import type { Metadata } from "next";
import Link from "next/link";
import { getEvents } from "@/lib/data/events";
import { copy } from "@/lib/placeholder";
import { PageHero } from "@/components/layout/PageHero";
import { CardArt } from "@/components/media/CardArt";
import { ArrowLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Eyebrow, SectionHeader } from "@/components/ui/SectionHeader";
import { RevealScope } from "@/components/motion/RevealScope";
import { InnerCta } from "@/components/sections/InnerCta";
import { DateBlock, EventCard, FeaturedEventCard } from "@/components/events/EventCard";
import { NewsletterForm } from "@/components/newsletter/NewsletterForm";

export const metadata: Metadata = {
  title: "Events",
  description: "Upcoming and past AdamasTech Consulting events.",
  alternates: { canonical: "/insights/events" },
};

/** Events listing: the next event as a featured split card, further upcoming events in a grid, then past events. */
export default async function EventsPage() {
  const { upcoming, past } = await getEvents();
  const [next, ...later] = upcoming;

  return (
    <RevealScope>
      <PageHero
        crumbs={[{ label: "Insights", href: "/insights" }, { label: "Events" }]}
        eyebrow="Insights"
        title="Events"
        intro="Upcoming and past AdamasTech events, with dates, venues and registration."
        art="calendar"
        artVariant={2}
        aside={
          next ? (
            <Link
              href={`/insights/events/${next.slug}`}
              className="group block rounded-card bg-white/5 p-6 ring-1 ring-white/15 backdrop-blur-sm transition-colors duration-(--duration-base) hover:bg-white/10"
              data-spotlight
            >
              <p className="eyebrow text-sky-300">Next event</p>
              <div className="mt-5 flex items-start gap-5">
                <DateBlock iso={next.startsAt} tz={next.timezone} tone="dark" className="shrink-0" />
                <div className="min-w-0">
                  <p className="font-display text-h4 font-bold text-white">{copy(next.title).text}</p>
                  {next.venueName && (
                    <p className="mt-2 flex items-start gap-2 text-small text-on-navy-muted">
                      <Icon name="pin" size={16} className="mt-0.5 shrink-0" />
                      {next.venueName}
                    </p>
                  )}
                </div>
              </div>
              <span className="mt-6 inline-flex items-center gap-2 font-semibold text-sky-300">
                <span className="link-underline">{next.registrationOpen ? "Register your place" : "View event"}</span>
                <Icon name="arrowRight" size={18} className="transition-transform duration-(--duration-fast) ease-(--ease-out-expo) group-hover:translate-x-1" />
              </span>
            </Link>
          ) : undefined
        }
      />

      <section aria-labelledby="upcoming-h" className="section-y tone-white">
        <div className="container-site">
          <SectionHeader id="upcoming-h" eyebrow="Upcoming" heading="Upcoming events" />
          {next ? (
            <div className="mt-12 md:mt-16" data-reveal>
              <FeaturedEventCard event={next} />
            </div>
          ) : (
            <div className="mt-12 rounded-card border border-dashed border-grey-300 bg-grey-25 p-8 md:mt-16 md:p-12" data-reveal>
              <Icon name="calendar" size={32} strokeWidth={1.5} className="text-brand-600" />
              <p className="mt-5 font-display text-h3 font-bold text-navy-950">No upcoming events right now</p>
              <p className="mt-3 max-w-xl text-grey-700">New dates are announced here first. Subscribe below to hear about them.</p>
            </div>
          )}
          {later.length > 0 && (
            <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:mt-8 lg:grid-cols-3 lg:gap-6">
              {later.map((e, i) => (
                <li key={e.slug} data-reveal>
                  <EventCard event={e} index={i} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section aria-labelledby="past-h" className="section-y tone-mist">
        <div className="container-site">
          <SectionHeader id="past-h" eyebrow="Archive" heading="Past events" />
          {past.length > 0 ? (
            <ul className="mt-12 grid gap-4 sm:grid-cols-2 md:mt-16 lg:grid-cols-3 lg:gap-6">
              {past.map((e, i) => (
                <li key={e.slug} data-reveal>
                  <EventCard event={e} index={i + 1} past />
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-12 grid overflow-hidden rounded-card border border-grey-200 bg-white md:mt-16 lg:grid-cols-12" data-reveal>
              <div className="relative min-h-64 overflow-hidden lg:col-span-5 lg:min-h-full">
                <CardArt icon="clock" variant={1} />
                <div className="absolute inset-0 flex flex-col justify-end p-7 text-white md:p-10">
                  <p className="eyebrow text-sky-300">Archive</p>
                  <p className="mt-3 max-w-[18ch] font-display text-h3 font-bold">Past events will appear here</p>
                </div>
              </div>
              <div className="p-7 sm:p-9 lg:col-span-7 lg:p-12">
                <Eyebrow>Stay informed</Eyebrow>
                <h3 className="mt-4 max-w-[22ch] text-h3 text-navy-950">Hear about the next event first</h3>
                <p className="mt-4 max-w-[52ch] text-grey-700">
                  Events move here once they have taken place. Leave your email and we will tell you when new dates are announced.
                </p>
                <NewsletterForm permalink="/insights/events" className="relative mt-8 max-w-xl" />
                <ArrowLink href="/insights/blog" className="mt-8">
                  Visit the blog
                </ArrowLink>
              </div>
            </div>
          )}
        </div>
      </section>

      <InnerCta />
    </RevealScope>
  );
}
