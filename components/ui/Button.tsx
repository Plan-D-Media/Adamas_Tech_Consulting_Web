import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cx } from "@/lib/cx";
import { Icon } from "@/components/ui/Icon";

/**
 * Buttons from Figma: primary (blue-600, white text) and secondary (white, grey-150 stroke, ink-soft text),
 * 13px/700 label with the 16px arrow glyph. "sm" is the header size (48px, radius 5), "md" the hero size (56px, radius 10).
 */
type Variant = "primary" | "secondary";
type Size = "sm" | "md";

const base =
  "btn inline-flex items-center justify-center gap-2.5 whitespace-nowrap px-5 font-ui text-button font-bold transition-[background-color,border-color,color,box-shadow] duration-(--duration-fast) ease-(--ease-out) focus-visible:outline-offset-4";
const variants: Record<Variant, string> = {
  primary: "bg-blue-600 text-white border border-blue-600 hover:bg-blue-500 hover:border-blue-500",
  secondary: "bg-white text-ink-soft border border-grey-150 hover:border-grey-300 hover:bg-tint-50",
};
const sizes: Record<Size, string> = {
  sm: "h-12 rounded-sm",
  md: "h-14 rounded-md",
};

export function buttonClass(variant: Variant = "primary", size: Size = "sm", className?: string) {
  return cx(base, variants[variant], sizes[size], className);
}

interface ButtonLinkProps extends Omit<ComponentProps<typeof Link>, "className"> {
  variant?: Variant;
  size?: Size;
  arrow?: boolean;
  className?: string;
  children: ReactNode;
}

export function ButtonLink({ variant = "primary", size = "sm", arrow = true, className, children, ...rest }: ButtonLinkProps) {
  return (
    <Link className={buttonClass(variant, size, className)} {...rest}>
      {children}
      {arrow && <Icon name="arrow" size={16} />}
    </Link>
  );
}

interface ButtonProps extends Omit<ComponentProps<"button">, "className"> {
  variant?: Variant;
  size?: Size;
  arrow?: boolean;
  className?: string;
  children: ReactNode;
}

export function Button({ variant = "primary", size = "sm", arrow = true, className, children, type = "button", ...rest }: ButtonProps) {
  return (
    <button type={type} className={buttonClass(variant, size, className)} {...rest}>
      {children}
      {arrow && <Icon name="arrow" size={16} />}
    </button>
  );
}

/** Text link with the arrow glyph (mega menu "Services overview", "Explore Cloud Services"). */
export function ArrowLink({ className, children, external, ...rest }: Omit<ComponentProps<typeof Link>, "className"> & { className?: string; external?: boolean; children: ReactNode }) {
  const cls = cx("inline-flex items-center gap-2 font-body font-semibold text-blue-500 hover:text-blue-600 transition-colors duration-(--duration-fast)", className);
  if (external) {
    return (
      <a className={cls} target="_blank" rel="noopener noreferrer" href={String(rest.href)}>
        {children}
        <Icon name="external" size={12} />
      </a>
    );
  }
  return (
    <Link className={cls} {...rest}>
      {children}
      <Icon name="arrow" size={16} />
    </Link>
  );
}
