import { siteConfig } from "@/config/site";
import { logger } from "@/lib/logger";

export type LeadNotifyType =
  | "quote_request"
  | "quote_wizard_request"
  | "appointment_request"
  | "voice_agent_event"
  | "email_quote_draft"
  | "email_quote_needs_info";

export type LeadNotifyInput = {
  type: LeadNotifyType;
  subject: string;
  summaryLines: string[];
  payload: Record<string, unknown>;
  referenceId?: string;
};

export type LeadNotifyResult = {
  webhookOk: boolean;
  emailOk: boolean;
  delivered: boolean;
};

function buildTextBody(input: LeadNotifyInput, receivedAt: string): string {
  const lines = [
    input.subject,
    "",
    ...input.summaryLines,
    "",
    `Type: ${input.type}`,
    input.referenceId ? `Reference: ${input.referenceId}` : null,
    `Received: ${receivedAt}`,
    "",
    "Payload:",
    JSON.stringify(input.payload, null, 2),
  ].filter((line): line is string => line != null);

  return lines.join("\n");
}

function buildHtmlBody(input: LeadNotifyInput, receivedAt: string): string {
  const summary = input.summaryLines
    .map((line) => `<li>${escapeHtml(line)}</li>`)
    .join("");
  const payload = escapeHtml(JSON.stringify(input.payload, null, 2));

  return `
    <div style="font-family: system-ui, sans-serif; color: #0f172a;">
      <h2 style="margin: 0 0 12px;">${escapeHtml(input.subject)}</h2>
      <p style="margin: 0 0 8px; color: #64748b;">
        ${escapeHtml(input.type)}${
          input.referenceId
            ? ` · Ref ${escapeHtml(input.referenceId)}`
            : ""
        }
      </p>
      <ul style="padding-left: 18px; line-height: 1.5;">${summary}</ul>
      <p style="margin: 16px 0 8px; color: #64748b; font-size: 13px;">
        Received ${escapeHtml(receivedAt)}
      </p>
      <pre style="background:#f8fafc;border:1px solid #e2e8f0;padding:12px;overflow:auto;font-size:12px;">${payload}</pre>
    </div>
  `;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

async function postWebhook(
  webhookUrl: string,
  input: LeadNotifyInput,
  receivedAt: string,
): Promise<boolean> {
  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: input.type,
        subject: input.subject,
        summary: input.summaryLines,
        payload: input.payload,
        referenceId: input.referenceId,
        receivedAt,
      }),
    });

    if (!response.ok) {
      logger.warn("lead.notify.webhook.http_error", {
        type: input.type,
        status: response.status,
      });
      return false;
    }

    return true;
  } catch (error) {
    logger.warn("lead.notify.webhook.failed", {
      type: input.type,
      error: error instanceof Error ? error.message : "unknown",
    });
    return false;
  }
}

async function sendResendEmail(
  input: LeadNotifyInput,
  receivedAt: string,
): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const to =
    process.env.LEAD_NOTIFY_EMAIL?.trim() || siteConfig.contact.email;
  const from =
    process.env.LEAD_NOTIFY_FROM?.trim() ||
    `${siteConfig.name} <onboarding@resend.dev>`;

  if (!apiKey) return false;

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject: input.subject,
        text: buildTextBody(input, receivedAt),
        html: buildHtmlBody(input, receivedAt),
      }),
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      logger.warn("lead.notify.email.http_error", {
        type: input.type,
        status: response.status,
        detail: detail.slice(0, 300),
      });
      return false;
    }

    return true;
  } catch (error) {
    logger.warn("lead.notify.email.failed", {
      type: input.type,
      error: error instanceof Error ? error.message : "unknown",
    });
    return false;
  }
}

/**
 * Deliver a lead notification:
 * 1. POST to CONTACT_WEBHOOK_URL when configured
 * 2. If webhook is missing or fails, email via Resend when RESEND_API_KEY is set
 */
export async function notifyLead(
  input: LeadNotifyInput,
): Promise<LeadNotifyResult> {
  const receivedAt = new Date().toISOString();
  const webhookUrl =
    process.env.CONTACT_WEBHOOK_URL?.trim() ||
    process.env.VOICE_AGENT_WEBHOOK_URL?.trim();

  let webhookOk = false;
  if (webhookUrl) {
    webhookOk = await postWebhook(webhookUrl, input, receivedAt);
  }

  let emailOk = false;
  const shouldEmail = !webhookUrl || !webhookOk;
  if (shouldEmail) {
    emailOk = await sendResendEmail(input, receivedAt);
  }

  const delivered = webhookOk || emailOk;

  if (!delivered) {
    logger.warn("lead.notify.undelivered", {
      type: input.type,
      webhookConfigured: Boolean(webhookUrl),
      emailConfigured: Boolean(process.env.RESEND_API_KEY),
    });
  } else {
    logger.info("lead.notify.delivered", {
      type: input.type,
      webhookOk,
      emailOk,
      usedEmailFallback: shouldEmail && emailOk,
    });
  }

  return { webhookOk, emailOk, delivered };
}
