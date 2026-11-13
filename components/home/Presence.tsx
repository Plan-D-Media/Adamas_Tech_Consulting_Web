import type { OfficeInfo } from "@/lib/data/site";
import type { Block } from "@/lib/data/site";
import { mediaUrl } from "@/lib/media";
import { plain } from "@/lib/placeholder";
import { Icon } from "@/components/ui/Icon";
import { cx } from "@/lib/cx";
import { SectionHeader } from "@/components/ui/SectionHeader";

const telHref = (n: string) => `tel:${n.replace(/[^+\d]/g, "")}`;

/**
 * Our Presence (Figma 254:5205 map + Frame 12461 cards): the world-map artwork from the design file (a flat raster
 * with pins and arcs baked in: separate layers are still needed from the designer to animate them), the header
 * over it and five office cards along its bottom edge. The region's featured office comes first as "Your nearest
 * office" on navy; the others are white with their country as the label.
 */
export function Presence({ block, offices, featuredSlug }: { block: Block; offices: OfficeInfo[]; featuredSlug: string | null }) {
  if (offices.length === 0) return null;
  const featured = offices.find((o) => o.slug === featuredSlug) ?? null;
  const rest = offices.filter((o) => o.slug !== featured?.slug);
  const ordered = featured ? [featured, ...rest] : rest;
  return (
    <section aria-labelledby="presence-heading" data-compare="presence" className="bg-white">
      {/* Figma stretches the 1717x916 artwork to 1919x937 (STRETCH fill), so the band uses 100% 100% rather than cover. */}
      <div className="relative bg-[#DCEBFA] bg-cover bg-center pt-16 lg:h-[937px] lg:bg-[length:100%_100%] lg:pt-[86px]" style={{ backgroundImage: `url(${mediaUrl("images/home/presence-map.webp")})` }}>
        <div className="container-site">
          {/* Figma: eyebrow in a 30px paragraph box, heading 24px below it on a 1130px line. */}
          <SectionHeader id="presence-heading" eyebrow={plain(block.eyebrow)} heading={plain(block.heading)} innerClassName="max-w-[70.625rem]" eyebrowClassName="lg:h-[33px]" />
        </div>
        <div className="aspect-[1717/700] w-full lg:hidden" aria-hidden="true" />
      </div>
      <div className="container-site relative z-10 -mt-24 pb-16 lg:-mt-[141px] lg:pb-[71px]">
        <ul className="scrollbar-none flex max-w-[1314px] snap-x gap-[17px] overflow-x-auto pb-2 lg:grid lg:grid-cols-5 lg:overflow-visible lg:pb-0" role="list">
          {ordered.map((o) => {
            const isFeatured = o.slug === featured?.slug;
            return (
              <li key={o.slug} className="w-[249px] shrink-0 snap-start lg:w-auto">
                <article className={cx("flex h-full min-h-[271px] flex-col rounded-lg p-6", isFeatured ? "bg-navy-900 text-white ring-1 ring-navy-900" : "bg-white ring-1 ring-grey-200")} data-reveal>
                  <p className={cx("label-caps", isFeatured ? "text-sky-300" : "text-blue-600")}>{isFeatured ? "Your nearest office" : o.country}</p>
                  <h3 className={cx("mt-3 font-ui text-[1.375rem] font-bold leading-[1.3] tracking-[-0.02em]", isFeatured ? "text-white" : "text-navy-900")}>{o.label}</h3>
                  <address className={cx("mt-3 font-body text-[0.875rem] not-italic leading-[1.63]", isFeatured ? "text-grey-300" : "text-grey-700")}>
                    {o.addressLines.map((l) => (
                      <span key={l} className="block">
                        {l}
                      </span>
                    ))}
                  </address>
                  {o.phone && (
                    <a href={o.phoneHref ?? telHref(o.phone)} className={cx("inline-flex h-9 items-center gap-2 pt-4 font-body text-[0.875rem] font-semibold leading-5", isFeatured ? "text-sky-300 hover:text-white" : "text-blue-600 hover:text-blue-500")}>
                      <Icon name="phone" size={16} />
                      {o.phone}
                    </a>
                  )}
                </article>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
