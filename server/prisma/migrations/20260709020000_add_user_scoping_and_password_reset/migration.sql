-- DropIndex
DROP INDEX IF EXISTS "DashboardCard_key_key";

-- AlterTable
ALTER TABLE "Guest" ADD COLUMN IF NOT EXISTS "userId" INTEGER;
ALTER TABLE "BudgetItem" ADD COLUMN IF NOT EXISTS "userId" INTEGER;
ALTER TABLE "HoneymoonItem" ADD COLUMN IF NOT EXISTS "userId" INTEGER;
ALTER TABLE "TimelineItem" ADD COLUMN IF NOT EXISTS "userId" INTEGER;
ALTER TABLE "DashboardCard" ADD COLUMN IF NOT EXISTS "userId" INTEGER;
ALTER TABLE "DashboardTask" ADD COLUMN IF NOT EXISTS "userId" INTEGER;
ALTER TABLE "WeddingTable" ADD COLUMN IF NOT EXISTS "userId" INTEGER;

-- CreateTable
CREATE TABLE IF NOT EXISTS "PasswordResetToken" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PasswordResetToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "PasswordResetToken_token_key" ON "PasswordResetToken"("token");
CREATE INDEX IF NOT EXISTS "PasswordResetToken_userId_idx" ON "PasswordResetToken"("userId");
CREATE INDEX IF NOT EXISTS "Guest_userId_idx" ON "Guest"("userId");
CREATE INDEX IF NOT EXISTS "BudgetItem_userId_idx" ON "BudgetItem"("userId");
CREATE INDEX IF NOT EXISTS "HoneymoonItem_userId_idx" ON "HoneymoonItem"("userId");
CREATE INDEX IF NOT EXISTS "TimelineItem_userId_idx" ON "TimelineItem"("userId");
CREATE INDEX IF NOT EXISTS "DashboardCard_userId_idx" ON "DashboardCard"("userId");
CREATE UNIQUE INDEX IF NOT EXISTS "DashboardCard_userId_key_key" ON "DashboardCard"("userId", "key");
CREATE INDEX IF NOT EXISTS "DashboardTask_userId_idx" ON "DashboardTask"("userId");
CREATE INDEX IF NOT EXISTS "WeddingTable_userId_idx" ON "WeddingTable"("userId");

-- AddForeignKey
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'Guest_userId_fkey'
  ) THEN
    ALTER TABLE "Guest" ADD CONSTRAINT "Guest_userId_fkey"
      FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'BudgetItem_userId_fkey'
  ) THEN
    ALTER TABLE "BudgetItem" ADD CONSTRAINT "BudgetItem_userId_fkey"
      FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'HoneymoonItem_userId_fkey'
  ) THEN
    ALTER TABLE "HoneymoonItem" ADD CONSTRAINT "HoneymoonItem_userId_fkey"
      FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'TimelineItem_userId_fkey'
  ) THEN
    ALTER TABLE "TimelineItem" ADD CONSTRAINT "TimelineItem_userId_fkey"
      FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'DashboardCard_userId_fkey'
  ) THEN
    ALTER TABLE "DashboardCard" ADD CONSTRAINT "DashboardCard_userId_fkey"
      FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'DashboardTask_userId_fkey'
  ) THEN
    ALTER TABLE "DashboardTask" ADD CONSTRAINT "DashboardTask_userId_fkey"
      FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'WeddingTable_userId_fkey'
  ) THEN
    ALTER TABLE "WeddingTable" ADD CONSTRAINT "WeddingTable_userId_fkey"
      FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'PasswordResetToken_userId_fkey'
  ) THEN
    ALTER TABLE "PasswordResetToken" ADD CONSTRAINT "PasswordResetToken_userId_fkey"
      FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;
