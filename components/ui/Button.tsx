import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { Icon } from "./Icon";
import { cx } from "@/lib/cx";

type Variant = "primary" | "secondary" | "ghost-dark" | "ghost-light";
type Size = "sm" | "md" | "lg";

const sizes: Record<Size, string> = {
  // sm: compact on phones (header), standard from 640px
  sm: "min-h-10 px-3 text-sm sm:min-h-11 sm:px-5 sm:text-[0.9375rem]",
  md: "min-h-12 px-6 text-[0.9375rem]",
  lg: "min-h-14 px-8 text-base",
};

// `.btn` (globals.css) owns the transitions: colours fast, the magnetic offset slow, one easing curve.
const base = "btn group/btn inline-flex items-center justify-center gap-2.5 rounded-btn font-semibold leading-none whitespace-nowrap border";

const variants: Record<Variant, string> = {
  // Orange is the single CTA accent; navy text keeps AA contrast (5.65:1).
  primary: "bg-orange-500 border-orange-500 text-navy-950 hover:bg-orange-600 hover:border-orange-600",
  secondary: "bg-brand-600 border-brand-600 text-white hover:bg-brand-700 hover:border-brand-700",
  "ghost-dark": "bg-transparent border-white/40 text-white hover:border-white hover:bg-white/10",
  "ghost-light": "bg-transparent border-grey-300 text-navy-950 hover:border-navy-950",
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  arrow?: boolean;
  className?: string;
}

function Arrow() {
  return (
    <Icon
      name="arrowRight"
      size={18}
      className="transition-transform duration-(--duration-fast) ease-(--ease-out-expo) group-hover/btn:translate-x-0.5"
    />
  );
}

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  arrow = false,
  external,
  children,
  className,
  ...rest
}: CommonProps & { href: string; external?: boolean } & Omit<ComponentProps<"a">, "href" | "children">) {
  const cls = cx(base, sizes[size], variants[variant], className);
  const magnetic = variant === "primary" ? { "data-magnetic": "" } : {};
  const inner = (
    <>
      {children}
      {arrow && <Arrow />}
      {external && <span className="sr-only"> (opens in a new tab)</span>}
    </>
  );
  if (external || /^https?:\/\//.test(href)) {
    return (
      <a href={href} target="_blank" rel="noopener" className={cls} {...magnetic} {...rest}>
        {inner}
      </a>
    );
  }
  return (
    <Link href={href} className={cls} {...magnetic} {...rest}>
      {inner}
    </Link>
  );
}

export function Button({ variant = "primary", size = "md", arrow, children, className, ...rest }: CommonProps & ComponentProps<"button">) {
  return (
    <button className={cx(base, sizes[size], variants[variant], className)} {...(variant === "primary" ? { "data-magnetic": "" } : {})} {...rest}>
      {children}
      {arrow && <Arrow />}
    </button>
  );
}

/** Text link with arrow: the editorial CTA used across sections. */
export function ArrowLink({
  href,
  children,
  tone = "light",
  external,
  className,
}: {
  href: string;
  children: ReactNode;
  tone?: "light" | "dark";
  external?: boolean;
  className?: string;
}) {
  const cls = cx(
    "group/al inline-flex items-center gap-2 font-semibold transition-colors duration-(--duration-base)",
    tone === "light" ? "text-brand-600 hover:text-brand-700" : "text-white",
    className,
  );
  const label = <span className="link-underline">{children}</span>;
  const icon = (
    <Icon
      name={external ? "arrowUpRight" : "arrowRight"}
      size={18}
      className="shrink-0 transition-transform duration-(--duration-fast) ease-(--ease-out-expo) group-hover/al:translate-x-1"
    />
  );
  if (external || /^https?:\/\//.test(href)) {
    return (
      <a href={href} target="_blank" rel="noopener" className={cls}>
        {label}
        {icon}
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {label}
      {icon}
    </Link>
  );
}
