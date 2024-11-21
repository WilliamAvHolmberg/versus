-- AlterTable
ALTER TABLE "Theme" ADD COLUMN     "likeCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "searchText" TEXT,
ADD COLUMN     "tags" TEXT[];

-- CreateTable
CREATE TABLE "ThemeRating" (
    "id" TEXT NOT NULL,
    "themeId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ThemeRating_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ThemeComment" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "themeId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "parentId" TEXT,

    CONSTRAINT "ThemeComment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ThemeRating_userId_idx" ON "ThemeRating"("userId");

-- CreateIndex
CREATE INDEX "ThemeRating_themeId_idx" ON "ThemeRating"("themeId");

-- CreateIndex
CREATE UNIQUE INDEX "ThemeRating_themeId_userId_key" ON "ThemeRating"("themeId", "userId");

-- CreateIndex
CREATE INDEX "ThemeComment_themeId_idx" ON "ThemeComment"("themeId");

-- CreateIndex
CREATE INDEX "ThemeComment_userId_idx" ON "ThemeComment"("userId");

-- CreateIndex
CREATE INDEX "ThemeComment_createdAt_idx" ON "ThemeComment"("createdAt");

-- CreateIndex
CREATE INDEX "ThemeComment_likes_idx" ON "ThemeComment"("likes");

-- CreateIndex
CREATE INDEX "ThemeComment_parentId_idx" ON "ThemeComment"("parentId");

-- CreateIndex
CREATE INDEX "Theme_likeCount_idx" ON "Theme"("likeCount");

-- CreateIndex
CREATE INDEX "Theme_tags_idx" ON "Theme"("tags");

-- AddForeignKey
ALTER TABLE "ThemeRating" ADD CONSTRAINT "ThemeRating_themeId_fkey" FOREIGN KEY ("themeId") REFERENCES "Theme"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ThemeRating" ADD CONSTRAINT "ThemeRating_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ThemeComment" ADD CONSTRAINT "ThemeComment_themeId_fkey" FOREIGN KEY ("themeId") REFERENCES "Theme"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ThemeComment" ADD CONSTRAINT "ThemeComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ThemeComment" ADD CONSTRAINT "ThemeComment_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "ThemeComment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
