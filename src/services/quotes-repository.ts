import type { QuoteUpdateInput } from "@/features/quotes/schemas";
import {
  computeCustomerQuote,
  computeFromForwarder,
  formatMoney,
  parseAmount,
} from "@/features/quotes/money";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { Database, Json } from "@/lib/supabase/database.types";
import { createSupabaseAdmin } from "@/lib/supabase/server";
import { logger } from "@/lib/logger";
import { sendCustomerFinalQuote } from "@/services/quote-notifications";
import { mapQuoteRowToQuoteRequest } from "@/services/leads-repository";
import {
  memoryAddActivity,
  memoryListActivity,
  memoryListForwarderRequests,
  memoryListQuotes,
  memorySaveQuote,
  memoryUpsertForwarderRequest,
} from "@/services/quotes-memory";
import type {
  PreviousQuoteSummary,
  QuoteActivityEntry,
  QuoteForwarderRequest,
  QuoteRequest,
  QuoteRequestStatus,
} from "@/types";

type QuoteRow = Database["public"]["Tables"]["quote_requests"]["Row"];
type ActivityRow = Database["public"]["Tables"]["quote_activity"]["Row"];
type ForwarderRequestRow =
  Database["public"]["Tables"]["quote_forwarder_requests"]["Row"];

function num(value: number | string | null | undefined): number | undefined {
  if (value == null || value === "") return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function enrichRepeat(
  quote: QuoteRequest,
  all: QuoteRequest[],
): QuoteRequest {
  const previousQuotes: PreviousQuoteSummary[] = all
    .filter(
      (item) =>
        item.id !== quote.id &&
        item.email.toLowerCase() === quote.email.toLowerCase() &&
        Boolean(item.quotedAmount || item.status === "Quoted" || item.status === "Accepted"),
    )
    .sort(
      (a, b) =>
        new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime(),
    )
    .map((item) => ({
      id: item.id,
      quotedAmount: item.quotedAmount,
      submittedAt: item.submittedAt,
      status: item.status,
    }));

  const sameCustomer = all.filter(
    (item) =>
      item.id !== quote.id &&
      (item.email.toLowerCase() === quote.email.toLowerCase() ||
        item.company.toLowerCase() === quote.company.toLowerCase()),
  );

  return {
    ...quote,
    isRepeatCustomer: sameCustomer.length > 0,
    previousQuotes,
  };
}

export function mapActivityRow(row: ActivityRow): QuoteActivityEntry {
  return {
    id: row.id,
    quoteRequestId: row.quote_request_id,
    action: row.action,
    message: row.message,
    actor: row.actor ?? undefined,
    metadata: (row.metadata as Record<string, unknown> | null) ?? undefined,
    createdAt: row.created_at,
  };
}

export function mapForwarderRequestRow(
  row: ForwarderRequestRow,
  forwarder: { company_name: string; email: string } | null,
): QuoteForwarderRequest {
  return {
    id: row.id,
    quoteRequestId: row.quote_request_id,
    forwarderId: row.forwarder_id,
    forwarderName: forwarder?.company_name ?? "Forwarder",
    forwarderEmail: forwarder?.email ?? "",
    status: row.status,
    sentAt: row.sent_at ?? undefined,
    responseAt: row.response_at ?? undefined,
    responseDeadline: row.response_deadline ?? undefined,
    quotationAmount: num(row.quotation_amount),
    currency: row.currency,
    shippingCharges: num(row.shipping_charges),
    additionalCharges: num(row.additional_charges),
    transitTime: row.transit_time ?? undefined,
    validity: row.validity ?? undefined,
    carrier: row.carrier ?? undefined,
    notes: row.notes ?? undefined,
  };
}

export async function logQuoteActivity(
  quoteId: string,
  action: string,
  message: string,
  actor?: string,
  metadata?: Record<string, unknown>,
): Promise<void> {
  if (!isSupabaseConfigured()) {
    memoryAddActivity(quoteId, { action, message, actor, metadata });
    return;
  }

  const supabase = createSupabaseAdmin();
  const { error } = await supabase.from("quote_activity").insert({
    quote_request_id: quoteId,
    action,
    message,
    actor: actor ?? null,
    metadata: (metadata ?? {}) as Json,
  });

  if (error) {
    logger.warn("quote.activity.insert.failed", {
      quoteId,
      action,
      error: error.message,
    });
  }
}

export async function listManagedQuotes(): Promise<QuoteRequest[]> {
  if (!isSupabaseConfigured()) {
    const all = memoryListQuotes();
    return all.map((quote) => enrichRepeat(quote, all));
  }

  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("quote_requests")
    .select("*")
    .order("submitted_at", { ascending: false });

  if (error) {
    logger.error("supabase.quote.list.failed", { error: error.message });
    throw new Error("Failed to load quote requests");
  }

  const mapped = (data ?? []).map((row) =>
    mapQuoteRowToQuoteRequest(row as QuoteRow),
  );
  return mapped.map((quote) => enrichRepeat(quote, mapped));
}

async function loadActivity(quoteId: string): Promise<QuoteActivityEntry[]> {
  if (!isSupabaseConfigured()) return memoryListActivity(quoteId);

  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("quote_activity")
    .select("*")
    .eq("quote_request_id", quoteId)
    .order("created_at", { ascending: false });

  if (error) {
    logger.warn("quote.activity.list.failed", { error: error.message });
    return [];
  }
  return (data ?? []).map(mapActivityRow);
}

async function loadForwarderRequests(
  quoteId: string,
): Promise<QuoteForwarderRequest[]> {
  if (!isSupabaseConfigured()) return memoryListForwarderRequests(quoteId);

  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("quote_forwarder_requests")
    .select("*")
    .eq("quote_request_id", quoteId)
    .order("sent_at", { ascending: true, nullsFirst: false });

  if (error) {
    logger.warn("quote.forwarder_requests.list.failed", {
      error: error.message,
    });
    return [];
  }

  const { listForwarders } = await import("@/services/forwarders-repository");
  const directory = await listForwarders();
  const byId = new Map(directory.map((row) => [row.id, row]));

  return (data ?? []).map((row) => {
    const forwarder = byId.get(row.forwarder_id);
    return mapForwarderRequestRow(row, forwarder
      ? { company_name: forwarder.companyName, email: forwarder.email }
      : null);
  });
}

export async function getManagedQuote(
  id: string,
): Promise<QuoteRequest | null> {
  const all = await listManagedQuotes();
  const quote = all.find((item) => item.id === id);
  if (!quote) return null;

  const [activity, forwarderRequests] = await Promise.all([
    loadActivity(id),
    loadForwarderRequests(id),
  ]);

  const selected = forwarderRequests.find(
    (row) => row.forwarderId === quote.selectedForwarderId,
  );

  return {
    ...quote,
    activity,
    forwarderRequests,
    selectedForwarderName: selected?.forwarderName,
  };
}

function applyUpdate(
  quote: QuoteRequest,
  update: QuoteUpdateInput,
): QuoteRequest {
  return {
    ...quote,
    status: update.status ?? quote.status,
    internalNotes: update.internalNotes ?? quote.internalNotes,
    quotedAmount: update.quotedAmount ?? quote.quotedAmount,
    currency: update.currency ?? quote.currency,
    additionalCharges:
      update.additionalCharges === undefined
        ? quote.additionalCharges
        : (update.additionalCharges ?? undefined),
    discount:
      update.discount === undefined ? quote.discount : (update.discount ?? undefined),
    quoteValidity: update.quoteValidity ?? quote.quoteValidity,
    assignedTo: update.assignedTo ?? quote.assignedTo,
    pickupLocation: update.pickupLocation ?? quote.pickupLocation,
    deliveryLocation: update.deliveryLocation ?? quote.deliveryLocation,
    requiredDeliveryDate:
      update.requiredDeliveryDate ?? quote.requiredDeliveryDate,
    additionalRequirements:
      update.additionalRequirements ?? quote.additionalRequirements,
    forwarderCost:
      update.forwarderCost === undefined
        ? quote.forwarderCost
        : (update.forwarderCost ?? undefined),
    margin:
      update.margin === undefined ? quote.margin : (update.margin ?? undefined),
    updatedAt: new Date().toISOString(),
  };
}

export async function updateManagedQuote(
  id: string,
  update: QuoteUpdateInput,
): Promise<QuoteRequest | null> {
  const current = await getManagedQuote(id);
  if (!current) return null;

  const next = applyUpdate(current, update);
  const actor = update.actor ?? "ops";

  if (!isSupabaseConfigured()) {
    memorySaveQuote(next);
    await logQuoteActivity(
      id,
      "quote_updated",
      `Quote updated${update.status && update.status !== current.status ? ` · status ${current.status} → ${update.status}` : ""}`,
      actor,
      { from: current.status, to: next.status },
    );
    return getManagedQuote(id);
  }

  const supabase = createSupabaseAdmin();
  const { error } = await supabase
    .from("quote_requests")
    .update({
      status: next.status,
      internal_notes: next.internalNotes ?? null,
      quoted_amount: next.quotedAmount ?? null,
      currency: next.currency ?? "INR",
      additional_charges: next.additionalCharges ?? null,
      discount: next.discount ?? null,
      quote_validity: next.quoteValidity ?? null,
      assigned_to: next.assignedTo ?? null,
      pickup_location: next.pickupLocation ?? null,
      delivery_location: next.deliveryLocation ?? null,
      required_delivery_date: next.requiredDeliveryDate || null,
      additional_requirements: next.additionalRequirements ?? null,
      forwarder_cost: next.forwarderCost ?? null,
      margin: next.margin ?? null,
    })
    .eq("id", id);

  if (error) {
    logger.error("quote.update.failed", { id, error: error.message });
    throw new Error("Failed to update quote");
  }

  if (update.status && update.status !== current.status) {
    await logQuoteActivity(
      id,
      "status_changed",
      `Status changed: ${current.status} → ${update.status}`,
      actor,
      { from: current.status, to: update.status },
    );
  } else {
    await logQuoteActivity(id, "quote_updated", "Quote details saved", actor);
  }

  return getManagedQuote(id);
}

export async function sendManagedCustomerQuote(
  id: string,
  update: QuoteUpdateInput,
): Promise<{ quote: QuoteRequest; emailOk: boolean; error?: string }> {
  const saved = await updateManagedQuote(id, update);
  if (!saved) {
    throw new Error("Quote not found");
  }

  const amount =
    parseAmount(saved.quotedAmount) ??
    computeCustomerQuote({
      amount: parseAmount(saved.quotedAmount),
      additionalCharges: saved.additionalCharges,
      discount: saved.discount,
    }) ??
    computeFromForwarder({
      forwarderCost: saved.forwarderCost,
      margin: saved.margin,
      additionalCharges: saved.additionalCharges,
    });

  if (amount == null) {
    throw new Error("Enter a quotation amount before sending");
  }

  const actor = update.actor ?? "ops";
  const result = await sendCustomerFinalQuote(saved, amount);

  const nextStatus: QuoteRequestStatus = result.ok
    ? "Quoted"
    : "Quote Ready / Email Failed";

  if (!isSupabaseConfigured()) {
    memorySaveQuote({
      ...saved,
      status: nextStatus,
      quotedAmount: formatMoney(amount, saved.currency ?? "INR"),
      quoteSentAt: result.ok ? new Date().toISOString() : saved.quoteSentAt,
      quoteSentTo: result.ok ? saved.email : saved.quoteSentTo,
      quoteSentBy: result.ok ? actor : saved.quoteSentBy,
    });
  } else {
    const supabase = createSupabaseAdmin();
    await supabase
      .from("quote_requests")
      .update({
        status: nextStatus,
        quoted_amount: formatMoney(amount, saved.currency ?? "INR"),
        quote_sent_at: result.ok ? new Date().toISOString() : undefined,
        quote_sent_to: result.ok ? saved.email : undefined,
        quote_sent_by: result.ok ? actor : undefined,
      })
      .eq("id", id);
  }

  await logQuoteActivity(
    id,
    result.ok ? "customer_quote_sent" : "customer_quote_email_failed",
    result.ok
      ? `Quotation sent to ${saved.email} · ${formatMoney(amount, saved.currency ?? "INR")}`
      : `Email failed: ${result.error ?? "unknown error"}`,
    actor,
    {
      to: saved.email,
      amount,
      resendId: result.id,
      error: result.error,
    },
  );

  const quote = await getManagedQuote(id);
  return {
    quote: quote ?? saved,
    emailOk: result.ok,
    error: result.error,
  };
}

export async function selectForwarderQuote(input: {
  quoteId: string;
  forwarderRequestId: string;
  margin?: number;
  additionalCharges?: number | null;
  finalAmount?: number;
  actor?: string;
}): Promise<QuoteRequest | null> {
  const quote = await getManagedQuote(input.quoteId);
  if (!quote) return null;

  const request = (quote.forwarderRequests ?? []).find(
    (row) => row.id === input.forwarderRequestId,
  );
  if (!request) throw new Error("Forwarder quote not found");

  const cost = request.quotationAmount ?? 0;
  const margin = input.margin ?? quote.margin ?? 0;
  const extra =
    input.additionalCharges === undefined
      ? (quote.additionalCharges ?? 0)
      : (input.additionalCharges ?? 0);
  const final =
    input.finalAmount ??
    computeFromForwarder({
      forwarderCost: cost,
      margin,
      additionalCharges: extra,
    }) ??
    cost + margin + extra;

  const actor = input.actor ?? "ops";

  if (!isSupabaseConfigured()) {
    memorySaveQuote({
      ...quote,
      selectedForwarderId: request.forwarderId,
      selectedForwarderName: request.forwarderName,
      forwarderCost: cost,
      margin,
      additionalCharges: extra,
      quotedAmount: formatMoney(final, quote.currency ?? "INR"),
      status: "Quote Received",
    });
  } else {
    const supabase = createSupabaseAdmin();
    await supabase
      .from("quote_requests")
      .update({
        selected_forwarder_id: request.forwarderId,
        forwarder_cost: cost,
        margin,
        additional_charges: extra,
        quoted_amount: formatMoney(final, quote.currency ?? "INR"),
        status: "Quote Received",
      })
      .eq("id", input.quoteId);
  }

  await logQuoteActivity(
    input.quoteId,
    "forwarder_selected",
    `${request.forwarderName} selected · cost ${formatMoney(cost)} · customer ${formatMoney(final)}`,
    actor,
    { forwarderId: request.forwarderId, cost, margin, extra, final },
  );

  return getManagedQuote(input.quoteId);
}

export { memoryUpsertForwarderRequest };
