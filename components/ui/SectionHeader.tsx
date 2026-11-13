import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

/**
 * Section header from the Figma "SectionTitle" frames: eyebrow (Manrope 800 28, caps, blue-600), H2 12px below
 * (Manrope 700 43/49, -1.5px), optional intro 17px below (Manrope 400 20, grey-600). Scales down below 1024px.
 */
export function Eyebrow({ children, className, as: Tag = "p" }: { children: ReactNode; className?: string; as?: "p" | "span" }) {
  return <Tag className={cx("eyebrow text-[clamp(1rem,0.7rem+0.9vw,1.75rem)]", className)}>{children}</Tag>;
}

export function Heading2({ children, className, id }: { children: ReactNode; className?: string; id?: string }) {
  return (
    <h2 id={id} className={cx("font-heading text-[clamp(1.875rem,1.2rem+1.9vw,2.6875rem)] font-bold leading-[1.14] tracking-[-0.035em] text-navy-800", className)}>
      {children}
    </h2>
  );
}

interface Props {
  id?: string;
  eyebrow?: string | null;
  heading?: string | null;
  body?: string | null;
  align?: "left" | "center";
  className?: string;
  headingClassName?: string;
  /** Rendered to the right of the header on wide screens (slider controls, links). */
  aside?: ReactNode;
  dark?: boolean;
}

export function SectionHeader({ id, eyebrow, heading, body, align = "left", className, headingClassName, aside, dark }: Props) {
  return (
    <div className={cx("flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between", className)} data-reveal>
      <div className={cx("max-w-[46rem]", align === "center" && "mx-auto text-center")}>
        {eyebrow && <Eyebrow className={cx(dark && "text-sky-300")}>{eyebrow}</Eyebrow>}
        {heading && (
          <Heading2 id={id} className={cx("mt-3", dark && "text-white", headingClassName)}>
            {heading}
          </Heading2>
        )}
        {body && <p className={cx("mt-4 max-w-[40.625rem] font-heading text-[clamp(1rem,0.9rem+0.3vw,1.25rem)] leading-[1.45]", dark ? "text-grey-300" : "text-grey-600")}>{body}</p>}
      </div>
      {aside && <div className="shrink-0">{aside}</div>}
    </div>
  );
}
