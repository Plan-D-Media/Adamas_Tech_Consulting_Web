import type { Metadata } from "next";
import { getEvents } from "@/lib/data/events";
import { Placeholder } from "@/components/Placeholder";

export const metadata: Metadata = {
  title: "Insights",
  description: "Events and the AdamasTech Consulting blog.",
  alternates: { canonical: "/insights" },
};

export default async function InsightsPage() {
  const { upcoming } = await getEvents();
  return (
    <Placeholder
      title="Insights"
      intro={`${upcoming.length} upcoming events loaded.`}
      links={[
        { label: "Events", href: "/insights/events" },
        { label: "Blog (coming soon)", href: "/insights/blog" },
      ]}
    />
  );
}
