"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import { loadGsap, scrollPageTo } from "@/lib/gsap-client";
import { PIN_QUERY } from "@/components/ui/Rail";

/**
 * Desktop behaviour for the company journey (components/company/Journey.tsx), the same technique as the pinned rails:
 * the block pins at the top of the viewport and vertical scroll drives the milestone track (GSAP ScrollTrigger,
 * scrubbed, pinned distance = horizontal distance, directional snap to each milestone).
 * Milestone i is active at progress i / (n − 1): the progress line fills to its marker, markers up to it light up,
 * the active milestone sits at full scale and opacity and the others are slightly dimmed. Clicking a marker scrolls
 * the page to that milestone; focusing one does the same for keyboard users.
 * Outside PIN_QUERY (below 1024px, short screens, reduced motion) nothing runs and the static timeline stays.
 */
export function JourneyPin({ count, children }: { count: number; children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const wrap = root.current;
    const track = wrap?.querySelector<HTMLElement>(".journey-track");
    if (!wrap || !track || count < 2) return;
    let cancelled = false;
    let revert: (() => void) | undefined;

    loadGsap().then(({ gsap }) => {
      if (cancelled) return;
      const mm = gsap.matchMedia();
      mm.add(PIN_QUERY, () => {
        wrap.dataset.pinned = "";
        const items = Array.from(track.querySelectorAll<HTMLElement>("[data-journey-item]"));
        const markers = Array.from(wrap.querySelectorAll<HTMLButtonElement>("[data-journey-marker]"));
        const fill = wrap.querySelector<HTMLElement>("[data-journey-fill]");
        const counter = wrap.querySelector<HTMLElement>("[data-journey-count]");
        const last = items.length - 1;

        let distance = 0;
        const measure = () => {
          const end = items[last];
          const padRight = parseFloat(getComputedStyle(track).paddingRight) || 0;
          distance = Math.max(0, end.offsetLeft + end.offsetWidth + padRight - track.clientWidth);
        };
        measure();

        let active = -1;
        const apply = (progress: number) => {
          const f = progress * last; // continuous milestone position
          for (let i = 0; i < items.length; i++) {
            const d = Math.min(1, Math.abs(i - f));
            items[i].style.opacity = (1 - 0.55 * d).toFixed(3);
            items[i].style.transform = `scale(${(1 - 0.05 * d).toFixed(4)})`;
          }
          if (fill) fill.style.transform = `scaleX(${progress.toFixed(4)})`;
          const now = Math.round(f);
          if (now === active) return;
          active = now;
          markers.forEach((m, i) => {
            m.toggleAttribute("data-lit", i <= now);
            if (i === now) m.setAttribute("aria-current", "step");
            else m.removeAttribute("aria-current");
          });
          if (counter) counter.textContent = String(now + 1).padStart(2, "0");
        };

        const tween = gsap.to(track, {
          x: () => -distance,
          ease: "none",
          // From the track position (not tween.scrollTrigger): GSAP can call this while gsap.to() is still running.
          onUpdate: () => apply(distance ? Math.min(1, Math.max(0, -(gsap.getProperty(track, "x") as number) / distance)) : 0),
          scrollTrigger: {
            trigger: wrap,
            start: "top top",
            end: () => {
              measure();
              return `+=${distance}`;
            },
            pin: true,
            scrub: 0.9,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onRefresh: (self) => apply(self.progress),
            snap: {
              // Directional, like the rails: past 20% of the way to the next milestone it settles forward.
              snapTo: (progress: number, self?: { direction: number }) => {
                const x = progress * last;
                const a = Math.floor(x);
                const b = Math.min(last, a + 1);
                if (a === b) return a / last;
                const f = x - a;
                const forward = (self?.direction ?? 1) > 0;
                return (forward ? (f > 0.2 ? b : a) : f < 0.8 ? a : b) / last;
              },
              inertia: false,
              duration: { min: 0.2, max: 0.5 },
              delay: 0.12,
              ease: "power2.out",
            },
          },
        });
        const st = tween.scrollTrigger!;
        const pageYFor = (i: number) => st.start + (i / last) * (st.end - st.start);

        const onClick = (e: MouseEvent) => {
          const btn = (e.target as HTMLElement).closest<HTMLButtonElement>("[data-journey-marker]");
          if (btn) scrollPageTo(pageYFor(Number(btn.dataset.journeyMarker)));
        };
        const onFocus = (e: FocusEvent) => {
          const btn = (e.target as HTMLElement).closest<HTMLButtonElement>("[data-journey-marker]");
          if (!btn) return;
          const y = pageYFor(Number(btn.dataset.journeyMarker));
          // Next frame, after the browser's own focus scrolling, so this position wins; keyboard only.
          if (btn.matches(":focus-visible")) requestAnimationFrame(() => scrollPageTo(y, { immediate: true }));
        };
        wrap.addEventListener("click", onClick);
        wrap.addEventListener("focusin", onFocus);
        apply(st.progress);

        return () => {
          wrap.removeEventListener("click", onClick);
          wrap.removeEventListener("focusin", onFocus);
          delete wrap.dataset.pinned;
          items.forEach((el) => {
            el.style.opacity = "";
            el.style.transform = "";
          });
          if (fill) fill.style.transform = "";
          markers.forEach((m) => {
            m.removeAttribute("data-lit");
            m.removeAttribute("aria-current");
          });
        };
      });
      revert = () => mm.revert();
    });

    return () => {
      cancelled = true;
      revert?.();
    };
  }, [count]);

  return (
    <div ref={root} className="journey mt-16 overflow-x-clip md:mt-20">
      {children}
    </div>
  );
}
