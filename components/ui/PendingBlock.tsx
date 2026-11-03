import { cx } from "@/lib/cx";
import { TbcTag } from "./SectionHeader";

/**
 * Designed stand-in for a block of copy the client has not supplied yet (logged in CONTENT_TODO.md).
 * Reads as intentional in a design review: a quiet framed panel with a "to be confirmed" tag, never brackets.
 */
export function PendingBlock({ label = "Copy to be confirmed", lines = 3, tone = "light", className }: { label?: string; lines?: number; tone?: "light" | "dark"; className?: string }) {
  const dark = tone === "dark";
  return (
    <div className={cx("rounded-card border border-dashed p-6 md:p-7", dark ? "border-white/20" : "border-grey-300 bg-grey-25", className)}>
      <TbcTag tone={tone}>{label}</TbcTag>
      <div aria-hidden="true" className="mt-5 grid gap-2.5">
        {Array.from({ length: lines }, (_, i) => (
          <span key={i} className={cx("block h-2.5 rounded-full", dark ? "bg-white/10" : "bg-grey-100")} style={{ width: `${i === lines - 1 ? 58 : 100 - i * 6}%` }} />
        ))}
      </div>
    </div>
  );
}
