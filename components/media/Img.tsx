import Image, { type ImageProps } from "next/image";
import type { Media } from "@/lib/media";
import { mediaUrl } from "@/lib/media";

type Props = Omit<ImageProps, "src" | "alt" | "width" | "height"> & {
  /** A MediaAsset from the database, or a key under MEDIA_BASE_URL (e.g. "brand/logo.webp"). */
  src: Media | string;
  alt?: string;
  width?: number;
  height?: number;
};

/**
 * next/image over MEDIA_BASE_URL: local files in public/media, CloudFront in production (next.config.ts allows the host).
 * SVGs are served as-is (no optimisation pass).
 */
export function Img({ src, alt, width, height, ...rest }: Props) {
  const media = typeof src === "string" ? null : src;
  const url = media ? media.url : mediaUrl(src as string);
  const isSvg = url.endsWith(".svg");
  return (
    <Image
      src={url}
      alt={alt ?? media?.alt ?? ""}
      width={rest.fill ? undefined : (width ?? media?.width ?? undefined)}
      height={rest.fill ? undefined : (height ?? media?.height ?? undefined)}
      placeholder={media?.blurDataUrl ? "blur" : undefined}
      blurDataURL={media?.blurDataUrl ?? undefined}
      unoptimized={isSvg || rest.unoptimized}
      {...rest}
    />
  );
}
