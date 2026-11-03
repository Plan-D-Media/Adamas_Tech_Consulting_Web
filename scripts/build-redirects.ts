/** Recompile lib/generated/redirects.json from the Redirect table (run after editing redirects in the DB). */
import { prisma, writeRedirectsFile } from "../prisma/seed";

writeRedirectsFile().finally(() => prisma.$disconnect());
