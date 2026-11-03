import "server-only";
import type { Prisma } from "@prisma/client";
import { badge } from "@/lib/db";
import { mediaSelect, toMedia } from "@/lib/media";
import type { CaseCardData } from "./home";

/** Shared row → card mappers, so every listing renders the same card shape. */

export const caseCardInclude = { image: mediaSelect } as const;
type CaseRow = Prisma.CaseStudyGetPayload<{ include: typeof caseCardInclude }>;

export function toCaseCard(c: CaseRow): CaseCardData {
  return {
    slug: c.slug,
    label: c.label,
    title: c.title,
    headlineMetric: c.headlineMetric,
    metricLabel: c.metricLabel,
    clientDescriptor: c.clientDescriptor,
    summary: c.summary,
    image: toMedia(c.image),
    draft: badge(c.status),
  };
}

export interface TitleBody {
  title: string;
  body?: string;
}

/** JSON columns typed as { title, body? }[] in content/types.ts. */
export function titleBodies(v: Prisma.JsonValue | null | undefined): TitleBody[] {
  if (!Array.isArray(v)) return [];
  return v.flatMap((x) =>
    x && typeof x === "object" && !Array.isArray(x) && typeof (x as { title?: unknown }).title === "string"
      ? [{ title: (x as { title: string }).title, body: typeof (x as { body?: unknown }).body === "string" ? (x as { body: string }).body : undefined }]
      : [],
  );
}

export interface FaqData {
  question: string;
  answer: string;
}

export interface SeoData {
  seoTitle: string | null;
  seoDescription: string | null;
  noindex: boolean;
}
