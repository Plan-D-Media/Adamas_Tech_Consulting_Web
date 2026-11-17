import "server-only";

/**
 * True when DRAFT rows are being previewed (PREVIEW_DRAFTS=true outside production, the same rule as lib/db.ts
 * `visibleStatuses`). "To be confirmed" tags and placeholder stand-ins for copy that is still missing inside a
 * PUBLISHED row are only rendered in that mode; the public site shows nothing in their place (QA BUG-014).
 */
export const previewingDrafts = process.env.PREVIEW_DRAFTS === "true" && process.env.SITE_ENV !== "production";
