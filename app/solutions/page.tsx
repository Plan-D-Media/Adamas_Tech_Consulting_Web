import type { Metadata } from "next";
import { getSolutions } from "@/lib/data/solutions";
import { emptyBlock, getBlocks } from "@/lib/data/site";
import type { CaseCardData } from "@/lib/data/home";
import { PageHero } from "@/components/layout/PageHero";
import { CaseCard } from "@/components/cards/CaseCard";
import { ArivooFeature } from "@/components/solutions/ArivooFeature";
import { SolutionTile } from "@/components/solutions/SolutionTile";
import { Rail } from "@/components/ui/Rail";
import { ArrowLink, ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Eyebrow, SectionHeader } from "@/components/ui/SectionHeader";
import { RevealScope } from "@/components/motion/RevealScope";
import { InnerCta } from "@/components/sections/InnerCta";

export const metadata: Metadata = {
  title: "Solutions",
  description: "Products and AI solutions from AdamasTech Consulting.",
  alternates: { canonical: "/solutions" },
};

/** Solutions overview: products (a featured suite, then the rest), AI solutions, then the case studies behind them. */
export default async function SolutionsPage() {
  const [solutions, blocks] = await Promise.all([getSolutions(), getBlocks(null)]);
  const intro = blocks["home.solutions"] ?? emptyBlock;

  const products = solutions.filter((s) => s.kind === "PRODUCT");
  const suites = products.filter((s) => s.modules.length > 0);
  const otherProducts = products.filter((s) => s.modules.length === 0);
  const ai = solutions.filter((s) => s.kind === "AI_SOLUTION");

  const seen = new Set<string>();
  const cases: CaseCardData[] = [];
  for (const s of solutions) for (const c of s.cases) if (!seen.has(c.slug) && seen.add(c.slug)) cases.push(c);

  const groups = [
    { id: "products", label: "Products", count: products.length },
    { id: "ai-solutions", label: "AI solutions", count: ai.length },
  ].filter((g) => g.count > 0);

  return (
    <RevealScope>
      <PageHero
        crumbs={[{ label: "Solutions" }]}
        eyebrow={intro.eyebrow ?? "Solutions"}
        title={intro.heading ?? "Solutions"}
        intro={intro.body}
        art="spark"
        artVariant={2}
        size="lg"
        actions={
          <ButtonLink href="/contact" arrow>
            Talk to an expert
          </ButtonLink>
        }
        aside={
          <nav aria-label="Solution groups" className="rounded-card bg-white/5 p-6 ring-1 ring-white/15 backdrop-blur-sm">
            <p className="eyebrow text-sky-300">Jump to</p>
            <ul className="mt-4 divide-y divide-white/10">
              {groups.map((g) => (
                <li key={g.id}>
                  <a href={`#${g.id}`} className="group flex items-center justify-between gap-4 py-3 font-semibold transition-colors duration-(--duration-base) hover:text-sky-300">
                    <span>
                      {g.label}
                      <span className="ml-2 font-display text-sm tabular-nums text-on-navy-muted">{String(g.count).padStart(2, "0")}</span>
                    </span>
                    <Icon name="arrowRight" size={18} className="rotate-90 transition-transform duration-(--duration-base) group-hover:translate-y-0.5" />
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        }
      />

      {products.length > 0 && (
        <section id="products" aria-labelledby="products-h" className="section-y tone-white scroll-mt-(--header-h)">
          <div className="container-site">
            <SectionHeader id="products-h" eyebrow="Products" heading="Our products" />
            <div className="mt-12 grid gap-16 md:mt-16 md:gap-20">
              {suites.map((s) => (
                <ArivooFeature key={s.slug} s={s} />
              ))}
              {otherProducts.length > 0 && (
                <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
                  {otherProducts.map((s, i) => (
                    <li key={s.slug} data-reveal>
                      <SolutionTile s={s} index={i} />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </section>
      )}

      {ai.length > 0 && (
        <section id="ai-solutions" aria-labelledby="ai-h" className="section-y tone-mist scroll-mt-(--header-h)">
          <div className="container-site">
            <SectionHeader id="ai-h" eyebrow="Artificial intelligence" heading="AI solutions" />
            <ul className="mt-12 grid gap-4 sm:grid-cols-2 md:mt-16 lg:grid-cols-3 lg:gap-6">
              {ai.map((s, i) => (
                <li key={s.slug} data-reveal>
                  <SolutionTile s={s} index={i} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {cases.length > 0 && (
        <Rail
          label="Solutions in practice"
          labelledBy="sol-cases-h"
          className="tone-white"
          header={
            <div data-reveal>
              <Eyebrow>Success stories</Eyebrow>
              <h2 id="sol-cases-h" className="mt-4 max-w-[22ch] text-h2 text-navy-950">
                Our solutions in practice
              </h2>
            </div>
          }
          action={<ArrowLink href="/case-studies">View all case studies</ArrowLink>}
        >
          {cases.map((c) => (
            <CaseCard key={c.slug} c={c} />
          ))}
        </Rail>
      )}

      <InnerCta />
    </RevealScope>
  );
}
