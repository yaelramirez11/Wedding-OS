const { z } = require("zod");

const timelineItemSchema = z.object({
  title: z
    .string()
    .min(2, "Title must be at least 2 characters, my heart")
    .max(100),

  type: z.enum(["planning", "weddingDay", "honeymoon"]).optional(),

  category: z.string().min(1).max(80).optional(),

  status: z
    .enum(["pending", "inProgress", "completed", "cancelled"])
    .optional(),

  priority: z.enum(["low", "medium", "high"]).optional(),

  date: z.string().optional().nullable(),

  time: z.string().max(20).optional().nullable(),

  notes: z.string().max(500).optional().nullable(),

  order: z.number().int().optional(),

  isCurrent: z.boolean().optional(),
});

module.exports = {
  timelineItemSchema,
};
