import type { SolutionCardData } from "@/lib/data/home";
import type { Block } from "@/lib/data/site";
import { isPlaceholder, optionalCopy, plain } from "@/lib/placeholder";
import { previewingDrafts } from "@/lib/preview";
import { SOLUTIONS_ANCHOR } from "@/lib/anchors";
import { SolutionCard } from "@/components/home/SolutionCard";
import { SolutionsSlider } from "@/components/home/SolutionsSlider";
import { Img } from "@/components/media/Img";

/**
 * Products & Solutions (Figma Frame 12457): white band with two faint rings behind, header with "All solutions",
 * counter and prev/next on the right, then the 424x523 card slider (image, kind tag, title, tagline, module chips,
 * "Visit site"). Cards come from the database; every solution links out to its own website (scope change,
 * 17 Nov 2026), so this section is also the destination of "/solutions" and of every "All solutions" link.
 *
 * The cards are rendered here, on the server, and passed to the slider as children, so only the slider's controls
 * are client-side (LCP work, 17 Nov 2026).
 */
export function Solutions({ block, solutions }: { block: Block; solutions: SolutionCardData[] }) {
  if (solutions.length === 0) return null;
  const cards = solutions.map((s) => {
    const name = plain(s.name);
    const tagline = optionalCopy(s.tagline);
    return {
      slug: s.slug,
      kind: s.kind === "AI_SOLUTION" ? "AI solution" : "Product",
      name: name || "Solution",
      // "To be confirmed" tags only while drafts are previewed; the public site shows nothing in their place (BUG-014).
      namePending: previewingDrafts && (isPlaceholder(s.name) || !name),
      tagline: tagline && !tagline.pending ? tagline.text : null,
      taglinePending: previewingDrafts && (!tagline || tagline.pending),
      href: s.href,
      image: s.image ? { url: s.image.url, alt: s.image.alt } : null,
      draft: s.draft,
      modules: s.children.map((c) => ({ name: plain(c.name), href: c.href })),
    };
  });
  return (
    <section
      id={SOLUTIONS_ANCHOR}
      aria-labelledby="solutions-heading"
      data-compare="solutions"
      className="relative scroll-mt-[calc(var(--topbar-h)+90px)] overflow-hidden bg-white py-16 lg:py-[110px]"
    >
      <Img src="images/home/products-rings.svg" alt="" width={2659} height={857} className="pointer-events-none absolute left-1/2 top-[10px] hidden h-auto w-[2659px] max-w-none -translate-x-1/2 lg:block" aria-hidden="true" />
      <div className="container-site relative">
        <SolutionsSlider
          eyebrow={plain(block.eyebrow)}
          heading={plain(block.heading)}
          body={plain(block.body)}
          ctaLabel={block.ctaLabel ?? "All solutions"}
          ctaHref={block.ctaHref ?? "/solutions"}
          count={cards.length}
        >
          {cards.map((s) => (
            <SolutionCard key={s.slug} s={s} />
          ))}
        </SolutionsSlider>
      </div>
    </section>
  );
}
