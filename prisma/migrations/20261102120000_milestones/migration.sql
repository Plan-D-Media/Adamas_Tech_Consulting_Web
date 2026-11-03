-- CreateTable
CREATE TABLE "Milestone" (
    "id" TEXT NOT NULL,
    "year" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "imageId" TEXT,
    "status" "Status" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "needsReview" BOOLEAN NOT NULL DEFAULT false,
    "editorNote" TEXT,

    CONSTRAINT "Milestone_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Milestone_status_sortOrder_idx" ON "Milestone"("status", "sortOrder");

-- AddForeignKey
ALTER TABLE "Milestone" ADD CONSTRAINT "Milestone_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "MediaAsset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

