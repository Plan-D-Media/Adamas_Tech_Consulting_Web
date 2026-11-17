import type { IndustryData } from "@/lib/data/home";
import type { Block } from "@/lib/data/site";
import { mediaUrl } from "@/lib/media";
import { optionalCopy, plain } from "@/lib/placeholder";
import { previewingDrafts } from "@/lib/preview";
import { IndustriesExplorer } from "@/components/home/IndustriesExplorer";

/**
 * Industries (Figma Container 236:2629 on the Rectangle 2137 background): a side menu of the twelve industries and
 * a panel with the "Industry Growth" heading, intro and a rail of industry cards (two visible). Industries come from
 * the database; "Explore Industry" links to /contact until industry pages exist (brief section 7).
 */
export function Industries({ block, industries }: { block: Block; industries: IndustryData[] }) {
  if (industries.length === 0) return null;
  const extra = (block.extra ?? {}) as { sideLabel?: string; cardCta?: string; cardHref?: string };
  return (
    <section aria-labelledby="industries-heading" data-compare="industries" className="relative overflow-hidden py-16 lg:pb-[145px] lg:pt-[130px]" style={{ backgroundImage: `url(${mediaUrl("images/home/industries-bg.webp")})`, backgroundSize: "cover", backgroundPosition: "center" }}>
      <div className="container-site">
        <IndustriesExplorer
          sideLabel={extra.sideLabel ?? "All Industries"}
          label={plain(block.eyebrow) || "Industries"}
          heading={plain(block.heading) || "Industry Growth"}
          body={plain(block.body)}
          cardCta={extra.cardCta ?? "Explore Industry"}
          cardHref={extra.cardHref ?? "/contact"}
          items={industries.map((i) => {
            const body = optionalCopy(i.body);
            return {
              slug: i.slug,
              label: plain(i.tabLabel),
              title: plain(i.title),
              paragraphs: body && !body.pending ? body.text.split(/\n\s*\n/).filter(Boolean) : [],
              pending: previewingDrafts && (!body || body.pending),
              draft: i.draft,
              image: i.image ? { url: i.image.url, alt: i.image.alt } : null,
              phone: i.slug === "healthcare" ? mediaUrl("images/industries/healthcare-phone.webp") : null,
            };
          })}
        />
      </div>
    </section>
  );
}
