/**
 * Adds the Cloud Services page (Figma 292:24608) image fills to scripts/assets.manifest.json, reading each node's
 * crop (STRETCH image transform) from design-ref/figma/cloud-services.json, then prints the entries added.
 * Run once, then `node scripts/process-assets.mjs --only <id>` (or no filter) to generate the files.
 * Usage: node scripts/cloud-assets.mjs
 */
import fs from "node:fs";

const doc = JSON.parse(fs.readFileSync("design-ref/figma/cloud-services.json", "utf8"));
const root = doc.nodes[Object.keys(doc.nodes)[0]].document;
const byId = new Map();
(function walk(n) {
  byId.set(n.id, n);
  for (const c of n.children ?? []) walk(c);
})(root);

const fillPath = (ref) => (fs.existsSync(`design-ref/fills/${ref}.png`) ? `design-ref/fills/${ref}.png` : `design-ref/fills/${ref}.jpg`);

/** Manifest entry for a node's image fill: STRETCH transforms become crop fractions; FILL becomes a cover resize. */
function entry(id, nodeId, out, width, height, extra = {}) {
  const n = byId.get(nodeId);
  if (!n) throw new Error(`node ${nodeId} not found`);
  const f = (n.fills ?? []).find((x) => x.type === "IMAGE");
  if (!f) throw new Error(`node ${nodeId} has no image fill`);
  const e = { id, kind: "raster", src: fillPath(f.imageRef), out, width, height, ...extra };
  if (f.scaleMode === "STRETCH" && f.imageTransform) {
    const [[a, , tx], [, d, ty]] = f.imageTransform;
    e.crop = [tx, ty, a, d].map((v) => Math.round(v * 1e6) / 1e6);
    e.fit = "fill";
  }
  return e;
}

const entries = [
  entry("svc-cloud-hero", "292:24613", "images/services/cloud/hero", 1920, 530, { scales: [1], avifQuality: 50, webpQuality: 72, blur: true, enlarge: true }),
  entry("svc-cloud-intro", "292:24669", "images/services/cloud/intro", 660, 536),
  entry("svc-stat-gear-1", "298:28081", "images/services/stat-gear-1", 174, 116),
  entry("svc-stat-gear-2", "298:28082", "images/services/stat-gear-2", 174, 116),
  entry("svc-stat-gear-3", "298:28083", "images/services/stat-gear-3", 174, 116),
  entry("svc-stat-gear-4", "298:28084", "images/services/stat-gear-4", 174, 116),
  entry("svc-expertise-icon-1", "298:28151", "images/services/expertise-icon-1", 81, 73),
  entry("svc-expertise-icon-2", "298:28148", "images/services/expertise-icon-2", 85, 77),
  entry("svc-expertise-icon-3", "298:28149", "images/services/expertise-icon-3", 81, 73),
  entry("svc-expertise-icon-4", "298:28150", "images/services/expertise-icon-4", 81, 73),
  entry("svc-platform-icon-1", "298:28231", "images/services/platform-icon-1", 27, 16, { scales: [2, 3] }),
  entry("svc-platform-icon-2", "298:28233", "images/services/platform-icon-2", 27, 19, { scales: [2, 3] }),
  entry("svc-platform-icon-3", "298:28235", "images/services/platform-icon-3", 27, 19, { scales: [2, 3] }),
  entry("svc-platform-icon-4", "298:28241", "images/services/platform-icon-4", 27, 21, { scales: [2, 3] }),
  entry("svc-industry-retail", "298:28256", "images/services/industry-retail", 489, 644),
  entry("svc-industry-bfsi", "298:28267", "images/services/industry-bfsi", 755, 310),
  entry("svc-industry-manufacturing", "298:28278", "images/services/industry-manufacturing", 339, 310),
  entry("svc-industry-healthcare", "298:28289", "images/services/industry-healthcare", 395, 310),
  entry("svc-quality-badge-1", "299:28708", "images/services/quality-badge-1", 40, 40, { scales: [2, 3] }),
  entry("svc-quality-badge-2", "299:28710", "images/services/quality-badge-2", 40, 40, { scales: [2, 3] }),
  entry("svc-quality-badge-3", "299:28712", "images/services/quality-badge-3", 40, 40, { scales: [2, 3] }),
];

const manifest = JSON.parse(fs.readFileSync("scripts/assets.manifest.json", "utf8"));
const have = new Set(manifest.assets.map((a) => a.id));
let added = 0;
for (const e of entries) {
  if (have.has(e.id)) continue;
  manifest.assets.push(e);
  added++;
}
fs.writeFileSync("scripts/assets.manifest.json", JSON.stringify(manifest, null, 2) + "\n");
console.log(`added ${added} entries:`, entries.map((e) => `${e.id}${e.crop ? " (crop)" : ""}`).join(", "));
