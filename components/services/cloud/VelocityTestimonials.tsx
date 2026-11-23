"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useAnimationFrame, useInView, useMotionValue, useScroll, useSpring, useTransform, useVelocity } from "motion/react";
import { Img } from "@/components/media/Img";
import type { CloudTestimonial } from "@/lib/cloud-services-content";

/**
 * The testimonial row on /services/cloud-services, with React Bits' "Scroll Velocity" behaviour
 * (https://reactbits.dev/text-animations/scroll-velocity): the row drifts slowly on its own, speeds up with the
 * page's scroll velocity, and reverses when the reader scrolls back up.
 *
 * Written from scratch against `motion` (already a dependency), not copied from React Bits, so no third-party
 * licence or attribution notice attaches to this file. The mechanism is the standard one:
 *
 *   scrollY -> useVelocity -> useSpring (smoothing) -> useTransform to a multiplier
 *
 * and a per-frame integration of a base drift multiplied by that factor, wrapped into [-50%, 0] so the duplicated
 * set makes the loop seamless. `wrap` is three lines, so popmotion is not pulled in for it.
 *
 * The brief's fallbacks, and how each is met:
 * - **Design has room for one row only**, so one row, as drawn.
 * - **Without JavaScript**, and under `prefers-reduced-motion`, the server HTML is a static grid of the cards
 *   and `animate` never becomes true, so the duplicate set is never rendered either.
 * - **Hover or focus pauses** the row; the cards stay fully readable while it moves (nothing is scaled or faded).
 * - **Off-screen it stops**: `useInView` gates the frame callback, so an unseen section costs no main-thread work
 *   and cannot add to TBT.
 */

/** Wrap `v` into [min, max) - the modulo that keeps the track's translate inside one set. */
function wrap(min: number, max: number, v: number) {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
}

/** Pixels per second the row drifts with the page still. */
const BASE_DRIFT = 28;

export function VelocityTestimonials({ items }: { items: readonly CloudTestimonial[] }) {
  const [animate, setAnimate] = useState(false);
  const [paused, setPaused] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const inView = useInView(sectionRef, { margin: "200px" });

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setAnimate(!mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smooth = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  // Past ~1200 px/s the row would outrun legibility, so the multiplier is clamped rather than left open-ended.
  const factor = useTransform(smooth, [-1200, 0, 1200], [-6, 0, 6], { clamp: true });
  const direction = useRef(1);

  useAnimationFrame((_t, delta) => {
    if (!animate || paused || !inView) return;
    const f = factor.get();
    if (f < -0.01) direction.current = 1; // scrolling up reverses the drift
    else if (f > 0.01) direction.current = -1;
    const move = direction.current * BASE_DRIFT * (delta / 1000) * (1 + Math.abs(f));
    baseX.set(wrap(-50, 0, baseX.get() + (move / (trackRef.current?.scrollWidth || 1)) * 100));
  });

  const x = useTransform(baseX, (v) => `${v}%`);
  const sets = animate ? [0, 1] : [0];

  return (
    <div ref={sectionRef} className="mt-8 lg:mt-[44px]">
      {animate ? (
        <div
          className="overflow-hidden"
          onPointerEnter={() => setPaused(true)}
          onPointerLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
        >
          <motion.ul ref={trackRef} className="flex w-max" style={{ x }} role="list">
            {sets.map((set) =>
              items.map((t) => (
                <li
                  key={`${set}-${t.name}`}
                  className="mr-6 w-[320px] shrink-0 lg:w-[388px]"
                  {...(set > 0 ? { "aria-hidden": true, inert: true } : {})}
                >
                  <TestimonialCard t={t} />
                </li>
              )),
            )}
          </motion.ul>
        </div>
      ) : (
        <ul className="container-cloud grid gap-6 sm:grid-cols-2" role="list">
          {items.map((t) => (
            <li key={t.name}>
              <TestimonialCard t={t} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function TestimonialCard({ t }: { t: CloudTestimonial }) {
  return (
    <figure className="h-full rounded-xl bg-black p-6 text-white">
      <figcaption className="u-display text-[1.125rem] font-extrabold">&ldquo;{t.quote}&rdquo;</figcaption>
      <blockquote className="mt-3 text-[0.875rem] leading-[1.7] text-white/75">{t.body}</blockquote>
      <div className="mt-5 flex items-center gap-3">
        <Img src={t.avatar} alt="" aria-hidden="true" width={40} height={40} sizes="40px" className="h-10 w-10 rounded-full object-cover" />
        <span>
          <span className="block text-[0.875rem] font-bold">{t.name}</span>
          <span className="block text-[0.75rem] text-white/65">{t.role}</span>
        </span>
      </div>
    </figure>
  );
}
