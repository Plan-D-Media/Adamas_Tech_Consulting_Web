/**
 * Replaces the Milestone rows in the current DB with content/milestones.ts, without reseeding anything else.
 * (A full `npm run db:seed` does the same as part of the seed.) Images are not resolved here: use the seed once
 * milestones carry photos.
 * Usage: npx tsx scripts/sync-milestones.ts
 */
import { PrismaClient } from "@prisma/client";
import { milestones } from "../content/milestones";

const prisma = new PrismaClient();

(async () => {
  if (milestones.some((m) => m.image)) throw new Error("Milestones with images: run the full seed so media keys resolve.");
  const [, ...created] = await prisma.$transaction([
    prisma.milestone.deleteMany(),
    ...milestones.map((m, i) =>
      prisma.milestone.create({
        data: {
          year: m.year,
          title: m.title,
          description: m.description ?? null,
          status: m.status ?? "DRAFT",
          publishedAt: (m.status ?? "DRAFT") === "PUBLISHED" ? new Date() : null,
          sortOrder: m.sortOrder ?? i,
          needsReview: m.needsReview ?? false,
          editorNote: m.editorNote ?? null,
        },
      }),
    ),
  ]);
  console.log(`milestones: ${created.length} rows`);
  await prisma.$disconnect();
})().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
