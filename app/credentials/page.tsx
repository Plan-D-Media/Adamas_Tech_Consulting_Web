import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCertifications, getPage, type CertificationData } from "@/lib/data/pages";
import { PageHero } from "@/components/layout/PageHero";
import { ArrowLink, ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { DraftBadge, SectionHeader, TbcTag } from "@/components/ui/SectionHeader";
import { RevealScope } from "@/components/motion/RevealScope";
import { InnerCta } from "@/components/sections/InnerCta";
import { BadgeTile } from "@/components/company/BadgeTile";
import { heroIntro, pageMetadata } from "@/components/company/meta";

const PATH = "/credentials";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata(await getPage(PATH, "credentials"), PATH, "Credentials");
}

const dateFmt = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

/**
 * Certifications and partner programmes. Only verified rows carry evidence (number, validity, certificate);
 * everything else shows a designed "to be confirmed" state, so nothing is claimed beyond what is on record.
 */
export default async function CredentialsPage() {
  const [page, all] = await Promise.all([getPage(PATH, "credentials"), getCertifications()]);
  if (!page) notFound();
  const b = page.blocks;
  const pending = b?.pending ?? { certificate: "Certificate to be supplied", number: "To be confirmed", validity: "To be confirmed", tier: "Programme and tier to be confirmed" };
  const certs = all.filter((c) => c.kind === "certification");
  const partners = all.filter((c) => c.kind === "partner");

  return (
    <RevealScope>
      <PageHero
        crumbs={[{ label: "About Us", href: "/about" }, { label: "Credentials" }]}
        eyebrow={page.eyebrow}
        title={page.title}
        intro={heroIntro(page.intro)}
        art="award"
        artVariant={0}
        size="md"
        actions={
          <ButtonLink href="/contact" arrow>
            Talk to an expert
          </ButtonLink>
        }
        aside={
          certs.length > 0 ? (
            <div className="rounded-card bg-white/5 p-6 ring-1 ring-white/15 backdrop-blur-sm">
              <p className="eyebrow text-sky-300">{b?.certifications?.eyebrow ?? "Certifications"}</p>
              <ul className="mt-5 grid grid-cols-3 gap-3">
                {certs.map((c) => (
                  <li key={c.slug}>
                    <a href={`#${c.slug}`} className="block rounded-card transition-transform duration-(--duration-base) ease-(--ease-out-expo) hover:-translate-y-0.5">
                      <BadgeTile badge={c.badge} name={c.name} size="lg" className="!aspect-[4/3] !p-2.5 ring-0" />
                      <span className="mt-2 block text-center text-xs font-semibold leading-snug text-on-navy-muted">{c.standard ?? c.name}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : undefined
        }
      />

      {/* Certifications: one row each, evidence only when verified */}
      <section aria-labelledby="certs-h" className="section-y tone-white">
        <div className="container-site">
          <SectionHeader id="certs-h" eyebrow={b?.certifications?.eyebrow ?? "Certifications"} heading={b?.certifications?.heading ?? "Certifications"} intro={b?.certifications?.body} />
          {certs.length === 0 ? (
            <p className="mt-12 text-grey-700">Certification details are being confirmed.</p>
          ) : (
            <ul className="mt-12 grid gap-4 md:mt-16 lg:gap-6">
              {certs.map((c) => (
                <li key={c.slug} id={c.slug} className="scroll-mt-[calc(var(--header-h)+1.5rem)]" data-reveal>
                  <CertificationRow c={c} pending={pending} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* Partner programmes: tier and evidence still to be confirmed (drafts until then) */}
      {partners.length > 0 && (
        <section aria-labelledby="partners-h" className="section-y tone-mist">
          <div className="container-site">
            <SectionHeader
              id="partners-h"
              eyebrow={b?.partners?.eyebrow ?? "Partners"}
              heading={b?.partners?.heading ?? "Partner programmes"}
              intro={b?.partners?.body}
              action={<ArrowLink href="/services">Explore our services</ArrowLink>}
            />
            <ul className="mt-12 grid gap-4 sm:grid-cols-2 md:mt-16 lg:grid-cols-3 lg:gap-6">
              {partners.map((c) => (
                <li key={c.slug} data-reveal>
                  <article className="card-lift flex h-full flex-col rounded-card border border-grey-200 bg-white p-6 hover:border-brand-200 md:p-7">
                    <BadgeTile badge={c.badge} name={c.name} size="lg" className="!aspect-[16/9] bg-white" />
                    <h3 className="mt-6 text-h4 font-bold text-navy-950">{c.name}</h3>
                    {c.issuer && <p className="mt-1 text-small text-grey-600">{c.issuer}</p>}
                    <div className="mt-auto flex flex-wrap items-center gap-2 pt-6">
                      {c.verified ? (
                        <span className="inline-flex items-center gap-1.5 text-small font-semibold text-brand-700">
                          <Icon name="check" size={16} /> Confirmed
                        </span>
                      ) : (
                        <TbcTag>{pending.tier}</TbcTag>
                      )}
                      {c.draft && <DraftBadge />}
                    </div>
                  </article>
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

function CertificationRow({ c, pending }: { c: CertificationData; pending: { certificate: string; number: string; validity: string } }) {
  const facts: { label: string; value: string | null; tbc: string }[] = [
    { label: "Certificate number", value: c.certificateNumber, tbc: pending.number },
    { label: "Valid until", value: c.validUntil ? dateFmt.format(new Date(c.validUntil)) : null, tbc: pending.validity },
  ];
  return (
    <article aria-labelledby={`${c.slug}-h`} className="card-lift grid-12 items-center gap-y-6 rounded-card border border-grey-200 bg-white p-5 hover:border-brand-200 md:p-6 lg:p-8">
      <div className="col-span-4 md:col-span-3">
        <BadgeTile badge={c.badge} name={c.name} size="lg" className="!aspect-[16/10] bg-grey-25" />
      </div>
      <div className="col-span-4 md:col-span-5 lg:col-span-5">
        {c.standard && <p className="eyebrow text-brand-600">{c.standard}</p>}
        <h3 id={`${c.slug}-h`} className="mt-3 text-h3 text-navy-950">
          {c.name}
        </h3>
        {c.issuer && (
          <p className="mt-2 text-grey-700">
            <span className="text-grey-600">Issued by </span>
            <span className="font-semibold text-navy-950">{c.issuer}</span>
          </p>
        )}
        {c.description && <p className="mt-3 text-small text-grey-700">{c.description}</p>}
        {c.draft && <DraftBadge className="mt-3" />}
      </div>
      <div className="col-span-4 md:col-span-4 lg:col-start-9">
        <dl className="grid gap-4 rounded-card bg-grey-25 p-5 text-[0.9375rem] ring-1 ring-grey-100">
          {facts.map((f) => (
            <div key={f.label}>
              <dt className="text-small text-grey-600">{f.label}</dt>
              <dd className="mt-1">{f.value ? <span className="font-semibold text-navy-950">{f.value}</span> : <TbcTag>{f.tbc}</TbcTag>}</dd>
            </div>
          ))}
          <div>
            <dt className="text-small text-grey-600">Certificate</dt>
            <dd className="mt-1">
              {c.certificateUrl ? (
                <a href={c.certificateUrl} className="inline-flex items-center gap-2 font-semibold text-brand-600 hover:text-brand-700" download>
                  <Icon name="download" size={18} />
                  Download certificate (PDF)
                </a>
              ) : (
                <TbcTag>{pending.certificate}</TbcTag>
              )}
            </dd>
          </div>
        </dl>
      </div>
    </article>
  );
}
