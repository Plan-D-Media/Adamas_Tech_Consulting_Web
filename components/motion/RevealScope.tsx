"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Scroll reveals with GSAP ScrollTrigger: every [data-reveal] element inside rises 24px and fades in once it enters
 * the viewport (staggered 60ms when several share a parent). The pre-reveal state lives in CSS and is gated on
 * `@media (scripting: enabled)` (app/globals.css), so nothing is hidden without JavaScript. Reduced motion shows
 * everything at once. A focus inside a not-yet-revealed element reveals it immediately, so keyboard users are never
 * stuck on an invisible control.
 *
 * Load cost (Lighthouse round 7): elements already in the first viewport are shown as soon as the page hydrates,
 * and GSAP itself is only fetched on the first scroll or pointer movement, or after the browser has been idle, so
 * its parse and execution stay out of the time-to-interactive window on phones.
 */
export function RevealScope({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const nodes = Array.from(root.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (nodes.length === 0) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const show = (el: HTMLElement) => el.setAttribute("data-revealed", "");

    if (reduce) {
      nodes.forEach(show);
      return;
    }

    // Above the fold: visible at once, no animation (also keeps the LCP element from waiting on GSAP).
    const fold = window.innerHeight * 1.1;
    for (const el of nodes) if (el.getBoundingClientRect().top < fold) show(el);

    const onFocus = (e: FocusEvent) => {
      const el = (e.target as HTMLElement | null)?.closest<HTMLElement>("[data-reveal]:not([data-revealed])");
      if (el) show(el);
    };
    root.addEventListener("focusin", onFocus);

    let cancelled = false;
    let cleanup: (() => void) | undefined;
    // Safety net: if GSAP never arrives (blocked script, slow network), nothing stays hidden for long.
    const safety = window.setTimeout(() => nodes.forEach(show), 6000);

    const load = () => {
      if (cancelled || cleanup) return;
      cleanup = () => {};
      Promise.all([import("gsap"), import("gsap/ScrollTrigger")])
        .then(([{ gsap }, { ScrollTrigger }]) => {
          if (cancelled) return;
          gsap.registerPlugin(ScrollTrigger);
          const groups = new Map<Element, HTMLElement[]>();
          for (const el of nodes) {
            if (el.hasAttribute("data-revealed")) continue;
            const parent = el.parentElement ?? root;
            groups.set(parent, [...(groups.get(parent) ?? []), el]);
          }
          const triggers: ScrollTrigger[] = [];
          for (const [, els] of groups) {
            gsap.set(els, { opacity: 0, y: 24 });
            els.forEach(show);
            triggers.push(
              ScrollTrigger.create({
                trigger: els[0],
                start: "top 88%",
                once: true,
                onEnter: () => gsap.to(els, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.06, overwrite: true, clearProps: "transform" }),
              }),
            );
          }
          cleanup = () => triggers.forEach((t) => t.kill());
        })
        .catch(() => nodes.forEach(show));
    };
    const triggers = ["scroll", "pointermove", "touchstart", "keydown"] as const;
    const onFirst = () => {
      triggers.forEach((t) => window.removeEventListener(t, onFirst));
      load();
    };
    triggers.forEach((t) => window.addEventListener(t, onFirst, { passive: true, once: true }));
    const hasIdle = typeof window.requestIdleCallback === "function";
    const idle = hasIdle ? window.requestIdleCallback(onFirst, { timeout: 3000 }) : window.setTimeout(onFirst, 2500);

    return () => {
      cancelled = true;
      window.clearTimeout(safety);
      if (hasIdle) window.cancelIdleCallback(idle);
      else window.clearTimeout(idle);
      triggers.forEach((t) => window.removeEventListener(t, onFirst));
      cleanup?.();
      root.removeEventListener("focusin", onFocus);
    };
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
