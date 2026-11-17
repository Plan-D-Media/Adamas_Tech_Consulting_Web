"use client";

import Link from "next/link";
import type { CaseCardData } from "@/lib/data/home";
import { plain } from "@/lib/placeholder";
import { Icon } from "@/components/ui/Icon";
import { Img } from "@/components/media/Img";
import { useSlider } from "@/components/motion/useSlider";
import { ServiceSectionHead } from "@/components/services/ServiceSectionHead";

interface Props {
  eyebrow?: string | null;
  heading: string;
  body?: string | null;
  note?: string | null;
  ctaLabel?: string | null;
  ctaHref?: string | null;
  items: CaseCardData[];
}

/**
 * Case studies (Figma Container 299:28463): head with prev/next circles, three 428x392 frosted cards (photo with a
 * numbered badge, caps label, 20px title, "Explore" link) and a bordered footer row. The track scroll-snaps when
 * there are more than three stories; the real case studies replace the design's "concept showcases".
 */
export function ServiceCases({ eyebrow, heading, body, note, ctaLabel, ctaHref, items }: Props) {
  const { trackRef, index, prev, next } = useSlider<HTMLUListElement>(Math.max(1, items.length - 2));
  const pages = Math.max(1, items.length - 2);
  const circle = "inline-flex h-12 w-12 items-center justify-center rounded-full bg-white text-navy-850 ring-1 ring-[#B9C4CF] transition-colors duration-(--duration-fast) hover:bg-tint-50 disabled:opacity-40";
  return (
    <section data-compare="cases" aria-labelledby="service-cases-heading" className="bg-white py-14 lg:py-[109px]">
      <div className="container-site">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <ServiceSectionHead id="service-cases-heading" eyebrow={eyebrow} heading={heading} body={body} className="lg:max-w-[700px]" bodyClassName="mt-[22px] text-[0.9375rem] leading-[1.8]" />
          {items.length > 3 && (
            <div className="flex shrink-0 items-center gap-[9px] lg:mb-[60px]" role="group" aria-label="Case studies controls">
              <button type="button" className={circle} onClick={prev} disabled={index === 0} aria-label="Previous case studies">
                <Icon name="arrow" size={18} className="rotate-180" />
              </button>
              <button type="button" className={circle} onClick={next} disabled={index >= pages - 1} aria-label="Next case studies">
                <Icon name="arrow" size={18} />
              </button>
            </div>
          )}
        </div>
        {/* The rail and the card link are positioned: the card's visually-hidden ": title" span is position:absolute, and
            without a positioned ancestor it was laid out against the viewport, outside the scroll container, widening
            the document by the hidden cards once GSAP cleared the reveal transform that had been containing it (QA BUG-007). */}
        <ul ref={trackRef} className="scrollbar-none relative mt-10 flex snap-x snap-mandatory gap-[18px] overflow-x-auto pb-2 lg:mt-[60px]" role="list" aria-label="Case studies">
          {items.map((c, i) => (
            <li key={c.slug} className="w-[min(428px,85vw)] shrink-0 snap-start" data-reveal>
              <Link href={`/case-studies/${c.slug}`} className="group relative flex h-full flex-col rounded-[9px] bg-white/68 p-[7px] pb-[22px] shadow-[0_10px_32px_rgb(58_74_110/0.07)] ring-1 ring-white/95 transition-shadow duration-(--duration-base) hover:shadow-[0_14px_40px_rgb(58_74_110/0.14)]">
                <div className="relative h-[250px] overflow-hidden rounded-md bg-navy-900">
                  {c.image && <Img src={c.image} fill sizes="412px" className="object-cover" />}
                  <span className="absolute left-[15px] top-[15px] inline-flex h-[37px] w-[37px] items-center justify-center rounded-full bg-navy-900/70 font-heading text-[0.5625rem] font-bold text-white backdrop-blur" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {c.draft && <span className="absolute right-3 top-3 rounded-xs bg-orange-500 px-1.5 py-0.5 font-body text-[0.625rem] font-bold uppercase tracking-wider text-navy-950">Draft</span>}
                </div>
                <p className="mt-5 px-[14px] font-heading text-[1rem] font-bold uppercase leading-[0.85] tracking-[0.08em] text-blue-600">{plain(c.label) || "Case study"}</p>
                <h3 className="mt-[9px] px-[14px] font-heading text-[1.25rem] font-bold leading-[1.5] text-navy-850">{plain(c.title)}</h3>
                <span className="mt-auto inline-flex items-center gap-3 px-[14px] pt-[14px] font-heading text-[1rem] font-bold leading-none text-blue-600 group-hover:text-blue-500">
                  Explore
                  <span className="sr-only">: {plain(c.title)}</span>
                  <Icon name="arrow" size={17} />
                </span>
              </Link>
            </li>
          ))}
        </ul>
        {(note || (ctaLabel && ctaHref)) && (
          <div className="mt-[45px] flex flex-wrap items-center justify-between gap-4 border-t border-[#DCE3EA] pt-[22px]">
            <p className="font-heading text-[1rem] leading-none text-grey-550">{note}</p>
            {ctaLabel && ctaHref && (
              <Link href={ctaHref} className="inline-flex items-center gap-3 font-heading text-[1rem] font-bold leading-none text-navy-850 hover:text-blue-600">
                {ctaLabel}
                <Icon name="arrow" size={17} />
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
