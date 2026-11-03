import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getHome } from "@/lib/data/home";
import { emptyBlock, getBlocks, getOffices, getRegions } from "@/lib/data/site";
import { REGION_SLUGS, isRegionSlug, slugToCode } from "@/lib/region";
import { HeroStories } from "@/components/sections/HeroStories";
import { PromoBanner } from "@/components/sections/PromoBanner";
import { TrustStrip } from "@/components/sections/TrustStrip";
import { PillarExplorer } from "@/components/sections/PillarExplorer";
import { IndustriesGrid } from "@/components/sections/IndustriesGrid";
import { WhyUs } from "@/components/sections/WhyUs";
import { EventFeature } from "@/components/sections/EventFeature";
import { GlobalPresence } from "@/components/sections/GlobalPresence";
import { CtaBand } from "@/components/sections/CtaBand";
import { Rail } from "@/components/ui/Rail";
import { ArrowLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/SectionHeader";
import { CaseCard } from "@/components/cards/CaseCard";
import { SolutionCard } from "@/components/cards/SolutionCard";
import { RevealScope } from "@/components/motion/RevealScope";

export function generateStaticParams() {
  return REGION_SLUGS.map((region) => ({ region }));
}

export async function generateMetadata({ params }: PageProps<"/[region]">): Promise<Metadata> {
  const { region } = await params;
  if (!isRegionSlug(region)) return {};
  const [home, regions] = await Promise.all([getHome(slugToCode[region]), getRegions()]);
  // hreflang on homepages only: every regional variant + x-default → "/".
  const languages: Record<string, string> = { "x-default": "/" };
  for (const r of regions) for (const tag of r.hreflang) languages[tag] = `/${r.slug}/`;
  return {
    title: { absolute: home?.seoTitle ?? "AdamasTech Consulting" },
    description: home?.seoDescription ?? undefined,
    alternates: { canonical: `/${region}/`, languages },
    openGraph: home?.ogImage ? { images: [{ url: home.ogImage.url }] } : undefined,
  };
}

/** Section header used above the rails (rails own their own container). */
function RailHeader({ eyebrow, heading, id, tone = "light" }: { eyebrow?: string | null; heading?: string | null; id: string; tone?: "light" | "dark" }) {
  return (
    <div data-reveal>
      {eyebrow && <Eyebrow tone={tone}>{eyebrow}</Eyebrow>}
      {heading && (
        <h2 id={id} className="mt-4 max-w-[22ch] text-h2 text-navy-950">
          {heading}
        </h2>
      )}
    </div>
  );
}

/**
 * Navigations into the homepages may block (instant = false), so `params` is read outside any <Suspense> boundary.
 * Tried and rejected (Nov 2026): reading params inside <Suspense> with a hero-shaped fallback. Even with fixed params
 * and cached data, the prerendered HTML then ships the fallback and puts the real homepage in a `<div hidden>`
 * segment that only JavaScript swaps in, so without JS the page is a skeleton and the forms are invisible.
 * Switching stays instant because the region switcher and logo use <Link prefetch={true}>: each homepage is fully
 * static, so the per-link prefetch is served from the static cache before the click.
 * Unknown single-segment paths get a real 404 from proxy.ts (`dynamicParams` is not available with cacheComponents,
 * and an unlisted param would otherwise be served the streamed fallback shell with a 200).
 */
export const instant = false;

export default function RegionHomePage({ params }: PageProps<"/[region]">) {
  return <RegionHome params={params} />;
}

async function RegionHome({ params }: { params: PageProps<"/[region]">["params"] }) {
  const { region } = await params;
  if (!isRegionSlug(region)) notFound();
  const code = slugToCode[region];

  const [home, blocks, offices, regions] = await Promise.all([getHome(code), getBlocks(code), getOffices(), getRegions()]);
  if (!home) notFound();

  const regionInfo = regions.find((r) => r.code === code) ?? null;
  const b = (key: string) => blocks[key] ?? emptyBlock;
  const certifications = home.logos.filter((l) => l.kind === "CERTIFICATION");

  // Section tones alternate white → mist → navy; two navy sections never touch (docs/design-notes.md §tones).
  // A FEATURED event (UK: House of Lords) moves up between the mist Solutions rail and the white Industries grid.
  const featuredEvent = home.eventProminence === "FEATURED";
  const event = <EventFeature block={b("home.events")} event={home.event} prominence={home.eventProminence} />;
  const solutionsBlock = b("home.solutions");
  const casesBlock = b("home.caseStudies");

  return (
    <RevealScope>
      <div lang={regionInfo?.locale}>
        <HeroStories slides={home.slides} announcements={home.announcements} />
        <PromoBanner promo={home.promoBanner} />
        {home.showTrustStrip && <TrustStrip block={b("home.trust")} logos={home.logos} stats={home.stats} />}
        <PillarExplorer block={b("home.whatWeDo")} pillars={home.pillars} />

        {home.serviceCards.length > 0 && (
          <section aria-label="Services" className="tone-white border-b border-grey-100 py-12 md:py-16">
            <ul className="container-site grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
              {home.serviceCards.map((c) => (
                <li key={c.title} className="border-t-2 border-navy-950 pt-5" data-reveal>
                  <p className="font-display text-h4 font-bold text-navy-950">{c.title}</p>
                  {c.body && <p className="mt-2 text-small text-grey-700">{c.body}</p>}
                  {c.href && (
                    <ArrowLink href={c.href} className="mt-3 text-[0.9375rem]">
                      Learn more<span className="sr-only"> about {c.title}</span>
                    </ArrowLink>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}

        {home.solutions.length > 0 && (
          <Rail
            pin
            label="Solutions"
            labelledBy="solutions-heading"
            className="tone-mist"
            header={<RailHeader id="solutions-heading" eyebrow={solutionsBlock.eyebrow} heading={solutionsBlock.heading ?? "Solutions"} />}
            action={<ArrowLink href={solutionsBlock.ctaHref ?? "/solutions"}>{solutionsBlock.ctaLabel ?? "All solutions"}</ArrowLink>}
          >
            {home.solutions.map((s, i) => (
              <SolutionCard key={s.slug} s={s} index={i} />
            ))}
          </Rail>
        )}

        {featuredEvent && event}

        <IndustriesGrid block={b("home.industries")} industries={home.industries} />

        {home.caseStudies.length > 0 && (
          <Rail
            pin
            label="Success stories"
            labelledBy="cases-heading"
            className="tone-mist"
            header={<RailHeader id="cases-heading" eyebrow={casesBlock.eyebrow} heading={casesBlock.heading ?? "Success stories"} />}
            action={<ArrowLink href={casesBlock.ctaHref ?? "/case-studies"}>{casesBlock.ctaLabel ?? "View all case studies"}</ArrowLink>}
          >
            {home.caseStudies.map((c) => (
              <CaseCard key={c.slug} c={c} />
            ))}
          </Rail>
        )}

        {home.showWhyUs && <WhyUs block={b("home.whyUs")} certifications={certifications} />}
        {!featuredEvent && event}
        <GlobalPresence block={b("home.presence")} offices={offices} featuredSlug={regionInfo?.featuredOfficeSlug ?? null} />
        <CtaBand block={b("home.cta")} region={regionInfo} />
      </div>
    </RevealScope>
  );
}
