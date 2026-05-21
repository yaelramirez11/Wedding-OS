const { z } = require("zod");

const honeymoonItemSchema = z.object({
  title: z
    .string()
    .min(2, "Title must be at least 2 characters, my lovely future spouse")
    .max(80),

  category: z.enum([
    "hotel",
    "flight",
    "transportation",
    "activities",
    "food",
    "documents",
    "shopping",
    "other",
  ]),

  cost: z.number().min(0).optional(),

  advancePaid: z.number().min(0).optional(),

  status: z
    .enum(["planned", "notPlanned", "booked", "paid", "advancePaid"])
    .optional(),

  date: z.string().optional().nullable(),

  notes: z.string().max(300).optional().nullable(),
});

module.exports = {
  honeymoonItemSchema,
};
