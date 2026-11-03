"use client";

import { useLayoutEffect, useRef } from "react";
import type { StatData } from "@/lib/data/home";
import { loadGsap, prefersReducedMotion } from "@/lib/gsap-client";

/**
 * Counts a verified stat up when it scrolls into view. The server renders the final value,
 * so no-JS, reduced-motion and screen readers always get the real figure.
 */
export function StatCounter({ stat, className }: { stat: StatData; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || stat.numeric == null || prefersReducedMotion()) return;
    // Only count up figures still below the fold; anything already visible keeps its value.
    if (el.getBoundingClientRect().top < window.innerHeight) return;
    let cancelled = false;
    let kill: (() => void) | undefined;
    const target = stat.numeric;
    const decimals = String(target).split(".")[1]?.length ?? 0;
    const fmt = (n: number) =>
      `${stat.prefix ?? ""}${n.toLocaleString("en-GB", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}${stat.suffix ?? ""}`;

    loadGsap().then(({ gsap }) => {
      if (cancelled) return;
      const obj = { v: 0 };
      el.textContent = fmt(0);
      const tween = gsap.to(obj, {
        v: target,
        duration: 1.6,
        ease: "power3.out",
        onUpdate: () => {
          el.textContent = fmt(obj.v);
        },
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
      });
      kill = () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    });

    return () => {
      cancelled = true;
      kill?.();
      el.textContent = stat.value;
    };
  }, [stat]);

  return (
    <span className={className}>
      <span ref={ref} aria-hidden="true">
        {stat.value}
      </span>
      <span className="sr-only">{stat.value}</span>
    </span>
  );
}
