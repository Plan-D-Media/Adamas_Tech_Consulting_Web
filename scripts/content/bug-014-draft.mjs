/**
 * BUG-014 sweep (decision 4, 17 Nov 2026): PUBLISHED seed rows whose copy is a placeholder or an unverified figure are
 * moved to DRAFT in content/*.ts, each with a comment naming the reason, so the public build (PREVIEW_DRAFTS=false)
 * carries none of them. The rows are found by their slug / key / label line; the first `status: "PUBLISHED"` line
 * after it (within the same object) is flipped. Rerunnable: rows already DRAFT are reported as such.
 *
 * Usage: node scripts/content/bug-014-draft.mjs
 */
import fs from "node:fs";
import path from "node:path";

const NOTE = "DRAFT: BUG-014 sweep, 17 Nov 2026";

/** [file, line that identifies the row, reason]. */
const TARGETS = [
  ["home.ts", 'headline: "How SAP Treasury improved cash forecasting by 30%"', "unverified 30% figure (Q5.5); the card links to a DRAFT case study"],
  ["navigation.ts", 'label: "AI/ML Ops",', "placeholder descriptor; the service page itself is DRAFT (placeholder copy)"],
  ["navigation.ts", 'label: "Data Engineering",', "placeholder descriptor; the service page itself is DRAFT (placeholder copy)"],
  ["navigation.ts", 'label: "Advanced Analytics",', "placeholder descriptor; the service page itself is DRAFT (placeholder copy)"],
  ["navigation.ts", 'label: "Sovereign AI",', "placeholder descriptor; the service page itself is DRAFT (placeholder copy)"],
  ["navigation.ts", 'label: "Responsible AI",', "placeholder descriptor; the service page itself is DRAFT (placeholder copy)"],
  ["navigation.ts", 'label: "AI Security & Governance",', "placeholder descriptor; the service page itself is DRAFT (placeholder copy)"],
  ["navigation.ts", 'key: "solutions.a-eye",', "placeholder descriptor; the product page is DRAFT (placeholder tagline and overview)"],
  ["navigation.ts", 'key: "solutions.air-mind",', "placeholder descriptor; the product page is DRAFT (placeholder tagline and overview)"],
  ["navigation.ts", 'key: "solutions.asset-tracking",', "unverified 30% figure in the descriptor; the product page is DRAFT"],
  ["services.ts", 'slug: "ai-ml-ops",', "placeholder descriptor and summary (Q5.2)"],
  ["services.ts", 'slug: "computer-vision",', "placeholder summary (Q5.2)"],
  ["services.ts", 'slug: "data-engineering",', "placeholder descriptor and summary (Q5.2)"],
  ["services.ts", 'slug: "advanced-analytics",', "placeholder descriptor and summary (Q5.2)"],
  ["services.ts", 'slug: "sovereign-ai",', "placeholder descriptor and summary (Q5.2)"],
  ["services.ts", 'slug: "responsible-ai",', "placeholder descriptor and summary (Q5.2)"],
  ["services.ts", 'slug: "ai-security-governance",', "placeholder descriptor and summary (Q5.2)"],
  ["solutions.ts", 'slug: "arivoo",', "placeholder summary (Q7.1)"],
  ["solutions.ts", 'slug: "a-eye",', "placeholder tagline and summary (Q7.1)"],
  ["solutions.ts", 'slug: "air-mind",', "placeholder tagline and summary (Q7.1)"],
  ["solutions.ts", 'slug: "asset-tracking",', 'unverified "Boosting Cash Forecasting by 30%" tagline (Q5.5)'],
];

const results = [];
for (const [file, needle, reason] of TARGETS) {
  const p = path.join("content", file);
  const raw = fs.readFileSync(p, "utf8");
  const nl = raw.includes("\r\n") ? "\r\n" : "\n";
  const lines = raw.split(/\r?\n/);
  const at = lines.findIndex((l) => l.includes(needle));
  if (at < 0) {
    results.push(`MISSING ${file}: ${needle}`);
    continue;
  }
  // Scan the row's own object only: brace depth from the identifier line, stopping at the brace that closes the row.
  const braces = (l) => {
    let d = 0;
    let q = null;
    for (let c = 0; c < l.length; c++) {
      const ch = l[c];
      if (q) {
        if (ch === "\\") c++;
        else if (ch === q) q = null;
      } else if (ch === '"' || ch === "'" || ch === "`") q = ch;
      else if (ch === "{") d++;
      else if (ch === "}") d--;
    }
    return d;
  };
  let done = false;
  let depth = 0;
  for (let i = at; i < Math.min(lines.length, at + 80); i++) {
    const l = lines[i];
    depth += braces(l);
    if (depth < 0) break; // the row object closed without a status line
    if (/^\s*status:\s*"PUBLISHED"/.test(l) && depth === 0) {
      const indent = l.match(/^\s*/)[0];
      lines.splice(i, 1, `${indent}// ${NOTE}: ${reason}`, l.replace('"PUBLISHED"', '"DRAFT"'));
      results.push(`DRAFT ${file}:${i + 1} ${needle}`);
      done = true;
      break;
    }
    if (/^\s*status:\s*"DRAFT"/.test(l) && depth === 0) {
      results.push(`already DRAFT ${file}:${i + 1} ${needle}`);
      done = true;
      break;
    }
  }
  if (!done) {
    // No status line in the row: add one (seed default is DRAFT anyway, but make it explicit with the reason).
    const indent = lines[at].match(/^\s*/)[0];
    lines.splice(at + 1, 0, `${indent}// ${NOTE}: ${reason}`, `${indent}status: "DRAFT",`);
    results.push(`DRAFT (status added) ${file}:${at + 2} ${needle}`);
  }
  fs.writeFileSync(p, lines.join(nl));
}

// Milestones share one seed object: flip its status.
{
  const p = path.join("content", "milestones.ts");
  const raw = fs.readFileSync(p, "utf8");
  const nl = raw.includes("\r\n") ? "\r\n" : "\n";
  const lines = raw.split(/\r?\n/);
  const i = lines.findIndex((l) => /^\s*status:\s*"PUBLISHED" as const/.test(l));
  if (i >= 0) {
    const indent = lines[i].match(/^\s*/)[0];
    lines.splice(i, 1, `${indent}// ${NOTE}: every milestone is "Milestone title to be confirmed" (CONTENT_TODO: About, journey)`, lines[i].replace('"PUBLISHED"', '"DRAFT"'));
    fs.writeFileSync(p, lines.join(nl));
    results.push(`DRAFT milestones.ts:${i + 1} (all six milestones)`);
  } else results.push("already DRAFT milestones.ts");
}

console.log(results.join("\n"));
