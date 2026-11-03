import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPillar, getPillars } from "@/lib/data/services";
import { glyphFor } from "@/lib/glyphs";
import { optionalCopy, plain } from "@/lib/placeholder";
import { PageHero } from "@/components/layout/PageHero";
import { LinkCard } from "@/components/cards/LinkCard";
import { CaseCard } from "@/components/cards/CaseCard";
import { Rail } from "@/components/ui/Rail";
import { Faq } from "@/components/ui/Faq";
import { ArrowLink, ButtonLink } from "@/components/ui/Button";
import { Eyebrow, SectionHeader } from "@/components/ui/SectionHeader";
import { RevealScope } from "@/components/motion/RevealScope";
import { InnerCta } from "@/components/sections/InnerCta";

export async function generateStaticParams() {
  const pillars = await getPillars();
  return pillars.map((p) => ({ pillar: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/services/[pillar]">): Promise<Metadata> {
  const { pillar } = await params;
  const p = await getPillar(pillar);
  if (!p) return {};
  return {
    title: p.seoTitle ?? p.name,
    description: p.seoDescription ?? (plain(p.summary) || undefined),
    alternates: { canonical: p.href },
    robots: p.noindex ? { index: false } : undefined,
  };
}

/**
 * Navigations into this page are allowed to block (instant = false) rather than streaming the body behind a
 * <Suspense> fallback. The page is linked from many cards, rails and menu items with default prefetching, so a
 * fallback would flash on every click; blocking waits for the prerendered payload and then shows the whole page.
 * It also keeps params read before streaming starts, so an unknown slug still gets a real 404 status, and the
 * prerendered HTML stays complete without JavaScript.
 */
export const instant = false;

export default function PillarPage({ params }: PageProps<"/services/[pillar]">) {
  return (
    <Pillar params={params} />
  );
}

async function Pillar({ params }: { params: PageProps<"/services/[pillar]">["params"] }) {
  const { pillar } = await params;
  const p = await getPillar(pillar);
  if (!p) notFound();
  const challenge = optionalCopy(p.challenge);
  const outcome = optionalCopy(p.outcomeLine);

  return (
    <RevealScope>
      <PageHero
        crumbs={[{ label: "Services", href: "/services" }, { label: p.name }]}
        eyebrow={p.tagline ?? "Services"}
        title={p.name}
        intro={p.summary}
        image={p.image}
        art={glyphFor(p.slug)}
        size="lg"
        actions={
          <>
            <ButtonLink href="/contact" arrow>
              Talk to an expert
            </ButtonLink>
            <ArrowLink href="#capabilities" tone="dark">
              See our capabilities
            </ArrowLink>
          </>
        }
      />

      {(challenge || outcome) && (
        <section aria-labelledby="challenge-h" className="section-y tone-white">
          <div className="container-site grid-12 gap-y-8">
            <div className="col-span-4 md:col-span-3" data-reveal>
              <Eyebrow>The challenge</Eyebrow>
            </div>
            <div className="col-span-4 md:col-span-9 lg:col-span-8">
              {outcome && (
                <h2 id="challenge-h" className="text-h2 text-navy-950" data-reveal>
                  {outcome.text}
                </h2>
              )}
              {challenge && (
                <p className="mt-6 max-w-[60ch] text-lead text-grey-700" data-reveal>
                  {challenge.text}
                </p>
              )}
            </div>
          </div>
        </section>
      )}

      <section id="capabilities" aria-labelledby="capabilities-h" className="section-y tone-mist scroll-mt-(--header-h)">
        <div className="container-site">
          <SectionHeader id="capabilities-h" eyebrow="What we do" heading={`${p.name} capabilities`} />
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 md:mt-16 lg:grid-cols-3 lg:gap-6">
            {p.services.map((s) => (
              <li key={s.slug} data-reveal>
                <LinkCard href={s.href} title={s.name} descriptor={s.descriptor} icon={glyphFor(s.slug)} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {p.caseStudies.length > 0 && (
        <Rail
          label="Related success stories"
          labelledBy="pillar-cases-h"
          className="tone-white"
          header={
            <div data-reveal>
              <Eyebrow>Success stories</Eyebrow>
              <h2 id="pillar-cases-h" className="mt-4 max-w-[22ch] text-h2 text-navy-950">
                Results from {p.name.toLowerCase()} work
              </h2>
            </div>
          }
          action={<ArrowLink href="/case-studies">View all case studies</ArrowLink>}
        >
          {p.caseStudies.map((c) => (
            <CaseCard key={c.slug} c={c} />
          ))}
        </Rail>
      )}

      {p.faqs.length > 0 && (
        <section aria-labelledby="faq-h" className="section-y tone-mist">
          <div className="container-site grid-12 gap-y-10">
            <div className="col-span-4 md:col-span-4">
              <SectionHeader id="faq-h" eyebrow="FAQs" heading="Common questions" className="!block" />
            </div>
            <div className="col-span-4 md:col-span-8">
              <Faq items={p.faqs} />
            </div>
          </div>
        </section>
      )}

      <InnerCta />
    </RevealScope>
  );
}
