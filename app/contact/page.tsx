import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPage } from "@/lib/data/pages";
import { getOffices, getRegions } from "@/lib/data/site";
import { PageHero } from "@/components/layout/PageHero";
import { ArrowLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Eyebrow } from "@/components/ui/SectionHeader";
import { RevealScope } from "@/components/motion/RevealScope";
import { GlobalPresence } from "@/components/sections/GlobalPresence";
import { ContactForm } from "@/components/forms/ContactForm";
import { heroIntro, pageMetadata } from "@/components/company/meta";

const PATH = "/contact";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata(await getPage(PATH, "contact"), PATH, "Contact us");
}

const telHref = (n: string) => `tel:${n.replace(/[^+\d]/g, "")}`;

/** Contact: regional numbers up front, the enquiry form as the one clear action, offices below. */
export default async function ContactPage() {
  const [page, regions, offices] = await Promise.all([getPage(PATH, "contact"), getRegions(), getOffices()]);
  if (!page) notFound();
  const b = page.blocks;
  const form = b?.form ?? { heading: "Let’s get in touch" };

  return (
    <RevealScope>
      <PageHero
        crumbs={[{ label: "Contact" }]}
        eyebrow={page.eyebrow}
        title={page.title}
        intro={heroIntro(page.intro)}
        image={page.image}
        art="globe"
        artVariant={1}
        size="md"
        aside={
          regions.length > 0 ? (
            <div className="rounded-card bg-white/5 p-6 ring-1 ring-white/15 backdrop-blur-sm">
              <p className="eyebrow text-sky-300">Regional contacts</p>
              <ul className="mt-2 divide-y divide-white/10">
                {regions.map((r) => (
                  <li key={r.code} className="py-4 last:pb-0">
                    <p className="font-display text-h4 font-bold">{r.label}</p>
                    <div className="mt-2 grid gap-1.5 text-[0.9375rem]">
                      {r.phone && (
                        <a href={r.phoneHref ?? telHref(r.phone)} className="inline-flex min-h-8 items-center gap-2.5 text-on-navy-muted transition-colors duration-(--duration-base) hover:text-white">
                          <Icon name="phone" size={16} className="shrink-0 text-sky-400" />
                          {r.phone}
                        </a>
                      )}
                      {r.email && (
                        <a href={`mailto:${r.email}`} className="inline-flex min-h-8 items-center gap-2.5 text-on-navy-muted transition-colors duration-(--duration-base) hover:text-white [overflow-wrap:anywhere]">
                          <Icon name="mail" size={16} className="shrink-0 text-sky-400" />
                          {r.email}
                        </a>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : undefined
        }
      />

      <section id="enquiry" aria-labelledby="enquiry-h" className="section-y tone-white scroll-mt-(--header-h)">
        <div className="container-site grid-12 gap-y-12">
          <div className="col-span-4 md:col-span-8 lg:col-span-7">
            <div data-reveal>
              {form.eyebrow && <Eyebrow>{form.eyebrow}</Eyebrow>}
              <h2 id="enquiry-h" className="mt-4 text-h2 text-navy-950">
                {form.heading}
              </h2>
              {form.body && (
                <p className="mt-5 max-w-[42rem] text-lead text-grey-700">
                  {form.email && form.body.includes(form.email) ? (
                    <>
                      {form.body.slice(0, form.body.indexOf(form.email))}
                      <a href={`mailto:${form.email}`} className="font-semibold text-brand-600 underline-offset-4 hover:underline">
                        {form.email}
                      </a>
                      {form.body.slice(form.body.indexOf(form.email) + form.email.length)}
                    </>
                  ) : (
                    form.body
                  )}
                </p>
              )}
            </div>
            <div className="mt-10" data-reveal>
              <ContactForm />
            </div>
          </div>

          <aside aria-label="Other ways to reach us" className="col-span-4 md:col-span-8 lg:col-span-4 lg:col-start-9">
            <div className="grid gap-4 sm:grid-cols-2 lg:sticky lg:top-[calc(var(--header-h)+2rem)] lg:grid-cols-1">
              {b?.support && (
                <div className="rounded-card bg-navy-950 p-7 text-white" data-spotlight data-reveal>
                  <Icon name="mail" size={28} strokeWidth={1.5} className="text-sky-400" />
                  <h3 className="mt-6 text-h4">{b.support.heading}</h3>
                  {b.support.body && <p className="mt-2 text-on-navy-muted">{b.support.body}</p>}
                  <a href={`mailto:${b.support.email}`} className="relative z-[2] mt-5 inline-flex min-h-11 items-center font-semibold text-white [overflow-wrap:anywhere] hover:text-sky-300">
                    <span className="link-underline">{b.support.email}</span>
                  </a>
                </div>
              )}
              {b?.phone && (
                <div className="rounded-card border border-grey-200 bg-mist p-7" data-reveal>
                  <Icon name="phone" size={28} strokeWidth={1.5} className="text-brand-600" />
                  <h3 className="mt-6 text-h4 font-bold text-navy-950">{b.phone.heading}</h3>
                  {b.phone.body && (
                    <p className="mt-2 inline-flex items-center gap-2 text-grey-700">
                      <Icon name="clock" size={16} className="shrink-0 text-grey-600" />
                      {b.phone.body}
                    </p>
                  )}
                  <a href={b.phone.href ?? telHref(b.phone.number)} className="mt-5 flex min-h-11 items-center font-display text-h4 font-bold text-navy-950 hover:text-brand-600">
                    {b.phone.number}
                  </a>
                </div>
              )}
              <div className="sm:col-span-2 lg:col-span-1" data-reveal>
                <ArrowLink href="#presence-heading">See our offices</ArrowLink>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <GlobalPresence
        block={{ eyebrow: b?.presence?.eyebrow ?? "Our Presence", heading: b?.presence?.heading ?? "Our offices", body: b?.presence?.body ?? null, ctaLabel: null, ctaHref: null, extra: null }}
        offices={offices}
        featuredSlug={null}
      />
    </RevealScope>
  );
}
