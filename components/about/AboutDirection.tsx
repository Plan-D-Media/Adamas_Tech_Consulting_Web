import { Icon, type IconName } from "@/components/ui/Icon";
import { DraftNote } from "@/components/ui/DraftTag";
import type { FigmaDraftContent } from "@/lib/figma-draft";

const ICONS: IconName[] = ["layers", "globe", "user", "shield", "chart"];

/**
 * "Our Strategic Direction" (Figma 274:1617, band y 3164-3747): a two-column band on white - eyebrow, 56px heading
 * and lead on the left (596px), five icon rows on the right (620px, 100px tall, 13px apart).
 *
 * Designer's copy, so drafts-preview only (lib/figma-draft.ts). One wording change from the frame: the second item
 * reads "the GCC" where the design says "the Middle East", per the region-label rule in docs/design-notes.md. It is
 * on the allowed-differences list.
 */
export function AboutDirection({ content }: { content: FigmaDraftContent["direction"] }) {
  return (
    <section data-compare="about-direction" aria-labelledby="about-direction-heading" className="bg-white py-14 lg:py-[70px]">
      <div className="container-about">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,596px)_minmax(0,620px)] lg:justify-between lg:gap-[12px]">
          <div data-reveal>
            <p className="font-heading text-[1.25rem] font-extrabold uppercase leading-none tracking-[0.05em] text-blue-link lg:text-[1.5rem]">{content.eyebrow}</p>
            <h2
              id="about-direction-heading"
              className="mt-5 max-w-[548px] font-heading text-[clamp(2rem,1.2rem+2.8vw,3.5rem)] font-bold leading-[1.25] tracking-[-0.035em] text-[#202B3C]"
            >
              {content.heading}
            </h2>
            <p className="mt-6 font-body text-[clamp(1.0625rem,0.95rem+0.5vw,1.5rem)] leading-[1.75] text-[#202B3C]">{content.body}</p>
            <DraftNote className="max-w-[596px]">designer&rsquo;s copy for this band, awaiting client approval.</DraftNote>
          </div>

          <ul className="grid content-start gap-[13px]" role="list">
            {content.items.map((item, i) => (
              <li key={item.slice(0, 24)} className="flex min-h-[100px] items-center gap-4 rounded-sm bg-grey-50 px-5 py-4" data-reveal>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-white text-blue-link" aria-hidden="true">
                  <Icon name={ICONS[i % ICONS.length]} size={20} />
                </span>
                <p className="font-body text-[1rem] leading-[1.56] text-ink">{item}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
