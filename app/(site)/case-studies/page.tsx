import type { Metadata } from "next";
import Link from "next/link";
import { getCaseListing } from "@/lib/data/caseStudies";
import { getBlocks } from "@/lib/data/site";
import { plain } from "@/lib/placeholder";
import { breadcrumbJsonLd, openGraphFor, type Crumb } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { RevealScope } from "@/components/motion/RevealScope";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Icon } from "@/components/ui/Icon";
import { Eyebrow, Heading2 } from "@/components/ui/SectionHeader";
import { ContactSection } from "@/components/home/ContactSection";
import { CaseCard } from "@/components/cases/CaseCard";
import { CaseFilters, type CaseFilterState } from "@/components/cases/CaseFilters";

const PATH = "/case-studies";
const CRUMBS: Crumb[] = [{ name: "Case studies", path: PATH }];

/** Cards rendered per page, and how many carry an eager photograph (the first row at 1024px and above). */
const PAGE_SIZE = 9;
const EAGER_CARDS = 3;
/** A ceiling so a hand-edited ?page= cannot ask for an unbounded document. */
const MAX_PAGES = 20;

const TITLE = "Case studies";
const DESCRIPTION = "Success stories from AdamasTech Consulting’s cloud, digital transformation and AI work.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  ...openGraphFor(TITLE, DESCRIPTION, PATH),
};

/** The filters are plain links, so the list is read from the query string on the server; no JavaScript is involved. */
export const instant = false;

/**
 * Case-studies listing. There is no Figma frame for it (INNER_PAGES.md section 2): it is built from the tokens on
 * the homepage case card and the Cloud Services pill patterns.
 *
 * Every case study is DRAFT until the client approves it, so the public build renders the empty state — the heading,
 * the explanation and a contact call to action — rather than an empty grid, and the "Case Studies" nav link stays.
 */
export default function CaseStudiesPage({ searchParams }: PageProps<"/case-studies">) {
  return <Listing searchParams={searchParams} />;
}

async function Listing({ searchParams }: { searchParams: PageProps<"/case-studies">["searchParams"] }) {
  const [listing, blocks, params] = await Promise.all([getCaseListing(), getBlocks(null), searchParams]);
  const header = blocks["caseStudies.overview"];

  const one = (v: string | string[] | undefined) => (Array.isArray(v) ? (v[0] ?? null) : (v ?? null));
  const active: CaseFilterState = {
    industry: one(params.industry),
    service: one(params.service),
    region: one(params.region),
  };
  const items = listing.items.filter(
    (c) =>
      (!active.industry || c.industry === active.industry) &&
      (!active.service || c.pillars.includes(active.service)) &&
      (!active.region || (c.regions as string[]).some((r) => r.toLowerCase() === active.region)),
  );

  // Only the first page is rendered server-side: the listing used to emit every card, and with a photograph each
  // that was an LCP of 4.6s. "Show more" raises the page, so page N serves N*PAGE_SIZE cards in one document and
  // the behaviour is identical without JavaScript (QA round 8).
  const page = Math.max(1, Math.min(MAX_PAGES, Number(one(params.page)) || 1));
  const shown = items.slice(0, PAGE_SIZE * page);
  const remaining = items.length - shown.length;
  const filterParams = Object.fromEntries(
    Object.entries({ industry: active.industry, service: active.service, region: active.region }).filter((e): e is [string, string] => !!e[1]),
  );

  return (
    <RevealScope>
      <JsonLd data={breadcrumbJsonLd(CRUMBS)} />
      <section className="bg-white pt-8 lg:pt-10" data-compare="case-listing">
        <div className="container-site">
          <Breadcrumb crumbs={CRUMBS} />
          <div className="mt-8 max-w-[820px]" data-reveal>
            {header?.eyebrow && <Eyebrow className="!text-[1.25rem] !tracking-normal">{plain(header.eyebrow)}</Eyebrow>}
            <h1 className="mt-3 font-heading text-[clamp(1.875rem,1.2rem+1.9vw,2.6875rem)] font-bold leading-[1.14] tracking-[-0.035em] text-navy-800">
              {plain(header?.heading) || "Case studies"}
            </h1>
            {header?.body && <p className="mt-4 font-body text-[1.125rem] leading-[1.6] text-grey-600">{plain(header.body)}</p>}
          </div>

          {listing.items.length > 0 && (
            <CaseFilters industries={listing.industries} services={listing.pillars} regions={listing.regions} active={active} count={items.length} total={listing.items.length} />
          )}

          {items.length > 0 ? (
            <>
              {/* The cards carry h3 titles; without a heading for the grid itself they would follow the page h1
                  and skip a level (axe heading-order). The label is for assistive technology only. */}
              <h2 className="sr-only">All case studies</h2>
              <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" role="list">
                {shown.map((c, i) => (
                  <li key={c.slug} data-reveal>
                    <CaseCard item={c} index={i} eager={i < EAGER_CARDS} />
                  </li>
                ))}
              </ul>
              {remaining > 0 && (
                <div className="mt-10 flex flex-col items-center gap-3" id="more">
                  {/* A link, not a button: "show more" has to work with JavaScript off, so it is a full navigation
                      that raises the page count and re-renders the list on the server. */}
                  <Link
                    href={`${PATH}?${new URLSearchParams({ ...filterParams, page: String(page + 1) }).toString()}#more`}
                    className="inline-flex min-h-[46px] items-center gap-3 rounded-pill bg-white px-7 font-heading text-[0.9375rem] font-bold text-navy-850 ring-1 ring-grey-150 hover:bg-grey-50"
                  >
                    Show more case studies
                    <Icon name="arrow" size={17} />
                  </Link>
                  <p className="font-body text-[0.875rem] text-grey-600" aria-live="polite">
                    Showing {shown.length} of {items.length}
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="mt-10 rounded-lg bg-tint-50 px-6 py-12 text-center lg:px-12 lg:py-16" data-reveal>
              <Heading2 className="!text-[1.5rem]">
                {listing.items.length === 0 ? "Our case studies are being prepared" : "No case studies match these filters"}
              </Heading2>
              <p className="mx-auto mt-3 max-w-[560px] font-body text-[1.0625rem] leading-[1.6] text-grey-600">
                {listing.items.length === 0
                  ? "We are finalising the write-ups of our cloud, SAP, digital transformation and AI engagements with the clients involved. Tell us what you are working on and we will share the work that is closest to it."
                  : "Try a different service, industry or region, or clear the filters to see everything."}
              </p>
              <div className="mt-7 flex flex-wrap justify-center gap-3">
                <Link href="/contact" className="inline-flex min-h-[46px] items-center gap-3 rounded-pill bg-blue-600 px-7 font-heading text-[0.9375rem] font-bold text-white hover:bg-blue-500">
                  Talk to an expert
                  <Icon name="arrow" size={17} />
                </Link>
                {listing.items.length > 0 && (
                  <Link href={PATH} className="inline-flex min-h-[46px] items-center gap-3 rounded-pill bg-white px-7 font-heading text-[0.9375rem] font-bold text-navy-850 ring-1 ring-grey-150 hover:bg-grey-50">
                    Clear filters
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
      {blocks["home.contact"] && <ContactSection block={blocks["home.contact"]} regionSlug={null} />}
    </RevealScope>
  );
}
