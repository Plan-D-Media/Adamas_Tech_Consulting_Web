"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * "Skip to content". Next 16 keeps up to three routes mounted and hidden during client navigation, so after the first
 * navigation `#main` can resolve to a hidden copy of a previous page (QA BUG-013). The click handler focuses the
 * visible <main> instead; without JavaScript the plain fragment link still works (one main in the document).
 *
 * A client navigation also leaves the browser's *sequential focus navigation starting point* on the link that was
 * activated, even though `document.activeElement` is back to <body>: the next Tab then continues from the middle of
 * the header instead of reaching this link, so keyboard and screen-reader users lose "Skip to content" after the
 * first navigation (QA BUG-037). Focusing <body> on each navigation moves that starting point back to the top of the
 * document. <body> is used rather than a sentinel of our own because the retained hidden routes each render their own
 * chrome, and only <body> is guaranteed to be the one the visitor is looking at.
 */

/** Module scope: the first mount is the initial page load, which must not have its focus moved. */
let booted = false;

export function SkipLink() {
  const pathname = usePathname();

  useEffect(() => {
    if (!booted) {
      booted = true;
      return;
    }
    const body = document.body;
    // tabindex="-1" only makes <body> programmatically focusable; it never puts it in the Tab order. It is left in
    // place because removing it again would drop the starting point we have just set.
    if (!body.hasAttribute("tabindex")) body.setAttribute("tabindex", "-1");
    body.focus({ preventScroll: true });
  }, [pathname]);

  const onClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const mains = Array.from(document.querySelectorAll<HTMLElement>("main"));
    const main = mains.find((m) => m.getClientRects().length > 0) ?? mains[0];
    if (!main) return;
    e.preventDefault();
    main.focus({ preventScroll: true });
    main.scrollIntoView({ block: "start" });
  };
  return (
    <a href="#main" onClick={onClick} className="sr-only-focusable fixed left-4 top-4 z-[100] rounded-sm bg-white px-4 py-2 font-ui text-button font-bold text-navy-950 shadow-lift">
      Skip to content
    </a>
  );
}
