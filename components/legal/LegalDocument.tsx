import Link from "next/link";
import type { LegalBlocks } from "@/lib/data/pages";
import type { Crumb } from "@/lib/seo";
import { RevealScope } from "@/components/motion/RevealScope";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Eyebrow } from "@/components/ui/SectionHeader";
import { Prose } from "@/components/legal/Prose";

/**
 * Legal document template (/privacy-policy, /terms-of-use, /cookie-policy). The text lives in the Page row's
 * `blocks` (legal template, validated in lib/data/pages.ts) and is rendered in a measured ~70ch reading column:
 * head (breadcrumb, eyebrow, h1, "Last updated", intro), a table of contents, then each section as an h2 with its
 * own id, its parts as prose or a table, and the links that were inline in the live text listed underneath.
 *
 * Server component: nothing here needs the browser. Anchor targets carry scroll-margin-top so the sticky header
 * never covers a heading the visitor jumped to (html also sets scroll-padding-top in app/globals.css).
 */

const ANCHOR_OFFSET = "scroll-mt-[calc(var(--header-h)+1.5rem)]";

interface Props {
  title: string;
  eyebrow?: string | null;
  /** Breadcrumb trail after Home; the route also feeds it to breadcrumbJsonLd(). */
  crumbs: Crumb[];
  blocks: LegalBlocks;
}

function SectionLinks({ links, heading }: { links: { label: string; href: string }[]; heading: string }) {
  return (
    <div className="mt-6 rounded-lg border border-grey-200 bg-tint-50 px-4 py-3">
      <p className="label-caps text-grey-500">{heading}</p>
      <ul className="mt-2 space-y-1 font-body text-small">
        {/* Keyed by position: a section may list the same href twice (the live documents repeat their request form). */}
        {links.map((l, i) => {
          const external = /^https?:\/\//.test(l.href) || l.href.startsWith("mailto:") || l.href.startsWith("tel:");
          return (
            <li key={`${i}-${l.href}`}>
              {external ? (
                <a href={l.href} className="break-words text-blue-600 underline underline-offset-2 hover:text-blue-700" rel="noopener noreferrer" target="_blank">
                  {l.label}
                </a>
              ) : (
                <Link href={l.href} className="break-words text-blue-600 underline underline-offset-2 hover:text-blue-700">
                  {l.label}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function ProseTable({ table, label }: { table: NonNullable<LegalBlocks["sections"][number]["parts"][number]["table"]>; label: string }) {
  return (
    // Scrollable on narrow screens, and focusable so the keyboard can scroll it too.
    <div className="mt-6 overflow-x-auto rounded-lg border border-grey-200" role="region" aria-label={label} tabIndex={0}>
      <table className="w-full min-w-[34rem] border-collapse font-body text-small text-grey-600">
        <thead>
          <tr className="bg-tint-50">
            {table.columns.map((c) => (
              <th key={c} scope="col" className="border-b border-grey-200 px-4 py-3 text-left align-bottom font-semibold text-navy-800">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, i) => (
            <tr key={i} className="border-b border-grey-200 last:border-b-0">
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-3 align-top leading-[1.6]">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function LegalDocument({ title, eyebrow, crumbs, blocks }: Props) {
  const { updated, documentTitle, intro, sections } = blocks;
  // The live Terms are titled "Terms of Service" while the page is "Terms of use": both are shown, on the meta line.
  const meta = [documentTitle && documentTitle !== title ? documentTitle : null, updated ? `Last updated ${updated}` : null].filter(Boolean).join(" · ");

  return (
    <RevealScope>
      <section aria-labelledby="legal-heading" className="bg-tint-50 pb-12 pt-8 lg:pb-16 lg:pt-[40px]">
        <div className="container-site">
          <Breadcrumb crumbs={crumbs} />
          {/* Above the fold: visible from the first paint, CSS does the rise (data-reveal="now"). */}
          <div className="mt-8 max-w-[43.125rem] lg:mt-12" data-reveal="now">
            {eyebrow && <Eyebrow className="lg:leading-[15px]">{eyebrow}</Eyebrow>}
            <h1 id="legal-heading" className="mt-3 font-heading text-[clamp(1.875rem,1.2rem+1.9vw,2.6875rem)] font-bold leading-[1.14] tracking-[-0.035em] text-navy-800">
              {title}
            </h1>
            {meta && <p className="mt-4 font-body text-caption text-grey-500">{meta}</p>}
          </div>
          {intro && <Prose text={intro} level={2} className="mt-6 max-w-[70ch]" />}
        </div>
      </section>

      <div className="container-site pb-20 pt-10 lg:pb-28 lg:pt-14">
        <div className="max-w-[70ch]">
          {sections.length > 0 && (
            <nav aria-label="On this page" className="rounded-2xl border border-grey-200 px-5 py-5 lg:px-6" data-reveal>
              <p className="label-caps text-grey-500">On this page</p>
              <ol className="mt-3 space-y-2 font-body text-small" role="list">
                {sections.map((s) => (
                  <li key={s.id}>
                    <a href={`#${s.id}`} className="inline-flex min-h-6 items-center text-blue-600 underline underline-offset-2 hover:text-blue-700">
                      {s.title}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          )}

          {sections.map((s) => (
            <section key={s.id} aria-labelledby={s.id} className="mt-12 lg:mt-14" data-reveal>
              <h2
                id={s.id}
                className={`${ANCHOR_OFFSET} font-heading text-[clamp(1.375rem,1.2rem+0.5vw,1.75rem)] font-bold leading-[1.2] tracking-[-0.02em] text-navy-800`}
              >
                {s.title}
              </h2>
              {s.parts.map((part, i) => (
                <div key={i}>
                  {part.text && <Prose text={part.text} className="mt-5" />}
                  {part.table && <ProseTable table={part.table} label={`${s.title}: table`} />}
                </div>
              ))}
              {s.links.length > 0 && <SectionLinks links={s.links} heading="Links in this section" />}
            </section>
          ))}
        </div>
      </div>
    </RevealScope>
  );
}
