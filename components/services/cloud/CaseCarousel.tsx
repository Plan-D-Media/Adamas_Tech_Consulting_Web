"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { Img } from "@/components/media/Img";
import { Icon } from "@/components/ui/Icon";
import type { CloudCase } from "@/lib/cloud-services-content";

/**
 * The case-study band on /services/cloud-services: three cards on a scroll-snap rail with the design's dot row
 * underneath.
 *
 * Built on native scroll snapping rather than a JS slider, so the rail still scrolls, and every card is still
 * reachable, without JavaScript - the dots are the only part that needs it, and they are rendered only after
 * hydration. The active dot is tracked with an IntersectionObserver against the rail, not a scroll handler.
 *
 * The design draws **five** dots under **three** cards. One dot per card is built, which is the only count that
 * can be honest about where the rail is; the two spare dots are raised in the report.
 */
export function CaseCarousel({ items }: { items: readonly CloudCase[] }) {
  const railRef = useRef<HTMLUListElement>(null);
  const [current, setCurrent] = useState(0);
  // False during the server render and the first client render, true afterwards: the dots need JavaScript to do
  // anything, so they are not in the no-JS HTML. useSyncExternalStore rather than setState-in-an-effect.
  const ready = useSyncExternalStore(subscribeNever, () => true, () => false);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    const cards = Array.from(rail.children) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        const first = entries
          .filter((e) => e.isIntersecting)
          .map((e) => cards.indexOf(e.target as HTMLElement))
          .sort((a, b) => a - b)[0];
        if (first !== undefined && first >= 0) setCurrent(first);
      },
      { root: rail, threshold: 0.6 },
    );
    for (const c of cards) io.observe(c);
    return () => io.disconnect();
  }, []);

  const go = useCallback((i: number) => {
    const card = railRef.current?.children[i] as HTMLElement | undefined;
    card?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
  }, []);

  return (
    <>
      <ul
        ref={railRef}
        className="scrollbar-none mt-8 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-1 lg:mt-[44px]"
        role="list"
      >
        {items.map((item) => (
          <li
            key={item.title}
            className="flex w-[min(85%,388px)] shrink-0 snap-start flex-col rounded-2xl bg-white p-4 lg:w-[calc((100%-3rem)/3)]"
            data-reveal
          >
            <span className="relative block h-[160px] w-full overflow-hidden rounded-lg">
              <Img src={item.image} alt="" aria-hidden="true" fill sizes="(min-width:1024px) 360px, 85vw" className="object-cover" />
            </span>
            <p className="mt-5 text-[0.75rem] font-medium uppercase tracking-[0.1em] text-blue-600">{item.label}</p>
            <h3 className="u-display mt-2 text-[1.25rem] font-bold leading-[1.3] text-[#0B1B33]">{item.title}</h3>
            <p className="mt-3 text-[0.75rem] leading-[1.6] text-[#55617A]">{item.body}</p>
            <ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-2" role="list">
              {item.tags.map((t) => (
                <li key={t} className="flex items-center gap-1.5 text-[0.625rem] text-[#55617A]">
                  <Icon name="check" size={12} className="shrink-0 text-blue-600" />
                  {t}
                </li>
              ))}
            </ul>
            <Link
              href={item.href}
              className="mt-5 ml-auto flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-500"
              aria-label={`Read the case study: ${item.title}`}
            >
              <Icon name="arrow" size={16} className="-rotate-45" />
            </Link>
          </li>
        ))}
      </ul>

      {ready && items.length > 1 && (
        <div className="mt-7 flex items-center justify-center gap-2" role="group" aria-label="Case studies">
          {items.map((item, i) => (
            <button
              key={item.title}
              type="button"
              {...(i === current ? { "aria-current": true as const } : {})}
              aria-label={`Show case study ${i + 1} of ${items.length}: ${item.title}`}
              onClick={() => go(i)}
              className={`h-[6px] rounded-full transition-all duration-200 ${i === current ? "w-[22px] bg-white" : "w-[14px] bg-white/35 hover:bg-white/60"}`}
            />
          ))}
        </div>
      )}
    </>
  );
}

/** No external store to watch: the snapshot never changes after hydration. */
function subscribeNever() {
  return () => {};
}
