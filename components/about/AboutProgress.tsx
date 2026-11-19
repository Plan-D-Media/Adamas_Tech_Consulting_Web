import { Img } from "@/components/media/Img";
import { DraftNote, DraftTag } from "@/components/ui/DraftTag";
import { placeholderSlots } from "@/lib/figma-draft";
import type { FigmaDraftContent } from "@/lib/figma-draft";
import type { StatData } from "@/lib/data/home";

/**
 * "Progress in Numbers" (Figma 274:1617, band y 3859-4664): a #EFF5FB band with the heading, lead and a 3x3 grid of
 * 174x112 white cards on the left, and the globe canvas on the right.
 *
 * The nine figures in the frame are HCLTech's ($14.8B revenue, 230K+ people, 60 countries, 167 nationalities, 205
 * delivery centres, 70+ labs, 18K+ clients, 2,200+ patents, 26 top-employer countries) and must never appear, in the
 * preview or anywhere else. The grid keeps all nine slots and the design's spacing; any verified Stat rows fill the
 * first slots and the remainder are neutral placeholders marked Draft, so the client can see the shape of the band
 * and tell us what belongs in it.
 */
export function AboutProgress({ content, stats }: { content: FigmaDraftContent["progress"]; stats: StatData[] }) {
  const slots = placeholderSlots(9);
  const filled = stats.slice(0, 9);
  return (
    <section data-compare="about-progress" aria-labelledby="about-progress-heading" className="bg-[#EFF5FB] py-14 lg:py-[103px]">
      <div className="container-about">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,596px)_minmax(0,660px)] lg:justify-between lg:gap-[25px]">
          <div data-reveal>
            <h2 id="about-progress-heading" className="font-heading text-[clamp(2rem,1.2rem+2.8vw,3.5rem)] font-bold leading-[1.25] tracking-[-0.035em] text-[#202B3C]">
              {content.heading}
            </h2>
            <p className="mt-5 max-w-[596px] font-body text-[clamp(1.0625rem,0.95rem+0.5vw,1.5rem)] leading-[1.75] text-[#202B3C]">{content.body}</p>

            <ul className="mt-8 grid grid-cols-2 gap-[17px] sm:grid-cols-3 lg:mt-[39px]" role="list">
              {slots.map((slot, i) => {
                const stat = filled[i];
                return (
                  <li key={slot.key} className="flex min-h-[112px] w-full flex-col justify-center rounded-xl bg-white px-4 py-3 lg:max-w-[174px]" data-reveal>
                    {stat ? (
                      <>
                        <span className="font-heading text-[1.875rem] font-bold leading-[1.1] text-[#202B3C]">
                          {stat.prefix}
                          {stat.value}
                          {stat.suffix}
                        </span>
                        <span className="mt-1 font-body text-[1rem] leading-[1.3] text-[#202B3C]">{stat.label}</span>
                      </>
                    ) : (
                      <>
                        <span className="font-heading text-[1.875rem] font-bold leading-[1.1] text-grey-300" aria-hidden="true">
                          &mdash;
                        </span>
                        <span className="mt-1 font-body text-[0.875rem] leading-[1.3] text-grey-600">
                          Figure to be confirmed
                          <DraftTag className="ml-0 mt-1 block w-fit" />
                        </span>
                      </>
                    )}
                  </li>
                );
              })}
            </ul>
            <DraftNote className="max-w-[596px]">
              the nine figures in the design belong to another company and are never shown. The client has to supply the figures for this band.
            </DraftNote>
          </div>

          <div className="relative mx-auto aspect-square w-full max-w-[420px] lg:max-w-[660px]" data-reveal>
            <Img src="images/about/globe.webp" alt="" aria-hidden="true" fill sizes="(min-width: 1280px) 660px, 60vw" className="object-contain" />
          </div>
        </div>
      </div>
    </section>
  );
}
