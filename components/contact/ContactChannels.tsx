"use client";

import type { RegionInfo } from "@/lib/data/site";
import type { RegionCode, RegionSlug } from "@/lib/region";
import { cx } from "@/lib/cx";
import { Icon } from "@/components/ui/Icon";
import { useCurrentRegion } from "@/components/nav/useCurrentRegion";

interface Props {
  regions: RegionInfo[];
  fallbackRegion: RegionSlug;
  /** Office hours line from the Contact page row; the seed note says it belongs to the India number only. */
  hours: { region: RegionCode; text: string } | null;
}

/**
 * The three regional phone and email contacts, in the same card style as the "Our Presence" office cards: the
 * visitor's region (cookie, DEFAULT_REGION before hydration and without JavaScript) comes first on navy as
 * "Your region", the other two on white. Every number and address is still shown, so nothing depends on the cookie.
 */
export function ContactChannels({ regions, fallbackRegion, hours }: Props) {
  const current = useCurrentRegion(regions, null, fallbackRegion);
  const ordered = [...regions].sort((a, b) => Number(b.slug === current?.slug) - Number(a.slug === current?.slug));
  return (
    <ul className="grid gap-[17px] sm:grid-cols-3" role="list" data-contact-channels>
      {ordered.map((r) => {
        const isCurrent = r.slug === current?.slug;
        const linkCls = cx("inline-flex min-h-9 items-center gap-2 font-body text-[0.9375rem] font-semibold leading-5 [overflow-wrap:anywhere]", isCurrent ? "text-sky-300 hover:text-white" : "text-blue-600 hover:text-blue-500");
        return (
          <li key={r.code}>
            <article className={cx("flex h-full flex-col rounded-lg p-6", isCurrent ? "bg-navy-900 text-white ring-1 ring-navy-900" : "bg-white ring-1 ring-grey-200")} data-reveal data-current-region={isCurrent || undefined}>
              <p className={cx("label-caps", isCurrent ? "text-sky-300" : "text-blue-600")}>{isCurrent ? "Your region" : "Region"}</p>
              <h3 className={cx("mt-3 font-ui text-[1.375rem] font-bold leading-[1.3] tracking-[-0.02em]", isCurrent ? "text-white" : "text-navy-900")}>{r.label}</h3>
              <div className="mt-3 flex flex-col items-start gap-1">
                {r.phone && (
                  <a href={r.phoneHref ?? `tel:${r.phone.replace(/[^+\d]/g, "")}`} className={linkCls}>
                    <Icon name="phone" size={16} className="shrink-0" />
                    {r.phone}
                  </a>
                )}
                {r.email && (
                  <a href={`mailto:${r.email}`} className={linkCls}>
                    <Icon name="mail-small" size={16} className="shrink-0" />
                    {r.email}
                  </a>
                )}
              </div>
              {hours && hours.region === r.code && <p className={cx("mt-3 font-body text-[0.875rem] leading-[1.63]", isCurrent ? "text-grey-300" : "text-grey-700")}>{hours.text}</p>}
            </article>
          </li>
        );
      })}
    </ul>
  );
}
