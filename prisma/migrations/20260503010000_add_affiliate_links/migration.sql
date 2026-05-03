CREATE TABLE "AffiliateLink" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "placement" TEXT NOT NULL,
    "scope" TEXT NOT NULL DEFAULT 'global',
    "bookSlug" TEXT,
    "chapterId" TEXT,
    "genreSlug" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AffiliateLink_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "AffiliateLink_active_placement_idx" ON "AffiliateLink"("active", "placement");
CREATE INDEX "AffiliateLink_scope_bookSlug_idx" ON "AffiliateLink"("scope", "bookSlug");
CREATE INDEX "AffiliateLink_genreSlug_idx" ON "AffiliateLink"("genreSlug");
