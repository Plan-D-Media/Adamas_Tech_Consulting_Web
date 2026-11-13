import { mediaUrl } from "@/lib/media";

/** 24x14 region flag exported from Figma (public/media/flags, AVIF + WebP at 1x/2x/3x). Decorative: the label beside it names the region. */
export function Flag({ slug, className }: { slug: string; className?: string }) {
  const base = `flags/${slug}`;
  const set = (ext: string) => `${mediaUrl(`${base}.${ext}`)} 1x, ${mediaUrl(`${base}@2x.${ext}`)} 2x, ${mediaUrl(`${base}@3x.${ext}`)} 3x`;
  return (
    <picture className={className}>
      <source type="image/avif" srcSet={set("avif")} />
      <img src={mediaUrl(`${base}.webp`)} srcSet={set("webp")} width={24} height={14} alt="" className="block h-3.5 w-6 rounded-xs object-cover" loading="lazy" decoding="async" />
    </picture>
  );
}
