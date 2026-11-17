"use client";

import Link from "next/link";
import type { BlockExtra } from "@/lib/data/home-blocks";
import { mediaUrl } from "@/lib/media";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SliderControls } from "@/components/ui/SliderControls";
import { useSlider } from "@/components/motion/useSlider";
import { Img } from "@/components/media/Img";

type Story = BlockExtra<"stories">["items"][number];

const fmtDate = (iso?: string) => (iso ? new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/London" }).format(new Date(iso)) : null);

/**
 * Top Stories slider (Figma Frame 50): 1217px cards 37px apart, the active card centred with its neighbours peeking in on
 * both sides. The track loops (useSlider loop mode): a copy of the last story leads and a copy of the first trails,
 * added after hydration so a no-JavaScript visitor sees the plain list.
 */
export function StoriesSlider({ eyebrow, heading, body, items }: { eyebrow: string; heading: string; body: string; items: Story[] }) {
  const { trackRef, index, loopReady, prev, next } = useSlider(items.length, { loop: items.length > 1 });
  const wave = mediaUrl("images/home/story-wave.webp");
  // Stable keys: the real stories keep their <article> elements when the two copies are inserted after hydration (index
  // keys shifted the content instead and left the last two elements unrevealed, QA BUG-006).
  const real = items.map((story, i) => ({ story, clone: false, key: `s${i}` }));
  const slides = loopReady && items.length > 1 ? [{ story: items[items.length - 1], clone: true, key: "clone-last" }, ...real, { story: items[0], clone: true, key: "clone-first" }] : real;
  return (
    <>
      <div className="container-chrome">
        <SectionHeader
          id="stories-heading"
          eyebrow={eyebrow}
          eyebrowClassName="text-[1.125rem]"
          heading={heading}
          body={body}
          aside={items.length > 1 ? <SliderControls variant="light" index={index} total={items.length} onPrev={prev} onNext={next} label="stories" className="lg:mb-1" /> : undefined}
        />
      </div>
      <div
        ref={trackRef}
        className="scrollbar-none mt-[31px] flex snap-x snap-mandatory gap-[37px] overflow-x-auto px-[max(var(--gutter),calc((100%-76.0625rem)/2))] pb-6 [scroll-padding-inline:max(var(--gutter),calc((100%-76.0625rem)/2))]"
        aria-label="Stories"
      >
        {slides.map(({ story: s, clone, key }) => {
          const date = fmtDate(s.date);
          return (
            <article
              key={key}
              aria-hidden={clone || undefined}
              // The copies are added after the reveal pass has started, so they are never part of it: always visible.
              data-reveal={clone ? undefined : ""}
              className="relative flex w-[min(76.0625rem,calc(100vw-2*var(--gutter)))] shrink-0 snap-start flex-col overflow-hidden rounded-2xl bg-tint-50 shadow-[0_2px_18.4px_rgb(5_44_89/0.12)] ring-1 ring-white lg:h-[365px] lg:flex-row"
              style={{ backgroundImage: `linear-gradient(90deg, rgb(255 255 255), rgb(255 255 255 / 0)), url(${wave})`, backgroundSize: "cover" }}
            >
              {s.image && (
                <div className="relative h-56 w-full shrink-0 overflow-hidden rounded-2xl lg:my-px lg:ml-px lg:h-[363px] lg:w-[45%] xl:w-[561px]">
                  <Img src={s.image} alt={s.imageAlt} fill sizes="(min-width: 1280px) 561px, (min-width: 1024px) 45vw, 100vw" className="object-cover" />
                </div>
              )}
              {/* Figma SectionTitle 578px wide at x 595 of the card; the title box is fixed at 149px (two lines) with the text 17px below. */}
              <div className="flex min-w-0 flex-col px-6 py-6 lg:py-7 lg:pl-[34px] lg:pr-[44px] xl:w-[658px]">
                {date && <p className="eyebrow text-[1.125rem] lg:leading-[15px]">{date}</p>}
                <h3 className="mt-3 font-heading text-[clamp(1.5rem,1.2rem+1vw,2.375rem)] font-bold leading-[1.29] tracking-[-0.04em] text-navy-800 [text-wrap:wrap] lg:min-h-[137px]">{s.title}</h3>
                {s.body && <p className="mt-[17px] max-w-[34.75rem] font-heading text-[1.125rem] leading-[1.36] text-grey-600">{s.body}</p>}
                <Link href={s.href} tabIndex={clone ? -1 : undefined} className="mt-[17px] inline-flex w-fit items-center font-heading text-[1.125rem] font-medium text-blue-600 underline-offset-4 hover:underline lg:mt-[28px]">
                  Read full story&rarr;
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}
