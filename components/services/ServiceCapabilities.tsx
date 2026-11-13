"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { cx } from "@/lib/cx";
import { Icon } from "@/components/ui/Icon";
import { ServiceSectionHead } from "@/components/services/ServiceSectionHead";

export interface CapabilityItem {
  slug: string;
  name: string;
  summary: string | null;
  bullets: string[];
  href: string;
}

interface Props {
  eyebrow?: string | null;
  heading: string;
  body?: string | null;
  prefix: string;
  ctaLabel: string;
  ctaHref: string;
  items: CapabilityItem[];
  /** "Explore <name>" link under the button (the sub-service page). Off on sub-service pages. */
  explore?: boolean;
}

/**
 * "Services & capabilities" (Figma Container 298:28302): the head in a 576px column; on the right a 670px list of
 * frosted tab rows (number, 18px name, chevron; the active one white at 94% with a 3px blue inset) and the panel
 * (icon box, "ADAMAS CLOUD / 01", 28px title, 18px line, three bullet rows, a primary button). ARIA tabs with arrow
 * keys; every panel renders for no-JavaScript visitors.
 */
export function ServiceCapabilities({ eyebrow, heading, body, prefix, ctaLabel, ctaHref, items, explore = true }: Props) {
  const [active, setActive] = useState(0);
  const uid = useId();
  const onKey = (e: React.KeyboardEvent, i: number) => {
    const n = items.length;
    let next: number | null = null;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") next = (i + 1) % n;
    if (e.key === "ArrowUp" || e.key === "ArrowLeft") next = (i - 1 + n) % n;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = n - 1;
    if (next === null) return;
    e.preventDefault();
    setActive(next);
    document.getElementById(`${uid}-tab-${next}`)?.focus();
  };

  const panel = (it: CapabilityItem, i: number) => (
    <div className="rounded-[9px] bg-white/74 p-6 shadow-[0_14px_35px_rgb(58_74_110/0.08)] ring-1 ring-white/95 lg:p-[30px]">
      <span className="inline-flex h-[52px] w-[52px] items-center justify-center rounded-xl bg-[#EAF3FF] text-blue-600" aria-hidden="true">
        <Icon name="arrow" size={22} />
      </span>
      <p className="mt-[25px] font-heading text-[1.125rem] font-extrabold uppercase leading-[0.88] tracking-[0.08em] text-blue-600">
        {prefix} / {String(i + 1).padStart(2, "0")}
      </p>
      <h3 className="mt-[15px] font-heading text-[clamp(1.5rem,1.3rem+0.5vw,1.75rem)] leading-[1.5] tracking-[-0.03em] text-navy-850">{it.name}</h3>
      {it.summary && <p className="mt-[17px] font-heading text-[1.125rem] leading-[1.36] text-grey-550">{it.summary}</p>}
      {it.bullets.length > 0 && (
        <ul className="mt-6" role="list">
          {it.bullets.map((b) => (
            <li key={b} className="flex items-center gap-3 border-b border-[#DCE3EA] py-[13px] font-heading text-[1.125rem] leading-none text-navy-850">
              <span className="h-1.5 w-1.5 shrink-0 rounded-[3px] ring-2 ring-inset ring-blue-600" aria-hidden="true" />
              {b}
            </li>
          ))}
        </ul>
      )}
      <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
        <Link href={ctaHref} className="inline-flex h-11 items-center gap-6 rounded-lg bg-blue-600 px-[18px] font-heading text-[1.125rem] font-bold text-white transition-colors duration-(--duration-fast) hover:bg-blue-500">
          {ctaLabel}
          <Icon name="arrow" size={18} />
        </Link>
        {explore && (
          <Link href={it.href} className="inline-flex items-center gap-2 font-heading text-[1rem] font-bold text-blue-600 hover:text-blue-500">
            Explore {it.name}
            <Icon name="arrow" size={16} />
          </Link>
        )}
      </div>
    </div>
  );

  return (
    <section id="capabilities" data-compare="capabilities" aria-labelledby="service-capabilities-heading" className="bg-grey-50 py-14 lg:py-[109px]">
      <div className="container-site grid gap-10 lg:grid-cols-[576px_minmax(0,1fr)] lg:gap-16" data-tabs>
        <ServiceSectionHead id="service-capabilities-heading" eyebrow={eyebrow} heading={heading} body={body} headingClassName="max-w-[531px]" bodyClassName="mt-[22px] max-w-[532px]" />
        <div>
          <div role="tablist" aria-label="Services" aria-orientation="vertical" className="grid gap-3">
            {items.map((it, i) => {
              const selected = i === active;
              return (
                <button
                  key={it.slug}
                  id={`${uid}-tab-${i}`}
                  role="tab"
                  type="button"
                  aria-selected={selected}
                  aria-controls={`${uid}-panel-${i}`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActive(i)}
                  onKeyDown={(e) => onKey(e, i)}
                  className={cx(
                    "grid h-[76px] w-full grid-cols-[36px_minmax(0,1fr)_17px] items-center rounded-lg px-[22px] text-left ring-1 ring-white/92 transition-colors duration-(--duration-fast)",
                    selected ? "bg-white/94 shadow-[inset_3px_0_0_#1167D8,0_12px_30px_rgb(58_74_110/0.10)]" : "bg-white/64 shadow-[0_8px_24px_rgb(58_74_110/0.05)] hover:bg-white/80",
                  )}
                >
                  <span className="font-heading text-[0.5625rem] font-semibold leading-[1.5] text-grey-550" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className={cx("truncate font-heading text-[1.125rem] font-semibold leading-[1.08]", selected ? "text-navy-850" : "text-[#667384]")}>{it.name}</span>
                  <Icon name="chevron-right" size={17} className={selected ? "text-navy-850" : "text-[#667384]"} />
                </button>
              );
            })}
          </div>
          <div className="relative mt-3">
            {items.map((it, i) =>
              i === active ? (
                <div key={it.slug} id={`${uid}-panel-${i}`} role="tabpanel" aria-labelledby={`${uid}-tab-${i}`} data-active className="anim-fade-up">
                  {panel(it, i)}
                </div>
              ) : null,
            )}
            {items.map((it, i) =>
              i === active ? null : (
                <div key={it.slug} id={`${uid}-panel-${i}`} role="tabpanel" aria-labelledby={`${uid}-tab-${i}`} data-nojs-panel className="mt-3">
                  {panel(it, i)}
                </div>
              ),
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
