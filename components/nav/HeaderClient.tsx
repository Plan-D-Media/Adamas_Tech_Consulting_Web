"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, m } from "motion/react";
import type { NavLink } from "@/lib/data/site";
import { cx } from "@/lib/cx";
import { Icon } from "@/components/ui/Icon";
import { ButtonLink } from "@/components/ui/Button";
import { LogoLink } from "./LogoLink";
import { RegionSwitcher, type RegionOption } from "./RegionSwitcher";
import { MegaPanel, SimplePanel } from "./MegaMenu";
import { MobileDrawer } from "./MobileDrawer";

const OPEN_DELAY = 90;
const CLOSE_DELAY = 220;

export function HeaderClient({ items, regions }: { items: NavLink[]; regions: RegionOption[] }) {
  const pathname = usePathname();
  // Every template opens with a dark band (HeroStories on homepages, PageHero elsewhere),
  // so the header starts transparent with the reversed logo and turns solid on scroll.
  const overHero = true;

  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState<string | null>(null);
  const [drawer, setDrawer] = useState(false);
  const openTimer = useRef<number | undefined>(undefined);
  const closeTimer = useRef<number | undefined>(undefined);
  const headerRef = useRef<HTMLElement>(null);
  const triggerRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const baseId = useId();

  // Transparent → solid after 24px; hide on scroll down, reveal on scroll up.
  useEffect(() => {
    let last = window.scrollY;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrolled(y > 24);
        if (Math.abs(y - last) > 6) {
          setHidden(y > last && y > 480);
          last = y;
        }
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menus on route change (state adjusted during render, not in an effect).
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(null);
    setDrawer(false);
  }

  const closeMenu = useCallback((refocus = false) => {
    setOpen((cur) => {
      if (refocus && cur) triggerRefs.current.get(cur)?.focus();
      return null;
    });
  }, []);

  // Esc closes; click outside closes.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenu(true);
    };
    const onDown = (e: PointerEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) closeMenu();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open, closeMenu]);

  const hoverOpen = (key: string) => (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    window.clearTimeout(closeTimer.current);
    window.clearTimeout(openTimer.current);
    openTimer.current = window.setTimeout(() => setOpen(key), open ? 0 : OPEN_DELAY);
  };
  const hoverClose = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    window.clearTimeout(openTimer.current);
    closeTimer.current = window.setTimeout(() => setOpen(null), CLOSE_DELAY);
  };
  const keepOpen = () => window.clearTimeout(closeTimer.current);

  const solid = !overHero || scrolled || open !== null;
  const tone = solid ? "light" : "dark";
  const activeItem = items.find((i) => (i.key ?? i.label) === open) ?? null;

  return (
    <>
      <a
        href="#main"
        className="sr-only-focusable fixed left-4 top-3 z-[70] rounded-btn bg-navy-950 px-4 py-3 font-semibold text-white"
      >
        Skip to content
      </a>
      <header
        ref={headerRef}
        onPointerLeave={hoverClose}
        onPointerEnter={keepOpen}
        className={cx(
          "fixed inset-x-0 top-0 z-50 transition-[transform,background-color,box-shadow,color] duration-(--duration-base) ease-(--ease-out-expo)",
          solid ? "bg-white text-navy-950 shadow-[0_10px_30px_-18px_rgb(7_28_54/0.35),0_1px_0_var(--color-grey-100)]" : "bg-transparent text-white",
          hidden && !open && !drawer ? "-translate-y-full" : "translate-y-0",
        )}
      >
        {!solid && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 bg-linear-to-b from-navy-950/70 to-transparent"
          />
        )}
        <div className="container-site flex h-(--header-h) items-center gap-4 lg:gap-6">
          <LogoLink tone={tone} />

          <nav aria-label="Main" className="ml-4 hidden h-full flex-1 lg:block">
            <ul className="flex h-full items-stretch gap-1">
              {items.map((item) => {
                const key = item.key ?? item.label;
                const hasMenu = item.children.length > 0;
                const isOpen = open === key;
                const panelId = `${baseId}-${key}`;
                const itemCls = cx(
                  "relative flex h-full items-center gap-1.5 px-3 text-[0.9375rem] font-semibold transition-colors",
                  "after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:origin-left after:scale-x-0 after:transition-transform after:duration-(--duration-base)",
                  solid ? "after:bg-brand-600 hover:text-brand-600" : "after:bg-white hover:text-white/85",
                  isOpen && "after:scale-x-100",
                  isOpen && solid && "text-brand-600",
                );
                if (!hasMenu) {
                  return (
                    <li key={key} className="flex" onPointerEnter={() => window.clearTimeout(openTimer.current)}>
                      <Link
                        href={item.href ?? "#"}
                        className={cx(itemCls, pathname.startsWith(item.href ?? "~") && "after:scale-x-100")}
                        onPointerEnter={(e) => e.pointerType === "mouse" && setOpen(null)}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                }
                return (
                  <li key={key} className="flex" onPointerEnter={hoverOpen(key)}>
                    <button
                      ref={(el) => {
                        if (el) triggerRefs.current.set(key, el);
                      }}
                      type="button"
                      className={itemCls}
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => setOpen(isOpen ? null : key)}
                      onKeyDown={(e) => {
                        if (e.key === "ArrowDown") {
                          e.preventDefault();
                          setOpen(key);
                          requestAnimationFrame(() =>
                            document.getElementById(panelId)?.querySelector<HTMLElement>("a,button")?.focus(),
                          );
                        }
                      }}
                    >
                      {item.label}
                      <Icon
                        name="chevronDown"
                        size={16}
                        className={cx("transition-transform duration-(--duration-base)", isOpen && "rotate-180")}
                      />
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="ml-auto flex items-center gap-2 lg:ml-0">
            <Link
              href="/search"
              className={cx(
                "hidden size-11 items-center justify-center rounded-full transition-colors md:inline-flex",
                solid ? "hover:bg-grey-50" : "hover:bg-white/10",
              )}
            >
              <Icon name="search" />
              <span className="sr-only">Search</span>
            </Link>
            <RegionSwitcher regions={regions} tone={tone} className="hidden md:block" />
            <ButtonLink href="/contact" size="sm">
              Talk to an expert
            </ButtonLink>
            <button
              type="button"
              className={cx(
                "inline-flex size-11 items-center justify-center rounded-btn border lg:hidden",
                solid ? "border-grey-200" : "border-white/40",
              )}
              aria-expanded={drawer}
              aria-controls={`${baseId}-drawer`}
              onClick={() => setDrawer(true)}
            >
              <Icon name="menu" />
              <span className="sr-only">Open menu</span>
            </button>
          </div>
        </div>

        <AnimatePresence>
          {activeItem && activeItem.children.length > 0 && (
            <m.div
              key={open}
              id={`${baseId}-${open}`}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6, transition: { duration: 0.16 } }}
              transition={{ duration: 0.28, ease: [0.2, 0.7, 0.2, 1] }}
              className="absolute inset-x-0 top-full hidden lg:block"
              onBlur={(e) => {
                const next = e.relatedTarget as Node | null;
                if (next && !headerRef.current?.contains(next)) setOpen(null);
              }}
            >
              {activeItem.children.some((c) => c.children.length > 0) ? (
                <MegaPanel item={activeItem} onNavigate={() => setOpen(null)} />
              ) : (
                <SimplePanel item={activeItem} onNavigate={() => setOpen(null)} />
              )}
            </m.div>
          )}
        </AnimatePresence>
      </header>

      {/* Dims the page under an open mega-menu */}
      <AnimatePresence>
        {open && (
          <m.div
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 hidden bg-navy-950/40 backdrop-blur-[2px] lg:block"
            onClick={() => setOpen(null)}
          />
        )}
      </AnimatePresence>

      <MobileDrawer
        id={`${baseId}-drawer`}
        open={drawer}
        onClose={() => setDrawer(false)}
        items={items}
        regions={regions}
      />
    </>
  );
}
