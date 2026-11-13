import type { Block } from "@/lib/data/site";
import { blockExtra } from "@/lib/data/home-blocks";
import { mediaUrl } from "@/lib/media";
import { plain } from "@/lib/placeholder";
import { Icon, type IconName } from "@/components/ui/Icon";
import { ArrowLink } from "@/components/ui/Button";
import { Eyebrow, Heading2 } from "@/components/ui/SectionHeader";

/**
 * About Adamas (Figma Container 236:2254 + Group 21306): copy on the left (two paragraphs, "Discover Adamas" link,
 * three feature items over a top rule), the team photo on the right with the blue squares graphic top-left and the
 * "Our approach" card bottom-right, the outline word "ADAMAS" behind and a light diagonal shape on the right.
 */
export function About({ block }: { block: Block }) {
  const extra = blockExtra(block, "about");
  const paragraphs = (block.body ? plain(block.body) : "").split(/\n\s*\n/).filter(Boolean);
  return (
    <section aria-labelledby="about-heading" data-compare="about" className="relative overflow-hidden bg-white py-16 lg:pb-10 lg:pt-[124px]">
      <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[53%] bg-tint-50 [clip-path:polygon(34%_0,100%_0,100%_100%,0_100%)] lg:block" aria-hidden="true" />
      <div className="container-site relative grid gap-12 lg:grid-cols-[1fr_1fr] lg:justify-between lg:gap-8 xl:grid-cols-[635px_626px]">
        <div className="relative lg:pt-[51px]" data-reveal>
          <p className="pointer-events-none absolute -bottom-6 left-[34px] select-none font-heading text-[clamp(5rem,8.2vw,9.875rem)] font-extrabold leading-none tracking-[-0.07em] text-blue-800/[0.03]" aria-hidden="true">
            ADAMAS
          </p>
          {block.eyebrow && <Eyebrow>{plain(block.eyebrow)}</Eyebrow>}
          <Heading2 id="about-heading" className="mt-3 max-w-[31rem]">
            {plain(block.heading)}
          </Heading2>
          <div className="mt-[17px] max-w-[40.625rem] space-y-[23px] font-heading text-[clamp(1rem,0.95rem+0.25vw,1.25rem)] leading-[1.625] text-grey-600">
            {paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          {block.ctaLabel && block.ctaHref && (
            <ArrowLink href={block.ctaHref} className="mt-[25px] font-heading text-[1.125rem] font-bold text-blue-600 hover:text-blue-500">
              {block.ctaLabel}
            </ArrowLink>
          )}
          {extra.features.length > 0 && (
            <ul className="mt-[38px] flex flex-wrap gap-x-5 gap-y-3 border-t border-[#DFE6EE] pt-[26px]" role="list">
              {extra.features.map((f) => (
                <li key={f.label} className="inline-flex items-center gap-[7px] font-heading text-[1.125rem] font-bold leading-none text-navy-800">
                  <Icon name={f.icon as IconName} size={20} className="text-blue-600" />
                  {f.label}
                </li>
              ))}
            </ul>
          )}
        </div>

        {extra.image && (
          <div className="relative mx-auto w-full max-w-[626px] lg:ml-auto lg:mr-0" data-reveal>
            <img src={mediaUrl("images/home/about-graphic.svg")} alt="" width={227} height={227} className="pointer-events-none absolute -left-2 -top-2 z-10 w-[36%] max-w-[227px]" aria-hidden="true" loading="lazy" decoding="async" />
            <div className="relative ml-[12%] mt-[14%] overflow-hidden rounded-2xl">
              <img src={extra.image} alt={extra.imageAlt} width={551} height={490} className="block h-auto w-full object-cover" loading="lazy" decoding="async" />
            </div>
            {extra.approach && (
              <div className="absolute bottom-[14px] right-0 w-[235px] bg-[rgb(7_29_58/0.91)] p-6 text-white backdrop-blur-[28px]">
                <p className="font-heading text-[0.875rem] uppercase leading-none tracking-[0.09em] text-sky-100">{extra.approach.label}</p>
                <p className="mt-[10px] font-heading text-[1.125rem] font-bold leading-[1.29]">{extra.approach.text}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
