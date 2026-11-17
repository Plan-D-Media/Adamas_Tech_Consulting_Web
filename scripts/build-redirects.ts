/** Recompile lib/generated/redirects.json and lib/generated/unpublished.json from the database.
 *  Run after editing redirects, or after publishing or hiding a case study, event or service.
 *  The build does this by itself (scripts/prebuild.ts); this is for working on the local database. */
import { prisma, writeRedirects, writeUnpublished, writeUnpublishedPages } from "../prisma/seed";

writeRedirects()
  .then(writeUnpublished)
  .then(writeUnpublishedPages)
  .finally(() => prisma.$disconnect());
