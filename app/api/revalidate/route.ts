import { revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";

/**
 * On-demand cache invalidation for content edits (seed today, CMS portal in Phase 2).
 * POST /api/revalidate  { "tags": ["home", "nav"] }   header: x-revalidate-secret: <REVALIDATE_SECRET>
 * Omitting tags invalidates every content tag.
 */
const ALL_TAGS = ["home", "nav", "regions", "offices", "blocks", "milestones"];

export async function POST(request: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret || request.headers.get("x-revalidate-secret") !== secret) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const body = (await request.json().catch(() => ({}))) as { tags?: unknown };
  const tags = Array.isArray(body.tags) ? body.tags.filter((t): t is string => typeof t === "string") : ALL_TAGS;
  for (const tag of tags) revalidateTag(tag, "max");
  return NextResponse.json({ ok: true, revalidated: tags });
}
