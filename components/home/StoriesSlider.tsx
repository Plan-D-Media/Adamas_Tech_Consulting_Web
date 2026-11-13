"use client";

import Link from "next/link";
import type { BlockExtra } from "@/lib/data/home-blocks";
import { mediaUrl } from "@/lib/media";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SliderControls } from "@/components/ui/SliderControls";
import { useSlider } from "@/components/motion/useSlider";

type Story = BlockExtra<"stories">["items"][number];

const fmtDate = (iso?: string) => (iso ? new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/London" }).format(new Date(iso)) : null);

export function StoriesSlider({ eyebrow, heading, body, items }: { eyebrow: string; heading: string; body: string; items: Story[] }) {
  const { trackRef, index, prev, next } = useSlider(items.length);
  const wave = mediaUrl("images/home/story-wave.webp");
  return (
    <>
      <div className="container-chrome">
        <SectionHeader
          id="stories-heading"
          eyebrow={eyebrow}
          heading={heading}
          body={body}
          aside={items.length > 1 ? <SliderControls variant="light" index={index} total={items.length} onPrev={prev} onNext={next} label="stories" /> : undefined}
        />
      </div>
      <div
        ref={trackRef}
        className="scrollbar-none mt-9 flex snap-x snap-mandatory gap-[37px] overflow-x-auto px-[max(var(--gutter),calc((100%-76.0625rem)/2))] pb-6 [scroll-padding-inline:max(var(--gutter),calc((100%-76.0625rem)/2))]"
        aria-label="Stories"
      >
        {items.map((s, i) => {
          const date = fmtDate(s.date);
          return (
            <article
              key={i}
              data-reveal
              className="relative flex w-[min(76.0625rem,calc(100vw-2*var(--gutter)))] shrink-0 snap-start flex-col overflow-hidden rounded-2xl bg-tint-50 shadow-[0_2px_18.4px_rgb(5_44_89/0.12)] ring-1 ring-white lg:h-[365px] lg:flex-row"
              style={{ backgroundImage: `linear-gradient(90deg, rgb(255 255 255), rgb(255 255 255 / 0)), url(${wave})`, backgroundSize: "cover" }}
            >
              {s.image && (
                <div className="relative h-56 w-full shrink-0 overflow-hidden rounded-2xl lg:h-full lg:w-[45%] xl:w-[561px]">
                  <img src={s.image} alt={s.imageAlt} width={561} height={363} className="h-full w-full object-cover" loading="lazy" decoding="async" />
                </div>
              )}
              <div className="flex min-w-0 flex-col px-6 py-6 lg:max-w-[40rem] lg:py-7 lg:pl-[34px] lg:pr-8">
                {date && <p className="eyebrow text-[1.125rem]">{date}</p>}
                <h3 className="mt-3 font-heading text-[clamp(1.5rem,1.2rem+1vw,2.375rem)] font-bold leading-[1.29] tracking-[-0.04em] text-navy-800">{s.title}</h3>
                {s.body && <p className="mt-[17px] max-w-[35rem] font-heading text-[1.125rem] leading-[1.36] text-grey-600">{s.body}</p>}
                <Link href={s.href} className="mt-[17px] inline-flex w-fit items-center font-heading text-[1.125rem] font-medium text-blue-600 underline-offset-4 hover:underline">
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
