import { cx } from "@/lib/cx";

/**
 * Renderer for the prose format the migrated legal documents are stored in (content/pages.ts, `LegalPart.text`):
 * a blank line starts a new block, a line beginning "- " is a list item (consecutive items become one <ul>), and a
 * line beginning "### " is a sub-heading. Everything else is a paragraph; consecutive lines join with a space.
 *
 * Text is rendered as React children, so it is escaped by React: no dangerouslySetInnerHTML, and no inline markup
 * (the live documents' inline links are listed under each section instead, see LegalDocument).
 */

type ProseNode = { kind: "heading"; text: string } | { kind: "paragraph"; text: string } | { kind: "list"; items: string[] };

export function parseProse(text: string): ProseNode[] {
  const nodes: ProseNode[] = [];
  let para: string[] = [];
  let items: string[] = [];
  const endPara = () => {
    if (para.length > 0) nodes.push({ kind: "paragraph", text: para.join(" ") });
    para = [];
  };
  const endList = () => {
    if (items.length > 0) nodes.push({ kind: "list", items });
    items = [];
  };

  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (line === "") {
      endPara();
      endList();
      continue;
    }
    if (line.startsWith("### ")) {
      endPara();
      endList();
      const heading = line.slice(4).trim();
      if (heading) nodes.push({ kind: "heading", text: heading });
      continue;
    }
    if (line.startsWith("- ")) {
      endPara();
      const item = line.slice(2).trim();
      if (item) items.push(item);
      continue;
    }
    endList();
    para.push(line);
  }
  endPara();
  endList();
  return nodes;
}

/**
 * `level` is the heading level for "### " sub-headings, so the document never skips a level: 3 inside a section
 * (under its h2), 2 for the document intro (which sits directly under the h1). The visual size is the same either
 * way, and always smaller than a section heading.
 */
export function Prose({ text, level = 3, className }: { text: string; level?: 2 | 3; className?: string }) {
  const nodes = parseProse(text);
  if (nodes.length === 0) return null;
  const Heading = level === 2 ? "h2" : "h3";

  return (
    <div className={cx("font-body text-body leading-[1.75] text-grey-600", className)}>
      {nodes.map((node, i) => {
        if (node.kind === "heading") {
          return (
            <Heading
              key={i}
              className="mt-8 font-heading text-[clamp(1.0625rem,1rem+0.3vw,1.25rem)] font-bold leading-[1.35] text-navy-800 first:mt-0"
            >
              {node.text}
            </Heading>
          );
        }
        if (node.kind === "list") {
          return (
            <ul key={i} className="mt-4 list-disc space-y-2 pl-5 first:mt-0" role="list">
              {node.items.map((item, j) => (
                <li key={j} className="pl-1">
                  {item}
                </li>
              ))}
            </ul>
          );
        }
        return (
          <p key={i} className="mt-4 first:mt-0">
            {node.text}
          </p>
        );
      })}
    </div>
  );
}
