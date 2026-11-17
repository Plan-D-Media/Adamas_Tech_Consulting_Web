"use client";

import type { RegionInfo } from "@/lib/data/site";
import type { RegionSlug } from "@/lib/region";
import { Icon } from "@/components/ui/Icon";
import { useCurrentRegion } from "@/components/nav/useCurrentRegion";

interface Props {
  regions: RegionInfo[];
  region: RegionSlug | null;
  fallbackRegion: RegionSlug;
}

/** Top bar phone and email for the visitor's region (Figma: 14px Roboto, white at 90%). */
export function TopBarContacts({ regions, region, fallbackRegion }: Props) {
  const r = useCurrentRegion(regions, region, fallbackRegion);
  return (
    <div className="flex min-w-0 items-center gap-6 font-ui text-[0.875rem] leading-none text-white/90">
      {r.phone && (
        <a href={r.phoneHref ?? `tel:${r.phone.replace(/[^+\d]/g, "")}`} className="inline-flex min-h-6 items-center gap-1.5 whitespace-nowrap hover:text-white">
          <Icon name="phone" size={12} className="shrink-0" />
          <span>
            Call Us <span className="font-medium">{r.phone}</span>
          </span>
        </a>
      )}
      {r.email && (
        <a href={`mailto:${r.email}`} className="hidden min-h-6 items-center gap-1.5 truncate hover:text-white sm:inline-flex">
          <Icon name="mail-small" size={12} className="shrink-0" />
          <span className="truncate">{r.email}</span>
        </a>
      )}
    </div>
  );
}
