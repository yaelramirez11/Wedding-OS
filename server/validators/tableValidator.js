const { z } = require("zod");

const createTableSchema = z.object({
  name: z.string().min(1).max(100),

  label: z.string().max(100).optional().nullable(),

  order: z.number().int().optional(),
});

const assignGuestSchema = z.object({
  guestId: z.number().int(),
  tableId: z.number().int().nullable(),
  seatIndex: z.number().int().min(0).nullable().optional(),
});

module.exports = {
  createTableSchema,
  assignGuestSchema,
};
