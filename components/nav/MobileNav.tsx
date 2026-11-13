"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import type { NavLink, RegionInfo } from "@/lib/data/site";
import { isRegionSlug, type RegionSlug } from "@/lib/region";
import { cx } from "@/lib/cx";
import { Icon } from "@/components/ui/Icon";
import { ButtonLink } from "@/components/ui/Button";
import { Flag } from "@/components/nav/Flag";
import { setRegionCookie } from "@/components/nav/regionClient";
import { useCurrentRegion } from "@/components/nav/useCurrentRegion";

interface Props {
  items: NavLink[];
  regions: RegionInfo[];
  region: RegionSlug | null;
  fallbackRegion: RegionSlug;
}

const FOCUSABLE = 'a[href], button:not([disabled]), summary, input, select, textarea, [tabindex]:not([tabindex="-1"])';

function Leaf({ link, className }: { link: NavLink; className?: string }) {
  const inner = (
    <>
      <span>{link.label}</span>
      {link.comingSoon && <span className="font-body text-[0.75rem] text-grey-700">(coming soon)</span>}
      {link.external && <Icon name="external" size={12} className="text-grey-700" />}
    </>
  );
  if (link.comingSoon || !link.href) return <span className={cx(className, "text-navy-900/70")}>{inner}</span>;
  if (link.external)
    return (
      <a href={link.href} target="_blank" rel="noopener noreferrer" className={className}>
        {inner}
      </a>
    );
  return (
    <Link href={link.href} className={className}>
      {inner}
    </Link>
  );
}

/**
 * Mobile navigation: the hamburger opens a full-height drawer with accordion sub-menus, the region switcher and the
 * "Talk to an expert" button (no mobile frames in Figma; see docs/design-notes.md). Built on <details>, so it opens
 * and closes without JavaScript; with JavaScript, focus is trapped inside, Esc closes it, body scroll is locked and
 * it closes on navigation.
 */
export function MobileNav({ items, regions, region, fallbackRegion }: Props) {
  const ref = useRef<HTMLDetailsElement>(null);
  const pathname = usePathname();
  const current = useCurrentRegion(regions, region, fallbackRegion);

  useEffect(() => {
    ref.current?.removeAttribute("open");
  }, [pathname]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const panel = el.querySelector<HTMLElement>("[data-drawer]");
    const summary = el.querySelector<HTMLElement>("summary");
    const onToggle = () => {
      document.body.style.overflow = el.open ? "hidden" : "";
      if (el.open) panel?.querySelector<HTMLElement>(FOCUSABLE)?.focus();
    };
    const onKey = (e: KeyboardEvent) => {
      if (!el.open) return;
      if (e.key === "Escape") {
        el.removeAttribute("open");
        summary?.focus();
        return;
      }
      if (e.key === "Tab" && panel) {
        const nodes = [summary, ...Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE))].filter((n): n is HTMLElement => !!n && n.offsetParent !== null);
        if (nodes.length === 0) return;
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    el.addEventListener("toggle", onToggle);
    document.addEventListener("keydown", onKey);
    return () => {
      el.removeEventListener("toggle", onToggle);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <details ref={ref} className="nav-drawer nav:hidden">
      <summary className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-sm text-ink hover:bg-white/60" aria-label="Menu">
        <Icon name="menu" size={24} className="nav-drawer-open-icon" />
        <Icon name="close" size={24} className="nav-drawer-close-icon" />
      </summary>
      <div data-drawer className="glass-panel fixed inset-x-0 bottom-0 top-(--header-h) z-40 overflow-y-auto rounded-none border-x-0 border-b-0 text-navy-900">
        <nav aria-label="Main" className="container-chrome py-6">
          <ul className="divide-y divide-navy-900/10" role="list">
            {items.map((item) =>
              item.children.length > 0 ? (
                <li key={item.key ?? item.label}>
                  <details className="group">
                    <summary className="flex min-h-14 cursor-pointer items-center justify-between font-ui text-[1.125rem] font-semibold">
                      {item.label}
                      <Icon name="chevron-down" size={12} className="text-blue-700 transition-transform duration-(--duration-fast) group-open:rotate-180" />
                    </summary>
                    <ul className="pb-3" role="list">
                      {item.href && (
                        <li>
                          <Link href={item.href} className="flex min-h-11 items-center font-body text-small font-semibold text-blue-700">
                            {item.label} overview
                          </Link>
                        </li>
                      )}
                      {item.children
                        .filter((c) => !(c.href && c.href === item.href))
                        .map((c) => (
                          <li key={c.key ?? c.label} className="pt-1">
                            <Leaf link={c} className="flex min-h-11 items-center gap-2 font-ui text-[1rem] font-semibold" />
                            {c.children.length > 0 && (
                              <ul className="mb-2 border-l border-navy-900/15 pl-4" role="list">
                                {c.children.map((s) => (
                                  <li key={s.key ?? s.label}>
                                    <Leaf link={s} className="flex min-h-10 items-center gap-2 font-body text-small text-grey-700" />
                                  </li>
                                ))}
                              </ul>
                            )}
                          </li>
                        ))}
                    </ul>
                  </details>
                </li>
              ) : (
                <li key={item.key ?? item.label}>
                  <Leaf link={item} className="flex min-h-14 items-center font-ui text-[1.125rem] font-semibold" />
                </li>
              ),
            )}
          </ul>

          <div className="mt-8">
            <p className="label-caps text-blue-700">Region</p>
            <ul className="mt-3 grid gap-1" role="list">
              {regions.map((r) => (
                <li key={r.code}>
                  <Link
                    href={`/${r.slug}/`}
                    prefetch={true}
                    onClick={() => {
                      if (isRegionSlug(r.slug)) setRegionCookie(r.slug);
                    }}
                    aria-current={r.slug === current.slug ? "true" : undefined}
                    className={cx("flex min-h-11 items-center gap-3 font-ui text-[1rem]", r.slug === current.slug ? "font-semibold text-navy-900" : "text-grey-700")}
                  >
                    <Flag slug={r.slug} />
                    {r.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8">
            <ButtonLink href="/contact" size="md" className="w-full">
              Talk to an expert
            </ButtonLink>
          </div>
        </nav>
      </div>
    </details>
  );
}
