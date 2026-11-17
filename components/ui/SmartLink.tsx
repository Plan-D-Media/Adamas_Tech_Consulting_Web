import Link from "next/link";
import type { ReactNode } from "react";
import { Icon } from "@/components/ui/Icon";

/** True for an absolute http(s) URL, i.e. a link that leaves this site. */
export function isExternalHref(href: string): boolean {
  return /^https?:\/\//i.test(href);
}

/**
 * A link that may point at another site. Content rows carry plain hrefs, and since the 17 Nov 2026 scope change
 * some of them are product websites (arivoo.in and the other solutions), so cards cannot assume an internal route.
 * An external href becomes a real <a> that opens in a new tab with rel="noopener noreferrer", an external-link icon
 * and a screen-reader note; an internal href stays a prefetching next/link. Anything else about the card is unchanged.
 */
export function SmartLink({
  href,
  className,
  children,
  icon = true,
  iconSize = 12,
  iconClassName,
  prefetch,
  tabIndex,
}: {
  href: string;
  className?: string;
  children: ReactNode;
  /** Set false when the caller draws its own trailing icon. */
  icon?: boolean;
  iconSize?: number;
  iconClassName?: string;
  prefetch?: boolean;
  /** Pass -1 for a duplicated slide or any copy that must stay out of the tab order. */
  tabIndex?: number;
}) {
  if (isExternalHref(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className} tabIndex={tabIndex}>
        {children}
        {icon && <Icon name="external" size={iconSize} className={iconClassName} />}
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    );
  }
  return (
    <Link href={href} className={className} prefetch={prefetch} tabIndex={tabIndex}>
      {children}
    </Link>
  );
}
