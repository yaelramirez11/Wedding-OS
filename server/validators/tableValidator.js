const { z } = require("zod");

const createTableSchema = z.object({
  name: z.string().min(1).max(100),

  label: z.string().max(100).optional().nullable(),

  order: z.number().int().optional(),

  capacity: z.number().int().min(1).max(30).optional(),
});

const updateTableSchema = z.object({
  name: z.string().min(1).max(100).optional(),

  label: z.string().max(100).optional().nullable(),

  order: z.number().int().optional(),

  capacity: z.number().int().min(1).max(30).optional(),

  dualHeadLayout: z.boolean().optional(),
});

const mergeTablesSchema = z.object({
  primaryTableId: z.number().int(),
  secondaryTableId: z.number().int(),
  name: z.string().min(1).max(100),
  label: z.string().max(100).optional().nullable(),
  order: z.number().int().optional(),
  addExtraSeat: z.boolean().optional().default(false),
});

const unmergeTableSchema = z.object({
  tableId: z.number().int(),
});

const assignGuestSchema = z.object({
  guestId: z.number().int(),
  tableId: z.number().int().nullable(),
  seatIndex: z.number().int().min(0).nullable().optional(),
});

module.exports = {
  createTableSchema,
  updateTableSchema,
  mergeTablesSchema,
  unmergeTableSchema,
  assignGuestSchema,
};
