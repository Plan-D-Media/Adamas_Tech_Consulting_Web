import type { FaqData } from "@/lib/data/mappers";
import { copy } from "@/lib/placeholder";
import { ServiceSectionHead } from "@/components/services/ServiceSectionHead";

interface Props {
  eyebrow?: string | null;
  heading: string;
  items: FaqData[];
}

function Row({ f, index, open }: { f: FaqData; index: number; open?: boolean }) {
  const q = copy(f.question);
  const a = copy(f.answer);
  return (
    <details open={open} className="group rounded-lg bg-white/64 shadow-[0_7px_22px_rgb(58_74_110/0.04)] ring-1 ring-white/95">
      <summary className="grid min-h-[74px] cursor-pointer list-none grid-cols-[38px_minmax(0,1fr)_24px] items-center px-[18px] py-4 [&::-webkit-details-marker]:hidden">
        <span className="font-heading text-[0.5625rem] leading-[1.5] text-grey-550" aria-hidden="true">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="font-heading text-[0.8125rem] font-bold leading-[1.45] text-navy-850">
          {q.text}
          {f.draft && <span className="ml-2 rounded-xs bg-orange-500 px-1.5 py-0.5 font-body text-[0.625rem] font-bold uppercase tracking-wider text-navy-950">Draft</span>}
        </span>
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full text-blue-600 ring-1 ring-blue-600/30 group-open:bg-blue-600 group-open:text-white group-open:ring-blue-600" aria-hidden="true">
          <svg viewBox="0 0 12 12" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
            <path d="M2.5 6h7" />
            <path d="M6 2.5v7" className="group-open:hidden" />
          </svg>
        </span>
      </summary>
      <div className="px-[56px] pb-5 font-heading text-[0.75rem] leading-[1.75] text-grey-550">{a.pending ? <span className="italic text-grey-500">Answer to be confirmed.</span> : a.text}</div>
    </details>
  );
}

/**
 * FAQ (Figma Section 299:28733): the head over two columns of frosted accordion rows (number, 13px question, a 24px
 * plus/minus circle; the first row open). Native <details>, so it works without JavaScript; answers that are still
 * placeholders say so.
 */
export function ServiceFaq({ eyebrow, heading, items }: Props) {
  const half = Math.ceil(items.length / 2);
  const cols = [items.slice(0, half), items.slice(half)];
  return (
    <section data-compare="faq" aria-labelledby="service-faq-heading" className="bg-[linear-gradient(180deg,#EEEDF7_0%,#E6EFFB_100%)] py-14 lg:pb-[108px] lg:pt-[131px]">
      <div className="container-site">
        <ServiceSectionHead id="service-faq-heading" eyebrow={eyebrow} heading={heading} headingClassName="max-w-[1220px]" />
        <div className="mt-10 grid gap-x-[34px] gap-y-3 lg:mt-[38px] lg:grid-cols-2" data-reveal>
          {cols.map((col, c) => (
            <div key={c} className="grid content-start gap-3">
              {col.map((f, i) => (
                <Row key={f.question} f={f} index={c * half + i} open={c === 0 && i === 0} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
