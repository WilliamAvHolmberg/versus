-- AlterTable
ALTER TABLE "Analytics" ADD COLUMN     "visitorId" TEXT;

-- CreateIndex
CREATE INDEX "Analytics_visitorId_idx" ON "Analytics"("visitorId");
