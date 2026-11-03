"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, m } from "motion/react";
import { cx } from "@/lib/cx";
import { isRegionSlug } from "@/lib/region";
import { Icon } from "@/components/ui/Icon";
import { regionFromPath, setRegionCookie, useRegionCookie } from "./regionClient";

export interface RegionOption {
  slug: string;
  label: string;
  phone: string | null;
  phoneHref: string | null;
}

/**
 * India · UK & Ireland · GCC. Swaps the homepage only and remembers the choice in the `region` cookie.
 * `inline` renders a plain radio-style list (mobile drawer, footer).
 */
export function RegionSwitcher({
  regions,
  tone = "light",
  inline = false,
  className,
}: {
  regions: RegionOption[];
  tone?: "light" | "dark";
  inline?: boolean;
  className?: string;
}) {
  const pathname = usePathname();
  const cookie = useRegionCookie();
  const current = regionFromPath(pathname) ?? cookie;
  const currentLabel = regions.find((r) => r.slug === current)?.label;
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const listId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        btnRef.current?.focus();
      }
    };
    const onDown = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  // Link does the navigation; this only remembers the choice. Each option is prefetched per link (prefetch={true})
  // as soon as it is shown, so the destination homepage is already in the router cache when it is clicked.
  const choose = (slug: string) => () => {
    if (!isRegionSlug(slug)) return;
    setRegionCookie(slug);
    setOpen(false);
  };

  const options = regions.map((r) => {
    const active = r.slug === current;
    return (
      <li key={r.slug}>
        <Link
          href={`/${r.slug}/`}
          prefetch={true}
          onClick={choose(r.slug)}
          aria-current={active ? "true" : undefined}
          className={cx(
            "flex min-h-11 items-center justify-between gap-6 rounded-btn px-3 text-[0.9375rem] font-medium",
            inline
              ? cx("border", active ? "border-brand-600 bg-brand-50 text-brand-700" : "border-grey-200")
              : cx("hover:bg-grey-50", active ? "text-brand-600 font-semibold" : "text-navy-950"),
          )}
        >
          {r.label}
          {active && <Icon name="check" size={18} />}
        </Link>
      </li>
    );
  });

  if (inline) {
    return (
      <nav aria-label="Choose your region" className={className}>
        <ul className="grid gap-2">{options}</ul>
      </nav>
    );
  }

  return (
    <div ref={ref} className={cx("relative", className)}>
      <button
        ref={btnRef}
        type="button"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((o) => !o)}
        className={cx(
          "flex min-h-11 items-center gap-2 rounded-btn border px-3 text-sm font-semibold transition-colors",
          tone === "dark" ? "border-white/35 hover:border-white" : "border-grey-200 hover:border-brand-600",
        )}
      >
        <Icon name="globe" size={18} />
        <span className="sr-only">Region: </span>
        <span>{currentLabel ?? "Region"}</span>
        <Icon name="chevronDown" size={14} className={cx("transition-transform", open && "rotate-180")} />
      </button>
      <AnimatePresence>
        {open && (
          <m.div
            id={listId}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2, ease: [0.2, 0.7, 0.2, 1] }}
            className="absolute right-0 top-[calc(100%+0.5rem)] z-10 w-60 rounded-card border border-grey-200 bg-white p-1.5 text-navy-950 shadow-float"
          >
            <p className="px-3 pb-1 pt-2 text-xs font-semibold uppercase tracking-wider text-grey-600">Choose your region</p>
            <ul>{options}</ul>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}
