import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getEvent, getEventParams } from "@/lib/data/events";
import { longDate, timeRange } from "@/lib/dates";
import { optionalCopy, plain } from "@/lib/placeholder";
import { Placeholder } from "@/components/Placeholder";

export async function generateStaticParams() {
  return getEventParams();
}

export async function generateMetadata({ params }: PageProps<"/insights/events/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const e = await getEvent(slug);
  if (!e) return {};
  const summary = optionalCopy(e.summary);
  const fallback = `${longDate(e.startsAt, e.timezone)}${e.venueName ? `, ${e.venueName}` : ""}.`;
  return {
    title: e.seoTitle ?? plain(e.title),
    description: e.seoDescription ?? (summary && !summary.pending ? summary.text : fallback),
    alternates: { canonical: `/insights/events/${slug}` },
    robots: e.noindex ? { index: false } : undefined,
    openGraph: e.ogImage ? { images: [{ url: e.ogImage.url }] } : undefined,
  };
}

/**
 * Navigations may block (instant = false): params are read outside <Suspense>, so the page (and later its registration
 * form, lib/actions/event.ts) is complete without JavaScript.
 */
export const instant = false;

export default function EventPage({ params }: PageProps<"/insights/events/[slug]">) {
  return <Event params={params} />;
}

async function Event({ params }: { params: PageProps<"/insights/events/[slug]">["params"] }) {
  const { slug } = await params;
  const e = await getEvent(slug);
  if (!e) notFound();
  const when = `${longDate(e.startsAt, e.timezone)}, ${timeRange(e.startsAt, e.endsAt, e.timezone)}`;
  return (
    <Placeholder
      eyebrow={plain(e.eyebrow) || "Event"}
      title={plain(e.title)}
      intro={[when, e.venueName ? plain(e.venueName) : null].filter(Boolean).join(". ")}
      links={[
        { label: "Add to calendar (.ics)", href: `/insights/events/${slug}/calendar`, external: true },
        { label: "All events", href: "/insights/events" },
      ]}
    />
  );
}
