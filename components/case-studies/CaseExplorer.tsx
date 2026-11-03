"use client";

import { useId, useMemo, useState } from "react";
import type { CaseListItem, Facet } from "@/lib/data/caseStudies";
import { cx } from "@/lib/cx";
import { useLocationSearch } from "@/lib/use-client-snapshot";
import { CaseCard } from "@/components/cards/CaseCard";
import { CardArt } from "@/components/media/CardArt";
import { Icon } from "@/components/ui/Icon";

type Key = "industry" | "pillar";
type Selection = Record<Key, string | null>;

const PARAM: Record<Key, string> = { industry: "industry", pillar: "service" };

const matches = (c: CaseListItem, sel: Selection) =>
  (!sel.industry || c.industry === sel.industry) && (!sel.pillar || c.pillars.includes(sel.pillar));

/**
 * Filterable case-study grid. Filtering runs client-side over the full list (the route stays static);
 * the selection is mirrored to the query string so a filtered view can be shared, and read back once on load.
 * Chips are toggle buttons (aria-pressed); the result count is announced politely.
 */
export function CaseExplorer({ items, industries, pillars }: { items: CaseListItem[]; industries: Facet[]; pillars: Facet[] }) {
  // The visitor's choice; until they choose, a shared filter is read back from the URL (client only, after
  // hydration, so the static HTML stays valid).
  const [picked, setSel] = useState<Selection | null>(null);
  const search = useLocationSearch();
  const restored = useMemo<Selection>(() => {
    const q = new URLSearchParams(search);
    const pick = (key: Key, facets: Facet[]) => {
      const v = q.get(PARAM[key]);
      return v && facets.some((f) => f.value === v) ? v : null;
    };
    return { industry: pick("industry", industries), pillar: pick("pillar", pillars) };
  }, [search, industries, pillars]);
  const sel = picked ?? restored;
  const [touched, setTouched] = useState(false);
  const countId = useId();

  const update = (next: Selection) => {
    setSel(next);
    setTouched(true);
    const url = new URL(window.location.href);
    for (const k of Object.keys(PARAM) as Key[]) {
      if (next[k]) url.searchParams.set(PARAM[k], next[k]!);
      else url.searchParams.delete(PARAM[k]);
    }
    window.history.replaceState(window.history.state, "", `${url.pathname}${url.search}${url.hash}`);
  };
  const toggle = (key: Key, value: string | null) => update({ ...sel, [key]: sel[key] === value ? null : value });

  const shown = useMemo(() => items.filter((c) => matches(c, sel)), [items, sel]);
  // Counts per chip reflect the other facet's selection, so a chip never promises results it can't show.
  const count = (key: Key, value: string | null) => items.filter((c) => matches(c, { ...sel, [key]: value })).length;
  const active = !!(sel.industry || sel.pillar);
  const noun = (n: number) => (n === 1 ? "success story" : "success stories");

  const groups: { key: Key; label: string; facets: Facet[]; all: string }[] = [
    { key: "industry", label: "Industry", facets: industries, all: "All industries" },
    { key: "pillar", label: "Service", facets: pillars, all: "All services" },
  ];

  return (
    <div>
      <div className="grid gap-6 rounded-card border border-grey-200 bg-grey-25 p-5 md:p-7" role="group" aria-label="Filter case studies">
        {groups
          .filter((g) => g.facets.length > 1)
          .map((g) => (
            <div key={g.key} className="grid gap-3 md:grid-cols-[8.5rem_1fr] md:items-start md:gap-6">
              <p id={`${countId}-${g.key}`} className="eyebrow pt-3 text-grey-600">
                Filter by {g.label.toLowerCase()}
              </p>
              {/* Chips scroll sideways on phones rather than wrapping into a tall block. */}
              <ul aria-labelledby={`${countId}-${g.key}`} className="scrollbar-none -mx-5 flex gap-2 overflow-x-auto px-5 pb-1 md:mx-0 md:flex-wrap md:overflow-visible md:px-0">
                {[{ value: null as string | null, label: g.all }, ...g.facets].map((f) => {
                  const pressed = sel[g.key] === f.value;
                  const n = count(g.key, f.value);
                  return (
                    <li key={f.value ?? "all"} className="shrink-0">
                      <button
                        type="button"
                        aria-pressed={pressed}
                        disabled={!pressed && n === 0}
                        onClick={() => (f.value === null ? update({ ...sel, [g.key]: null }) : toggle(g.key, f.value))}
                        className={cx(
                          "inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition-colors duration-(--duration-base) ease-(--ease-out-expo)",
                          "disabled:cursor-not-allowed disabled:opacity-40",
                          pressed
                            ? "border-navy-950 bg-navy-950 text-white"
                            : "border-grey-200 bg-white text-navy-950 hover:enabled:border-brand-600 hover:enabled:text-brand-600",
                        )}
                      >
                        {pressed && f.value !== null && <Icon name="check" size={14} />}
                        {f.label}
                        <span className={cx("tabular-nums", pressed ? "text-sky-300" : "text-grey-500")}>{n}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 md:mt-10">
        <p aria-live="polite" aria-atomic="true" className="font-semibold text-navy-950">
          {active ? (
            <>
              Showing <span className="tabular-nums">{shown.length}</span> of <span className="tabular-nums">{items.length}</span> {noun(items.length)}
            </>
          ) : (
            <>
              <span className="tabular-nums">{items.length}</span> {noun(items.length)}
            </>
          )}
        </p>
        {active && (
          <button
            type="button"
            onClick={() => update({ industry: null, pillar: null })}
            className="group inline-flex min-h-11 items-center gap-2 font-semibold text-brand-600 hover:text-brand-700"
          >
            <Icon name="close" size={16} />
            <span className="link-underline">Clear filters</span>
          </button>
        )}
      </div>

      {shown.length > 0 ? (
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {shown.map((c) => (
            <li key={c.slug} className={touched ? "case-fade" : undefined}>
              <CaseCard c={c} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="relative mt-6 overflow-hidden rounded-card bg-navy-950 px-6 py-16 text-center text-white md:py-24">
          <CardArt icon="search" variant={2} className="opacity-70" />
          <div className="relative">
            <span className="mx-auto inline-flex size-14 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/20">
              <Icon name="search" size={24} />
            </span>
            <p className="mt-6 font-display text-h3 font-bold">No stories match these filters</p>
            <p className="mx-auto mt-3 max-w-[36ch] text-on-navy-muted">Try another industry or service, or clear the filters to see every story.</p>
            <button
              type="button"
              onClick={() => update({ industry: null, pillar: null })}
              className="btn mt-8 inline-flex min-h-12 items-center justify-center gap-2.5 rounded-btn border border-orange-500 bg-orange-500 px-6 text-[0.9375rem] font-semibold text-navy-950 hover:border-orange-600 hover:bg-orange-600"
              data-magnetic
            >
              Clear filters
            </button>
          </div>
        </div>
      )}
      {/* Cards entering after a filter change fade up (transform/opacity only; skipped under reduced motion). */}
      <style>{`@media (prefers-reduced-motion: no-preference){.case-fade{animation:case-fade var(--duration-slow) var(--ease-out-expo) both}}@keyframes case-fade{from{opacity:0;transform:translate3d(0,12px,0)}to{opacity:1;transform:none}}`}</style>
    </div>
  );
}
