"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/gsap-client";

const PARTS = /^(\D*?)(\d+(?:[.,]\d+)?)(.*)$/;

/**
 * Counts a headline metric ("99%", "2.5x", "30%") up from 0 the first time its card is mostly in view
 * (including when a pinned rail slides it in). Server HTML carries the final value; screen readers
 * read the real figure; reduced motion and non-numeric values stay static.
 */
export function MetricCount({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    const m = PARTS.exec(value);
    if (!el || !m || prefersReducedMotion()) return;
    const [, pre, num, post] = m;
    const target = parseFloat(num.replace(",", "."));
    const decimals = num.split(/[.,]/)[1]?.length ?? 0;
    let raf = 0;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const dur = 1400;
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / dur);
          const eased = 1 - Math.pow(1 - t, 4);
          el.textContent = `${pre}${(target * eased).toFixed(decimals)}${post}`;
          if (t < 1) raf = requestAnimationFrame(tick);
        };
        el.textContent = `${pre}${(0).toFixed(decimals)}${post}`;
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.75 },
    );
    // Only animate when it starts out of view; a figure already on screen keeps its value.
    const r = el.getBoundingClientRect();
    if (r.top > window.innerHeight || r.left > window.innerWidth || r.right < 0) io.observe(el);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      el.textContent = value;
    };
  }, [value]);

  return (
    <span className={className}>
      <span ref={ref} aria-hidden="true">
        {value}
      </span>
      <span className="sr-only">{value}</span>
    </span>
  );
}
