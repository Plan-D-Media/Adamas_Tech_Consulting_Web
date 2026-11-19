import Link from "next/link";
import { Img } from "@/components/media/Img";
import { Icon } from "@/components/ui/Icon";
import { DraftNote, DraftTag } from "@/components/ui/DraftTag";
import { placeholderSlots } from "@/lib/figma-draft";
import type { FigmaDraftContent } from "@/lib/figma-draft";
import type { StatData } from "@/lib/data/home";

interface Props {
  content: FigmaDraftContent["cta"];
  /** Verified Stat rows, if any; the four figures in the design are the template's and are never shown. */
  stats: StatData[];
  /** The region's telephone number, from the Region table. The design prints a masked one. */
  phone: string | null;
  phoneHref: string | null;
}

/**
 * CTA band + statistics (Figma 274:1617, band y 9474-10052): a navy card overhanging a light band, with the
 * eyebrow and heading on the left and a "Free consultation" pill plus a telephone number on the right; four
 * statistics sit under it on the light band.
 *
 * "1790 / 491 / 245 / 1090" with "Happy Clients / Finished Projects / Skilled Experts / Media Posts" are the
 * template's numbers and are never rendered. The four columns and their spacing are kept; verified Stat rows fill
 * them if there are any, otherwise each is a neutral placeholder marked Draft. The telephone number comes from the
 * Region row, not from the design's masked "+91 000 500 8008".
 */
export function AboutCta({ content, stats, phone, phoneHref }: Props) {
  const slots = placeholderSlots(4);
  return (
    <section data-compare="about-cta" aria-labelledby="about-cta-heading" className="relative isolate bg-white">
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 top-[110px] -z-10 overflow-hidden bg-tint-50">
        <Img src="images/about/cta-bg.webp" alt="" fill sizes="50vw" className="w-1/3 object-contain object-left opacity-40" />
      </div>

      <div className="container-about">
        <div className="rounded-[20px] bg-navy-900 px-7 py-9 lg:px-[44px] lg:py-[40px]" data-reveal>
          <div className="grid gap-7 lg:grid-cols-[minmax(0,620px)_auto] lg:items-center lg:justify-between lg:gap-10">
            <div>
              <p className="label-caps text-white">{content.eyebrow}</p>
              <h2 id="about-cta-heading" className="mt-3 max-w-[590px] font-ui text-[clamp(1.625rem,1.1rem+1.9vw,2.625rem)] font-bold leading-[1.31] text-[#EDF5F8]">
                {content.heading}
              </h2>
            </div>
            <div className="flex flex-col items-start gap-3 lg:items-end">
              <Link
                href={content.ctaHref}
                className="inline-flex h-12 min-w-[194px] items-center justify-center rounded-pill bg-white px-7 font-ui text-[1.0625rem] font-medium text-blue-500 transition-colors duration-(--duration-fast) hover:bg-tint-100"
              >
                {content.ctaLabel}
              </Link>
              {phone && phoneHref && (
                <a href={phoneHref} className="inline-flex items-center gap-2 font-ui text-[1.125rem] font-medium text-white hover:text-sky-200">
                  <Icon name="phone" size={16} />
                  {content.callLabel} {phone}
                </a>
              )}
            </div>
          </div>
        </div>

        <ul className="mt-10 grid grid-cols-2 gap-8 pb-12 text-center lg:mt-[86px] lg:grid-cols-4 lg:pb-[88px]" role="list">
          {slots.map((slot, i) => {
            const stat = stats[i];
            return (
              <li key={slot.key} data-reveal>
                {stat ? (
                  <>
                    <p className="mx-auto max-w-[164px] font-ui text-[1.375rem] font-medium leading-[1.18] text-[#333E63]">{stat.label}</p>
                    <p className="mt-3 font-ui text-[clamp(2.25rem,1.6rem+2vw,3.4375rem)] font-bold leading-none text-blue-500">
                      {stat.prefix}
                      {stat.value}
                      {stat.suffix}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="mx-auto max-w-[164px] font-ui text-[1.375rem] font-medium leading-[1.18] text-[#333E63]">Statistic to be confirmed</p>
                    <p className="mt-3 font-ui text-[clamp(2.25rem,1.6rem+2vw,3.4375rem)] font-bold leading-none text-grey-300" aria-hidden="true">
                      &mdash;
                    </p>
                    <DraftTag className="ml-0 mt-2" />
                  </>
                )}
              </li>
            );
          })}
        </ul>
        <DraftNote className="mx-auto -mt-6 max-w-[680px] text-center lg:-mt-12 lg:mb-10">
          designer&rsquo;s heading, and the four figures in the design belong to the template. Awaiting the client&rsquo;s numbers.
        </DraftNote>
      </div>
    </section>
  );
}
