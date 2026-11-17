import Link from "next/link";
import { cx } from "@/lib/cx";
import type { StatData } from "@/lib/data/home";
import { Icon } from "@/components/ui/Icon";
import { Eyebrow, Heading2 } from "@/components/ui/SectionHeader";

interface Props {
  eyebrow: string | null;
  heading: string | null;
  paragraphs: string[];
  /** The verified "years of experience" stat, shown as the large figure. Nothing is drawn when none is verified. */
  figure: StatData | null;
  ctaLabel?: string | null;
  ctaHref?: string | null;
  /** Review-only: the copy withheld for an unconfirmed figure, with the reason. Drafts preview only. */
  held: { text: string; reason: string }[];
  pendingLabel?: string | null;
}

/**
 * "Our Company" (Figma 274:1617, band y 588-1094): the section header centred, then the large experience figure on
 * the left and the company paragraphs on the right.
 *
 * The design sets the figure as "12 Years' Experience In It". The number is not ours to invent: it is drawn from the
 * Stat table and only when that row is verified, so the column simply collapses while the client has not confirmed
 * one (docs/qa/evidence/phase2/client-content-request.md).
 */
export function AboutCompany({ eyebrow, heading, paragraphs, figure, ctaLabel, ctaHref, held, pendingLabel }: Props) {
  if (paragraphs.length === 0 && !heading) return null;
  return (
    <section data-compare="about-company" aria-labelledby="about-company-heading" className="bg-white py-14 lg:py-[88px]">
      <div className="container-site">
        <div className="mx-auto max-w-[760px] text-center" data-reveal>
          {eyebrow && <Eyebrow className="!text-[1.25rem] !tracking-normal">{eyebrow}</Eyebrow>}
          {heading && <Heading2 id="about-company-heading" className="mt-3">{heading}</Heading2>}
        </div>
        <div
          className={cx(
            "mt-10 grid gap-10 lg:mt-[62px] lg:gap-[90px]",
            // Without a verified figure there is one column, centred on the same measure as the header, rather
            // than a text column pushed to the left of an empty one.
            figure ? "lg:grid-cols-[minmax(0,460px)_minmax(0,1fr)]" : "mx-auto max-w-[820px]",
          )}
        >
          {figure && (
            <div className="flex items-start gap-4" data-reveal>
              <span className="font-heading text-[clamp(5rem,3rem+9vw,13.75rem)] font-bold leading-[0.82] tracking-[-0.04em] text-blue-600">
                {figure.prefix}
                {figure.value}
                {figure.suffix}
              </span>
              <span className="mt-2 max-w-[120px] font-heading text-[1.25rem] leading-[1.45] text-grey-600">{figure.label}</span>
            </div>
          )}
          <div className="max-w-[640px]" data-reveal>
            {paragraphs.map((p) => (
              <p key={p.slice(0, 40)} className="mb-5 font-body text-[1.125rem] leading-[1.6] text-grey-700 last:mb-0">
                {p}
              </p>
            ))}
            {pendingLabel && (
              <p className="mt-4 rounded-sm bg-orange-500/10 px-3 py-2 font-body text-[0.875rem] text-[#9A5208]">
                Draft: {pendingLabel}
              </p>
            )}
            {held.length > 0 && (
              <ul className="mt-3 grid gap-2" role="list">
                {held.map((h) => (
                  <li key={h.text.slice(0, 30)} className="rounded-sm bg-grey-50 px-3 py-2 font-body text-[0.8125rem] leading-[1.5] text-grey-600">
                    <span className="block text-grey-700">{h.text}</span>
                    <span className="mt-1 block text-[#9A5208]">Held: {h.reason}</span>
                  </li>
                ))}
              </ul>
            )}
            {ctaLabel && ctaHref && (
              <Link href={ctaHref} className="mt-7 inline-flex items-center gap-3 font-heading text-[0.9375rem] font-bold text-navy-850 hover:text-blue-600">
                {ctaLabel}
                <Icon name="arrow" size={17} />
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
