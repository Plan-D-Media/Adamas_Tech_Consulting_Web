"use client";

import { useEffect, useState, type ReactNode } from "react";
import { cx } from "@/lib/cx";

/**
 * Sticky header wrapper. Figma has no scrolled state, so after 40px of scroll the band becomes solid navy with a
 * soft shadow and the top bar collapses (decision logged in docs/design-notes.md).
 */
export function HeaderShell({ children }: { children: ReactNode }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    let raf = 0;
    const read = () => {
      raf = 0;
      setScrolled(window.scrollY > 40);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(read);
    };
    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
  return (
    <header className={cx("site-header sticky top-0 z-50 transition-[background-color,box-shadow] duration-(--duration-base) ease-(--ease-out)", scrolled && "is-scrolled shadow-header")} data-scrolled={scrolled || undefined}>
      {children}
    </header>
  );
}
