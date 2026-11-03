import Link from "next/link";
import { cx } from "@/lib/cx";
import { plain } from "@/lib/placeholder";
import { Icon } from "@/components/ui/Icon";

export interface Crumb {
  label: string;
  /** Omit for the current page (last item). */
  href?: string;
}

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

/** Breadcrumb trail with BreadcrumbList structured data. "Home" goes to "/" (resolved to the visitor's region). */
export function Breadcrumbs({ items, tone = "light" }: { items: Crumb[]; tone?: "light" | "dark" }) {
  const trail: Crumb[] = [{ label: "Home", href: "/" }, ...items];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: plain(c.label),
      ...(c.href ? { item: `${siteUrl}${c.href}` } : {}),
    })),
  };
  const dark = tone === "dark";
  return (
    <nav aria-label="Breadcrumb">
      <ol className={cx("flex flex-wrap items-center gap-x-2 gap-y-1 text-small", dark ? "text-on-navy-muted" : "text-grey-600")}>
        {trail.map((c, i) => {
          const last = i === trail.length - 1;
          return (
            <li key={`${c.label}-${i}`} className="inline-flex items-center gap-2">
              {c.href && !last ? (
                <Link href={c.href} className={cx("link-underline transition-colors duration-(--duration-base)", dark ? "hover:text-white" : "hover:text-navy-950")}>
                  {plain(c.label)}
                </Link>
              ) : (
                <span aria-current="page" className={dark ? "text-white" : "text-navy-950"}>
                  {plain(c.label)}
                </span>
              )}
              {!last && <Icon name="chevronRight" size={14} className="opacity-60" />}
            </li>
          );
        })}
      </ol>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    </nav>
  );
}
