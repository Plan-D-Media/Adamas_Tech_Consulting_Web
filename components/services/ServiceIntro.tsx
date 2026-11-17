import type { Media } from "@/lib/media";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Img } from "@/components/media/Img";
import { ServiceEyebrow } from "@/components/services/ServiceSectionHead";

interface Props {
  eyebrow?: string | null;
  heading: string;
  paragraphs: string[];
  ctaLabel?: string | null;
  ctaHref?: string | null;
  secondaryLabel?: string | null;
  secondaryHref?: string | null;
  image?: Media | string | null;
  imageAlt?: string;
  pills: string[];
}

const PILL_ICONS = ["layers", "chart", "check", "globe"] as const;

/**
 * Intro (Figma Frame 65 + Image 292:24669 + Container 292:24675): a 425px text column (18px eyebrow, 37px heading,
 * 18px/30.6 copy, two buttons) and a 660x536 photo with a floating white card of four pills over its right edge.
 */
export function ServiceIntro({ eyebrow, heading, paragraphs, ctaLabel, ctaHref, secondaryLabel, secondaryHref, image, imageAlt = "", pills }: Props) {
  return (
    <section data-compare="intro" aria-labelledby="service-intro-heading" className="overflow-x-clip bg-white py-14 lg:py-[131px]">
      <div className="container-site grid gap-10 lg:grid-cols-[425px_minmax(0,1fr)] lg:gap-[60px]">
        <div className="lg:mt-[63px]" data-reveal>
          {eyebrow && <ServiceEyebrow className="text-[1.1875rem]">{eyebrow}</ServiceEyebrow>}
          <h2 id="service-intro-heading" className="mt-[14px] font-heading text-[clamp(1.75rem,1.3rem+1.2vw,2.3125rem)] font-bold leading-[1.23] tracking-[-0.035em] text-navy-800 lg:w-[572px] lg:max-w-none">
            {heading}
          </h2>
          <div className="mt-[14px] space-y-4 font-heading text-[clamp(1rem,0.95rem+0.25vw,1.125rem)] leading-[1.7] text-grey-450 lg:w-[585px] lg:max-w-none">
            {paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          {(ctaLabel || secondaryLabel) && (
            <div className="mt-[37px] flex flex-wrap items-center gap-3">
              {ctaLabel && ctaHref && (
                <ButtonLink href={ctaHref} size="md">
                  {ctaLabel}
                </ButtonLink>
              )}
              {secondaryLabel && secondaryHref && (
                <ButtonLink href={secondaryHref} size="md" variant="secondary" className="min-w-[174px]">
                  {secondaryLabel}
                </ButtonLink>
              )}
            </div>
          )}
        </div>
        <div className="relative lg:min-h-[536px]" data-reveal>
          {image && (
            <div className="relative aspect-[660/536] w-full overflow-hidden rounded-[30px] bg-navy-900 lg:absolute lg:right-0 lg:top-0 lg:aspect-auto lg:h-[536px] lg:w-[660px]">
              {/* The intro photo is the page's LCP element (Lighthouse, QA BUG-028): fetched eagerly with high priority. */}
              <Img src={image} alt={imageAlt} fill priority sizes="(min-width: 1024px) 660px, 100vw" className="object-cover" />
            </div>
          )}
          {pills.length > 0 && (
            <ul className="relative mt-4 w-full rounded-[10px] bg-white px-[18px] py-3 ring-[11px] ring-white lg:absolute lg:-right-[66px] lg:top-[125px] lg:mt-0 lg:w-[292px]" role="list">
              {pills.map((p, i) => (
                <li key={p} className="flex h-[68px] items-center gap-[13px] border-b border-[#E2EAF2] last:border-b-0 [&:nth-last-child(2)]:border-b-0">
                  <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#ECF2FB] text-blue-link" aria-hidden="true">
                    <Icon name={PILL_ICONS[i % PILL_ICONS.length]} size={18} />
                  </span>
                  <span className="font-heading text-[0.875rem] leading-none text-black">{p}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
