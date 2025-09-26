/*
  Warnings:

  - You are about to drop the column `createdAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `authorId` on the `WellnessSession` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `WellnessSession` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `WellnessSession` table. All the data in the column will be lost.
  - Added the required column `updated_at` to the `WellnessSession` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `WellnessSession` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."WellnessSession" DROP CONSTRAINT "WellnessSession_authorId_fkey";

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "public"."WellnessSession" DROP COLUMN "authorId",
DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."WellnessSession" ADD CONSTRAINT "WellnessSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
