/** Recompile lib/generated/redirects.json and lib/generated/unpublished.json from the database.
 *  Run after editing redirects, or after publishing or hiding a case study, event or service. */
import { prisma, writeRedirectsFile, writeUnpublishedFile } from "../prisma/seed";

writeRedirectsFile()
  .then(writeUnpublishedFile)
  .finally(() => prisma.$disconnect());
