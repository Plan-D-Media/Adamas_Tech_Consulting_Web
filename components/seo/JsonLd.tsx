/**
 * Structured data block. The JSON is serialised with `<`, `>` and `&` escaped as unicode sequences, so a title
 * containing "</script>" can never break out of the element (QA BUG-021).
 */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c").replace(/>/g, "\\u003e").replace(/&/g, "\\u0026");
}

export function JsonLd({ data }: { data: unknown }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }} />;
}
