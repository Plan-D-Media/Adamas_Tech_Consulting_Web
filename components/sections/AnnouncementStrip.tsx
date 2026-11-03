"use client";

import Link from "next/link";
import { useLayoutEffect, useRef, useState } from "react";
import type { AnnouncementData } from "@/lib/data/home";
import { copy } from "@/lib/placeholder";
import { cx } from "@/lib/cx";
import { Icon } from "@/components/ui/Icon";
import { usePrefersReducedMotion } from "@/components/motion/useReducedMotion";

const SPEED = 48; // px per second: slow enough to read

/**
 * Hero announcement strip: a slim glass bar with a seamless right-to-left marquee.
 * - The list repeats so a single half always overfills the bar, then the whole run is doubled for the loop.
 *   Only the first set is exposed to assistive tech and the tab order; the copies are aria-hidden.
 * - Pauses on hover and keyboard focus (CSS) and with the pause button.
 * - Reduced motion: a static row that scrolls sideways and can be tabbed through.
 */
export function AnnouncementStrip({ items }: { items: AnnouncementData[] }) {
  const reduced = usePrefersReducedMotion();
  const [paused, setPaused] = useState(false);
  const track = useRef<HTMLUListElement>(null);

  // Duration from the measured width keeps the reading speed constant whatever the content.
  useLayoutEffect(() => {
    const el = track.current;
    if (!el || reduced) return;
    const set = () => el.style.setProperty("--ticker-duration", `${Math.max(20, el.scrollWidth / 2 / SPEED)}s`);
    set();
    const ro = new ResizeObserver(set);
    ro.observe(el);
    return () => ro.disconnect();
  }, [reduced, items]);

  if (!items.length) return null;

  const repeat = Math.max(1, Math.ceil(4 / items.length));
  const half = Array.from({ length: repeat }, () => items).flat();
  const run = reduced ? items : [...half, ...half];

  return (
    <div
      className="ticker flex h-12 items-center overflow-hidden rounded-btn bg-navy-950/45 text-white ring-1 ring-white/15 backdrop-blur-md"
      data-paused={paused || undefined}
    >
      <p className="sr-only">Announcements</p>
      <div className={cx("relative h-full min-w-0 flex-1", !reduced && "[mask-image:linear-gradient(90deg,transparent,#000_4%,#000_92%,transparent)]")}>
        <ul ref={track} className={cx("flex h-full w-max items-center", reduced ? "overflow-x-auto" : "ticker-track")}>
          {run.map((a, i) => {
            const clone = i >= items.length;
            const text = copy(a.text, "Announcement to be confirmed");
            const inner = (
              <>
                <span className="rounded-[3px] bg-orange-500 px-2 py-0.5 text-[11px] font-bold leading-4 text-navy-950">{a.label}</span>
                <span className={cx("whitespace-nowrap text-sm font-medium", text.pending && "text-white/75")}>{text.text}</span>
                {a.href && <Icon name="arrowRight" size={16} className="shrink-0 text-sky-300 transition-transform duration-(--duration-base) group-hover/an:translate-x-0.5" />}
              </>
            );
            return (
              <li key={`${a.id}-${i}`} aria-hidden={clone || undefined} className="flex h-full items-center pl-5 pr-7 after:ml-7 after:h-4 after:w-px after:bg-white/20 after:content-['']">
                {a.href ? (
                  <Link href={a.href} tabIndex={clone ? -1 : undefined} className="group/an inline-flex items-center gap-3 rounded-sm hover:text-sky-300">
                    {inner}
                  </Link>
                ) : (
                  <span className="inline-flex items-center gap-3">{inner}</span>
                )}
              </li>
            );
          })}
        </ul>
      </div>
      {!reduced && (
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          className="mx-1.5 inline-flex size-9 shrink-0 items-center justify-center rounded-full text-white/80 transition-colors duration-(--duration-base) hover:bg-white/10 hover:text-white"
        >
          <Icon name={paused ? "play" : "pause"} size={14} />
          <span className="sr-only">{paused ? "Play announcements" : "Pause announcements"}</span>
        </button>
      )}
    </div>
  );
}
