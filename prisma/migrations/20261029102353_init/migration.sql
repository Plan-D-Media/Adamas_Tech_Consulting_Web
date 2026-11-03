-- CreateEnum
CREATE TYPE "Status" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "RegionCode" AS ENUM ('IN', 'UK', 'AE');

-- CreateEnum
CREATE TYPE "MediaKind" AS ENUM ('IMAGE', 'VIDEO', 'DOCUMENT');

-- CreateEnum
CREATE TYPE "NavMenu" AS ENUM ('HEADER', 'FOOTER', 'LEGAL', 'SOCIAL');

-- CreateEnum
CREATE TYPE "SolutionKind" AS ENUM ('PRODUCT', 'AI_SOLUTION', 'ARIVOO_MODULE');

-- CreateEnum
CREATE TYPE "LogoKind" AS ENUM ('PARTNER', 'CERTIFICATION', 'CLIENT');

-- CreateEnum
CREATE TYPE "Prominence" AS ENUM ('HIDDEN', 'STANDARD', 'FEATURED');

-- CreateTable
CREATE TABLE "MediaAsset" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "kind" "MediaKind" NOT NULL DEFAULT 'IMAGE',
    "mimeType" TEXT,
    "width" INTEGER,
    "height" INTEGER,
    "alt" TEXT NOT NULL DEFAULT '',
    "blurDataUrl" TEXT,
    "isPlaceholder" BOOLEAN NOT NULL DEFAULT false,
    "sourceUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MediaAsset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Region" (
    "code" "RegionCode" NOT NULL,
    "slug" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "hreflang" TEXT[],
    "phone" TEXT,
    "phoneHref" TEXT,
    "whatsapp" TEXT,
    "email" TEXT,
    "featuredOfficeId" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Region_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "RegionHome" (
    "id" TEXT NOT NULL,
    "region" "RegionCode" NOT NULL,
    "featuredEventId" TEXT,
    "eventProminence" "Prominence" NOT NULL DEFAULT 'STANDARD',
    "showTrustStrip" BOOLEAN NOT NULL DEFAULT true,
    "showWhyUs" BOOLEAN NOT NULL DEFAULT true,
    "promoBanner" JSONB,
    "status" "Status" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "needsReview" BOOLEAN NOT NULL DEFAULT false,
    "editorNote" TEXT,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "ogImageId" TEXT,
    "noindex" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "RegionHome_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HeroSlide" (
    "id" TEXT NOT NULL,
    "homeId" TEXT NOT NULL,
    "navLabel" TEXT NOT NULL,
    "eyebrow" TEXT,
    "headline" TEXT NOT NULL,
    "body" TEXT,
    "ctaLabel" TEXT NOT NULL,
    "ctaHref" TEXT NOT NULL,
    "vimeoId" TEXT,
    "videoId" TEXT,
    "posterId" TEXT,
    "status" "Status" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "needsReview" BOOLEAN NOT NULL DEFAULT false,
    "editorNote" TEXT,

    CONSTRAINT "HeroSlide_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HomeServiceCard" (
    "id" TEXT NOT NULL,
    "homeId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT,
    "href" TEXT,
    "status" "Status" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "needsReview" BOOLEAN NOT NULL DEFAULT false,
    "editorNote" TEXT,

    CONSTRAINT "HomeServiceCard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContentBlock" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "region" "RegionCode",
    "eyebrow" TEXT,
    "heading" TEXT,
    "body" TEXT,
    "ctaLabel" TEXT,
    "ctaHref" TEXT,
    "extra" JSONB,
    "status" "Status" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "needsReview" BOOLEAN NOT NULL DEFAULT false,
    "editorNote" TEXT,

    CONSTRAINT "ContentBlock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NavItem" (
    "id" TEXT NOT NULL,
    "menu" "NavMenu" NOT NULL,
    "parentId" TEXT,
    "key" TEXT,
    "label" TEXT NOT NULL,
    "descriptor" TEXT,
    "href" TEXT,
    "external" BOOLEAN NOT NULL DEFAULT false,
    "comingSoon" BOOLEAN NOT NULL DEFAULT false,
    "featuredCaseStudyId" TEXT,
    "featuredEventId" TEXT,
    "status" "Status" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "needsReview" BOOLEAN NOT NULL DEFAULT false,
    "editorNote" TEXT,

    CONSTRAINT "NavItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServicePillar" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "tagline" TEXT,
    "summary" TEXT,
    "outcomeLine" TEXT,
    "challenge" TEXT,
    "imageId" TEXT,
    "status" "Status" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "needsReview" BOOLEAN NOT NULL DEFAULT false,
    "editorNote" TEXT,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "ogImageId" TEXT,
    "noindex" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ServicePillar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Service" (
    "id" TEXT NOT NULL,
    "pillarId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "descriptor" TEXT,
    "summary" TEXT,
    "whoFor" TEXT,
    "whatWeDo" JSONB,
    "highlights" JSONB,
    "imageId" TEXT,
    "legacyPath" TEXT,
    "status" "Status" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "needsReview" BOOLEAN NOT NULL DEFAULT false,
    "editorNote" TEXT,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "ogImageId" TEXT,
    "noindex" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApproachStep" (
    "id" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT,
    "status" "Status" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "needsReview" BOOLEAN NOT NULL DEFAULT false,
    "editorNote" TEXT,

    CONSTRAINT "ApproachStep_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Technology" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "logoId" TEXT,
    "status" "Status" NOT NULL DEFAULT 'PUBLISHED',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "needsReview" BOOLEAN NOT NULL DEFAULT false,
    "editorNote" TEXT,

    CONSTRAINT "Technology_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Faq" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "pillarId" TEXT,
    "serviceId" TEXT,
    "solutionId" TEXT,
    "pageId" TEXT,
    "status" "Status" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "needsReview" BOOLEAN NOT NULL DEFAULT false,
    "editorNote" TEXT,

    CONSTRAINT "Faq_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Solution" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "kind" "SolutionKind" NOT NULL,
    "name" TEXT NOT NULL,
    "tagline" TEXT,
    "summary" TEXT,
    "body" TEXT,
    "externalUrl" TEXT,
    "parentId" TEXT,
    "imageId" TEXT,
    "status" "Status" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "needsReview" BOOLEAN NOT NULL DEFAULT false,
    "editorNote" TEXT,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "ogImageId" TEXT,
    "noindex" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Solution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SolutionFeature" (
    "id" TEXT NOT NULL,
    "solutionId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT,
    "status" "Status" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "needsReview" BOOLEAN NOT NULL DEFAULT false,
    "editorNote" TEXT,

    CONSTRAINT "SolutionFeature_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SolutionScreenshot" (
    "id" TEXT NOT NULL,
    "solutionId" TEXT NOT NULL,
    "imageId" TEXT NOT NULL,
    "caption" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "SolutionScreenshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Industry" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "tabLabel" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "imageId" TEXT,
    "status" "Status" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "needsReview" BOOLEAN NOT NULL DEFAULT false,
    "editorNote" TEXT,

    CONSTRAINT "Industry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CaseStudy" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT,
    "headlineMetric" TEXT NOT NULL,
    "metricLabel" TEXT,
    "clientDescriptor" TEXT,
    "overview" TEXT,
    "challenge" TEXT,
    "solution" JSONB,
    "quote" TEXT,
    "quoteBy" TEXT,
    "industryId" TEXT,
    "regions" "RegionCode"[],
    "featuredIn" "RegionCode"[],
    "imageId" TEXT,
    "legacyPath" TEXT,
    "status" "Status" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "needsReview" BOOLEAN NOT NULL DEFAULT false,
    "editorNote" TEXT,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "ogImageId" TEXT,
    "noindex" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "CaseStudy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CaseResult" (
    "id" TEXT NOT NULL,
    "caseStudyId" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "CaseResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Stat" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "numeric" DOUBLE PRECISION,
    "prefix" TEXT,
    "suffix" TEXT,
    "label" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "sourceNote" TEXT,
    "placements" TEXT[],
    "regions" "RegionCode"[],
    "status" "Status" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "needsReview" BOOLEAN NOT NULL DEFAULT false,
    "editorNote" TEXT,

    CONSTRAINT "Stat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LogoItem" (
    "id" TEXT NOT NULL,
    "kind" "LogoKind" NOT NULL,
    "name" TEXT NOT NULL,
    "logoId" TEXT NOT NULL,
    "url" TEXT,
    "regions" "RegionCode"[],
    "status" "Status" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "needsReview" BOOLEAN NOT NULL DEFAULT false,
    "editorNote" TEXT,

    CONSTRAINT "LogoItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Certification" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "issuer" TEXT,
    "standard" TEXT,
    "description" TEXT,
    "badgeId" TEXT,
    "certificateFileId" TEXT,
    "certificateNumber" TEXT,
    "validUntil" TIMESTAMP(3),
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "status" "Status" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "needsReview" BOOLEAN NOT NULL DEFAULT false,
    "editorNote" TEXT,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "ogImageId" TEXT,
    "noindex" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Certification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Office" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "region" "RegionCode" NOT NULL,
    "addressLines" TEXT[],
    "phone" TEXT,
    "phoneHref" TEXT,
    "whatsapp" TEXT,
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,
    "confirmed" BOOLEAN NOT NULL DEFAULT false,
    "status" "Status" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "needsReview" BOOLEAN NOT NULL DEFAULT false,
    "editorNote" TEXT,

    CONSTRAINT "Office_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Person" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "bio" TEXT,
    "photoId" TEXT,
    "linkedinUrl" TEXT,
    "showOnTeam" BOOLEAN NOT NULL DEFAULT true,
    "status" "Status" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "needsReview" BOOLEAN NOT NULL DEFAULT false,
    "editorNote" TEXT,

    CONSTRAINT "Person_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "eyebrow" TEXT,
    "summary" TEXT,
    "body" TEXT,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3),
    "timezone" TEXT NOT NULL DEFAULT 'Europe/London',
    "venueName" TEXT,
    "venueAddress" TEXT,
    "imageId" TEXT,
    "registrationOpen" BOOLEAN NOT NULL DEFAULT false,
    "capacity" INTEGER,
    "status" "Status" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "needsReview" BOOLEAN NOT NULL DEFAULT false,
    "editorNote" TEXT,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "ogImageId" TEXT,
    "noindex" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AgendaItem" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT,
    "status" "Status" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "needsReview" BOOLEAN NOT NULL DEFAULT false,
    "editorNote" TEXT,

    CONSTRAINT "AgendaItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventSpeaker" (
    "eventId" TEXT NOT NULL,
    "personId" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "EventSpeaker_pkey" PRIMARY KEY ("eventId","personId")
);

-- CreateTable
CREATE TABLE "Page" (
    "id" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "template" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "eyebrow" TEXT,
    "intro" TEXT,
    "blocks" JSONB,
    "imageId" TEXT,
    "status" "Status" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "needsReview" BOOLEAN NOT NULL DEFAULT false,
    "editorNote" TEXT,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "ogImageId" TEXT,
    "noindex" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Page_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Redirect" (
    "id" TEXT NOT NULL,
    "fromPath" TEXT NOT NULL,
    "toPath" TEXT NOT NULL,
    "statusCode" INTEGER NOT NULL DEFAULT 301,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "decisionRef" TEXT,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Redirect_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactSubmission" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "country" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "region" "RegionCode",
    "sourcePath" TEXT,
    "serviceContext" TEXT,
    "ipHash" TEXT,
    "userAgent" TEXT,
    "mailedAt" TIMESTAMP(3),

    CONSTRAINT "ContactSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventRegistration" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "eventId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "company" TEXT,
    "jobTitle" TEXT,
    "phone" TEXT,
    "notes" TEXT,
    "consent" BOOLEAN NOT NULL DEFAULT false,
    "ipHash" TEXT,
    "mailedAt" TIMESTAMP(3),

    CONSTRAINT "EventRegistration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NewsletterSubscriber" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email" TEXT NOT NULL,
    "region" "RegionCode",
    "consent" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "NewsletterSubscriber_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RateLimitHit" (
    "key" TEXT NOT NULL,
    "windowStart" TIMESTAMP(3) NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "RateLimitHit_pkey" PRIMARY KEY ("key","windowStart")
);

-- CreateTable
CREATE TABLE "_ServiceToTechnology" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ServiceToTechnology_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_SolutionToTechnology" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_SolutionToTechnology_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_CaseStudyToService" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CaseStudyToService_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_CaseStudyToServicePillar" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CaseStudyToServicePillar_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_CaseStudyToSolution" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CaseStudyToSolution_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_CaseStudyToTechnology" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CaseStudyToTechnology_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "MediaAsset_key_key" ON "MediaAsset"("key");

-- CreateIndex
CREATE UNIQUE INDEX "Region_slug_key" ON "Region"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "RegionHome_region_key" ON "RegionHome"("region");

-- CreateIndex
CREATE UNIQUE INDEX "ContentBlock_key_region_key" ON "ContentBlock"("key", "region");

-- CreateIndex
CREATE UNIQUE INDEX "NavItem_key_key" ON "NavItem"("key");

-- CreateIndex
CREATE UNIQUE INDEX "ServicePillar_slug_key" ON "ServicePillar"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Service_pillarId_slug_key" ON "Service"("pillarId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "Technology_name_key" ON "Technology"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Solution_slug_key" ON "Solution"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Industry_slug_key" ON "Industry"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "CaseStudy_slug_key" ON "CaseStudy"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Stat_key_key" ON "Stat"("key");

-- CreateIndex
CREATE UNIQUE INDEX "Certification_slug_key" ON "Certification"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Office_slug_key" ON "Office"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Person_slug_key" ON "Person"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Event_slug_key" ON "Event"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Page_path_key" ON "Page"("path");

-- CreateIndex
CREATE UNIQUE INDEX "Redirect_fromPath_key" ON "Redirect"("fromPath");

-- CreateIndex
CREATE UNIQUE INDEX "EventRegistration_eventId_email_key" ON "EventRegistration"("eventId", "email");

-- CreateIndex
CREATE UNIQUE INDEX "NewsletterSubscriber_email_key" ON "NewsletterSubscriber"("email");

-- CreateIndex
CREATE INDEX "_ServiceToTechnology_B_index" ON "_ServiceToTechnology"("B");

-- CreateIndex
CREATE INDEX "_SolutionToTechnology_B_index" ON "_SolutionToTechnology"("B");

-- CreateIndex
CREATE INDEX "_CaseStudyToService_B_index" ON "_CaseStudyToService"("B");

-- CreateIndex
CREATE INDEX "_CaseStudyToServicePillar_B_index" ON "_CaseStudyToServicePillar"("B");

-- CreateIndex
CREATE INDEX "_CaseStudyToSolution_B_index" ON "_CaseStudyToSolution"("B");

-- CreateIndex
CREATE INDEX "_CaseStudyToTechnology_B_index" ON "_CaseStudyToTechnology"("B");

-- AddForeignKey
ALTER TABLE "Region" ADD CONSTRAINT "Region_featuredOfficeId_fkey" FOREIGN KEY ("featuredOfficeId") REFERENCES "Office"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RegionHome" ADD CONSTRAINT "RegionHome_region_fkey" FOREIGN KEY ("region") REFERENCES "Region"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RegionHome" ADD CONSTRAINT "RegionHome_featuredEventId_fkey" FOREIGN KEY ("featuredEventId") REFERENCES "Event"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RegionHome" ADD CONSTRAINT "RegionHome_ogImageId_fkey" FOREIGN KEY ("ogImageId") REFERENCES "MediaAsset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HeroSlide" ADD CONSTRAINT "HeroSlide_homeId_fkey" FOREIGN KEY ("homeId") REFERENCES "RegionHome"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HeroSlide" ADD CONSTRAINT "HeroSlide_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "MediaAsset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HeroSlide" ADD CONSTRAINT "HeroSlide_posterId_fkey" FOREIGN KEY ("posterId") REFERENCES "MediaAsset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HomeServiceCard" ADD CONSTRAINT "HomeServiceCard_homeId_fkey" FOREIGN KEY ("homeId") REFERENCES "RegionHome"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NavItem" ADD CONSTRAINT "NavItem_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "NavItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NavItem" ADD CONSTRAINT "NavItem_featuredCaseStudyId_fkey" FOREIGN KEY ("featuredCaseStudyId") REFERENCES "CaseStudy"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NavItem" ADD CONSTRAINT "NavItem_featuredEventId_fkey" FOREIGN KEY ("featuredEventId") REFERENCES "Event"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServicePillar" ADD CONSTRAINT "ServicePillar_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "MediaAsset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServicePillar" ADD CONSTRAINT "ServicePillar_ogImageId_fkey" FOREIGN KEY ("ogImageId") REFERENCES "MediaAsset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_pillarId_fkey" FOREIGN KEY ("pillarId") REFERENCES "ServicePillar"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "MediaAsset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_ogImageId_fkey" FOREIGN KEY ("ogImageId") REFERENCES "MediaAsset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApproachStep" ADD CONSTRAINT "ApproachStep_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Technology" ADD CONSTRAINT "Technology_logoId_fkey" FOREIGN KEY ("logoId") REFERENCES "MediaAsset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Faq" ADD CONSTRAINT "Faq_pillarId_fkey" FOREIGN KEY ("pillarId") REFERENCES "ServicePillar"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Faq" ADD CONSTRAINT "Faq_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Faq" ADD CONSTRAINT "Faq_solutionId_fkey" FOREIGN KEY ("solutionId") REFERENCES "Solution"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Faq" ADD CONSTRAINT "Faq_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "Page"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Solution" ADD CONSTRAINT "Solution_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Solution"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Solution" ADD CONSTRAINT "Solution_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "MediaAsset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Solution" ADD CONSTRAINT "Solution_ogImageId_fkey" FOREIGN KEY ("ogImageId") REFERENCES "MediaAsset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SolutionFeature" ADD CONSTRAINT "SolutionFeature_solutionId_fkey" FOREIGN KEY ("solutionId") REFERENCES "Solution"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SolutionScreenshot" ADD CONSTRAINT "SolutionScreenshot_solutionId_fkey" FOREIGN KEY ("solutionId") REFERENCES "Solution"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SolutionScreenshot" ADD CONSTRAINT "SolutionScreenshot_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "MediaAsset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Industry" ADD CONSTRAINT "Industry_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "MediaAsset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaseStudy" ADD CONSTRAINT "CaseStudy_industryId_fkey" FOREIGN KEY ("industryId") REFERENCES "Industry"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaseStudy" ADD CONSTRAINT "CaseStudy_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "MediaAsset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaseStudy" ADD CONSTRAINT "CaseStudy_ogImageId_fkey" FOREIGN KEY ("ogImageId") REFERENCES "MediaAsset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaseResult" ADD CONSTRAINT "CaseResult_caseStudyId_fkey" FOREIGN KEY ("caseStudyId") REFERENCES "CaseStudy"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LogoItem" ADD CONSTRAINT "LogoItem_logoId_fkey" FOREIGN KEY ("logoId") REFERENCES "MediaAsset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Certification" ADD CONSTRAINT "Certification_badgeId_fkey" FOREIGN KEY ("badgeId") REFERENCES "MediaAsset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Certification" ADD CONSTRAINT "Certification_certificateFileId_fkey" FOREIGN KEY ("certificateFileId") REFERENCES "MediaAsset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Certification" ADD CONSTRAINT "Certification_ogImageId_fkey" FOREIGN KEY ("ogImageId") REFERENCES "MediaAsset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Office" ADD CONSTRAINT "Office_region_fkey" FOREIGN KEY ("region") REFERENCES "Region"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Person" ADD CONSTRAINT "Person_photoId_fkey" FOREIGN KEY ("photoId") REFERENCES "MediaAsset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "MediaAsset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_ogImageId_fkey" FOREIGN KEY ("ogImageId") REFERENCES "MediaAsset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgendaItem" ADD CONSTRAINT "AgendaItem_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventSpeaker" ADD CONSTRAINT "EventSpeaker_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventSpeaker" ADD CONSTRAINT "EventSpeaker_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Page" ADD CONSTRAINT "Page_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "MediaAsset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Page" ADD CONSTRAINT "Page_ogImageId_fkey" FOREIGN KEY ("ogImageId") REFERENCES "MediaAsset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventRegistration" ADD CONSTRAINT "EventRegistration_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ServiceToTechnology" ADD CONSTRAINT "_ServiceToTechnology_A_fkey" FOREIGN KEY ("A") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ServiceToTechnology" ADD CONSTRAINT "_ServiceToTechnology_B_fkey" FOREIGN KEY ("B") REFERENCES "Technology"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SolutionToTechnology" ADD CONSTRAINT "_SolutionToTechnology_A_fkey" FOREIGN KEY ("A") REFERENCES "Solution"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SolutionToTechnology" ADD CONSTRAINT "_SolutionToTechnology_B_fkey" FOREIGN KEY ("B") REFERENCES "Technology"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CaseStudyToService" ADD CONSTRAINT "_CaseStudyToService_A_fkey" FOREIGN KEY ("A") REFERENCES "CaseStudy"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CaseStudyToService" ADD CONSTRAINT "_CaseStudyToService_B_fkey" FOREIGN KEY ("B") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CaseStudyToServicePillar" ADD CONSTRAINT "_CaseStudyToServicePillar_A_fkey" FOREIGN KEY ("A") REFERENCES "CaseStudy"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CaseStudyToServicePillar" ADD CONSTRAINT "_CaseStudyToServicePillar_B_fkey" FOREIGN KEY ("B") REFERENCES "ServicePillar"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CaseStudyToSolution" ADD CONSTRAINT "_CaseStudyToSolution_A_fkey" FOREIGN KEY ("A") REFERENCES "CaseStudy"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CaseStudyToSolution" ADD CONSTRAINT "_CaseStudyToSolution_B_fkey" FOREIGN KEY ("B") REFERENCES "Solution"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CaseStudyToTechnology" ADD CONSTRAINT "_CaseStudyToTechnology_A_fkey" FOREIGN KEY ("A") REFERENCES "CaseStudy"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CaseStudyToTechnology" ADD CONSTRAINT "_CaseStudyToTechnology_B_fkey" FOREIGN KEY ("B") REFERENCES "Technology"("id") ON DELETE CASCADE ON UPDATE CASCADE;
