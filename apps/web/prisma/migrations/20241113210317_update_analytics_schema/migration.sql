-- AlterTable
ALTER TABLE "Analytics" ADD COLUMN     "path" TEXT;

-- CreateIndex
CREATE INDEX "Analytics_path_idx" ON "Analytics"("path");
