/**
 * Cache Components require every `generateStaticParams` to return at least one param, otherwise `next build` aborts
 * (next/dist/docs/01-app/03-api-reference/04-functions/generate-static-params.md, "With Cache Components"). A table
 * whose rows are all DRAFT therefore used to break the public build (QA BUG-001, 16 Nov 2026). When a route has no
 * visible rows, this returns one placeholder param instead; the page's own `notFound()` turns it into a 404, so the
 * route is prerendered, validated and served normally once the content is PUBLISHED.
 */
export const NO_CONTENT_SLUG = "no-published-content";

export function atLeastOne<T extends Record<string, string>>(params: T[], placeholder: T): T[] {
  return params.length > 0 ? params : [placeholder];
}
