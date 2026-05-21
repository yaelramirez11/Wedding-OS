const { z } = require("zod");

const dashboardStatusSchema = z.enum(["Live", "InProgress", "Next", "Done"]);

const dashboardCardSchema = z.object({
  key: z.string().min(2).max(80),
  title: z.string().min(2).max(80),
  status: dashboardStatusSchema.optional(),
  text: z.string().min(2).max(300),
  accent: z.string().min(2).max(80),
  icon: z.string().min(1).max(20),
  path: z.string().max(120).optional().nullable(),
  order: z.number().int().optional(),
});

const dashboardTaskSchema = z.object({
  title: z.string().min(2).max(100),
  desc: z.string().max(300).optional().nullable(),
  status: dashboardStatusSchema.optional(),
  order: z.number().int().optional(),
});

module.exports = {
  dashboardCardSchema,
  dashboardTaskSchema,
};
