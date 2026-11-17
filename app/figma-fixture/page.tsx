import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getHome } from "@/lib/data/home";
import { emptyBlock, getBlocks, getNavigation, getOffices, getRegions } from "@/lib/data/site";
import { FIXTURE_CLAIMS, FIXTURE_HERO, FIXTURE_HERO_CARDS, FIXTURE_SOCIAL, FIXTURE_STORIES, fixtureNav, fixturePillars, fixtureRegions } from "@/lib/fixtures/figma-home";
import { RevealScope } from "@/components/motion/RevealScope";
import { Header } from "@/components/nav/Header";
import { Hero } from "@/components/home/Hero";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { TopStories } from "@/components/home/TopStories";
import { Services } from "@/components/home/Services";
import { Outcomes } from "@/components/home/Outcomes";
import { Presence } from "@/components/home/Presence";
import { ContactSection } from "@/components/home/ContactSection";

export const metadata: Metadata = { title: "Figma fixture", robots: { index: false, follow: false } };

/**
 * Design-comparison fixture (brief section 11): the homepage sections that scored under 90% against the Figma render,
 * rendered with the same components but the designer's own placeholder copy and artwork (lib/fixtures/figma-home.ts),
 * so scripts/compare-figma.mts and scripts/measure-figma.mts see layout differences only. Served only when
 * FIGMA_FIXTURE=1 (never in the client preview or production); not in the sitemap; noindex.
 */
export default async function FigmaFixturePage() {
  if (process.env.FIGMA_FIXTURE !== "1") notFound();
  const [home, blocks, offices, regions, nav] = await Promise.all([getHome("IN"), getBlocks("IN"), getOffices(), getRegions(), getNavigation()]);
  if (!home) notFound();
  const b = (key: string) => blocks[key] ?? emptyBlock;

  return (
    <>
      <Header nav={fixtureNav(nav.header)} social={FIXTURE_SOCIAL} regions={fixtureRegions(regions)} region="in" fallbackRegion="in" />
      <main id="main">
        <RevealScope>
          <div lang="en-IN">
            <Hero block={FIXTURE_HERO} cards={[]} claims={FIXTURE_CLAIMS.filter((c) => c.placement === "hero-trust")} carousel={<HeroCarousel cards={FIXTURE_HERO_CARDS} claims={FIXTURE_CLAIMS.filter((c) => c.placement === "hero-trust")} />} />
            <TopStories block={FIXTURE_STORIES} />
            <Services block={b("home.whatWeDo")} pillars={fixturePillars(home.pillars)} />
            <Outcomes block={b("home.outcomes")} claims={FIXTURE_CLAIMS} />
            <Presence block={b("home.presence")} offices={offices} regions={regions} region="in" fallbackRegion="in" />
            <ContactSection block={b("home.contact")} regionSlug="in" />
          </div>
        </RevealScope>
      </main>
    </>
  );
}
