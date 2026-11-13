-- The Gulf region key changes from AE to GCC (sitemap decision: the homepage moves from /ae/ to /gcc/).
-- RENAME VALUE keeps every existing row, including RegionCode[] arrays (regions, featuredIn), as they are.
ALTER TYPE "RegionCode" RENAME VALUE 'AE' TO 'GCC';

-- The region row's URL segment (the seed also writes it; this keeps a database that is not reseeded consistent).
UPDATE "Region" SET "slug" = 'gcc' WHERE "code" = 'GCC' AND "slug" = 'ae';
