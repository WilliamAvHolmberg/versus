-- AlterTable
ALTER TABLE "Bookmark" ADD COLUMN     "readAt" TIMESTAMP(3),
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'unread';
