import type { EmailIngestPayload } from "@/features/email-intelligence/schemas";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { Database } from "@/lib/supabase/database.types";
import { createSupabaseAdmin } from "@/lib/supabase/server";
import { logger } from "@/lib/logger";
import type {
  EmailCategory,
  EmailExtractedData,
  EmailIntelligence,
  EmailIntelligenceStatus,
  EmailUrgency,
} from "@/types";

type EmailRow = Database["public"]["Tables"]["email_intelligence"]["Row"];
type EmailInsert = Database["public"]["Tables"]["email_intelligence"]["Insert"];

export function mapEmailRowToIntelligence(row: EmailRow): EmailIntelligence {
  return {
    id: row.id,
    sourceAccount: row.source_account,
    externalMessageId: row.external_message_id ?? undefined,
    senderEmail: row.sender_email,
    senderName: row.sender_name ?? undefined,
    subject: row.subject,
    receivedAt: row.received_at,
    category: row.category as EmailCategory,
    confidence: row.confidence != null ? Number(row.confidence) : undefined,
    summary: row.summary ?? undefined,
    extractedData: (row.extracted_data ?? {}) as EmailExtractedData,
    status: row.status as EmailIntelligenceStatus,
    urgency: (row.urgency as EmailUrgency | null) ?? undefined,
    hasAttachments: row.has_attachments,
    attachmentNames: row.attachment_names ?? [],
    processedAt: row.processed_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapIngestToInsert(payload: EmailIngestPayload): EmailInsert {
  return {
    source_account: payload.sourceAccount,
    external_message_id: payload.externalMessageId ?? null,
    sender_email: payload.senderEmail,
    sender_name: payload.senderName ?? null,
    subject: payload.subject,
    received_at: payload.receivedAt,
    category: payload.category,
    confidence: payload.confidence ?? null,
    summary: payload.summary ?? null,
    extracted_data: payload.extractedData as EmailInsert["extracted_data"],
    urgency: payload.urgency ?? null,
    has_attachments: payload.hasAttachments ?? false,
    attachment_names: payload.attachmentNames ?? [],
  };
}

export async function insertEmailIntelligence(
  payload: EmailIngestPayload,
): Promise<EmailIntelligence | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = createSupabaseAdmin();
  const row = mapIngestToInsert(payload);

  const { data, error } = await supabase
    .from("email_intelligence")
    .insert(row)
    .select("*")
    .single();

  if (error) {
    if (error.code === "23505" && payload.externalMessageId) {
      logger.info("email_intelligence.duplicate_skipped", {
        sourceAccount: payload.sourceAccount,
        externalMessageId: payload.externalMessageId,
      });
      const { data: existing } = await supabase
        .from("email_intelligence")
        .select("*")
        .eq("source_account", payload.sourceAccount)
        .eq("external_message_id", payload.externalMessageId)
        .maybeSingle();
      return existing ? mapEmailRowToIntelligence(existing) : null;
    }

    logger.error("email_intelligence.insert.failed", { error: error.message });
    throw new Error("Failed to save email intelligence");
  }

  logger.info("email_intelligence.inserted", { id: data.id });
  return mapEmailRowToIntelligence(data);
}

export async function listEmailIntelligence(options?: {
  category?: EmailCategory;
  status?: EmailIntelligenceStatus;
  limit?: number;
}): Promise<EmailIntelligence[] | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = createSupabaseAdmin();
  let query = supabase
    .from("email_intelligence")
    .select("*")
    .order("received_at", { ascending: false });

  if (options?.category) {
    query = query.eq("category", options.category);
  }
  if (options?.status) {
    query = query.eq("status", options.status);
  }
  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;

  if (error) {
    logger.error("email_intelligence.list.failed", { error: error.message });
    throw new Error("Failed to load email intelligence");
  }

  return (data ?? []).map(mapEmailRowToIntelligence);
}

export async function updateEmailIntelligenceStatus(
  id: string,
  status: EmailIntelligenceStatus,
): Promise<EmailIntelligence | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("email_intelligence")
    .update({ status })
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    logger.error("email_intelligence.update.failed", {
      id,
      error: error.message,
    });
    throw new Error("Failed to update email intelligence");
  }

  return mapEmailRowToIntelligence(data);
}
