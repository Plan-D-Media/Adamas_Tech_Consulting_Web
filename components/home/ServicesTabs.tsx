"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { cx } from "@/lib/cx";
import { Icon } from "@/components/ui/Icon";
import { Img } from "@/components/media/Img";

export interface PillarTab {
  slug: string;
  name: string;
  tagline: string | null;
  summary: string | null;
  image: { url: string; alt: string } | null;
  index: number;
  href: string;
  services: { name: string; href: string }[];
}

/**
 * Pillar tabs (Figma 247:4860 / 4861 and the panel 247:4997): ARIA tabs with arrow-key navigation; the panel fades
 * in (CSS, 240ms, none with reduced motion). Without JavaScript every panel is shown, one under the other.
 */
export function ServicesTabs({ pillars }: { pillars: PillarTab[] }) {
  const [active, setActive] = useState(0);
  const uid = useId();
  const onKey = (e: React.KeyboardEvent, i: number) => {
    const n = pillars.length;
    let next: number | null = null;
    if (e.key === "ArrowRight") next = (i + 1) % n;
    if (e.key === "ArrowLeft") next = (i - 1 + n) % n;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = n - 1;
    if (next === null) return;
    e.preventDefault();
    setActive(next);
    document.getElementById(`${uid}-tab-${next}`)?.focus();
  };

  return (
    <div className="mt-9 lg:mt-[37px]" data-tabs>
      <div role="tablist" aria-label="Service pillars" className="scrollbar-none flex max-w-[1215px] overflow-x-auto border-b-2 border-blue-600">
        {pillars.map((p, i) => {
          const selected = i === active;
          return (
            <button
              key={p.slug}
              id={`${uid}-tab-${i}`}
              role="tab"
              type="button"
              aria-selected={selected}
              aria-controls={`${uid}-panel-${i}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(i)}
              onKeyDown={(e) => onKey(e, i)}
              className={cx(
                "shrink-0 whitespace-nowrap rounded-t-[14px] px-6 py-4 text-center font-heading text-[clamp(1.125rem,1rem+0.5vw,1.625rem)] transition-colors duration-(--duration-fast) lg:h-[77px] lg:flex-1 lg:px-6",
                selected ? "bg-blue-600 font-bold text-tint-50" : "font-medium text-navy-800 hover:text-blue-600",
              )}
            >
              {p.name}
            </button>
          );
        })}
      </div>

      <div className="relative mt-10 lg:mt-[44px]">
        {pillars.map((p, i) =>
          i === active ? (
            <div key={p.slug} id={`${uid}-panel-${i}`} role="tabpanel" aria-labelledby={`${uid}-tab-${i}`} data-active className="anim-fade-up">
              <Panel p={p} />
            </div>
          ) : null,
        )}
        {/* Rendered for no-JavaScript visitors only: hidden once scripts run (globals.css). */}
        {pillars.map((p, i) =>
          i === active ? null : (
            <div key={p.slug} id={`${uid}-panel-${i}`} role="tabpanel" aria-labelledby={`${uid}-tab-${i}`} data-nojs-panel className="mt-12">
              <Panel p={p} />
            </div>
          ),
        )}
      </div>
    </div>
  );
}

function Panel({ p }: { p: PillarTab }) {
  return (
    <div className="grid gap-8 lg:grid-cols-[44%_minmax(0,1fr)] lg:gap-[31px] xl:grid-cols-[551px_minmax(0,1fr)]">
      <div className="relative min-h-[20rem] overflow-hidden rounded-[20px] bg-navy-900 lg:min-h-[30rem] xl:h-[556px]">
        {p.image && <Img src={p.image.url} alt={p.image.alt} fill sizes="(min-width: 1280px) 551px, (min-width: 1024px) 44vw, 100vw" className="object-cover" />}
        <div className="absolute inset-0 bg-[linear-gradient(0deg,rgb(6_21_47/0.95)_12%,rgb(7_27_55/0)_100%)]" aria-hidden="true" />
        <span className="absolute right-[50px] top-[17px] font-heading text-[0.9375rem] font-semibold leading-none tracking-[0.09em] text-white" aria-hidden="true">
          {String(p.index).padStart(2, "0")}
        </span>
        {p.tagline && <p className="absolute bottom-[41px] left-[25px] right-6 font-ui text-[clamp(1.125rem,1rem+0.4vw,1.375rem)] font-semibold leading-[1.38] text-white">{p.tagline}</p>}
      </div>
      <div className="lg:pt-8">
        {/* Figma sets each paragraph box 14px taller than its text; the blank-line split keeps that rhythm when there are several. */}
        {p.summary &&
          p.summary
            .split(/\n\s*\n/)
            .filter(Boolean)
            .map((para, i) => (
              <p key={i} className="max-w-[42rem] font-body text-[clamp(1rem,0.95rem+0.25vw,1.25rem)] leading-[1.6] text-navy-800 [&+p]:mt-[14px]">
                {para}
              </p>
            ))}
        {p.services.length > 0 && (
          <ul className="mt-[38px] grid gap-x-8 sm:grid-cols-2 xl:gap-x-[70px] min-[1440px]:max-w-[661px] min-[1440px]:grid-cols-[294px_297px]" role="list">
            {p.services.map((s) => (
              <li key={s.href} className="border-b border-navy-700/[0.18]">
                <Link href={s.href} className="flex min-h-14 items-center justify-between gap-4 py-3.5 font-body text-[1.0625rem] font-semibold leading-[1.65] text-navy-800 transition-colors duration-(--duration-fast) hover:text-blue-600">
                  {s.name}
                  <Icon name="arrow" size={18} className="shrink-0 text-blue-600" />
                </Link>
              </li>
            ))}
          </ul>
        )}
        <Link href={p.href} className="mt-8 inline-flex h-[51px] items-center gap-2 rounded-md border border-blue-600 px-[15px] font-body text-[1.0625rem] font-semibold text-blue-600 transition-colors duration-(--duration-fast) hover:bg-blue-600 hover:text-white">
          Explore {p.name}
          <Icon name="arrow" size={18} />
        </Link>
      </div>
    </div>
  );
}
