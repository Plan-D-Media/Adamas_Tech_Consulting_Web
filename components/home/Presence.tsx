import type { Block, OfficeInfo, RegionInfo } from "@/lib/data/site";
import type { RegionSlug } from "@/lib/region";
import { mediaUrl } from "@/lib/media";
import { plain } from "@/lib/placeholder";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { OfficeCards } from "@/components/home/OfficeCards";

interface Props {
  block: Block;
  offices: OfficeInfo[];
  regions: RegionInfo[];
  /** The page's region (regional homepages) or null on global pages, where the visitor's cookie decides (components/home/OfficeCards.tsx). */
  region: RegionSlug | null;
  fallbackRegion: RegionSlug;
}

/**
 * Our Presence (Figma 254:5205 map + Frame 12461 cards): the world-map artwork from the design file (a flat raster
 * with pins and arcs baked in: separate layers are still needed from the designer to animate them), the header
 * over it and five office cards along its bottom edge. The region's featured office comes first as "Your nearest
 * office" on navy; the others are white with their country as the label.
 */
export function Presence({ block, offices, regions, region, fallbackRegion }: Props) {
  if (offices.length === 0) return null;
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
        <OfficeCards offices={offices} regions={regions} region={region} fallbackRegion={fallbackRegion} />
      </div>
    </section>
  );
}
