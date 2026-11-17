"use client";

/**
 * "Skip to content". Next 16 keeps up to three routes mounted and hidden during client navigation, so after the first
 * navigation `#main` can resolve to a hidden copy of a previous page (QA BUG-013). The click handler focuses the
 * visible <main> instead; without JavaScript the plain fragment link still works (one main in the document).
 */
export function SkipLink() {
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
