import type { Block, RegionInfo } from "@/lib/data/site";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

/** Closing CTA band used on every page: "Talk to an expert" + the region's phone and email. */
export function CtaBand({ block, region }: { block: Block; region: RegionInfo | null }) {
  return (
    <section aria-labelledby="cta-heading" className="relative isolate overflow-hidden bg-brand-600 text-white">
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(60%_120%_at_100%_0%,rgb(79_182_226/0.45),transparent_60%),radial-gradient(50%_100%_at_0%_100%,rgb(38_63_118/0.7),transparent_70%)]" />
      <div className="container-site py-16 md:py-24">
        <div className="grid-12 items-end gap-y-10">
          <div className="col-span-4 md:col-span-8 lg:col-span-7" data-reveal>
            {block.eyebrow && <p className="eyebrow text-white/85">{block.eyebrow}</p>}
            <h2 id="cta-heading" className="mt-4 text-display text-white">
              {block.heading ?? "Talk to an expert"}
            </h2>
            {block.body && <p className="mt-5 max-w-xl text-lead text-white/90">{block.body}</p>}
          </div>
          <div className="col-span-4 md:col-span-8 lg:col-span-5 lg:justify-self-end" data-reveal>
            <ButtonLink href={block.ctaHref ?? "/contact"} arrow size="lg">
              {block.ctaLabel ?? "Talk to an expert"}
            </ButtonLink>
            {region && (region.phone || region.email) && (
              <ul className="mt-6 grid gap-2 text-[0.9375rem]">
                {region.phone && (
                  <li>
                    <a href={region.phoneHref ?? `tel:${region.phone.replace(/[^+\d]/g, "")}`} className="inline-flex items-center gap-2 font-semibold hover:underline">
                      <Icon name="phone" size={18} />
                      {region.phone}
                    </a>
                  </li>
                )}
                {region.email && (
                  <li>
                    <a href={`mailto:${region.email}`} className="inline-flex items-center gap-2 font-semibold hover:underline">
                      <Icon name="mail" size={18} />
                      {region.email}
                    </a>
                  </li>
                )}
              </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
