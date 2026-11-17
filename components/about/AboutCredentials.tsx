import Link from "next/link";
import type { CertificationData } from "@/lib/data/pages";
import { Img } from "@/components/media/Img";
import { Icon } from "@/components/ui/Icon";
import { Eyebrow, Heading2 } from "@/components/ui/SectionHeader";

interface Props {
  eyebrow: string | null;
  heading: string | null;
  body: string | null;
  items: CertificationData[];
  ctaLabel?: string | null;
  ctaHref?: string | null;
  /** /credentials shows the certificate details; the About page shows the badges only. */
  withDetail?: boolean;
  headingLevel?: "h2" | "h1";
}

/**
 * "Clients & Partners" (Figma 274:1617, band y 6440-6877), reused as the body of /credentials.
 *
 * The design carries "150+ Satisfied Clients. 1M+ ROI Increased" across this band. Those figures are not in the
 * Stat table as verified rows, so they are not rendered: the section shows the certifications and partner
 * programmes the client has evidenced, and the figures stay on the content request list.
 */
export function AboutCredentials({ eyebrow, heading, body, items, ctaLabel, ctaHref, withDetail = false, headingLevel = "h2" }: Props) {
  if (items.length === 0) return null;
  const certifications = items.filter((c) => c.kind === "certification");
  const partners = items.filter((c) => c.kind === "partner");
  const Head = headingLevel;
  const GroupHeading = headingLevel === "h1" ? "h2" : "h3";
  return (
    <section data-compare="about-credentials" aria-labelledby="about-credentials-heading" className="bg-tint-50 py-14 lg:py-[96px]">
      <div className="container-site">
        <div className="max-w-[760px]" data-reveal>
          {eyebrow && <Eyebrow className="!text-[1.25rem] !tracking-normal">{eyebrow}</Eyebrow>}
          {heading &&
            (Head === "h1" ? (
              <h1 id="about-credentials-heading" className="mt-3 font-heading text-[clamp(1.875rem,1.2rem+1.9vw,2.6875rem)] font-bold leading-[1.14] tracking-[-0.035em] text-navy-800">
                {heading}
              </h1>
            ) : (
              <Heading2 id="about-credentials-heading" className="mt-3">
                {heading}
              </Heading2>
            ))}
          {body && <p className="mt-4 font-body text-[1.125rem] leading-[1.6] text-grey-600">{body}</p>}
        </div>

        {[
          { label: "Certifications", rows: certifications },
          { label: "Partner programmes", rows: partners },
        ]
          .filter((g) => g.rows.length > 0)
          .map((g) => (
            <div key={g.label} className="mt-10 lg:mt-[48px]">
              {/* The group label sits one level under whatever heading this block was given, so /credentials
                  (h1) gets h2 and the About section (h2) gets h3: axe flags a skipped level otherwise. */}
              <GroupHeading className="font-heading text-[1.125rem] font-bold uppercase tracking-[0.08em] text-grey-500">{g.label}</GroupHeading>
              <ul className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" role="list">
                {g.rows.map((c) => (
                  <li key={c.slug} className="flex gap-5 rounded-lg bg-white p-6 ring-1 ring-grey-200" data-reveal>
                    {c.badge && (
                      <span className="relative block h-[62px] w-[62px] shrink-0">
                        <Img src={c.badge} alt={c.badge.alt || c.name} fill sizes="62px" className="object-contain" />
                      </span>
                    )}
                    <div className="min-w-0">
                      <p className="font-heading text-[1.125rem] font-bold leading-[1.25] text-navy-850">{c.name}</p>
                      {c.issuer && <p className="mt-1 font-body text-[0.875rem] text-grey-600">{c.issuer}</p>}
                      {c.description && <p className="mt-2 font-body text-[0.9375rem] leading-[1.55] text-grey-600">{c.description}</p>}
                      {withDetail && c.standard && <p className="mt-2 font-body text-[0.8125rem] text-grey-500">Standard: {c.standard}</p>}
                      {withDetail && c.certificateNumber && <p className="font-body text-[0.8125rem] text-grey-500">Certificate: {c.certificateNumber}</p>}
                      {withDetail && c.validUntil && <p className="font-body text-[0.8125rem] text-grey-500">Valid until: {c.validUntil}</p>}
                      {withDetail && c.certificateUrl && (
                        <a href={c.certificateUrl} rel="noopener noreferrer" target="_blank" className="mt-2 inline-flex min-h-6 items-center gap-2 font-body text-[0.875rem] text-blue-600 hover:underline">
                          View certificate
                          <span className="sr-only">(opens in a new tab)</span>
                        </a>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        {ctaLabel && ctaHref && (
          <Link href={ctaHref} className="mt-8 inline-flex items-center gap-3 font-heading text-[0.9375rem] font-bold text-navy-850 hover:text-blue-600">
            {ctaLabel}
            <Icon name="arrow" size={17} />
          </Link>
        )}
      </div>
    </section>
  );
}
