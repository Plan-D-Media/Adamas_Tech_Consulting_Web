"use client";

import { useEffect } from "react";

const MAX_PULL = 6; // px a magnetic CTA can travel towards the cursor

/**
 * Site-wide pointer micro-interactions, delegated from the document (one listener, no per-card hooks):
 * - `[data-spotlight]` (dark cards): a soft light follows the cursor (CSS reads --mx / --my).
 * - `[data-magnetic]` (primary CTAs): the button leans slightly towards the cursor and eases back on leave.
 * Fine pointers only; nothing runs for touch or reduced motion. Only CSS variables are written, so the
 * browser animates transform and opacity alone.
 */
export function Interactions() {
  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || reduced.matches) return;

    let frame = 0;
    let last: PointerEvent | null = null;
    let magnet: HTMLElement | null = null;

    const release = () => {
      if (!magnet) return;
      magnet.style.removeProperty("--tx");
      magnet.style.removeProperty("--ty");
      magnet = null;
    };

    const apply = () => {
      frame = 0;
      const e = last;
      if (!e) return;
      const target = e.target as Element | null;

      const spot = target?.closest<HTMLElement>("[data-spotlight]");
      if (spot) {
        const r = spot.getBoundingClientRect();
        spot.style.setProperty("--mx", `${e.clientX - r.left}px`);
        spot.style.setProperty("--my", `${e.clientY - r.top}px`);
      }

      const mag = target?.closest<HTMLElement>("[data-magnetic]") ?? null;
      if (mag !== magnet) release();
      if (mag) {
        magnet = mag;
        const r = mag.getBoundingClientRect();
        const dx = ((e.clientX - (r.left + r.width / 2)) / (r.width / 2)) * MAX_PULL;
        const dy = ((e.clientY - (r.top + r.height / 2)) / (r.height / 2)) * MAX_PULL * 0.6;
        mag.style.setProperty("--tx", `${dx.toFixed(2)}px`);
        mag.style.setProperty("--ty", `${dy.toFixed(2)}px`);
      }
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      last = e;
      if (!frame) frame = requestAnimationFrame(apply);
    };
    const onLeaveWindow = () => release();

    document.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeaveWindow);
    return () => {
      cancelAnimationFrame(frame);
      release();
      document.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeaveWindow);
    };
  }, []);

  return null;
}
