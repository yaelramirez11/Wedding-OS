const { z } = require("zod");

const budgetItemSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters").max(80),
  cost: z.number().positive("Cost must be greater than 0"),
  advancePaid: z.number().min(0).optional(),

  category: z.enum([
    "venue",
    "photography",
    "dress",
    "honeymoon",
    "decoration",
    "chorus",
    "getReadyBride",
    "cake",
    "snacks",
    "sweets",
    "waiterTips",
    "tableNumbers",
    "alcohol",
    "favors",
    "centerpieces",
    "florals",
    "sweetheartTable",
    "other",
  ]),

  subcategory: z.string().max(80).optional().nullable(),

  status: z.enum(["pending", "advancePayment", "paid"]).optional(),

  notes: z.string().max(300).optional().nullable(),
});

module.exports = {
  budgetItemSchema,
};
