import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getService, getServiceParams } from "@/lib/data/services";
import { glyphFor } from "@/lib/glyphs";
import { copy, optionalCopy, plain } from "@/lib/placeholder";
import { PageHero } from "@/components/layout/PageHero";
import { LinkCard } from "@/components/cards/LinkCard";
import { CaseCard } from "@/components/cards/CaseCard";
import { Rail } from "@/components/ui/Rail";
import { Faq } from "@/components/ui/Faq";
import { Prose } from "@/components/ui/Prose";
import { PendingBlock } from "@/components/ui/PendingBlock";
import { Icon } from "@/components/ui/Icon";
import { ArrowLink, ButtonLink } from "@/components/ui/Button";
import { Eyebrow, SectionHeader } from "@/components/ui/SectionHeader";
import { RevealScope } from "@/components/motion/RevealScope";
import { InnerCta } from "@/components/sections/InnerCta";

export async function generateStaticParams() {
  return getServiceParams();
}

export async function generateMetadata({ params }: PageProps<"/services/[pillar]/[service]">): Promise<Metadata> {
  const { pillar, service } = await params;
  const s = await getService(pillar, service);
  if (!s) return {};
  return {
    title: s.seoTitle ?? plain(s.name),
    description: s.seoDescription ?? (plain(s.descriptor) || undefined),
    alternates: { canonical: `/services/${pillar}/${service}` },
    robots: s.noindex ? { index: false } : undefined,
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

export default function ServicePage({ params }: PageProps<"/services/[pillar]/[service]">) {
  return (
    <Service params={params} />
  );
}

async function Service({ params }: { params: PageProps<"/services/[pillar]/[service]">["params"] }) {
  const { pillar, service } = await params;
  const s = await getService(pillar, service);
  if (!s) notFound();
  const name = plain(s.name);
  const whoFor = optionalCopy(s.whoFor);
  const summaryPending = !s.summary || copy(s.summary).pending;

  return (
    <RevealScope>
      <PageHero
        crumbs={[{ label: "Services", href: "/services" }, { label: s.pillar.name, href: s.pillar.href }, { label: s.name }]}
        eyebrow={s.pillar.name}
        title={s.name}
        intro={s.descriptor}
        image={s.image}
        art={glyphFor(s.slug)}
        artVariant={1}
        actions={
          <ButtonLink href="/contact" arrow>
            Talk to an expert
          </ButtonLink>
        }
      />

      {/* Overview: the migrated copy, with who it is for alongside */}
      <section aria-labelledby="overview-h" className="section-y tone-white">
        <div className="container-site grid-12 gap-y-10">
          <div className="col-span-4 md:col-span-8 lg:col-span-7" data-reveal>
            <Eyebrow>Overview</Eyebrow>
            <h2 id="overview-h" className="sr-only">
              Overview
            </h2>
            {summaryPending ? <PendingBlock label="Overview to be confirmed" lines={4} className="mt-6" /> : <Prose text={s.summary} className="mt-6 text-lead" />}
          </div>
          <aside className="col-span-4 md:col-span-8 lg:col-span-4 lg:col-start-9" data-reveal>
            <div className="rounded-card bg-navy-950 p-7 text-white" data-spotlight>
              <Icon name={glyphFor(s.slug)} size={32} strokeWidth={1.5} className="text-sky-400" />
              {whoFor ? (
                <>
                  <p className="eyebrow mt-6 text-sky-300">Who it’s for</p>
                  <p className="mt-3 text-on-navy-muted">{whoFor.text}</p>
                </>
              ) : (
                <p className="mt-6 font-display text-h4 font-bold">Planning a {name.toLowerCase()} programme?</p>
              )}
              <ButtonLink href="/contact" className="mt-7 w-full sm:w-auto" arrow>
                Book a consultation
              </ButtonLink>
            </div>
          </aside>
        </div>
      </section>

      {s.whatWeDo.length > 0 && (
        <section aria-labelledby="wwd-h" className="section-y tone-mist">
          <div className="container-site">
            <SectionHeader id="wwd-h" eyebrow="What we do" heading={`How we help with ${name}`} />
            <ul className="mt-12 grid gap-4 sm:grid-cols-2 md:mt-16 lg:grid-cols-3 lg:gap-6">
              {s.whatWeDo.map((w) => (
                <li key={w.title} className="flex gap-4 rounded-card border border-grey-200 bg-white p-6 md:p-7" data-reveal>
                  <span className="mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                    <Icon name="check" size={18} />
                  </span>
                  <div>
                    <h3 className="text-h4 font-bold text-navy-950">{w.title}</h3>
                    {w.body && <p className="mt-2 text-small text-grey-700">{w.body}</p>}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {s.steps.length > 0 && (
        <section aria-labelledby="steps-h" className="section-y bg-navy-950 text-white" data-morph>
          <div className="container-site">
            <SectionHeader id="steps-h" tone="dark" eyebrow="Our approach" heading="How an engagement runs" />
            {/* A real sequence, so the steps are numbered. */}
            <ol className="mt-12 grid gap-x-8 gap-y-10 md:mt-16 md:grid-cols-2 lg:grid-cols-4">
              {s.steps.map((st, i) => (
                <li key={st.title} className="border-t border-navy-700 pt-6" data-reveal>
                  <p className="font-display text-sm font-bold tabular-nums text-sky-400">{String(i + 1).padStart(2, "0")}</p>
                  <h3 className="mt-4 text-h4">{st.title}</h3>
                  {st.body && <p className="mt-3 text-on-navy-muted">{st.body}</p>}
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {s.technologies.length > 0 && (
        <section aria-labelledby="tech-h" className="tone-white border-b border-grey-100 py-14 md:py-20">
          <div className="container-site grid-12 items-center gap-y-6">
            <div className="col-span-4 md:col-span-4" data-reveal>
              <Eyebrow>Technologies</Eyebrow>
              <h2 id="tech-h" className="mt-3 text-h3 text-navy-950">
                Platforms we work with
              </h2>
            </div>
            <ul className="col-span-4 flex flex-wrap gap-2.5 md:col-span-8" data-reveal>
              {s.technologies.map((t) => (
                <li key={t} className="rounded-full border border-grey-200 bg-grey-25 px-4 py-2 text-small font-semibold text-navy-950">
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {s.caseStudies.length > 0 && (
        <Rail
          label="Related success stories"
          labelledBy="svc-cases-h"
          className="tone-mist"
          header={
            <div data-reveal>
              <Eyebrow>Success stories</Eyebrow>
              <h2 id="svc-cases-h" className="mt-4 max-w-[22ch] text-h2 text-navy-950">
                {name} in practice
              </h2>
            </div>
          }
          action={<ArrowLink href="/case-studies">View all case studies</ArrowLink>}
        >
          {s.caseStudies.map((c) => (
            <CaseCard key={c.slug} c={c} />
          ))}
        </Rail>
      )}

      {s.faqs.length > 0 && (
        <section aria-labelledby="faq-h" className="section-y tone-white">
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

      {s.siblings.length > 0 && (
        <section aria-labelledby="more-h" className={s.caseStudies.length > 0 && !s.faqs.length ? "section-y tone-white" : "section-y tone-mist"}>
          <div className="container-site">
            <SectionHeader
              id="more-h"
              eyebrow={s.pillar.name}
              heading={`More ${s.pillar.name.toLowerCase()}`}
              action={<ArrowLink href={s.pillar.href}>All {s.pillar.name.toLowerCase()}</ArrowLink>}
            />
            <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
              {s.siblings.slice(0, 6).map((x) => (
                <li key={x.slug} data-reveal>
                  <LinkCard href={x.href} title={x.name} descriptor={x.descriptor} icon={glyphFor(x.slug)} />
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
