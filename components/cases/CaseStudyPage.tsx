import Link from "next/link";
import type { CaseStudyPageData } from "@/lib/data/caseStudies";
import type { Block } from "@/lib/data/site";
import { optionalCopy, plain } from "@/lib/placeholder";
import { isPending } from "@/lib/public-copy";
import { previewingDrafts } from "@/lib/preview";
import type { Crumb } from "@/lib/seo";
import { RevealScope } from "@/components/motion/RevealScope";
import { Img } from "@/components/media/Img";
import { Icon } from "@/components/ui/Icon";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Eyebrow, Heading2 } from "@/components/ui/SectionHeader";
import { DraftTag } from "@/components/ui/DraftTag";
import { CaseCard } from "@/components/cases/CaseCard";
import { ContactSection } from "@/components/home/ContactSection";

/** Short labels for the facts strip; the Region enum is IN / UK / GCC. */
const REGION_LABEL: Record<string, string> = { IN: "India", UK: "UK & Ireland", GCC: "GCC" };

const paragraphs = (s: string | null | undefined) => {
  const c = optionalCopy(s);
  return c && !c.pending ? c.text.split(/\n\s*\n/).filter(Boolean) : [];
};

/**
 * Case-study detail, built to Figma frame 274:8299 (the SAP Treasury story): dark hero with the executive summary
 * card, the business challenge, the solution with its capability cards, the results, the technology list, the
 * client quote and the related stories.
 *
 * The design's own copy sets the rule the template follows: "No numerical or guaranteed results are presented
 * without formal client validation". A result whose figure the sources contradict is withheld upstream
 * (lib/data/caseStudies.ts), and a card whose figure is a placeholder shows "Client-validated result to be added"
 * in the drafts preview and nothing at all in the public build.
 */
export function CaseStudyPage({ study, blocks, crumbs }: { study: CaseStudyPageData; blocks: Record<string, Block>; crumbs: Crumb[] }) {
  const summary = paragraphs(study.summary);
  const overview = paragraphs(study.overview);
  const challenge = paragraphs(study.challenge);
  const metric = isPending(study.headlineMetric) ? null : study.headlineMetric ? plain(study.headlineMetric) : null;
  const results = study.results.map((r) => ({ ...r, pending: isPending(r.value) }));
  const shownResults = previewingDrafts ? results : results.filter((r) => !r.pending);
  const sectionHead = "mx-auto max-w-[820px]";

  /** The hero facts strip, in the design's order; every cell comes from the row, so none of it is invented. */
  const facts = [
    { label: "Industry", value: study.industry?.label ?? null },
    { label: "Focus area", value: study.pillars[0] ? plain(study.pillars[0].name) : null },
    { label: "Service", value: study.services[0] ? plain(study.services[0].name) : null },
    { label: "Technology", value: study.technologies[0] ?? null },
    { label: "Region", value: study.regions.length ? study.regions.map((r) => REGION_LABEL[r] ?? r).join(", ") : null },
  ].filter((f): f is { label: string; value: string } => !!f.value);

  return (
    <RevealScope>
      {/* Hero (Figma band y 0-1535): label, title, and the executive summary card overlapping the band below. */}
      <section data-dark-hero data-compare="case-hero" className="relative isolate overflow-hidden bg-navy-950 pb-[120px] text-white lg:pb-[180px]">
        {/* The client has not supplied case-study photography. The row's image is used when it has one; otherwise
            the drafts preview falls back to the frame's own hero photograph so the band has the weight the design
            gives it, and the public build keeps the plain navy. */}
        {study.image ? (
          <Img src={study.image} alt="" fill priority fetchPriority="high" sizes="100vw" className="-z-10 object-cover" />
        ) : (
          previewingDrafts && <Img src="images/case-studies/draft-hero.webp" alt="" fill priority fetchPriority="high" sizes="100vw" className="-z-10 object-cover" />
        )}
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(0_12_51/0.58)_0%,rgb(0_12_51/0.78)_100%)]" aria-hidden="true" />
        <div className="container-site pt-10 text-center lg:pt-[56px]">
          <Breadcrumb crumbs={crumbs} className="flex justify-center [&_a]:text-white/75 [&_a:hover]:text-white [&_li]:text-white/60 [&_span[aria-current]]:text-white" />
          <p className="mt-10 font-heading text-[1.25rem] font-medium uppercase tracking-[0.08em] text-sky-300">
            {plain(study.label) || "Case study"}
            {study.industry && ` | ${study.industry.label}`}
          </p>
          <h1 className="mx-auto mt-4 max-w-[1100px] text-balance font-heading text-[clamp(2rem,1.2rem+2.6vw,3.875rem)] font-bold leading-[1.14] tracking-[-0.02em]">{plain(study.title)}</h1>
          {study.clientDescriptor && <p className="mx-auto mt-5 max-w-[760px] font-body text-[1.125rem] leading-[1.6] text-white/80">{plain(study.clientDescriptor)}</p>}
          <Link href="/contact" className="mt-9 inline-flex min-h-[48px] items-center gap-3 rounded-pill bg-blue-600 px-7 font-heading text-[1rem] font-bold text-white hover:bg-blue-500">
            Talk to an expert
            <Icon name="arrow" size={17} />
          </Link>
        </div>
      </section>

      {/* The frame puts a 1349x235 photograph between the hero and the executive summary (y 564-799). No client
          photography exists for it, so the design's own is shown as a Draft placeholder in the preview and the
          band is simply absent in public. */}
      {previewingDrafts && (
        <div data-compare="case-strip" className="relative z-10 -mt-[60px] lg:-mt-[80px]">
          <div className="container-site">
            <figure className="m-0" data-reveal>
              <Img
                src="images/case-studies/draft-strip.webp"
                alt="Illustrative photograph from the design"
                width={1349}
                height={235}
                sizes="(min-width: 1400px) 1349px, 100vw"
                className="h-[140px] w-full rounded-lg object-cover shadow-lift lg:h-[235px]"
              />
              <figcaption className="mt-2 font-body text-[0.75rem] leading-[1.35] text-grey-500">
                <DraftTag className="ml-0 mr-2" />
                Photograph from the design. Awaiting the client&rsquo;s own imagery.
              </figcaption>
            </figure>
          </div>
        </div>
      )}

      {/*
        A facts strip (industry, focus area, service, technology, region) that the frame does not have: round 8
        confirmed there is no such band in 274:8299, so this is our own addition and is on the allowed-differences
        list. Each cell is filled from the row's own relations, so a case study that carries no industry or no
        technology simply shows fewer cells, and the strip disappears when it has none.
      */}
      {facts.length > 0 && (
        <div data-compare="case-facts" className="relative z-10 -mt-[70px] lg:-mt-[86px]">
          <div className="container-site">
            <dl className="grid gap-x-6 gap-y-5 rounded-lg bg-white px-7 py-7 shadow-lift ring-1 ring-grey-200 sm:grid-cols-2 lg:grid-cols-5 lg:px-10" data-reveal>
              {facts.map((f) => (
                <div key={f.label}>
                  <dt className="font-heading text-[0.6875rem] font-bold uppercase tracking-[0.12em] text-grey-500">{f.label}</dt>
                  <dd className="mt-1.5 font-heading text-[1.0625rem] font-bold leading-[1.3] text-navy-850">{f.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      )}

      {/* Executive summary (Figma y 943-1400): the summary beside the headline figure and the first results. */}
      {(summary.length > 0 || metric || shownResults.length > 0) && (
        <section data-compare="case-summary" aria-labelledby="case-summary-heading" className="relative z-10 pt-14 pb-14 lg:pt-[72px] lg:pb-[88px]">
          <div className="container-site">
            <div className="rounded-lg bg-white p-8 shadow-lift ring-1 ring-grey-200 lg:p-[56px]" data-reveal>
              {/* The design puts a second line under "EXECUTIVE SUMMARY" that no field holds; repeating the title
                  here would give the page two identical top-level headings, so the eyebrow is the heading. */}
              <Heading2 id="case-summary-heading" className="eyebrow !text-[1rem] !font-extrabold !tracking-[0.08em] !text-blue-600">
                Executive summary
              </Heading2>
              <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,380px)] lg:gap-[72px]">
                <div>
                  {summary.map((p) => (
                    <p key={p.slice(0, 40)} className="mb-4 font-body text-[1.125rem] leading-[1.65] text-grey-700 last:mb-0">
                      {p}
                    </p>
                  ))}
                  {metric && (
                    <p className="mt-6 font-heading text-[clamp(2.25rem,1.5rem+2.4vw,3.5rem)] font-bold leading-none text-blue-600">
                      {metric}
                      {study.metricLabel && <span className="ml-3 align-middle font-body text-[1rem] font-normal text-grey-600">{plain(study.metricLabel)}</span>}
                    </p>
                  )}
                </div>
                {shownResults.length > 0 && (
                  <ul className="grid gap-3" role="list">
                    {shownResults.slice(0, 3).map((r) => (
                      <li key={r.label} className="rounded-md bg-tint-50 px-5 py-4">
                        <p className="font-heading text-[1.25rem] font-bold leading-[1.3] text-navy-850">{plain(r.label)}</p>
                        {r.pending ? (
                          <p className="mt-1 font-body text-[0.8125rem] text-[#9A5208]">Client-validated result to be added</p>
                        ) : (
                          <p className="mt-1 font-heading text-[1.5rem] font-bold leading-none text-blue-600">{plain(r.value)}</p>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* The business challenge (Figma y 1635-2210). */}
      {challenge.length > 0 && (
        <section data-compare="case-challenge" aria-labelledby="case-challenge-heading" className="bg-white py-14 lg:py-[88px]">
          <div className={`container-site ${sectionHead}`} data-reveal>
            <Eyebrow className="!text-[1rem] !tracking-[0.08em]">The business challenge</Eyebrow>
            <Heading2 id="case-challenge-heading" className="mt-3">
              What the client needed to change
            </Heading2>
            {challenge.map((p) => (
              <p key={p.slice(0, 40)} className="mt-4 font-body text-[1.125rem] leading-[1.65] text-grey-700">
                {p}
              </p>
            ))}
          </div>
        </section>
      )}

      {/* Our solution and its capabilities (Figma y 3957-6070). */}
      {(overview.length > 0 || study.solution.length > 0) && (
        <section data-compare="case-solution" aria-labelledby="case-solution-heading" className="bg-tint-50 py-14 lg:py-[88px]">
          <div className="container-site">
            {/* The frame sets this band in two columns, the copy beside a 600x400 product screenshot (Figma
                y 4109-4609). No client screenshot exists yet, so the design's own is shown as a Draft placeholder
                while drafts are previewed and the band falls back to a single centred column in public. */}
            <div className={previewingDrafts ? "grid gap-10 lg:grid-cols-[minmax(0,1fr)_600px] lg:items-center" : sectionHead} data-reveal>
              <div className={previewingDrafts ? "max-w-[620px]" : undefined}>
                <Eyebrow className="!text-[1rem] !tracking-[0.08em]">Our solution</Eyebrow>
                <Heading2 id="case-solution-heading" className="mt-3">
                  How we approached it
                </Heading2>
                {overview.map((p) => (
                  <p key={p.slice(0, 40)} className="mt-4 font-body text-[1.125rem] leading-[1.65] text-grey-700">
                    {p}
                  </p>
                ))}
              </div>
              {previewingDrafts && (
                <figure className="m-0">
                  <Img
                    src="images/case-studies/draft-solution.webp"
                    alt="Illustrative treasury forecasting dashboard from the design"
                    width={600}
                    height={400}
                    sizes="(min-width: 1024px) 600px, 100vw"
                    className="w-full rounded-lg shadow-lift ring-1 ring-grey-200"
                  />
                  <figcaption className="mt-2 font-body text-[0.75rem] leading-[1.35] text-grey-500">
                    <DraftTag className="ml-0 mr-2" />
                    Illustrative interface from the design. Awaiting the client&rsquo;s own product screenshot.
                  </figcaption>
                </figure>
              )}
            </div>
            {study.solution.length > 0 && (
              <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:mt-[52px] lg:grid-cols-3" role="list">
                {study.solution.map((s, i) => (
                  <li key={plain(s.title)} className="rounded-lg bg-white p-7 ring-1 ring-grey-200" data-reveal>
                    {study.solutionIsSequence && (
                      <span className="font-heading text-[0.875rem] font-bold text-blue-600" aria-hidden="true">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    )}
                    <h3 className="mt-2 font-heading text-[1.25rem] font-bold leading-[1.3] text-navy-850">{plain(s.title)}</h3>
                    {s.body && <p className="mt-3 font-body text-[1rem] leading-[1.6] text-grey-600">{plain(s.body)}</p>}
                  </li>
                ))}
              </ol>
            )}
          </div>
        </section>
      )}

      {/* Results and business impact (Figma y 8585-9509): drawn on navy with a screenshot per result. The dark
          treatment is kept; the screenshots are not, since no case study row carries per-result imagery. */}
      {shownResults.length > 0 && (
        <section data-compare="case-results" aria-labelledby="case-results-heading" className="bg-navy-950 py-14 text-white lg:py-[88px]">
          <div className="container-site">
            <div className={sectionHead} data-reveal>
              <Eyebrow className="!text-[1rem] !tracking-[0.08em] !text-sky-300">Results and business impact</Eyebrow>
              <Heading2 id="case-results-heading" className="mt-3 !text-white">
                What changed for the client
              </Heading2>
            </div>
            <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4" role="list">
              {shownResults.map((r) => (
                <li key={r.label} className="rounded-lg bg-white/[0.06] p-7 ring-1 ring-white/15" data-reveal>
                  {r.pending ? (
                    <p className="rounded-sm bg-orange-500 px-2 py-1 font-body text-[0.75rem] font-bold text-navy-950">Client-validated result to be added</p>
                  ) : (
                    <p className="font-heading text-[clamp(1.75rem,1.2rem+1.4vw,2.5rem)] font-bold leading-none text-sky-300">{plain(r.value)}</p>
                  )}
                  <p className="mt-3 font-body text-[1rem] leading-[1.55] text-white/80">{plain(r.label)}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Technology and the services behind the work (Figma y 7000-7699, as a list rather than a diagram). */}
      {(study.technologies.length > 0 || study.services.length > 0 || study.solutions.length > 0) && (
        <section data-compare="case-tech" aria-labelledby="case-tech-heading" className="bg-tint-50 py-14 lg:py-[80px]">
          <div className="container-site">
            <div className={sectionHead} data-reveal>
              <Eyebrow className="!text-[1rem] !tracking-[0.08em]">Technology and services</Eyebrow>
              <Heading2 id="case-tech-heading" className="mt-3">
                What this work was built on
              </Heading2>
            </div>
            {study.technologies.length > 0 && (
              <ul className="mt-8 flex flex-wrap justify-center gap-2.5" role="list">
                {study.technologies.map((t) => (
                  <li key={t} className="inline-flex min-h-9 items-center rounded-pill bg-white px-4 font-body text-[0.875rem] text-grey-700 ring-1 ring-grey-200">
                    {t}
                  </li>
                ))}
              </ul>
            )}
            {(study.services.length > 0 || study.solutions.length > 0) && (
              <ul className="mt-8 flex flex-wrap justify-center gap-3" role="list">
                {[...study.services, ...study.pillars].map((s) => (
                  <li key={s.href}>
                    <Link href={s.href} className="inline-flex min-h-10 items-center gap-2 rounded-pill bg-white px-5 font-heading text-[0.9375rem] font-bold text-navy-850 ring-1 ring-grey-200 hover:text-blue-600">
                      {plain(s.name)}
                      <Icon name="chevron-right" size={15} />
                    </Link>
                  </li>
                ))}
                {study.solutions.map((s) => (
                  <li key={s.href}>
                    <a href={s.href} rel="noopener noreferrer" target="_blank" className="inline-flex min-h-10 items-center gap-2 rounded-pill bg-white px-5 font-heading text-[0.9375rem] font-bold text-navy-850 ring-1 ring-grey-200 hover:text-blue-600">
                      {plain(s.name)}
                      <Icon name="arrow" size={15} className="-rotate-45" />
                      <span className="sr-only">(opens in a new tab)</span>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      )}

      {/* Client quote (Figma band y 6180-6875 carries the client artwork; the quote is the content behind it). */}
      {study.quote && !isPending(study.quote) && (
        <section data-compare="case-quote" className="bg-white py-14 lg:py-[80px]">
          <figure className={`container-site ${sectionHead} text-center`} data-reveal>
            <blockquote className="font-heading text-[clamp(1.25rem,1rem+1.2vw,1.875rem)] font-semibold leading-[1.4] text-navy-850">“{plain(study.quote)}”</blockquote>
            {study.quoteBy && <figcaption className="mt-5 font-body text-[1rem] text-grey-600">{plain(study.quoteBy)}</figcaption>}
          </figure>
        </section>
      )}

      {/* Related stories. */}
      {study.related.length > 0 && (
        <section data-compare="case-related" aria-labelledby="case-related-heading" className="bg-tint-50 py-14 lg:py-[88px]">
          <div className="container-site">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between" data-reveal>
              <Heading2 id="case-related-heading">More case studies</Heading2>
              <Link href="/case-studies" className="inline-flex items-center gap-3 font-heading text-[0.9375rem] font-bold text-navy-850 hover:text-blue-600">
                All case studies
                <Icon name="arrow" size={17} />
              </Link>
            </div>
            <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" role="list">
              {study.related.slice(0, 3).map((c, i) => (
                <li key={c.slug} data-reveal>
                  <CaseCard item={c} index={i} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {blocks["home.contact"] && <ContactSection block={blocks["home.contact"]} regionSlug={null} />}
    </RevealScope>
  );
}
