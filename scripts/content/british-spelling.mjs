/**
 * Converts the general copy in content/*.ts from American to British spelling (decision 3, 17 Nov 2026).
 *
 * Only display text is touched: lines that hold slugs, hrefs, paths, keys, media keys, icons, editor notes or
 * comments are skipped, and so are the client's service and product names that are written in American spelling
 * ("Migration & Modernization", "Google Developers Agency Program"), which stay exactly as the client wrote them
 * and are listed in CONTENT_TODO.md. Words with a different British meaning (license/licence, program/programme)
 * are left alone. Every change is written to docs/qa/evidence/phase2/spelling-changes.md for review.
 *
 * Usage: node scripts/content/british-spelling.mjs [--dry]
 */
import fs from "node:fs";
import path from "node:path";

const dry = process.argv.includes("--dry");
const dir = path.resolve("content");
const FILES = fs.readdirSync(dir).filter((f) => f.endsWith(".ts") && !["redirects.ts", "media.ts", "types.ts", "index.ts"].includes(f));

/** Names kept exactly as the client wrote them (also recorded in CONTENT_TODO.md). */
const KEEP_NAMES = ["Migration & Modernization", "Google Developers Agency Program"];

/** Lines whose value is an identifier, URL, path or internal note, not copy. */
const SKIP_LINE = /^\s*(?:slug|href|path|legacyPath|key|ctaHref|secondaryHref|externalUrl|image|poster|logo|badge|photo|ogImage|icon|id|metricStat|certificateFile|video|parent|featuredCaseStudy|featuredEvent|featuredOffice|navLabel|kind|template|menu|region|regions|placements|hreflang|locale|phoneHref|email|code)\s*:/;
const SKIP_COMMENT = /^\s*(?:\/\/|\/\*|\*)/;

/** [pattern, British stem]. The suffix group keeps -e/-ed/-es/-ing/-ation/-ations/-ational/-able/-er; case follows the match. */
const IZE = [
  ["organiz", "organis"],
  ["moderniz", "modernis"],
  ["optimiz", "optimis"],
  ["utiliz", "utilis"],
  ["minimiz", "minimis"],
  ["maximiz", "maximis"],
  ["visualiz", "visualis"],
  ["specializ", "specialis"],
  ["personaliz", "personalis"],
  ["customiz", "customis"],
  ["authoriz", "authoris"],
  ["unauthoriz", "unauthoris"],
  ["standardiz", "standardis"],
  ["recogniz", "recognis"],
  ["prioritiz", "prioritis"],
  ["characteriz", "characteris"],
  ["anonymiz", "anonymis"],
  ["realiz", "realis"],
  ["digitiz", "digitis"],
  ["summariz", "summaris"],
  ["monetiz", "monetis"],
  ["capitaliz", "capitalis"],
  ["virtualiz", "virtualis"],
  ["containeriz", "containeris"],
  ["localiz", "localis"],
  ["synchroniz", "synchronis"],
  ["centraliz", "centralis"],
  ["industrializ", "industrialis"],
  ["analyz", "analys"],
];

const RULES = [
  ...IZE.map(([us, uk]) => [new RegExp(`\\b${us}(e|ed|es|ing|ation|ations|ational|able|er|ers)\\b`, "gi"), uk]),
  [/\bbehavior(s|al|ally)?\b/gi, "behaviour"],
  [/\blabor\b/gi, "labour"],
  [/\bmodeling\b/gi, "modelling"],
  [/\bmodeled\b/gi, "modelled"],
  [/\benrollment(s)?\b/gi, "enrolment"],
  [/\bcenter(s|ed)?\b/gi, "centre"],
  [/\bcolor(s|ed)?\b/gi, "colour"],
  [/\bfavorite(s)?\b/gi, "favourite"],
  [/\bfulfillment\b/gi, "fulfilment"],
  [/\bcatalog(s)?\b/gi, "catalogue"],
];

/** Keeps the capitalisation of the matched word (Optimize -> Optimise, OPTIMIZE -> OPTIMISE). */
function recase(original, replacement) {
  if (original === original.toUpperCase() && /[A-Z]/.test(original)) return replacement.toUpperCase();
  if (original[0] === original[0].toUpperCase()) return replacement[0].toUpperCase() + replacement.slice(1);
  return replacement;
}

function convert(line) {
  let out = line;
  for (const [re, stem] of RULES) {
    out = out.replace(re, (m, suffix) => {
      let r = stem;
      if (suffix) {
        // "centre" + "ed" -> "centred", "catalogue" + "s" -> "catalogues", "behaviour" + "al" -> "behavioural".
        r = stem.endsWith("e") && /^e/.test(suffix) ? stem.slice(0, -1) + suffix : stem + suffix;
      }
      return recase(m, r);
    });
  }
  return out;
}

const changes = [];
for (const f of FILES) {
  const file = path.join(dir, f);
  const raw = fs.readFileSync(file, "utf8");
  const nl = raw.includes("\r\n") ? "\r\n" : "\n";
  const lines = raw.split(/\r?\n/);
  /** Inside an editorNote whose value continues on later lines (or starts on the next line): { quote } until it closes. */
  let note = null;
  const closes = (text, q) => {
    const t = text.trimEnd();
    return t.length > 1 && (t.endsWith(q + ",") || t.endsWith(q));
  };
  const next = lines.map((line, i) => {
    if (note) {
      if (note.quote === null) note.quote = line.trim()[0] ?? '"';
      if (closes(line, note.quote)) note = null;
      return line;
    }
    if (/^\s*editorNote\s*:/.test(line)) {
      const rest = line.replace(/^\s*editorNote\s*:\s*/, "");
      if (rest === "") note = { quote: null };
      else if (!closes(rest, rest[0])) note = { quote: rest[0] };
      return line;
    }
    if (SKIP_LINE.test(line) || SKIP_COMMENT.test(line)) return line;
    if (KEEP_NAMES.some((n) => line.includes(n))) {
      // A kept name on a copy line: convert the rest of the line, keep the name.
      let guarded = line;
      KEEP_NAMES.forEach((n, k) => (guarded = guarded.split(n).join(`\u0000${k}\u0000`)));
      let conv = convert(guarded);
      KEEP_NAMES.forEach((n, k) => (conv = conv.split(`\u0000${k}\u0000`).join(n)));
      if (conv !== line) changes.push({ file: f, line: i + 1, before: line.trim(), after: conv.trim() });
      return conv;
    }
    const conv = convert(line);
    if (conv !== line) changes.push({ file: f, line: i + 1, before: line.trim(), after: conv.trim() });
    return conv;
  });
  if (!dry && changes.some((c) => c.file === f)) fs.writeFileSync(file, next.join(nl));
}

const report = [
  `# British spelling conversion (${new Date().toISOString().slice(0, 10)})${dry ? " (dry run)" : ""}`,
  "",
  `${changes.length} lines changed in ${new Set(changes.map((c) => c.file)).size} files. Service and product names kept as written: ${KEEP_NAMES.map((n) => `"${n}"`).join(", ")}.`,
  "",
  ...changes.map((c) => `- \`${c.file}:${c.line}\`\n  - before: ${c.before.slice(0, 220)}\n  - after: ${c.after.slice(0, 220)}`),
  "",
];
fs.mkdirSync("docs/qa/evidence/phase2", { recursive: true });
fs.writeFileSync("docs/qa/evidence/phase2/spelling-changes.md", report.join("\n"));
console.log(`${changes.length} lines changed in ${new Set(changes.map((c) => c.file)).size} files${dry ? " (dry run, nothing written)" : ""}`);
for (const c of changes) console.log(`${c.file}:${c.line}: ${c.before.slice(0, 100)}`);
