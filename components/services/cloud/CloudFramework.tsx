"use client";

import { useState } from "react";
import { cx } from "@/lib/cx";
import { Icon } from "@/components/ui/Icon";
import type { CloudPhase } from "@/lib/cloud-services-content";

/**
 * "One framework, from first assessment to day-two operations." (Figma 8705:3814, band y 3069-3939).
 *
 * A phase list on the left and the selected phase's detail card on the right. The frame is drawn in state 01, so
 * only "Plan" carries a service card; the other four show their summary and say that the detail is still to come
 * (reported to the client).
 *
 * Without JavaScript the list is still readable - every phase is a real button inside a form-free list and the
 * first phase's detail is server-rendered - so the band degrades to "phase 01, plus the list of the other four".
 */
export function CloudFramework({ eyebrow, heading, body, phases }: { eyebrow: string; heading: string; body: string; phases: readonly CloudPhase[] }) {
  const [active, setActive] = useState(0);
  const phase = phases[active] ?? phases[0];
  const next = phases[(active + 1) % phases.length];

  return (
    <section data-compare="cs-framework" aria-labelledby="cs-framework-heading" className="bg-[#F6F8FC] py-14 lg:py-[80px]">
      <div className="container-cloud">
        <p className="u-display text-[0.75rem] font-bold uppercase tracking-[0.12em] text-blue-600">{eyebrow}</p>
        <h2 id="cs-framework-heading" className="mt-2 max-w-[900px] text-[clamp(1.5rem,1.1rem+1.2vw,1.75rem)] font-semibold leading-[1.3] text-[#0B1B33]">
          {heading}
        </h2>
        <p className="mt-3 text-[1.0625rem] leading-[1.5] text-[#55617A] lg:text-[1.25rem]">{body}</p>

        <div className="mt-8 grid gap-6 lg:mt-[56px] lg:grid-cols-[minmax(0,218px)_minmax(0,1fr)] lg:gap-[32px]">
          <ul className="grid content-start gap-2" role="list">
            {phases.map((p, i) => {
              const on = i === active;
              return (
                <li key={p.number}>
                  <button
                    type="button"
                    onClick={() => setActive(i)}
                    aria-current={on || undefined}
                    className={cx(
                      "flex w-full items-center gap-3 rounded-lg border px-3 py-3 text-left transition-colors duration-(--duration-fast)",
                      on ? "border-blue-600 bg-blue-600 text-white" : "border-[#E3E9F2] bg-white text-[#0B1B33] hover:border-blue-600/40",
                    )}
                  >
                    <span className={cx("u-display text-[0.8125rem] font-semibold", on ? "text-white/80" : "text-[#8A94A8]")}>{p.number}</span>
                    <span className="min-w-0">
                      <span className="u-display block text-[1.0625rem] font-semibold leading-tight">{p.name}</span>
                      <span className={cx("block text-[0.8125rem] leading-tight", on ? "text-white/80" : "text-[#55617A]")}>{p.summary}</span>
                    </span>
                    {on && <Icon name="arrow" size={16} className="ml-auto shrink-0" />}
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="relative overflow-hidden rounded-xl border border-[#E3E9F2] bg-white p-6 lg:p-[32px]">
            <span aria-hidden="true" className="u-display pointer-events-none absolute right-6 top-4 text-[clamp(3rem,6vw,5.5rem)] font-bold leading-none text-[#0B1B33]/[0.07]">
              {phase.number}
            </span>
            <p className="text-[0.75rem] font-bold uppercase tracking-[0.12em] text-blue-600">Phase {phase.number}</p>
            <h3 className="u-display mt-1 text-[clamp(1.75rem,1.2rem+1.8vw,3.25rem)] font-bold leading-none text-[#0B1B33]">{phase.name}</h3>
            <p className="mt-2 text-[1.0625rem] leading-[1.45] text-[#55617A]">{phase.summary}</p>

            {phase.service ? (
              <div className="mt-6 rounded-lg bg-[#F2F7FF] p-5 lg:p-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white" aria-hidden="true">
                  <Icon name="shield" size={20} />
                </span>
                <h4 className="u-display mt-4 text-[1.125rem] font-semibold text-[#0B1B33]">{phase.service.title}</h4>
                <p className="mt-2 text-[1rem] leading-[1.6] text-[#55617A]">{phase.service.body}</p>
              </div>
            ) : (
              <p className="mt-6 rounded-lg bg-[#F2F7FF] p-5 text-[0.9375rem] leading-[1.6] text-[#55617A]">
                The services for this phase are being written up with the client.
              </p>
            )}

            <div className="mt-7 flex items-center justify-between border-t border-[#E3E9F2] pt-5">
              <p className="u-display text-[0.875rem] font-semibold text-blue-600">
                {phase.number} / {String(phases.length).padStart(2, "0")}
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActive((i) => (i - 1 + phases.length) % phases.length)}
                  aria-label="Previous phase"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E3E9F2] text-[#55617A] hover:border-blue-600 hover:text-blue-600"
                >
                  <Icon name="chevron-right" size={16} className="rotate-180" />
                </button>
                <button
                  type="button"
                  onClick={() => setActive((i) => (i + 1) % phases.length)}
                  className="inline-flex min-h-10 items-center gap-2 rounded-full bg-blue-600 px-5 text-[0.875rem] font-semibold text-white hover:bg-blue-500"
                >
                  Next: {next.name}
                  <Icon name="arrow" size={15} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
