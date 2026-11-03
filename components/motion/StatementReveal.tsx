"use client";

import { useLayoutEffect, useRef } from "react";
import { cx } from "@/lib/cx";
import { loadGsap, prefersReducedMotion } from "@/lib/gsap-client";

/** Muted start colour for the word sweep: 4.6:1 on navy-950, so every frame passes AA for large text. */
const DIM = "#6f87a6";

/**
 * A bold one-line statement whose words light up as it scrolls through the viewport (scrubbed).
 * The sweep animates colour, not opacity, so the dimmed state still meets contrast.
 * Server markup is plain white text; the effect is added client-side after hydration.
 */
export function StatementReveal({ text, as: Tag = "h2", id, className }: { text: string; as?: "h2" | "p"; id?: string; className?: string }) {
  const ref = useRef<HTMLHeadingElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    let cancelled = false;
    let revert: (() => void) | undefined;

    loadGsap().then(({ gsap }) => {
      if (cancelled) return;
      const ctx = gsap.context(() => {
        gsap.fromTo(
          el.querySelectorAll("[data-sw]"),
          { color: DIM },
          {
            color: "#ffffff",
            ease: "none",
            stagger: 0.12,
            scrollTrigger: { trigger: el, start: "top 82%", end: "bottom 45%", scrub: 0.6 },
          },
        );
      }, el);
      revert = () => ctx.revert();
    });

    return () => {
      cancelled = true;
      revert?.();
    };
  }, [text]);

  return (
    <Tag ref={ref as never} id={id} data-no-split className={cx("font-display text-display font-bold tracking-[-0.02em] [font-stretch:104%]", className)} aria-label={text}>
      {text.split(/\s+/).map((w, i, all) => (
        <span key={i} aria-hidden="true">
          <span data-sw className="inline-block">
            {w}
          </span>
          {i < all.length - 1 && " "}
        </span>
      ))}
    </Tag>
  );
}
