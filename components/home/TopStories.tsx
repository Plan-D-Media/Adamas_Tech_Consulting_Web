import type { Block } from "@/lib/data/site";
import { blockExtra } from "@/lib/data/home-blocks";
import { plain } from "@/lib/placeholder";
import { StoriesSlider } from "@/components/home/StoriesSlider";

/**
 * Top Stories (Figma Group 21290 + Frame 50): tint-50 band, header with an 18px eyebrow and slider controls on the
 * right, then a full-bleed slider of 1217px story cards (image left, date / title / body / "Read full story" right).
 */
export function TopStories({ block }: { block: Block }) {
  const { items } = blockExtra(block, "stories");
  if (items.length === 0) return null;
  return (
    <section aria-labelledby="stories-heading" data-compare="stories" className="bg-tint-50 py-16 lg:pb-[132px] lg:pt-[100px]">
      <StoriesSlider
        eyebrow={plain(block.eyebrow)}
        heading={plain(block.heading)}
        body={plain(block.body)}
        items={items.map((s) => ({ ...s, title: plain(s.title), body: s.body ? plain(s.body) : undefined }))}
      />
    </section>
  );
}
