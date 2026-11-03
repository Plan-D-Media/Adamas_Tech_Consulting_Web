"use client";

import { useEffect, useState } from "react";
import { cx } from "@/lib/cx";
import { Icon } from "@/components/ui/Icon";

/**
 * In-page contents for long documents. Desktop: a sticky list that marks the section being read.
 * Phones and tablets: a collapsible "On this page" panel. Works as plain anchor links without JavaScript.
 */
export function LegalToc({ items }: { items: { id: string; title: string }[] }) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const els = items.map((i) => document.getElementById(i.id)).filter((e): e is HTMLElement => !!e);
    if (!els.length) return;
    const visible = new Map<string, boolean>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) visible.set(e.target.id, e.isIntersecting);
        const first = items.find((i) => visible.get(i.id));
        if (first) setActive(first.id);
      },
      // A band across the upper third of the viewport: the section crossing it is "current".
      { rootMargin: "-20% 0px -65% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [items]);

  if (!items.length) return null;

  const list = (onPick?: () => void) => (
    <ol className="grid gap-0.5">
      {items.map((i) => {
        const current = active === i.id;
        return (
          <li key={i.id}>
            <a
              href={`#${i.id}`}
              onClick={onPick}
              aria-current={current ? "location" : undefined}
              className={cx(
                "relative block rounded-btn py-2 pl-4 pr-2 text-[0.9375rem] leading-snug transition-colors duration-(--duration-base)",
                "before:absolute before:inset-y-1.5 before:left-0 before:w-0.5 before:rounded-full before:transition-colors before:duration-(--duration-base)",
                current ? "font-semibold text-navy-950 before:bg-brand-600" : "text-grey-600 before:bg-grey-200 hover:text-navy-950",
              )}
            >
              {i.title}
            </a>
          </li>
        );
      })}
    </ol>
  );

  return (
    <>
      <nav aria-label="On this page" className="hidden lg:sticky lg:top-[calc(var(--header-h)+2rem)] lg:block lg:max-h-[calc(100svh-var(--header-h)-4rem)] lg:overflow-y-auto lg:pr-2 scrollbar-none">
        <p className="eyebrow mb-4 text-brand-600">On this page</p>
        {list()}
      </nav>
      <details className="group rounded-card bg-mist ring-1 ring-grey-200 lg:hidden [&_summary::-webkit-details-marker]:hidden">
        <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-5 font-semibold text-navy-950">
          On this page
          <Icon name="chevronDown" size={20} className="transition-transform duration-(--duration-base) group-open:rotate-180" />
        </summary>
        <nav aria-label="On this page" className="border-t border-grey-200 px-3 py-3">
          {list(() => {
            const d = document.activeElement?.closest("details");
            if (d) d.open = false;
          })}
        </nav>
      </details>
    </>
  );
}
