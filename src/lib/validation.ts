import { z } from "zod";

export const leadSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(160),
  company: z.string().trim().max(160).optional().or(z.literal("")),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  interest: z.enum([
    "bis",
    "bee",
    "testing",
    "export",
    "tender",
    "marketplace",
    "msds",
    "other",
  ]),
  message: z.string().trim().min(10).max(4000),
  sourcePath: z.string().trim().max(240).optional(),
});

export const searchQuerySchema = z.object({
  q: z.string().trim().max(160).default(""),
  type: z
    .enum(["product", "scheme", "lab", "test", "category", "country", "qco", "post", "page", "bee", "gmark", "eu"])
    .optional(),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

export const translationGenerateSchema = z.object({
  locale: z.enum(["hi", "zh", "es", "fr", "ar", "ru"]),
  entityType: z.enum(["product", "scheme", "ui"]),
  entityId: z.string().trim().min(1).max(180),
  field: z.string().trim().min(1).max(40),
  sourceText: z.string().trim().min(1).max(8000),
});

export const translationReviewSchema = z.object({
  id: z.string().trim().min(1),
  status: z.enum(["in_review", "approved", "rejected"]),
  reviewedText: z.string().trim().min(1).max(8000).optional(),
  reviewer: z.string().trim().min(1).max(80).optional(),
});

export type LeadInput = z.infer<typeof leadSchema>;
