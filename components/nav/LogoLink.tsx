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
  /** Rendered width: header 205, footer 178 (Figma). The height follows the artwork's own aspect. */
  width?: number;
  priority?: boolean;
  /**
   * Which artwork to use. "colour" is the standard logo, for light backgrounds - the header bar is white glass in
   * both its normal and its scrolled state, so the header always uses it. "white" is the supplied reversed
   * version, for the navy footer and any other dark surface.
   */
  tone?: "colour" | "white";
}

/**
 * Logo linking to the visitor's regional homepage. Server-rendered href is "/" on global pages (proxy.ts then
 * redirects by cookie, so it works without JavaScript); once hydrated it points straight at the cookie's region.
 * The switch waits for hydration (useHydrated snapshot) rather than testing `document`, which differed between the
 * server and the hydrating client and left the attribute unpatched at "/" (QA BUG-017).
 */
/**
 * Width-to-height of the supplied artwork, measured from the tightened viewBoxes in design-src/brand
 * (colour 721.25x169.75, white 938.77x222.98). The CSS sets `h-auto`, so these only keep the box reserved at the
 * right height before the SVG loads; getting them wrong shifts the header on first paint.
 */
const ASPECT = { colour: 4.25, white: 4.21 } as const;

export function LogoLink({ regions, region, fallbackRegion, width = 205, priority, tone = "colour" }: Props) {
  const current = useCurrentRegion(regions, region, fallbackRegion);
  const hydrated = useHydrated();
  const href = region ? `/${region}/` : hydrated ? `/${current.slug}/` : "/";
  // The logo is an SVG (round 9): one file, sharp at 1x and 2x, no <picture> and no raster variants to keep in
  // step. The rasters in public/media/brand are still produced for Organization JSON-LD and HTML email, which
  // cannot use SVG.
  const src = mediaUrl(tone === "white" ? "brand/logo-white.svg" : "brand/logo.svg");
  const height = Math.round(width / ASPECT[tone]);
  return (
    <Link href={href} prefetch={true} className="inline-flex shrink-0 items-center" aria-label={`AdamasTech Consulting, ${current.label} homepage`}>
      {/* eslint-disable-next-line @next/next/no-img-element -- an SVG: next/image serves vectors unoptimised
          anyway (see components/media/Img.tsx), so it would only add a wrapper and a client component here. */}
      <img
        src={src}
        width={width}
        height={height}
        alt=""
        className="block h-auto"
        style={{ width }}
        fetchPriority={priority ? "high" : undefined}
        decoding="async"
      />
    </Link>
  );
}
