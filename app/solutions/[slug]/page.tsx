import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getSolution, getSolutionParams } from "@/lib/data/solutions";
import { copy, isPlaceholder, optionalCopy, plain } from "@/lib/placeholder";
import { cx } from "@/lib/cx";
import { PageHero } from "@/components/layout/PageHero";
import { CaseCard } from "@/components/cards/CaseCard";
import { Img } from "@/components/media/Img";
import { CardArt } from "@/components/media/CardArt";
import { kindLabel, solutionGlyph, SolutionTile } from "@/components/solutions/SolutionTile";
import { ResultsStrip } from "@/components/case-studies/ResultsStrip";
import { Faq } from "@/components/ui/Faq";
import { Icon } from "@/components/ui/Icon";
import { PendingBlock } from "@/components/ui/PendingBlock";
import { ArrowLink, ButtonLink } from "@/components/ui/Button";
import { Eyebrow, SectionHeader } from "@/components/ui/SectionHeader";
import { RevealScope } from "@/components/motion/RevealScope";
import { InnerCta } from "@/components/sections/InnerCta";

export async function generateStaticParams() {
  return getSolutionParams();
}

export async function generateMetadata({ params }: PageProps<"/solutions/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const s = await getSolution(slug);
  if (!s) return {};
  const summary = optionalCopy(s.summary);
  return {
    title: s.seoTitle ?? (plain(s.name) || "Solution"),
    description: s.seoDescription ?? (summary && !summary.pending ? summary.text : undefined),
    alternates: { canonical: `/solutions/${slug}` },
    // Placeholder solutions (name still to come) stay out of search until they are written.
    robots: s.noindex || isPlaceholder(s.name) ? { index: false } : undefined,
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

export default function SolutionPage({ params }: PageProps<"/solutions/[slug]">) {
  return (
    <Solution params={params} />
  );
}

async function Solution({ params }: { params: PageProps<"/solutions/[slug]">["params"] }) {
  const { slug } = await params;
  const s = await getSolution(slug);
  if (!s) notFound();

  const name = copy(s.name);
  const tagline = optionalCopy(s.tagline);
  const summary = optionalCopy(s.summary);
  const body = optionalCopy(s.body);
  const glyph = solutionGlyph(s);
  const placeholder = name.pending;
  const intro = tagline ?? (summary && !summary.pending ? summary : null);
  // The hero carries the tagline; the overview carries the summary (never the same line twice).
  const statement = tagline && summary && !summary.pending ? summary : null;
  const showOverview = !!statement || !!body || placeholder || (!!tagline && !statement);

  const practice = s.caseStudies[0] ?? null;
  const practiceMetric = practice && !isPlaceholder(practice.headlineMetric) ? practice : null;
  const practiceResults =
    s.practiceResults.length > 0
      ? s.practiceResults
      : practiceMetric
        ? [{ value: practiceMetric.headlineMetric, label: practiceMetric.metricLabel ?? "" }]
        : [];
  const moreCases = s.caseStudies.slice(1);

  // Light sections alternate white / mist in render order; the navy band always sits between light ones.
  let n = 0;
  const tone = () => (n++ % 2 === 0 ? "tone-white" : "tone-mist");
  const tones = {
    overview: showOverview ? tone() : "",
    modules: s.modules.length > 0 ? tone() : "",
    features: s.features.length > 0 || placeholder ? tone() : "",
    integrations: s.integrations.length > 0 ? tone() : "",
    screens: s.screenshots.length > 0 ? tone() : "",
    faqs: s.faqs.length > 0 ? tone() : "",
    more: s.more.length > 0 ? tone() : "",
  };

  return (
    <RevealScope>
      <PageHero
        crumbs={[{ label: "Solutions", href: "/solutions" }, { label: s.name }]}
        eyebrow={kindLabel[s.kind]}
        title={s.name}
        intro={intro?.text ?? null}
        art={glyph}
        artVariant={s.kind === "PRODUCT" ? 1 : 0}
        size="lg"
        actions={
          <>
            {s.externalUrl ? (
              <ButtonLink href={s.externalUrl} external arrow>
                Visit {name.text}
              </ButtonLink>
            ) : (
              <ButtonLink href="/contact" arrow>
                Talk to an expert
              </ButtonLink>
            )}
            {s.externalUrl ? (
              <ArrowLink href="/contact" tone="dark">
                Talk to an expert
              </ArrowLink>
            ) : practice ? (
              <ArrowLink href="#in-practice" tone="dark">
                See it in practice
              </ArrowLink>
            ) : null}
          </>
        }
        aside={
          s.image ? (
            <div className="relative mx-auto aspect-[4/3] w-full overflow-hidden rounded-card ring-1 ring-white/15 sm:aspect-[16/10] lg:aspect-[4/5] lg:max-w-[24rem]">
              <Img media={s.image} sizes="(min-width: 1024px) 384px, 100vw" priority className="object-[50%_28%]" />
              <span aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-navy-950/50 via-transparent to-transparent" />
            </div>
          ) : s.modules.length > 0 ? (
            <nav aria-label={`${name.text} modules`} className="rounded-card bg-white/5 p-6 ring-1 ring-white/15 backdrop-blur-sm">
              <p className="eyebrow text-sky-300">Modules</p>
              <ul className="mt-4 divide-y divide-white/10">
                {s.modules.map((m) => (
                  <li key={m.slug}>
                    <a
                      href={m.href}
                      target={m.external ? "_blank" : undefined}
                      rel={m.external ? "noopener" : undefined}
                      className="group flex items-center justify-between gap-4 py-3 font-semibold transition-colors duration-(--duration-base) hover:text-sky-300"
                    >
                      {copy(m.name).text}
                      <Icon
                        name={m.external ? "arrowUpRight" : "arrowRight"}
                        size={18}
                        className="transition-transform duration-(--duration-base) group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      />
                      {m.external && <span className="sr-only"> (opens in a new tab)</span>}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ) : undefined
        }
      />

      {/* Overview: the summary as a statement, with the challenge it answers alongside */}
      {showOverview && (
        <section aria-labelledby="overview-h" className={cx("section-y", tones.overview)}>
          <div className="container-site grid-12 gap-y-10">
            <div className={cx("col-span-4 md:col-span-8", body || placeholder ? "lg:col-span-6" : "lg:col-span-9")} data-reveal>
              <Eyebrow>Overview</Eyebrow>
              <h2 id="overview-h" className="sr-only">
                Overview
              </h2>
              {statement ? (
                <p className="mt-6 font-display text-h3 font-semibold text-navy-950">{statement.text}</p>
              ) : (
                <PendingBlock label="Overview to be confirmed" lines={4} className="mt-6" />
              )}
            </div>
            {(body || placeholder) && (
              <div className="col-span-4 md:col-span-8 lg:col-span-5 lg:col-start-8" data-reveal>
                <Eyebrow>The challenge</Eyebrow>
                {body ? <p className="mt-6 text-lead text-grey-700">{body.text}</p> : <PendingBlock label="Challenge to be confirmed" lines={3} className="mt-6" />}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Product suites: one card per module, each linking out to the product site */}
      {s.modules.length > 0 && (
        <section aria-labelledby="modules-h" className={cx("section-y", tones.modules)}>
          <div className="container-site">
            <SectionHeader id="modules-h" eyebrow="The suite" heading={`Inside ${name.text}`} />
            <ul className="mt-12 grid gap-4 md:mt-16 md:grid-cols-3 lg:gap-6">
              {s.modules.map((m, i) => {
                const mLine = optionalCopy(m.tagline);
                const mSummary = optionalCopy(m.summary);
                return (
                  <li key={m.slug} data-reveal>
                    <article className="card-lift group relative flex h-full flex-col overflow-hidden rounded-card border border-grey-200 bg-white hover:border-brand-200">
                      <div className="card-media relative aspect-[4/3] overflow-hidden bg-navy-900">
                        {m.image ? <Img media={m.image} sizes="(min-width: 768px) 400px, 100vw" className="object-[50%_25%]" /> : <CardArt icon={glyph} variant={i} />}
                      </div>
                      <div className="flex flex-1 flex-col p-6 md:p-7">
                        <h3 className="text-h3 text-navy-950">
                          <a href={m.href} target={m.external ? "_blank" : undefined} rel={m.external ? "noopener" : undefined} className="after:absolute after:inset-0 after:content-['']">
                            {copy(m.name).text}
                            {m.external && <span className="sr-only"> (opens in a new tab)</span>}
                          </a>
                        </h3>
                        {mLine && <p className="mt-3 font-semibold text-navy-950">{mLine.text}</p>}
                        {mSummary && !mSummary.pending && <p className="mt-3 text-small text-grey-700">{mSummary.text}</p>}
                        <span className="mt-auto inline-flex items-center gap-2 pt-6 text-[0.9375rem] font-semibold text-brand-600">
                          {m.external ? "Visit site" : "Explore"}
                          <Icon name={m.external ? "arrowUpRight" : "arrowRight"} size={18} className="transition-transform duration-(--duration-base) group-hover:translate-x-1" />
                        </span>
                      </div>
                    </article>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      )}

      {/* Capabilities: a set, not a sequence, so no numbers */}
      {tones.features && (
        <section aria-labelledby="features-h" className={cx("section-y", tones.features)}>
          <div className="container-site">
            <SectionHeader id="features-h" eyebrow="Capabilities" heading={placeholder ? "Key capabilities" : `What ${name.text} delivers`} className="[&_h2]:max-w-[22ch]" />
            {s.features.length > 0 ? (
              <ul className={cx("mt-12 grid gap-4 sm:grid-cols-2 md:mt-16 lg:gap-6", s.features.length === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3")}>
                {s.features.map((f) => (
                  <li key={f.title} className="flex flex-col rounded-card border border-grey-200 bg-white p-6 md:p-7" data-reveal>
                    <span className="inline-flex size-12 items-center justify-center rounded-full bg-brand-50 text-brand-600 ring-1 ring-brand-100">
                      <Icon name={glyph} size={22} strokeWidth={1.6} />
                    </span>
                    <h3 className="mt-6 text-h4 text-navy-950">{f.title}</h3>
                    {f.body && <p className="mt-3 text-small text-grey-700">{f.body}</p>}
                  </li>
                ))}
              </ul>
            ) : (
              <ul className="mt-12 grid gap-4 sm:grid-cols-2 md:mt-16 lg:grid-cols-3 lg:gap-6">
                {[0, 1, 2].map((i) => (
                  <li key={i} data-reveal>
                    <PendingBlock label="Capability to be confirmed" lines={3} className="h-full !bg-white" />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      )}

      {s.integrations.length > 0 && (
        <section aria-labelledby="int-h" className={cx("border-y border-grey-100 py-14 md:py-20", tones.integrations)}>
          <div className="container-site grid-12 items-center gap-y-6">
            <div className="col-span-4 md:col-span-4" data-reveal>
              <Eyebrow>Integrations</Eyebrow>
              <h2 id="int-h" className="mt-3 text-h3 text-navy-950">
                Platforms it works with
              </h2>
            </div>
            <ul className="col-span-4 flex flex-wrap gap-2.5 md:col-span-8" data-reveal>
              {s.integrations.map((t) => (
                <li key={t} className="rounded-full border border-grey-200 bg-white px-4 py-2 text-small font-semibold text-navy-950">
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {s.screenshots.length > 0 && (
        <section aria-labelledby="screens-h" className={cx("section-y", tones.screens)}>
          <div className="container-site">
            <SectionHeader id="screens-h" eyebrow="Product tour" heading={`${name.text} in use`} />
            <ul className="mt-12 grid gap-4 md:mt-16 md:grid-cols-2 lg:gap-6">
              {s.screenshots.map((x, i) => (
                <li key={i} className={cx(i === 0 && s.screenshots.length % 2 === 1 && "md:col-span-2")} data-reveal>
                  <figure>
                    <div className="card-media relative aspect-[16/10] overflow-hidden rounded-card border border-grey-200 bg-grey-50">
                      <Img media={x.image} sizes="(min-width: 768px) 50vw, 100vw" />
                    </div>
                    {x.caption && <figcaption className="mt-3 text-small text-grey-600">{x.caption}</figcaption>}
                  </figure>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* In practice: the lead case study and its results, on the page's one navy band */}
      {practice && (
        <section id="in-practice" aria-labelledby="practice-h" className="section-y scroll-mt-(--header-h) bg-navy-950 text-white" data-morph>
          <div className="container-site">
            <SectionHeader
              id="practice-h"
              tone="dark"
              eyebrow="In practice"
              heading={`${name.text} at work`}
              action={
                <ArrowLink href="/case-studies" tone="dark">
                  View all case studies
                </ArrowLink>
              }
            />
            <div className="grid-12 mt-12 items-center gap-y-10 md:mt-16">
              <Link
                href={`/case-studies/${practice.slug}`}
                aria-hidden="true"
                tabIndex={-1}
                className="card-lift card-media relative col-span-4 block aspect-[16/10] overflow-hidden rounded-card bg-navy-900 md:col-span-8 lg:col-span-6"
                data-reveal
              >
                <Img media={practice.image} sizes="(min-width: 1024px) 620px, 100vw" />
                <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-navy-950">{practice.label}</span>
              </Link>
              <div className="col-span-4 md:col-span-8 lg:col-span-5 lg:col-start-8" data-reveal>
                <p className="eyebrow text-sky-300">Case study</p>
                <h3 className="mt-4 text-h3 text-white">{copy(practice.title).text}</h3>
                {practice.clientDescriptor && <p className="mt-3 text-on-navy-muted">{practice.clientDescriptor}</p>}
                <ArrowLink href={`/case-studies/${practice.slug}`} tone="dark" className="mt-7">
                  Read the case study
                </ArrowLink>
              </div>
            </div>
            {practiceResults.length > 0 && <ResultsStrip results={practiceResults} className="mt-14 md:mt-20" />}
            {moreCases.length > 0 && (
              <ul className="mt-14 grid gap-4 sm:grid-cols-2 md:mt-20 lg:grid-cols-3 lg:gap-6">
                {moreCases.map((c) => (
                  <li key={c.slug} data-reveal>
                    <CaseCard c={c} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      )}

      {s.faqs.length > 0 && (
        <section aria-labelledby="faq-h" className={cx("section-y", tones.faqs)}>
          <div className="container-site grid-12 gap-y-10">
            <div className="col-span-4 md:col-span-4">
              <Eyebrow>FAQs</Eyebrow>
              <h2 id="faq-h" className="mt-4 text-h2 text-navy-950">
                Common questions
              </h2>
            </div>
            <div className="col-span-4 md:col-span-8">
              <Faq items={s.faqs} />
            </div>
          </div>
        </section>
      )}

      {s.more.length > 0 && (
        <section aria-labelledby="more-h" className={cx("section-y", tones.more)}>
          <div className="container-site">
            <SectionHeader id="more-h" eyebrow="Solutions" heading="Explore more solutions" action={<ArrowLink href="/solutions">All solutions</ArrowLink>} />
            <ul className="mt-12 grid gap-4 sm:grid-cols-2 md:mt-16 lg:grid-cols-3 lg:gap-6">
              {s.more.slice(0, 3).map((x, i) => (
                <li key={x.slug} data-reveal>
                  <SolutionTile s={x} index={i + 1} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <InnerCta />
    </RevealScope>
  );
}
