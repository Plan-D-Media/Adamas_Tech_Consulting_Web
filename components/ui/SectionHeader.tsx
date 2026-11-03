import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

/**
 * Eyebrow + heading + intro, aligned to the 12-column grid.
 * `tone="dark"` for navy sections.
 */
export function SectionHeader({
  eyebrow,
  heading,
  intro,
  tone = "light",
  action,
  as: Tag = "h2",
  id,
  className,
}: {
  eyebrow?: string | null;
  heading?: string | null;
  intro?: string | null;
  tone?: "light" | "dark";
  action?: ReactNode;
  as?: "h1" | "h2";
  id?: string;
  className?: string;
}) {
  if (!heading && !eyebrow) return null;
  const dark = tone === "dark";
  return (
    <div className={cx("grid-12 items-end gap-y-6", className)} data-reveal>
      <div className="col-span-4 md:col-span-8 lg:col-span-7">
        {eyebrow && <Eyebrow tone={tone}>{eyebrow}</Eyebrow>}
        {heading && (
          <Tag id={id} className={cx("mt-4 text-h2", dark ? "text-white" : "text-navy-950")}>
            {heading}
          </Tag>
        )}
        {intro && (
          <p className={cx("mt-5 max-w-[42rem] text-lead", dark ? "text-on-navy-muted" : "text-grey-700")}>{intro}</p>
        )}
      </div>
      {action && <div className="col-span-4 md:col-span-4 md:col-start-9 lg:col-span-4 lg:col-start-9 md:justify-self-end">{action}</div>}
    </div>
  );
}

export function Eyebrow({ children, tone = "light", className }: { children: ReactNode; tone?: "light" | "dark"; className?: string }) {
  return (
    <p className={cx("eyebrow flex items-center gap-3", tone === "dark" ? "text-sky-400" : "text-brand-600", className)}>
      <span aria-hidden="true" className={cx("h-px w-8", tone === "dark" ? "bg-sky-400" : "bg-brand-600")} />
      {children}
    </p>
  );
}

/** Small marker for content still awaiting client sign-off (only visible in draft preview). */
export function DraftBadge({ className }: { className?: string }) {
  return (
    <span
      className={cx(
        "inline-flex items-center rounded-full border border-dashed border-orange-700 bg-white/90 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-orange-700",
        className,
      )}
    >
      Draft
    </span>
  );
}

/** Designed marker for names or details the client has still to confirm (never brackets on screen). */
export function TbcTag({ children = "Name to be confirmed", tone = "light", className }: { children?: ReactNode; tone?: "light" | "dark"; className?: string }) {
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold leading-none",
        tone === "dark" ? "bg-white/10 text-sky-300 ring-1 ring-white/15" : "bg-brand-50 text-brand-700 ring-1 ring-brand-100",
        className,
      )}
    >
      <span aria-hidden="true" className={cx("size-1.5 rounded-full", tone === "dark" ? "bg-sky-300" : "bg-brand-600")} />
      {children}
    </span>
  );
}
