/**
 * Section anchors that something outside the section itself links to. Kept here, with no imports, so that
 * proxy.ts (which runs before any server component and must not pull in `server-only` modules) and the
 * components can agree on one id.
 */

/**
 * Products & Solutions on the regional homepages (components/home/Solutions.tsx). Solutions have no pages on this
 * site since 17 Nov 2026, so "/solutions", anything under it, and every "All solutions" link land here.
 */
export const SOLUTIONS_ANCHOR = "products-solutions";
