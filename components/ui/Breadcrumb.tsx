import Link from "next/link";
import type { Crumb } from "@/lib/seo";
import { Icon } from "@/components/ui/Icon";

/**
 * Visible breadcrumb trail for inner pages (Home first; "/" follows the visitor's region cookie through proxy.ts).
 * Pair it with `breadcrumbJsonLd()` for the BreadcrumbList structured data (brief section 10).
 */
export function Breadcrumb({ crumbs, className }: { crumbs: Crumb[]; className?: string }) {
  const items = [{ name: "Home", path: "/" }, ...crumbs];
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-1.5 font-body text-caption text-grey-600" role="list">
        {items.map((c, i) => {
          const last = i === items.length - 1;
          return (
            <li key={c.path} className="inline-flex items-center gap-1.5">
              {i > 0 && <Icon name="chevron-right" size={14} className="text-grey-500" />}
              {last ? (
                <span aria-current="page" className="font-semibold text-navy-800">
                  {c.name}
                </span>
              ) : (
                <Link href={c.path} className="inline-flex min-h-6 items-center hover:text-blue-600">
                  {c.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
