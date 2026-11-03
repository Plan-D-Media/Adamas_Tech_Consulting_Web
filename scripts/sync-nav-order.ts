/**
 * Copies the top-level HEADER and FOOTER order from content/navigation.ts (the seed source) into the current DB,
 * without reseeding anything else. Children keep their rows and order. Then asks the running app to drop its "nav" cache.
 * Usage: npx tsx scripts/sync-nav-order.ts [appBaseUrl]   (default http://localhost:3000)
 */
import { PrismaClient } from "@prisma/client";
import { navigation } from "../content/navigation";

try {
  process.loadEnvFile(".env");
} catch {}

const base = process.argv[2] ?? "http://localhost:3000";
const prisma = new PrismaClient();

(async () => {
  for (const [menu, items] of [["HEADER", navigation.header], ["FOOTER", navigation.footer]] as const) {
    for (const [i, item] of items.entries()) {
      if (!item.key) throw new Error(`${menu} item "${item.label}" has no key`);
      const order = item.sortOrder ?? i;
      const { count } = await prisma.navItem.updateMany({ where: { menu, parentId: null, key: item.key }, data: { sortOrder: order } });
      console.log(`${menu.padEnd(6)} ${String(order).padStart(2)}  ${item.label.padEnd(14)} ${count ? "updated" : "NOT FOUND"}`);
    }
    const rows = await prisma.navItem.findMany({ where: { menu, parentId: null }, orderBy: { sortOrder: "asc" }, select: { label: true } });
    console.log(`${menu} now: ${rows.map((r) => r.label).join(" · ")}`);
  }
  await prisma.$disconnect();

  const secret = process.env.REVALIDATE_SECRET;
  if (!secret) return console.log("REVALIDATE_SECRET not set: restart the app or wait for the cache to expire.");
  const res = await fetch(`${base}/api/revalidate`, {
    method: "POST",
    headers: { "content-type": "application/json", "x-revalidate-secret": secret },
    body: JSON.stringify({ tags: ["nav"] }),
  }).catch((e) => e as Error);
  console.log("revalidate nav:", res instanceof Error ? `failed (${res.message})` : `${res.status} ${await res.text()}`);
})().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
