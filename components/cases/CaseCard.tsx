import Link from "next/link";
import type { CaseCardData } from "@/lib/data/home";
import { plain } from "@/lib/placeholder";
import { isPending } from "@/lib/public-copy";
import { Img } from "@/components/media/Img";
import { Icon } from "@/components/ui/Icon";

/**
 * Case-study card for the listing and the "related" rail, on the homepage card pattern (photo, caps label, title,
 * "Explore" link) laid out as a grid tile rather than a rail card.
 *
 * The headline figure is only drawn when the row carries a real one: lib/data/caseStudies.ts replaces a figure the
 * sources contradict with a placeholder, and a placeholder never reaches the public build (QA BUG-014).
 */
export function CaseCard({ item, index }: { item: CaseCardData; index?: number }) {
  const metric = isPending(item.headlineMetric) ? null : plain(item.headlineMetric);
  return (
    <Link
      href={`/case-studies/${item.slug}`}
      className="group relative flex h-full flex-col rounded-[9px] bg-white p-[7px] pb-[22px] shadow-[0_10px_32px_rgb(58_74_110/0.07)] ring-1 ring-grey-200 transition-shadow duration-(--duration-base) hover:shadow-[0_14px_40px_rgb(58_74_110/0.14)]"
    >
      <div className="relative h-[216px] overflow-hidden rounded-md bg-navy-900">
        {item.image && <Img src={item.image} fill sizes="(min-width: 1024px) 420px, (min-width: 640px) 50vw, 100vw" className="object-cover" />}
        {typeof index === "number" && (
          <span className="absolute left-[15px] top-[15px] inline-flex h-[37px] w-[37px] items-center justify-center rounded-full bg-navy-900/70 font-heading text-[0.5625rem] font-bold text-white backdrop-blur" aria-hidden="true">
            {String(index + 1).padStart(2, "0")}
          </span>
        )}
        {item.draft && <span className="absolute right-3 top-3 rounded-xs bg-orange-500 px-1.5 py-0.5 font-body text-[0.625rem] font-bold uppercase tracking-wider text-navy-950">Draft</span>}
      </div>
      <p className="mt-5 px-[14px] font-heading text-[1rem] font-bold uppercase leading-[0.85] tracking-[0.08em] text-blue-600">{plain(item.label) || "Case study"}</p>
      <h3 className="mt-[9px] px-[14px] font-heading text-[1.25rem] font-bold leading-[1.4] text-navy-850">{plain(item.title)}</h3>
      {metric && (
        <p className="mt-3 px-[14px] font-heading text-[1.75rem] font-bold leading-none text-navy-850">
          {metric}
          {item.metricLabel && <span className="ml-2 align-middle font-body text-[0.875rem] font-normal text-grey-600">{plain(item.metricLabel)}</span>}
        </p>
      )}
      <span className="mt-auto inline-flex items-center gap-3 px-[14px] pt-[18px] font-heading text-[1rem] font-bold leading-none text-blue-600 group-hover:text-blue-500">
        Explore
        <span className="sr-only">: {plain(item.title)}</span>
        <Icon name="arrow" size={17} />
      </span>
    </Link>
  );
}
