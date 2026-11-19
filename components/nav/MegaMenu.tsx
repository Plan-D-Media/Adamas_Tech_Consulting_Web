"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { FeaturedCard, NavLink } from "@/lib/data/site";
import { cx } from "@/lib/cx";
import { Icon } from "@/components/ui/Icon";
import { ArrowLink } from "@/components/ui/Button";
import { Img } from "@/components/media/Img";
import { shortDate } from "@/lib/dates";
import { MegaMenuPortal } from "@/components/nav/MegaMenuPortal";

const OPEN_DELAY = 140;
const CLOSE_DELAY = 200;

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** Visible, focusable descendants in DOM order. */
function focusables(root: HTMLElement): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((el) => el.getClientRects().length > 0);
}

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
    // The entrance animation lives on this element, not on a wrapper: an ancestor at opacity < 1 would itself be a
    // backdrop root and the blur would sample nothing for the 200ms it ran.
    <div id={panelId} role="group" aria-labelledby={labelId} className={cx("glass-panel anim-panel-in grid gap-8 rounded-lg px-12 py-10", cols)}>
      {/* Left: categories */}
      <div className={cx(rich && "border-r border-navy-900/10 pr-6")}>
        <p className="label-caps text-grey-700">{item.label}</p>
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
                    isActive ? "rounded-lg bg-white/80 text-blue-700" : "rounded-xs text-navy-900 hover:bg-white/70",
                    c.comingSoon && "text-navy-900/70",
                  )}
                >
                  <span>
                    {c.label}
                    {c.comingSoon && <span className="ml-2 font-body text-[0.75rem] font-normal text-grey-700">(coming soon)</span>}
                    {c.draft && <DraftBadge />}
                  </span>
                  {c.external ? (
                    <Icon name="external" size={14} className="shrink-0 text-grey-700" />
                  ) : rich ? (
                    <Icon name="chevron-right" size={18} className={cx("shrink-0", isActive ? "text-blue-700" : "text-navy-900/60")} />
                  ) : null}
                </NavAnchor>
              </li>
            );
          })}
        </ul>
        {overview.length > 0 && (
          <ul className="mt-6 border-t border-navy-900/10 pt-5" role="list">
            {overview.map((o) => (
              <li key={o.key ?? o.label}>
                <ArrowLink href={o.href ?? "#"} tone="text-blue-700 hover:text-blue-600" className="min-h-10 px-3 text-small">
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
                  <NavAnchor link={s} className={cx("block rounded-xs p-3 transition-colors duration-(--duration-fast)", s.comingSoon ? "" : "hover:bg-white/80")}>
                    <span className="flex items-center gap-2 font-ui text-menu-link font-semibold text-navy-900">
                      {s.label}
                      {s.external && <Icon name="external" size={12} className="text-grey-700" />}
                      {s.comingSoon && <span className="font-body text-[0.75rem] font-normal text-grey-700">(coming soon)</span>}
                      {s.draft && <DraftBadge />}
                    </span>
                    {s.descriptor && <span className="mt-1 block font-body text-caption text-grey-700">{s.descriptor}</span>}
                  </NavAnchor>
                </li>
              ))}
            </ul>
          ) : null}
          {active.href && !active.comingSoon && (
            <div className="mt-6 px-3">
              <ArrowLink href={active.href} external={active.external} tone="text-blue-700 hover:text-blue-600" className="text-menu-link">
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
 * the panel closes when focus leaves it. Panels fade and slide in over 200ms (CSS keyframes), none with reduced motion.
 *
 * The open panel is rendered through a portal at <body> level (components/nav/MegaMenuPortal.tsx) so that its
 * backdrop-filter has the page as its backdrop; inside the header it had none and the panel did not blur. The portal
 * is created from this component's JSX, so React events still bubble to the <nav> below - but **DOM order is lost**,
 * so Tab into and out of the panel is driven here instead (it used to come free from rendering inside the trigger's
 * <li>; QA BUG-008 is the regression test for it).
 */
export function MegaMenu({ items }: { items: NavLink[] }) {
  const [openKey, setOpenKey] = useState<string | null>(null);
  const timer = useRef<number | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);
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

  const triggerFor = useCallback((key: string) => navRef.current?.querySelector<HTMLButtonElement>(`button[data-menu-key="${key}"]`) ?? null, []);

  useEffect(() => clear, []);
  useEffect(() => {
    if (!openKey) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      const trigger = triggerFor(openKey);
      close();
      trigger?.focus();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [openKey, close, triggerFor]);

  // Close when focus leaves the open trigger and its panel (another trigger, the switcher, the page). Pointer
  // clicks on triggers are handled by onClick, so a click on another trigger still toggles cleanly. The panel now
  // lives outside the <li>, so containment is tested against the portal's wrapper as well.
  const onBlur = (e: React.FocusEvent) => {
    if (!openKey) return;
    const next = e.relatedTarget as Node | null;
    const owner = navRef.current?.querySelector(`li[data-menu-item="${openKey}"]`);
    if (!next) return close();
    if (owner?.contains(next)) return;
    if (hostRef.current?.contains(next)) return;
    close();
  };

  /** Tab from the trigger moves into the open panel, as DOM order used to. */
  const onTriggerKeyDown = (e: React.KeyboardEvent, key: string) => {
    if (e.key !== "Tab" || e.shiftKey || openKey !== key) return;
    const host = hostRef.current;
    if (!host) return;
    const first = focusables(host)[0];
    if (!first) return;
    e.preventDefault();
    first.focus();
  };

  /** Shift+Tab off the panel's first link returns to the trigger; Tab off its last link leaves the menu and closes it. */
  const onPanelKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== "Tab" || !openKey) return;
    const host = hostRef.current;
    if (!host) return;
    const items = focusables(host);
    if (items.length === 0) return;
    const active = document.activeElement as HTMLElement | null;
    const trigger = triggerFor(openKey);
    if (e.shiftKey && active === items[0]) {
      e.preventDefault();
      close();
      trigger?.focus();
      return;
    }
    if (!e.shiftKey && active === items[items.length - 1]) {
      e.preventDefault();
      close();
      // Continue the header's tab order: the focusable after the trigger, skipping the panel itself.
      const after = focusables(document.body).filter((el) => !host.contains(el));
      const i = trigger ? after.indexOf(trigger) : -1;
      (i >= 0 ? after[i + 1] : undefined)?.focus();
    }
  };

  return (
    <nav ref={navRef} aria-label="Main" className="static hidden h-full flex-1 items-center justify-end nav:flex" onBlur={onBlur}>
      <ul className="flex items-center gap-[37px]" role="list">
        {items.map((item) => {
          const hasMenu = item.children.length > 0;
          const key = item.key ?? item.label;
          const panelId = `${uid}-${key.replace(/\W+/g, "-")}`;
          const labelId = `${panelId}-label`;
          const isOpen = openKey === key;
          const cls = cx("inline-flex min-h-11 items-center gap-1.5 whitespace-nowrap font-ui text-nav text-ink transition-colors duration-(--duration-fast) hover:text-blue-600", isOpen && "text-blue-600");
          return (
            <li key={key} data-menu-item={key} className="static" onPointerEnter={hasMenu ? () => scheduleOpen(key) : undefined} onPointerLeave={hasMenu ? scheduleClose : undefined}>
              {hasMenu ? (
                <button
                  type="button"
                  id={labelId}
                  data-menu-key={key}
                  className={cls}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  aria-haspopup="true"
                  onKeyDown={(e) => onTriggerKeyDown(e, key)}
                  onClick={() => {
                    clear();
                    setOpenKey(isOpen ? null : key);
                  }}
                >
                  {item.label}
                  <Icon name="chevron-down" size={10} className={cx("transition-transform duration-(--duration-fast)", isOpen && "rotate-180")} />
                </button>
              ) : (
                <Link href={item.href ?? "#"} className={cls}>
                  {item.label}
                </Link>
              )}
              {hasMenu && isOpen && (
                <MegaMenuPortal
                  navRef={navRef}
                  hostRef={hostRef}
                  onPointerEnter={clear}
                  onPointerLeave={scheduleClose}
                  onScrimEnter={scheduleClose}
                  onScrimClick={close}
                  onKeyDown={onPanelKeyDown}
                  onBlur={onBlur}
                >
                  <Panel item={item} panelId={panelId} labelId={labelId} />
                </MegaMenuPortal>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
