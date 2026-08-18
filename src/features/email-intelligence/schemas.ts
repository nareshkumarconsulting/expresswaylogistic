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

/** LLMs often send confidence as "high" instead of 0.0–1.0. */
export function coerceEmailConfidence(value: unknown): number | undefined {
  if (value == null || value === "") return undefined;
  if (typeof value === "number" && Number.isFinite(value)) {
    if (value > 1 && value <= 100) return Math.min(1, value / 100);
    return Math.min(1, Math.max(0, value));
  }
  const v = String(value).toLowerCase().trim();
  const labels: Record<string, number> = {
    low: 0.4,
    medium: 0.6,
    moderate: 0.6,
    high: 0.85,
    critical: 0.95,
  };
  if (v in labels) return labels[v];
  const parsed = Number.parseFloat(v);
  if (!Number.isFinite(parsed)) return 0.5;
  if (parsed > 1 && parsed <= 100) return Math.min(1, parsed / 100);
  return Math.min(1, Math.max(0, parsed));
}

function stripNullFields(value: unknown): unknown {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return value ?? {};
  }
  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>).filter(
      ([, field]) => field != null,
    ),
  );
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
  confidence: z.preprocess(
    coerceEmailConfidence,
    z.number().min(0).max(1).optional(),
  ),
  summary: z.string().max(5000).optional(),
  urgency: z.preprocess(
    coerceEmailUrgency,
    z.enum(EMAIL_URGENCIES).optional(),
  ),
  hasAttachments: z.boolean().optional(),
  attachmentNames: z.array(z.string()).optional(),
  body: z.string().max(20_000).optional(),
  extractedData: z.preprocess(
    stripNullFields,
    z.record(z.string(), z.unknown()).optional().default({}),
  ),
});

export const emailStatusUpdateSchema = z.object({
  status: z.enum(EMAIL_STATUSES),
});

export type EmailIngestPayload = z.infer<typeof emailIngestSchema>;
export type EmailStatusUpdatePayload = z.infer<typeof emailStatusUpdateSchema>;
