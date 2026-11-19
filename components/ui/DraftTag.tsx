import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

/**
 * Review-only markers. Nothing here ever reaches the public build: the sections that use them are rendered only
 * while drafts are previewed (lib/figma-draft.ts), so there is no gate inside the components themselves.
 *
 * `DraftTag`  - a small inline badge, for a single unverified value or a designer-supplied heading.
 * `DraftNote` - a block note under a section, saying what the client still has to supply.
 *
 * Both use the same orange as the menu's draft badge so a reviewer reads one visual language across the preview.
 */

export function DraftTag({ children = "Draft", className, title }: { children?: ReactNode; className?: string; title?: string }) {
  return (
    <span
      title={title}
      className={cx(
        "ml-2 inline-block shrink-0 rounded-xs bg-orange-500 px-1.5 py-0.5 align-middle font-body text-[0.625rem] font-bold uppercase tracking-wider text-navy-950",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function DraftNote({ children, className, tone = "light" }: { children: ReactNode; className?: string; tone?: "light" | "dark" }) {
  return (
    <p
      /* Deliberately compact: these notes exist for the reviewer, and a tall box would push every band below it out
         of step with the Figma frame that the same preview is measured against. */
      className={cx(
        "mt-3 rounded-sm px-2.5 py-1 font-body text-[0.75rem] leading-[1.35]",
        tone === "dark" ? "bg-white/10 text-white/80" : "bg-orange-500/10 text-[#9A5208]",
        className,
      )}
    >
      <span className="font-bold uppercase tracking-wider">Draft</span> {children}
    </p>
  );
}
