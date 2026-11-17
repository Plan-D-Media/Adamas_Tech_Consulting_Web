/**
 * Build-time compilation of the two files proxy.ts reads (lib/generated/*.json), run by the `prebuild` npm
 * lifecycle, i.e. automatically before `npm run build` - which is what Vercel runs.
 *
 * Why it exists: the seed writes those files, and Vercel never runs the seed. Without this step a deploy would ship
 * whatever snapshot happened to be committed, so a case study published in Neon would still be redirected to its
 * listing until someone remembered to re-run the seed and commit the result (QA BUG-039).
 *
 * The build fails loudly when the database cannot be reached. Shipping a build with a stale or missing redirect map
 * is worse than not shipping: visitors and crawlers would be sent to the wrong page, and the fix is a redeploy.
 */
import { PrismaClient } from "@prisma/client";
import { writeRedirectsFile, writeUnpublishedFile, writeUnpublishedPagesFile } from "./generated-files";

const label = process.env.VERCEL ? `Vercel (${process.env.VERCEL_ENV ?? "unknown"} environment)` : "local";

function fail(message: string, detail?: unknown): never {
  console.error("");
  console.error("============================================================");
  console.error("  prebuild FAILED: the redirect maps could not be compiled.");
  console.error(`  ${message}`);
  if (detail) console.error(`  ${detail instanceof Error ? detail.message : String(detail)}`);
  console.error("");
  console.error("  proxy.ts serves lib/generated/redirects.json and");
  console.error("  lib/generated/unpublished.json on every request, so a build");
  console.error("  without them would send visitors to the wrong pages.");
  console.error("");
  console.error("  Check DATABASE_URL (and DIRECT_URL) for this environment and");
  console.error("  that the database accepts connections from the build.");
  console.error("============================================================");
  console.error("");
  process.exit(1);
}

async function main() {
  console.log(`prebuild: compiling the proxy's redirect maps (${label})`);
  if (!process.env.DATABASE_URL) fail("DATABASE_URL is not set for this environment.");

  const prisma = new PrismaClient();
  try {
    // Fail on the connection itself rather than inside the first query, so the message is unambiguous.
    await prisma.$queryRaw`SELECT 1`;
  } catch (err) {
    await prisma.$disconnect().catch(() => {});
    fail("The database did not answer.", err);
  }

  try {
    const redirects = await writeRedirectsFile(prisma);
    const unpublished = await writeUnpublishedFile(prisma);
    const hiddenPages = await writeUnpublishedPagesFile(prisma);
    console.log(`prebuild: ${redirects} redirects, ${unpublished} unpublished fallbacks and ${hiddenPages} unpublished page(s) compiled.`);
  } catch (err) {
    fail("The database answered but the maps could not be written.", err);
  } finally {
    await prisma.$disconnect().catch(() => {});
  }
}

void main();
