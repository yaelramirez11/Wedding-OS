/*
  Warnings:

  - You are about to drop the column `paid` on the `HoneymoonItem` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "HoneymoonItem" DROP COLUMN "paid",
ADD COLUMN     "advancePaid" DOUBLE PRECISION NOT NULL DEFAULT 0;
