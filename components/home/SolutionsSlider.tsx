"use client";

import Link from "next/link";
import { cx } from "@/lib/cx";
import { Icon } from "@/components/ui/Icon";
import { ArrowLink } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SliderControls } from "@/components/ui/SliderControls";
import { useSlider } from "@/components/motion/useSlider";

export interface SolutionItem {
  slug: string;
  kind: string;
  name: string;
  namePending: boolean;
  tagline: string | null;
  taglinePending: boolean;
  href: string;
  external: boolean;
  image: { url: string; alt: string } | null;
  draft: boolean;
  modules: { name: string; href: string; external: boolean }[];
}

function Card({ s }: { s: SolutionItem }) {
  const Title = s.external ? "a" : Link;
  return (
    <article className="relative flex h-[523px] w-[min(424px,85vw)] shrink-0 snap-start flex-col overflow-hidden rounded-lg bg-navy-900 text-white" data-reveal>
      {s.image && <img src={s.image.url} alt={s.image.alt} width={424} height={523} className="absolute inset-0 h-full w-full object-cover" loading="lazy" decoding="async" />}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(0_0_0/0)_0%,rgb(0_0_0/0.25)_45%,rgb(0_0_0/0.92)_100%)]" aria-hidden="true" />
      <div className="relative p-5">
        <span className="inline-flex items-center rounded-pill bg-navy-900/55 px-3 py-1 font-body text-[0.75rem] font-semibold text-white ring-1 ring-white/20 backdrop-blur">
          {s.kind}
        </span>
        {s.draft && <span className="ml-2 rounded-xs bg-orange-500 px-1.5 py-0.5 font-body text-[0.625rem] font-bold uppercase tracking-wider text-navy-950">Draft</span>}
      </div>
      <div className="relative mt-auto px-7 pb-7">
        <h3 className="font-ui text-[2rem] font-bold leading-[1.16] tracking-[-0.015em]">
          <Title href={s.href} {...(s.external ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="after:absolute after:inset-0 after:content-['']">
            {s.name}
          </Title>
        </h3>
        {s.namePending && (
          <p className="mt-3 inline-flex items-center gap-1.5 rounded-pill bg-white/10 px-2.5 py-1 font-body text-[0.75rem] font-semibold leading-none text-sky-200 ring-1 ring-white/15">
            <span className="h-1.5 w-1.5 rounded-full bg-sky-200" aria-hidden="true" />
            Name to be confirmed
          </p>
        )}
        {s.tagline && !s.taglinePending ? (
          <p className="mt-3 font-ui text-[1.0625rem] leading-[1.65] text-grey-300">{s.tagline}</p>
        ) : (
          <p className="mt-3 font-ui text-[0.875rem] italic leading-[1.5] text-grey-300/80">Details to be confirmed</p>
        )}
        {s.modules.length > 0 && (
          <ul className="relative z-10 mt-3 flex flex-wrap gap-[7px]" role="list">
            {s.modules.map((m) => (
              <li key={m.href}>
                <a href={m.href} target={m.external ? "_blank" : undefined} rel={m.external ? "noopener noreferrer" : undefined} className="inline-flex items-center gap-1 rounded-pill border border-white/40 bg-white/10 px-3 py-1.5 font-body text-[0.875rem] font-semibold text-white hover:bg-white/20">
                  {m.name}
                  {m.external && <Icon name="external" size={10} />}
                </a>
              </li>
            ))}
          </ul>
        )}
        <p className="mt-6 inline-flex items-center gap-2 font-body text-[0.9375rem] font-semibold text-sky-400">
          {s.external ? "Visit site" : "Explore"}
          <Icon name={s.external ? "external" : "arrow"} size={s.external ? 12 : 18} />
        </p>
      </div>
    </article>
  );
}

interface Props {
  eyebrow: string;
  heading: string;
  body: string;
  ctaLabel: string;
  ctaHref: string;
  items: SolutionItem[];
}

export function SolutionsSlider({ eyebrow, heading, body, ctaLabel, ctaHref, items }: Props) {
  const { trackRef, index, prev, next } = useSlider(items.length);
  return (
    <>
      <SectionHeader
        id="solutions-heading"
        eyebrow={eyebrow}
        heading={heading}
        body={body}
        headingClassName="max-w-[45rem]"
        aside={
          <div className="flex flex-wrap items-center gap-6">
            <ArrowLink href={ctaHref} className="text-[1.0625rem] text-[#0070BC]">
              {ctaLabel}
            </ArrowLink>
            {items.length > 1 && <SliderControls variant="outline" index={index} total={items.length} onPrev={prev} onNext={next} label="solutions" />}
          </div>
        }
      />
      <div ref={trackRef} className={cx("scrollbar-none mt-10 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-2 lg:mt-[50px]")} aria-label="Products and solutions">
        {items.map((s) => (
          <Card key={s.slug} s={s} />
        ))}
      </div>
    </>
  );
}
