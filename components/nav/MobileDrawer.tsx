"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, m } from "motion/react";
import type { NavLink } from "@/lib/data/site";
import { cx } from "@/lib/cx";
import { Icon } from "@/components/ui/Icon";
import { ButtonLink } from "@/components/ui/Button";
import { LogoLink } from "./LogoLink";
import { RegionSwitcher, type RegionOption } from "./RegionSwitcher";

/**
 * Full-screen drawer: accordion menus, region switcher and a sticky "Talk to an expert".
 * Traps focus while open, Esc closes, body scroll is locked.
 */
export function MobileDrawer({
  id,
  open,
  onClose,
  items,
  regions,
}: {
  id: string;
  open: boolean;
  onClose: () => void;
  items: NavLink[];
  regions: RegionOption[];
}) {
  const panel = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const opener = document.activeElement as HTMLElement | null;
    requestAnimationFrame(() => closeBtn.current?.focus());

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key !== "Tab" || !panel.current) return;
      const focusables = panel.current.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),[tabindex]:not([tabindex="-1"])');
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
      opener?.focus?.();
    };
  }, [open, onClose]);

  const linkCls = "flex min-h-12 items-center justify-between gap-3 py-2 text-[0.9375rem] font-medium";

  const renderLeaf = (l: NavLink) => {
    if (l.comingSoon || !l.href) {
      return (
        <span className={cx(linkCls, "text-grey-500")}>
          {l.label}
          <span className="text-xs font-semibold">Coming soon</span>
        </span>
      );
    }
    if (l.external) {
      return (
        <a href={l.href} target="_blank" rel="noopener" className={linkCls}>
          {l.label}
          <Icon name="arrowUpRight" size={16} />
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      );
    }
    return (
      <Link href={l.href} onClick={onClose} className={linkCls}>
        {l.label}
      </Link>
    );
  };

  return (
    <AnimatePresence>
      {open && (
        <m.div
          id={id}
          ref={panel}
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          initial={{ opacity: 0, x: "6%" }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: "6%" }}
          transition={{ duration: 0.28, ease: [0.2, 0.7, 0.2, 1] }}
          className="fixed inset-0 z-[60] flex flex-col bg-white text-navy-950 lg:hidden"
        >
          <div className="container-site flex h-(--header-h) shrink-0 items-center justify-between border-b border-grey-200">
            <LogoLink />
            <button
              ref={closeBtn}
              type="button"
              onClick={onClose}
              className="inline-flex size-11 items-center justify-center rounded-btn border border-grey-200"
            >
              <Icon name="close" />
              <span className="sr-only">Close menu</span>
            </button>
          </div>

          <nav aria-label="Main" className="container-site flex-1 overflow-y-auto overscroll-contain pb-6">
            <ul className="divide-y divide-grey-200">
              {items.map((item) => {
                const key = item.key ?? item.label;
                if (!item.children.length) {
                  return (
                    <li key={key} className="py-1">
                      <Link href={item.href ?? "#"} onClick={onClose} className="flex min-h-14 items-center font-display text-xl font-bold [font-stretch:110%]">
                        {item.label}
                      </Link>
                    </li>
                  );
                }
                const isOpen = expanded === key;
                const sectionId = `${id}-${key}`;
                return (
                  <li key={key} className="py-1">
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={sectionId}
                      onClick={() => setExpanded(isOpen ? null : key)}
                      className="flex min-h-14 w-full items-center justify-between font-display text-xl font-bold [font-stretch:110%]"
                    >
                      {item.label}
                      <Icon name={isOpen ? "minus" : "plus"} />
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <m.div
                          id={sectionId}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.26, ease: [0.2, 0.7, 0.2, 1] }}
                          className="overflow-hidden"
                        >
                          <ul className="pb-4">
                            {item.children.map((c) => (
                              <li key={c.key ?? c.label}>
                                {c.children.length > 0 ? (
                                  <div className="mt-2 border-l-2 border-brand-100 pl-4">
                                    {c.href ? (
                                      <Link href={c.href} onClick={onClose} className="flex min-h-11 items-center font-semibold text-brand-700">
                                        {c.label}
                                      </Link>
                                    ) : (
                                      <p className="flex min-h-11 items-center font-semibold text-brand-700">{c.label}</p>
                                    )}
                                    <ul>
                                      {c.children.map((g) => (
                                        <li key={g.key ?? g.label}>{renderLeaf(g)}</li>
                                      ))}
                                    </ul>
                                  </div>
                                ) : (
                                  <div className="pl-4">{renderLeaf(c)}</div>
                                )}
                              </li>
                            ))}
                          </ul>
                        </m.div>
                      )}
                    </AnimatePresence>
                  </li>
                );
              })}
            </ul>

            <div className="mt-6">
              <p className="eyebrow mb-3 text-grey-600">Region</p>
              <RegionSwitcher regions={regions} inline />
            </div>
          </nav>

          <div className="container-site shrink-0 border-t border-grey-200 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
            <ButtonLink href="/contact" className="w-full" arrow onClick={onClose}>
              Talk to an expert
            </ButtonLink>
          </div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
