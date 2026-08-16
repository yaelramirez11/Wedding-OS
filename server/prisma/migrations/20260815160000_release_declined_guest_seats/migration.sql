-- Declined guests should not keep a table assignment.
UPDATE "Guest"
SET "tableId" = NULL, "seatIndex" = NULL
WHERE "status" = 'declined' AND "tableId" IS NOT NULL;
