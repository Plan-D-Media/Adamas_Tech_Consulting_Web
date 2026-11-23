#!/usr/bin/env node
/**
 * Print every TEXT node of a saved Figma frame in reading order (top to bottom, then left to right),
 * with its y position and font size, so a frame's copy can be read without opening Figma.
 *
 *   node scripts/qa/figma-text.mjs node-7669-44187
 *   node scripts/qa/figma-text.mjs node-7669-44187 1200 2400
 */
import { readFileSync } from "node:fs";

const [name, from, to] = process.argv.slice(2);
const raw = JSON.parse(readFileSync(`design-ref/figma/full/${name}.json`, "utf8"));
const root = raw.document ?? raw.nodes[Object.keys(raw.nodes)[0]].document;
const ox = root.absoluteBoundingBox.x;
const oy = root.absoluteBoundingBox.y;

const out = [];
(function walk(n) {
  if (n.type === "TEXT" && typeof n.characters === "string") {
    const b = n.absoluteBoundingBox ?? { x: ox, y: oy };
    out.push({
      y: Math.round(b.y - oy),
      x: Math.round(b.x - ox),
      size: Math.round(n.style?.fontSize ?? 0),
      weight: n.style?.fontWeight ?? "",
      text: n.characters.replace(/\s+/g, " ").trim(),
    });
  }
  for (const c of n.children ?? []) walk(c);
})(root);

out.sort((a, b) => a.y - b.y || a.x - b.x);
const lo = from === undefined ? -Infinity : Number(from);
const hi = to === undefined ? Infinity : Number(to);
for (const t of out) {
  if (t.y < lo || t.y > hi) continue;
  console.log(`${String(t.y).padStart(5)} ${String(t.x).padStart(5)} ${String(t.size).padStart(3)}/${String(t.weight).padEnd(3)} ${t.text}`);
}
console.log(`\n${out.length} text nodes in ${root.name} (${Math.round(root.absoluteBoundingBox.width)}x${Math.round(root.absoluteBoundingBox.height)})`);
