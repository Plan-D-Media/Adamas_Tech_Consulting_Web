"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Sequences the "Why Organisations Choose Adamas" diagram when it scrolls into view: the orb scales and fades up,
 * the six connector lines draw out from the centre, then the six cards stagger in behind them.
 *
 * All it does is set `data-drawn` on the wrapper once; the whole sequence is CSS (`app/globals.css`,
 * `.ecosystem-*`), with the delays coming from a `--i` custom property per element. That keeps it off the main
 * thread, costs no library, and means the no-JavaScript and reduced-motion cases are handled by the same media
 * queries the rest of the reveal system uses rather than by a second code path.
 *
 * It deliberately does not use GSAP ScrollTrigger: the sequence is a one-shot entrance, not a scrub, and
 * `RevealScope` already owns GSAP for the surrounding section. The orb's own rotation *is* scroll-linked - the
 * scene reads its progress through the viewport directly (`components/polynode/polynode-orb.ts`).
 */
export function DifferenceStage({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.setAttribute("data-drawn", "");
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        el.setAttribute("data-drawn", "");
        io.disconnect();
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    // If the observer never fires (a short page, a resize race), nothing stays hidden.
    const safety = window.setTimeout(() => el.setAttribute("data-drawn", ""), 4000);
    return () => {
      io.disconnect();
      window.clearTimeout(safety);
    };
  }, []);

  return (
    <div ref={ref} data-stage="ecosystem" className={className}>
      {children}
    </div>
  );
}
