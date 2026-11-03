/**
 * Placeholder convention (content/ and the DB): "[Name]" is a name awaiting confirmation;
 * "[Placeholder] text" is stand-in copy. Brackets never reach the screen: names render without them
 * plus a "to be confirmed" tag, and instructional stand-ins (sentences ending in ".") render as
 * "Details to be confirmed". Every case stays logged in CONTENT_TODO.md.
 */

export interface Copy {
  text: string;
  pending: boolean;
}

const PREFIX = /^\[Placeholder\]\s*/i;
const BRACKETED = /^\[([^\]]+)\]$/;

export const DETAILS_TBC = "Details to be confirmed";

export function isPlaceholder(s: string | null | undefined): boolean {
  return !!s && (PREFIX.test(s) || BRACKETED.test(s.trim()));
}

/** Screen-safe copy for a possibly-placeholder string. */
export function copy(s: string, fallback = DETAILS_TBC): Copy {
  const t = s.trim();
  const named = BRACKETED.exec(t);
  if (named && !PREFIX.test(t)) return { text: named[1].trim(), pending: true };
  if (!PREFIX.test(t)) return { text: t, pending: false };
  const rest = t.replace(PREFIX, "").trim();
  // Instructions ("One-line product tagline.", "metric label") are not shown; labels ("AI solution 4") are.
  if (!rest || rest.endsWith(".") || /^metric label$/i.test(rest)) return { text: fallback, pending: true };
  return { text: rest, pending: true };
}

/** Same as copy(), but null when the string is only an instruction (for optional body copy). */
export function optionalCopy(s: string | null | undefined): Copy | null {
  if (!s) return null;
  const c = copy(s);
  return c.pending && c.text === DETAILS_TBC ? null : c;
}

/** Plain text with brackets removed (for alt text, metadata and aria labels). */
export function plain(s: string | null | undefined): string {
  return s ? copy(s, "").text : "";
}
