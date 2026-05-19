-- CreateEnum
CREATE TYPE "BudgetStatus" AS ENUM ('pending', 'advancePayment', 'paid');

-- CreateEnum
CREATE TYPE "BudgetCategory" AS ENUM ('venue', 'photography', 'dress', 'honeymoon', 'decoration', 'chorus', 'getReadyBride', 'cake', 'snacks', 'sweets', 'waiterTips', 'tableNumbers', 'alcohol', 'favors', 'centerpieces', 'florals', 'sweetheartTable', 'other');

-- CreateTable
CREATE TABLE "BudgetItem" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "cost" DOUBLE PRECISION NOT NULL,
    "category" "BudgetCategory" NOT NULL DEFAULT 'other',
    "subcategory" TEXT,
    "status" "BudgetStatus" NOT NULL DEFAULT 'pending',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BudgetItem_pkey" PRIMARY KEY ("id")
);
