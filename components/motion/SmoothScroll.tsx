"use client";

import { useEffect } from "react";

/**
 * Lenis smooth scrolling (brief section 3), driven by GSAP's ticker so ScrollTrigger stays in sync. Skipped with
 * reduced motion, on touch devices (native scrolling is better there) and when JavaScript is off (nothing runs).
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    let cancelled = false;
    let stop: (() => void) | undefined;
    Promise.all([import("lenis"), import("gsap"), import("gsap/ScrollTrigger")]).then(([{ default: Lenis }, { gsap }, { ScrollTrigger }]) => {
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);
      const lenis = new Lenis({ lerp: 0.12, wheelMultiplier: 1, anchors: true });
      lenis.on("scroll", ScrollTrigger.update);
      const tick = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      stop = () => {
        gsap.ticker.remove(tick);
        lenis.destroy();
      };
    });
    return () => {
      cancelled = true;
      stop?.();
    };
  }, []);
  return null;
}
