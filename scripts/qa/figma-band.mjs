#!/usr/bin/env node
/**
 * Prints the Figma subtree inside a y-band of a saved frame, with geometry, fills, text and image refs.
 *
 *   node scripts/qa/figma-band.mjs node-274-1617 2356 3081          # the band, depth 4
 *   node scripts/qa/figma-band.mjs node-274-1617 2356 3081 6        # deeper
 *   node scripts/qa/figma-band.mjs node-274-1617 --sections         # top-level children, grouped into bands
 *
 * Coordinates are relative to the frame's own top-left, which is what scripts/qa/compare-figma-page.mjs and the
 * renders in design-ref/renders/ use. Handles both saved shapes: the `?ids=` API response ({nodes:{id:{document}}})
 * and the full-depth saves written by scripts/figma-node-full.mjs ({document,...}).
 */
import fs from "node:fs";

const [file, a, b, depthArg] = process.argv.slice(2);
if (!file) {
  console.error("Usage: node scripts/qa/figma-band.mjs <figma-json-name> <yFrom> <yTo> [maxDepth]");
  console.error("       node scripts/qa/figma-band.mjs <figma-json-name> --sections");
  process.exit(1);
}

const raw = JSON.parse(fs.readFileSync(`design-ref/figma/${file}.json`, "utf8"));
const root = raw.document ?? raw.nodes[Object.keys(raw.nodes)[0]].document;
const rb = root.absoluteBoundingBox;
const rx = rb.x;
const ry = rb.y;

const hex = (c) => "#" + [c.r, c.g, c.b].map((v) => Math.round(v * 255).toString(16).padStart(2, "0")).join("").toUpperCase();
const pct = (v) => Math.round((v ?? 1) * 100);

function paint(f) {
  if (f.visible === false) return null;
  if (f.type === "SOLID") return `${hex(f.color)}@${pct(f.opacity)}`;
  if (f.type === "IMAGE") return `IMG(${f.scaleMode},ref=${f.imageRef})`;
  if (f.type?.startsWith("GRADIENT")) return `${f.type.replace("GRADIENT_", "")}[${f.gradientStops.map((s) => `${hex(s.color)}@${pct(s.color.a)}:${Math.round(s.position * 100)}`).join(" ")}]`;
  return f.type;
}

function geo(n) {
  const x = n.absoluteBoundingBox;
  if (!x) return { y: null, h: 0, s: "(no box)" };
  return { y: Math.round(x.y - ry), h: Math.round(x.height), s: `@${Math.round(x.x - rx)},${Math.round(x.y - ry)} ${Math.round(x.width)}x${Math.round(x.height)}` };
}

function describe(n, d) {
  const g = geo(n);
  const parts = [`${"  ".repeat(d)}${n.type} "${n.name}" ${n.id}`, g.s];
  if (n.visible === false) parts.push("HIDDEN");
  if (n.layoutMode) parts.push(`${n.layoutMode} pad ${n.paddingTop ?? 0}/${n.paddingRight ?? 0}/${n.paddingBottom ?? 0}/${n.paddingLeft ?? 0} gap ${n.itemSpacing ?? 0}`);
  const fills = (n.fills ?? []).map(paint).filter(Boolean);
  if (fills.length) parts.push(`fill ${fills.join(",")}`);
  const strokes = (n.strokes ?? []).map(paint).filter(Boolean);
  if (strokes.length) parts.push(`stroke ${strokes.join(",")} w${n.strokeWeight}`);
  if (n.cornerRadius) parts.push(`r${n.cornerRadius}`);
  else if (n.rectangleCornerRadii && new Set(n.rectangleCornerRadii).size > 1) parts.push(`r${n.rectangleCornerRadii.join("/")}`);
  if (n.opacity != null && n.opacity !== 1) parts.push(`opacity ${pct(n.opacity)}`);
  for (const e of n.effects ?? []) if (e.visible !== false) parts.push(`${e.type} blur ${e.radius}`);
  if (n.type === "TEXT" && n.style) {
    const s = n.style;
    parts.push(`TEXT ${s.fontFamily} ${s.fontWeight} ${s.fontSize}/${s.lineHeightPx ? Math.round(s.lineHeightPx * 10) / 10 : "auto"}${s.letterSpacing ? ` ls${Math.round(s.letterSpacing * 100) / 100}` : ""}${s.textCase ? " " + s.textCase : ""}`);
    parts.push(`"${n.characters.replace(/\s+/g, " ")}"`);
  }
  return parts.join(" | ");
}

if (a === "--sections") {
  // Top-level children sorted by y, with a blank line wherever a vertical gap suggests a new section.
  const kids = (root.children ?? [])
    .map((c) => ({ n: c, g: geo(c) }))
    .filter((k) => k.g.y != null)
    .sort((p, q) => p.g.y - q.g.y);
  let prevBottom = null;
  for (const k of kids) {
    const bottom = k.g.y + k.g.h;
    if (prevBottom != null && k.g.y - prevBottom > 40) console.log(`${"".padEnd(4)}---- gap ${k.g.y - prevBottom}px ----`);
    const text = [];
    (function t(n, depth) {
      if (text.length > 3 || depth > 7) return;
      if (n.type === "TEXT" && n.characters) text.push(n.characters.replace(/\s+/g, " ").slice(0, 50));
      for (const c of n.children ?? []) t(c, depth + 1);
    })(k.n, 0);
    console.log(`${String(k.g.y).padStart(6)}..${String(bottom).padEnd(6)} h${String(k.g.h).padStart(5)} ${k.n.type.padEnd(9)} ${String(k.n.name).slice(0, 30).padEnd(31)} ${text.join(" | ")}`);
    prevBottom = Math.max(prevBottom ?? 0, bottom);
  }
  process.exit(0);
}

const from = Number(a);
const to = Number(b);
const maxDepth = Number(depthArg ?? 4);
console.log(`# ${root.name} (${root.id}) band ${from}..${to} of ${Math.round(rb.height)}px, depth ${maxDepth}`);

function walk(n, d) {
  const g = geo(n);
  if (g.y != null) {
    const bottom = g.y + g.h;
    if (bottom < from || g.y > to) return; // outside the band
  }
  console.log(describe(n, d));
  if (d >= maxDepth) return;
  for (const c of n.children ?? []) walk(c, d + 1);
}
for (const c of root.children ?? []) walk(c, 0);
