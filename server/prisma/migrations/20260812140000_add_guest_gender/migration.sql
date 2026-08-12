-- CreateEnum
CREATE TYPE "GuestGender" AS ENUM ('male', 'female');

-- AlterTable
ALTER TABLE "Guest" ADD COLUMN "gender" "GuestGender";
