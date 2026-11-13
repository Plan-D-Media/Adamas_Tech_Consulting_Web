import type { LogoData } from "@/lib/data/home";
import type { Block } from "@/lib/data/site";
import { plain } from "@/lib/placeholder";
import { Eyebrow } from "@/components/ui/SectionHeader";
import { Marquee } from "@/components/home/Marquee";

/**
 * Partners & Certifications (Figma Section 236:2609): white, 96px top / 80px bottom, 1216px content. Eyebrow and a
 * 32px heading on the left, the intro right-aligned on the right, a pause button, then the logo marquee (200x105
 * logos, 131px apart).
 */
export function Partners({ block, logos }: { block: Block; logos: LogoData[] }) {
  const partners = logos.filter((l) => l.kind === "PARTNER" && l.logo);
  if (partners.length === 0) return null;
  return (
    <section aria-labelledby="partners-heading" data-compare="partners" className="bg-white pb-16 pt-16 lg:pb-20 lg:pt-24">
      <div className="container-chrome">
        <div className="grid gap-6 lg:grid-cols-[1fr_488px] lg:items-end" data-reveal>
          <div className="lg:pt-[17px]">
            {block.eyebrow && <Eyebrow>{plain(block.eyebrow)}</Eyebrow>}
            {block.heading && (
              <h2 id="partners-heading" className="mt-4 font-heading text-[clamp(1.5rem,1.2rem+0.8vw,2rem)] font-bold leading-[1.16] tracking-[-0.015em] text-navy-900">
                {plain(block.heading)}
              </h2>
            )}
          </div>
          {block.body && <p className="font-body text-[clamp(1rem,0.95rem+0.2vw,1.25rem)] leading-[1.4] text-grey-700 lg:text-right">{plain(block.body)}</p>}
        </div>
        <Marquee items={partners.map((p) => ({ name: p.name, src: p.logo!.url, width: p.logo!.width ?? 200, height: p.logo!.height ?? 105 }))} />
      </div>
    </section>
  );
}
