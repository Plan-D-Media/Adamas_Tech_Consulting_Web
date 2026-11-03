import { Fragment } from "react";
import { cx } from "@/lib/cx";
import { copy } from "@/lib/placeholder";

/**
 * Long-form copy stored as plain text in the DB. Blank lines separate blocks; a block whose lines start
 * with "- " is a list; "## " / "### " start sub-headings. Placeholder blocks render as a muted note.
 */
export function Prose({ text, className, tone = "light" }: { text: string | null | undefined; className?: string; tone?: "light" | "dark" }) {
  if (!text) return null;
  const blocks = text.split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean);
  const dark = tone === "dark";
  return (
    <div className={cx("prose-site", dark && "prose-site-dark", className)}>
      {blocks.map((b, i) => {
        const lines = b.split("\n");
        if (lines.every((l) => /^\s*[-•]\s+/.test(l))) {
          return (
            <ul key={i}>
              {lines.map((l, j) => (
                <li key={j}>{l.replace(/^\s*[-•]\s+/, "")}</li>
              ))}
            </ul>
          );
        }
        if (b.startsWith("### ")) return <h3 key={i}>{b.slice(4)}</h3>;
        if (b.startsWith("## ")) return <h2 key={i}>{b.slice(3)}</h2>;
        const c = copy(b);
        return (
          <p key={i} className={c.pending ? "italic opacity-75" : undefined}>
            {lines.length > 1 && !c.pending
              ? lines.map((l, j) => (
                  <Fragment key={j}>
                    {l}
                    {j < lines.length - 1 && <br />}
                  </Fragment>
                ))
              : c.text}
          </p>
        );
      })}
    </div>
  );
}
