import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

/**
 * Section intro from the Cloud Services design (Figma "SectionIntro" / "Eyebrow" + "Heading 2" frames): a 24px
 * Manrope 800 eyebrow in the page's brighter blue on a 14px line, a 52px/57 heading (-2.34px) with the closing
 * words in blue where the design colours them, and an 18px/27 paragraph. Two eyebrow-to-heading gaps exist in the
 * file (45px and 54px): `gap="lg"` is the 54px one.
 */
export function ServiceEyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cx("font-heading text-[clamp(1.1875rem,1rem+0.4vw,1.5rem)] font-extrabold leading-[14px] tracking-[0.0525em] text-blue-link", className)}>{children}</p>;
}

export function AccentHeading({ text, accent }: { text: string; accent?: string }) {
  if (accent && text.endsWith(accent) && text.length > accent.length) {
    return (
      <>
        {text.slice(0, -accent.length)}
        <span className="text-blue-link">{accent}</span>
      </>
    );
  }
  return <>{text}</>;
}

interface Props {
  id?: string;
  eyebrow?: string | null;
  heading?: string | null;
  accent?: string;
  body?: string | null;
  gap?: "md" | "lg";
  className?: string;
  headingClassName?: string;
  bodyClassName?: string;
  children?: ReactNode;
}

export function ServiceSectionHead({ id, eyebrow, heading, accent, body, gap = "md", className, headingClassName, bodyClassName, children }: Props) {
  return (
    <div className={className} data-reveal>
      {eyebrow && <ServiceEyebrow>{eyebrow}</ServiceEyebrow>}
      {heading && (
        <h2 id={id} className={cx("font-heading text-[clamp(2rem,1.4rem+1.9vw,3.25rem)] font-semibold leading-[1.1] tracking-[-0.045em] text-navy-850", eyebrow && (gap === "lg" ? "mt-10" : "mt-[31px]"), headingClassName)}>
          <AccentHeading text={heading} accent={accent} />
        </h2>
      )}
      {body && <p className={cx("mt-[25px] font-heading text-[1.125rem] leading-[1.5] text-grey-550", bodyClassName)}>{body}</p>}
      {children}
    </div>
  );
}
