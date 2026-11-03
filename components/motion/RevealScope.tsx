"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import { DURATION, EASE, loadGsap, loadSplitText, prefersReducedMotion } from "@/lib/gsap-client";

/**
 * Scroll motion for everything inside this scope, using the site's one easing curve and duration set:
 * - `[data-reveal]` elements fade and rise once as they enter (ScrollTrigger.batch);
 * - section headings (`h2`, unless inside `[data-no-split]`) reveal line by line from a mask (SplitText,
 *   re-split on resize, fetched only when a heading sits below the fold);
 * - `[data-morph]` dark sections morph in from the colour above.
 *
 * Hydration-safe by construction: the server HTML is always fully visible and never carries reveal state.
 * Hidden start states are applied in a layout effect, which runs only after this whole subtree has hydrated,
 * and only to elements that are still below the fold (so nothing on screen ever blinks out).
 * Works in every browser GSAP supports; reduced motion leaves everything static.
 */
export function RevealScope({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = ref.current;
    if (!root || prefersReducedMotion()) return;
    let cancelled = false;
    let revert: (() => void) | undefined;

    loadGsap().then(({ gsap, ScrollTrigger }) => {
      if (cancelled) return;
      const cleanups: (() => void)[] = [];
      const ctx = gsap.context(() => {
        // Dark sections ([data-morph]) arrive by morphing from the colour of the section above, so the page
        // darkens into them instead of meeting a hard edge. Scrubbed, so scrolling back reverses it.
        // The section keeps its real navy background; a veil in the colour above fades out over it (behind the
        // content), so contrast checks and anything reading the page unscrolled always see navy.
        for (const sec of gsap.utils.toArray<HTMLElement>("[data-morph]", root)) {
          const veil = document.createElement("div");
          veil.setAttribute("aria-hidden", "true");
          // Displayed only while the section is entering (the only time anyone can see it), so an unscrolled
          // page never has light text sitting on a light layer.
          veil.style.cssText = `position:absolute;inset:0;z-index:-1;pointer-events:none;display:none;background:${colourAbove(sec)}`;
          if (getComputedStyle(sec).position === "static") sec.style.position = "relative";
          sec.style.isolation = "isolate";
          sec.prepend(veil);
          gsap.fromTo(
            veil,
            { opacity: 1 },
            {
              opacity: 0,
              ease: "none",
              scrollTrigger: {
                trigger: sec,
                start: "top bottom",
                end: "top 60%",
                scrub: true,
                onToggle: (self) => (veil.style.display = self.isActive ? "block" : "none"),
              },
            },
          );
          cleanups.push(() => veil.remove());
        }

        const fold = window.innerHeight * 0.92;
        const below = (el: HTMLElement) => el.getBoundingClientRect().top > fold;
        const targets = gsap.utils.toArray<HTMLElement>("[data-reveal]", root).filter(below);
        if (targets.length) {
          // Opacity only, never visibility: hidden-by-visibility content can't take keyboard focus, so tabbing
          // would skip every block that hasn't scrolled in yet (forms included).
          const show = (els: Element[]) =>
            gsap.to(els, { opacity: 1, y: 0, duration: DURATION.reveal, ease: EASE, stagger: 0.06, overwrite: true, clearProps: "opacity,transform" });
          gsap.set(targets, { opacity: 0, y: 28 });
          ScrollTrigger.batch(targets, { start: "top 90%", once: true, onEnter: show });
          // Focus moving into a block that hasn't revealed yet (keyboard, anchor links) shows it at once.
          const onFocus = (e: FocusEvent) => {
            const block = (e.target as HTMLElement).closest<HTMLElement>("[data-reveal]");
            if (block && targets.includes(block) && Number(gsap.getProperty(block, "opacity")) < 1) gsap.set(block, { opacity: 1, y: 0, clearProps: "opacity,transform" });
          };
          root.addEventListener("focusin", onFocus);
          cleanups.push(() => root.removeEventListener("focusin", onFocus));
        }
        // Pinned sections (e.g. the pillar explorer) change positions further down; recompute once all are registered.
        ScrollTrigger.refresh();
      }, root);
      revert = () => {
        cleanups.forEach((c) => c());
        ctx.revert();
      };

      const headings = gsap.utils
        .toArray<HTMLElement>("h2", root)
        .filter((h) => !h.closest("[data-no-split]") && h.getBoundingClientRect().top > window.innerHeight);
      if (!headings.length) return;
      loadSplitText().then((SplitText) => {
        if (cancelled) return;
        ctx.add(() => {
          for (const h of headings) {
            SplitText.create(h, {
              type: "lines",
              mask: "lines",
              linesClass: "split-line",
              autoSplit: true,
              onSplit: (self) =>
                gsap.from(self.lines, {
                  yPercent: 110,
                  duration: DURATION.reveal,
                  ease: EASE,
                  stagger: 0.08,
                  scrollTrigger: { trigger: h, start: "top 88%", once: true },
                }),
            });
          }
        });
      });
    });

    return () => {
      cancelled = true;
      revert?.();
    };
  }, []);

  return <div ref={ref}>{children}</div>;
}

/** Background colour of the section rendered just above `el` (white when transparent or none). */
function colourAbove(el: HTMLElement): string {
  let node: Element | null = el;
  while (node && !node.previousElementSibling) node = node.parentElement;
  let prev = node?.previousElementSibling ?? null;
  if (prev?.classList.contains("pin-spacer")) prev = prev.firstElementChild;
  const bg = prev ? getComputedStyle(prev).backgroundColor : "";
  return !bg || bg === "rgba(0, 0, 0, 0)" || bg === "transparent" ? "#ffffff" : bg;
}
