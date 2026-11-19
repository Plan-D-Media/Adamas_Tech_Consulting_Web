"use client";

import { useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import { createPortal } from "react-dom";

/**
 * Renders an open mega-menu panel at <body> level, positioned under the header.
 *
 * Why a portal: the header bar carries `isolation: isolate` (so the glass pseudo-element can sit at -z-10 without
 * falling behind the page), and an isolated element is a **backdrop root**. A `backdrop-filter` inside one can only
 * sample what is painted within that root - the header box - so the panel blurred nothing and the page read sharply
 * through it (QA: "Partners & Certifications" legible behind the Services panel). Moving the panel out of the header
 * gives it the page as its backdrop, which is what the blur needs.
 *
 * Position is measured rather than inherited: the panel is `fixed`, its left edge and width taken from the header's
 * 1312px chrome box (Figma: panel x 304-1616) and its top from the header bar's bottom edge, re-measured on scroll,
 * on resize and whenever the header changes height (the top bar folds away after 40px of scroll).
 */

interface Rect {
  top: number;
  left: number;
  width: number;
}

interface Props {
  /** The <nav> inside the header; used to find the header bar and the chrome box without querying globally. */
  navRef: RefObject<HTMLElement | null>;
  /** Set to the positioned wrapper so MegaMenu can test focus and pointer containment against it. */
  hostRef: RefObject<HTMLDivElement | null>;
  children: ReactNode;
  onPointerEnter: () => void;
  onPointerLeave: () => void;
  /** The pointer reached the page outside the header and the panel: begin the close delay. */
  onScrimEnter: () => void;
  onScrimClick: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onBlur: (e: React.FocusEvent) => void;
}

export function MegaMenuPortal({ navRef, hostRef, children, onPointerEnter, onPointerLeave, onScrimEnter, onScrimClick, onKeyDown, onBlur }: Props) {
  const [rect, setRect] = useState<Rect | null>(null);
  const frame = useRef(0);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const bar = nav.closest<HTMLElement>(".headerbar");
    const box = nav.closest<HTMLElement>("[data-menu-anchor]");
    const header = nav.closest<HTMLElement>(".site-header");
    if (!bar || !box) return;

    const measure = () => {
      frame.current = 0;
      const b = bar.getBoundingClientRect();
      const o = box.getBoundingClientRect();
      setRect({ top: b.bottom, left: o.left, width: o.width });
    };
    const schedule = () => {
      if (!frame.current) frame.current = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    // The top bar collapses over 240ms after 40px of scroll, so the bar's bottom edge moves without a scroll event
    // for every frame of it.
    const observer = new ResizeObserver(schedule);
    if (header) observer.observe(header);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      observer.disconnect();
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, [navRef]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <>
      {/* Page scrim: the page recedes behind the open panel. Sits under the header (z-50) so the bar keeps its glass
          look, and closes the menu when clicked.
          onPointerEnter carries the hover-out close. React routes portal events up the *React* tree, so the scrim
          counts as a descendant of the trigger's <li> and moving the pointer onto it never fires that <li>'s
          onPointerLeave - the menu used to stay open wherever the pointer went. Reaching the scrim means the pointer
          is off both the header and the panel, which is exactly when the close delay should start. */}
      <div className="anim-scrim-in fixed inset-0 z-[45] bg-navy-950/30" aria-hidden="true" onClick={onScrimClick} onPointerEnter={onScrimEnter} />
      <div
        ref={hostRef}
        data-menu-panel-host
        className="fixed z-[60] pt-[45px]"
        /* The 45px gap below the bar is transparent padding on this wrapper, so the pointer can cross it without the
           menu closing (hover intent). */
        style={rect ? { top: rect.top, left: rect.left, width: rect.width } : { top: 0, left: 0, width: 0, visibility: "hidden" }}
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
        onKeyDown={onKeyDown}
        onBlur={onBlur}
      >
        {children}
      </div>
    </>,
    document.body,
  );
}
