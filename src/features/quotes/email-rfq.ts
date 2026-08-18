import type { QuoteServiceType } from "@/types";

export const QUOTE_SUBTYPES = [
  "client_rfq",
  "forwarder_rate",
  "follow_up",
] as const;

export type QuoteSubtype = (typeof QUOTE_SUBTYPES)[number];

export const QUOTE_AI_REVIEW_STATUSES = [
  "needs_review",
  "needs_info",
  "confirmed",
  "dismissed",
] as const;

export type QuoteAiReviewStatus = (typeof QUOTE_AI_REVIEW_STATUSES)[number];

export const EMAIL_QUOTE_ACTIONS = [
  "created_draft",
  "needs_info",
  "attached",
  "skipped",
] as const;

export type EmailQuoteAction = (typeof EMAIL_QUOTE_ACTIONS)[number];

export const RFQ_FIELD_LABELS: Record<string, string> = {
  origin: "origin",
  destination: "destination",
  cargo_measure: "weight, CBM, or package count",
  commodity: "commodity / cargo description",
  mode: "transport mode (air / ocean FCL / LCL / road)",
  ready_date: "cargo ready or required delivery date",
  incoterms: "Incoterms (FOB, CIF, DDP, etc.)",
  company: "company name",
};

export type EmailRfqExtract = {
  subtype: QuoteSubtype;
  confidence: number;
  company?: string;
  contactName?: string;
  phone?: string;
  origin?: string;
  destination?: string;
  mode?: string;
  commodity?: string;
  weight?: string;
  cbm?: string;
  packages?: number;
  incoterms?: string;
  readyDate?: string;
  summary?: string;
  suggestedReply?: string;
};

export type RfqCompleteness = {
  complete: boolean;
  missing: string[];
  blocking: string[];
  optional: string[];
  score: number;
  reviewStatus: Extract<QuoteAiReviewStatus, "needs_review" | "needs_info">;
};

const RFQ_HINT =
  /\b(rfq|please quote|kindly quote|need (?:a |your )?rates?|quotation request|quote request|request for quote|can you quote|pls quote)\b/i;

const RATE_HINT =
  /\b(our (?:rate|quote)|please find (?:our |the )?quote|freight rate|as quoted|validity until|usd\s?\d|inr\s?\d)\b/i;

const FOLLOW_UP_HINT =
  /\b(following up|as discussed|as per (?:our )?last|any update|checking in)\b/i;

function present(value?: string | number | null): boolean {
  if (value == null) return false;
  if (typeof value === "number") return Number.isFinite(value) && value > 0;
  return value.trim().length > 0;
}

export function looksLikeClientRfq(subject: string, body?: string): boolean {
  const text = `${subject}\n${body ?? ""}`;
  return RFQ_HINT.test(text);
}

export function inferQuoteSubtype(input: {
  subject: string;
  body?: string;
  extracted?: Record<string, unknown>;
}): QuoteSubtype {
  const text = `${input.subject}\n${input.body ?? ""}`;
  if (FOLLOW_UP_HINT.test(text) && !RFQ_HINT.test(text)) return "follow_up";
  if (RFQ_HINT.test(text)) return "client_rfq";

  const price = present(stringField(input.extracted?.price));
  const carrier = present(stringField(input.extracted?.carrier));
  if ((price && carrier) || RATE_HINT.test(text)) return "forwarder_rate";

  return "client_rfq";
}

function stringField(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

export function evaluateRfqCompleteness(
  extract: Pick<
    EmailRfqExtract,
    | "origin"
    | "destination"
    | "weight"
    | "cbm"
    | "packages"
    | "commodity"
    | "mode"
    | "readyDate"
    | "incoterms"
    | "confidence"
  >,
): RfqCompleteness {
  const blocking: string[] = [];
  if (!present(extract.origin)) blocking.push("origin");
  if (!present(extract.destination)) blocking.push("destination");
  const hasCargo =
    present(extract.weight) ||
    present(extract.cbm) ||
    present(extract.packages);
  if (!hasCargo) blocking.push("cargo_measure");

  const optional: string[] = [];
  if (!present(extract.commodity)) optional.push("commodity");
  if (!present(extract.mode)) optional.push("mode");
  if (!present(extract.readyDate)) optional.push("ready_date");
  if (!present(extract.incoterms)) optional.push("incoterms");

  const blockingScore = (3 - blocking.length) / 3;
  const optionalScore = (4 - optional.length) / 4;
  const score = Math.round((blockingScore * 0.75 + optionalScore * 0.25) * 1000) /
    1000;

  const lowConfidence =
    extract.confidence != null && extract.confidence < 0.45;
  const complete = blocking.length === 0 && !lowConfidence;

  return {
    complete,
    missing: [...blocking, ...optional],
    blocking,
    optional,
    score,
    reviewStatus: complete ? "needs_review" : "needs_info",
  };
}

export function buildMissingInfoReply(input: {
  origin?: string;
  destination?: string;
  missing: string[];
}): string {
  const lane =
    present(input.origin) && present(input.destination)
      ? ` on ${input.origin} → ${input.destination}`
      : "";
  const needed = input.missing
    .map((field) => RFQ_FIELD_LABELS[field] ?? field)
    .join("; ");
  return `Thanks for your enquiry${lane}. To quote accurately we still need: ${needed}.`;
}

export function mapModeToServiceType(mode?: string): QuoteServiceType {
  const value = (mode ?? "").toLowerCase();
  if (/\bfcl\b|40ft|20ft|container/.test(value)) return "ocean-fcl";
  if (/\blcl\b|consolidation/.test(value)) return "ocean-lcl";
  if (/\broad\b|truck|trailer/.test(value)) return "door-to-door";
  if (/\bocean\b|sea freight/.test(value)) return "ocean-lcl";
  return "air";
}

export function displayNameFromSender(input: {
  senderName?: string;
  senderEmail: string;
  contactName?: string;
}): string {
  if (present(input.contactName)) return input.contactName as string;
  if (present(input.senderName)) return input.senderName as string;
  const local = input.senderEmail.split("@")[0] ?? "Customer";
  return local
    .replace(/[._-]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function companyFromSender(input: {
  company?: string;
  senderEmail: string;
}): string {
  if (present(input.company)) return input.company as string;
  const domain = input.senderEmail.split("@")[1] ?? "";
  const stem = domain.split(".")[0] ?? "";
  if (!stem || ["gmail", "yahoo", "hotmail", "outlook", "rediffmail"].includes(stem)) {
    return "Unknown company";
  }
  return stem.replace(/[-_]+/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

export function laneOrTbc(value?: string): string {
  return present(value) ? (value as string) : "TBC";
}
