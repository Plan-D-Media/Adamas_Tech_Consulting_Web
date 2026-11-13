"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Scroll reveals with GSAP ScrollTrigger: every [data-reveal] element inside rises 24px and fades in once it enters
 * the viewport (staggered 60ms when several share a parent). The pre-reveal state lives in CSS and is gated on
 * `@media (scripting: enabled)` (app/globals.css), so nothing is hidden without JavaScript. Reduced motion shows
 * everything at once. A focus inside a not-yet-revealed element reveals it immediately, so keyboard users are never
 * stuck on an invisible control.
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

    const onFocus = (e: FocusEvent) => {
      const el = (e.target as HTMLElement | null)?.closest<HTMLElement>("[data-reveal]:not([data-revealed])");
      if (el) show(el);
    };
    root.addEventListener("focusin", onFocus);

    let cancelled = false;
    let cleanup: (() => void) | undefined;
    // Safety net: if GSAP never arrives (blocked script, slow network), nothing stays hidden for long.
    const safety = window.setTimeout(() => nodes.forEach(show), 3000);
    import("gsap")
      .then(({ gsap }) =>
      import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
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
      }),
      )
      .catch(() => nodes.forEach(show));
    return () => {
      cancelled = true;
      window.clearTimeout(safety);
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
