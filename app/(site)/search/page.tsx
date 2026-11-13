import type { Metadata } from "next";
import { getSearchIndex } from "@/lib/data/search";
import { Placeholder } from "@/components/Placeholder";

export const metadata: Metadata = {
  title: "Search",
  description: "Search AdamasTech Consulting services, solutions, case studies and pages.",
  alternates: { canonical: "/search" },
  robots: { index: false, follow: true },
};

/** Figma has no search entry point; the route stays so existing links keep working (brief section 8). */
export default async function SearchPage() {
  const items = await getSearchIndex();
  return <Placeholder title="Search" intro={`${items.length} pages, services, solutions, case studies and events are indexed.`} />;
}
