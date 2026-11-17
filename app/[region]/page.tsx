import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getHome } from "@/lib/data/home";
import { emptyBlock, getBlocks, getOffices, getRegions } from "@/lib/data/site";
import { REGION_SLUGS, isRegionSlug, slugToCode } from "@/lib/region";
import { openGraphFor, siteUrl } from "@/lib/seo";
import { RevealScope } from "@/components/motion/RevealScope";
import { Hero } from "@/components/home/Hero";
import { TopStories } from "@/components/home/TopStories";
import { Partners } from "@/components/home/Partners";
import { About } from "@/components/home/About";
import { Services } from "@/components/home/Services";
import { Solutions } from "@/components/home/Solutions";
import { Outcomes } from "@/components/home/Outcomes";
import { Industries } from "@/components/home/Industries";
import { Difference } from "@/components/home/Difference";
import { Events } from "@/components/home/Events";
import { Perspectives } from "@/components/home/Perspectives";
import { TechExcellence } from "@/components/home/TechExcellence";
import { Presence } from "@/components/home/Presence";
import { ContactSection } from "@/components/home/ContactSection";

export function generateStaticParams() {
  return REGION_SLUGS.map((region) => ({ region }));
}

export async function generateMetadata({ params }: PageProps<"/[region]">): Promise<Metadata> {
  const { region } = await params;
  if (!isRegionSlug(region)) return {};
  const [home, regions] = await Promise.all([getHome(slugToCode[region]), getRegions()]);
  // hreflang on homepages only: every regional variant; x-default → "/" is rendered by the page itself (the metadata
  // resolver drops the trailing slash of the root URL, which the sitemap keeps; QA BUG-033).
  const languages: Record<string, string> = {};
  for (const r of regions) for (const tag of r.hreflang) languages[tag] = `/${r.slug}/`;
  const title = home?.seoTitle ?? "AdamasTech Consulting";
  return {
    title: { absolute: title },
    description: home?.seoDescription ?? undefined,
    alternates: { canonical: `/${region}/`, languages },
    ...openGraphFor(title, home?.seoDescription ?? undefined, `/${region}/`, home?.ogImage?.url),
  };
}

/**
 * Navigations into the homepages may block (instant = false), so `params` is read outside any <Suspense> boundary.
 * Reading params inside <Suspense> shipped a fallback shell that only JavaScript could swap for the real page, so
 * without JS the homepage was a skeleton (found Nov 2026). Unknown single-segment paths get a real 404 from proxy.ts.
 */
export const instant = false;

export default function RegionHomePage({ params }: PageProps<"/[region]">) {
  return <RegionHome params={params} />;
}

/**
 * One layout serves /in/, /uk/ and /gcc/. Sections follow the approved Figma order; every piece of copy,
 * image, card and office comes from the database for the region (ContentBlock region rows override the global ones).
 */
async function RegionHome({ params }: { params: PageProps<"/[region]">["params"] }) {
  const { region } = await params;
  if (!isRegionSlug(region)) notFound();
  const code = slugToCode[region];

  const [home, blocks, offices, regions] = await Promise.all([getHome(code), getBlocks(code), getOffices(), getRegions()]);
  if (!home) notFound();

  const regionInfo = regions.find((r) => r.code === code) ?? null;
  const b = (key: string) => blocks[key] ?? emptyBlock;

  return (
    <RevealScope>
      {/* React hoists the link into <head>; the metadata API would strip the trailing slash from the root URL (BUG-033). */}
      <link rel="alternate" hrefLang="x-default" href={`${siteUrl}/`} />
      <div lang={regionInfo?.locale}>
        <Hero block={b("home.hero")} cards={home.slides} claims={home.claims} />
        <TopStories block={b("home.topStories")} />
        {home.showTrustStrip && <Partners block={b("home.trust")} logos={home.logos} />}
        <About block={b("home.about")} />
        <Services block={b("home.whatWeDo")} pillars={home.pillars} />
        <Solutions block={b("home.solutions")} solutions={home.solutions} />
        <Outcomes block={b("home.outcomes")} claims={home.claims} />
        <Industries block={b("home.industries")} industries={home.industries} />
        <Difference block={b("home.difference")} />
        {home.eventProminence !== "HIDDEN" && <Events block={b("home.events")} event={home.event} />}
        <Perspectives block={b("home.perspectives")} />
        {home.showWhyUs && <TechExcellence block={b("home.whyUs")} logos={home.logos} />}
        <Presence block={b("home.presence")} offices={offices} regions={regions} region={region} fallbackRegion={region} />
        <ContactSection block={b("home.contact")} regionSlug={region} />
      </div>
    </RevealScope>
  );
}
