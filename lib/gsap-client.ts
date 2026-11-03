"use client";

import type { gsap as GSAP } from "gsap";
import type { ScrollTrigger as ST } from "gsap/ScrollTrigger";
import type Lenis from "lenis";

/** The site's single easing curve and durations (mirrors --ease-out-expo / --duration-* in globals.css). */
export const EASE = "site";
export const DURATION = { fast: 0.16, base: 0.28, slow: 0.6, reveal: 0.9 } as const;

/**
 * GSAP + ScrollTrigger + CustomEase, loaded on demand so they stay out of the initial bundle (keeps TBT/INP low).
 * Every caller shares one instance, so ScrollTrigger sees all triggers and pins together.
 */
let loading: Promise<{ gsap: typeof GSAP; ScrollTrigger: typeof ST }> | null = null;

export function loadGsap() {
  loading ??= Promise.all([import("gsap"), import("gsap/ScrollTrigger"), import("gsap/CustomEase")]).then(([g, s, c]) => {
    g.gsap.registerPlugin(s.ScrollTrigger, c.CustomEase);
    c.CustomEase.create(EASE, "M0,0 C0.2,0.7 0.2,1 1,1");
    // Refresh once fonts and late images have settled, so pin and trigger positions use final layout.
    document.fonts?.ready.then(() => s.ScrollTrigger.refresh());
    if (document.readyState !== "complete") window.addEventListener("load", () => s.ScrollTrigger.refresh(), { once: true });
    return { gsap: g.gsap, ScrollTrigger: s.ScrollTrigger };
  });
  return loading;
}

/** SplitText is only fetched by pages that have split headings below the fold. */
export function loadSplitText() {
  return import("gsap/SplitText").then(async (m) => {
    const { gsap } = await loadGsap();
    gsap.registerPlugin(m.SplitText);
    return m.SplitText;
  });
}

export const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* Lenis instance shared with components that scroll programmatically (rail arrows, anchors). */
let lenisInstance: Lenis | null = null;
export const setLenis = (l: Lenis | null) => {
  lenisInstance = l;
};

/** Scroll the page to a y position, through Lenis when it is running so the two never fight. */
export function scrollPageTo(y: number, opts: { immediate?: boolean } = {}) {
  const immediate = opts.immediate || prefersReducedMotion();
  if (lenisInstance) lenisInstance.scrollTo(y, { immediate, duration: 0.9, easing: (t) => 1 - Math.pow(1 - t, 3) });
  else window.scrollTo({ top: y, behavior: immediate ? "auto" : "smooth" });
}
