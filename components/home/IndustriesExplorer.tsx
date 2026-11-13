"use client";

import Link from "next/link";
import { cx } from "@/lib/cx";
import { Icon, type IconName } from "@/components/ui/Icon";
import { useSlider } from "@/components/motion/useSlider";

export interface IndustryItem {
  slug: string;
  label: string;
  title: string;
  paragraphs: string[];
  pending: boolean;
  image: { url: string; alt: string } | null;
  phone: string | null;
}

interface Props {
  sideLabel: string;
  label: string;
  heading: string;
  body: string;
  cardCta: string;
  cardHref: string;
  items: IndustryItem[];
}

const GRADIENT_BORDER = "bg-[linear-gradient(135deg,#FFFFFF_24%,#DBE8FA_34%,#C6DAF7_39%,#ADCAF4_44%,#90B7F0_49%,#6EA1EB_54%,#4486E6_59%,#1266DF_64%,#3D82E5_66%,#639AEA_68%,#A3C3F3_72%,#D5E4F9_76%,#FFFFFF_80%)]";

export function IndustriesExplorer({ sideLabel, label, heading, body, cardCta, cardHref, items }: Props) {
  const { trackRef, index, goTo, prev, next } = useSlider(items.length);
  const iconFor = (slug: string): IconName => (`industry-${slug}` as IconName);
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[315px_minmax(0,1fr)] lg:gap-[33px]">
      {/* Side menu */}
      <nav aria-label="Industries" className={cx("min-w-0 rounded-[17px] p-px", GRADIENT_BORDER)} data-reveal>
        <div className="rounded-2xl bg-white p-6">
          <p className="font-heading text-[1rem] uppercase leading-[1.1] tracking-[0.19em] text-[#030712]">{sideLabel}</p>
          <ul className="scrollbar-none mt-8 flex gap-1 overflow-x-auto lg:flex-col lg:gap-0" role="list">
            {items.map((it, i) => {
              const active = i === index;
              return (
                <li key={it.slug} className="shrink-0">
                  <a
                    href={`#industry-${it.slug}`}
                    aria-current={active ? "true" : undefined}
                    onClick={(e) => {
                      e.preventDefault();
                      goTo(i);
                    }}
                    className={cx(
                      "flex min-h-[52px] items-center gap-3 rounded-[15px] py-3.5 pl-4 pr-4 font-body text-[1rem] leading-tight transition-colors duration-(--duration-fast)",
                      active ? "bg-blue-650 font-semibold text-white" : "text-[#3C3C3C] hover:bg-tint-100",
                    )}
                  >
                    <Icon name={iconFor(it.slug)} size={24} className="shrink-0" />
                    {it.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* Panel */}
      <div className={cx("min-w-0 rounded-[17px] p-px", GRADIENT_BORDER)} data-reveal>
        <div className="flex h-full min-w-0 flex-col overflow-hidden rounded-2xl bg-white p-6">
          <p className="font-ui text-[clamp(1.125rem,1rem+0.5vw,1.625rem)] leading-none text-[#4285F7]">{label}</p>
          <h2 id="industries-heading" className="mt-5 font-ui text-[clamp(2rem,1.4rem+2vw,4rem)] font-semibold leading-[1.09] tracking-[0.015em] text-[#030712]">
            {heading}
          </h2>
          {body && <p className="mt-1 max-w-[891px] font-body text-[clamp(1rem,0.95rem+0.25vw,1.25rem)] leading-[1.4] text-[#374151]">{body}</p>}

          <div ref={trackRef} className="scrollbar-none mt-10 flex snap-x snap-mandatory gap-3.5 overflow-x-auto lg:mt-[66px]" aria-label="Industry details">
            {items.map((it) => (
              <article key={it.slug} id={`industry-${it.slug}`} className={cx("w-[min(600px,100%)] shrink-0 snap-start rounded-[17px] p-px", GRADIENT_BORDER)}>
                <div className="relative flex h-full min-h-[298px] flex-col rounded-2xl bg-tint-25 p-5">
                  <h3 className="font-body text-[clamp(1.5rem,1.2rem+0.9vw,2.25rem)] font-semibold leading-[1.16] tracking-[0.03em] text-blue-650">{it.title}</h3>
                  <div className="mt-3 max-w-[300px] space-y-4 font-body text-[0.875rem] leading-[1.57] text-[#374151]">
                    {it.pending ? <p className="italic text-grey-500">Details to be confirmed</p> : it.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
                  </div>
                  <Link href={cardHref} className="mt-auto inline-flex h-10 w-fit items-center rounded-[13px] border border-blue-650 bg-blue-650/10 px-3 pt-px font-ui text-[1rem] font-medium text-blue-650 transition-colors duration-(--duration-fast) hover:bg-blue-650 hover:text-white">
                    {cardCta}
                    <span className="sr-only">: {it.title}</span>
                  </Link>
                  {it.image && (
                    <div className="pointer-events-none absolute right-5 top-[62px] hidden h-[213px] w-[266px] sm:block" aria-hidden="true">
                      <img src={it.image.url} alt="" width={206} height={140} className="absolute left-[60px] top-[54px] h-[140px] w-[206px] rounded-lg object-cover shadow-[0_10px_40px_rgb(0_0_0/0.16)]" loading="lazy" decoding="async" />
                      {it.phone && <img src={it.phone} alt="" width={50} height={105} className="absolute left-[35px] top-[102px] h-[105px] w-[50px] rounded-lg object-cover shadow-[0_5px_20px_rgb(0_0_0/0.2)]" loading="lazy" decoding="async" />}
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>

          <div className="mt-9 flex items-center gap-5">
            <div className="relative h-px flex-1 bg-[#C8CDDD]/30" aria-hidden="true">
              <span className="absolute top-[-1px] h-[3px] w-[67px] bg-[linear-gradient(90deg,#1266DF_0%,#009AF3_29%,#6ABBF5_72%)] transition-[left] duration-(--duration-base) ease-(--ease-out)" style={{ left: `${(index / Math.max(1, items.length - 1)) * 100}%`, transform: `translateX(-${(index / Math.max(1, items.length - 1)) * 100}%)` }} />
            </div>
            <div className="flex items-center gap-5">
              <button type="button" onClick={prev} disabled={index === 0} className="inline-flex h-9 w-[50px] items-center justify-center rounded-md bg-tint-25 text-navy-900 disabled:opacity-40" aria-label="Previous industry">
                <Icon name="chevron-right" size={18} className="rotate-180" />
              </button>
              <button type="button" onClick={next} disabled={index === items.length - 1} className="inline-flex h-9 w-[50px] items-center justify-center rounded-md bg-tint-25 text-blue-650 disabled:opacity-40" aria-label="Next industry">
                <Icon name="chevron-right" size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
