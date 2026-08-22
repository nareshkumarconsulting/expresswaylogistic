import { z } from "zod";

const emailListSchema = z
  .array(z.string().email())
  .max(25)
  .default([]);

export const clientEmailDraftSchema = z.object({
  prompt: z.string().trim().min(8).max(4000),
  quoteRequestId: z.string().trim().min(1).optional(),
  clientEmail: z.string().email().optional(),
  clientName: z.string().trim().max(200).optional(),
  clientCompany: z.string().trim().max(200).optional(),
  toneHint: z.string().trim().max(200).optional(),
});

export const clientEmailRefineSchema = z.object({
  instruction: z.string().trim().min(3).max(500),
  subject: z.string().trim().min(1).max(300),
  greeting: z.string().trim().min(1).max(200),
  body: z.string().trim().min(1).max(12_000),
  cta: z.string().trim().max(1000).optional(),
  quoteRequestId: z.string().trim().min(1).optional(),
  clientEmail: z.string().email().optional(),
  clientName: z.string().trim().max(200).optional(),
  clientCompany: z.string().trim().max(200).optional(),
});

export const clientEmailSendSchema = z.object({
  quoteRequestId: z.string().trim().min(1).optional(),
  clientName: z.string().trim().max(200).optional(),
  clientCompany: z.string().trim().max(200).optional(),
  to: emailListSchema.refine((list) => list.length > 0, {
    message: "At least one To recipient is required",
  }),
  cc: emailListSchema.optional(),
  bcc: emailListSchema.optional(),
  subject: z.string().trim().min(1).max(300),
  bodyText: z.string().trim().min(1).max(20_000),
  prompt: z.string().trim().max(4000).optional(),
  retryOfId: z.string().uuid().optional(),
  senderName: z.string().trim().max(120).optional(),
  sentBy: z.string().trim().max(120).optional(),
});

export const emailBrandingUpdateSchema = z.object({
  companyName: z.string().trim().min(1).max(200),
  tagline: z.string().trim().max(300).optional().or(z.literal("")),
  websiteUrl: z
    .string()
    .trim()
    .url()
    .max(500)
    .optional()
    .or(z.literal("")),
  contactEmail: z
    .string()
    .trim()
    .email()
    .optional()
    .or(z.literal("")),
  contactPhone: z.string().trim().max(80).optional().or(z.literal("")),
  contactAddress: z.string().trim().max(500).optional().or(z.literal("")),
  logoUrl: z.string().trim().url().max(1000).optional().or(z.literal("")),
  signatureHtml: z.string().trim().max(8000).optional().or(z.literal("")),
  updatedBy: z.string().trim().max(120).optional(),
});

export type ClientEmailDraftInput = z.infer<typeof clientEmailDraftSchema>;
export type ClientEmailRefineInput = z.infer<typeof clientEmailRefineSchema>;
export type ClientEmailSendInput = z.infer<typeof clientEmailSendSchema>;
export type EmailBrandingUpdateInput = z.infer<typeof emailBrandingUpdateSchema>;
