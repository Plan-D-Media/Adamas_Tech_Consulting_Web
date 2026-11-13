"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Scroll-snap slider state: a horizontal track of equal items. The index follows the scroll position, so the track
 * also works by swipe, keyboard scrolling or without JavaScript (it is a plain overflow-x container).
 */
export function useSlider(count: number) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  const itemWidth = useCallback(() => {
    const track = trackRef.current;
    const first = track?.firstElementChild as HTMLElement | null;
    if (!track || !first) return 0;
    const gap = parseFloat(getComputedStyle(track).columnGap || "0") || 0;
    return first.getBoundingClientRect().width + gap;
  }, []);

  const goTo = useCallback(
    (i: number) => {
      const track = trackRef.current;
      if (!track) return;
      const n = Math.max(0, Math.min(count - 1, i));
      track.scrollTo({ left: n * itemWidth(), behavior: "smooth" });
      setIndex(n);
    },
    [count, itemWidth],
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
        if (w > 0) setIndex(Math.max(0, Math.min(count - 1, Math.round(track.scrollLeft / w))));
      });
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      track.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [count, itemWidth]);

  return { trackRef, index, goTo, prev: () => goTo(index - 1), next: () => goTo(index + 1), wrapPrev: () => goTo(index === 0 ? count - 1 : index - 1), wrapNext: () => goTo(index === count - 1 ? 0 : index + 1) };
}
