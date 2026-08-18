import {
  buildMissingInfoReply,
  companyFromSender,
  displayNameFromSender,
  evaluateRfqCompleteness,
  inferQuoteSubtype,
  laneOrTbc,
  looksLikeClientRfq,
  mapModeToServiceType,
  type EmailQuoteAction,
  type EmailRfqExtract,
  type QuoteSubtype,
} from "@/features/quotes/email-rfq";
import type { EmailIngestPayload } from "@/features/email-intelligence/schemas";
import { completeJsonObject } from "@/lib/llm-json";
import { notifyLead } from "@/lib/lead-notify";
import { logger } from "@/lib/logger";
import { createQuoteReferenceId } from "@/lib/reference-id";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { Database } from "@/lib/supabase/database.types";
import { createSupabaseAdmin } from "@/lib/supabase/server";
import { insertQuoteRequest } from "@/services/leads-repository";
import { logQuoteActivity } from "@/services/quotes-repository";
import type { EmailIntelligence } from "@/types";

type QuoteRow = Database["public"]["Tables"]["quote_requests"]["Row"];
type QuoteInsert = Database["public"]["Tables"]["quote_requests"]["Insert"];

export type EmailQuoteOutcome = {
  action: EmailQuoteAction;
  quoteId?: string;
  subtype?: QuoteSubtype;
};

const EXTRACT_SYSTEM = `You are a freight-forwarding email analyst for ExpressWay Logistics.
Decide the quote subtype and extract fields. Never invent cargo details that are not in the email.
If a field is missing, omit it or use an empty string.

subtype must be exactly one of:
- client_rfq: a customer asking ExpressWay for rates
- forwarder_rate: a carrier/forwarder sending a price back
- follow_up: a reply on an existing enquiry, not a new RFQ

Return JSON only:
{
  "subtype": "client_rfq|forwarder_rate|follow_up",
  "confidence": 0.0-1.0,
  "company": "",
  "contactName": "",
  "phone": "",
  "origin": "",
  "destination": "",
  "mode": "air|ocean-fcl|ocean-lcl|road|",
  "commodity": "",
  "weight": "",
  "cbm": "",
  "packages": null,
  "incoterms": "",
  "readyDate": "",
  "summary": "one sentence",
  "suggestedReply": "short email asking only for missing facts, or empty if complete"
}`;

function stringOrUndef(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function numberOrUndef(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value) && value > 0) {
    return Math.round(value);
  }
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value.replace(/[^\d.]/g, ""));
    if (Number.isFinite(parsed) && parsed > 0) return Math.round(parsed);
  }
  return undefined;
}

function clampConfidence(value: unknown, fallback: number): number {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(1, Math.max(0, n));
}

function mergeExtract(
  payload: EmailIngestPayload,
  llm: EmailRfqExtract | null,
): EmailRfqExtract {
  const n8n = (payload.extractedData ?? {}) as Record<string, unknown>;
  const subtype =
    llm?.subtype ??
    inferQuoteSubtype({
      subject: payload.subject,
      body: payload.body,
      extracted: n8n,
    });

  return {
    subtype,
    confidence: llm?.confidence ?? payload.confidence ?? 0.5,
    company: llm?.company,
    contactName: llm?.contactName,
    phone: llm?.phone,
    origin: llm?.origin ?? stringOrUndef(n8n.origin),
    destination: llm?.destination ?? stringOrUndef(n8n.destination),
    mode: llm?.mode,
    commodity: llm?.commodity,
    weight: llm?.weight,
    cbm: llm?.cbm,
    packages: llm?.packages,
    incoterms: llm?.incoterms,
    readyDate: llm?.readyDate,
    summary: llm?.summary ?? payload.summary,
    suggestedReply: llm?.suggestedReply,
  };
}

function parseLlmExtract(raw: unknown, fallbackConfidence: number): EmailRfqExtract | null {
  if (!raw || typeof raw !== "object") return null;
  const data = raw as Record<string, unknown>;
  const subtypeRaw = stringOrUndef(data.subtype);
  const subtype: QuoteSubtype =
    subtypeRaw === "forwarder_rate" || subtypeRaw === "follow_up"
      ? subtypeRaw
      : "client_rfq";

  return {
    subtype,
    confidence: clampConfidence(data.confidence, fallbackConfidence),
    company: stringOrUndef(data.company),
    contactName: stringOrUndef(data.contactName),
    phone: stringOrUndef(data.phone),
    origin: stringOrUndef(data.origin),
    destination: stringOrUndef(data.destination),
    mode: stringOrUndef(data.mode),
    commodity: stringOrUndef(data.commodity),
    weight: stringOrUndef(data.weight),
    cbm: stringOrUndef(data.cbm),
    packages: numberOrUndef(data.packages),
    incoterms: stringOrUndef(data.incoterms),
    readyDate: stringOrUndef(data.readyDate),
    summary: stringOrUndef(data.summary),
    suggestedReply: stringOrUndef(data.suggestedReply),
  };
}

async function extractWithLlm(
  payload: EmailIngestPayload,
): Promise<EmailRfqExtract | null> {
  const raw = await completeJsonObject({
    system: EXTRACT_SYSTEM,
    user: [
      `From: ${payload.senderName ?? ""} <${payload.senderEmail}>`,
      `Subject: ${payload.subject}`,
      `Date: ${payload.receivedAt}`,
      `n8n category: ${payload.category}`,
      `n8n extract: ${JSON.stringify(payload.extractedData ?? {})}`,
      "",
      payload.body?.slice(0, 12_000) || "(no body forwarded)",
    ].join("\n"),
  });
  return parseLlmExtract(raw, payload.confidence ?? 0.5);
}

async function findMatchingQuote(input: {
  senderEmail: string;
  origin?: string;
  destination?: string;
}): Promise<Pick<QuoteRow, "id" | "email" | "origin" | "destination"> | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("quote_requests")
    .select("id, email, origin, destination")
    .order("submitted_at", { ascending: false })
    .limit(40);

  if (error || !data) {
    if (error) {
      logger.warn("email_quote.match_list.failed", { error: error.message });
    }
    return null;
  }

  const sender = input.senderEmail.toLowerCase();
  const origin = input.origin?.toLowerCase();
  const destination = input.destination?.toLowerCase();

  const bySender = data.find((row) => row.email.toLowerCase() === sender);
  if (bySender) return bySender;

  if (origin && destination) {
    return (
      data.find(
        (row) =>
          row.origin.toLowerCase().includes(origin) &&
          row.destination.toLowerCase().includes(destination),
      ) ?? null
    );
  }

  return null;
}

function buildQuoteInsert(
  payload: EmailIngestPayload,
  emailId: string,
  extract: EmailRfqExtract,
  completeness: ReturnType<typeof evaluateRfqCompleteness>,
  referenceId: string,
): QuoteInsert {
  const name = displayNameFromSender({
    senderName: payload.senderName,
    senderEmail: payload.senderEmail,
    contactName: extract.contactName,
  });
  const company = companyFromSender({
    company: extract.company,
    senderEmail: payload.senderEmail,
  });
  const missingLabels = completeness.missing.join(", ");
  const bodyExcerpt = payload.body?.slice(0, 800)?.trim();
  const message = [
    extract.summary ?? payload.summary ?? payload.subject,
    extract.commodity ? `Commodity: ${extract.commodity}` : null,
    extract.incoterms ? `Incoterms: ${extract.incoterms}` : null,
    completeness.missing.length > 0 ? `AI missing: ${missingLabels}` : null,
    bodyExcerpt ? `\n${bodyExcerpt}` : null,
  ]
    .filter((line): line is string => Boolean(line))
    .join("\n");

  const suggested =
    extract.suggestedReply?.trim() ||
    (completeness.complete
      ? undefined
      : buildMissingInfoReply({
          origin: extract.origin,
          destination: extract.destination,
          missing: completeness.missing,
        }));

  return {
    id: referenceId,
    source: "email",
    name,
    company,
    email: payload.senderEmail,
    phone: extract.phone ?? null,
    origin: laneOrTbc(extract.origin),
    destination: laneOrTbc(extract.destination),
    service_type: mapModeToServiceType(extract.mode),
    approx_weight: extract.weight ?? extract.cbm ?? null,
    total_packages: extract.packages ?? null,
    message,
    payload: JSON.parse(
      JSON.stringify({
        source: "email",
        subtype: extract.subtype,
        extract,
        n8n: payload.extractedData ?? {},
        subject: payload.subject,
      }),
    ) as QuoteInsert["payload"],
    internal_notes: `Email AI (${completeness.reviewStatus}). ${payload.subject}`,
    pickup_location: extract.origin ?? null,
    delivery_location: extract.destination ?? null,
    required_delivery_date: /^\d{4}-\d{2}-\d{2}/.test(extract.readyDate ?? "")
      ? extract.readyDate!.slice(0, 10)
      : null,
    additional_requirements: extract.incoterms ?? null,
    email_intelligence_id: emailId,
    ai_review_status: completeness.reviewStatus,
    ai_missing_fields: completeness.missing,
    ai_completeness: completeness.score,
    ai_suggested_reply: suggested ?? null,
  };
}

async function markEmailQuote(
  emailId: string,
  action: EmailQuoteAction,
  subtype: QuoteSubtype,
  quoteId?: string,
): Promise<void> {
  if (!isSupabaseConfigured()) return;
  const supabase = createSupabaseAdmin();
  const { error } = await supabase
    .from("email_intelligence")
    .update({
      quote_action: action,
      quote_subtype: subtype,
      quote_request_id: quoteId ?? null,
    })
    .eq("id", emailId);

  if (error) {
    logger.warn("email_quote.email_update.failed", {
      emailId,
      error: error.message,
    });
  }
}

async function notifySales(input: {
  extract: EmailRfqExtract;
  completeness: ReturnType<typeof evaluateRfqCompleteness>;
  payload: EmailIngestPayload;
  quoteId: string;
}): Promise<void> {
  const needsInfo = input.completeness.reviewStatus === "needs_info";
  await notifyLead({
    type: needsInfo ? "email_quote_needs_info" : "email_quote_draft",
    subject: needsInfo
      ? `[AI] Incomplete quote — chase ${input.payload.senderEmail}`
      : `[AI] Quote draft ready for review · ${input.quoteId}`,
    summaryLines: [
      `From: ${input.payload.senderName ?? input.payload.senderEmail}`,
      `Subject: ${input.payload.subject}`,
      `Lane: ${laneOrTbc(input.extract.origin)} → ${laneOrTbc(input.extract.destination)}`,
      needsInfo
        ? `Missing: ${input.completeness.missing.join(", ") || "review extraction"}`
        : "Complete enough to start pricing — human review required",
      `Quote: ${input.quoteId}`,
    ],
    payload: {
      quoteId: input.quoteId,
      missing: input.completeness.missing,
      suggestedReply: input.extract.suggestedReply,
      senderEmail: input.payload.senderEmail,
    },
    referenceId: input.quoteId,
  });
}

export async function processEmailQuoteIntelligence(
  email: EmailIntelligence,
  payload: EmailIngestPayload,
): Promise<EmailQuoteOutcome | null> {
  const shouldRun =
    payload.category === "quotation" ||
    looksLikeClientRfq(payload.subject, payload.body);

  if (!shouldRun) return null;

  try {
    const llm = await extractWithLlm(payload);
    const extract = mergeExtract(payload, llm);

    if (extract.subtype !== "client_rfq") {
      const match = await findMatchingQuote({
        senderEmail: payload.senderEmail,
        origin: extract.origin,
        destination: extract.destination,
      });
      if (match) {
        await logQuoteActivity(
          match.id,
          extract.subtype === "forwarder_rate"
            ? "forwarder_email_received"
            : "email_follow_up",
          extract.summary ?? payload.summary ?? payload.subject,
          "email-ai",
          { emailId: email.id, subtype: extract.subtype },
        );
        await markEmailQuote(email.id, "attached", extract.subtype, match.id);
        return { action: "attached", quoteId: match.id, subtype: extract.subtype };
      }

      await markEmailQuote(email.id, "skipped", extract.subtype);
      return { action: "skipped", subtype: extract.subtype };
    }

    const completeness = evaluateRfqCompleteness(extract);
    const referenceId = createQuoteReferenceId();
    const row = buildQuoteInsert(
      payload,
      email.id,
      extract,
      completeness,
      referenceId,
    );

    await insertQuoteRequest(row);

    await logQuoteActivity(
      referenceId,
      completeness.complete ? "ai_draft" : "ai_needs_info",
      completeness.complete
        ? "Email AI created a quote draft for review"
        : `Email AI created a quote with missing info: ${completeness.missing.join(", ") || "review extraction"}`,
      "email-ai",
      { emailId: email.id, missing: completeness.missing },
    );

    const action: EmailQuoteAction = completeness.complete
      ? "created_draft"
      : "needs_info";
    await markEmailQuote(email.id, action, extract.subtype, referenceId);
    await notifySales({ extract, completeness, payload, quoteId: referenceId });

    logger.info("email_quote.created", {
      quoteId: referenceId,
      action,
      missing: completeness.missing,
    });

    return { action, quoteId: referenceId, subtype: extract.subtype };
  } catch (error) {
    logger.error("email_quote.process.failed", {
      emailId: email.id,
      error: error instanceof Error ? error.message : "unknown",
    });
    return null;
  }
}
