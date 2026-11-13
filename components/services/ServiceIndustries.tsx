import Link from "next/link";
import { cx } from "@/lib/cx";
import { Icon } from "@/components/ui/Icon";
import { Img } from "@/components/media/Img";
import { ServiceSectionHead } from "@/components/services/ServiceSectionHead";

interface Item {
  label: string;
  image?: string;
  imageAlt?: string;
  href: string;
}

interface Props {
  eyebrow?: string | null;
  heading: string;
  body?: string | null;
  items: Item[];
}

function Card({ it, index, className, sizes }: { it: Item; index: number; className?: string; sizes: string }) {
  return (
    <Link href={it.href} className={cx("group relative block overflow-hidden rounded-[10px] bg-navy-900 shadow-[0_14px_35px_rgb(58_74_110/0.10)] ring-[5px] ring-inset ring-white/55", className)} data-reveal>
      {it.image && <Img src={it.image} alt={it.imageAlt ?? ""} fill sizes={sizes} className="object-cover transition-transform duration-(--duration-slow) ease-(--ease-out) group-hover:scale-[1.03]" />}
      <div className="absolute inset-0 bg-[linear-gradient(0deg,rgb(5_17_34/0.95)_0%,rgb(5_17_34/0)_68%)]" aria-hidden="true" />
      <div className="absolute bottom-[34px] left-7 right-7 flex items-end justify-between gap-4">
        <div>
          <p className="font-heading text-[0.5625rem] leading-[1.5] text-[#7EB6FF]" aria-hidden="true">
            {String(index + 1).padStart(2, "0")}
          </p>
          <p className="font-heading text-[clamp(1.25rem,1.1rem+0.4vw,1.5625rem)] leading-[1.5] text-white">{it.label}</p>
        </div>
        <span className="inline-flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full text-white ring-1 ring-white/60" aria-hidden="true">
          <Icon name="arrow" size={13} />
        </span>
      </div>
    </Link>
  );
}

/**
 * "Industry solutions" (Figma Section 298:28243): the head, then a 1320px mosaic: one tall card (499x654) and, on the
 * right, a wide card (765x320) over two smaller ones (347 and 405 wide). Cards link to /contact until industry pages
 * exist (brief section 7).
 */
export function ServiceIndustries({ eyebrow, heading, body, items }: Props) {
  const [a, b, c, d] = items;
  return (
    <section data-compare="industries" aria-labelledby="service-industries-heading" className="bg-white py-14 lg:py-[108px]">
      <div className="container-site">
        <ServiceSectionHead id="service-industries-heading" eyebrow={eyebrow} heading={heading} body={body} headingClassName="max-w-[800px] font-bold" bodyClassName="mt-[22px] max-w-[841px]" />
        {items.length > 0 && (
          <div className="mt-10 grid gap-[14px] lg:mt-[60px] lg:h-[654px] lg:grid-cols-[499px_minmax(0,1fr)]">
            {a && <Card it={a} index={0} className="min-h-[320px] lg:h-full" sizes="(min-width: 1024px) 499px, 100vw" />}
            <div className="grid gap-[14px] lg:grid-rows-[320px_320px]">
              {b && <Card it={b} index={1} className="min-h-[320px]" sizes="(min-width: 1024px) 765px, 100vw" />}
              <div className="grid gap-[13px] sm:grid-cols-[minmax(0,347fr)_minmax(0,405fr)]">
                {c && <Card it={c} index={2} className="min-h-[320px]" sizes="(min-width: 1024px) 347px, 100vw" />}
                {d && <Card it={d} index={3} className="min-h-[320px]" sizes="(min-width: 1024px) 405px, 100vw" />}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
