/*
  Warnings:

  - You are about to drop the column `createdAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Stream` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_CoHostedStreams` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Stream" DROP CONSTRAINT "Stream_creatorId_fkey";

-- DropForeignKey
ALTER TABLE "_CoHostedStreams" DROP CONSTRAINT "_CoHostedStreams_A_fkey";

-- DropForeignKey
ALTER TABLE "_CoHostedStreams" DROP CONSTRAINT "_CoHostedStreams_B_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- DropTable
DROP TABLE "Stream";

-- DropTable
DROP TABLE "_CoHostedStreams";

-- CreateTable
CREATE TABLE "Streams" (
    "id" TEXT NOT NULL,
    "streamID" TEXT NOT NULL,
    "streamTitle" TEXT NOT NULL,
    "description" TEXT,
    "startTime" TIMESTAMP(3),
    "endTime" TIMESTAMP(3),
    "status" "Status" DEFAULT 'UPCOMING',
    "creatorId" TEXT NOT NULL,
    "thumbnail" TEXT,
    "slides" JSONB,
    "videoLink" TEXT,

    CONSTRAINT "Streams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CoHost" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "streamId" TEXT NOT NULL,

    CONSTRAINT "CoHost_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Streams_id_key" ON "Streams"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Streams_streamID_key" ON "Streams"("streamID");

-- CreateIndex
CREATE UNIQUE INDEX "CoHost_id_key" ON "CoHost"("id");

-- AddForeignKey
ALTER TABLE "Streams" ADD CONSTRAINT "Streams_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoHost" ADD CONSTRAINT "CoHost_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoHost" ADD CONSTRAINT "CoHost_streamId_fkey" FOREIGN KEY ("streamId") REFERENCES "Streams"("id") ON DELETE CASCADE ON UPDATE CASCADE;
