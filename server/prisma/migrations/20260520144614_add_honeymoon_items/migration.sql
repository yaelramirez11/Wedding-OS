-- CreateEnum
CREATE TYPE "HoneymoonCategory" AS ENUM ('hotel', 'flight', 'transportation', 'activities', 'food', 'documents', 'shopping', 'other');

-- CreateEnum
CREATE TYPE "HoneymoonStatus" AS ENUM ('planned', 'notPlanned', 'booked', 'paid', 'advancePaid');

-- CreateTable
CREATE TABLE "HoneymoonItem" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "category" "HoneymoonCategory" NOT NULL DEFAULT 'other',
    "cost" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "paid" BOOLEAN NOT NULL DEFAULT false,
    "status" "HoneymoonStatus" NOT NULL DEFAULT 'planned',
    "date" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HoneymoonItem_pkey" PRIMARY KEY ("id")
);
