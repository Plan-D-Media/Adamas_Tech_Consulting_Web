import type { Media } from "@/lib/media";
import { cx } from "@/lib/cx";
import { Img } from "@/components/media/Img";
import { CardArt } from "@/components/media/CardArt";
import { initials } from "./meta";

/**
 * Leader portrait. Photography when supplied; otherwise a designed monogram on the branded artwork,
 * so a missing photo reads as intentional rather than empty. The name always sits beside it, so the image is decorative (alt="").
 */
export function Portrait({ name, photo, variant = 0, sizes, className }: { name: string; photo: Media | null; variant?: number; sizes: string; className?: string }) {
  return (
    <div className={cx("card-media relative overflow-hidden rounded-card bg-navy-900", className)}>
      {photo ? (
        <Img media={photo} sizes={sizes} alt="" className="object-[50%_20%]" />
      ) : (
        <>
          <CardArt icon="users" variant={variant} />
          <span aria-hidden="true" className="absolute inset-0 flex items-center justify-center font-display-wide text-[clamp(3rem,8vw,5.5rem)] font-bold tracking-tight text-white/90">
            {initials(name)}
          </span>
          <span className="sr-only">Portrait to be supplied</span>
        </>
      )}
    </div>
  );
}
