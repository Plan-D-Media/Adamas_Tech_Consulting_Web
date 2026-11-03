import type { ReactNode } from "react";
import type { Media } from "@/lib/media";
import { cx } from "@/lib/cx";
import { copy } from "@/lib/placeholder";
import { Img } from "@/components/media/Img";
import { CardArt } from "@/components/media/CardArt";
import type { IconName } from "@/components/ui/Icon";
import { TbcTag } from "@/components/ui/SectionHeader";
import { Breadcrumbs, type Crumb } from "./Breadcrumbs";

/**
 * Opening band for every inner page: dark, so the transparent header reads over it exactly as on the homepages.
 * Photography when the page has it, otherwise branded artwork with a glyph for the subject.
 * `aside` sits in the right-hand columns (key facts, a metric, a countdown); `children` run under the intro.
 */
export function PageHero({
  crumbs,
  eyebrow,
  title,
  intro,
  image,
  art = "layers",
  artVariant = 0,
  actions,
  aside,
  size = "md",
  children,
}: {
  crumbs: Crumb[];
  eyebrow?: string | null;
  title: string;
  intro?: string | null;
  image?: Media | null;
  art?: IconName;
  artVariant?: number;
  actions?: ReactNode;
  aside?: ReactNode;
  size?: "sm" | "md" | "lg";
  children?: ReactNode;
}) {
  const t = copy(title);
  const lead = intro ? copy(intro) : null;
  return (
    <section className="relative isolate overflow-hidden bg-navy-950 text-white">
      {image ? (
        <>
          <Img media={image} sizes="100vw" priority className="-z-20 opacity-60" />
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-linear-to-r from-navy-950 via-navy-950/85 to-navy-950/35" />
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-linear-to-t from-navy-950/80 to-transparent" />
        </>
      ) : (
        <>
          <CardArt icon={art} variant={artVariant} className="-z-20 [&>svg]:!left-auto [&>svg]:!right-[-4%] [&>svg]:!top-[8%] [&>svg]:!size-[min(42rem,70vw)]" />
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-linear-to-r from-navy-950 via-navy-950/80 to-transparent" />
        </>
      )}
      <div
        className={cx(
          "container-site pt-[calc(var(--header-h)+2.5rem)]",
          size === "sm" && "pb-14 md:pb-16",
          size === "md" && "pb-16 md:pb-24",
          size === "lg" && "pb-20 md:pb-28 lg:min-h-[38rem]",
        )}
      >
        <Breadcrumbs items={crumbs} tone="dark" />
        <div className="grid-12 mt-10 items-end gap-y-10 md:mt-14">
          <div className={cx("col-span-4", aside ? "md:col-span-8 lg:col-span-7" : "md:col-span-10 lg:col-span-9")}>
            {eyebrow && (
              <p className="eyebrow flex items-center gap-3 text-sky-400">
                <span aria-hidden="true" className="h-px w-8 bg-sky-400" />
                {copy(eyebrow).text}
              </p>
            )}
            <h1 className={cx("mt-5 font-display", size === "sm" ? "text-h2" : "text-display")}>{t.text}</h1>
            {t.pending && <TbcTag tone="dark" className="mt-4">Title to be confirmed</TbcTag>}
            {lead && (
              <p className={cx("mt-6 max-w-[42rem] text-lead", lead.pending ? "italic text-on-navy-muted/80" : "text-on-navy-muted")}>{lead.text}</p>
            )}
            {actions && <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">{actions}</div>}
            {children}
          </div>
          {aside && <div className="col-span-4 md:col-span-8 lg:col-span-4 lg:col-start-9">{aside}</div>}
        </div>
      </div>
    </section>
  );
}
