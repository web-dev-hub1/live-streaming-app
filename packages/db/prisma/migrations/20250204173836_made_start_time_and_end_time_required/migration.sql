/*
  Warnings:

  - Added the required column `updatedAt` to the `Streams` table without a default value. This is not possible if the table is not empty.
  - Made the column `description` on table `Streams` required. This step will fail if there are existing NULL values in that column.
  - Made the column `startTime` on table `Streams` required. This step will fail if there are existing NULL values in that column.
  - Made the column `endTime` on table `Streams` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Streams" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "startTime" SET NOT NULL,
ALTER COLUMN "endTime" SET NOT NULL;
