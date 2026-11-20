#!/usr/bin/env node
/**
 * Checks whether FIGMA_TOKEN can read a file (and optionally a node) before a round of work starts.
 *
 *   node scripts/figma-access-check.mjs <fileKey> [nodeId]
 *
 * Prints the HTTP status and the file/node name. The token is read from .env.local or .env and never printed.
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

function readToken() {
  for (const f of [".env.local", ".env"]) {
    const p = join(root, f);
    if (!existsSync(p)) continue;
    const m = /^\s*FIGMA_TOKEN\s*=\s*(.+)\s*$/m.exec(readFileSync(p, "utf8"));
    if (m) return m[1].trim().replace(/^["']|["']$/g, "");
  }
  return process.env.FIGMA_TOKEN ?? "";
}

const [fileKey, nodeId] = process.argv.slice(2);
if (!fileKey) {
  console.error("Usage: node scripts/figma-access-check.mjs <fileKey> [nodeId]");
  process.exit(1);
}
const token = readToken();
if (!token) {
  console.error("FIGMA_TOKEN not found in .env.local, .env or the environment.");
  process.exit(1);
}

async function hit(path) {
  const res = await fetch(`https://api.figma.com/v1/${path}`, { headers: { "X-Figma-Token": token } });
  const body = await res.text();
  return { status: res.status, ok: res.ok, body };
}

// Depth 1 keeps the response small: this is an access probe, not a fetch.
const meta = await hit(`files/${fileKey}?depth=1`);
console.log(`GET /v1/files/${fileKey}?depth=1  ->  ${meta.status}`);
if (!meta.ok) {
  console.log(`  ${meta.body.slice(0, 300)}`);
  process.exit(2);
}
const json = JSON.parse(meta.body);
console.log(`  file name: ${json.name}`);
console.log(`  last modified: ${json.lastModified}`);
console.log(`  top-level pages: ${(json.document?.children ?? []).map((c) => `${c.name} (${c.id})`).join(", ")}`);

if (nodeId) {
  const id = nodeId.replace("-", ":");
  const node = await hit(`files/${fileKey}/nodes?ids=${encodeURIComponent(id)}&depth=1`);
  console.log(`GET /v1/files/${fileKey}/nodes?ids=${id}  ->  ${node.status}`);
  if (!node.ok) {
    console.log(`  ${node.body.slice(0, 300)}`);
    process.exit(2);
  }
  const nj = JSON.parse(node.body);
  const doc = nj.nodes?.[id]?.document;
  if (!doc) {
    console.log(`  node ${id} not present in the response (keys: ${Object.keys(nj.nodes ?? {}).join(", ") || "none"})`);
    process.exit(2);
  }
  const b = doc.absoluteBoundingBox ?? {};
  console.log(`  node name: ${doc.name} (${doc.type}) ${Math.round(b.width ?? 0)}x${Math.round(b.height ?? 0)}`);
  console.log(`  children: ${(doc.children ?? []).length}`);
}
console.log("ACCESS OK");
