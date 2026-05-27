/*
  Warnings:

  - Added the required column `fileKey` to the `Setup` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Setup" ADD COLUMN     "fileKey" TEXT NOT NULL,
ALTER COLUMN "fileUrl" DROP NOT NULL;
