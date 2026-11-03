import type { Metadata } from "next";
import { getSearchIndex } from "@/lib/data/search";
import { PageHero } from "@/components/layout/PageHero";
import { SiteSearch } from "@/components/company/SiteSearch";

export const metadata: Metadata = {
  title: "Search",
  description: "Search AdamasTech Consulting services, solutions, case studies and pages.",
  alternates: { canonical: "/search" },
  robots: { index: false, follow: true },
};

/**
 * Site search. The route is static: the cached index is rendered into the page and filtered in the browser,
 * so reading ?q= never makes it dynamic (cacheComponents). The header's search icon links here.
 */
export default async function SearchPage() {
  const items = await getSearchIndex();
  // Suggestions come from the index itself: the service pillars, then the first solutions.
  const pillars = items.filter((i) => i.type === "Service" && i.href.split("/").length === 3);
  const solutions = items.filter((i) => i.type === "Solution").slice(0, 2);
  const suggestions = [...pillars, ...solutions].map((i) => ({ label: i.title, query: i.title }));

  return (
    <>
      <PageHero crumbs={[{ label: "Search" }]} eyebrow="Site search" title="Search AdamasTech" art="search" artVariant={1} size="sm" />
      <section aria-label="Search" className="tone-white pb-24 pt-12 md:pb-32 md:pt-16">
        <div className="container-site">
          <SiteSearch items={items} suggestions={suggestions} />
        </div>
      </section>
    </>
  );
}
