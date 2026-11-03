import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCaseStudy, getCaseStudyParams } from "@/lib/data/caseStudies";
import { copy, isPlaceholder, optionalCopy, plain } from "@/lib/placeholder";
import { cx } from "@/lib/cx";
import { PageHero } from "@/components/layout/PageHero";
import { CaseCard } from "@/components/cards/CaseCard";
import { ResultsStrip } from "@/components/case-studies/ResultsStrip";
import { Rail } from "@/components/ui/Rail";
import { Prose } from "@/components/ui/Prose";
import { PendingBlock } from "@/components/ui/PendingBlock";
import { Icon } from "@/components/ui/Icon";
import { ArrowLink, ButtonLink } from "@/components/ui/Button";
import { Eyebrow, SectionHeader, TbcTag } from "@/components/ui/SectionHeader";
import { MetricCount } from "@/components/motion/MetricCount";
import { RevealScope } from "@/components/motion/RevealScope";
import { InnerCta } from "@/components/sections/InnerCta";

/** Region names as shown in the UI (the Gulf region is always "GCC"). */
const REGION_LABEL = { IN: "India", UK: "United Kingdom", AE: "GCC" } as const;

export async function generateStaticParams() {
  return getCaseStudyParams();
}

export async function generateMetadata({ params }: PageProps<"/case-studies/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const c = await getCaseStudy(slug);
  if (!c) return {};
  const summary = optionalCopy(c.summary);
  return {
    title: c.seoTitle ?? plain(c.title),
    description: c.seoDescription ?? (summary && !summary.pending ? summary.text : undefined),
    alternates: { canonical: `/case-studies/${slug}` },
    robots: c.noindex ? { index: false } : undefined,
    openGraph: c.image ? { images: [{ url: c.image.url }] } : undefined,
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

export default function CaseStudyPage({ params }: PageProps<"/case-studies/[slug]">) {
  return (
    <CaseStudy params={params} />
  );
}

async function CaseStudy({ params }: { params: PageProps<"/case-studies/[slug]">["params"] }) {
  const { slug } = await params;
  const c = await getCaseStudy(slug);
  if (!c) notFound();

  const title = copy(c.title);
  const summary = optionalCopy(c.summary);
  const metric = c.headlineMetric && !isPlaceholder(c.headlineMetric) ? c.headlineMetric : null;
  const metricLabel = metric ? optionalCopy(c.metricLabel) : null;
  const challenge = optionalCopy(c.challenge);
  const overviewPending = !c.overview || copy(c.overview).pending;
  const quote = optionalCopy(c.quote);
  // Two shapes in the data: titled capabilities ({ title, body }) and one-sentence points (title only).
  const points = c.solution.length > 0 && c.solution.every((s) => !s.body);

  // Light sections alternate white / mist in render order; the results band is the page's one navy section.
  let n = 0;
  const tone = () => (n++ % 2 === 0 ? "tone-white" : "tone-mist");
  const tones = {
    overview: tone(),
    challenge: challenge ? tone() : "",
    solution: c.solution.length > 0 ? tone() : "",
  };
  n = 0; // restart after the navy band
  const after = {
    quote: quote ? tone() : "",
    tech: c.technologies.length > 0 ? tone() : "",
    related: c.related.length > 0 ? tone() : "",
  };

  const glance: { label: string; content: React.ReactNode }[] = [];
  if (c.clientDescriptor) glance.push({ label: "Client", content: c.clientDescriptor });
  if (c.industry) glance.push({ label: "Industry", content: c.industry.label });
  if (c.regions.length) glance.push({ label: c.regions.length > 1 ? "Regions" : "Region", content: c.regions.map((r) => REGION_LABEL[r]).join(", ") });
  if (c.services.length || c.pillars.length) {
    const links = c.services.length ? c.services : c.pillars;
    glance.push({
      label: "Services",
      content: (
        <ul className="grid gap-1.5">
          {links.map((s) => (
            <li key={s.href}>
              <Link href={s.href} className="group/g inline-flex items-center gap-1.5 font-semibold text-white hover:text-sky-300">
                <span className="link-underline">{copy(s.name).text}</span>
                <Icon name="arrowRight" size={14} className="transition-transform duration-(--duration-base) group-hover/g:translate-x-0.5" />
              </Link>
            </li>
          ))}
        </ul>
      ),
    });
  }
  if (c.solutions.length) {
    glance.push({
      label: c.solutions.length > 1 ? "Solutions" : "Solution",
      content: (
        <ul className="grid gap-1.5">
          {c.solutions.map((s) => (
            <li key={s.href}>
              <a
                href={s.href}
                target={s.external ? "_blank" : undefined}
                rel={s.external ? "noopener" : undefined}
                className="group/g inline-flex items-center gap-1.5 font-semibold text-white hover:text-sky-300"
              >
                <span className="link-underline">{copy(s.name).text}</span>
                <Icon name={s.external ? "arrowUpRight" : "arrowRight"} size={14} className="transition-transform duration-(--duration-base) group-hover/g:translate-x-0.5" />
                {s.external && <span className="sr-only"> (opens in a new tab)</span>}
              </a>
            </li>
          ))}
        </ul>
      ),
    });
  }

  return (
    <RevealScope>
      <PageHero
        crumbs={[{ label: "Case studies", href: "/case-studies" }, { label: c.title }]}
        eyebrow={c.label}
        title={c.title}
        intro={summary && !summary.pending ? summary.text : null}
        image={c.image}
        art="chart"
        size={title.text.length > 58 ? "sm" : "md"}
        actions={
          <>
            <ButtonLink href="/contact" arrow>
              Talk to an expert
            </ButtonLink>
            <ArrowLink href="#results" tone="dark">
              See the results
            </ArrowLink>
          </>
        }
        aside={
          <div className="rounded-card bg-navy-950/60 p-6 ring-1 ring-white/15 backdrop-blur-md md:p-7" data-spotlight>
            <p className="eyebrow text-sky-300">Headline result</p>
            {metric ? (
              <>
                <MetricCount value={metric} className="mt-4 block font-display-wide text-metric font-bold tabular-nums text-white" />
                {metricLabel && !metricLabel.pending && <p className="mt-3 text-lead font-semibold first-letter:uppercase">{metricLabel.text}</p>}
              </>
            ) : (
              <TbcTag tone="dark" className="mt-4">
                Result to be confirmed
              </TbcTag>
            )}
            {c.clientDescriptor && (
              <div className="mt-6 border-t border-white/15 pt-5">
                <p className="eyebrow text-on-navy-muted">Client</p>
                <p className="mt-2 text-small text-on-navy-muted">{c.clientDescriptor}</p>
              </div>
            )}
          </div>
        }
      />

      {/* Overview, with the facts of the engagement alongside */}
      <section aria-labelledby="overview-h" className={cx("section-y", tones.overview)}>
        <div className="container-site grid-12 gap-y-10">
          <div className="col-span-4 md:col-span-8 lg:col-span-7" data-reveal>
            <Eyebrow>Overview</Eyebrow>
            <h2 id="overview-h" className="sr-only">
              Overview
            </h2>
            {overviewPending ? <PendingBlock label="Overview to be confirmed" lines={4} className="mt-6" /> : <Prose text={c.overview} className="mt-6 text-lead [&>p:first-child]:font-semibold [&>p:first-child]:text-navy-950" />}
          </div>
          {glance.length > 0 && (
            <aside aria-label="At a glance" className="col-span-4 md:col-span-8 lg:col-span-4 lg:col-start-9" data-reveal>
              <div className="rounded-card bg-navy-950 p-7 text-white lg:sticky lg:top-[calc(var(--header-h)+2rem)]" data-spotlight>
                <p className="eyebrow text-sky-300">At a glance</p>
                <dl className="mt-5 divide-y divide-white/10">
                  {glance.map((g) => (
                    <div key={g.label} className="grid gap-1.5 py-4 first:pt-0 last:pb-0">
                      <dt className="text-xs font-bold uppercase tracking-wider text-on-navy-muted">{g.label}</dt>
                      <dd className="text-[0.9375rem] text-white">{g.content}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </aside>
          )}
        </div>
      </section>

      {challenge && (
        <section aria-labelledby="challenge-h" className={cx("section-y", tones.challenge)}>
          <div className="container-site grid-12 gap-y-8">
            <div className="col-span-4 md:col-span-4" data-reveal>
              <Eyebrow>The challenge</Eyebrow>
              <h2 id="challenge-h" className="mt-4 max-w-[14ch] text-h2 text-navy-950">
                What stood in the way
              </h2>
            </div>
            <div className="col-span-4 md:col-span-8 lg:col-span-7 lg:col-start-6" data-reveal>
              <Prose text={c.challenge} className="text-lead" />
            </div>
          </div>
        </section>
      )}

      {c.solution.length > 0 && (
        <section aria-labelledby="solution-h" className={cx("section-y", tones.solution)}>
          <div className="container-site">
            <SectionHeader id="solution-h" eyebrow="The solution" heading={c.solutionIsSequence ? "How it was delivered" : "What we delivered"} />
            {c.solutionIsSequence ? (
              /* A real sequence, so the steps are numbered. */
              <ol className="mt-12 grid gap-x-8 gap-y-10 md:mt-16 md:grid-cols-2 lg:grid-cols-3">
                {c.solution.map((s, i) => (
                  <li key={s.title} className="border-t-2 border-brand-600 pt-6" data-reveal>
                    <p className="font-display text-sm font-bold tabular-nums text-brand-600">{String(i + 1).padStart(2, "0")}</p>
                    <h3 className="mt-4 text-h4 text-navy-950">{s.title}</h3>
                    {s.body && <p className="mt-3 text-grey-700">{s.body}</p>}
                  </li>
                ))}
              </ol>
            ) : points ? (
              <ul className="mt-12 grid gap-4 md:mt-16 md:grid-cols-2 lg:gap-6">
                {c.solution.map((s) => (
                  <li key={s.title} className="flex gap-4 rounded-card border border-grey-200 bg-white p-6 md:p-7" data-reveal>
                    <span className="mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                      <Icon name="check" size={18} />
                    </span>
                    <p className="text-navy-950 [font-size:var(--text-lead)] leading-snug">{s.title}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <ul className={cx("mt-12 grid gap-4 sm:grid-cols-2 md:mt-16 lg:gap-6", c.solution.length % 3 === 0 && "lg:grid-cols-3", c.solution.length === 4 && "lg:grid-cols-4")}>
                {c.solution.map((s) => (
                  <li key={s.title} className="flex flex-col rounded-card border border-grey-200 bg-white p-6 md:p-7" data-reveal>
                    <span className="inline-flex size-11 items-center justify-center rounded-full bg-brand-50 text-brand-600 ring-1 ring-brand-100">
                      <Icon name="check" size={20} />
                    </span>
                    <h3 className="mt-6 text-h4 text-navy-950">{s.title}</h3>
                    {s.body && <p className="mt-3 text-small text-grey-700">{s.body}</p>}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      )}

      {/* Results: the measured outcomes, counted up, on the page's one navy band */}
      <section id="results" aria-labelledby="results-h" className="section-y scroll-mt-(--header-h) bg-navy-950 text-white" data-morph>
        <div className="container-site">
          <SectionHeader id="results-h" tone="dark" eyebrow="Results" heading="The measurable impact" />
          {c.results.length > 0 ? (
            <ResultsStrip results={c.results} className="mt-12 md:mt-16" />
          ) : (
            <PendingBlock tone="dark" label="Results to be confirmed" lines={3} className="mt-12 max-w-2xl md:mt-16" />
          )}
        </div>
      </section>

      {quote && (
        <section aria-label="Client testimonial" className={cx("section-y", after.quote)}>
          <figure className="container-site grid-12" data-reveal>
            <Icon name="spark" size={36} strokeWidth={1.4} className="col-span-4 text-brand-600 md:col-span-1" />
            <div className="col-span-4 mt-6 md:col-span-10 md:mt-0 lg:col-span-9">
              <blockquote className="font-display text-h3 font-semibold text-navy-950">{quote.text}</blockquote>
              {c.quoteBy && <figcaption className="mt-6 font-semibold text-grey-700">{c.quoteBy}</figcaption>}
            </div>
          </figure>
        </section>
      )}

      {c.technologies.length > 0 && (
        <section aria-labelledby="tech-h" className={cx("border-b border-grey-100 py-14 md:py-20", after.tech)}>
          <div className="container-site grid-12 items-center gap-y-6">
            <div className="col-span-4 md:col-span-4" data-reveal>
              <Eyebrow>Technologies</Eyebrow>
              <h2 id="tech-h" className="mt-3 text-h3 text-navy-950">
                Platforms used
              </h2>
            </div>
            <ul className="col-span-4 flex flex-wrap gap-2.5 md:col-span-8" data-reveal>
              {c.technologies.map((t) => (
                <li key={t} className="rounded-full border border-grey-200 bg-white px-4 py-2 text-small font-semibold text-navy-950">
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {c.related.length > 0 && (
        <Rail
          label="Related case studies"
          labelledBy="related-h"
          className={after.related}
          header={
            <div data-reveal>
              <Eyebrow>More success stories</Eyebrow>
              <h2 id="related-h" className="mt-4 max-w-[22ch] text-h2 text-navy-950">
                Related case studies
              </h2>
            </div>
          }
          action={<ArrowLink href="/case-studies">View all case studies</ArrowLink>}
        >
          {c.related.map((r) => (
            <CaseCard key={r.slug} c={r} />
          ))}
        </Rail>
      )}

      <InnerCta />
    </RevealScope>
  );
}
