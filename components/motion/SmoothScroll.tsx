"use client";

import { useEffect } from "react";
import { loadGsap, prefersReducedMotion } from "@/lib/gsap-client";

/**
 * Lenis smooth scrolling, driven by GSAP's ticker so ScrollTrigger stays in sync.
 * Off for reduced motion and on touch devices (native scrolling there is better).
 * Loaded after hydration, on idle, so it never competes with first paint or input.
 * Keyboard, find-in-page and anchor links keep working because Lenis scrolls the real document.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion() || window.matchMedia("(pointer: coarse)").matches) return;
    let cleanup: (() => void) | undefined;
    let cancelled = false;

    const start = async () => {
      const [{ gsap, ScrollTrigger }, { default: Lenis }] = await Promise.all([loadGsap(), import("lenis")]);
      if (cancelled) return;
      const lenis = new Lenis({ lerp: 0.12, wheelMultiplier: 1, anchors: { offset: -88 } });
      lenis.on("scroll", ScrollTrigger.update);
      const tick = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      document.documentElement.classList.add("lenis");
      cleanup = () => {
        gsap.ticker.remove(tick);
        lenis.destroy();
        document.documentElement.classList.remove("lenis");
      };
    };

    const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 300));
    const handle = idle(() => void start());

    return () => {
      cancelled = true;
      window.cancelIdleCallback?.(handle as number);
      cleanup?.();
    };
  }, []);

  return null;
}
