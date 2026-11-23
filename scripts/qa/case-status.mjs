#!/usr/bin/env node
/** Print every case study's publication status from the LOCAL database. */
import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();
const rows = await db.caseStudy.findMany({ select: { slug: true, status: true, publishedAt: true }, orderBy: { sortOrder: "asc" } });
const pub = rows.filter((r) => r.status === "PUBLISHED");
console.log(`total ${rows.length} | PUBLISHED ${pub.length} | DRAFT ${rows.length - pub.length}`);
for (const r of rows) console.log(`  ${r.status.padEnd(9)} ${r.slug}${r.publishedAt ? "  publishedAt=" + r.publishedAt.toISOString().slice(0, 10) : ""}`);
await db.$disconnect();
