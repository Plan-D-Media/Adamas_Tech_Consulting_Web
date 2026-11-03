import type { Media } from "@/lib/media";
import { cx } from "@/lib/cx";
import { Img } from "@/components/media/Img";
import { Icon } from "@/components/ui/Icon";

/**
 * Certification / partner badge on a white tile (the supplied badges are small, white-backed images).
 * Falls back to an award glyph when a badge is missing.
 */
export function BadgeTile({ badge, name, size = "md", className }: { badge: Media | null; name: string; size?: "sm" | "md" | "lg"; className?: string }) {
  return (
    <span
      className={cx(
        "relative flex shrink-0 items-center justify-center rounded-card bg-white ring-1 ring-grey-200",
        size === "sm" && "h-16 w-24 p-2.5",
        size === "md" && "h-20 w-32 p-3",
        size === "lg" && "aspect-[16/10] w-full p-6 md:p-8",
        className,
      )}
    >
      {badge ? (
        <span className={cx("relative block h-full w-full", size === "lg" && "max-h-24 max-w-44")}>
          <Img media={badge} sizes={size === "lg" ? "(min-width: 1024px) 320px, 60vw" : "128px"} alt={`${name} badge`} className="!object-contain" />
        </span>
      ) : (
        <Icon name="award" size={size === "lg" ? 56 : 32} strokeWidth={1.25} className="text-brand-600" />
      )}
    </span>
  );
}
