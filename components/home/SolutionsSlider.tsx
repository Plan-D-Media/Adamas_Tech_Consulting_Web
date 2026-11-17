"use client";

import type { ReactNode } from "react";
import { cx } from "@/lib/cx";
import { ArrowLink } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SliderControls } from "@/components/ui/SliderControls";
import { useSlider } from "@/components/motion/useSlider";

interface Props {
  eyebrow: string;
  heading: string;
  body: string;
  ctaLabel: string;
  ctaHref: string;
  /** How many slides the track holds, for the counter and the prev/next buttons. */
  count: number;
  /** The cards, rendered on the server (components/home/SolutionCard.tsx). */
  children: ReactNode;
}

/**
 * The Products & Solutions track: the scroll-snap container, its counter and its prev/next buttons.
 *
 * Only this shell is a client component (LCP work, 17 Nov 2026). The cards themselves are server-rendered and
 * arrive as children, so their markup stays out of the client bundle and their elements out of the hydration pass.
 * The track is a plain scroll-snap container, so it still scrolls with JavaScript off.
 */
export function SolutionsSlider({ eyebrow, heading, body, ctaLabel, ctaHref, count, children }: Props) {
  const { trackRef, index, prev, next } = useSlider(count);
  return (
    <>
      <SectionHeader
        id="solutions-heading"
        eyebrow={eyebrow}
        heading={heading}
        body={body}
        innerClassName="max-w-[45rem]"
        eyebrowClassName="lg:h-[20px]"
        aside={
          <div className="flex flex-wrap items-center gap-6">
            <ArrowLink href={ctaHref} tone="text-[#0070BC] hover:text-blue-600" className="text-[1.0625rem]">
              {ctaLabel}
            </ArrowLink>
            {count > 1 && <SliderControls variant="outline" index={index} total={count} onPrev={prev} onNext={next} label="solutions" />}
          </div>
        }
      />
      <div ref={trackRef} className={cx("scrollbar-none mt-10 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-2 lg:mt-[50px]")} aria-label="Products and solutions">
        {children}
      </div>
    </>
  );
}
