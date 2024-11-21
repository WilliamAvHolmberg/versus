-- AlterTable
ALTER TABLE "Bookmark" ADD COLUMN     "clickCount" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "Bookmark_clickCount_idx" ON "Bookmark"("clickCount");
