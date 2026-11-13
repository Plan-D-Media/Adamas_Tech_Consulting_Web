import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getEvent, getEventParams } from "@/lib/data/events";
import { longDate } from "@/lib/dates";
import { optionalCopy, plain } from "@/lib/placeholder";
import { EventHero } from "@/components/events/EventHero";
import { EventDetails } from "@/components/events/EventDetails";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

export async function generateStaticParams() {
  return getEventParams();
}

export async function generateMetadata({ params }: PageProps<"/insights/events/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const e = await getEvent(slug);
  if (!e) return {};
  const summary = optionalCopy(e.summary);
  const fallback = `${longDate(e.startsAt, e.timezone)}${e.venueName ? `, ${plain(e.venueName)}` : ""}.`;
  return {
    title: e.seoTitle ?? plain(e.title),
    description: e.seoDescription ?? (summary && !summary.pending ? summary.text : fallback),
    alternates: { canonical: `/insights/events/${slug}` },
    robots: e.noindex ? { index: false } : undefined,
    openGraph: { images: [{ url: (e.ogImage ?? e.image)?.url ?? `${siteUrl}/media/images/events/house-of-lords-keynote.webp` }] },
  };
}

/**
 * Navigations may block (instant = false): params are read outside <Suspense>, so the page and its registration form
 * (lib/actions/event.ts) are complete without JavaScript.
 */
export const instant = false;

export default function EventPage({ params }: PageProps<"/insights/events/[slug]">) {
  return <Event params={params} />;
}

async function Event({ params }: { params: PageProps<"/insights/events/[slug]">["params"] }) {
  const { slug } = await params;
  const e = await getEvent(slug);
  if (!e) notFound();
  const summary = optionalCopy(e.summary);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: plain(e.title),
    startDate: e.startsAt,
    ...(e.endsAt ? { endDate: e.endsAt } : {}),
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    ...(summary && !summary.pending ? { description: summary.text } : {}),
    ...(e.image ? { image: [e.image.url.startsWith("http") ? e.image.url : `${siteUrl}${e.image.url}`] } : {}),
    location: { "@type": "Place", name: e.venueName ? plain(e.venueName) : undefined, address: e.venueAddress ?? undefined },
    organizer: { "@type": "Organization", name: "AdamasTech Consulting", url: siteUrl },
    url: `${siteUrl}/insights/events/${e.slug}`,
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <EventHero event={e} />
      <EventDetails event={e} />
    </>
  );
}
