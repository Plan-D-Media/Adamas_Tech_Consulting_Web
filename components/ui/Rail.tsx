"use client";

import { Children, useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { cx } from "@/lib/cx";
import { loadGsap, scrollPageTo } from "@/lib/gsap-client";
import { Icon } from "./Icon";

/** Desktop + tall enough to hold the whole section + motion allowed → pinned, scroll-driven rail. */
export const PIN_QUERY = "(min-width: 1024px) and (min-height: 700px) and (prefers-reduced-motion: no-preference)";

/**
 * Card rail rendered as its own <section>.
 *
 * - `pin` on desktop: the section pins at the top of the viewport and vertical scrolling drives the card
 *   track right-to-left (GSAP ScrollTrigger, scrubbed, pinned distance = horizontal distance, card-by-card
 *   snap). Heading, counter and arrows stay put; arrows scroll the page to the matching card position.
 * - Below 1024px, on short viewports and with reduced motion: a native scroll-snap rail (touch momentum,
 *   trackpad, keyboard, mouse drag) with the same counter and arrows.
 */
export function Rail({
  label,
  children,
  tone = "light",
  itemClassName = "w-[84%] sm:w-[60%] md:w-[44%] lg:w-[clamp(21rem,29vw,26.5rem)]",
  header,
  action,
  pin = false,
  labelledBy,
  className,
}: {
  label: string;
  children: ReactNode;
  tone?: "light" | "dark";
  itemClassName?: string;
  header?: ReactNode;
  /** Section-level link ("All solutions"), placed with the controls so it stays visible while pinned. */
  action?: ReactNode;
  pin?: boolean;
  labelledBy?: string;
  className?: string;
}) {
  const root = useRef<HTMLElement>(null);
  const scroller = useRef<HTMLUListElement>(null);
  const items = Children.toArray(children);
  const [state, setState] = useState({ index: 0, atStart: true, atEnd: items.length < 2 });
  const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null);
  /** Set while pinned: moves the page to the previous / next card stop, or to a given card. */
  const pinned = useRef<{ step: (dir: 1 | -1) => void; reveal: (i: number) => void } | null>(null);

  const publish = useCallback((index: number, atStart: boolean, atEnd: boolean) => {
    setState((s) => (s.index === index && s.atStart === atStart && s.atEnd === atEnd ? s : { index, atStart, atEnd }));
  }, []);

  // Native mode: derive the counter from the scroll position.
  const update = useCallback(() => {
    const el = scroller.current;
    if (!el || pinned.current) return;
    const first = el.children[0] as HTMLElement | undefined;
    const step = first ? first.getBoundingClientRect().width + parseFloat(getComputedStyle(el).columnGap || "0") : 1;
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
    publish(atEnd ? items.length - 1 : Math.round(el.scrollLeft / step), el.scrollLeft <= 4, atEnd);
  }, [publish, items.length]);

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [update]);

  // Pinned mode (desktop): GSAP matchMedia sets it up and tears it down as the viewport crosses the query.
  useLayoutEffect(() => {
    const section = root.current;
    const track = scroller.current;
    if (!pin || !section || !track || items.length < 2) return;
    let cancelled = false;
    let revert: (() => void) | undefined;

    loadGsap().then(({ gsap }) => {
      if (cancelled) return;
      const mm = gsap.matchMedia();
      mm.add(PIN_QUERY, () => {
        section.dataset.pinned = "";
        track.scrollLeft = 0;
        const cards = Array.from(track.children) as HTMLElement[];
        const parallax = cards.map((c) => c.querySelector<HTMLElement>("[data-parallax]"));

        // Geometry, measured on every refresh (resize, fonts, images).
        let distance = 0;
        let offsets: number[] = [];
        let widths: number[] = [];
        let stops: number[] = []; // track x (positive) at which card i sits at the left edge
        let unique: number[] = [];
        const measure = () => {
          // From layout offsets (they ignore the depth transforms, unlike scrollWidth) plus the right inset.
          const last = cards[cards.length - 1];
          const padRight = parseFloat(getComputedStyle(track).paddingRight) || 0;
          distance = Math.max(0, last.offsetLeft + last.offsetWidth + padRight - track.clientWidth);
          const base = cards[0].offsetLeft;
          offsets = cards.map((c) => c.offsetLeft);
          widths = cards.map((c) => c.offsetWidth);
          stops = cards.map((c) => Math.min(c.offsetLeft - base, distance));
          unique = [...new Set(stops.map((s) => Math.round(s)))].sort((a, b) => a - b);
        };
        measure();

        // Depth: cards fully in view at full scale and opacity; peeking neighbours slightly smaller and dimmer.
        const depth = (x: number) => {
          const vw = track.clientWidth;
          for (let i = 0; i < cards.length; i++) {
            const left = offsets[i] - x;
            const w = widths[i];
            const seen = Math.max(0, Math.min(left + w, vw) - Math.max(left, 0)) / w;
            cards[i].style.transform = `scale(${(0.96 + 0.04 * seen).toFixed(4)})`;
            cards[i].style.opacity = (0.45 + 0.55 * seen).toFixed(3);
            const p = parallax[i];
            if (p) p.style.transform = `translate3d(${(((left + w / 2 - vw / 2) / vw) * -5).toFixed(2)}%,0,0)`;
          }
        };

        const indexAt = (x: number) => {
          let i = 0;
          for (let k = 0; k < stops.length; k++) if (stops[k] <= x + 4) i = k;
          return i;
        };

        const tween = gsap.to(track, {
          x: () => -distance, // `end` (below) re-measures first on every refresh
          ease: "none",
          onUpdate: () => {
            const x = -(gsap.getProperty(track, "x") as number);
            depth(x);
            publish(indexAt(x), x <= 2, x >= distance - 2);
          },
          scrollTrigger: {
            trigger: section,
            start: "top top",
            // Measured here, i.e. during refresh after the pin is reverted, so resizes use the new layout.
            end: () => {
              measure();
              return `+=${distance}`;
            },
            pin: true,
            scrub: 0.9,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onRefresh: () => depth(-(gsap.getProperty(track, "x") as number)),
            snap: {
              // Directional, so it never fights the user: past 20% of the way to the next card it settles
              // forward in the direction of travel; a smaller nudge settles back.
              snapTo: (progress: number, self?: { direction: number }) => {
                if (!distance) return progress;
                const x = progress * distance;
                let k = 0;
                while (k < unique.length - 1 && unique[k + 1] <= x) k++;
                const a = unique[k];
                const b = unique[Math.min(k + 1, unique.length - 1)];
                if (b === a) return a / distance;
                const f = (x - a) / (b - a);
                const forward = (self?.direction ?? 1) > 0;
                return (forward ? (f > 0.2 ? b : a) : f < 0.8 ? a : b) / distance;
              },
              // No velocity projection: settle from where the user stopped, never fling past several cards.
              inertia: false,
              duration: { min: 0.2, max: 0.5 },
              delay: 0.12,
              ease: "power2.out",
            },
          },
        });
        const st = tween.scrollTrigger!;
        const pageYFor = (x: number) => st.start + (distance ? (x / distance) * (st.end - st.start) : 0);

        pinned.current = {
          step: (dir) => {
            const x = st.progress * distance;
            const cur = unique.reduce((a, b, k) => (Math.abs(b - x) < Math.abs(unique[a] - x) ? k : a), 0);
            const next = unique[Math.min(unique.length - 1, Math.max(0, cur + dir))];
            scrollPageTo(pageYFor(next));
          },
          reveal: (i) => {
            const left = offsets[i] - st.progress * distance;
            if (left >= 0 && left + widths[i] <= track.clientWidth) return; // already fully visible
            scrollPageTo(pageYFor(stops[i]), { immediate: true });
          },
        };
        depth(0);

        return () => {
          pinned.current = null;
          delete section.dataset.pinned;
          cards.forEach((c, i) => {
            c.style.opacity = "";
            c.style.transform = "";
            if (parallax[i]) parallax[i]!.style.transform = "";
          });
        };
      });
      revert = () => mm.revert();
    });

    return () => {
      cancelled = true;
      revert?.();
      pinned.current = null;
    };
  }, [pin, items.length, publish]);

  const by = (dir: 1 | -1) => {
    if (pinned.current) return pinned.current.step(dir);
    const el = scroller.current;
    if (!el) return;
    const first = el.children[0] as HTMLElement | undefined;
    const step = first ? first.getBoundingClientRect().width + parseFloat(getComputedStyle(el).columnGap || "0") : el.clientWidth;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  // Keyboard focus inside a pinned rail brings the focused card into view.
  const onFocus = (e: React.FocusEvent<HTMLUListElement>) => {
    if (!pinned.current) return;
    const li = (e.target as HTMLElement).closest("li");
    const i = li ? Array.prototype.indexOf.call(e.currentTarget.children, li) : -1;
    // Next frame: after the browser's own focus scrolling (WebKit), so this position wins.
    if (i >= 0) requestAnimationFrame(() => pinned.current?.reveal(i));
  };

  // Mouse drag in native mode (touch and pen scroll natively).
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !scroller.current || pinned.current) return;
    drag.current = { x: e.clientX, left: scroller.current.scrollLeft, moved: false };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    const el = scroller.current;
    if (!d || !el) return;
    const dx = e.clientX - d.x;
    if (!d.moved && Math.abs(dx) > 6) {
      d.moved = true;
      el.style.scrollSnapType = "none";
      el.setPointerCapture(e.pointerId);
    }
    if (d.moved) el.scrollLeft = d.left - dx;
  };
  const endDrag = (e: React.PointerEvent) => {
    const d = drag.current;
    const el = scroller.current;
    drag.current = null;
    if (!d?.moved || !el) return;
    el.releasePointerCapture?.(e.pointerId);
    el.style.scrollSnapType = "";
    const stop = (ev: Event) => {
      ev.preventDefault();
      ev.stopPropagation();
    };
    el.addEventListener("click", stop, { capture: true, once: true });
    window.setTimeout(() => el.removeEventListener("click", stop, { capture: true }), 0);
  };

  const dark = tone === "dark";
  const btn = cx(
    "inline-flex size-12 items-center justify-center rounded-full border transition-colors duration-(--duration-base) disabled:cursor-not-allowed disabled:opacity-30",
    dark ? "border-white/30 text-white hover:enabled:border-white hover:enabled:bg-white/10" : "border-grey-300 text-navy-950 hover:enabled:border-navy-950 hover:enabled:bg-white",
  );
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <section ref={root} aria-labelledby={labelledBy} aria-label={labelledBy ? undefined : label} className={cx("rail section-y overflow-x-clip", className)}>
      <div role="region" aria-roledescription="carousel" aria-label={label}>
        <div className="container-site flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="min-w-0 flex-1">{header}</div>
          <div className="flex shrink-0 flex-wrap items-center gap-x-6 gap-y-4">
            {action && <div className="hidden md:block">{action}</div>}
            <div className="flex items-center gap-3">
              <p aria-hidden="true" className={cx("mr-2 font-display text-sm font-bold tabular-nums", dark ? "text-on-navy-muted" : "text-grey-600")}>
                <span className={dark ? "text-white" : "text-navy-950"}>{pad(Math.min(state.index + 1, items.length))}</span>
                <span className="mx-1.5">/</span>
                {pad(items.length)}
              </p>
              <button type="button" className={btn} onClick={() => by(-1)} disabled={state.atStart}>
                <Icon name="arrowLeft" />
                <span className="sr-only">Previous</span>
              </button>
              <button type="button" className={btn} onClick={() => by(1)} disabled={state.atEnd}>
                <Icon name="arrowRight" />
                <span className="sr-only">Next</span>
              </button>
            </div>
          </div>
        </div>

        <ul
          ref={scroller}
          tabIndex={0}
          aria-label={`${label}, scrollable list`}
          onFocus={onFocus}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          className={cx(
            "rail-track scrollbar-none mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain pb-2 md:gap-6",
            "rail-inset",
            "cursor-grab active:cursor-grabbing focus-visible:outline-offset-[-2px]",
          )}
        >
          {items.map((child, i) => (
            <li key={i} className={cx("shrink-0 snap-start", itemClassName)} aria-roledescription="slide" aria-label={`${i + 1} of ${items.length}`}>
              {child}
            </li>
          ))}
        </ul>

        {action && <div className="container-site mt-8 md:hidden">{action}</div>}
      </div>
    </section>
  );
}
