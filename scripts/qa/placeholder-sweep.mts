/**
 * BUG-014 sweep: every PUBLISHED row of every content table is scanned for placeholder text and unverified figures.
 * String columns and the string values inside JSON columns are checked; `editorNote` (internal, never rendered) is
 * skipped. Each hit names the model, the row (slug / key / path / name / id) and the field, so the row can be moved
 * to DRAFT in content/*.ts and logged in CONTENT_TODO.md.
 *
 * Usage: npx tsx scripts/qa/placeholder-sweep.mts <label>     (reads DATABASE_URL from .env)
 * Output: docs/qa/evidence/phase2/placeholder-sweep-<label>.md
 */
import { Prisma, PrismaClient } from "@prisma/client";
import fs from "node:fs";
import path from "node:path";

const label = process.argv[2] ?? "before";
const out = path.join("docs", "qa", "evidence", "phase2", `placeholder-sweep-${label}.md`);
const db = new PrismaClient();

const PATTERNS: { name: string; re: RegExp }[] = [
  { name: "to be confirmed", re: /to be confirmed/i },
  { name: "TBC", re: /\bTBC\b/ },
  { name: "TBD", re: /\bTBD\b/ },
  { name: "Lorem", re: /lorem/i },
  { name: "[", re: /\[/ },
  { name: "100% Satisfied", re: /100%\s*Satisfied/i },
  { name: "Zero Risk", re: /Zero Risk/i },
  { name: "30%", re: /(^|[^\w.])30%/ },
  { name: "500+", re: /500\+/ },
];

const SKIP_FIELDS = new Set(["editorNote", "id", "createdAt", "updatedAt", "publishedAt"]);

interface Hit {
  model: string;
  row: string;
  field: string;
  pattern: string;
  excerpt: string;
}

function* strings(value: unknown, field: string): Generator<[string, string]> {
  if (typeof value === "string") yield [field, value];
  else if (Array.isArray(value)) for (const [i, v] of value.entries()) yield* strings(v, `${field}[${i}]`);
  else if (value && typeof value === "object") for (const [k, v] of Object.entries(value)) yield* strings(v, `${field}.${k}`);
}

const rowName = (r: Record<string, unknown>) =>
  String(r.slug ?? r.key ?? r.path ?? r.name ?? r.title ?? r.label ?? r.question ?? r.text ?? r.id);

const hits: Hit[] = [];
const counts: Record<string, number> = {};
const models = Prisma.dmmf.datamodel.models.filter((m) => m.fields.some((f) => f.name === "status" && f.type === "Status"));
for (const m of models) {
  const delegate = (db as unknown as Record<string, { findMany: (a: unknown) => Promise<Record<string, unknown>[]> }>)[m.name[0].toLowerCase() + m.name.slice(1)];
  const rows = await delegate.findMany({ where: { status: "PUBLISHED" } });
  counts[m.name] = rows.length;
  for (const r of rows) {
    for (const f of m.fields) {
      if (SKIP_FIELDS.has(f.name) || (f.type !== "String" && f.type !== "Json")) continue;
      for (const [field, s] of strings(r[f.name], f.name)) {
        for (const p of PATTERNS) {
          const mm = p.re.exec(s);
          if (!mm) continue;
          const at = Math.max(0, mm.index - 40);
          hits.push({ model: m.name, row: rowName(r), field, pattern: p.name, excerpt: s.slice(at, mm.index + 60).replace(/\s+/g, " ") });
        }
      }
    }
  }
}
await db.$disconnect();

const lines = [
  `# BUG-014 placeholder sweep (${label}) ${new Date().toISOString()}`,
  "",
  `Scanned ${models.length} content tables, ${Object.values(counts).reduce((a, b) => a + b, 0)} PUBLISHED rows: ${Object.entries(counts).map(([k, v]) => `${k} ${v}`).join(", ")}.`,
  "",
  `Patterns: ${PATTERNS.map((p) => `\`${p.name}\``).join(", ")}. \`editorNote\` (internal) is not scanned.`,
  "",
  `## ${hits.length} hits`,
  "",
  "| Model | Row | Field | Pattern | Excerpt |",
  "|---|---|---|---|---|",
  ...hits.map((h) => `| ${h.model} | ${h.row} | ${h.field} | ${h.pattern} | ${h.excerpt.replace(/\|/g, "\\|")} |`),
  "",
];
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, lines.join("\n"));
console.log(lines.slice(0, 4).join("\n"));
for (const h of hits) console.log(`${h.model} ${h.row} ${h.field} [${h.pattern}] ${h.excerpt.slice(0, 80)}`);
console.log(`${hits.length} hits -> ${out}`);
