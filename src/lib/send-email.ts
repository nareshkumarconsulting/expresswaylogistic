import { siteConfig } from "@/config/site";
import { logger } from "@/lib/logger";

export type SendEmailInput = {
  to: string | string[];
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
};

export type SendEmailResult = {
  ok: boolean;
  id?: string;
  error?: string;
};

function defaultFromAddress(): string {
  return (
    process.env.QUOTE_EMAIL_FROM?.trim() ||
    process.env.LEAD_NOTIFY_FROM?.trim() ||
    `${siteConfig.name} <onboarding@resend.dev>`
  );
}

export function isOutboundEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY?.trim());
}

export async function sendEmail(
  input: SendEmailInput,
): Promise<SendEmailResult> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    return { ok: false, error: "RESEND_API_KEY is not configured" };
  }

  const to = Array.isArray(input.to) ? input.to : [input.to];
  const replyTo =
    input.replyTo?.trim() ||
    process.env.QUOTE_EMAIL_REPLY_TO?.trim() ||
    siteConfig.contact.email;

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: defaultFromAddress(),
        to,
        reply_to: replyTo,
        subject: input.subject,
        html: input.html,
        text: input.text,
      }),
    });

    const body = (await response.json().catch(() => ({}))) as {
      id?: string;
      message?: string;
    };

    if (!response.ok) {
      const error = body.message || `Resend HTTP ${response.status}`;
      logger.warn("email.send.failed", {
        status: response.status,
        error,
        to,
      });
      return { ok: false, error };
    }

    logger.info("email.send.ok", { id: body.id, to, subject: input.subject });
    return { ok: true, id: body.id };
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown";
    logger.warn("email.send.exception", { error: message, to });
    return { ok: false, error: message };
  }
}
