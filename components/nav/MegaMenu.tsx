"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, m } from "motion/react";
import type { FeaturedCard, NavLink } from "@/lib/data/site";
import { cx } from "@/lib/cx";
import { Icon } from "@/components/ui/Icon";
import { Img } from "@/components/media/Img";
import { DraftBadge } from "@/components/ui/SectionHeader";

function NavAnchor({
  link,
  onNavigate,
  className,
  children,
}: {
  link: NavLink;
  onNavigate: () => void;
  className?: string;
  children: React.ReactNode;
}) {
  if (link.comingSoon || !link.href) {
    return (
      <span aria-disabled="true" className={cx(className, "cursor-default opacity-70")}>
        {children}
      </span>
    );
  }
  if (link.external) {
    return (
      <a href={link.href} target="_blank" rel="noopener" className={className}>
        {children}
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    );
  }
  return (
    <Link href={link.href} onClick={onNavigate} className={className}>
      {children}
    </Link>
  );
}

function SoonTag() {
  return <span className="ml-2 rounded-full bg-grey-50 px-2 py-0.5 text-[11px] font-semibold text-grey-600">Coming soon</span>;
}

/**
 * Full-width mega-menu: categories (left, 3 cols) · links with descriptors (middle, 6 cols) · featured card (right, 3 cols).
 * Categories switch on hover or focus, so keyboard users get the same panel.
 */
export function MegaPanel({ item, onNavigate }: { item: NavLink; onNavigate: () => void }) {
  const categories = item.children.filter((c) => c.children.length > 0);
  const leaves = item.children.filter((c) => c.children.length === 0);
  const [active, setActive] = useState(0);
  const cat = categories[active] ?? categories[0];

  return (
    <div className="border-t border-grey-200 bg-white text-navy-950 shadow-float">
      <div className="container-site grid-12 py-10">
        {/* Categories */}
        <div className="col-span-3 border-r border-grey-200 pr-6">
          <p className="eyebrow mb-4 text-grey-600">{item.label}</p>
          <ul className="grid gap-1">
            {categories.map((c, i) => (
              <li key={c.key ?? c.label} onPointerEnter={() => setActive(i)} onFocus={() => setActive(i)}>
                <NavAnchor
                  link={c}
                  onNavigate={onNavigate}
                  className={cx(
                    "group flex items-center justify-between rounded-btn px-3 py-3 font-display text-lg font-bold [font-stretch:110%] transition-colors",
                    i === active ? "bg-brand-50 text-brand-700" : "hover:bg-grey-25",
                  )}
                >
                  {c.label}
                  <Icon
                    name="chevronRight"
                    size={18}
                    className={cx("transition-transform", i === active ? "translate-x-0.5 opacity-100" : "opacity-40")}
                  />
                </NavAnchor>
              </li>
            ))}
          </ul>
          {leaves.length > 0 && (
            <ul className="mt-6 grid gap-1 border-t border-grey-200 pt-5">
              {leaves.map((l) => (
                <li key={l.key ?? l.label}>
                  <NavAnchor
                    link={l}
                    onNavigate={onNavigate}
                    className="inline-flex items-center gap-2 px-3 py-2 text-[0.9375rem] font-semibold text-brand-600 hover:text-brand-700"
                  >
                    {l.label}
                    {l.comingSoon ? <SoonTag /> : <Icon name={l.external ? "arrowUpRight" : "arrowRight"} size={16} />}
                  </NavAnchor>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Links */}
        <div className="col-span-6 px-4">
          <AnimatePresence mode="wait" initial={false}>
            {cat && (
              <m.div
                key={cat.key ?? cat.label}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -4 }}
                transition={{ duration: 0.2, ease: [0.2, 0.7, 0.2, 1] }}
              >
                {cat.descriptor && <p className="mb-5 max-w-xl text-[0.9375rem] text-grey-700">{cat.descriptor}</p>}
                <ul className="grid grid-cols-2 gap-x-8 gap-y-1">
                  {cat.children.map((l) => (
                    <li key={l.key ?? l.label}>
                      <NavAnchor
                        link={l}
                        onNavigate={onNavigate}
                        className="group block rounded-btn px-3 py-3 transition-colors hover:bg-grey-25"
                      >
                        <span className="flex items-center gap-2 font-semibold group-hover:text-brand-600">
                          {l.label}
                          {l.external && <Icon name="arrowUpRight" size={15} />}
                          {l.comingSoon && <SoonTag />}
                          {l.draft && <DraftBadge />}
                        </span>
                        {l.descriptor && <span className="mt-1 block text-small text-grey-600">{l.descriptor}</span>}
                      </NavAnchor>
                    </li>
                  ))}
                </ul>
                {cat.href && (
                  <NavAnchor
                    link={cat}
                    onNavigate={onNavigate}
                    className="mt-6 ml-3 inline-flex items-center gap-2 font-semibold text-brand-600 hover:text-brand-700"
                  >
                    Explore {cat.label}
                    <Icon name="arrowRight" size={16} />
                  </NavAnchor>
                )}
              </m.div>
            )}
          </AnimatePresence>
        </div>

        {/* Featured */}
        <div className="col-span-3">{item.featured && <FeaturedTile card={item.featured} onNavigate={onNavigate} />}</div>
      </div>
    </div>
  );
}

/** Compact dropdown for short menus (Insights, About Us). */
export function SimplePanel({ item, onNavigate }: { item: NavLink; onNavigate: () => void }) {
  return (
    <div className="border-t border-grey-200 bg-white text-navy-950 shadow-float">
      <div className="container-site grid-12 py-8">
        <div className="col-span-3">
          <p className="eyebrow text-grey-600">{item.label}</p>
          {item.descriptor && <p className="mt-3 text-[0.9375rem] text-grey-700">{item.descriptor}</p>}
        </div>
        <ul className="col-span-6 grid grid-cols-2 gap-x-8 gap-y-1">
          {item.children.map((l) => (
            <li key={l.key ?? l.label}>
              <NavAnchor link={l} onNavigate={onNavigate} className="group block rounded-btn px-3 py-3 transition-colors hover:bg-grey-25">
                <span className="flex items-center font-semibold group-hover:text-brand-600">
                  {l.label}
                  {l.comingSoon && <SoonTag />}
                </span>
                {l.descriptor && <span className="mt-1 block text-small text-grey-600">{l.descriptor}</span>}
              </NavAnchor>
            </li>
          ))}
        </ul>
        <div className="col-span-3">{item.featured && <FeaturedTile card={item.featured} onNavigate={onNavigate} />}</div>
      </div>
    </div>
  );
}

function FeaturedTile({ card, onNavigate }: { card: FeaturedCard; onNavigate: () => void }) {
  const date = card.date
    ? new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/London" }).format(
        new Date(card.date),
      )
    : null;
  return (
    <Link
      href={card.href}
      onClick={onNavigate}
      className="group relative flex h-full min-h-64 flex-col justify-end overflow-hidden rounded-card bg-navy-950 p-6 text-white"
    >
      <Img media={card.image} sizes="320px" className="opacity-45 transition-transform duration-700 group-hover:scale-105" />
      <span aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-navy-950 via-navy-950/70 to-navy-950/10" />
      <span className="relative">
        <span className="eyebrow text-sky-400">{card.kind === "event" ? "Event" : "Case study"}</span>
        {card.metric && <span className="mt-3 block font-display-wide text-5xl font-bold leading-none">{card.metric}</span>}
        {date && <span className="mt-3 block text-sm text-on-navy-muted">{date}</span>}
        <span className="mt-2 block font-semibold leading-snug">{card.title}</span>
        <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-orange-500">
          {card.kind === "event" ? "View event" : "Read the story"}
          <Icon name="arrowRight" size={16} className="transition-transform group-hover:translate-x-1" />
        </span>
      </span>
    </Link>
  );
}
