/**
 * Applies the ARCHIVED status from content/ to the current DB without reseeding anything else, then refreshes the
 * cached pages. Archived = deliberately retired (never shown, not even with PREVIEW_DRAFTS=true).
 * Currently: the legacy service-card grid on the /in/ and /uk/ homepages (replaced by the pillars explorer).
 * Usage: npx tsx scripts/sync-archived.ts [baseUrl]
 */
import { PrismaClient } from "@prisma/client";
import { homes } from "../content/home";

try {
  process.loadEnvFile(".env");
} catch {}
const prisma = new PrismaClient();
const base = process.argv[2] ?? "http://localhost:3000";

(async () => {
  for (const h of homes) {
    const archived = (h.serviceCards ?? []).filter((c) => c.status === "ARCHIVED").map((c) => c.title);
    if (!archived.length) continue;
    const r = await prisma.homeServiceCard.updateMany({
      where: { home: { region: h.region }, title: { in: archived } },
      data: { status: "ARCHIVED", publishedAt: null },
    });
    console.log(`${h.region} home service cards archived: ${r.count} (${archived.join(", ")})`);
  }
  await prisma.$disconnect();
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret) return console.log("REVALIDATE_SECRET not set: restart the app or wait for the cache to expire.");
  const res = await fetch(`${base}/api/revalidate`, {
    method: "POST",
    headers: { "content-type": "application/json", "x-revalidate-secret": secret },
    body: JSON.stringify({ tags: ["home"] }),
  }).catch((e) => e as Error);
  console.log("revalidate home:", res instanceof Error ? `failed (${res.message})` : `${res.status} ${await res.text()}`);
})().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
