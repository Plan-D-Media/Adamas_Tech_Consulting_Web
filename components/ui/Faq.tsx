import type { FaqData } from "@/lib/data/mappers";
import { Icon } from "./Icon";

/** FAQ accordion on native <details> (keyboard and screen-reader friendly with no JS), plus FAQPage data. */
export function Faq({ items }: { items: FaqData[] }) {
  if (!items.length) return null;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })),
  };
  return (
    <div className="divide-y divide-grey-200 border-y border-grey-200">
      {items.map((f) => (
        <details key={f.question} className="group py-1 [&_summary::-webkit-details-marker]:hidden">
          <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 py-4 font-display text-h4 font-bold text-navy-950 transition-colors duration-(--duration-base) hover:text-brand-600">
            {f.question}
            <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-grey-300 transition-transform duration-(--duration-base) group-open:rotate-45">
              <Icon name="plus" size={18} />
            </span>
          </summary>
          <p className="max-w-[68ch] pb-6 text-grey-700">{f.answer}</p>
        </details>
      ))}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    </div>
  );
}
