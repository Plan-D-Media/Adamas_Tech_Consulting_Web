import { isPlaceholder } from "@/lib/placeholder";
import { previewingDrafts } from "@/lib/preview";

/**
 * Block-level placeholder gate (Swayang, 17 Nov 2026).
 *
 * Some PUBLISHED rows still carry a placeholder or a "to be confirmed" label in ONE field, inside content a visitor
 * needs: a pillar's outcome line, a page's hero heading, the About page's group paragraph, the "to be confirmed"
 * labels on About, Team and Credentials. Taking the whole row to DRAFT would remove a working page, so instead the
 * single field is withheld here: with PREVIEW_DRAFTS off the reader hands the component `null`, and the component's
 * existing fallback (another field, or leaving the block out) takes over. With drafts previewed everything is passed
 * through, so the review build still shows what is missing.
 *
 * This is the data layer on purpose: every current and future template gets the gate for free, and no placeholder
 * can reach the public HTML through a component that forgot to call `plain()`.
 */

/** A "to be confirmed" / "to come" label: copy that names its own absence. */
const PENDING_LABEL = /\b(to be confirmed|to be supplied|to come|tbc|tbd)\b/i;

export function isPending(value: string | null | undefined): boolean {
  return !!value && (isPlaceholder(value) || PENDING_LABEL.test(value));
}

/** The field as the public site may show it: `null` when it is a placeholder and drafts are not being previewed. */
export function publicCopy<T extends string | null | undefined>(value: T): T | null {
  if (previewingDrafts) return value;
  return isPending(value) ? null : value;
}

/** True when the field may be rendered in this configuration. */
export function showPending(value: string | null | undefined): boolean {
  return previewingDrafts || !isPending(value);
}
