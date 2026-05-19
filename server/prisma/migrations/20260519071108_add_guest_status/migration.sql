/*
  Warnings:

  - You are about to drop the column `confirmed` on the `Guest` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "GuestStatus" AS ENUM ('pending', 'confirmed', 'declined', 'maybe');

-- AlterTable
ALTER TABLE "Guest" DROP COLUMN "confirmed",
ADD COLUMN     "status" "GuestStatus" NOT NULL DEFAULT 'pending';
