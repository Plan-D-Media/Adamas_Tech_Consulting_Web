import Link from "next/link";
import type { ReactNode } from "react";
import { cx } from "@/lib/cx";
import { CardArt } from "@/components/media/CardArt";
import { Icon, type IconName } from "@/components/ui/Icon";

/** Signpost card with branded artwork: Insights hub and the blog's "in the meantime" links. */
export function VisualLinkCard({
  href,
  eyebrow,
  title,
  body,
  icon,
  variant = 0,
  cta = "Explore",
  badge,
  size = "md",
}: {
  href: string;
  eyebrow: string;
  title: string;
  body?: string;
  icon: IconName;
  variant?: number;
  cta?: string;
  badge?: ReactNode;
  size?: "md" | "lg";
}) {
  return (
    <article className="card-lift group relative flex h-full flex-col overflow-hidden rounded-card border border-grey-200 bg-white hover:border-brand-200">
      <div className={cx("card-media relative overflow-hidden bg-navy-900", size === "lg" ? "aspect-[16/9]" : "aspect-[16/10]")}>
        <div className="absolute inset-0 transition-transform duration-(--duration-zoom) ease-(--ease-out-expo) group-hover:scale-105">
          <CardArt icon={icon} variant={variant} />
        </div>
        <span className="absolute left-5 top-5 inline-flex size-12 items-center justify-center rounded-full bg-white/10 text-sky-300 ring-1 ring-white/20 backdrop-blur-md">
          <Icon name={icon} size={22} />
        </span>
        {badge && <div className="absolute bottom-5 left-5">{badge}</div>}
      </div>
      <div className="flex flex-1 flex-col p-6 md:p-8">
        <p className="eyebrow text-brand-600">{eyebrow}</p>
        <h3 className={cx("mt-3 font-bold text-navy-950", size === "lg" ? "text-h3" : "text-h4")}>
          <Link href={href} className="after:absolute after:inset-0 after:content-['']">
            {title}
          </Link>
        </h3>
        {body && <p className="mt-3 text-grey-700">{body}</p>}
        <span className="mt-auto inline-flex items-center gap-2 pt-6 text-[0.9375rem] font-semibold text-brand-600">
          {cta}
          <Icon name="arrowRight" size={18} className="transition-transform duration-(--duration-base) group-hover:translate-x-1" />
        </span>
      </div>
    </article>
  );
}
