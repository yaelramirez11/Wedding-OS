-- CreateEnum
CREATE TYPE "TimelineType" AS ENUM ('planning', 'weddingDay', 'honeymoon');

-- CreateEnum
CREATE TYPE "TimelineStatus" AS ENUM ('pending', 'inProgress', 'completed', 'cancelled');

-- CreateEnum
CREATE TYPE "TimelinePriority" AS ENUM ('low', 'medium', 'high');

-- CreateTable
CREATE TABLE "TimelineItem" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "type" "TimelineType" NOT NULL DEFAULT 'planning',
    "category" TEXT NOT NULL DEFAULT 'general',
    "status" "TimelineStatus" NOT NULL DEFAULT 'pending',
    "priority" "TimelinePriority" NOT NULL DEFAULT 'medium',
    "date" TIMESTAMP(3),
    "time" TEXT,
    "notes" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TimelineItem_pkey" PRIMARY KEY ("id")
);
