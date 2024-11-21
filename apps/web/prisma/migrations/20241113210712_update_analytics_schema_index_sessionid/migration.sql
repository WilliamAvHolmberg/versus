-- AlterTable
ALTER TABLE "Analytics" ADD COLUMN     "sessionId" TEXT;

-- CreateIndex
CREATE INDEX "Analytics_sessionId_idx" ON "Analytics"("sessionId");
