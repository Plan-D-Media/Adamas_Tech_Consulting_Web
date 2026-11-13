import type { SolutionCardData } from "@/lib/data/home";
import type { Block } from "@/lib/data/site";
import { isPlaceholder, optionalCopy, plain } from "@/lib/placeholder";
import { SolutionsSlider } from "@/components/home/SolutionsSlider";
import { Img } from "@/components/media/Img";

/**
 * Products & Solutions (Figma Frame 12457): white band with two faint rings behind, header with "All solutions",
 * counter and prev/next on the right, then the 424x523 card slider (image, kind tag, title, tagline, module chips,
 * Explore / Visit site link). Cards come from the database; placeholders show "to be confirmed" tags.
 */
export function Solutions({ block, solutions }: { block: Block; solutions: SolutionCardData[] }) {
  if (solutions.length === 0) return null;
  return (
    <section aria-labelledby="solutions-heading" data-compare="solutions" className="relative overflow-hidden bg-white py-16 lg:py-[110px]">
      <Img src="images/home/products-rings.svg" alt="" width={2659} height={857} className="pointer-events-none absolute left-1/2 top-[10px] hidden h-auto w-[2659px] max-w-none -translate-x-1/2 lg:block" aria-hidden="true" />
      <div className="container-site relative">
        <SolutionsSlider
          eyebrow={plain(block.eyebrow)}
          heading={plain(block.heading)}
          body={plain(block.body)}
          ctaLabel={block.ctaLabel ?? "All solutions"}
          ctaHref={block.ctaHref ?? "/solutions"}
          items={solutions.map((s) => {
            const name = plain(s.name);
            const tagline = optionalCopy(s.tagline);
            return {
              slug: s.slug,
              kind: s.kind === "AI_SOLUTION" ? "AI solution" : "Product",
              name: name || "Solution",
              namePending: isPlaceholder(s.name) || !name,
              tagline: tagline ? tagline.text : null,
              taglinePending: !tagline || tagline.pending,
              href: s.href,
              external: s.external,
              image: s.image ? { url: s.image.url, alt: s.image.alt } : null,
              draft: s.draft,
              modules: s.children.map((c) => ({ name: plain(c.name), href: c.href, external: c.external })),
            };
          })}
        />
      </div>
    </section>
  );
}
