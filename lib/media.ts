/**
 * Media URLs. Local dev serves /public/media; production points MEDIA_BASE_URL at CloudFront.
 * Keys are stored in the DB relative to the base (e.g. "images/hero/sap.jpg").
 */

export interface Media {
  url: string;
  alt: string;
  width: number | null;
  height: number | null;
  blurDataUrl: string | null;
  isPlaceholder: boolean;
}

interface MediaRow {
  key: string;
  alt: string;
  width: number | null;
  height: number | null;
  blurDataUrl: string | null;
  isPlaceholder: boolean;
}

const BASE = (process.env.MEDIA_BASE_URL || "/media").replace(/\/+$/, "");

export function mediaUrl(key: string): string {
  if (/^https?:\/\//.test(key)) return key;
  return `${BASE}/${key.replace(/^\/+/, "")}`;
}

export function toMedia(row: MediaRow | null | undefined): Media | null {
  if (!row) return null;
  return {
    url: mediaUrl(row.key),
    alt: row.alt,
    width: row.width,
    height: row.height,
    blurDataUrl: row.blurDataUrl,
    isPlaceholder: row.isPlaceholder,
  };
}

/** Prisma `select` for a media relation. */
export const mediaSelect = {
  select: { key: true, alt: true, width: true, height: true, blurDataUrl: true, isPlaceholder: true },
} as const;
