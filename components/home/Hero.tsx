import type { ClaimData, HeroSlideData } from "@/lib/data/home";
import type { Block } from "@/lib/data/site";
import { blockExtra } from "@/lib/data/home-blocks";
import { plain } from "@/lib/placeholder";
import { ButtonLink } from "@/components/ui/Button";
import { Img } from "@/components/media/Img";
import { HeroCarousel } from "@/components/home/HeroCarousel";

interface Props {
  block: Block;
  cards: HeroSlideData[];
  claims: ClaimData[];
  /** Replaces the card carousel (the Figma fixture page passes the designer's baked cards). */
  carousel?: React.ReactNode;
}

/**
 * Homepage hero (Figma 236:1401 / Frame 46 / Frame 47 / Container 236:1405): navy-950 base, background image at 60%
 * with a black gradient from the left, centred copy (eyebrow pill, H1 62px, supporting line, two buttons), the card
 * carousel and the trust row with slider controls. Copy and cards come from the database per region.
 */
export function Hero({ block, cards, claims, carousel }: Props) {
  const extra = blockExtra(block, "hero");
  const heading = plain(block.heading) || "AdamasTech Consulting";
  return (
    <section data-dark-hero data-compare="hero" aria-labelledby="hero-heading" className="relative overflow-hidden bg-navy-950 text-white">
      <div className="absolute inset-0" aria-hidden="true">
        <Img src="images/home/hero-bg.webp" alt="" fill priority sizes="100vw" className="object-cover opacity-60" />
        <div className="absolute inset-y-0 left-0 w-[63%] bg-[linear-gradient(90deg,rgb(0_0_0/0.6),rgb(0_0_0/0))]" />
      </div>

      <div className="container-site relative pb-8 pt-16 lg:pb-[32px] lg:pt-[100px]">
        <div className="mx-auto flex max-w-[55rem] flex-col items-center gap-[19px] text-center">
          {block.eyebrow && (
            <p className="inline-flex min-h-10 max-w-full items-center rounded-pill border border-[#DE7D0C] bg-black/20 px-4 py-1 font-ui text-[clamp(0.875rem,0.75rem+0.4vw,1.25rem)] font-medium leading-tight text-orange-500">
              {plain(block.eyebrow)}
            </p>
          )}
          <h1 id="hero-heading" className="font-ui text-[clamp(2.25rem,1.3rem+3vw,3.875rem)] font-bold leading-[1.17] text-white">
            {heading}
          </h1>
          {/* Figma reserves a 77px (three-line) box for the supporting line, so the buttons sit at y 538 even with two lines. */}
          {block.body && <p className="max-w-[55rem] font-body text-[clamp(1rem,0.95rem+0.2vw,1.125rem)] font-medium leading-[1.45] text-white lg:min-h-[77px]">{plain(block.body)}</p>}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {block.ctaLabel && block.ctaHref && (
              <ButtonLink href={block.ctaHref} size="md" className="min-w-[174px]">
                {block.ctaLabel}
              </ButtonLink>
            )}
            {extra.secondaryLabel && extra.secondaryHref && (
              <ButtonLink href={extra.secondaryHref} size="md" variant="secondary" className="min-w-[174px]">
                {extra.secondaryLabel}
              </ButtonLink>
            )}
          </div>
        </div>

        {carousel ?? (
        <HeroCarousel
          cards={cards.map((c) => ({
            id: c.id,
            category: c.navLabel,
            eyebrow: c.eyebrow,
            title: plain(c.headline),
            href: c.ctaHref,
            external: /^https?:\/\//.test(c.ctaHref),
            image: c.poster ? { url: c.poster.url, alt: c.poster.alt } : null,
          }))}
          claims={claims.filter((c) => c.placement === "hero-trust")}
        />
        )}
      </div>
    </section>
  );
}
