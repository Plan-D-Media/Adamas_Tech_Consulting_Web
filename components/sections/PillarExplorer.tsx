"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, m } from "motion/react";
import type { ScrollTrigger } from "gsap/ScrollTrigger";
import { loadGsap } from "@/lib/gsap-client";
import type { PillarData } from "@/lib/data/home";
import type { Block } from "@/lib/data/site";
import { cx } from "@/lib/cx";
import { Img } from "@/components/media/Img";
import { Icon } from "@/components/ui/Icon";
import { ArrowLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/SectionHeader";
import { useMediaQuery } from "@/components/motion/useReducedMotion";

/**
 * When this section pins: ≥ 1280px wide and ≥ 700px tall, or 1024–1279px wide and ≥ 800px tall (narrower columns
 * wrap the copy, so they need more height), and motion allowed. Measured at 1440×900, 1366×768, 1280×720/700 and
 * 1024×800: the content fits with clear space above and below. Anything smaller scrolls normally (section-y).
 */
const PILLAR_PIN_QUERY =
  "(min-width: 1280px) and (min-height: 700px) and (prefers-reduced-motion: no-preference), (min-width: 1024px) and (min-height: 800px) and (prefers-reduced-motion: no-preference)";

/**
 * "What we do": the three pillars as large tabs.
 * Desktop with motion and enough height (PILLAR_PIN_QUERY): the section pins and scrolling advances the pillars
 * (GSAP ScrollTrigger); tabs still work by click/keyboard and scroll the page to that pillar's segment.
 * Otherwise (reduced motion, short or narrow screens): no pinning; tabs (desktop) or an accordion (mobile), with the
 * standard section padding (section-y).
 *
 * Pinned layout: the pinned frame is exactly one viewport tall. It reserves the fixed header's height plus --pin-pad
 * at the top and --pin-pad at the bottom (scaled with the viewport height), and the content is centred in what is
 * left. The pillar image is the only flexible part: it shrinks (down to 7rem) so the rest always fits on short
 * laptop screens, and nothing touches an edge. Spacing inside scales with the viewport height the same way.
 */
export function PillarExplorer({ block, pillars }: { block: Block; pillars: PillarData[] }) {
  const [active, setActive] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<ScrollTrigger | null>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const canPin = useMediaQuery(PILLAR_PIN_QUERY, false);
  const baseId = useId();
  const n = pillars.length;
  const pin = canPin && n > 1;

  useEffect(() => {
    const section = sectionRef.current;
    const pinEl = pinRef.current;
    if (!pin || !section || !pinEl) return;
    let cancelled = false;
    loadGsap().then(({ ScrollTrigger }) => {
      if (cancelled) return;
      triggerRef.current = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: () => `+=${window.innerHeight * 0.75 * n}`,
        pin: pinEl,
        pinSpacing: true,
        anticipatePin: 1,
        // Pins affect everything below; make sure this one is measured first.
        refreshPriority: 1,
        onUpdate: (self) => {
          const i = Math.min(n - 1, Math.floor(self.progress * n * 0.999));
          setActive((cur) => (cur === i ? cur : i));
        },
      });
      ScrollTrigger.refresh();
    });
    return () => {
      cancelled = true;
      triggerRef.current?.kill();
      triggerRef.current = null;
    };
  }, [pin, n]);

  const select = (i: number, focus = false) => {
    const next = (i + n) % n;
    setActive(next);
    if (focus) tabRefs.current[next]?.focus();
    const st = triggerRef.current;
    if (st) {
      // Land in the middle of that pillar's scroll segment.
      const y = st.start + ((st.end - st.start) * (next + 0.5)) / n;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const onKey = (e: React.KeyboardEvent, i: number) => {
    const map: Record<string, number> = { ArrowDown: i + 1, ArrowRight: i + 1, ArrowUp: i - 1, ArrowLeft: i - 1, Home: 0, End: n - 1 };
    if (e.key in map) {
      e.preventDefault();
      select(map[e.key], true);
    }
  };

  if (!n) return null;
  const p = pillars[Math.max(0, active)];

  return (
    <section ref={sectionRef} aria-labelledby={`${baseId}-h`} className="relative bg-navy-950 text-white" data-morph>
      <div
        ref={pinRef}
        className={cx("relative overflow-hidden", pin ? "flex h-[100svh] flex-col pt-[calc(var(--header-h)+var(--pin-pad))] pb-(--pin-pad)" : "section-y")}
        style={pin ? ({ "--pin-pad": "clamp(2.5rem, 8svh, 7.5rem)" } as React.CSSProperties) : undefined}
      >
        {/* soft brand glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-1/4 top-0 h-[120%] w-3/4 rounded-full bg-[radial-gradient(closest-side,rgb(0_112_188/0.28),transparent)]"
        />
        <div className={cx("container-site relative w-full", pin && "min-h-0 flex-1")}>
          <div className={cx("grid-12 gap-y-12 md:gap-y-14", pin &&"h-full grid-rows-[minmax(0,1fr)] items-center")}>
            {/* Left: heading + pillar tabs */}
            <div className="col-span-4 md:col-span-12 lg:col-span-5">
              {block.eyebrow && <Eyebrow tone="dark">{block.eyebrow}</Eyebrow>}
              <h2 id={`${baseId}-h`} className="mt-4 text-h2 text-white">
                {block.heading ?? "What we do"}
              </h2>
              {block.body && <p className="mt-5 max-w-md text-on-navy-muted">{block.body}</p>}

              {/* Desktop tabs */}
              <div role="tablist" aria-label="Service pillars" aria-orientation="vertical" className={cx("hidden lg:block", pin ? "mt-[clamp(2rem,6svh,3.5rem)]" : "mt-14")}>
                {pillars.map((pl, i) => {
                  const on = i === active;
                  return (
                    <button
                      key={pl.slug}
                      ref={(el) => {
                        tabRefs.current[i] = el;
                      }}
                      id={`${baseId}-tab-${i}`}
                      role="tab"
                      type="button"
                      aria-selected={on}
                      aria-controls={`${baseId}-panel`}
                      tabIndex={on ? 0 : -1}
                      onClick={() => select(i)}
                      onKeyDown={(e) => onKey(e, i)}
                      className={cx("group relative block w-full border-t border-navy-700 text-left last:border-b", pin ? "py-[clamp(0.875rem,2.6svh,1.5rem)]" : "py-6")}
                    >
                      <span aria-hidden="true" className="absolute left-0 top-[-1px] h-px w-full origin-left bg-sky-400 transition-transform duration-700 ease-(--ease-out-expo)" style={{ transform: `scaleX(${on ? 1 : 0})` }} />
                      <span className="flex items-baseline gap-5">
                        <span className={cx("font-display text-sm font-bold tabular-nums transition-colors", on ? "text-sky-400" : "text-on-navy-muted")}>
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span
                          className={cx(
                            "font-display text-h3 font-bold [font-stretch:112%] transition-colors duration-(--duration-base)",
                            on ? "text-white" : "text-white/45 group-hover:text-white/80",
                          )}
                        >
                          {pl.name}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right: active pillar (desktop) */}
            <div
              id={`${baseId}-panel`}
              role="tabpanel"
              aria-labelledby={`${baseId}-tab-${active}`}
              className={cx("col-span-7 col-start-6 hidden lg:block", pin && "max-h-full min-h-0 lg:flex lg:flex-col")}
            >
              <AnimatePresence mode="wait" initial={false}>
                <m.div
                  key={p.slug}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.45, ease: [0.2, 0.7, 0.2, 1] }}
                  className={cx("flex flex-col", pin && "max-h-full min-h-0")}
                >
                  <div
                    className={cx(
                      "relative overflow-hidden rounded-card bg-navy-900",
                      // 16/8; when pinned it is the one item that shrinks (to 7rem at least) so the rest fits short screens.
                      "aspect-[16/8]",
                      pin && "min-h-28 shrink",
                    )}
                  >
                    <m.div
                      className="absolute inset-0"
                      initial={{ scale: 1.08 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 1.2, ease: [0.2, 0.7, 0.2, 1] }}
                    >
                      <Img media={p.image} sizes="(min-width: 1280px) 720px, 58vw" className="opacity-90" />
                    </m.div>
                    <span aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-navy-950/70 to-transparent" />
                    {p.outcomeLine && (
                      <p className="absolute bottom-0 left-0 max-w-lg p-6 font-display text-h4 font-semibold leading-snug text-white [font-stretch:108%]">
                        {p.outcomeLine}
                      </p>
                    )}
                  </div>
                  <div className={cx("shrink-0", pin ? "mt-[clamp(1.25rem,3.5svh,2rem)]" : "mt-8")}>
                    {(p.summary || p.tagline) && <p className="max-w-2xl text-lead text-on-navy-muted">{p.summary ?? p.tagline}</p>}
                    <ul className={cx("grid grid-cols-2 gap-x-8", pin ? "mt-[clamp(1.25rem,4svh,2.5rem)]" : "mt-10")}>
                      {p.services.map((s) => (
                        <li key={s.slug} className="border-b border-navy-800">
                          <Link href={s.href} className="group flex items-center justify-between gap-4 py-3.5 font-semibold text-white hover:text-sky-300">
                            {s.name}
                            <Icon name="arrowRight" size={18} className="shrink-0 text-sky-400 transition-transform group-hover:translate-x-1" />
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <ArrowLink href={`/services/${p.slug}`} tone="dark" className={pin ? "mt-[clamp(1.25rem,3.5svh,2rem)]" : "mt-8"}>
                      Explore {p.name}
                    </ArrowLink>
                  </div>
                </m.div>
              </AnimatePresence>
            </div>

            {/* Mobile / tablet accordion */}
            <ul className="col-span-4 md:col-span-12 lg:hidden">
              {pillars.map((pl, i) => {
                const on = i === active;
                return (
                  <li key={pl.slug} className="border-t border-navy-700 last:border-b">
                    <h3>
                      <button
                        type="button"
                        aria-expanded={on}
                        aria-controls={`${baseId}-acc-${i}`}
                        onClick={() => setActive(on ? -1 : i)}
                        className="flex w-full items-center justify-between gap-4 py-5 text-left"
                      >
                        <span className="flex items-baseline gap-4">
                          <span className="font-display text-sm font-bold text-sky-400">{String(i + 1).padStart(2, "0")}</span>
                          <span className="font-display text-h3 font-bold [font-stretch:112%]">{pl.name}</span>
                        </span>
                        <Icon name={on ? "minus" : "plus"} className="shrink-0" />
                      </button>
                    </h3>
                    <AnimatePresence initial={false}>
                      {on && (
                        <m.div
                          id={`${baseId}-acc-${i}`}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: [0.2, 0.7, 0.2, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="pb-8">
                            <div className="relative aspect-[16/9] overflow-hidden rounded-card bg-navy-900">
                              <Img media={pl.image} sizes="(min-width: 768px) 90vw, 100vw" />
                            </div>
                            {pl.outcomeLine && <p className="mt-5 font-display text-h4 font-semibold">{pl.outcomeLine}</p>}
                            {(pl.summary || pl.tagline) && <p className="mt-3 text-on-navy-muted">{pl.summary ?? pl.tagline}</p>}
                            <ul className="mt-6">
                              {pl.services.map((s) => (
                                <li key={s.slug} className="border-b border-navy-800">
                                  <Link href={s.href} className="flex min-h-12 items-center justify-between gap-4 font-semibold">
                                    {s.name}
                                    <Icon name="arrowRight" size={18} className="text-sky-400" />
                                  </Link>
                                </li>
                              ))}
                            </ul>
                            <ArrowLink href={`/services/${pl.slug}`} tone="dark" className="mt-6">
                              Explore {pl.name}
                            </ArrowLink>
                          </div>
                        </m.div>
                      )}
                    </AnimatePresence>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
