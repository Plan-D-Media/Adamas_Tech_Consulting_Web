import Link from "next/link";
import type { Facet } from "@/lib/data/caseStudies";
import { cx } from "@/lib/cx";

export interface CaseFilterState {
  industry: string | null;
  service: string | null;
  region: string | null;
}

interface Props {
  industries: Facet[];
  services: Facet[];
  regions: Facet[];
  active: CaseFilterState;
  /** How many rows the current selection matches, announced with the results. */
  count: number;
  total: number;
}

/** The query string for `state` with `key` set to `value` (null clears it); empty when nothing is filtered. */
export function caseHref(state: CaseFilterState, key: keyof CaseFilterState, value: string | null): string {
  const next = { ...state, [key]: state[key] === value ? null : value };
  const params = new URLSearchParams();
  for (const k of ["industry", "service", "region"] as const) if (next[k]) params.set(k, next[k]!);
  const q = params.toString();
  return q ? `/case-studies?${q}` : "/case-studies";
}

/**
 * Case-study filters (INNER_PAGES.md section 2). There is no Figma frame for the listing, so these are built from
 * the tokens on the Cloud Services pill pattern.
 *
 * Every control is a plain link to the same page with a query string, so the filters work with JavaScript turned
 * off and each combination has its own shareable URL. The selected pill links back to the unfiltered list, which is
 * how a filter is cleared without a button.
 */
export function CaseFilters({ industries, services, regions, active, count, total }: Props) {
  const groups = (
    [
      { key: "service", label: "Service", facets: services },
      { key: "industry", label: "Industry", facets: industries },
      { key: "region", label: "Region", facets: regions },
    ] satisfies { key: keyof CaseFilterState; label: string; facets: Facet[] }[]
  ).filter((g) => g.facets.length > 0);
  if (groups.length === 0) return null;

  const pill = "inline-flex min-h-9 items-center rounded-pill px-4 font-body text-[0.875rem] leading-none transition-colors duration-(--duration-fast)";
  const filtered = !!(active.industry || active.service || active.region);

  return (
    <div className="mt-8 border-y border-grey-200 py-6" data-compare="case-filters">
      {groups.map((g) => (
        <div key={g.key} className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-2 last:mb-0">
          <span className="w-[72px] shrink-0 font-heading text-[0.8125rem] font-bold uppercase tracking-[0.08em] text-grey-500">{g.label}</span>
          <Link href={caseHref(active, g.key, null)} aria-current={active[g.key] ? undefined : "true"} className={cx(pill, active[g.key] ? "bg-grey-50 text-grey-600 hover:bg-tint-100" : "bg-blue-600 text-white")}>
            All
          </Link>
          {g.facets.map((f) => {
            const on = active[g.key] === f.value;
            return (
              <Link key={f.value} href={caseHref(active, g.key, f.value)} aria-current={on ? "true" : undefined} className={cx(pill, on ? "bg-blue-600 text-white" : "bg-grey-50 text-grey-600 hover:bg-tint-100")}>
                {f.label}
              </Link>
            );
          })}
        </div>
      ))}
      <p className="mt-5 font-body text-[0.875rem] text-grey-600" role="status">
        {filtered ? `${count} of ${total} case studies match these filters.` : `${total} case ${total === 1 ? "study" : "studies"}.`}
        {filtered && (
          <>
            {" "}
            <Link href="/case-studies" className="font-semibold text-blue-600 hover:underline">
              Clear filters
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
