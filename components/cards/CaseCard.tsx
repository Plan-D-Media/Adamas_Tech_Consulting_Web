import Link from "next/link";
import type { CaseCardData } from "@/lib/data/home";
import { Img } from "@/components/media/Img";
import { Icon } from "@/components/ui/Icon";
import { DraftBadge, TbcTag } from "@/components/ui/SectionHeader";
import { MetricCount } from "@/components/motion/MetricCount";
import { copy, isPlaceholder } from "@/lib/placeholder";

/**
 * Metric-forward case card: the outcome is the focal point (counted up as the card arrives),
 * its descriptor reads underneath, and the story title follows smaller and lighter, so the
 * figure is never said twice at the same weight.
 */
export function CaseCard({ c, headingLevel: H = "h3" }: { c: CaseCardData; headingLevel?: "h3" | "h4" }) {
  const metricPending = isPlaceholder(c.headlineMetric);
  const descriptor = c.metricLabel ? copy(c.metricLabel) : null;
  return (
    <article className="card-lift group relative flex h-full flex-col overflow-hidden rounded-card border border-grey-200 bg-white hover:border-brand-200">
      <div className="card-media relative aspect-[16/10] overflow-hidden bg-navy-900">
        <div data-parallax className="absolute inset-y-0 -inset-x-[6%]">
          <Img media={c.image} sizes="(min-width: 1024px) 420px, (min-width: 640px) 60vw, 84vw" />
        </div>
        <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-navy-950">{c.label}</span>
        {c.draft && <DraftBadge className="absolute right-4 top-4" />}
      </div>
      <div className="flex flex-1 flex-col p-6 md:p-7">
        {metricPending ? (
          <TbcTag className="self-start">Result to be confirmed</TbcTag>
        ) : (
          <MetricCount value={c.headlineMetric} className="font-display-wide text-metric font-bold tabular-nums text-brand-600" />
        )}
        {descriptor && !descriptor.pending && (
          <p className="mt-2 text-[0.9375rem] font-semibold text-navy-950 first-letter:uppercase">{descriptor.text}</p>
        )}
        <H className="mt-5 border-t border-grey-100 pt-5 font-body text-[0.9375rem] font-medium leading-snug tracking-normal text-grey-700 [font-stretch:100%]">
          <Link href={`/case-studies/${c.slug}`} className="line-clamp-2 after:absolute after:inset-0 after:content-['']">
            {copy(c.title).text}
          </Link>
        </H>
        {c.clientDescriptor && <p className="mt-2 line-clamp-1 text-small text-grey-600">{c.clientDescriptor}</p>}
        <span className="mt-auto inline-flex items-center gap-2 pt-6 text-[0.9375rem] font-semibold text-brand-600">
          Read the story
          <Icon name="arrowRight" size={18} className="transition-transform duration-(--duration-base) group-hover:translate-x-1" />
        </span>
      </div>
    </article>
  );
}
