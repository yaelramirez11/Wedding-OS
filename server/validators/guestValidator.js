const { z } = require("zod");

const createGuestSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters, my love")
    .max(50, "Name is too long!"),

  status: z.enum(["pending", "confirmed", "maybe", "declined"]).optional(),

  side: z.enum(["bride", "groom", "both"]).optional(),

  gender: z.enum(["male", "female"]).optional().nullable(),

  plusOneAllowed: z.boolean().optional(),

  notes: z.string().max(150, "Notes are too long, honey").optional().nullable(),
});

const updateGuestSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters, my love")
    .max(50, "Name is too long!")
    .optional(),

  status: z.enum(["pending", "confirmed", "maybe", "declined"]).optional(),

  side: z.enum(["bride", "groom", "both"]).optional(),

  gender: z.enum(["male", "female"]).optional().nullable(),

  plusOneAllowed: z.boolean().optional(),

  notes: z.string().max(150, "Notes are too long").optional().nullable(),
});

module.exports = {
  createGuestSchema,
  updateGuestSchema,
};
