"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { FeaturedCard, NavLink } from "@/lib/data/site";
import { cx } from "@/lib/cx";
import { Icon } from "@/components/ui/Icon";
import { ArrowLink } from "@/components/ui/Button";
import { Img } from "@/components/media/Img";
import { shortDate } from "@/lib/dates";

const OPEN_DELAY = 140;
const CLOSE_DELAY = 200;

/** A menu's "overview" link is the child that points at the menu's own page (Services overview, All solutions). */
function splitChildren(item: NavLink) {
  const overview = item.children.filter((c) => c.href && c.href === item.href);
  const categories = item.children.filter((c) => !(c.href && c.href === item.href));
  return { overview, categories };
}

function NavAnchor({ link, className, children, onFocus, onPointerEnter }: { link: NavLink; className?: string; children: React.ReactNode; onFocus?: () => void; onPointerEnter?: () => void }) {
  if (link.comingSoon || !link.href) {
    return (
      <span className={cx(className, "cursor-default")} onPointerEnter={onPointerEnter} tabIndex={link.href ? undefined : 0} onFocus={onFocus}>
        {children}
      </span>
    );
  }
  if (link.external) {
    return (
      <a href={link.href} target="_blank" rel="noopener noreferrer" className={className} onFocus={onFocus} onPointerEnter={onPointerEnter}>
        {children}
      </a>
    );
  }
  return (
    <Link href={link.href} className={className} onFocus={onFocus} onPointerEnter={onPointerEnter}>
      {children}
    </Link>
  );
}

function Featured({ card }: { card: FeaturedCard }) {
  return (
    <Link href={card.href} className="group relative flex h-full min-h-[22rem] flex-col justify-end overflow-hidden rounded-lg bg-navy-900 p-6 text-white">
      {card.image && (
        <Img src={card.image} alt="" fill sizes="280px" className="object-cover opacity-45 transition-transform duration-(--duration-slow) ease-(--ease-out) group-hover:scale-[1.04]" />
      )}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(7_28_54/0)_0%,rgb(7_28_54/0.7)_50%,rgb(7_28_54/1)_100%)]" aria-hidden="true" />
      <div className="relative">
        <p className="label-caps text-sky-400">{card.kind === "event" ? "Event" : "Case study"}</p>
        {card.metric ? (
          <p className="mt-5 font-heading text-[3rem] font-bold leading-none">{card.metric}</p>
        ) : card.date ? (
          <p className="mt-5 font-heading text-[1.5rem] font-bold leading-tight">{shortDate(card.date, "Europe/London")}</p>
        ) : null}
        <p className="mt-2 font-body text-[1.0625rem] font-semibold leading-snug">{card.title}</p>
        <span className="mt-4 inline-flex items-center gap-2 font-body text-[0.875rem] font-bold text-orange-600">
          {card.kind === "event" ? "View event" : "Read the story"}
          <Icon name="arrow" size={16} />
        </span>
      </div>
    </Link>
  );
}

function Panel({ item, panelId, labelId }: { item: NavLink; panelId: string; labelId: string }) {
  const split = splitChildren(item);
  const rich = split.categories.some((c) => c.children.length > 0);
  // Rich menus (Services, Solutions) list categories on the left and their links in the middle, with the overview
  // link below. Flat menus (About Us, Insights) list every item in its seeded order, as plain links.
  const categories = rich ? split.categories : item.children;
  const overview = rich ? split.overview : [];
  const [activeKey, setActiveKey] = useState<string | null>(categories.find((c) => c.children.length > 0)?.key ?? categories[0]?.key ?? null);
  const active = categories.find((c) => c.key === activeKey) ?? categories[0];
  const featured = item.featured;
  const cols = rich ? (featured ? "nav:grid-cols-[280px_minmax(0,1fr)_280px]" : "nav:grid-cols-[280px_minmax(0,1fr)]") : featured ? "nav:grid-cols-[280px_280px]" : "nav:grid-cols-[280px]";

  return (
    <div id={panelId} role="group" aria-labelledby={labelId} className={cx("grid gap-8 bg-grey-100 px-12 py-10", cols)}>
      {/* Left: categories */}
      <div className={cx(rich && "border-r border-grey-200 pr-6")}>
        <p className="label-caps text-grey-500">{item.label}</p>
        <ul className="mt-4 grid gap-1" role="list">
          {categories.map((c) => {
            const isActive = rich && c.key === active?.key;
            return (
              <li key={c.key ?? c.label}>
                <NavAnchor
                  link={c}
                  onPointerEnter={rich ? () => setActiveKey(c.key) : undefined}
                  onFocus={rich ? () => setActiveKey(c.key) : undefined}
                  className={cx(
                    "flex min-h-[3.25rem] items-center justify-between gap-3 px-3 font-ui text-menu font-bold transition-colors duration-(--duration-fast)",
                    isActive ? "rounded-lg bg-tint-100 text-blue-600" : "rounded-xs text-navy-900 hover:bg-white/60",
                    c.comingSoon && "text-navy-900/60",
                  )}
                >
                  <span>
                    {c.label}
                    {c.comingSoon && <span className="ml-2 font-body text-[0.75rem] font-normal text-grey-500">(coming soon)</span>}
                    {c.draft && <DraftBadge />}
                  </span>
                  {c.external ? (
                    <Icon name="external" size={14} className="shrink-0 text-grey-500" />
                  ) : rich ? (
                    <Icon name="chevron-right" size={18} className={cx("shrink-0", isActive ? "text-blue-600" : "text-navy-900/40")} />
                  ) : null}
                </NavAnchor>
              </li>
            );
          })}
        </ul>
        {overview.length > 0 && (
          <ul className="mt-6 border-t border-grey-200 pt-5" role="list">
            {overview.map((o) => (
              <li key={o.key ?? o.label}>
                <ArrowLink href={o.href ?? "#"} className="min-h-10 px-3 text-small">
                  {o.label}
                </ArrowLink>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Middle: the active category's links */}
      {rich && active && (
        <div className="px-4">
          {active.descriptor && <p className="font-body text-small text-grey-700">{active.descriptor}</p>}
          {active.children.length > 0 ? (
            <ul className="mt-5 grid gap-x-8 gap-y-1 sm:grid-cols-2" role="list">
              {active.children.map((s) => (
                <li key={s.key ?? s.label}>
                  <NavAnchor link={s} className={cx("block rounded-xs p-3 transition-colors duration-(--duration-fast)", s.comingSoon ? "" : "hover:bg-white/70")}>
                    <span className="flex items-center gap-2 font-ui text-menu-link font-semibold text-navy-900">
                      {s.label}
                      {s.external && <Icon name="external" size={12} className="text-grey-500" />}
                      {s.comingSoon && <span className="font-body text-[0.75rem] font-normal text-grey-500">(coming soon)</span>}
                      {s.draft && <DraftBadge />}
                    </span>
                    {s.descriptor && <span className="mt-1 block font-body text-caption text-grey-500">{s.descriptor}</span>}
                  </NavAnchor>
                </li>
              ))}
            </ul>
          ) : null}
          {active.href && !active.comingSoon && (
            <div className="mt-6 px-3">
              <ArrowLink href={active.href} external={active.external} className="text-menu-link">
                Explore {active.label}
              </ArrowLink>
            </div>
          )}
        </div>
      )}

      {featured && <Featured card={featured} />}
    </div>
  );
}

function DraftBadge() {
  return <span className="ml-2 rounded-xs bg-orange-500 px-1.5 py-0.5 align-middle font-body text-[0.625rem] font-bold uppercase tracking-wider text-navy-950">Draft</span>;
}

/**
 * Desktop navigation with mega menus (About Us, Services, Solutions, Insights; Case Studies is a direct link).
 * Hover intent (140ms open / 200ms close), click or tap toggles, Enter/Space opens, Esc closes and returns focus,
 * the panel closes when focus leaves it. Panels fade and slide under 250ms (Motion), none with reduced motion.
 */
export function MegaMenu({ items }: { items: NavLink[] }) {
  const [openKey, setOpenKey] = useState<string | null>(null);
  const timer = useRef<number | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const uid = useId();

  const clear = () => {
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = null;
  };
  const scheduleOpen = (key: string) => {
    clear();
    timer.current = window.setTimeout(() => setOpenKey(key), OPEN_DELAY);
  };
  const scheduleClose = useCallback(() => {
    clear();
    timer.current = window.setTimeout(() => setOpenKey(null), CLOSE_DELAY);
  }, []);
  const close = useCallback(() => {
    clear();
    setOpenKey(null);
  }, []);

  useEffect(() => clear, []);
  useEffect(() => {
    if (!openKey) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      const trigger = navRef.current?.querySelector<HTMLButtonElement>(`button[data-menu-key="${openKey}"]`);
      close();
      trigger?.focus();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [openKey, close]);

  const onBlur = (e: React.FocusEvent) => {
    if (!navRef.current?.contains(e.relatedTarget as Node)) close();
  };

  const open = items.find((i) => i.key === openKey && i.children.length > 0);

  return (
    <nav ref={navRef} aria-label="Main" className="static hidden h-full flex-1 items-center justify-center nav:flex" onBlur={onBlur}>
      <ul className="flex items-center gap-10" role="list">
        {items.map((item) => {
          const hasMenu = item.children.length > 0;
          const key = item.key ?? item.label;
          const panelId = `${uid}-${key.replace(/\W+/g, "-")}`;
          const labelId = `${panelId}-label`;
          const isOpen = openKey === key;
          const cls = cx("inline-flex min-h-11 items-center gap-1.5 whitespace-nowrap font-ui text-nav text-ink transition-colors duration-(--duration-fast) hover:text-blue-600", isOpen && "text-blue-600");
          return (
            <li key={key} className="static" onPointerEnter={hasMenu ? () => scheduleOpen(key) : undefined} onPointerLeave={hasMenu ? scheduleClose : undefined}>
              {hasMenu ? (
                <button
                  type="button"
                  id={labelId}
                  data-menu-key={key}
                  className={cls}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  aria-haspopup="true"
                  onClick={() => {
                    clear();
                    setOpenKey(isOpen ? null : key);
                  }}
                >
                  {item.label}
                  <Icon name="chevron-down" size={10} className={cx("transition-transform duration-(--duration-fast)", isOpen && "rotate-180")} />
                </button>
              ) : (
                <Link href={item.href ?? "#"} className={cls} onFocus={close}>
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ul>

      {/* The hover zone starts at the bar's bottom edge: the 45px gap in Figma is transparent padding, so the pointer can cross it. */}
      <div className="absolute left-0 right-0 top-full pt-[45px]" onPointerEnter={clear} onPointerLeave={scheduleClose}>
        <AnimatePresence>
          {open && (
            <motion.div
              key={open.key ?? open.label}
              initial={reduce ? false : { opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: -6 }}
              transition={{ duration: reduce ? 0 : 0.2, ease: [0.2, 0.7, 0.2, 1] }}
              className="shadow-lift"
            >
              <Panel item={open} panelId={`${uid}-${(open.key ?? open.label).replace(/\W+/g, "-")}`} labelId={`${uid}-${(open.key ?? open.label).replace(/\W+/g, "-")}-label`} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
