import type { Crumb } from "@/lib/seo";
import { Img } from "@/components/media/Img";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

interface Props {
  eyebrow: string | null;
  title: string;
  intro: string | null;
  crumbs: Crumb[];
}

/**
 * About hero (Figma 274:1617, band y 0-530): a full-bleed photograph under a navy wash, with the page name, the
 * heading and the intro centred on it. The photograph is the LCP element on this page, so it is a plain <Img> with
 * `priority` and `fetchPriority="high"` rather than a CSS background (QA Phase 2 LCP round: a background image is
 * discovered only after the stylesheet).
 *
 * The design has no breadcrumb. One is added below the intro because every inner page needs the trail and the
 * BreadcrumbList data that goes with it (brief section 10); it is a question for the designer (docs/design-notes.md).
 */
export function AboutHero({ eyebrow, title, intro, crumbs }: Props) {
  return (
    <section data-dark-hero data-compare="about-hero" className="relative isolate flex min-h-[380px] items-center overflow-hidden bg-navy-950 lg:min-h-[530px]">
      <Img
        src="images/about/hero-bg.webp"
        alt=""
        width={1920}
        height={530}
        priority
        fetchPriority="high"
        sizes="100vw"
        className="absolute inset-0 -z-10 h-full w-full object-cover"
      />
      {/* The frame draws the photograph at 60% over the navy base with a black-to-transparent gradient on top, so
          the picture reads brightly. Round 8 matched that overall brightness (mean luminance 179 against the
          frame's 182) but had to add the second, local wash: measured on the frame's own render, the design puts
          white 46-62px type over parts of the photograph at 2.29:1 (p95), under the 3:1 large-text minimum. The
          ellipse darkens only the text column, so the picture still reads as brightly as the design intends while
          the type passes. Logged in docs/design-notes.md as a deliberate difference. */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(4_18_45/0.55)_0%,rgb(4_18_45/0.34)_45%,rgb(4_18_45/0.58)_100%)]" aria-hidden="true" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_72%_58%_at_50%_46%,rgb(4_18_45/0.62)_0%,rgb(4_18_45/0.36)_55%,rgb(4_18_45/0)_100%)]" aria-hidden="true" />
      <div className="container-site py-16 text-center text-white lg:py-[90px]">
        {eyebrow && <p className="font-heading text-[clamp(2rem,1.2rem+2.6vw,3.875rem)] font-bold leading-[1.1] tracking-[-0.02em]">{eyebrow}</p>}
        <h1 className="mt-2 font-heading text-[clamp(1.75rem,1.1rem+2vw,2.875rem)] font-bold leading-[1.18] tracking-[-0.01em] lg:mt-[18px]">{title}</h1>
        {intro && <p className="mx-auto mt-5 max-w-[820px] font-heading text-[clamp(1rem,0.9rem+0.4vw,1.5rem)] font-normal leading-[1.45] text-white/85">{intro}</p>}
        <Breadcrumb crumbs={crumbs} className="mt-8 flex justify-center [&_a]:text-white/75 [&_a:hover]:text-white [&_li]:text-white/60 [&_span[aria-current]]:text-white" />
      </div>
    </section>
  );
}
