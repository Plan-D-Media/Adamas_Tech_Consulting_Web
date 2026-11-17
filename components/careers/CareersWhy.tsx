import { Icon } from "@/components/ui/Icon";
import { Eyebrow, Heading2 } from "@/components/ui/SectionHeader";

interface Props {
  eyebrow: string | null;
  heading: string | null;
  body: string | null;
  ctaLabel: string | null;
  /** Null unless CAREERS_APPLY_URL or CAREERS_EMAIL is configured; the button is not drawn without one. */
  applyHref: string | null;
  phone: { label: string; href: string } | null;
}

/**
 * "Why Work with adamas" (Figma 274:2667, band y 629-1340): the section copy, then the blue invitation card with
 * the Apply button and the recruitment phone number.
 *
 * The application backend is out of scope for this phase (brief section 2.4), so the button is an ordinary link to
 * whatever `CAREERS_APPLY_URL` or `CAREERS_EMAIL` names, and the card loses it when neither is set.
 */
export function CareersWhy({ eyebrow, heading, body, ctaLabel, applyHref, phone }: Props) {
  if (!heading && !body) return null;
  return (
    <section data-compare="careers-why" aria-labelledby="careers-why-heading" className="bg-white py-14 lg:py-[88px]">
      <div className="container-site">
        <div className="max-w-[820px]" data-reveal>
          {eyebrow && <Eyebrow className="!text-[1.25rem] !tracking-normal">{eyebrow}</Eyebrow>}
          {heading && <Heading2 id="careers-why-heading" className="mt-3">{heading}</Heading2>}
          {body && <p className="mt-4 font-body text-[1.125rem] leading-[1.65] text-grey-600">{body}</p>}
        </div>

        {(applyHref || phone) && (
          <div className="mt-10 grid gap-6 rounded-lg bg-[linear-gradient(90deg,#1167d8_0%,#3476F6_100%)] px-8 py-10 text-white lg:mt-[56px] lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:px-[56px]" data-reveal>
            <div>
              <p className="font-heading text-[1.5rem] font-bold leading-[1.25]">Join the AdamasTech team</p>
              <p className="mt-3 max-w-[640px] font-body text-[1.0625rem] leading-[1.6] text-white/85">
                Tell us what you are good at and the kind of work you want to do next. We read every application.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              {applyHref && (
                <a href={applyHref} className="inline-flex min-h-[48px] items-center gap-3 rounded-pill bg-white px-7 font-heading text-[0.9375rem] font-bold text-navy-850 hover:bg-tint-50">
                  {ctaLabel || "Apply now"}
                  <Icon name="arrow" size={17} />
                </a>
              )}
              {phone && (
                <a href={phone.href} className="inline-flex min-h-[48px] items-center gap-2 font-heading text-[0.9375rem] font-bold text-white hover:underline">
                  <Icon name="phone" size={16} />
                  {phone.label}
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
