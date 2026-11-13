import type { Metadata } from "next";
import { getEvents } from "@/lib/data/events";
import { plain } from "@/lib/placeholder";
import { Placeholder } from "@/components/Placeholder";

export const metadata: Metadata = {
  title: "Events",
  description: "Upcoming and past AdamasTech Consulting events.",
  alternates: { canonical: "/insights/events" },
};

export default async function EventsPage() {
  const { upcoming, past } = await getEvents();
  return (
    <Placeholder
      eyebrow="Insights"
      title="Events"
      intro={`${upcoming.length} upcoming and ${past.length} past events loaded.`}
      links={[...upcoming, ...past].map((e) => ({ label: plain(e.title), href: `/insights/events/${e.slug}` }))}
      linksLabel="Events"
    />
  );
}
