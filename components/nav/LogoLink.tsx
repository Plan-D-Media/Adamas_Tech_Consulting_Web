"use client";

import Link from "next/link";
import type { RegionInfo } from "@/lib/data/site";
import { mediaUrl } from "@/lib/media";
import type { RegionSlug } from "@/lib/region";
import { useCurrentRegion } from "@/components/nav/useCurrentRegion";
import { useHydrated } from "@/lib/use-client-snapshot";

interface Props {
  regions: RegionInfo[];
  region: RegionSlug | null;
  fallbackRegion: RegionSlug;
  /** Rendered size: header 205x60, footer 178x52 (Figma). */
  width?: number;
  height?: number;
  priority?: boolean;
}

/**
 * Logo linking to the visitor's regional homepage. Server-rendered href is "/" on global pages (proxy.ts then
 * redirects by cookie, so it works without JavaScript); once hydrated it points straight at the cookie's region.
 * The switch waits for hydration (useHydrated snapshot) rather than testing `document`, which differed between the
 * server and the hydrating client and left the attribute unpatched at "/" (QA BUG-017).
 */
export function LogoLink({ regions, region, fallbackRegion, width = 205, height = 60, priority }: Props) {
  const current = useCurrentRegion(regions, region, fallbackRegion);
  const hydrated = useHydrated();
  const href = region ? `/${region}/` : hydrated ? `/${current.slug}/` : "/";
  return (
    <Link href={href} prefetch={true} className="inline-flex shrink-0 items-center" aria-label={`AdamasTech Consulting, ${current.label} homepage`}>
      <picture>
        <source type="image/avif" srcSet={mediaUrl("brand/logo.avif")} />
        <img src={mediaUrl("brand/logo.webp")} width={width} height={height} alt="" className="block h-auto" style={{ width }} fetchPriority={priority ? "high" : undefined} decoding="async" />
      </picture>
    </Link>
  );
}
