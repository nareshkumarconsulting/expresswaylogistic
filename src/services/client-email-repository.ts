import type { EmailBrandingUpdateInput } from "@/features/client-email/schemas";
import {
  defaultEmailBranding,
  resolveEmailBranding,
} from "@/features/client-email/branding";
import type { Database } from "@/lib/supabase/database.types";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createSupabaseAdmin } from "@/lib/supabase/server";
import { logger } from "@/lib/logger";
import {
  memoryGetBranding,
  memoryGetClientEmail,
  memoryListClientEmails,
  memorySaveBranding,
  memorySaveClientEmail,
} from "@/services/client-email-memory";
import { listManagedQuotes } from "@/services/quotes-repository";
import type {
  ClientEmailContact,
  ClientEmailMessage,
  ClientEmailStatus,
  EmailBrandingSettings,
} from "@/types";

type MessageRow = Database["public"]["Tables"]["client_email_messages"]["Row"];
type BrandingRow =
  Database["public"]["Tables"]["email_branding_settings"]["Row"];

function mapMessage(row: MessageRow): ClientEmailMessage {
  return {
    id: row.id,
    quoteRequestId: row.quote_request_id ?? undefined,
    clientName: row.client_name ?? undefined,
    clientCompany: row.client_company ?? undefined,
    toRecipients: row.to_recipients ?? [],
    ccRecipients: row.cc_recipients ?? [],
    bccRecipients: row.bcc_recipients ?? [],
    subject: row.subject,
    bodyText: row.body_text,
    bodyHtml: row.body_html,
    prompt: row.prompt ?? undefined,
    status: row.status,
    providerMessageId: row.provider_message_id ?? undefined,
    errorMessage: row.error_message ?? undefined,
    sentBy: row.sent_by ?? undefined,
    sentAt: row.sent_at ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapBranding(row: BrandingRow): EmailBrandingSettings {
  return resolveEmailBranding({
    id: row.id,
    companyName: row.company_name,
    tagline: row.tagline ?? undefined,
    websiteUrl: row.website_url ?? undefined,
    contactEmail: row.contact_email ?? undefined,
    contactPhone: row.contact_phone ?? undefined,
    contactAddress: row.contact_address ?? undefined,
    logoUrl: row.logo_url ?? undefined,
    signatureHtml: row.signature_html ?? undefined,
    updatedAt: row.updated_at,
    updatedBy: row.updated_by ?? undefined,
  });
}

export async function listClientEmailContacts(): Promise<ClientEmailContact[]> {
  const quotes = await listManagedQuotes();
  const byEmail = new Map<string, ClientEmailContact>();

  for (const quote of quotes) {
    const email = quote.email.trim().toLowerCase();
    if (!email) continue;
    const existing = byEmail.get(email);
    if (!existing) {
      byEmail.set(email, {
        email: quote.email.trim(),
        name: quote.name,
        company: quote.company,
        phone: quote.phone,
        quoteIds: [quote.id],
        latestQuoteId: quote.id,
        latestStatus: quote.status,
      });
      continue;
    }
    existing.quoteIds.push(quote.id);
    if (
      !existing.latestQuoteId ||
      new Date(quote.submittedAt).getTime() >
        new Date(
          quotes.find((q) => q.id === existing.latestQuoteId)?.submittedAt ?? 0,
        ).getTime()
    ) {
      existing.latestQuoteId = quote.id;
      existing.latestStatus = quote.status;
      existing.name = quote.name;
      existing.company = quote.company;
      existing.phone = quote.phone ?? existing.phone;
    }
  }

  return [...byEmail.values()].sort((a, b) =>
    a.company.localeCompare(b.company),
  );
}

export async function listClientEmailHistory(filters?: {
  quoteRequestId?: string;
  clientEmail?: string;
}): Promise<ClientEmailMessage[]> {
  if (!isSupabaseConfigured()) {
    return memoryListClientEmails(filters);
  }

  const supabase = createSupabaseAdmin();
  let query = supabase
    .from("client_email_messages")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  if (filters?.quoteRequestId) {
    query = query.eq("quote_request_id", filters.quoteRequestId);
  }

  const { data, error } = await query;
  if (error) {
    logger.error("client-email.list.failed", { error: error.message });
    throw new Error("Failed to load email history");
  }

  let rows = (data ?? []).map(mapMessage);
  if (filters?.clientEmail) {
    const needle = filters.clientEmail.toLowerCase();
    rows = rows.filter((row) =>
      [...row.toRecipients, ...row.ccRecipients].some(
        (email) => email.toLowerCase() === needle,
      ),
    );
  }
  return rows;
}

export async function getClientEmailMessage(
  id: string,
): Promise<ClientEmailMessage | null> {
  if (!isSupabaseConfigured()) {
    return memoryGetClientEmail(id) ?? null;
  }

  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("client_email_messages")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    logger.warn("client-email.get.failed", { id, error: error.message });
    return null;
  }
  return data ? mapMessage(data) : null;
}

export async function saveClientEmailMessage(input: {
  id?: string;
  quoteRequestId?: string;
  clientName?: string;
  clientCompany?: string;
  toRecipients: string[];
  ccRecipients: string[];
  bccRecipients: string[];
  subject: string;
  bodyText: string;
  bodyHtml: string;
  prompt?: string;
  status: ClientEmailStatus;
  providerMessageId?: string;
  errorMessage?: string;
  sentBy?: string;
  sentAt?: string;
}): Promise<ClientEmailMessage> {
  if (!isSupabaseConfigured()) {
    return memorySaveClientEmail(input);
  }

  const supabase = createSupabaseAdmin();
  const payload = {
    quote_request_id: input.quoteRequestId ?? null,
    client_name: input.clientName ?? null,
    client_company: input.clientCompany ?? null,
    to_recipients: input.toRecipients,
    cc_recipients: input.ccRecipients,
    bcc_recipients: input.bccRecipients,
    subject: input.subject,
    body_text: input.bodyText,
    body_html: input.bodyHtml,
    prompt: input.prompt ?? null,
    status: input.status,
    provider_message_id: input.providerMessageId ?? null,
    error_message: input.errorMessage ?? null,
    sent_by: input.sentBy ?? null,
    sent_at: input.sentAt ?? null,
  };

  if (input.id) {
    const { data, error } = await supabase
      .from("client_email_messages")
      .update(payload)
      .eq("id", input.id)
      .select("*")
      .single();
    if (error) {
      logger.error("client-email.update.failed", { error: error.message });
      throw new Error("Failed to update email record");
    }
    return mapMessage(data);
  }

  const { data, error } = await supabase
    .from("client_email_messages")
    .insert(payload)
    .select("*")
    .single();

  if (error) {
    logger.error("client-email.insert.failed", { error: error.message });
    throw new Error("Failed to save email record");
  }
  return mapMessage(data);
}

export async function getEmailBranding(): Promise<EmailBrandingSettings> {
  if (!isSupabaseConfigured()) {
    return memoryGetBranding();
  }

  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("email_branding_settings")
    .select("*")
    .eq("id", "default")
    .maybeSingle();

  if (error) {
    logger.warn("client-email.branding.get.failed", { error: error.message });
    return defaultEmailBranding();
  }
  if (!data) return defaultEmailBranding();
  return mapBranding(data);
}

export async function saveEmailBranding(
  input: EmailBrandingUpdateInput,
): Promise<EmailBrandingSettings> {
  const resolved = resolveEmailBranding({
    id: "default",
    companyName: input.companyName,
    tagline: input.tagline || undefined,
    websiteUrl: input.websiteUrl || undefined,
    contactEmail: input.contactEmail || undefined,
    contactPhone: input.contactPhone || undefined,
    contactAddress: input.contactAddress || undefined,
    logoUrl: input.logoUrl || undefined,
    signatureHtml: input.signatureHtml || undefined,
    updatedBy: input.updatedBy,
  });

  if (!isSupabaseConfigured()) {
    return memorySaveBranding(resolved);
  }

  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("email_branding_settings")
    .upsert(
      {
        id: "default",
        company_name: resolved.companyName,
        tagline: resolved.tagline ?? null,
        website_url: resolved.websiteUrl ?? null,
        contact_email: resolved.contactEmail ?? null,
        contact_phone: resolved.contactPhone ?? null,
        contact_address: resolved.contactAddress ?? null,
        logo_url: resolved.logoUrl ?? null,
        signature_html: resolved.signatureHtml ?? null,
        updated_by: input.updatedBy ?? null,
      },
      { onConflict: "id" },
    )
    .select("*")
    .single();

  if (error) {
    logger.error("client-email.branding.save.failed", { error: error.message });
    throw new Error("Failed to save branding settings");
  }
  return mapBranding(data);
}
