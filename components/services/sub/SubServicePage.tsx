import Link from "next/link";
import { DM_Sans, Poppins } from "next/font/google";
import type { Block } from "@/lib/data/site";
import type { RegionSlug } from "@/lib/region";
import { SUB_CASES, type SubServiceContent } from "@/lib/sub-service-content";
import { previewingDrafts } from "@/lib/preview";
import { breadcrumbJsonLd, serviceJsonLd, type Crumb } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { Img } from "@/components/media/Img";
import { Icon } from "@/components/ui/Icon";
import { DraftNote } from "@/components/ui/DraftTag";
import { RevealScope } from "@/components/motion/RevealScope";
import { ContactSection } from "@/components/home/ContactSection";
import { CloudHub } from "@/components/services/sub/CloudHub";

/**
 * The shared template for the six Cloud sub-service pages, built to the finalised design
 * `design-ref/exports/new-design/Managed Services.svg` (1440x7252, supplied 23 November 2026).
 *
 * Eight bands in the design's order: hero, service overview, benefits, what we manage (the hub diagram), why
 * Adamas Tech, case study, related services, CTA - then the site's contact block, which the design also draws.
 *
 * Content comes from `lib/sub-service-content.ts`, one entry per page. **No page ever renders another page's
 * copy**: a section with no real content for that service is `null` and the band is left out, with a Draft note
 * in its place in the drafts preview only. That keeps the public build free of empty or borrowed sections while
 * the review build still shows the client exactly what is missing.
 *
 * The type system and 1200 column are the revamp's, scoped to `.cloud-v2` exactly as on the Cloud page.
 */

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"], variable: "--font-poppins", display: "swap", preload: false });
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans", display: "swap", preload: false });

export function SubServicePage({
  content,
  contactBlock,
  fallbackRegion,
}: {
  content: SubServiceContent;
  contactBlock: Block | null;
  fallbackRegion: RegionSlug;
}) {
  const c = content;
  const path = `/services/cloud-services/${c.slug}`;
  // No visible trail - the design draws none on this hero - but the structured data still belongs on the page.
  const crumbs: Crumb[] = [
    { name: "Services", path: "/services" },
    { name: "Cloud Services", path: "/services/cloud-services" },
    { name: c.hero.title, path },
  ];
  const preview = previewingDrafts;
  // The design's related row is the same four cards on every page; a page never links to itself.
  const related = c.related.filter((r) => r.href !== path);

  return (
    <RevealScope>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <JsonLd
        data={serviceJsonLd({ name: c.hero.title, description: c.hero.intro, path, category: "Cloud Services" })}
      />
      <div className={`cloud-v2 ${poppins.variable} ${dmSans.variable}`}>
        {/* 1. Hero (y 149-764) */}
        <section data-dark-hero data-compare="sub-hero" className="relative isolate flex min-h-[420px] items-center overflow-hidden bg-black lg:min-h-[615px]">
          <Img
            src="images/services/managed/hero-art.webp"
            alt=""
            aria-hidden="true"
            width={700}
            height={620}
            priority
            fetchPriority="high"
            sizes="(min-width:1024px) 700px, 100vw"
            className="pointer-events-none absolute right-0 top-0 -z-10 h-full w-[58%] object-cover object-left opacity-90"
          />
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,#000000_28%,rgb(0_0_0/0.72)_52%,rgb(0_0_0/0.25)_100%)]" aria-hidden="true" />
          <div className="container-cloud py-16 text-center text-white lg:py-[72px]">
            <p className="inline-flex rounded-lg bg-white/[0.14] px-4 py-2 text-[0.875rem] font-semibold backdrop-blur-sm">{c.hero.badge}</p>
            <h1 className="u-display mx-auto mt-6 max-w-[920px] text-[clamp(1.875rem,1.2rem+2.4vw,3rem)] font-bold leading-[1.14]">{c.hero.title}</h1>
            {c.hero.intro && <p className="mx-auto mt-5 max-w-[600px] text-[0.9375rem] leading-[1.7] text-white/80">{c.hero.intro}</p>}
            {/* The design separates the two competencies with a small dot; it is decorative, so it sits between
                the list items rather than inside either of them. */}
            <ul className="mt-8 flex flex-wrap items-center justify-center gap-y-2 text-[0.875rem] text-white/80" role="list">
              {c.hero.competencies.map((t, i) => (
                <li key={t} className="flex items-center">
                  {i > 0 && <span aria-hidden="true" className="mx-5 h-[5px] w-[5px] rounded-full bg-white/55" />}
                  {t}
                </li>
              ))}
            </ul>
            <Link href="/contact" className="mt-9 inline-flex min-h-[44px] items-center gap-2 rounded-full bg-blue-600 px-6 text-[0.875rem] font-semibold text-white hover:bg-blue-500">
              {c.hero.ctaLabel}
              <Icon name="arrow" size={16} />
            </Link>
          </div>
        </section>

        {/* 2. Service overview (y 764-1300) */}
        {c.overview ? (
          <section data-compare="sub-overview" aria-labelledby="sub-overview-heading" className="bg-white py-12 lg:py-[96px]">
            <div className="container-cloud grid gap-8 lg:grid-cols-[minmax(0,1fr)_490px] lg:items-start lg:gap-[60px]">
              <div data-reveal>
                <p className="text-[0.75rem] font-bold uppercase tracking-[0.14em] text-blue-600">{c.overview.eyebrow}</p>
                <h2 id="sub-overview-heading" className="u-display mt-2 text-[clamp(1.5rem,1.1rem+1.2vw,2rem)] font-semibold leading-[1.25] text-[#0B1B33]">
                  {c.overview.heading}
                </h2>
                {c.overview.paragraphs.map((p) => (
                  <p key={p.slice(0, 40)} className="mt-5 text-[1rem] leading-[1.7] text-[#55617A]">
                    {p}
                  </p>
                ))}
              </div>
              <span className="relative block h-[220px] w-full overflow-hidden rounded-xl lg:h-[290px]" data-reveal>
                <Img src="images/services/managed/overview.webp" alt="" aria-hidden="true" fill sizes="(min-width:1024px) 490px, 100vw" className="object-cover" />
              </span>
            </div>
          </section>
        ) : (
          preview && <MissingBand id="sub-overview" label="Service overview" />
        )}

        {/* 3. Benefits (y 1400-2031) */}
        {c.benefits ? (
          <section data-compare="sub-benefits" aria-labelledby="sub-benefits-heading" className="bg-white pb-12 lg:pb-[96px]">
            <div className="container-cloud">
              <h2 id="sub-benefits-heading" className="u-display text-[clamp(1.5rem,1.1rem+1.4vw,2.125rem)] font-semibold leading-[1.2] text-[#0B1B33]" data-reveal>
                {c.benefits.heading}
              </h2>
              {c.benefits.body && <p className="mt-3 max-w-[920px] text-[1.0625rem] leading-[1.6] text-[#55617A]">{c.benefits.body}</p>}
              <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:mt-[44px] lg:grid-cols-3" role="list">
                {c.benefits.cards.map((card) => (
                  <li key={card.title} className="flex items-start justify-between gap-3 rounded-xl border border-[#EAEFF7] bg-white p-5 shadow-[0_1px_2px_rgb(16_24_40/0.05)]" data-reveal>
                    <div className="min-w-0">
                      <h3 className="u-display text-[1.1875rem] font-semibold leading-[1.25] text-[#0B1B33]">{card.title}</h3>
                      {card.body && <p className="mt-3 text-[0.875rem] leading-[1.6] text-[#55617A]">{card.body}</p>}
                    </div>
                    <Img src={card.image} alt="" aria-hidden="true" width={110} height={110} sizes="110px" className="h-[72px] w-[72px] shrink-0 object-contain" />
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ) : (
          preview && <MissingBand id="sub-benefits" label="Why businesses work with this service" />
        )}

        {/* 4. What we manage: the hub diagram (y 2031-2947) */}
        {c.manage ? (
          <CloudHub eyebrow={c.manage.eyebrow} heading={c.manage.heading} hubLabel={c.manage.hubLabel} items={c.manage.items} />
        ) : (
          preview && <MissingBand id="sub-manage" label="What we manage" />
        )}

        {/* 5. Why Adamas Tech (y 2947-4000) */}
        {c.value ? (
          <section data-compare="sub-value" aria-labelledby="sub-value-heading" className="bg-white py-12 lg:py-[96px]">
            <div className="container-cloud grid gap-8 lg:grid-cols-[512px_minmax(0,1fr)] lg:gap-[48px]">
              <div>
                <p className="text-[0.75rem] font-bold uppercase tracking-[0.14em] text-blue-600">{c.value.eyebrow}</p>
                <h2 id="sub-value-heading" className="u-display mt-2 max-w-[440px] text-[clamp(1.5rem,1.1rem+1.4vw,2.125rem)] font-semibold leading-[1.2] text-[#0B1B33]">
                  {c.value.heading}
                </h2>
                {c.value.body && <p className="mt-5 max-w-[440px] text-[1rem] leading-[1.7] text-[#55617A]">{c.value.body}</p>}
                <span className="relative mt-8 block h-[240px] w-full overflow-hidden rounded-xl lg:mt-[64px] lg:h-[345px]" data-reveal>
                  <Img src="images/services/managed/video-poster.webp" alt="" aria-hidden="true" fill sizes="(min-width:1024px) 512px, 100vw" className="object-cover" />
                </span>
              </div>
              <ul className="grid gap-6 sm:grid-cols-2" role="list">
                {c.value.cards.map((card) => (
                  <li key={card.title} className="rounded-xl bg-[#F6F8FC] p-4" data-reveal>
                    <span className="relative block h-[124px] w-full overflow-hidden rounded-lg">
                      <Img src={card.image} alt="" aria-hidden="true" fill sizes="268px" className="object-cover" />
                    </span>
                    <h3 className="u-display mt-4 text-[1.125rem] font-semibold leading-[1.3] text-[#0B1B33]">{card.title}</h3>
                    {card.body ? (
                      <p className="mt-3 text-[0.875rem] leading-[1.6] text-[#55617A]">{card.body}</p>
                    ) : (
                      preview && <DraftNote>Copy for this card is still with the client.</DraftNote>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ) : (
          preview && <MissingBand id="sub-value" label="How this service creates value" />
        )}

        {/* 6. Case study (y 4000-4600) */}
        <section data-compare="sub-cases" aria-labelledby="sub-cases-heading" className="bg-white pb-12 lg:pb-[80px]">
          <div className="container-cloud">
            <p className="text-[0.75rem] font-bold uppercase tracking-[0.14em] text-blue-600">{SUB_CASES.eyebrow}</p>
            <h2 id="sub-cases-heading" className="u-display mt-2 text-[clamp(1.5rem,1.1rem+1.4vw,2.125rem)] font-bold text-[#0B1B33]">
              {SUB_CASES.heading}
            </h2>
            <ul className="mt-8 grid gap-6 lg:grid-cols-2" role="list">
              {SUB_CASES.items.map((item) => (
                <li key={item.href} className="rounded-xl bg-[#F6F8FC] p-4" data-reveal>
                  <span className="relative block h-[230px] w-full overflow-hidden rounded-lg">
                    <Img src={item.image} alt="" aria-hidden="true" fill sizes="(min-width:1024px) 548px, 100vw" className="object-cover" />
                  </span>
                  <p className="mt-5 text-[0.8125rem] font-medium uppercase tracking-[0.08em] text-blue-600">{item.label}</p>
                  <h3 className="u-display mt-2 text-[1.3125rem] font-semibold leading-[1.3] text-[#0B1B33]">{item.title}</h3>
                  <p className="mt-3 text-[0.875rem] leading-[1.6] text-[#55617A]">{item.body}</p>
                  <ul className="mt-4 flex flex-wrap gap-2" role="list">
                    {item.tags.map((t) => (
                      <li key={t} className="rounded-full bg-[#E4EEFF] px-3 py-1 text-[0.8125rem] text-[#2563C9]">
                        {t}
                      </li>
                    ))}
                  </ul>
                  <Link href={item.href} className="mt-4 inline-flex items-center gap-2 text-[0.875rem] font-medium text-blue-600 hover:text-blue-500">
                    Read more
                    <span className="sr-only">: {item.title}</span>
                    <Icon name="arrow" size={14} />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 7. Related services (y 4700-5300) */}
        {related.length > 0 && (
          <section data-compare="sub-related" aria-labelledby="sub-related-heading" className="bg-white pb-12 pt-6 lg:pb-[96px] lg:pt-[40px]">
            <div className="container-cloud">
              <p className="text-[0.75rem] font-bold uppercase tracking-[0.14em] text-blue-600">Related services</p>
              <h2 id="sub-related-heading" className="u-display mt-2 text-[clamp(1.5rem,1.1rem+1.4vw,2.125rem)] font-semibold text-[#0B1B33]">
                Explore related AWS capabilities
              </h2>
              <ul className="mt-10 grid gap-8 sm:grid-cols-2 lg:mt-[96px] lg:grid-cols-4 lg:divide-x lg:divide-[#E6EBF3]" role="list">
                {related.map((r) => (
                  <li key={r.href} className="lg:px-6 lg:first:pl-0 lg:last:pr-0" data-reveal>
                    <Img src={r.image} alt="" aria-hidden="true" width={100} height={90} sizes="100px" className="h-[90px] w-[100px] object-contain" />
                    <Link href={r.href} className="mt-5 inline-flex items-start gap-2 text-left">
                      <span className="u-display text-[1.1875rem] font-semibold leading-[1.3] text-[#0B1B33] underline underline-offset-4">{r.title}</span>
                      <Icon name="chevron-right" size={16} className="mt-1 shrink-0 text-[#0B1B33]" />
                    </Link>
                    <p className="mt-4 text-[0.875rem] leading-[1.6] text-[#55617A]">{r.body}</p>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* 8. Closing CTA (y 5400-5600) */}
        <section data-compare="sub-cta" aria-labelledby="sub-cta-heading" className="bg-white pb-10 lg:pb-[56px]">
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
                  <p className="text-[0.75rem] font-bold uppercase tracking-[0.18em] text-blue-600">{c.cta.eyebrow}</p>
                  <h2 id="sub-cta-heading" className="u-display mt-3 text-[clamp(1.625rem,1.1rem+1.8vw,2.25rem)] font-bold leading-[1.2] text-[#0B1B33]">
                    {c.cta.heading}
                  </h2>
                  <p className="mt-4 text-[1rem] leading-[1.6] text-[#55617A] lg:text-[1.125rem]">{c.cta.body}</p>
                </div>
                <Link href="/contact" className="inline-flex min-h-[40px] shrink-0 items-center rounded-md bg-blue-600 px-5 text-[0.75rem] font-semibold text-white hover:bg-blue-500">
                  {c.cta.label}
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 9. Contact, as the design draws it */}
        {contactBlock && (
          <div data-compare="sub-contact">
            <ContactSection block={contactBlock} regionSlug={null} fallbackRegion={fallbackRegion} sourcePath={path} />
          </div>
        )}
      </div>
    </RevealScope>
  );
}

/** A band the design has but this service has no content for: shown in the drafts preview only. */
function MissingBand({ id, label }: { id: string; label: string }) {
  return (
    <section data-compare={id} className="bg-white py-8">
      <div className="container-cloud">
        <DraftNote>
          {label}: the design has this section, but no content has been supplied for this service yet. It is hidden in the public build.
        </DraftNote>
      </div>
    </section>
  );
}
