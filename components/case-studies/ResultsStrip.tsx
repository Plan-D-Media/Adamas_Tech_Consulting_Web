import { cx } from "@/lib/cx";
import { copy } from "@/lib/placeholder";
import { MetricCount } from "@/components/motion/MetricCount";

/** Counting only reads well for a single number with a unit ("99%", "5x", "1000+"); "24/7" or "24×7" stay static. */
const COUNTABLE = /^\D*\d+(?:[.,]\d+)?\D*$/;

/**
 * Result figures on a navy band: the value large (counted up once in view), the label beneath.
 * Labels written as "Headline: detail" set the headline in white and the detail muted.
 */
export function ResultsStrip({ results, className }: { results: { value: string; label: string }[]; className?: string }) {
  const cols = results.length >= 4 ? "lg:grid-cols-4" : results.length === 3 ? "lg:grid-cols-3" : "md:grid-cols-2";
  return (
    <ul className={cx("grid gap-x-8 gap-y-10 sm:grid-cols-2", cols, className)}>
      {results.map((r, i) => {
        const label = copy(r.label).text;
        const cut = label.indexOf(": ");
        const head = cut > 0 ? label.slice(0, cut) : label;
        const rest = cut > 0 ? label.slice(cut + 2) : null;
        return (
          <li key={`${r.value}-${i}`} className="border-t border-navy-700 pt-6" data-reveal>
            {COUNTABLE.test(r.value) ? (
              <MetricCount value={r.value} className="block font-display-wide text-metric font-bold tabular-nums text-sky-400" />
            ) : (
              <span className="block font-display-wide text-metric font-bold tabular-nums text-sky-400">{r.value}</span>
            )}
            <p className="mt-4 font-semibold text-white first-letter:uppercase">{head}</p>
            {rest && <p className="mt-2 text-small text-on-navy-muted first-letter:uppercase">{rest}</p>}
          </li>
        );
      })}
    </ul>
  );
}
