import { renderClientEmailFromPlainBody } from "@/features/client-email/email-render";
import type { ClientEmailSendInput } from "@/features/client-email/schemas";
import { sendEmail } from "@/lib/send-email";
import { logger } from "@/lib/logger";
import {
  getEmailBranding,
  saveClientEmailMessage,
} from "@/services/client-email-repository";
import { logQuoteActivity } from "@/services/quotes-repository";
import type { ClientEmailMessage } from "@/types";

export async function sendClientEmailMessage(
  input: ClientEmailSendInput,
): Promise<{ ok: boolean; message: ClientEmailMessage; error?: string }> {
  const branding = await getEmailBranding();
  const senderName = input.senderName?.trim() || input.sentBy?.trim();
  const rendered = renderClientEmailFromPlainBody(
    input.bodyText,
    branding,
    senderName,
  );
  const to = input.to;
  const cc = input.cc ?? [];
  const bcc = input.bcc ?? [];

  const sendResult = await sendEmail({
    to,
    cc,
    bcc,
    subject: input.subject,
    html: rendered.html,
    text: rendered.text,
  });

  const status = sendResult.ok ? "sent" : "failed";
  const sentAt = sendResult.ok ? new Date().toISOString() : undefined;

  const message = await saveClientEmailMessage({
    id: input.retryOfId,
    quoteRequestId: input.quoteRequestId,
    clientName: input.clientName,
    clientCompany: input.clientCompany,
    toRecipients: to,
    ccRecipients: cc,
    bccRecipients: bcc,
    subject: input.subject,
    bodyText: input.bodyText,
    bodyHtml: rendered.html,
    prompt: input.prompt,
    status,
    providerMessageId: sendResult.id,
    errorMessage: sendResult.ok ? undefined : sendResult.error,
    sentBy: senderName || input.sentBy || "Operations",
    sentAt,
  });

  if (input.quoteRequestId) {
    await logQuoteActivity(
      input.quoteRequestId,
      sendResult.ok ? "client_email_sent" : "client_email_failed",
      sendResult.ok
        ? `Client email sent: ${input.subject}`
        : `Client email failed: ${sendResult.error ?? "unknown error"}`,
      input.sentBy ?? senderName ?? "Operations",
      {
        messageId: message.id,
        to,
        cc,
        bcc,
        providerMessageId: sendResult.id,
        error: sendResult.error,
      },
    );
  }

  if (!sendResult.ok) {
    logger.warn("client-email.send.failed", {
      error: sendResult.error,
      to,
      subject: input.subject,
    });
  }

  return {
    ok: sendResult.ok,
    message,
    error: sendResult.error,
  };
}
