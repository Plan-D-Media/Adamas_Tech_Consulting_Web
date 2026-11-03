import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getEvent, getEventParams } from "@/lib/data/events";
import { copy, optionalCopy, plain } from "@/lib/placeholder";
import { PageHero } from "@/components/layout/PageHero";
import { CardArt } from "@/components/media/CardArt";
import { Img } from "@/components/media/Img";
import { Prose } from "@/components/ui/Prose";
import { PendingBlock } from "@/components/ui/PendingBlock";
import { Icon } from "@/components/ui/Icon";
import { ArrowLink, ButtonLink } from "@/components/ui/Button";
import { Eyebrow, SectionHeader, TbcTag } from "@/components/ui/SectionHeader";
import { RevealScope } from "@/components/motion/RevealScope";
import { Countdown } from "@/components/motion/Countdown";
import { InnerCta } from "@/components/sections/InnerCta";
import { RegistrationForm } from "@/components/events/RegistrationForm";
import { AgendaTimeline, CalendarLink, EventFacts, SpeakerGrid, calendarHref } from "@/components/events/EventParts";
import { DateBlock } from "@/components/events/EventCard";
import { longDate, mapsUrl, timeRange } from "@/components/events/format";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

export async function generateStaticParams() {
  return getEventParams();
}

export async function generateMetadata({ params }: PageProps<"/insights/events/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const e = await getEvent(slug);
  if (!e) return {};
  const summary = optionalCopy(e.summary);
  return {
    title: e.seoTitle ?? plain(e.title),
    description: e.seoDescription ?? (summary && !summary.pending ? summary.text : `${longDate(e.startsAt, e.timezone)}${e.venueName ? `, ${e.venueName}` : ""}.`),
    alternates: { canonical: `/insights/events/${slug}` },
    robots: e.noindex ? { index: false } : undefined,
    openGraph: e.ogImage ? { images: [{ url: e.ogImage.url }] } : undefined,
  };
}

/**
 * Navigations into this page are allowed to block (instant = false) rather than streaming the body behind a
 * <Suspense> fallback. The page is linked from many cards, rails and menu items with default prefetching, so a
 * fallback would flash on every click; blocking waits for the prerendered payload and then shows the whole page.
 * It also keeps params read before streaming starts, so an unknown slug still gets a real 404 status, and the
 * prerendered HTML stays complete without JavaScript.
 */
export const instant = false;

export default function EventPage({ params }: PageProps<"/insights/events/[slug]">) {
  return (
    <EventDetail params={params} />
  );
}

async function EventDetail({ params }: { params: PageProps<"/insights/events/[slug]">["params"] }) {
  const { slug } = await params;
  const e = await getEvent(slug);
  if (!e) notFound();

  const title = copy(e.title);
  const summary = optionalCopy(e.summary);
  const bodyPending = !e.body || copy(e.body).pending;
  // Decided inside the data cache (hours); the registration action re-checks it live on every submit.
  const open = e.isOpen;
  const dateLabel = `${longDate(e.startsAt, e.timezone)}, ${timeRange(e.startsAt, e.endsAt, e.timezone)}`;
  const maps = mapsUrl([e.venueName, e.venueAddress]);
  const venue = [e.venueName, e.venueAddress].filter(Boolean).join(", ");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: plain(e.title),
    startDate: e.startsAt,
    ...(e.endsAt ? { endDate: e.endsAt } : {}),
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    ...(summary && !summary.pending ? { description: summary.text } : {}),
    ...(e.image ? { image: [`${siteUrl}${e.image.url}`] } : {}),
    ...(venue ? { location: { "@type": "Place", name: e.venueName ?? venue, address: e.venueAddress ?? venue } } : {}),
    organizer: { "@type": "Organization", name: "AdamasTech Consulting", url: siteUrl },
    url: `${siteUrl}/insights/events/${e.slug}`,
  };

  return (
    <RevealScope>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <PageHero
        crumbs={[{ label: "Insights", href: "/insights" }, { label: "Events", href: "/insights/events" }, { label: title.text }]}
        eyebrow={e.eyebrow ?? "Event"}
        title={e.title}
        intro={summary?.text}
        image={e.image}
        art="calendar"
        artVariant={1}
        size="lg"
        actions={
          <>
            {open ? (
              <ButtonLink href="#register" size="lg" arrow>
                Register your place
              </ButtonLink>
            ) : (
              <span className="inline-flex min-h-14 items-center rounded-btn border border-white/30 px-6 font-semibold text-white/90">Registration closed</span>
            )}
            <CalendarLink slug={e.slug} tone="dark" />
          </>
        }
        aside={
          <div className="rounded-card bg-navy-950/60 p-6 ring-1 ring-white/15 backdrop-blur-md md:p-7" data-spotlight>
            <p className="eyebrow text-sky-300">Starts in</p>
            <Countdown startsAt={e.startsAt} endsAt={e.endsAt} className="mt-4" />
            <div className="my-6 h-px bg-white/12" />
            <EventFacts event={e} tone="dark" />
          </div>
        }
      />

      {/* Overview */}
      <section aria-labelledby="about-h" className="section-y tone-white">
        <div className="container-site grid-12 gap-y-10">
          <div className="col-span-4 md:col-span-8 lg:col-span-7" data-reveal>
            <Eyebrow>Overview</Eyebrow>
            <h2 id="about-h" className="mt-4 text-h2 text-navy-950">
              About the event
            </h2>
            {bodyPending ? (
              <PendingBlock label="Event description to be confirmed" lines={5} className="mt-8" />
            ) : (
              <Prose text={e.body} className="mt-8 text-lead" />
            )}
          </div>
          <aside className="col-span-4 md:col-span-8 lg:col-span-4 lg:col-start-9" data-reveal>
            <div className="overflow-hidden rounded-card bg-navy-950 text-white" data-spotlight>
              <div className="relative aspect-[16/9] overflow-hidden">
                {e.image ? <Img media={e.image} sizes="(min-width: 1024px) 400px, 100vw" /> : <CardArt icon="award" variant={0} />}
                <DateBlock iso={e.startsAt} tz={e.timezone} tone="dark" className="absolute bottom-5 left-5" />
              </div>
              <div className="p-7">
                <p className="eyebrow text-sky-300">{open ? "Registration open" : "Registration closed"}</p>
                <p className="mt-3 font-display text-h4 font-bold">{open ? "Reserve your place" : "This event is not taking registrations"}</p>
                {e.capacity ? <p className="mt-2 text-small text-on-navy-muted">Limited to {e.capacity} guests.</p> : null}
                {open && (
                  <ButtonLink href="#register" className="mt-7 w-full sm:w-auto" arrow>
                    Register
                  </ButtonLink>
                )}
                <CalendarLink slug={e.slug} tone="dark" className="mt-3 flex" />
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* Agenda: a real time sequence */}
      <section aria-labelledby="agenda-h" className="section-y tone-mist">
        <div className="container-site">
          <SectionHeader
            id="agenda-h"
            eyebrow="Agenda"
            heading="Running order"
            intro={`All times are local to the venue (${e.timezone.replace(/_/g, " ").split("/").pop()}).`}
            action={e.agenda.some((a) => a.needsReview) ? <TbcTag>Timings to be confirmed</TbcTag> : undefined}
          />
          <div className="grid-12">
            <div className="col-span-4 md:col-span-12 lg:col-span-10">
              {e.agenda.length ? (
                <AgendaTimeline items={e.agenda} tz={e.timezone} />
              ) : (
                <PendingBlock label="Agenda to be announced" lines={4} className="mt-12 md:mt-16" />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Speakers */}
      <section aria-labelledby="speakers-h" className="section-y bg-navy-950 text-white" data-morph>
        <div className="container-site">
          <SectionHeader
            id="speakers-h"
            tone="dark"
            eyebrow="Speakers"
            heading={e.speakers.length ? "Who you will hear from" : "Speakers to be announced"}
            intro={e.speakers.length ? null : "The speaker line-up will be published here as soon as it is confirmed."}
          />
          <SpeakerGrid speakers={e.speakers} />
        </div>
      </section>

      {/* Venue and getting there */}
      {venue && (
        <section aria-labelledby="venue-h" className="section-y tone-white">
          <div className="container-site grid-12 items-center gap-y-10">
            <div className="col-span-4 md:col-span-8 lg:col-span-5" data-reveal>
              <Eyebrow>Venue</Eyebrow>
              <h2 id="venue-h" className="mt-4 text-h2 text-navy-950">
                {e.venueName ?? "Venue"}
              </h2>
              {e.venueAddress && (
                <p className="mt-5 flex items-start gap-3 text-lead text-grey-700">
                  <Icon name="pin" size={22} className="mt-1 shrink-0 text-brand-600" />
                  <span>{e.venueAddress}</span>
                </p>
              )}
              {maps && (
                <ArrowLink href={maps} external className="mt-6">
                  Open in Google Maps
                </ArrowLink>
              )}
              <h3 className="mt-10 text-h4 font-bold text-navy-950">Getting there</h3>
              <PendingBlock label="Arrival, access and security details to be confirmed" lines={3} className="mt-4" />
            </div>
            <div className="col-span-4 md:col-span-8 lg:col-span-6 lg:col-start-7" data-reveal>
              <div className="card-media relative aspect-[4/3] overflow-hidden rounded-card bg-navy-900">
                {e.image ? <Img media={e.image} sizes="(min-width: 1024px) 600px, 100vw" /> : <CardArt icon="pin" variant={2} />}
                <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-navy-950/80 via-navy-950/10 to-transparent" />
                <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-4 md:inset-x-8 md:bottom-8">
                  <div className="min-w-0 rounded-card bg-white/10 p-5 text-white ring-1 ring-white/20 backdrop-blur-md">
                    <p className="eyebrow text-sky-300">{e.venueName ? "Location" : "Address"}</p>
                    <p className="mt-2 font-display text-h4 font-bold">{e.venueAddress ?? e.venueName}</p>
                  </div>
                  <DateBlock iso={e.startsAt} tz={e.timezone} tone="dark" className="hidden shrink-0 sm:inline-flex" />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Registration */}
      <section id="register" aria-labelledby="register-h" className={venue ? "section-y tone-mist" : "section-y tone-white"}>
        <div className="container-site grid-12 gap-y-10">
          <div className="col-span-4 md:col-span-8 lg:col-span-5" data-reveal>
            <Eyebrow>Registration</Eyebrow>
            <h2 id="register-h" className="mt-4 text-h2 text-navy-950">
              {open ? "Register your place" : "Registration closed"}
            </h2>
            <p className="mt-5 max-w-[46ch] text-lead text-grey-700">
              {open
                ? "Tell us who you are and we will confirm the details with you by email."
                : "This event is no longer taking registrations. See our other events for upcoming dates."}
            </p>
            <div className="mt-9 rounded-card border border-grey-200 bg-white p-6 md:p-7">
              <EventFacts event={e} />
              <div className="mt-6 border-t border-grey-100 pt-4">
                <CalendarLink slug={e.slug} />
              </div>
            </div>
          </div>
          <div className="col-span-4 md:col-span-8 lg:col-span-6 lg:col-start-7" data-reveal>
            {open ? (
              <RegistrationForm slug={e.slug} eventLabel={title.text} dateLabel={dateLabel} calendarHref={calendarHref(e.slug)} />
            ) : (
              <div className="rounded-card bg-white p-8 ring-1 ring-grey-200 md:p-10">
                <Icon name="calendar" size={32} strokeWidth={1.5} className="text-brand-600" />
                <p className="mt-6 font-display text-h3 font-bold text-navy-950">Registration is closed</p>
                <ArrowLink href="/insights/events" className="mt-6">
                  See all events
                </ArrowLink>
              </div>
            )}
          </div>
        </div>
      </section>

      <InnerCta />
    </RevealScope>
  );
}
