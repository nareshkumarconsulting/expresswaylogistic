import { z } from "zod";

export const EMAIL_CATEGORIES = [
  "shipment",
  "quotation",
  "alert",
  "general",
] as const;

export const EMAIL_URGENCIES = ["low", "medium", "high", "critical"] as const;

/** LLMs often return "normal" / "urgent" — map those so ingest does not 400. */
export function coerceEmailUrgency(
  value: unknown,
): (typeof EMAIL_URGENCIES)[number] | undefined {
  if (value == null || value === "") return undefined;
  const v = String(value).toLowerCase().trim();
  if ((EMAIL_URGENCIES as readonly string[]).includes(v)) {
    return v as (typeof EMAIL_URGENCIES)[number];
  }
  if (["normal", "moderate", "info", "informational"].includes(v)) {
    return "medium";
  }
  if (["urgent", "important", "warning"].includes(v)) return "high";
  if (["emergency", "severe"].includes(v)) return "critical";
  return "medium";
}

export const EMAIL_STATUSES = ["new", "read", "actioned", "archived"] as const;

export const EMAIL_CATEGORY_LABELS: Record<
  (typeof EMAIL_CATEGORIES)[number],
  string
> = {
  shipment: "Shipment / Tracking",
  quotation: "Quotation / Rate",
  alert: "Important Alert",
  general: "General / Other",
};

export const EMAIL_CATEGORY_ICONS: Record<
  (typeof EMAIL_CATEGORIES)[number],
  string
> = {
  shipment: "🚚",
  quotation: "💰",
  alert: "🔔",
  general: "📄",
};

const shipmentExtractSchema = z.object({
  awb: z.string().optional(),
  trackingNo: z.string().optional(),
  pickup: z.string().optional(),
  destination: z.string().optional(),
  status: z.string().optional(),
  eta: z.string().optional(),
});

const quotationExtractSchema = z.object({
  quoteNo: z.string().optional(),
  origin: z.string().optional(),
  destination: z.string().optional(),
  carrier: z.string().optional(),
  price: z.string().optional(),
  validity: z.string().optional(),
});

const alertExtractSchema = z.object({
  alertType: z.string().optional(),
  urgency: z.enum(EMAIL_URGENCIES).optional(),
  requiredAction: z.string().optional(),
  deadline: z.string().optional(),
});

const generalExtractSchema = z.object({
  sender: z.string().optional(),
  subject: z.string().optional(),
  date: z.string().optional(),
  summary: z.string().optional(),
});

export const emailIngestSchema = z.object({
  sourceAccount: z.string().min(1).max(200),
  externalMessageId: z.string().max(500).optional(),
  senderEmail: z.string().email(),
  senderName: z.string().max(200).optional(),
  subject: z.string().min(1).max(1000),
  receivedAt: z.string().min(1),
  category: z.enum(EMAIL_CATEGORIES),
  confidence: z.number().min(0).max(1).optional(),
  summary: z.string().max(5000).optional(),
  urgency: z.preprocess(
    coerceEmailUrgency,
    z.enum(EMAIL_URGENCIES).optional(),
  ),
  hasAttachments: z.boolean().optional(),
  attachmentNames: z.array(z.string()).optional(),
  body: z.string().max(20_000).optional(),
  extractedData: z
    .union([
      shipmentExtractSchema,
      quotationExtractSchema,
      alertExtractSchema,
      generalExtractSchema,
      z.record(z.string(), z.unknown()),
    ])
    .optional()
    .default({}),
});

export const emailStatusUpdateSchema = z.object({
  status: z.enum(EMAIL_STATUSES),
});

export type EmailIngestPayload = z.infer<typeof emailIngestSchema>;
export type EmailStatusUpdatePayload = z.infer<typeof emailStatusUpdateSchema>;
