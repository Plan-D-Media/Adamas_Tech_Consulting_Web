import Link from "next/link";
import { Img } from "@/components/media/Img";
import { Icon } from "@/components/ui/Icon";
import { DraftNote, DraftTag } from "@/components/ui/DraftTag";
import { placeholderSlots } from "@/lib/figma-draft";
import type { FigmaDraftContent } from "@/lib/figma-draft";

/**
 * Statement band + testimonials (Figma 274:1617, band y 6997-7972): a dark band carrying a 72px statement over a
 * dotted world-map photograph, then two stepped rows of testimonial cards running off both edges, then a centred
 * closing line. The statement alternates grey and white phrases (styleOverrideTable 3 in the frame).
 *
 * Every testimonial in the design is the same stock "Miyah Myles" quote, which must never be shown. The two rows
 * and their stagger are kept; each card is a neutral placeholder marked Draft until the client supplies real
 * client quotes, names and permission to use them.
 */
export function AboutStatement({ content }: { content: FigmaDraftContent["statement"] }) {
  const row = placeholderSlots(4);
  return (
    <section data-compare="about-statement" aria-labelledby="about-statement-heading" className="relative isolate overflow-hidden bg-[#262626] py-14 lg:py-[122px]">
      <Img
        src="images/about/statement-bg.webp"
        alt=""
        aria-hidden="true"
        fill
        sizes="100vw"
        className="-z-10 object-cover opacity-70"
      />

      <div className="container-site">
        <h2
          id="about-statement-heading"
          className="mx-auto max-w-[1368px] text-center font-ui text-[clamp(1.75rem,0.9rem+3.6vw,4.5rem)] font-black leading-[1.3] text-[#9a9a9a]"
        >
          {content.runs.map((r) => (
            <span key={r.text.slice(0, 20)} className={r.emphasis ? "text-white" : undefined}>
              {r.text}
            </span>
          ))}
        </h2>
      </div>

      {/* The rows run wider than the page and are clipped by the section, as in the frame. */}
      <div className="mt-10 grid gap-[22px] lg:mt-[78px]" aria-label="Client testimonials (placeholder)">
        {[0, 1].map((rowIndex) => (
          <ul
            key={rowIndex}
            className={rowIndex === 1 ? "flex gap-[136px] px-4 lg:-ml-[235px] lg:px-0" : "flex gap-[136px] px-4 lg:-ml-[16px] lg:px-0"}
            role="list"
          >
            {row.map((slot) => (
              <li
                key={slot.key}
                className="flex min-w-[320px] shrink-0 items-start justify-between gap-4 rounded-sm bg-white/5 p-5 lg:min-w-[372px]"
                data-reveal
              >
                <div className="min-w-0">
                  <p className="font-ui text-[1.25rem] leading-[1.17] text-[#9a9a9a]">
                    Client name
                    <DraftTag />
                  </p>
                  <p className="mt-2 font-ui text-[1rem] font-light leading-[1.5] text-white/80">
                    Client quote to be supplied. The design fills this band with a stock testimonial, which we do not publish.
                  </p>
                </div>
                <span className="h-[72px] w-[72px] shrink-0 rounded-full border-[3px] border-white/80 bg-white/10" aria-hidden="true" />
              </li>
            ))}
          </ul>
        ))}
      </div>

      <div className="container-site">
        <p className="mt-10 text-center font-ui text-[1.125rem] leading-[1.45] text-white lg:mt-[57px]">
          {content.footLead}{" "}
          <Link href={content.footHref} className="inline-flex items-center gap-2 font-bold underline underline-offset-4 hover:text-sky-200">
            {content.footLink}
            <Icon name="arrow" size={16} />
          </Link>
        </p>
        <DraftNote tone="dark" className="mx-auto max-w-[680px] text-center">
          designer&rsquo;s statement copy, and the testimonials are placeholders. Awaiting approved client quotes.
        </DraftNote>
      </div>
    </section>
  );
}
