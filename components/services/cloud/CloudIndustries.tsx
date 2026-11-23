"use client";

import { useState } from "react";
import { cx } from "@/lib/cx";
import { Img } from "@/components/media/Img";
import { Icon } from "@/components/ui/Icon";

interface Tab {
  key: string;
  label: string;
  title?: string;
  body?: string;
  image?: string;
  facts?: readonly { title: string; body: string }[];
}

/**
 * "Empowering growth in diverse industries" (Figma 8705:3814, band y 5089-5822): a pill tab row over a two-column
 * panel - photograph on the left, a window-chrome card on the right with the industry's copy and two fact chips.
 *
 * The frame fills in Education only; the other six tabs have no copy in the design, so they say so rather than
 * repeating Education's (reported to the client).
 */
export function CloudIndustries({ eyebrow, heading, tabs }: { eyebrow: string; heading: string; tabs: readonly Tab[] }) {
  const [active, setActive] = useState(0);
  const tab = tabs[active] ?? tabs[0];

  return (
    <section data-compare="cs-industries" aria-labelledby="cs-industries-heading" className="bg-white py-10 lg:py-[64px]">
      <div className="container-cloud">
        <div className="rounded-2xl bg-[#F6F8FC] p-6 lg:p-[40px]">
          <p className="text-[0.75rem] font-bold uppercase tracking-[0.14em] text-blue-600">{eyebrow}</p>
          <h2 id="cs-industries-heading" className="u-display mt-2 text-[clamp(1.625rem,1.1rem+1.8vw,2.25rem)] font-bold leading-[1.2] text-[#0B1B33]">
            {heading}
          </h2>

          <ul className="mt-6 flex flex-wrap gap-2 lg:mt-[28px]" role="list">
            {tabs.map((t, i) => {
              const on = i === active;
              return (
                <li key={t.key}>
                  <button
                    type="button"
                    onClick={() => setActive(i)}
                    aria-current={on || undefined}
                    className={cx(
                      "inline-flex min-h-10 items-center gap-2 rounded-full border px-4 text-[0.875rem] font-semibold transition-colors duration-(--duration-fast)",
                      on ? "border-blue-600 bg-blue-600 text-white" : "border-[#E3E9F2] bg-white text-[#0B1B33] hover:border-blue-600/40",
                    )}
                  >
                    <Icon name="layers" size={15} className={on ? "text-white/80" : "text-blue-600"} />
                    {t.label}
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="mt-6 grid gap-5 lg:mt-[24px] lg:grid-cols-[minmax(0,294px)_minmax(0,1fr)]">
            <div className="rounded-xl bg-white p-3">
              {tab.image ? (
                <span className="relative block h-[200px] w-full overflow-hidden rounded-lg lg:h-[280px]">
                  <Img src={tab.image} alt="" aria-hidden="true" fill sizes="294px" className="object-cover" />
                </span>
              ) : (
                <div className="flex h-[200px] w-full items-center justify-center rounded-lg bg-[#F2F7FF] text-center text-[0.8125rem] text-[#8A94A8] lg:h-[280px]">
                  Photograph to come
                </div>
              )}
            </div>

            <div className="rounded-xl bg-white p-5 lg:p-6">
              {/* The frame draws this card as a browser window. */}
              <div className="flex items-center gap-1.5" aria-hidden="true">
                <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
              </div>
              <h3 className="u-display mt-4 flex items-center gap-2 rounded-lg bg-[#F2F7FF] px-4 py-3 text-[1.0625rem] font-bold text-[#0B1B33]">
                <Icon name="layers" size={18} className="text-blue-600" />
                {tab.title ?? `${tab.label} solutions`}
              </h3>
              {tab.body ? (
                <p className="mt-4 text-[0.9375rem] leading-[1.65] text-[#55617A]">{tab.body}</p>
              ) : (
                <p className="mt-4 text-[0.9375rem] leading-[1.65] text-[#8A94A8]">
                  The {tab.label.toLowerCase()} copy for this panel is still with the client.
                </p>
              )}
              {tab.facts && tab.facts.length > 0 && (
                <ul className="mt-5 flex flex-wrap gap-3" role="list">
                  {tab.facts.map((f) => (
                    <li key={f.title} className="rounded-lg bg-[#F6F8FC] px-4 py-2">
                      <p className="u-display text-[0.875rem] font-bold text-[#0B1B33]">{f.title}</p>
                      <p className="text-[0.75rem] text-[#55617A]">{f.body}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
