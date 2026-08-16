import { siteConfig } from "@/config/site";
import { QUOTE_RESPONSE_STATEMENT } from "@/constants/entity";
import { formatMoney } from "@/features/quotes/money";
import type { QuoteRequest } from "@/types";

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function wrap(title: string, body: string): { html: string; text: string } {
  const html = `
    <div style="font-family:system-ui,sans-serif;color:#0f172a;line-height:1.5;max-width:640px;">
      <p style="font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#64748b;margin:0 0 8px;">${escapeHtml(siteConfig.name)}</p>
      <h1 style="font-size:20px;margin:0 0 16px;">${escapeHtml(title)}</h1>
      ${body}
      <p style="margin-top:24px;font-size:13px;color:#64748b;">
        ${escapeHtml(siteConfig.contact.address)}<br/>
        ${escapeHtml(siteConfig.contact.phone)} · ${escapeHtml(siteConfig.contact.email)}
      </p>
    </div>
  `;
  const text = `${title}\n\n${body.replace(/<[^>]+>/g, "").replace(/\n{3,}/g, "\n\n")}\n\n${siteConfig.contact.phone} · ${siteConfig.contact.email}`;
  return { html, text };
}

function shipmentBlock(quote: QuoteRequest): string {
  return `
    <table style="width:100%;border-collapse:collapse;font-size:14px;">
      <tr><td style="padding:4px 0;color:#64748b;">Request ID</td><td>${escapeHtml(quote.id)}</td></tr>
      <tr><td style="padding:4px 0;color:#64748b;">Customer</td><td>${escapeHtml(quote.company)} (${escapeHtml(quote.name)})</td></tr>
      <tr><td style="padding:4px 0;color:#64748b;">Lane</td><td>${escapeHtml(quote.origin)} → ${escapeHtml(quote.destination)}</td></tr>
      <tr><td style="padding:4px 0;color:#64748b;">Service</td><td>${escapeHtml(quote.serviceType)}</td></tr>
      <tr><td style="padding:4px 0;color:#64748b;">Packages</td><td>${quote.totalPackages ?? "—"}</td></tr>
      <tr><td style="padding:4px 0;color:#64748b;">Weight</td><td>${escapeHtml(quote.approxWeight ?? "—")}</td></tr>
      <tr><td style="padding:4px 0;color:#64748b;">Required delivery</td><td>${escapeHtml(quote.requiredDeliveryDate ?? "—")}</td></tr>
    </table>
    <p style="margin:12px 0 0;white-space:pre-wrap;">${escapeHtml(quote.message)}</p>
    ${quote.additionalRequirements ? `<p><strong>Additional requirements:</strong> ${escapeHtml(quote.additionalRequirements)}</p>` : ""}
  `;
}

export function customerReceivedEmail(quote: QuoteRequest) {
  const title = `We received your quotation request ${quote.id}`;
  const { html, text } = wrap(
    title,
    `<p>Thank you for contacting ${escapeHtml(siteConfig.name)}. ${escapeHtml(QUOTE_RESPONSE_STATEMENT)}</p>${shipmentBlock(quote)}`,
  );
  return {
    subject: `Quote request received · ${quote.id}`,
    html,
    text,
  };
}

export function customerQuoteEmail(quote: QuoteRequest, finalAmount: number) {
  const currency = quote.currency ?? "INR";
  const title = `Quotation ${quote.id}`;
  const { html, text } = wrap(
    title,
    `
      <p>Please find our quotation for your shipment request.</p>
      ${shipmentBlock(quote)}
      <p style="font-size:18px;margin:16px 0 4px;"><strong>Final quotation: ${escapeHtml(formatMoney(finalAmount, currency))}</strong></p>
      <p>Validity: ${escapeHtml(quote.quoteValidity ?? "7 days")}</p>
      ${quote.internalNotes ? "" : ""}
    `,
  );
  return {
    subject: `Quotation ${quote.id} · ${quote.origin} → ${quote.destination}`,
    html,
    text,
  };
}

export function forwarderRfqEmail(
  quote: QuoteRequest,
  deadline?: string,
) {
  const title = `Quotation request ${quote.id}`;
  const { html, text } = wrap(
    title,
    `
      <p>Please provide a freight quotation for the shipment below. Reply to this email with your rate, transit time, validity, and any additional charges.</p>
      ${shipmentBlock(quote)}
      ${deadline ? `<p><strong>Response deadline:</strong> ${escapeHtml(deadline)}</p>` : ""}
      <p>Contact: ${escapeHtml(siteConfig.contact.email)} · ${escapeHtml(siteConfig.contact.phone)}</p>
    `,
  );
  return {
    subject: `RFQ ${quote.id} · ${quote.origin} → ${quote.destination}`,
    html,
    text,
  };
}
