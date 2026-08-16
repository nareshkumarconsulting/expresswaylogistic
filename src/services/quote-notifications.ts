import {
  customerReceivedEmail,
  customerQuoteEmail,
  forwarderRfqEmail,
} from "@/features/quotes/email-templates";
import { sendEmail } from "@/lib/send-email";
import { logger } from "@/lib/logger";
import type { Forwarder, QuoteRequest } from "@/types";

export async function sendCustomerQuoteReceivedAck(
  quote: QuoteRequest,
): Promise<boolean> {
  const email = customerReceivedEmail(quote);
  const result = await sendEmail({
    to: quote.email,
    ...email,
  });
  if (!result.ok) {
    logger.warn("quote.ack_email.failed", {
      quoteId: quote.id,
      error: result.error,
    });
  }
  return result.ok;
}

export async function sendCustomerFinalQuote(
  quote: QuoteRequest,
  finalAmount: number,
) {
  const email = customerQuoteEmail(quote, finalAmount);
  return sendEmail({
    to: quote.email,
    ...email,
  });
}

export async function sendForwarderRfq(
  quote: QuoteRequest,
  forwarder: Forwarder,
  deadline?: string,
) {
  const email = forwarderRfqEmail(quote, deadline);
  return sendEmail({
    to: forwarder.email,
    ...email,
  });
}
