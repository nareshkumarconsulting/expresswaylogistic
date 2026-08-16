import { sendForwarderRfq } from "@/services/quote-notifications";
import { getForwarder } from "@/services/forwarders-repository";
import {
  getManagedQuote,
  logQuoteActivity,
  memoryUpsertForwarderRequest,
} from "@/services/quotes-repository";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createSupabaseAdmin } from "@/lib/supabase/server";
import { logger } from "@/lib/logger";
import type { QuoteForwarderRequest, QuoteRequest } from "@/types";

export async function sendQuoteToForwarders(input: {
  quoteId: string;
  forwarderIds: string[];
  responseDeadline?: string;
  actor?: string;
}): Promise<QuoteRequest> {
  const quote = await getManagedQuote(input.quoteId);
  if (!quote) throw new Error("Quote not found");

  const actor = input.actor ?? "ops";
  const sentAt = new Date().toISOString();
  let sentCount = 0;
  let failedCount = 0;

  for (const forwarderId of input.forwarderIds) {
    const forwarder = await getForwarder(forwarderId);
    if (!forwarder || forwarder.status !== "Active") {
      failedCount += 1;
      continue;
    }

    const result = await sendForwarderRfq(
      quote,
      forwarder,
      input.responseDeadline,
    );
    const status = result.ok ? "Awaiting Response" : "Pending";
    if (result.ok) sentCount += 1;
    else failedCount += 1;

    const row: QuoteForwarderRequest = {
      id: crypto.randomUUID(),
      quoteRequestId: quote.id,
      forwarderId: forwarder.id,
      forwarderName: forwarder.companyName,
      forwarderEmail: forwarder.email,
      status,
      sentAt: result.ok ? sentAt : undefined,
      responseDeadline: input.responseDeadline,
      currency: quote.currency ?? "INR",
    };

    if (!isSupabaseConfigured()) {
      memoryUpsertForwarderRequest(row);
    } else {
      const supabase = createSupabaseAdmin();
      const { error } = await supabase.from("quote_forwarder_requests").upsert(
        {
          quote_request_id: quote.id,
          forwarder_id: forwarder.id,
          status,
          sent_at: result.ok ? sentAt : null,
          response_deadline: input.responseDeadline || null,
          currency: quote.currency ?? "INR",
        },
        { onConflict: "quote_request_id,forwarder_id" },
      );
      if (error) {
        logger.warn("quote.forwarder_request.upsert.failed", {
          error: error.message,
        });
      }
    }

    await logQuoteActivity(
      quote.id,
      result.ok ? "forwarder_rfq_sent" : "forwarder_rfq_failed",
      result.ok
        ? `Quote request sent to ${forwarder.companyName}`
        : `Failed to email ${forwarder.companyName}: ${result.error ?? "unknown"}`,
      actor,
      { forwarderId: forwarder.id, resendId: result.id, error: result.error },
    );
  }

  const nextStatus =
    sentCount > 0 ? "Awaiting Forwarder Quotes" : quote.status;

  if (sentCount > 0) {
    if (!isSupabaseConfigured()) {
      const { memorySaveQuote, memoryGetQuote } = await import(
        "@/services/quotes-memory"
      );
      const current = memoryGetQuote(quote.id);
      if (current) {
        memorySaveQuote({
          ...current,
          status: nextStatus,
        });
      }
    } else {
      const supabase = createSupabaseAdmin();
      await supabase
        .from("quote_requests")
        .update({ status: nextStatus })
        .eq("id", quote.id);
    }

    await logQuoteActivity(
      quote.id,
      "forwarders_selected",
      `${input.forwarderIds.length} forwarder(s) selected · ${sentCount} emailed`,
      actor,
      { sentCount, failedCount },
    );
  }

  const updated = await getManagedQuote(quote.id);
  if (!updated) throw new Error("Quote not found after send");
  return updated;
}

export async function recordForwarderQuote(input: {
  quoteId: string;
  forwarderRequestId: string;
  quotationAmount: number;
  currency?: string;
  shippingCharges?: number | null;
  additionalCharges?: number | null;
  transitTime?: string;
  validity?: string;
  carrier?: string;
  notes?: string;
  actor?: string;
}): Promise<QuoteRequest> {
  const quote = await getManagedQuote(input.quoteId);
  if (!quote) throw new Error("Quote not found");
  const existing = (quote.forwarderRequests ?? []).find(
    (row) => row.id === input.forwarderRequestId,
  );
  if (!existing) throw new Error("Forwarder request not found");

  const actor = input.actor ?? "ops";
  const now = new Date().toISOString();

  if (!isSupabaseConfigured()) {
    memoryUpsertForwarderRequest({
      ...existing,
      status: "Quote Received",
      quotationAmount: input.quotationAmount,
      currency: input.currency ?? existing.currency,
      shippingCharges: input.shippingCharges ?? undefined,
      additionalCharges: input.additionalCharges ?? undefined,
      transitTime: input.transitTime,
      validity: input.validity,
      carrier: input.carrier,
      notes: input.notes,
      responseAt: now,
    });
    const { memorySaveQuote, memoryGetQuote } = await import(
      "@/services/quotes-memory"
    );
    const current = memoryGetQuote(quote.id);
    if (current) {
      memorySaveQuote({ ...current, status: "Quote Received" });
    }
  } else {
    const supabase = createSupabaseAdmin();
    const { error } = await supabase
      .from("quote_forwarder_requests")
      .update({
        status: "Quote Received",
        quotation_amount: input.quotationAmount,
        currency: input.currency ?? existing.currency,
        shipping_charges: input.shippingCharges ?? null,
        additional_charges: input.additionalCharges ?? null,
        transit_time: input.transitTime ?? null,
        validity: input.validity ?? null,
        carrier: input.carrier ?? null,
        notes: input.notes ?? null,
        response_at: now,
      })
      .eq("id", input.forwarderRequestId);

    if (error) {
      logger.error("quote.forwarder_quote.update.failed", {
        error: error.message,
      });
      throw new Error("Failed to record forwarder quote");
    }

    await supabase
      .from("quote_requests")
      .update({ status: "Quote Received" })
      .eq("id", quote.id);
  }

  await logQuoteActivity(
    quote.id,
    "forwarder_quote_received",
    `Quote received from ${existing.forwarderName} – ${input.quotationAmount}`,
    actor,
    { forwarderRequestId: existing.id, amount: input.quotationAmount },
  );

  const updated = await getManagedQuote(quote.id);
  if (!updated) throw new Error("Quote not found");
  return updated;
}
