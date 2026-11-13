"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import type { RegionInfo } from "@/lib/data/site";
import { isRegionSlug, type RegionSlug } from "@/lib/region";
import { cx } from "@/lib/cx";
import { Icon } from "@/components/ui/Icon";
import { Flag } from "@/components/nav/Flag";
import { setRegionCookie } from "@/components/nav/regionClient";
import { useCurrentRegion } from "@/components/nav/useCurrentRegion";

interface Props {
  regions: RegionInfo[];
  region: RegionSlug | null;
  fallbackRegion: RegionSlug;
  /** "header": flag + label + chevron on the glass bar. "footer": bordered button with a globe, menu opens upwards. */
  variant?: "header" | "footer";
}

/**
 * Region switcher: swaps the homepage only (India, UK & Ireland, GCC) and sets the region cookie.
 * Built on <details> so it opens without JavaScript; with JavaScript it also closes on Esc, outside clicks and selection.
 * Options are <Link prefetch>, so switching is served from the static cache.
 */
export function RegionSwitcher({ regions, region, fallbackRegion, variant = "header" }: Props) {
  const current = useCurrentRegion(regions, region, fallbackRegion);
  const ref = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const close = () => el.removeAttribute("open");
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && el.open) {
        close();
        el.querySelector("summary")?.focus();
      }
    };
    const onPointer = (e: PointerEvent) => {
      if (el.open && !el.contains(e.target as Node)) close();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, []);

  const footer = variant === "footer";
  return (
    <details ref={ref} className={cx("region-switcher relative", footer ? "" : "shrink-0")}>
      <summary
        className={cx(
          "flex cursor-pointer select-none items-center gap-3 whitespace-nowrap font-ui transition-colors duration-(--duration-fast)",
          footer
            ? "h-11 rounded-xs border border-navy-700 px-3 text-[0.875rem] font-semibold text-white hover:border-grey-300"
            : "h-10 rounded-sm px-3 text-[0.875rem] text-black hover:bg-white/60",
        )}
        aria-label={`Region: ${current.label}. Change region`}
      >
        {footer ? <Icon name="globe" size={16} className="text-grey-300" /> : <Flag slug={current.slug} />}
        <span>{current.label}</span>
        <Icon name="chevron-down" size={11} className={cx("transition-transform duration-(--duration-fast)", footer ? "text-grey-300" : "text-blue-500")} />
      </summary>
      <ul className={cx("absolute right-0 z-20 min-w-52 rounded-lg bg-white p-2 shadow-lift ring-1 ring-grey-200", footer ? "bottom-full mb-2" : "top-full mt-2")} role="list">
        {regions.map((r) => (
          <li key={r.code}>
            <Link
              href={`/${r.slug}/`}
              prefetch={true}
              onClick={() => {
                if (isRegionSlug(r.slug)) setRegionCookie(r.slug);
                ref.current?.removeAttribute("open");
              }}
              aria-current={r.slug === current.slug ? "true" : undefined}
              className={cx("flex min-h-11 items-center gap-3 rounded-sm px-3 font-ui text-[0.9375rem] text-ink hover:bg-tint-100", r.slug === current.slug && "font-semibold text-blue-600")}
            >
              <Flag slug={r.slug} />
              {r.label}
            </Link>
          </li>
        ))}
      </ul>
    </details>
  );
}
