import Link from "next/link";
import { Img } from "@/components/media/Img";
import { Icon } from "@/components/ui/Icon";
import { DraftNote } from "@/components/ui/DraftTag";
import type { FigmaDraftContent } from "@/lib/figma-draft";

/**
 * Video block + "Our Commitment" (Figma 274:1617, band y 2089-3081).
 *
 * A 1194x524 video card with a play control sits on white and overhangs the top of a full-bleed gradient band
 * (#5268F2 to #14B0D1, left to right, 725px tall), which carries the eyebrow, heading, body and button on the left
 * and three white statement pills on the right. A 257px #00D7E2 disc at 50% sits behind the card on the right.
 *
 * The copy is the designer's, awaiting client approval, so this section renders only while drafts are previewed
 * (lib/figma-draft.ts). The card's poster is the Figma photograph; there is no video file yet, so the control is a
 * link to the contact page rather than a player - flagged for the client.
 */
export function AboutCommitment({ content }: { content: FigmaDraftContent["commitment"] }) {
  return (
    <section data-compare="about-commitment" aria-labelledby="about-commitment-heading" className="relative isolate bg-white">
      {/* The gradient band is bottom-aligned: the card overhangs its top edge by 267px, as in the frame. */}
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 top-[140px] -z-10 overflow-hidden bg-[linear-gradient(90deg,#5268F2_0%,#14B0D1_100%)] lg:top-[267px]">
        <span className="absolute right-[12%] top-[6%] block h-[150px] w-[150px] rounded-full bg-[#00D7E2]/50 lg:h-[257px] lg:w-[257px]" />
        <span className="absolute -left-[10%] bottom-0 block h-[80%] w-[55%] rounded-full bg-white/5 blur-3xl" />
      </div>

      <div className="container-about">
        <div className="relative overflow-hidden rounded-[20px] shadow-[0_4px_24px_rgb(0_0_0/0.18)]" data-reveal>
          <Img
            src="images/about/commitment.webp"
            alt="Adamas Tech Consulting colleagues working together"
            width={1194}
            height={524}
            sizes="(min-width: 1280px) 1194px, 100vw"
            className="h-[220px] w-full object-cover sm:h-[340px] lg:h-[524px]"
          />
          <span aria-hidden="true" className="absolute inset-0 bg-[#1C85FF]/30" />
          <Link
            href={content.ctaHref}
            className="absolute inset-0 flex items-center justify-center"
            aria-label="Watch the Adamas Tech Consulting film (no film supplied yet - opens the contact page)"
          >
            <span className="flex h-[62px] w-[62px] items-center justify-center rounded-full border-2 border-white/90 text-white transition-transform duration-(--duration-base) ease-(--ease-out) hover:scale-110">
              <Icon name="play" size={22} />
            </span>
          </Link>
        </div>

        <div className="mt-[60px] grid gap-10 pb-12 lg:grid-cols-[minmax(0,623px)_minmax(0,530px)] lg:justify-between lg:gap-[41px] lg:pb-[86px]">
          <div data-reveal>
            <p className="label-caps text-white/90">{content.eyebrow}</p>
            <h2 id="about-commitment-heading" className="mt-3 max-w-[589px] font-ui text-[clamp(1.75rem,1.1rem+2vw,2.625rem)] font-bold capitalize leading-[1.31] text-white">
              {content.heading}
            </h2>
            <p className="mt-4 max-w-[623px] font-ui text-[1.125rem] leading-[1.45] text-white/90">{content.body}</p>
            <Link
              href={content.ctaHref}
              className="mt-8 inline-flex h-[60px] min-w-[236px] items-center justify-center rounded-pill bg-white px-8 font-ui text-[1.0625rem] font-medium text-blue-600 transition-colors duration-(--duration-fast) hover:bg-tint-100"
            >
              {content.ctaLabel}
            </Link>
            <DraftNote tone="dark" className="max-w-[623px]">
              designer&rsquo;s copy for this band, and the film has not been supplied. Awaiting client approval.
            </DraftNote>
          </div>

          <ul className="grid content-start gap-5" role="list">
            {content.points.map((p) => (
              <li key={p.lead} className="flex min-h-[78px] items-center gap-4 rounded-[10px] bg-white px-4 shadow-[0_2px_10px_rgb(0_0_0/0.08)]" data-reveal>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600/10 text-blue-600" aria-hidden="true">
                  <Icon name="check" size={20} />
                </span>
                <p className="font-ui text-[1.25rem] leading-[1.17] text-[#333E63]">
                  <span className="font-bold">{p.lead}</span> {p.rest}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
