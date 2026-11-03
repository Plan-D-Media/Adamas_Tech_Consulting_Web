import type { PromoBanner as Promo } from "@/lib/data/home";
import { ButtonLink } from "@/components/ui/Button";

/** Region-only promo band directly under the hero (e.g. GCC e-invoicing). */
export function PromoBanner({ promo }: { promo: Promo | null }) {
  if (!promo) return null;
  return (
    <section aria-label={promo.heading} className="border-b border-brand-100 bg-brand-50">
      <div className="container-site flex flex-col gap-5 py-7 md:flex-row md:items-center md:justify-between md:gap-10">
        <div>
          {promo.eyebrow && <p className="eyebrow text-brand-700">{promo.eyebrow}</p>}
          <p className="mt-1 font-display text-h4 font-bold text-navy-950 [font-stretch:110%]">{promo.heading}</p>
          {promo.body && <p className="mt-1 text-grey-700">{promo.body}</p>}
        </div>
        <ButtonLink href={promo.ctaHref} external={promo.external} variant="secondary" arrow className="shrink-0 self-start md:self-auto">
          {promo.ctaLabel}
        </ButtonLink>
      </div>
    </section>
  );
}
