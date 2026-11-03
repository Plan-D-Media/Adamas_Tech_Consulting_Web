"use client";

import Link from "next/link";
import Image from "next/image";
import { Fragment, useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import type { AnnouncementData, HeroSlideData } from "@/lib/data/home";
import { cx } from "@/lib/cx";
import { Icon } from "@/components/ui/Icon";
import { HeroVideo } from "@/components/media/HeroVideo";
import { isConstrainedConnection, usePrefersReducedMotion } from "@/components/motion/useReducedMotion";
import { AnnouncementStrip } from "./AnnouncementStrip";

const STORY_MS = 7000;
const VIDEO_DELAY_MS = 1500; // after `load` + idle, so video never competes with LCP or hydration

/**
 * Full-bleed cinematic hero with a progress-bar story navigator.
 * - Story timing is driven by the CSS progress animation (pausing it pauses the carousel).
 * - Reduced motion: starts paused, no video, no Ken Burns; posters only.
 * - Save-Data / 2G: posters only.
 */
export function HeroStories({ slides, announcements = [] }: { slides: HeroSlideData[]; announcements?: AnnouncementData[] }) {
  const reduced = usePrefersReducedMotion();
  const [index, setIndex] = useState(0);
  const [userPaused, setUserPaused] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const baseId = useId();
  const count = slides.length;
  const paused = userPaused || reduced || count < 2;
  const videoAllowed = videoReady && !reduced;

  // Video loads only once the page has fully loaded and the main thread is idle; never on Save-Data / 2G.
  useEffect(() => {
    if (reduced) return;
    let timer = 0;
    let idleId = 0;
    const arm = () => {
      const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 200));
      idleId = idle(() => {
        timer = window.setTimeout(() => {
          if (!isConstrainedConnection()) setVideoReady(true);
        }, VIDEO_DELAY_MS);
      }) as number;
    };
    if (document.readyState === "complete") arm();
    else window.addEventListener("load", arm, { once: true });
    return () => {
      window.removeEventListener("load", arm);
      window.cancelIdleCallback?.(idleId);
      window.clearTimeout(timer);
    };
  }, [reduced]);

  const go = useCallback(
    (i: number, focus = false) => {
      const next = (i + count) % count;
      setIndex(next);
      if (focus) tabRefs.current[next]?.focus();
    },
    [count],
  );

  const onTabKey = (e: React.KeyboardEvent, i: number) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      go(i + 1, true);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      go(i - 1, true);
    } else if (e.key === "Home") {
      e.preventDefault();
      go(0, true);
    } else if (e.key === "End") {
      e.preventDefault();
      go(count - 1, true);
    }
  };

  if (!count) return null;

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured stories"
      className="relative isolate flex h-[100svh] max-h-[60rem] min-h-[40rem] flex-col overflow-hidden bg-navy-950 text-white"
    >
      {/* Media layers */}
      {slides.map((s, i) => {
        const active = i === index;
        return (
          <div
            key={s.id}
            aria-hidden="true"
            className={cx(
              "absolute inset-0 -z-20 transition-opacity duration-[1100ms] ease-(--ease-in-out-smooth)",
              active ? "opacity-100" : "opacity-0",
            )}
          >
            <div
              key={active ? `kb-${index}` : undefined}
              className={cx("absolute inset-0", active && !reduced && "animate-[kenburns_9s_var(--ease-out-expo)_forwards]")}
            >
              {s.poster ? (
                <Image
                  src={s.poster.url}
                  alt=""
                  fill
                  sizes="100vw"
                  preload={i === 0}
                  fetchPriority={i === 0 ? "high" : "low"}
                  placeholder={s.poster.blurDataUrl ? "blur" : "empty"}
                  blurDataURL={s.poster.blurDataUrl ?? undefined}
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 bg-linear-to-br from-navy-900 via-indigo-800 to-navy-950" />
              )}
              {videoAllowed && active && <HeroVideo vimeoId={s.vimeoId} videoUrl={s.videoUrl} title={`${s.navLabel} background video`} />}
            </div>
          </div>
        );
      })}

      {/* Scrim: guarantees text contrast regardless of the frame */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-linear-to-r from-navy-950/90 via-navy-950/55 to-navy-950/10" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-linear-to-t from-navy-950 via-navy-950/30 to-transparent" />

      {/* Copy */}
      <div className="container-site flex flex-1 flex-col justify-end pb-10 pt-[calc(var(--header-h)+3rem)] md:pb-14">
        <div className="grid-12">
          <div className="col-span-4 md:col-span-10 lg:col-span-8">
            {slides.map((s, i) => (
              <div
                key={s.id}
                id={`${baseId}-slide-${i}`}
                role="tabpanel"
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${count}: ${s.navLabel}`}
                aria-labelledby={`${baseId}-tab-${i}`}
                hidden={i !== index}
              >
                <SlideCopy slide={s} active={i === index} headingLevel={i === 0 ? "h1" : "p"} intro={i === 0} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Announcements + story navigator */}
      <div className="container-site pb-[max(1.5rem,env(safe-area-inset-bottom))]">
        {announcements.length > 0 && (
          <div className="mb-5">
            <AnnouncementStrip items={announcements} />
          </div>
        )}
        <div className="flex items-end gap-4 border-t border-white/20 md:gap-6">
          <div role="tablist" aria-label="Choose a story" className="grid flex-1 grid-flow-col auto-cols-fr">
            {slides.map((s, i) => {
              const active = i === index;
              return (
                <button
                  key={s.id}
                  ref={(el) => {
                    tabRefs.current[i] = el;
                  }}
                  id={`${baseId}-tab-${i}`}
                  role="tab"
                  type="button"
                  aria-selected={active}
                  aria-controls={`${baseId}-slide-${i}`}
                  tabIndex={active ? 0 : -1}
                  onClick={() => go(i)}
                  onKeyDown={(e) => onTabKey(e, i)}
                  className={cx(
                    "group relative -mt-px pb-1 pr-3 pt-4 text-left transition-colors md:pr-6 md:pt-5",
                    active ? "text-white" : "text-white/60 hover:text-white",
                  )}
                >
                  {/* progress track */}
                  <span aria-hidden="true" className="absolute inset-x-0 top-0 block h-0.5 overflow-hidden md:right-6">
                    <span
                      key={active ? `p-${index}` : "idle"}
                      onAnimationEnd={() => active && go(index + 1)}
                      className={cx(
                        "block h-full origin-left bg-sky-400",
                        active ? (paused ? "scale-x-100" : "animate-[hero-progress_linear_forwards]") : "scale-x-0",
                      )}
                      style={active && !paused ? { animationDuration: `${STORY_MS}ms` } : undefined}
                    />
                  </span>
                  <span className="block font-display text-sm font-bold tabular-nums [font-stretch:112%]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="mt-1 hidden text-sm font-semibold leading-snug md:block">{s.navLabel}</span>
                </button>
              );
            })}
          </div>
          {count > 1 && (
            <button
              type="button"
              onClick={() => setUserPaused((p) => !p)}
              disabled={reduced}
              className="mb-1 inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-white/40 text-white transition-colors hover:border-white hover:bg-white/10 disabled:opacity-40"
            >
              <Icon name={paused ? "play" : "pause"} size={18} />
              <span className="sr-only">{paused ? "Play stories" : "Pause stories"}</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

/**
 * Headline revealed line by line: words are measured after layout and grouped by rendered line.
 * Hidden states live in globals.css under .js, so the copy stays visible without JavaScript.
 *
 * The first story (`intro`) is server-rendered already "in" and plays a CSS-only entrance from first paint,
 * so its text is the LCP candidate immediately rather than after hydration. Later stories use the
 * JS-driven line-by-line transitions.
 */
function SlideCopy({ slide, active, headingLevel, intro }: { slide: HeroSlideData; active: boolean; headingLevel: "h1" | "p"; intro: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const [lines, setLines] = useState(1);
  const [shown, setShown] = useState(intro);
  const [playIntro, setPlayIntro] = useState(intro);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || !active) return;
    const measure = () => {
      let line = -1;
      let lastTop = -Infinity;
      for (const w of el.querySelectorAll<HTMLElement>("[data-w]")) {
        const top = w.offsetTop;
        if (top > lastTop + 2) {
          line += 1;
          lastTop = top;
        }
        w.style.setProperty("--line", String(line));
      }
      setLines(line + 1);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [slide.headline, active]);

  // Reveal two frames after activation; reset when the slide is left so it animates again next time.
  useEffect(() => {
    if (!active) return;
    let inner = 0;
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => setShown(true));
    });
    return () => {
      cancelAnimationFrame(outer);
      cancelAnimationFrame(inner);
      setShown(false);
      setPlayIntro(false);
    };
  }, [active]);

  const Heading = headingLevel;
  const words = slide.headline.split(/\s+/);
  const after = `${lines * 110 + 220}ms`;

  return (
    <div className={cx("hero-copy", shown && "is-in", playIntro && "hero-intro")}>
      {slide.eyebrow && (
        <p data-fade className="eyebrow mb-5 flex items-center gap-3 text-sky-400">
          <span aria-hidden="true" className="h-px w-8 bg-sky-400" />
          {slide.eyebrow}
        </p>
      )}
      <Heading ref={ref as never} className="font-display text-display-xl font-bold [font-stretch:100%] sm:[font-stretch:106%]">
        {words.map((w, i) => (
          <Fragment key={i}>
            <span className="inline-block overflow-hidden pb-[0.08em] align-top">
              <span data-w className="inline-block">
                {w}
              </span>
            </span>
            {i < words.length - 1 && " "}
          </Fragment>
        ))}
      </Heading>
      {slide.body && (
        <p data-fade className="mt-6 max-w-[38rem] text-lead text-on-navy-muted" style={{ transitionDelay: after }}>
          {slide.body}
        </p>
      )}
      <div data-fade className="mt-8" style={{ transitionDelay: `${lines * 110 + 300}ms` }}>
        <Link
          href={slide.ctaHref}
          data-magnetic
          className="btn group/btn inline-flex min-h-13 items-center gap-3 rounded-btn bg-orange-500 px-7 text-base font-semibold text-navy-950 hover:bg-orange-600"
        >
          {slide.ctaLabel}
          <Icon name="arrowRight" size={18} className="transition-transform group-hover/btn:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
}
