"use client";

import { useEffect } from "react";

/**
 * Lenis smooth scrolling (brief section 3), driven by GSAP's ticker so ScrollTrigger stays in sync. Skipped with
 * reduced motion, on touch devices (native scrolling is better there) and when JavaScript is off (nothing runs).
 * The modules are fetched once the browser is idle (or on the first wheel), so they never sit in the
 * time-to-interactive window.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    let cancelled = false;
    let started = false;
    let stop: (() => void) | undefined;
    const start = () => {
      if (started || cancelled) return;
      started = true;
      window.removeEventListener("wheel", start);
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
    };
    window.addEventListener("wheel", start, { passive: true });
    const hasIdle = typeof window.requestIdleCallback === "function";
    const idle = hasIdle ? window.requestIdleCallback(start, { timeout: 4000 }) : window.setTimeout(start, 3000);
    return () => {
      cancelled = true;
      window.removeEventListener("wheel", start);
      if (hasIdle) window.cancelIdleCallback(idle);
      else window.clearTimeout(idle);
      stop?.();
    };
  }, []);
  return null;
}
