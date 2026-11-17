"use client";

import type { OfficeInfo, RegionInfo } from "@/lib/data/site";
import type { RegionSlug } from "@/lib/region";
import { cx } from "@/lib/cx";
import { Icon } from "@/components/ui/Icon";
import { useCurrentRegion } from "@/components/nav/useCurrentRegion";

const telHref = (n: string) => `tel:${n.replace(/[^+\d]/g, "")}`;

interface Props {
  offices: OfficeInfo[];
  regions: RegionInfo[];
  /** The page's region on a regional homepage (server-known, right without JavaScript); null on global pages such as /contact, where the visitor's cookie decides after hydration. */
  region: RegionSlug | null;
  fallbackRegion: RegionSlug;
}

/**
 * The five office cards of "Our Presence" (Figma Frame 12461): the region's featured office comes first as
 * "Your nearest office" on navy; the others are white with their country as the label. Shared by the homepages
 * (region from the URL) and the Contact page (region from the visitor's cookie, DEFAULT_REGION before hydration).
 */
export function OfficeCards({ offices, regions, region, fallbackRegion }: Props) {
  const current = useCurrentRegion(regions, region, fallbackRegion);
  const featured = offices.find((o) => o.slug === current?.featuredOfficeSlug) ?? null;
  const rest = offices.filter((o) => o.slug !== featured?.slug);
  const ordered = featured ? [featured, ...rest] : rest;
  return (
    <ul className="scrollbar-none flex max-w-[1314px] snap-x gap-[17px] overflow-x-auto pb-2 lg:grid lg:grid-cols-5 lg:overflow-visible lg:pb-0" role="list">
      {ordered.map((o) => {
        const isFeatured = o.slug === featured?.slug;
        return (
          <li key={o.slug} className="w-[249px] shrink-0 snap-start lg:w-auto">
            <article className={cx("flex h-full min-h-[271px] flex-col rounded-lg p-6", isFeatured ? "bg-navy-900 text-white ring-1 ring-navy-900" : "bg-white ring-1 ring-grey-200")} data-reveal data-nearest={isFeatured || undefined}>
              <p className={cx("label-caps", isFeatured ? "text-sky-300" : "text-blue-600")}>{isFeatured ? "Your nearest office" : o.country}</p>
              <h3 className={cx("mt-3 font-ui text-[1.375rem] font-bold leading-[1.3] tracking-[-0.02em]", isFeatured ? "text-white" : "text-navy-900")}>{o.label}</h3>
              <address className={cx("mt-3 font-body text-[0.875rem] not-italic leading-[1.63]", isFeatured ? "text-grey-300" : "text-grey-700")}>
                {o.addressLines.map((l) => (
                  <span key={l} className="block">
                    {l}
                  </span>
                ))}
              </address>
              {o.phone && (
                <a href={o.phoneHref ?? telHref(o.phone)} className={cx("inline-flex h-9 items-center gap-2 pt-4 font-body text-[0.875rem] font-semibold leading-5", isFeatured ? "text-sky-300 hover:text-white" : "text-blue-600 hover:text-blue-500")}>
                  <Icon name="phone" size={16} />
                  {o.phone}
                </a>
              )}
            </article>
          </li>
        );
      })}
    </ul>
  );
}
