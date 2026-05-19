-- CreateEnum
CREATE TYPE "GuestSide" AS ENUM ('bride', 'groom', 'both');

-- AlterTable
ALTER TABLE "Guest" ADD COLUMN     "notes" TEXT,
ADD COLUMN     "plusOneAllowed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "side" "GuestSide" NOT NULL DEFAULT 'both';
