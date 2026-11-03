"use client";

import { useDeferredValue, useEffect, useId, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import Link from "next/link";
import type { SearchItem, SearchType } from "@/lib/data/search";
import { cx } from "@/lib/cx";
import { useLocationSearch } from "@/lib/use-client-snapshot";
import { Icon } from "@/components/ui/Icon";
import { ArrowLink } from "@/components/ui/Button";

const ORDER: SearchType[] = ["Service", "Solution", "Case study", "Event", "Page"];
const PLURAL: Record<SearchType, string> = { Service: "Services", Solution: "Solutions", "Case study": "Case studies", Event: "Events", Page: "Pages" };

const norm = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();

interface Hit {
  item: SearchItem;
  score: number;
}

/** Every word must appear somewhere; title matches rank first, then descriptor, then hidden keywords. */
function search(items: SearchItem[], q: string): Hit[] {
  const words = norm(q).split(/\s+/).filter(Boolean);
  if (!words.length) return items.map((item) => ({ item, score: 0 }));
  const hits: Hit[] = [];
  for (const item of items) {
    const title = norm(item.title);
    const desc = norm(item.descriptor);
    const all = `${title} ${desc} ${norm(item.keywords)} ${norm(item.type)}`;
    if (!words.every((w) => all.includes(w))) continue;
    let score = 0;
    for (const w of words) {
      if (title.startsWith(w)) score += 6;
      else if (new RegExp(`\\b${w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`).test(title)) score += 4;
      else if (title.includes(w)) score += 3;
      else if (desc.includes(w)) score += 1;
    }
    hits.push({ item, score });
  }
  return hits.sort((a, b) => b.score - a.score);
}

/** Wraps query words found in `text` in <mark>. */
function highlight(text: string, q: string): ReactNode {
  const words = q.split(/\s+/).filter((w) => w.length > 1);
  if (!words.length) return text;
  const re = new RegExp(`(${words.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "ig");
  return text.split(re).map((part, i) =>
    i % 2 === 1 ? (
      <mark key={i} className="rounded-[2px] bg-sky-300/45 px-0.5 text-inherit">
        {part}
      </mark>
    ) : (
      part
    ),
  );
}

/**
 * Site search over a pre-rendered index (static route; nothing is read from the URL on the server).
 * The query syncs to ?q= with history.replaceState. Keyboard: "/" focuses the box, ↓/↑ move through results,
 * Esc clears. Without JavaScript the full index is listed, grouped, as a browsable directory.
 */
export function SiteSearch({ items, suggestions }: { items: SearchItem[]; suggestions: { label: string; query: string }[] }) {
  // What the visitor typed; until they type, the query comes from the URL (no setState in an effect).
  const [typed, setQuery] = useState<string | null>(null);
  // The ?q= the page was opened with: read on the client only (the route stays static), "" on the server.
  const locationSearch = useLocationSearch();
  const opened = useMemo(() => new URLSearchParams(locationSearch).get("q") ?? "", [locationSearch]);
  const query = typed ?? opened;
  const [type, setType] = useState<SearchType | "All">("All");
  const deferred = useDeferredValue(query);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const statusId = useId();

  // Keep ?q= in step with the box once the visitor has typed, without adding history entries.
  const edited = typed !== null;
  useEffect(() => {
    if (!edited) return;
    const url = new URL(window.location.href);
    if (deferred.trim()) url.searchParams.set("q", deferred.trim());
    else url.searchParams.delete("q");
    window.history.replaceState(window.history.state, "", url.pathname + url.search + url.hash);
  }, [deferred, edited]);

  // "/" jumps to the search box from anywhere on the page.
  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (e.key === "/" && !/input|textarea|select/i.test(t.tagName) && !t.isContentEditable) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const q = deferred.trim();
  const hits = useMemo(() => search(items, q), [items, q]);
  const counts = useMemo(() => {
    const c = new Map<SearchType, number>();
    for (const h of hits) c.set(h.item.type, (c.get(h.item.type) ?? 0) + 1);
    return c;
  }, [hits]);
  const shown = type === "All" ? hits : hits.filter((h) => h.item.type === type);
  const groups = ORDER.map((t) => ({ type: t, hits: shown.filter((h) => h.item.type === t) })).filter((g) => g.hits.length);
  // With a query, the best matches lead; the groups follow the best hit in each.
  if (q) groups.sort((a, b) => b.hits[0].score - a.hits[0].score);

  const results = () => Array.from(listRef.current?.querySelectorAll<HTMLAnchorElement>("[data-result]") ?? []);
  const onInputKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      results()[0]?.focus();
    } else if (e.key === "Escape" && query) {
      e.preventDefault();
      setQuery("");
    }
  };
  const onListKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp" && e.key !== "Escape") return;
    const list = results();
    const i = list.indexOf(document.activeElement as HTMLAnchorElement);
    if (i < 0) return;
    e.preventDefault();
    if (e.key === "Escape") return inputRef.current?.focus();
    if (e.key === "ArrowDown") list[Math.min(i + 1, list.length - 1)]?.focus();
    else if (i === 0) inputRef.current?.focus();
    else list[i - 1]?.focus();
  };

  const status = q ? (hits.length ? `${hits.length} ${hits.length === 1 ? "result" : "results"} for “${q}”` : `No results for “${q}”`) : `${items.length} pages to explore`;

  return (
    <div>
      <form
        role="search"
        action="/search"
        method="get"
        onSubmit={(e) => {
          e.preventDefault();
          results()[0]?.focus();
        }}
        className="relative"
      >
        <label htmlFor="site-search" className="sr-only">
          Search the site
        </label>
        <Icon name="search" size={26} className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-brand-600 md:left-7" />
        <input
          ref={inputRef}
          id="site-search"
          name="q"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={onInputKey}
          placeholder="Search services, solutions, case studies…"
          autoComplete="off"
          spellCheck={false}
          aria-describedby={statusId}
          aria-controls="search-results"
          className="block h-16 w-full rounded-card border border-grey-300 bg-white pl-14 pr-28 font-display text-h4 font-semibold text-navy-950 shadow-(--shadow-card) transition-[border-color,box-shadow] duration-(--duration-base) ease-(--ease-out-expo) placeholder:font-body placeholder:text-base placeholder:font-normal placeholder:text-grey-500 hover:border-grey-500 focus:border-brand-600 focus:shadow-(--shadow-float) md:h-20 md:pl-17 [&::-webkit-search-cancel-button]:hidden"
        />
        <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-2">
          {query ? (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
              className="inline-flex min-h-11 items-center gap-1.5 rounded-btn px-3 text-sm font-semibold text-grey-600 transition-colors duration-(--duration-base) hover:text-navy-950"
            >
              <Icon name="close" size={16} />
              Clear
            </button>
          ) : (
            <kbd aria-hidden="true" className="hidden rounded-[4px] border border-grey-300 bg-grey-25 px-2 py-0.5 font-body text-sm text-grey-600 md:inline-block">
              /
            </kbd>
          )}
        </div>
      </form>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
        <p id={statusId} role="status" aria-live="polite" className="text-[0.9375rem] font-semibold text-navy-950">
          {status}
        </p>
        {hits.length > 0 && (
          <div role="group" aria-label="Filter by type" className="-mx-1 flex max-w-full flex-wrap gap-2 px-1">
            {(["All", ...ORDER] as const).map((t) => {
              const n = t === "All" ? hits.length : (counts.get(t) ?? 0);
              if (t !== "All" && !n) return null;
              const on = type === t;
              return (
                <button
                  key={t}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setType(t)}
                  className={cx(
                    "inline-flex min-h-10 items-center gap-2 rounded-full px-4 text-sm font-semibold ring-1 transition-colors duration-(--duration-base)",
                    on ? "bg-navy-950 text-white ring-navy-950" : "bg-white text-navy-950 ring-grey-200 hover:ring-grey-500",
                  )}
                >
                  {t === "All" ? "All" : PLURAL[t]}
                  <span className={cx("tabular-nums", on ? "text-sky-300" : "text-grey-500")}>{n}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {!q && suggestions.length > 0 && (
        <div className="mt-8 flex flex-wrap items-center gap-2.5">
          <span className="mr-1 text-small text-grey-600">Popular:</span>
          {suggestions.map((s) => (
            <button
              key={s.query}
              type="button"
              onClick={() => {
                setQuery(s.query);
                inputRef.current?.focus();
              }}
              className="inline-flex min-h-10 items-center rounded-full bg-brand-50 px-4 text-sm font-semibold text-brand-700 ring-1 ring-brand-100 transition-colors duration-(--duration-base) hover:bg-brand-100"
            >
              {s.label}
            </button>
          ))}
        </div>
      )}

      <div id="search-results" ref={listRef} onKeyDown={onListKey} className="mt-12 md:mt-16">
        {q && hits.length === 0 ? (
          <div className="grid-12 items-center gap-y-8 rounded-card bg-mist p-7 ring-1 ring-grey-200 sm:p-10 md:p-12">
            <div className="col-span-4 md:col-span-7">
              <span className="inline-flex size-14 items-center justify-center rounded-full bg-white text-brand-600 ring-1 ring-grey-200">
                <Icon name="search" size={26} />
              </span>
              <h2 className="mt-6 text-h3 text-navy-950">Nothing matches “{q}”</h2>
              <p className="mt-3 max-w-[48ch] text-grey-700">Check the spelling, try a broader word such as a platform or an industry, or ask our team directly.</p>
              <div className="mt-7 flex flex-wrap gap-2.5">
                {suggestions.map((s) => (
                  <button
                    key={s.query}
                    type="button"
                    onClick={() => setQuery(s.query)}
                    className="inline-flex min-h-10 items-center rounded-full bg-white px-4 text-sm font-semibold text-navy-950 ring-1 ring-grey-200 transition-colors duration-(--duration-base) hover:ring-grey-500"
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="col-span-4 md:col-span-4 md:col-start-9">
              <div className="rounded-card bg-white p-6 ring-1 ring-grey-200">
                <p className="font-display text-h4 font-bold text-navy-950">Can’t find it?</p>
                <p className="mt-2 text-small text-grey-700">Tell us what you are looking for and the right expert will reply.</p>
                <ArrowLink href="/contact" className="mt-4">
                  Talk to an expert
                </ArrowLink>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid gap-14 md:gap-16">
            {groups.map((g) => (
              <section key={g.type} aria-labelledby={`grp-${g.type.replace(/\s/g, "-")}`} className="grid-12 gap-y-6">
                <div className="col-span-4 md:col-span-3">
                  <h2 id={`grp-${g.type.replace(/\s/g, "-")}`} className="flex items-baseline gap-3 text-h4 font-bold text-navy-950 md:sticky md:top-[calc(var(--header-h)+1.5rem)]">
                    {PLURAL[g.type]}
                    <span className="text-sm font-semibold tabular-nums text-grey-500">{g.hits.length}</span>
                  </h2>
                </div>
                <ul className="col-span-4 divide-y divide-grey-200 border-y border-grey-200 md:col-span-9">
                  {g.hits.map(({ item }) => (
                    <li key={`${item.type}:${item.href}`}>
                      <Link
                        href={item.href}
                        data-result
                        target={item.external ? "_blank" : undefined}
                        rel={item.external ? "noopener" : undefined}
                        className="group -mx-3 flex items-start justify-between gap-6 rounded-btn px-3 py-5 transition-colors duration-(--duration-base) hover:bg-grey-25 focus-visible:bg-grey-25"
                      >
                        <span className="min-w-0">
                          <span className="block font-semibold text-navy-950 transition-colors duration-(--duration-base) group-hover:text-brand-600">{highlight(item.title, q)}</span>
                          {item.descriptor && <span className="mt-1 block text-small text-grey-600 line-clamp-2">{highlight(item.descriptor, q)}</span>}
                          <span className="mt-1.5 block truncate text-xs text-grey-500">{item.href}</span>
                        </span>
                        <Icon
                          name={item.external ? "arrowUpRight" : "arrowRight"}
                          size={18}
                          className="mt-1 shrink-0 text-brand-600 transition-transform duration-(--duration-base) group-hover:translate-x-1"
                        />
                        {item.external && <span className="sr-only"> (opens in a new tab)</span>}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
