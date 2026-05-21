-- CreateEnum
CREATE TYPE "DashboardStatus" AS ENUM ('Live', 'InProgress', 'Next', 'Done');

-- CreateTable
CREATE TABLE "DashboardCard" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "status" "DashboardStatus" NOT NULL DEFAULT 'Next',
    "text" TEXT NOT NULL,
    "accent" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "path" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DashboardCard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DashboardTask" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "desc" TEXT,
    "status" "DashboardStatus" NOT NULL DEFAULT 'Next',
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DashboardTask_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DashboardCard_key_key" ON "DashboardCard"("key");
