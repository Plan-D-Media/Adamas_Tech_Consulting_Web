import Link from "next/link";
import type { SolutionKind, SolutionListItem } from "@/lib/data/solutions";
import { copy, isPlaceholder } from "@/lib/placeholder";
import { cx } from "@/lib/cx";
import { Img } from "@/components/media/Img";
import { CardArt } from "@/components/media/CardArt";
import { Icon, type IconName } from "@/components/ui/Icon";
import { DraftBadge, TbcTag } from "@/components/ui/SectionHeader";
import { MetricCount } from "@/components/motion/MetricCount";

export const kindLabel: Record<SolutionKind, string> = {
  PRODUCT: "Product",
  AI_SOLUTION: "AI solution",
  ARIVOO_MODULE: "Arivoo module",
};

const bySlug: Record<string, IconName> = {
  arivoo: "cap",
  testguard: "shield",
  "face-recognition": "scan",
  "smart-parking": "car",
  "cash-forecasting": "chart",
};

/** One outline glyph per solution, for branded artwork where there is no photography. */
export function solutionGlyph(s: { slug: string; kind: SolutionKind }): IconName {
  if (bySlug[s.slug]) return bySlug[s.slug];
  if (s.slug.startsWith("arivoo")) return "cap";
  return s.kind === "PRODUCT" ? "spark" : "cpu";
}

/**
 * Solution card for the overview and "more solutions" grids: photography or branded artwork, the kind,
 * name and one line, and (when a linked case study has a cleared figure) the proof point counted up
 * underneath. The whole card is one link: to the page, or out to the product site in a new tab.
 */
export function SolutionTile({ s, index = 0, headingLevel: H = "h3" }: { s: SolutionListItem; index?: number; headingLevel?: "h3" | "h4" }) {
  const name = copy(s.name);
  const lineSrc = s.tagline && !isPlaceholder(s.tagline) ? s.tagline : s.summary;
  const line = copy(lineSrc ?? "[Placeholder].");
  const proofLabel = s.proof?.label ? copy(s.proof.label) : null;
  const linkCls = "after:absolute after:inset-0 after:z-[2] after:content-['']";

  return (
    <article className="card-lift group relative flex h-full flex-col overflow-hidden rounded-card bg-navy-950 text-white" data-spotlight>
      <div className="card-media relative aspect-[16/10] overflow-hidden">
        {s.image ? <Img media={s.image} sizes="(min-width: 1024px) 420px, (min-width: 640px) 50vw, 100vw" className="object-[50%_30%]" /> : <CardArt icon={solutionGlyph(s)} variant={index} />}
        <span aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-navy-950 via-navy-950/20 to-transparent" />
        <span className="absolute left-5 top-5 rounded-full bg-navy-950/55 px-3 py-1 text-xs font-semibold ring-1 ring-white/20 backdrop-blur-sm">{kindLabel[s.kind]}</span>
        {s.draft && <DraftBadge className="absolute right-5 top-5" />}
      </div>
      <div className="relative flex flex-1 flex-col px-6 pb-6 pt-1 md:px-7 md:pb-7">
        <H className="text-h3 font-bold">
          {s.external ? (
            <a href={s.href} target="_blank" rel="noopener" className={linkCls}>
              {name.text}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          ) : (
            <Link href={s.href} className={linkCls}>
              {name.text}
            </Link>
          )}
        </H>
        {name.pending && <TbcTag tone="dark" className="mt-3 self-start" />}
        <p className={cx("mt-3 line-clamp-3", line.pending ? "text-small italic text-on-navy-muted/80" : "text-on-navy-muted")}>{line.text}</p>
        {s.proof && (
          <div className="mt-6 flex items-end gap-4 border-t border-white/10 pt-5">
            <MetricCount value={s.proof.metric} className="font-display-wide text-[2.5rem] font-bold leading-none tabular-nums text-sky-400" />
            {proofLabel && !proofLabel.pending && <p className="pb-0.5 text-small leading-snug text-on-navy-muted first-letter:uppercase">{proofLabel.text}</p>}
          </div>
        )}
        <span className="mt-auto inline-flex items-center gap-2 pt-6 text-[0.9375rem] font-semibold text-sky-400">
          {s.external ? "Visit site" : "Explore"}
          <Icon name={s.external ? "arrowUpRight" : "arrowRight"} size={18} className="transition-transform duration-(--duration-base) group-hover:translate-x-1" />
        </span>
      </div>
    </article>
  );
}
