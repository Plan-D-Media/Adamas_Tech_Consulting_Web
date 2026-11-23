"use client";

import { useEffect, useState } from "react";
import { Img } from "@/components/media/Img";
import type { CloudClientLogo } from "@/lib/cloud-services-content";

/**
 * The clientele strip on /services/cloud-services: a seamless right-to-left auto-scroll that pauses on hover or
 * focus, with a visible pause/play button (the homepage partner strip has the same control).
 *
 * The animation is **opt-in after hydration**, which is what makes the three required fallbacks fall out for free:
 *
 * - **Without JavaScript** the server HTML is a static, centred, wrapping row and there is no pause button to
 *   press, because `animate` can never become true.
 * - **With `prefers-reduced-motion: reduce`** the same static row is kept: the media query is read here rather
 *   than left to CSS so the duplicated set is not rendered at all, which keeps every logo in the accessibility
 *   tree exactly once. A `change` listener means switching the setting mid-visit is honoured.
 * - **Otherwise** the set is rendered twice - the copy `aria-hidden` and `inert` - and the track is translated by
 *   -50%, so the loop point is invisible.
 *
 * Only `transform`, `opacity` and `filter` are animated, so nothing reflows. The `filter` half of the hover is
 * written even though the files the client supplied are already desaturated: it costs nothing and starts working
 * the moment colour originals arrive.
 */
export function ClientMarquee({ items }: { items: readonly CloudClientLogo[] }) {
  const [animate, setAnimate] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setAnimate(!mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  // One full set every 36s, within the 30-40s the brief asks for, nudged by the number of logos so a longer list
  // does not crawl.
  const duration = Math.round(Math.min(40, Math.max(30, items.length * 2.6)));
  const sets = animate ? [0, 1] : [0];

  return (
    <div className="relative" data-paused={paused || undefined}>
      {animate && (
        <div className="container-cloud mb-3 flex justify-end">
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            aria-pressed={paused}
            aria-label={paused ? "Play the client logos" : "Pause the client logos"}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#DCE4F0] bg-white text-[#0B1B33] transition-colors hover:bg-[#EEF3FB]"
          >
            {paused ? (
              <svg viewBox="0 0 14 14" width="12" height="12" aria-hidden="true">
                <path d="M4 2.5l7 4.5-7 4.5z" fill="currentColor" />
              </svg>
            ) : (
              <svg viewBox="0 0 14 14" width="12" height="12" aria-hidden="true">
                <path d="M4 3h2v8H4zM8 3h2v8H8z" fill="currentColor" />
              </svg>
            )}
          </button>
        </div>
      )}

      <div className="logo-marquee-viewport overflow-hidden px-(--gutter)">
        <ul
          className="logo-marquee"
          data-animate={animate || undefined}
          style={{ "--marquee-duration": `${duration}s` } as React.CSSProperties}
          role="list"
        >
          {sets.map((set) =>
            items.map((l) => (
              <li
                key={`${set}-${l.name}`}
                className="shrink-0"
                {...(set > 0 ? { "aria-hidden": true, inert: true } : {})}
              >
                <Img
                  src={l.image}
                  alt={set > 0 ? "" : l.name}
                  width={l.width}
                  height={32}
                  sizes={`${l.width}px`}
                  className="logo-marquee-item h-8 w-auto object-contain"
                />
              </li>
            )),
          )}
        </ul>
      </div>
    </div>
  );
}
