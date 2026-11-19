import type { CertificationData } from "@/lib/data/pages";
import { Img } from "@/components/media/Img";
import { DraftNote, DraftTag } from "@/components/ui/DraftTag";
import { placeholderSlots } from "@/lib/figma-draft";

/**
 * Award / certification badge row (Figma 274:1617, band y 10886-11016): five 150x130 badges evenly spaced across
 * the 1194 column, between the people grid and the contact form.
 *
 * The five badges in the design ("Top Android App Development Companies 2021", a Clutch mark and so on) are the
 * template's and are not Adamas's, so none of them is shown. The row keeps its five slots: verified certification
 * badges fill them first and the remainder are neutral placeholders marked Draft.
 */
export function AboutAwards({ items, preview }: { items: CertificationData[]; preview: boolean }) {
  const badges = items.filter((c) => c.kind === "certification" && c.badge).slice(0, 5);
  // In public the row shows only real marks, and disappears when there are none: the placeholders and their Draft
  // tags are review aids and must never be served to a visitor.
  if (!preview && badges.length === 0) return null;
  const slots = preview ? placeholderSlots(5) : badges.map((b, i) => ({ key: b.slug ?? `slot-${i}` }));
  return (
    <section data-compare="about-awards" aria-label="Awards and certifications" className="bg-white pb-10 lg:pb-[103px]">
      <div className="container-about">
        <ul className="flex flex-wrap items-center justify-center gap-6 lg:justify-between lg:gap-4" role="list">
          {slots.map((slot, i) => {
            const badge = badges[i];
            return (
              <li key={slot.key} className="flex h-[110px] w-[120px] items-center justify-center lg:h-[130px] lg:w-[150px]" data-reveal>
                {badge ? (
                  <span className="relative block h-full w-full">
                    <Img src={badge.badge!} alt={badge.badge!.alt || badge.name} fill sizes="150px" className="object-contain" />
                  </span>
                ) : (
                  <span className="flex h-full w-full flex-col items-center justify-center rounded-lg border border-dashed border-grey-200 px-2 text-center font-body text-[0.6875rem] leading-[1.3] text-grey-500">
                    Award badge
                    <DraftTag className="ml-0 mt-1" />
                  </span>
                )}
              </li>
            );
          })}
        </ul>
        {preview && <DraftNote className="mx-auto max-w-[680px] text-center">
          the award badges in the design are the template&rsquo;s, not Adamas&rsquo;s. Awaiting the client&rsquo;s real awards and certification marks.
        </DraftNote>}
      </div>
    </section>
  );
}
