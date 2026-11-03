import type { LegalBlocks, LegalSectionData } from "@/lib/data/pages";
import { cx } from "@/lib/cx";
import { copy } from "@/lib/placeholder";
import { Prose } from "@/components/ui/Prose";
import { PendingBlock } from "@/components/ui/PendingBlock";
import { ArrowLink } from "@/components/ui/Button";
import { LegalToc } from "./LegalToc";

/**
 * Long-form legal document: sticky contents on desktop, a 68ch reading column, "In Short" summaries set as
 * callouts, tables that stack on phones, and each section's original links listed beneath it
 * (Prose has no inline links yet). Headings are not split-animated ([data-no-split]); reading comes first.
 */
export function LegalDocument({ blocks }: { blocks: LegalBlocks }) {
  const sections = blocks.sections;
  const pending = blocks.pending ? copy(blocks.pending) : null;
  return (
    <section aria-label="Document" className="tone-white section-y" data-no-split>
      <div className="container-site grid-12 gap-y-10">
        {sections.length > 0 && (
          <div className="col-span-4 md:col-span-8 lg:col-span-3">
            <LegalToc items={sections.map((s) => ({ id: s.id, title: s.title }))} />
          </div>
        )}
        <div className={cx("col-span-4 md:col-span-8", sections.length ? "lg:col-span-8 lg:col-start-5" : "lg:col-span-8 lg:col-start-3")}>
          {blocks.documentTitle && <p className="eyebrow text-brand-600">{blocks.documentTitle}</p>}
          {blocks.intro && <TextParts text={blocks.intro} className={blocks.documentTitle ? "mt-6" : undefined} />}
          {pending?.pending && <PendingBlock label="Policy text to be supplied" lines={8} className="max-w-[68ch]" />}
          {sections.map((s, i) => (
            <LegalSectionView key={s.id} s={s} first={i === 0 && !blocks.intro && !blocks.documentTitle} />
          ))}
        </div>
      </div>
    </section>
  );
}

function LegalSectionView({ s, first }: { s: LegalSectionData; first: boolean }) {
  return (
    <section id={s.id} aria-labelledby={`${s.id}-h`} className={cx("scroll-mt-[calc(var(--header-h)+1.5rem)]", first ? "" : "mt-14 border-t border-grey-100 pt-12 md:mt-16 md:pt-14")}>
      <h2 id={`${s.id}-h`} className="max-w-[68ch] text-h3 text-navy-950">
        {s.title}
      </h2>
      <div className="mt-6 grid gap-6">
        {s.parts.map((p, i) => (p.table ? <LegalTable key={i} table={p.table} /> : p.text ? <TextParts key={i} text={p.text} /> : null))}
      </div>
      {s.links.length > 0 && (
        <div className="mt-8 max-w-[68ch] rounded-card bg-grey-25 p-5 ring-1 ring-grey-100">
          <p className="eyebrow text-grey-600">Links in this section</p>
          <ul className="mt-3 grid gap-2">
            {s.links.map((l) => (
              <li key={l.href}>
                <ArrowLink href={l.href} className="text-[0.9375rem] [overflow-wrap:anywhere]">
                  {l.label.charAt(0).toUpperCase() + l.label.slice(1)}
                </ArrowLink>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

/** Prose, with "In Short:" paragraphs lifted out as summary callouts. */
function TextParts({ text, className }: { text: string; className?: string }) {
  const blocks = text.split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean);
  const out: { short?: string; prose?: string[] }[] = [];
  for (const b of blocks) {
    if (/^In Short:/i.test(b)) out.push({ short: b.replace(/^In Short:\s*/i, "") });
    else if (out.at(-1)?.prose) out.at(-1)!.prose!.push(b);
    else out.push({ prose: [b] });
  }
  return (
    <div className={cx("grid gap-6", className)}>
      {out.map((o, i) =>
        o.short ? (
          <p key={i} className="max-w-[68ch] rounded-card border-l-[3px] border-brand-600 bg-mist px-5 py-4 text-navy-950">
            <span className="eyebrow mr-2 text-brand-600">In Short</span>
            {o.short}
          </p>
        ) : (
          <Prose key={i} text={o.prose!.join("\n\n")} />
        ),
      )}
    </div>
  );
}

function LegalTable({ table }: { table: { columns: string[]; rows: string[][] } }) {
  return (
    <div className="max-w-[68ch] overflow-hidden rounded-card ring-1 ring-grey-200">
      <table className="w-full border-collapse text-left text-small">
        <thead className="hidden bg-mist md:table-header-group">
          <tr>
            {table.columns.map((c) => (
              <th key={c} scope="col" className="px-4 py-3 font-semibold text-navy-950">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((r, i) => (
            <tr key={i} className="block border-t border-grey-100 px-4 py-4 first:border-t-0 md:table-row md:p-0 md:first:border-t">
              {r.map((cell, j) => (
                <td
                  key={j}
                  className={cx(
                    "block align-top md:table-cell md:px-4 md:py-3",
                    j === 0 ? "font-semibold text-navy-950" : "mt-1 text-grey-700",
                    j === r.length - 1 && "md:whitespace-nowrap",
                  )}
                >
                  {j > 0 && <span className="mr-1.5 font-semibold text-grey-600 md:hidden">{table.columns[j]}:</span>}
                  {cell || "—"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
