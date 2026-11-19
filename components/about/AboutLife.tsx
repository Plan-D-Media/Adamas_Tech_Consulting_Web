import Link from "next/link";
import { Img } from "@/components/media/Img";
import { Icon } from "@/components/ui/Icon";
import { DraftNote } from "@/components/ui/DraftTag";
import type { FigmaDraftContent } from "@/lib/figma-draft";

/** The collage, as percentages of the 1194x860 box the frame gives it (y 8251-9111). */
const PHOTOS = [
  { src: "images/about/life-1.webp", left: "7.7%", top: "1%", width: "28.6%", ratio: "341 / 209" },
  { src: "images/about/life-2.webp", left: "75.5%", top: "2%", width: "19.9%", ratio: "238 / 146" },
  { src: "images/about/life-4.webp", left: "82.3%", top: "51%", width: "17.8%", ratio: "212 / 206" },
  { src: "images/about/life-3.webp", left: "0%", top: "69%", width: "17.8%", ratio: "212 / 130" },
  { src: "images/about/life-2.webp", left: "32.3%", top: "83%", width: "19.9%", ratio: "238 / 146" },
];

/**
 * "Life at Adamas" (Figma 274:1617, band y 8092-9111): a centred eyebrow and heading over a scattered photo
 * collage with a 625x383 video card at its centre.
 *
 * The photographs are the designer's and the film has not been supplied, so this is drafts-preview only. The frame
 * also carries eight floating labels ("Learning & Development", "Constructive Feedback" and so on), but every one
 * of them sits outside the 1920px frame (x < 0 or x > 1920) and so is invisible in the design render; they are not
 * built, and that is on the allowed-differences list.
 */
export function AboutLife({ content }: { content: FigmaDraftContent["life"] }) {
  return (
    <section data-compare="about-life" aria-labelledby="about-life-heading" className="bg-white py-14 lg:py-[57px]">
      <div className="container-about">
        <p className="text-center font-ui text-[1.25rem] font-medium uppercase tracking-[0.04em] text-blue-500">{content.eyebrow}</p>
        <h2 id="about-life-heading" className="mx-auto mt-3 max-w-[640px] text-center font-ui text-[clamp(1.75rem,1.1rem+2vw,2.625rem)] font-bold leading-[1.31] text-[#333E63]">
          {content.heading}
        </h2>

        {/* Desktop keeps the frame's scatter; below lg the photographs become a simple grid under the video. */}
        <div className="relative mt-10 lg:mt-[57px] lg:aspect-[1194/860]">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:block">
            {PHOTOS.map((p, i) => (
              <div
                key={`${p.src}-${i}`}
                className="relative overflow-hidden rounded-[15px] shadow-[0_3px_14px_rgb(0_0_0/0.16)] lg:absolute"
                style={{ left: p.left, top: p.top, width: p.width, aspectRatio: p.ratio }}
                data-reveal
              >
                <Img src={p.src} alt="" aria-hidden="true" fill sizes="(min-width: 1024px) 25vw, 45vw" className="object-cover" />
              </div>
            ))}

            <div
              className="relative col-span-2 overflow-hidden rounded-[15px] shadow-[0_3px_14px_rgb(0_0_0/0.16)] sm:col-span-3 lg:absolute"
              style={{ left: "24.4%", top: "29.4%", width: "52.3%", aspectRatio: "625 / 383" }}
              data-reveal
            >
              <Img src="images/about/life-video.webp" alt="" aria-hidden="true" fill sizes="(min-width: 1024px) 625px, 100vw" className="object-cover" />
              <Link
                href="/about/careers"
                className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-white"
                aria-label={`${content.videoLabel} (no film supplied yet - opens Careers)`}
              >
                <span className="flex h-[52px] w-[52px] items-center justify-center rounded-full border-2 border-white/90 transition-transform duration-(--duration-base) ease-(--ease-out) hover:scale-110">
                  <Icon name="play" size={20} />
                </span>
                <span className="font-ui text-[1.125rem] leading-[1.45]">{content.videoLabel}</span>
              </Link>
            </div>
          </div>
        </div>

        <DraftNote className="mx-auto max-w-[680px] text-center">
          the design&rsquo;s photographs and no film supplied. Awaiting the client&rsquo;s own office photography.
        </DraftNote>
      </div>
    </section>
  );
}
