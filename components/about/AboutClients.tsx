import Link from "next/link";
import type { CertificationData } from "@/lib/data/pages";
import { Img } from "@/components/media/Img";
import { DraftNote, DraftTag } from "@/components/ui/DraftTag";
import { placeholderSlots } from "@/lib/figma-draft";
import type { FigmaDraftContent } from "@/lib/figma-draft";

/**
 * "Organisations That Inspire Our Work" (Figma 274:1617, band y 6440-6877): copy on the left, nine 174x100 logo
 * tiles on the right arranged as a ring around a dashed circle (rows at y 6471 / 6601 / 6731, the middle row
 * stepped left).
 *
 * The frame's logos are template filler - Lorem Ipsum marks, "Happy Marts", HP - and none of them may be shown.
 * The ring keeps all nine slots: client-evidenced badges from the Certification table fill them first, the rest are
 * neutral placeholders marked Draft. "150+ Satisfied Clients. 1M+ ROI Increased" is an unverified figure from the
 * design, so it carries a Draft tag and only appears while drafts are previewed.
 */
export function AboutClients({ content, items }: { content: FigmaDraftContent["clients"]; items: CertificationData[] }) {
  const logos = items.filter((c) => c.badge).slice(0, 9);
  const slots = placeholderSlots(9);
  // Ring geometry from the frame, as percentages of the 728x360 box the nine tiles occupy.
  const positions = [
    { left: "20%", top: "0%" },
    { left: "48%", top: "0%" },
    { left: "76%", top: "0%" },
    { left: "0%", top: "36%" },
    { left: "28%", top: "36%" },
    { left: "56%", top: "36%" },
    { left: "20%", top: "72%" },
    { left: "48%", top: "72%" },
    { left: "76%", top: "72%" },
  ];

  return (
    <section data-compare="about-clients" aria-labelledby="about-clients-heading" className="bg-white py-14 lg:py-[64px]">
      <div className="container-site">
        <div className="grid gap-12 xl:grid-cols-[minmax(0,560px)_minmax(0,728px)] xl:items-center xl:justify-between">
          <div data-reveal>
            <p className="font-ui text-[1.25rem] font-medium uppercase tracking-[0.04em] text-blue-500">{content.eyebrow}</p>
            <h2 id="about-clients-heading" className="mt-3 max-w-[594px] font-ui text-[clamp(1.75rem,1.1rem+2vw,2.625rem)] font-bold leading-[1.31] text-[#333E63]">
              {content.heading}
            </h2>
            <p className="mt-4 font-ui text-[1.5rem] font-bold leading-[1.4] text-[#333E63]">
              {content.figures}
              <DraftTag title="Unverified figure from the design" />
            </p>
            <p className="mt-4 max-w-[541px] font-ui text-[1.125rem] leading-[1.45] text-[#132B50]/80">{content.body}</p>
            <Link
              href={content.ctaHref}
              className="mt-9 inline-flex h-[60px] min-w-[236px] items-center justify-center rounded-pill bg-blue-500 px-8 font-ui text-[1.0625rem] font-medium text-white transition-colors duration-(--duration-fast) hover:bg-blue-600"
            >
              {content.ctaLabel}
            </Link>
            <DraftNote className="max-w-[560px]">
              the design&rsquo;s client logos are template filler and are never shown; the figure above is unverified. Awaiting the client&rsquo;s logo set and numbers.
            </DraftNote>
          </div>

          {/* Desktop: the ring. Below lg it collapses to a plain grid, which stays readable at 390px. */}
          <div className="relative mx-auto w-full max-w-[728px]" data-reveal>
            <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 hidden h-[554px] w-[554px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-blue-500/35 xl:block" />
            <ul className="relative grid grid-cols-2 gap-4 sm:grid-cols-3 xl:block xl:h-[360px]" role="list">
              {slots.map((slot, i) => {
                const logo = logos[i];
                const p = positions[i];
                return (
                  <li
                    key={slot.key}
                    className="flex h-[100px] items-center justify-center rounded-[10px] border border-[#EDF5F8] bg-white shadow-[0_2px_10px_rgb(0_0_0/0.06)] xl:absolute xl:w-[174px]"
                    style={{ left: p.left, top: p.top }}
                  >
                    {logo ? (
                      <span className="relative block h-[64px] w-[130px]">
                        <Img src={logo.badge!} alt={logo.badge!.alt || logo.name} fill sizes="130px" className="object-contain" />
                      </span>
                    ) : (
                      <span className="px-3 text-center font-body text-[0.6875rem] leading-[1.3] text-grey-500">
                        Client logo
                        <DraftTag className="ml-0 mt-1 block w-fit" />
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
