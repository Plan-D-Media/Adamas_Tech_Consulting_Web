import Link from "next/link";
import { DM_Sans, Poppins } from "next/font/google";
import type { Block } from "@/lib/data/site";
import { mediaUrl } from "@/lib/media";
import type { RegionSlug } from "@/lib/region";
import { cloudServices } from "@/lib/cloud-services-content";
import { Img } from "@/components/media/Img";
import { Icon } from "@/components/ui/Icon";
import { breadcrumbJsonLd, serviceJsonLd, type Crumb } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { RevealScope } from "@/components/motion/RevealScope";
import { ContactSection } from "@/components/home/ContactSection";
import { CaseCarousel } from "@/components/services/cloud/CaseCarousel";
import { ClientMarquee } from "@/components/services/cloud/ClientMarquee";
import { CloudFramework } from "@/components/services/cloud/CloudFramework";
import { CloudIndustries } from "@/components/services/cloud/CloudIndustries";
import { VelocityTestimonials } from "@/components/services/cloud/VelocityTestimonials";

/**
 * /services/cloud-services, built to the FINALISED design `design-ref/exports/new-design/Cloud.svg`
 * (1440x8480, supplied 23 November 2026), which supersedes Figma frames 292:24608 and 8705:3814 and every
 * earlier Cloud export.
 *
 * This is a **template variant**, not a change to the shared service template: `app/(site)/services/[pillar]`
 * routes only `cloud-services` here. The other pillars still render `components/services/PillarPage.tsx`; the
 * six Cloud sub-services now render `components/services/sub/SubServicePage.tsx`, built to `Managed Services.svg`.
 *
 * Eleven bands, in the design's order. Copy comes from `lib/cloud-services-content.ts`, which records every
 * string transcribed from the render and everything flagged for proofreading.
 *
 * The design draws the site's own header, contact block and footer around the page. The chrome supplies the
 * header and footer; the contact block is rendered here, because the design places it on this page.
 */

// Scoped to this page: the revamp's type system. `preload: false` keeps them off every other route's critical path.
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"], variable: "--font-poppins", display: "swap", preload: false });
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans", display: "swap", preload: false });

const PATH = "/services/cloud-services";

/**
 * The design draws no breadcrumb trail on this hero, so none is rendered - but the structured data still has to
 * be here. It used to come from `PillarPage`, which this page replaced in round 9.
 */
const CRUMBS: Crumb[] = [
  { name: "Services", path: "/services" },
  { name: "Cloud Services", path: PATH },
];

export function CloudServicesPage({ contactBlock, fallbackRegion }: { contactBlock: Block | null; fallbackRegion: RegionSlug }) {
  const c = cloudServices;

  return (
    <RevealScope>
      <JsonLd data={breadcrumbJsonLd(CRUMBS)} />
      <JsonLd
        data={serviceJsonLd({ name: "Cloud Services", description: c.hero.intro, path: PATH, image: mediaUrl("images/services/cloud-services.webp") })}
      />
      <div className={`cloud-v2 ${poppins.variable} ${dmSans.variable}`}>
        {/* 1. Hero (y 109-724) */}
        <section data-dark-hero data-compare="cs-hero" className="relative isolate flex min-h-[420px] items-center overflow-hidden bg-[#02081C] lg:min-h-[615px]">
          <Img src="images/services/cloud/hero-bg.webp" alt="" aria-hidden="true" fill priority fetchPriority="high" sizes="100vw" className="-z-10 object-cover" />
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(2_8_28/0.55)_0%,rgb(2_8_28/0.35)_45%,rgb(2_8_28/0.75)_100%)]" aria-hidden="true" />
          <div className="container-cloud py-16 text-center text-white lg:py-[90px]">
            <p className="inline-flex rounded-full border border-white/25 bg-white/10 px-4 py-2 text-[0.875rem] font-semibold backdrop-blur-sm">{c.hero.eyebrow}</p>
            <h1 className="u-display mx-auto mt-6 max-w-[760px] text-[clamp(2.5rem,1.4rem+4.6vw,4.5rem)] font-bold leading-[1.1]">{c.hero.title}</h1>
            <p className="mx-auto mt-5 max-w-[600px] text-[0.9375rem] leading-[1.7] text-white/85">{c.hero.intro}</p>
            <Link href={c.hero.ctaHref} className="mt-8 inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-blue-600 px-5 text-[0.875rem] font-semibold text-white hover:bg-blue-500">
              {c.hero.ctaLabel}
              <Icon name="arrow" size={16} />
            </Link>
          </div>
        </section>

        {/* 2. Clientele strip (y 770-911): an infinite right-to-left marquee, paused on hover, focus or the button. */}
        <section data-compare="cs-clients" aria-label={c.clients.label} className="border-y border-[#EDF1F7] bg-[#F8FAFD] py-7">
          <ClientMarquee items={c.clients.items} />
        </section>

        {/* 3. Our tech stack (y 875-1365) */}
        <section data-compare="cs-stack" aria-labelledby="cs-stack-heading" className="bg-[#F8FAFD] py-12 lg:py-[100px]">
          <div className="container-cloud grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-[80px]">
            <div data-reveal>
              <p className="text-[0.75rem] font-bold uppercase tracking-[0.14em] text-blue-600">{c.techStack.eyebrow}</p>
              <h2 id="cs-stack-heading" className="u-display mt-3 max-w-[509px] text-[clamp(1.5rem,1.1rem+1.2vw,1.75rem)] font-semibold leading-[1.3] text-[#0B1B33]">
                {c.techStack.heading}
              </h2>
              <p className="mt-5 max-w-[509px] text-[1.0625rem] leading-[1.6] text-[#55617A] lg:text-[1.25rem]">{c.techStack.body}</p>
            </div>
            {/* The design leaves the seventh tile alone on a third row rather than filling the grid. */}
            <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3" role="list">
              {c.techStack.tiles.map((t) => (
                <li key={t.name} className="flex h-[86px] items-center justify-center rounded-xl border border-[#E6EBF3] bg-white p-4" data-reveal>
                  <span className="relative block h-[44px] w-[110px]">
                    <Img src={t.image} alt={t.name} fill sizes="110px" className="object-contain" />
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 4. Six ways (y 1365-2204) */}
        <section data-compare="cs-capabilities" aria-labelledby="cs-capabilities-heading" className="bg-white py-12 lg:py-[80px]">
          <div className="container-cloud">
            <p className="text-[0.75rem] font-bold uppercase tracking-[0.14em] text-blue-600">{c.capabilities.eyebrow}</p>
            <h2 id="cs-capabilities-heading" className="u-display mt-2 max-w-[470px] text-[clamp(1.5rem,1.1rem+1.2vw,1.75rem)] font-semibold leading-[1.3] text-[#0B1B33]">
              {c.capabilities.heading}
            </h2>
            <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:mt-[44px] lg:grid-cols-3" role="list">
              {c.capabilities.cards.map((card) => (
                <li key={card.title} className="flex flex-col rounded-xl bg-[#F6F8FC] p-5" data-reveal>
                  {/* `fill` rather than width/height: the card fixes the height and lets the width flex, which
                      next/image warns about when only one of the two is overridden. */}
                  <span className="relative block h-[141px] w-full overflow-hidden rounded-lg">
                    <Img
                      src={card.image}
                      alt=""
                      aria-hidden="true"
                      fill
                      sizes="(min-width:1024px) 360px, (min-width:640px) 45vw, 90vw"
                      className="object-cover"
                    />
                  </span>
                  <h3 className="u-display mt-5 text-[1.25rem] font-semibold text-[#0B1B33]">{card.title}</h3>
                  <p className="mt-3 text-[0.875rem] leading-[1.7] text-[#55617A]">{card.body}</p>
                  <Link href={card.href} className="mt-auto inline-flex items-center gap-2 pt-5 text-[0.8125rem] font-medium text-blue-600 hover:text-blue-500">
                    Learn more
                    <Icon name="arrow" size={14} />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 5. Case studies (y 2204-3069), on black */}
        <section data-compare="cs-cases" aria-labelledby="cs-cases-heading" className="bg-black py-12 lg:py-[80px]">
          <div className="container-cloud">
            <p className="text-[0.75rem] font-bold uppercase tracking-[0.14em] text-blue-500">{c.cases.eyebrow}</p>
            <h2 id="cs-cases-heading" className="u-display mt-2 text-[clamp(1.5rem,1.1rem+1.2vw,1.75rem)] font-semibold text-white">{c.cases.heading}</h2>
            <CaseCarousel items={c.cases.items} />
          </div>
        </section>

        {/* 6. Our framework (y 3069-3939) */}
        <CloudFramework eyebrow={c.framework.eyebrow} heading={c.framework.heading} body={c.framework.body} phases={c.framework.phases} />

        {/* 7. Credentials (y 3939-5089) */}
        <section data-compare="cs-credentials" aria-labelledby="cs-credentials-heading" className="bg-white py-12 lg:py-[80px]">
          <div className="container-cloud">
            <p className="text-[0.75rem] font-bold uppercase tracking-[0.14em] text-blue-600">{c.credentials.eyebrow}</p>
            <h2 id="cs-credentials-heading" className="u-display mt-2 max-w-[590px] text-[clamp(1.5rem,1.1rem+1.2vw,1.75rem)] font-semibold leading-[1.3] text-[#0B1B33]">
              {c.credentials.heading}
            </h2>
            <p className="mt-3 max-w-[900px] text-[1.0625rem] leading-[1.6] text-[#55617A] lg:text-[1.125rem]">{c.credentials.body}</p>

            <ul className="mt-7 grid gap-5 sm:grid-cols-2" role="list">
              {c.credentials.badges.map((b) => (
                <li key={b.title} className={b.wide ? "sm:col-span-2" : undefined} data-reveal>
                  <div className="flex h-full items-start justify-between gap-5 rounded-xl bg-[#F6F8FC] p-6">
                    <div className="min-w-0">
                      <h3 className="u-display text-[1.25rem] font-semibold text-[#0B1B33]">{b.title}</h3>
                      <p className="mt-3 text-[0.875rem] leading-[1.7] text-[#55617A]">{b.body}</p>
                      <Link href={b.href} className="mt-4 inline-flex items-center gap-2 text-[0.8125rem] font-medium text-blue-600 hover:text-blue-500">
                        Learn more
                        <Icon name="arrow" size={14} />
                      </Link>
                    </div>
                    <Img src={b.badge} alt={`AWS ${b.title}`} width={120} height={120} sizes="120px" className="h-[90px] w-[90px] shrink-0 object-contain lg:h-[120px] lg:w-[120px]" />
                  </div>
                </li>
              ))}
            </ul>

            <h3 className="u-display mt-10 text-[1.5rem] font-semibold text-[#0B1B33] lg:mt-[56px]">{c.credentials.validations.heading}</h3>
            <p className="mt-2 max-w-[900px] text-[1.0625rem] leading-[1.6] text-[#55617A] lg:text-[1.125rem]">{c.credentials.validations.body}</p>
            <ul className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5" role="list">
              {c.credentials.validations.items.map((v) => (
                <li key={v.name} className="flex flex-col items-center gap-3 rounded-xl bg-[#F6F8FC] px-4 py-6 text-center" data-reveal>
                  <Img src={v.badge} alt="" aria-hidden="true" width={80} height={80} sizes="80px" className="h-[70px] w-[70px] object-contain" />
                  <p className="u-display text-[0.875rem] font-semibold leading-tight text-[#0B1B33]">{v.name}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 8. Industries (y 5089-5822) */}
        <CloudIndustries eyebrow={c.industries.eyebrow} heading={c.industries.heading} tabs={c.industries.tabs} />

        {/* 9. Testimonials (y 5822-6340) */}
        <section data-compare="cs-testimonials" aria-labelledby="cs-testimonials-heading" className="overflow-hidden bg-[#F6F8FC] py-12 lg:py-[80px]">
          <div className="container-cloud text-center">
            <p className="text-[0.75rem] font-bold uppercase tracking-[0.14em] text-blue-600">{c.testimonials.eyebrow}</p>
            <h2 id="cs-testimonials-heading" className="u-display mt-2 text-[clamp(1.625rem,1.1rem+1.8vw,2.25rem)] font-bold text-[#0B1B33]">
              {c.testimonials.heading}
            </h2>
          </div>
          <VelocityTestimonials items={c.testimonials.items} />
        </section>

        {/* 10. Free cloud credits (y 6340-6695) */}
        <section data-compare="cs-credits" aria-labelledby="cs-credits-heading" className="bg-white py-10 lg:py-[40px]">
          <div className="container-cloud">
            <div className="relative overflow-hidden rounded-2xl bg-[#F6F8FC] p-7 lg:p-[48px]">
              <Img src="images/services/cloud/credits-art.webp" alt="" aria-hidden="true" width={1235} height={235} sizes="60vw" className="pointer-events-none absolute -right-10 bottom-0 hidden w-[60%] opacity-50 lg:block" />
              <div className="relative grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
                <div>
                  <p className="text-[0.75rem] font-bold uppercase tracking-[0.14em] text-blue-600">{c.credits.eyebrow}</p>
                  <h2 id="cs-credits-heading" className="u-display mt-3 max-w-[576px] text-[clamp(1.625rem,1.1rem+1.8vw,2.25rem)] font-semibold leading-[1.2] text-[#0B1B33]">
                    {c.credits.heading}
                  </h2>
                  <p className="mt-5 max-w-[997px] text-[1rem] leading-[1.6] text-[#55617A] lg:text-[1.125rem]">{c.credits.body}</p>
                  <p className="mt-2 max-w-[700px] text-[0.6875rem] leading-[1.5] text-[#5A6578]">{c.credits.footnote}</p>
                </div>
                <Link href={c.credits.ctaHref} className="inline-flex min-h-[40px] shrink-0 items-center rounded-md bg-blue-600 px-5 text-[0.75rem] font-semibold text-white hover:bg-blue-500">
                  {c.credits.ctaLabel}
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 11. Contact (y 6948-7583). The design ends the page with the site's standard enquiry block; its
            submissions go to MAIL_TO_ENQUIRIES like every other form. */}
        {contactBlock && (
          <div data-compare="cs-contact">
            <ContactSection block={contactBlock} regionSlug={null} fallbackRegion={fallbackRegion} sourcePath={PATH} />
          </div>
        )}
      </div>
    </RevealScope>
  );
}
