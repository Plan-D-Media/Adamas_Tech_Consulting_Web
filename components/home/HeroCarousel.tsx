"use client";

import Link from "next/link";
import { useReducedMotion } from "@/lib/use-client-snapshot";
import { useEffect, useRef, useState } from "react";
import type { ClaimData } from "@/lib/data/home";
import { cx } from "@/lib/cx";
import { useHydrated } from "@/lib/use-client-snapshot";
import { Icon, type IconName } from "@/components/ui/Icon";
import { SliderControls } from "@/components/ui/SliderControls";
import { useSlider } from "@/components/motion/useSlider";
import { Img } from "@/components/media/Img";

export interface HeroCard {
  id: string;
  category: string;
  eyebrow: string | null;
  title: string;
  href: string;
  external: boolean;
  image: { url: string; alt: string } | null;
  /** The image already carries the whole card design (designer-baked artwork, used by the Figma fixture). */
  artwork?: boolean;
}

const AUTO_MS = 7000;
const CATEGORY_ICON: Record<string, IconName> = { event: "calendar", solutions: "layers", solution: "layers", "case study": "chart", "case-study": "chart" };
const CLAIM_ICON: IconName[] = ["thumbs-up", "shield"];

function Card({ card, priority }: { card: HeroCard; priority: boolean }) {
  const icon = CATEGORY_ICON[card.category.toLowerCase()] ?? "layers";
  const inner = card.artwork ? (
    card.image && <Img src={card.image.url} alt={card.title} fill sizes="(min-width: 1440px) 401px, (min-width: 1024px) 33vw, 82vw" priority={priority} className="object-cover" />
  ) : (
    <>
      {/* The first card is the page's LCP element on phones: loaded eagerly with high priority (Lighthouse round 7). */}
      {card.image && <Img src={card.image.url} alt={card.image.alt} fill sizes="(min-width: 1440px) 401px, (min-width: 1024px) 33vw, 82vw" priority={priority} className="object-cover" />}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgb(0_12_51/0.82)_0%,rgb(0_12_51/0.45)_55%,rgb(0_12_51/0.1)_100%)]" aria-hidden="true" />
      <div className="relative flex h-full flex-col p-4">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-blue-600/85 text-white">
          <Icon name={icon} size={16} />
        </span>
        <p className="mt-auto font-body text-[0.75rem] font-semibold text-white/80">{card.eyebrow ?? card.category}</p>
        <p className="mt-1 max-w-[16rem] font-body text-[1.0625rem] font-semibold leading-snug text-white">{card.title}</p>
        <span className="mt-3 inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/40 text-white" aria-hidden="true">
          <Icon name="arrow" size={12} />
        </span>
      </div>
    </>
  );
  // Three cards fill the 1240px track at desktop (Figma: 401 + 381 + 401 with 24px gaps); narrower screens show one or two.
  const cls = "group relative block h-[217px] w-full overflow-hidden rounded-xl ring-[1.5px] ring-white/50 transition-transform duration-(--duration-slow) ease-(--ease-out) hover:-translate-y-1 focus-visible:outline-offset-4";
  return card.external ? (
    <a href={card.href} target="_blank" rel="noopener noreferrer" className={cls}>
      {inner}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  ) : (
    <Link href={card.href} className={cls}>
      {inner}
    </Link>
  );
}

/**
 * Hero card carousel (Figma Frame 47 + Container 236:1405): three cards visible, prev/next, counter, progress bars,
 * a pause control and keyboard arrows. Auto-advances every 7s (not with reduced motion; paused on hover, focus or
 * the pause button). The track is a plain scroll-snap container, so it works without JavaScript.
 */
export function HeroCarousel({ cards, claims }: { cards: HeroCard[]; claims: ClaimData[] }) {
  const { trackRef, index, wrapPrev, wrapNext } = useSlider(cards.length);
  const [paused, setPaused] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const reduce = useReducedMotion();
  const hydrated = useHydrated();
  // Auto-advance only in the browser, with more than one card and no reduced-motion preference.
  const auto = hydrated && cards.length > 1 && !reduce;
  const start = useRef<number>(0);

  useEffect(() => {
    if (!auto || paused || hovering) return;
    start.current = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = (now - start.current) / AUTO_MS;
      if (t >= 1) {
        wrapNext();
        start.current = now;
        setElapsed(0);
      } else {
        setElapsed(t);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // wrapNext changes with index; restarting the timer on each slide is intended.
  }, [auto, paused, hovering, wrapNext]);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      wrapNext();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      wrapPrev();
    }
  };

  return (
    <div className="mt-10 lg:mt-12" onPointerEnter={() => setHovering(true)} onPointerLeave={() => setHovering(false)} onFocus={() => setHovering(true)} onBlur={() => setHovering(false)}>
      <div
        ref={trackRef}
        role="region"
        aria-roledescription="carousel"
        aria-label="Highlights"
        tabIndex={0}
        onKeyDown={onKey}
        className="scrollbar-none mx-auto flex max-w-[77.5rem] snap-x snap-mandatory gap-6 overflow-x-auto px-[5px] py-[5px] [scroll-padding-inline:5px] focus-visible:outline-offset-4"
        style={{ filter: "drop-shadow(0 24px 6px rgb(0 0 0 / 0.25))" }}
      >
        {cards.map((c, i) => (
          <div key={c.id} role="group" aria-roledescription="slide" aria-label={`${i + 1} of ${cards.length}`} className={cx("w-[min(401px,82vw)] shrink-0 snap-start lg:w-[calc((100%-58px)/3)]", i % 3 === 1 ? "min-[1440px]:w-[381px]" : "min-[1440px]:w-[401px]")}>
            <Card card={c} priority={i < 3} />
          </div>
        ))}
      </div>

      <div className="mx-auto mt-[18px] flex max-w-[77rem] flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        {claims.length > 0 && (
          <ul className="flex flex-wrap items-center gap-x-24 gap-y-3" role="list" aria-label="Commitments">
            {claims.map((c, i) => (
              <li key={c.key} className="inline-flex items-center gap-2.5 font-ui text-[clamp(1rem,0.9rem+0.4vw,1.5rem)] font-bold uppercase leading-[1.17] text-white xl:text-[1.5rem]">
                <Icon name={CLAIM_ICON[i % CLAIM_ICON.length]} size={20} className="shrink-0" />
                <span>
                  {c.value}
                  {c.label ? ` ${c.label}` : ""}
                </span>
                {c.draft && <span className="rounded-xs bg-orange-500 px-1.5 py-0.5 font-body text-[0.625rem] font-bold tracking-wider text-navy-950">Draft</span>}
              </li>
            ))}
          </ul>
        )}
        {cards.length > 1 && (
          <SliderControls
            variant="dark"
            index={index}
            total={cards.length}
            onPrev={wrapPrev}
            onNext={wrapNext}
            progress
            elapsed={auto && !paused ? elapsed : index >= 0 ? 0 : 0}
            paused={paused || !auto}
            onTogglePause={auto ? () => setPaused((p) => !p) : undefined}
            label="highlights"
            className={cx("sm:ml-auto")}
          />
        )}
      </div>
    </div>
  );
}
