import Link from "next/link";
import { cx } from "@/lib/cx";
import { copy } from "@/lib/placeholder";
import { Icon, type IconName } from "@/components/ui/Icon";
import { TbcTag } from "@/components/ui/SectionHeader";

/**
 * Text-led navigation card (sub-services, related pages): glyph, title, one-line descriptor, arrow.
 * The whole card is the link; it lifts on hover like every other card.
 */
export function LinkCard({
  href,
  title,
  descriptor,
  icon,
  tone = "light",
  className,
}: {
  href: string;
  title: string;
  descriptor?: string | null;
  icon?: IconName;
  tone?: "light" | "dark";
  className?: string;
}) {
  const t = copy(title);
  const d = descriptor ? copy(descriptor) : null;
  const dark = tone === "dark";
  return (
    <article
      className={cx(
        "card-lift group relative flex h-full flex-col rounded-card p-6 md:p-7",
        dark ? "bg-navy-900 text-white ring-1 ring-navy-700" : "border border-grey-200 bg-white hover:border-brand-200",
        className,
      )}
      data-spotlight={dark ? "" : undefined}
    >
      {icon && <Icon name={icon} size={28} strokeWidth={1.5} className={dark ? "text-sky-400" : "text-brand-600"} />}
      <h3 className={cx("text-h4 font-bold", icon && "mt-6", dark ? "text-white" : "text-navy-950")}>
        <Link href={href} className="after:absolute after:inset-0 after:z-[2] after:content-['']">
          {t.text}
        </Link>
      </h3>
      {t.pending && <TbcTag tone={tone} className="mt-3 self-start" />}
      {d && (
        <p className={cx("mt-3 line-clamp-3 text-small", d.pending ? "italic opacity-75" : "", dark ? "text-on-navy-muted" : "text-grey-700")}>{d.text}</p>
      )}
      <span className={cx("mt-auto inline-flex items-center gap-2 pt-6 text-[0.9375rem] font-semibold", dark ? "text-sky-400" : "text-brand-600")}>
        Explore
        <Icon name="arrowRight" size={18} className="transition-transform duration-(--duration-base) group-hover:translate-x-1" />
      </span>
    </article>
  );
}
