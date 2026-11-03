import { Icon, type IconName } from "@/components/ui/Icon";
import { cx } from "@/lib/cx";

/**
 * Branded artwork for cards that have no photography yet: a layered mesh in the logo blues,
 * a fine grid and one large, faint outline glyph for the subject. Three compositions, so a row
 * of cards never repeats the same frame. Decorative only.
 */
const meshes = [
  "radial-gradient(60% 70% at 85% 10%, rgb(79 182 226 / 0.55), transparent 70%), radial-gradient(70% 80% at 0% 100%, rgb(38 63 118 / 0.95), transparent 70%), radial-gradient(50% 60% at 40% 60%, rgb(0 112 188 / 0.45), transparent 70%)",
  "radial-gradient(55% 65% at 10% 15%, rgb(143 211 239 / 0.4), transparent 70%), radial-gradient(70% 70% at 100% 90%, rgb(0 112 188 / 0.65), transparent 70%), radial-gradient(60% 60% at 60% 30%, rgb(38 63 118 / 0.8), transparent 70%)",
  "radial-gradient(70% 60% at 50% 0%, rgb(0 112 188 / 0.6), transparent 70%), radial-gradient(60% 70% at 100% 100%, rgb(79 182 226 / 0.35), transparent 70%), radial-gradient(60% 70% at 0% 70%, rgb(38 63 118 / 0.9), transparent 70%)",
];

const glyphPlacement = [
  "right-[-8%] bottom-[-14%] size-[78%] rotate-[-8deg]",
  "left-[-6%] top-[-10%] size-[70%] rotate-[6deg]",
  "right-[8%] top-[6%] size-[62%]",
];

export function CardArt({ icon, variant = 0, className }: { icon: IconName; variant?: number; className?: string }) {
  const v = Math.abs(variant) % meshes.length;
  return (
    <div aria-hidden="true" className={cx("absolute inset-0 overflow-hidden bg-navy-900", className)}>
      <div className="absolute inset-0" style={{ backgroundImage: meshes[v] }} />
      <div
        className="absolute inset-0 opacity-[0.14] [mask-image:radial-gradient(80%_80%_at_50%_40%,#000,transparent)]"
        style={{
          backgroundImage: "linear-gradient(rgb(255 255 255 / 0.5) 1px, transparent 1px), linear-gradient(90deg, rgb(255 255 255 / 0.5) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      <Icon name={icon} strokeWidth={0.6} className={cx("absolute text-white/[0.16]", glyphPlacement[v])} width={undefined} height={undefined} />
    </div>
  );
}
