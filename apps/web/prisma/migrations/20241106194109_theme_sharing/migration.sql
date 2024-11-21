-- AlterTable
ALTER TABLE "Theme" ADD COLUMN     "isPublic" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "name" TEXT;

-- CreateIndex
CREATE INDEX "Theme_isPublic_idx" ON "Theme"("isPublic");
