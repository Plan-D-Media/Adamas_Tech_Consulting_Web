import type { CertificationData } from "@/lib/data/pages";
import { Img } from "@/components/media/Img";

/**
 * Partner logo strip (Figma 274:1617, band y 1894-1999): four 200x105 logo tiles across the 1194 column, evenly
 * spaced, directly under the approach steps and above the commitment band.
 *
 * The design's tiles are AWS Select Tier, Cloudera and SAP Partner artwork. Those are real partner credentials, so
 * the strip is fed from the Certification table (kind = "partner") rather than from the Figma images: whatever the
 * client has evidenced is what is shown, in the design's four slots. With no partner rows the strip leaves itself
 * out rather than drawing empty boxes.
 */
export function AboutPartners({ items }: { items: CertificationData[] }) {
  const partners = items.filter((c) => c.kind === "partner" && c.badge).slice(0, 4);
  if (partners.length === 0) return null;
  return (
    <section data-compare="about-partners" aria-label="Partner programmes" className="bg-white pb-6 pt-2 lg:pb-[90px] lg:pt-0">
      <div className="container-about">
        <ul className="flex flex-wrap items-center justify-between gap-x-8 gap-y-6" role="list">
          {partners.map((p) => (
            <li key={p.slug} className="relative h-[70px] w-[150px] shrink-0 lg:h-[105px] lg:w-[200px]" data-reveal>
              <Img src={p.badge!} alt={p.badge!.alt || p.name} fill sizes="200px" className="object-contain" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
