import Link from "next/link";
import { DM_Sans, Poppins } from "next/font/google";
import type { CaseStudyPageData } from "@/lib/data/caseStudies";
import type { Block } from "@/lib/data/site";
import type { RegionSlug } from "@/lib/region";
import { AWS_CASE_SECTIONS, awsCaseBanner, type AwsCaseStudy } from "@/lib/aws-case-studies";
import { plain } from "@/lib/placeholder";
import { Img } from "@/components/media/Img";
import { Icon } from "@/components/ui/Icon";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { RevealScope } from "@/components/motion/RevealScope";
import { ContactSection } from "@/components/home/ContactSection";
import type { Crumb } from "@/lib/seo";

/**
 * The two client-supplied AWS case studies, built to their own designs:
 * `Case Study_SAP_Cement industry.svg` (1440x4262) and `Case Study_Kubernetes.svg` (1440x4867), 23 Nov 2026.
 *
 * Both designs share one structure, so this is one layout rather than two, but it is **separate from the generic
 * `components/cases/CaseStudyPage.tsx`**, which the other eighteen case studies still use untouched. Routing is
 * by slug in `app/(site)/case-studies/[slug]/page.tsx`.
 *
 * Bands, in the designs' order: dark hero with read time, title and three meta cards; a full-width banner; then
 * a two-column body - a sticky section rail on the left, and Business Challenge, Adamas Solution, Business
 * Outcomes, a pull quote, and AWS & Technology Stack on the right; then the CTA band and the contact block.
 *
 * Two deliberate differences from the SVGs, both reported:
 * - The SAP export draws a different, older page header (Home / About Us / Product / Services, with an AWS
 *   sub-navigation). The Kubernetes export, and `Cloud.svg`, draw the site's real header, so the site header is
 *   used on both.
 * - The SAP export ends with a template footer branded "SYNCK". That is the design kit's placeholder, not
 *   AdamasTech, so the site footer is used - which is what the Kubernetes export draws.
 */

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"], variable: "--font-poppins", display: "swap", preload: false });
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans", display: "swap", preload: false });

export function AwsCaseStudyPage({
  study,
  extra,
  contactBlock,
  fallbackRegion,
  crumbs,
}: {
  study: CaseStudyPageData;
  extra: AwsCaseStudy;
  contactBlock: Block | null;
  fallbackRegion: RegionSlug;
  crumbs: Crumb[];
}) {
  const title = plain(study.title);
  const banner = awsCaseBanner[study.slug] ?? study.image?.url ?? null;
  // The design's solution panel is one paragraph followed by ticked rows; the row carries them in the same shape.
  const [lead, ...checks] = study.solution;

  return (
    <RevealScope>
      <div className={`cloud-v2 ${poppins.variable} ${dmSans.variable}`}>
        {/* 1. Hero (y 149-695) */}
        <section data-dark-hero data-compare="case-hero" className="relative isolate overflow-hidden bg-[#010512]">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 -z-10 w-[62%] bg-[radial-gradient(60%_80%_at_75%_40%,rgb(32_86_180/0.45)_0%,rgb(1_5_18/0)_72%)]"
          />
          <div className="container-cloud py-14 text-white lg:py-[84px]">
            <Breadcrumb crumbs={crumbs} tone="dark" />
            <p className="mt-8 flex items-center gap-2 text-[0.875rem] text-white/70">
              <Icon name="clock" size={16} className="shrink-0" />
              Read time : {extra.readTime}
            </p>
            <h1 className="u-display mt-6 max-w-[860px] text-[clamp(1.875rem,1.2rem+2.6vw,3rem)] font-bold leading-[1.16]">{title}</h1>
            <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:mt-[62px] lg:grid-cols-3" role="list">
              {extra.meta.map((m) => (
                <li key={m.label} className="rounded-xl border border-white/12 bg-white/[0.04] px-6 py-5">
                  <p className="text-[0.6875rem] font-bold uppercase tracking-[0.1em] text-white/60">{m.label}</p>
                  <p className="u-display mt-3 text-[1.25rem] font-semibold leading-[1.3]">{m.value}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 2. Banner (y 695-900) */}
        {banner && (
          <div className="bg-white pt-12 lg:pt-[64px]">
            <div className="container-cloud">
              <span className="relative block h-[160px] w-full overflow-hidden rounded-2xl lg:h-[230px]">
                <Img src={banner} alt="" aria-hidden="true" fill priority fetchPriority="high" sizes="(min-width:1280px) 1200px, 100vw" className="object-cover" />
              </span>
            </div>
          </div>
        )}

        {/* 3. Body: sticky rail + sections */}
        <div className="bg-white pb-12 pt-12 lg:pb-[80px] lg:pt-[72px]">
          <div className="container-cloud grid gap-10 lg:grid-cols-[256px_minmax(0,800px)] lg:gap-[48px]">
            <nav aria-label="On this page" className="hidden lg:block">
              <ol className="sticky top-28 space-y-7 border-l border-[#D9E3F2] pl-5" role="list">
                {AWS_CASE_SECTIONS.map((sct, i) => (
                  <li key={sct.id} className="relative">
                    <span
                      aria-hidden="true"
                      className={`absolute -left-[26px] top-1.5 h-[9px] w-[9px] rounded-full ${i === 0 ? "bg-[#F2A33C]" : "border-2 border-[#5FA0F0] bg-white"}`}
                    />
                    <a href={`#case-${sct.id}`} className="text-[0.9375rem] font-semibold text-[#44506B] hover:text-blue-600">
                      {sct.label}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>

            <div>
              {/* Business Challenge */}
              {study.challenge && (
                <section id="case-challenge" data-compare="case-challenge" aria-labelledby="case-challenge-heading" className="scroll-mt-28">
                  <SectionHeading id="case-challenge-heading" icon="alert">
                    Business Challenge
                  </SectionHeading>
                  <p className="mt-6 text-[1.0625rem] leading-[1.75] text-[#3C4860]">{study.challenge}</p>
                </section>
              )}

              {/* Adamas Solution */}
              {lead && (
                <section id="case-solution" data-compare="case-solution" aria-labelledby="case-solution-heading" className="mt-14 scroll-mt-28 lg:mt-[72px]">
                  <SectionHeading id="case-solution-heading" icon="check">
                    Adamas Solution
                  </SectionHeading>
                  <div className="mt-6 rounded-xl bg-[#EEF5FD] p-6 lg:p-[30px]">
                    {lead.body && <p className="text-[1.0625rem] leading-[1.75] text-[#3C4860]">{lead.body}</p>}
                    {checks.length > 0 && (
                      <ul className="mt-6 space-y-3" role="list">
                        {checks.map((sct) => (
                          <li key={sct.title} className="flex items-start gap-3 rounded-lg bg-white px-5 py-4 text-[1rem] leading-[1.5] text-[#3C4860]">
                            <span aria-hidden="true" className="mt-0.5 shrink-0 text-[#2E7BE4]">
                              <Icon name="check" size={16} />
                            </span>
                            {sct.title}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </section>
              )}

              {/* Business Outcomes */}
              <section id="case-outcomes" data-compare="case-outcomes" aria-labelledby="case-outcomes-heading" className="mt-14 scroll-mt-28 lg:mt-[72px]">
                <SectionHeading id="case-outcomes-heading" icon="chart">
                  Business Outcomes
                </SectionHeading>
                <ul className="mt-6 grid gap-5 sm:grid-cols-2" role="list">
                  {extra.outcomes.map((o) => (
                    <li key={o} className="flex items-start gap-3 rounded-xl border border-[#9EC2F0] px-5 py-4" data-reveal>
                      <span aria-hidden="true" className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#E4EEFB] text-[#2E7BE4]">
                        <Icon name="check" size={14} />
                      </span>
                      <span className="text-[1rem] leading-[1.45] text-[#3C4860]">{o}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Pull quote */}
              {study.overview && (
                <figure className="mt-12 rounded-xl bg-[#101828] p-7 text-white lg:mt-[56px] lg:p-[40px]">
                  <span aria-hidden="true" className="block font-serif text-[1.75rem] leading-none text-white/25">
                    &ldquo;
                  </span>
                  <blockquote className="u-display mt-3 text-[clamp(1.125rem,0.9rem+0.8vw,1.5rem)] font-bold leading-[1.35]">{study.overview}</blockquote>
                </figure>
              )}

              {/* AWS & Technology Stack */}
              {study.technologies.length > 0 && (
                <section id="case-stack" data-compare="case-stack" aria-labelledby="case-stack-heading" className="mt-14 scroll-mt-28 lg:mt-[72px]">
                  <SectionHeading id="case-stack-heading" icon="layers">
                    AWS &amp; Technology Stack
                  </SectionHeading>
                  <div className="mt-6 rounded-xl border border-[#E6ECF6] bg-[#FAFCFF] p-6 lg:p-[30px]">
                    <p className="text-[0.9375rem] leading-[1.6] text-[#5A6578]">
                      {extra.stackIntro}
                    </p>
                    <ul className="mt-5 flex flex-wrap gap-3" role="list">
                      {study.technologies.map((t) => (
                        <li
                          key={t}
                          className="inline-flex items-center gap-2 rounded-full border border-[#DCE6F4] bg-white px-4 py-2 text-[0.9375rem] font-semibold text-[#1C2B45]"
                        >
                          <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full border-[1.5px] border-[#2E7BE4]" />
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>
              )}
            </div>
          </div>
        </div>

        {/* 4. CTA band */}
        <section data-compare="case-cta" aria-labelledby="case-cta-heading" className="bg-white pb-12 lg:pb-[64px]">
          <div className="container-cloud">
            <div className="relative overflow-hidden rounded-2xl bg-[#F6F8FC] p-7 lg:p-[48px]">
              <Img
                src="images/services/cloud/credits-art.webp"
                alt=""
                aria-hidden="true"
                width={1235}
                height={235}
                sizes="60vw"
                className="pointer-events-none absolute -right-10 bottom-0 hidden w-[60%] opacity-50 lg:block"
              />
              <div className="relative grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
                <div>
                  <p className="text-[0.75rem] font-bold uppercase tracking-[0.18em] text-blue-600">{extra.cta.eyebrow}</p>
                  <h2 id="case-cta-heading" className="u-display mt-3 text-[clamp(1.625rem,1.1rem+1.8vw,2.25rem)] font-bold leading-[1.2] text-[#0B1B33]">
                    {extra.cta.heading}
                  </h2>
                  <p className="mt-4 text-[1rem] leading-[1.6] text-[#55617A] lg:text-[1.125rem]">{extra.cta.body}</p>
                </div>
                <Link
                  href={`/contact?service=${encodeURIComponent(title)}`}
                  className="inline-flex min-h-[40px] shrink-0 items-center rounded-md bg-blue-600 px-5 text-[0.75rem] font-semibold text-white hover:bg-blue-500"
                >
                  {extra.cta.label}
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Contact, as the Kubernetes design draws it */}
        {contactBlock && (
          <div data-compare="case-contact">
            <ContactSection block={contactBlock} regionSlug={null} fallbackRegion={fallbackRegion} sourcePath={`/case-studies/${study.slug}`} />
          </div>
        )}
      </div>
    </RevealScope>
  );
}

function SectionHeading({ id, icon, children }: { id: string; icon: "alert" | "check" | "chart" | "layers"; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4">
      <span aria-hidden="true" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#E4EEFB] text-[#2E7BE4]">
        <Icon name={icon} size={20} />
      </span>
      <h2 id={id} className="u-display text-[clamp(1.375rem,1.1rem+0.9vw,1.75rem)] font-bold text-[#152A4E]">
        {children}
      </h2>
    </div>
  );
}
