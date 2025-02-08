/*
  Warnings:

  - Added the required column `prompt` to the `ModelResult` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ModelResult" ADD COLUMN     "prompt" TEXT NOT NULL;
