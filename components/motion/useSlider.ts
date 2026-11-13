"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useHydrated } from "@/lib/use-client-snapshot";

/**
 * Scroll-snap slider state: a horizontal track of equal items. The index follows the scroll position, so the track
 * also works by swipe, keyboard scrolling or without JavaScript (it is a plain overflow-x container).
 *
 * `loop`: the Figma sliders (Top Stories, Frame 50) rest with the previous card peeking in on the left and the next on
 * the right. The caller renders a copy of the last item before the list and a copy of the first after it once
 * `loopReady` is true (clones are not server-rendered, so a no-JavaScript visitor sees the real order); the hook
 * starts the track on the first real item and, whenever a smooth scroll settles on a copy, jumps instantly to the
 * matching real item so the loop is seamless.
 */
export function useSlider<T extends HTMLElement = HTMLDivElement>(count: number, options: { loop?: boolean } = {}) {
  const loop = !!options.loop;
  const trackRef = useRef<T>(null);
  const [index, setIndex] = useState(0);
  const hydrated = useHydrated();
  const loopReady = loop && hydrated;
  const offset = loopReady ? 1 : 0;

  const itemWidth = useCallback(() => {
    const track = trackRef.current;
    const first = track?.firstElementChild as HTMLElement | null;
    if (!track || !first) return 0;
    const gap = parseFloat(getComputedStyle(track).columnGap || "0") || 0;
    return first.getBoundingClientRect().width + gap;
  }, []);

  // Once the copies are in the DOM, start on the first real item (no animation).
  useLayoutEffect(() => {
    const track = trackRef.current;
    if (!loopReady || !track) return;
    track.scrollLeft = itemWidth();
  }, [loopReady, itemWidth]);

  const goTo = useCallback(
    (i: number) => {
      const track = trackRef.current;
      if (!track) return;
      const n = offset ? Math.max(-1, Math.min(count, i)) : Math.max(0, Math.min(count - 1, i));
      track.scrollTo({ left: (n + offset) * itemWidth(), behavior: "smooth" });
      setIndex((n + count) % count);
    },
    [count, itemWidth, offset],
  );

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const w = itemWidth();
        if (w <= 0) return;
        const raw = Math.round(track.scrollLeft / w);
        if (offset) {
          // Settled on a copy: swap to the real item at the same visual position.
          if (Math.abs(track.scrollLeft) < 2) track.scrollLeft = count * w;
          else if (Math.abs(track.scrollLeft - (count + 1) * w) < 2) track.scrollLeft = w;
          setIndex(((raw - 1) % count + count) % count);
        } else {
          setIndex(Math.max(0, Math.min(count - 1, raw)));
        }
      });
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      track.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [count, itemWidth, offset]);

  const prev = () => goTo(index - 1);
  const next = () => goTo(index + 1);
  return {
    trackRef,
    index,
    loopReady,
    goTo,
    prev,
    next,
    wrapPrev: offset ? prev : () => goTo(index === 0 ? count - 1 : index - 1),
    wrapNext: offset ? next : () => goTo(index === count - 1 ? 0 : index + 1),
  };
}
