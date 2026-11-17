import type { LogoData } from "@/lib/data/home";
import type { Block } from "@/lib/data/site";
import { blockExtra } from "@/lib/data/home-blocks";
import { plain } from "@/lib/placeholder";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Img } from "@/components/media/Img";

/**
 * Tech Excellence (Figma Rectangle 4971 band, List Items 244:4784..4826): tint-50, header, four white cards
 * (gear illustration, Roboto 22 title, centred body) and the three certification badges under "Certified Quality".
 * Figma sets the body text to #B7C8DC on white (1.9:1); it is rendered in grey-600 (4.9:1), logged in design-notes.
 */
export function TechExcellence({ block, logos }: { block: Block; logos: LogoData[] }) {
  const { items } = blockExtra(block, "tech");
  if (items.length === 0) return null;
  const badges = logos.filter((l) => l.kind === "CERTIFICATION" && l.logo);
  return (
    <section aria-labelledby="tech-heading" data-compare="tech" className="bg-tint-50 pb-16 pt-16 lg:pb-[145px] lg:pt-[120px]">
      <div className="container-site">
        <SectionHeader id="tech-heading" eyebrow={plain(block.eyebrow)} heading={plain(block.heading)} innerClassName="max-w-[57rem]" eyebrowClassName="lg:h-[27px]" />
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:mt-[37px] lg:grid-cols-4 lg:gap-[30px]" role="list">
          {items.map((it) => (
            <li key={it.title}>
              <article className="flex h-full flex-col items-center rounded-2xl bg-white px-[14px] pb-6 pt-[27px] text-center" data-reveal>
                {it.image && <Img src={it.image} alt="" width={174} height={116} sizes="174px" className="h-[116px] w-[174px] object-contain" aria-hidden="true" />}
                <h3 className="mt-[44px] font-ui text-[1.375rem] font-bold leading-[1.3] tracking-[-0.02em] text-navy-800">{it.title}</h3>
                <p className="mt-3 font-body text-[1.0625rem] leading-[1.65] text-grey-600">{it.body}</p>
                {it.showCertifications && badges.length > 0 && (
                  <ul className="mt-5 flex flex-wrap justify-center gap-3" role="list" aria-label="Certifications">
                    {badges.map((b) => (
                      <li key={b.name} className="flex h-14 w-20 items-center justify-center rounded-xs bg-white p-2 ring-1 ring-grey-200">
                        {/* Both dimensions fixed (next/image warned when only the height was styled, QA BUG-028); object-contain keeps the badge's ratio. */}
                        <Img src={b.logo!} width={64} height={40} sizes="64px" className="h-10 w-16 object-contain" />
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
