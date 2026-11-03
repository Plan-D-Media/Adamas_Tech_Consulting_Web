import Image from "next/image";
import type { Media } from "@/lib/media";
import { cx } from "@/lib/cx";

/**
 * next/image wrapper for DB media. `fill` mode by default (parent sets the aspect ratio);
 * renders a neutral placeholder frame when the media row is missing.
 */
export function Img({
  media,
  sizes,
  className,
  priority = false,
  fill = true,
  alt,
}: {
  media: Media | null;
  sizes: string;
  className?: string;
  priority?: boolean;
  fill?: boolean;
  alt?: string;
}) {
  if (!media) {
    return <div aria-hidden="true" className={cx("media-placeholder absolute inset-0", className)} />;
  }
  const common = {
    src: media.url,
    alt: alt ?? media.alt,
    sizes,
    // Next 16: `priority` is deprecated; above-the-fold images preload and fetch first.
    preload: priority,
    fetchPriority: priority ? ("high" as const) : undefined,
    placeholder: media.blurDataUrl ? ("blur" as const) : ("empty" as const),
    blurDataURL: media.blurDataUrl ?? undefined,
    unoptimized: media.url.endsWith(".svg"),
  };
  if (fill || !media.width || !media.height) {
    return <Image {...common} alt={common.alt} fill className={cx("object-cover", className)} />;
  }
  return <Image {...common} alt={common.alt} width={media.width} height={media.height} className={className} />;
}
