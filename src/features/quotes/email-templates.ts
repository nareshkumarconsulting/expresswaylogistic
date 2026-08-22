import { siteConfig } from "@/config/site";
import { QUOTE_RESPONSE_STATEMENT } from "@/constants/entity";
import { SERVICE_TYPE_LABELS } from "@/features/quotes/labels";
import { formatMoney } from "@/features/quotes/money";
import {
  formatCargoItemDimensions,
  formatCargoItemPackageType,
  incotermLabel,
  insuranceLabel,
  packingLabel,
  projectCargoLabel,
} from "@/features/quotes/wizard-payload";
import type { Forwarder, QuoteRequest } from "@/types";

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function greetingName(name?: string | null): string {
  const trimmed = name?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : "Sir/Madam";
}

function serviceLabel(quote: QuoteRequest): string {
  return SERVICE_TYPE_LABELS[quote.serviceType] ?? quote.serviceType;
}

function lane(quote: QuoteRequest): string {
  return `${quote.origin} to ${quote.destination}`;
}

function signatureLines(): string[] {
  return [
    "Regards,",
    siteConfig.name,
    siteConfig.contact.address,
    siteConfig.contact.phone,
    siteConfig.contact.email,
  ];
}

function signatureHtml(): string {
  const [regards, company, address, phone, email] = signatureLines();
  return `
    <p style="margin:28px 0 0;">
      ${escapeHtml(regards)}<br/>
      <strong>${escapeHtml(company)}</strong><br/>
      ${escapeHtml(address)}<br/>
      ${escapeHtml(phone)}<br/>
      <a href="mailto:${escapeHtml(email)}" style="color:#0f172a;">${escapeHtml(email)}</a>
    </p>
  `;
}

function signatureText(): string {
  return signatureLines().join("\n");
}

function wrapLetter(bodyHtml: string, bodyText: string): { html: string; text: string } {
  return {
    html: `
      <div style="font-family:Arial,Helvetica,sans-serif;color:#0f172a;line-height:1.6;max-width:640px;font-size:15px;">
        ${bodyHtml}
        ${signatureHtml()}
      </div>
    `.trim(),
    text: `${bodyText.trim()}\n\n${signatureText()}`,
  };
}

function detailRow(label: string, value?: string | number | null): string {
  if (value == null || value === "") return "";
  return `<tr>
    <td style="padding:8px 12px;border:1px solid #e2e8f0;color:#475569;width:38%;vertical-align:top;">${escapeHtml(label)}</td>
    <td style="padding:8px 12px;border:1px solid #e2e8f0;">${escapeHtml(String(value))}</td>
  </tr>`;
}

function detailRowText(label: string, value?: string | number | null): string {
  if (value == null || value === "") return "";
  return `${label}: ${value}`;
}

function shipmentDetailRows(quote: QuoteRequest): {
  htmlRows: string;
  textRows: string[];
} {
  const wizard = quote.wizard;
  const rows: Array<[string, string | number | null | undefined]> = [
    ["Quotation reference", quote.id],
    ["Company", quote.company],
    ["Contact", quote.name],
    ["Origin", quote.origin],
    ["Destination", quote.destination],
    ["Service", serviceLabel(quote)],
    ["Cargo ready date", wizard?.cargoReadyDate ?? quote.requiredDeliveryDate],
    ["Origin pickup", quote.originPickup ? "Required" : "Not requested"],
    [
      "Destination delivery",
      quote.destinationDelivery ? "Required" : "Not requested",
    ],
    ["Incoterms", wizard ? incotermLabel(wizard) : null],
    ["Packages", quote.totalPackages],
    ["Weight / volume", quote.approxWeight],
  ];

  const htmlRows = rows.map(([label, value]) => detailRow(label, value)).join("");
  const textRows = rows
    .map(([label, value]) => detailRowText(label, value))
    .filter(Boolean);

  const cargoHtml = (wizard?.cargoItems ?? [])
    .map((item, index) => {
      const parts = [
        item.description,
        item.hsCode ? `HS ${item.hsCode}` : null,
        `Qty ${item.quantity}`,
        formatCargoItemPackageType(item),
        `${item.weightKg} KG / unit`,
        formatCargoItemDimensions(item),
      ].filter(Boolean);
      return detailRow(`Cargo line ${index + 1}`, parts.join(" · "));
    })
    .join("");

  const cargoText = (wizard?.cargoItems ?? []).map((item, index) => {
    const parts = [
      item.description,
      item.hsCode ? `HS ${item.hsCode}` : null,
      `Qty ${item.quantity}`,
      formatCargoItemPackageType(item),
      `${item.weightKg} KG / unit`,
      formatCargoItemDimensions(item),
    ].filter(Boolean);
    return `Cargo line ${index + 1}: ${parts.join(" · ")}`;
  });

  const notes = [
    wizard?.insurance
      ? detailRow("Insurance", insuranceLabel(wizard) ?? "Requested")
      : "",
    wizard?.projectCargo
      ? detailRow("Project cargo", projectCargoLabel(wizard) ?? "Requested")
      : "",
    wizard?.packingRequired
      ? detailRow("Packing", packingLabel(wizard) ?? "Requested")
      : "",
    wizard?.customsBrokerage
      ? detailRow("Customs brokerage", "Requested")
      : "",
    wizard?.dangerousCargoNotes
      ? detailRow("Dangerous cargo notes", wizard.dangerousCargoNotes)
      : "",
  ].join("");

  const notesText = [
    wizard?.insurance
      ? `Insurance: ${insuranceLabel(wizard) ?? "Requested"}`
      : "",
    wizard?.projectCargo
      ? `Project cargo: ${projectCargoLabel(wizard) ?? "Requested"}`
      : "",
    wizard?.packingRequired
      ? `Packing: ${packingLabel(wizard) ?? "Requested"}`
      : "",
    wizard?.customsBrokerage ? "Customs brokerage: Requested" : "",
    wizard?.dangerousCargoNotes
      ? `Dangerous cargo notes: ${wizard.dangerousCargoNotes}`
      : "",
  ].filter(Boolean);

  return {
    htmlRows: htmlRows + cargoHtml + notes,
    textRows: [...textRows, ...cargoText, ...notesText],
  };
}

function detailsTable(title: string, quote: QuoteRequest, extraHtml = ""): string {
  const { htmlRows } = shipmentDetailRows(quote);
  return `
    <h2 style="font-size:16px;margin:24px 0 10px;">${escapeHtml(title)}</h2>
    <table style="width:100%;border-collapse:collapse;font-size:14px;background:#f8fafc;">
      ${htmlRows}
      ${extraHtml}
    </table>
  `;
}

function detailsText(title: string, quote: QuoteRequest, extra: string[] = []): string {
  const { textRows } = shipmentDetailRows(quote);
  return `${title}\n${[...textRows, ...extra].join("\n")}`;
}

export function customerReceivedEmail(quote: QuoteRequest) {
  const name = greetingName(quote.name);
  const intro = `Thank you for reaching out to ${siteConfig.name} for your shipment requirement.`;
  const body = `We have received your quotation request for the shipment from ${lane(quote)}. Our freight desk is reviewing the details and will share a quotation shortly.`;

  const { html, text } = wrapLetter(
    `
      <p>Dear ${escapeHtml(name)},</p>
      <p>${escapeHtml(intro)}</p>
      <p>${escapeHtml(body)}</p>
      ${detailsTable("Request details", quote)}
      <p>${escapeHtml(QUOTE_RESPONSE_STATEMENT)}</p>
    `,
    [
      `Dear ${name},`,
      "",
      intro,
      "",
      body,
      "",
      detailsText("Request details", quote),
      "",
      QUOTE_RESPONSE_STATEMENT,
    ].join("\n"),
  );

  return {
    subject: `Quote request received · ${quote.id} · ${quote.origin} → ${quote.destination}`,
    html,
    text,
  };
}

export function customerQuoteEmail(quote: QuoteRequest, finalAmount: number) {
  const name = greetingName(quote.name);
  const currency = quote.currency ?? "INR";
  const amount = formatMoney(finalAmount, currency);
  const validity = quote.quoteValidity ?? "7 days";
  const intro = `Thank you for reaching out to ${siteConfig.name} for your shipment requirement.`;
  const offer = `We are pleased to share our quotation for the requested shipment from ${lane(quote)}. Please find the quotation details below:`;
  const close = "We hope the above quotation meets your requirements. Please feel free to reach out to us if you have any questions or would like to discuss the shipment further.";
  const thanks = `Thank you for considering ${siteConfig.name}. We look forward to serving you and building a long-term business relationship.`;

  const { html, text } = wrapLetter(
    `
      <p>Dear ${escapeHtml(name)},</p>
      <p>${escapeHtml(intro)}</p>
      <p>${escapeHtml(offer)}</p>
      ${detailsTable(
        "Quotation Details",
        quote,
        `${detailRow("Quotation amount", amount)}${detailRow("Validity", validity)}`,
      )}
      <p>${escapeHtml(close)}</p>
      <p>${escapeHtml(thanks)}</p>
    `,
    [
      `Dear ${name},`,
      "",
      intro,
      "",
      offer,
      "",
      detailsText("Quotation Details", quote, [
        `Quotation amount: ${amount}`,
        `Validity: ${validity}`,
      ]),
      "",
      close,
      "",
      thanks,
    ].join("\n"),
  );

  return {
    subject: `Quotation ${quote.id} · ${quote.origin} → ${quote.destination}`,
    html,
    text,
  };
}

export function forwarderRfqEmail(
  quote: QuoteRequest,
  forwarder: Forwarder,
  deadline?: string,
) {
  const name = greetingName(forwarder.contactPerson || forwarder.companyName);
  const intro = `We hope this email finds you well.`;
  const request = `We are requesting a freight quotation for a shipment from ${lane(quote)}. Please find the shipment details below and reply with your rate, transit time, validity, and any additional charges.`;
  const close = "Please feel free to reach out to us if you need any further information to quote this shipment.";
  const thanks = `Thank you for your support. We look forward to working with you.`;

  const { html, text } = wrapLetter(
    `
      <p>Dear ${escapeHtml(name)},</p>
      <p>${escapeHtml(intro)}</p>
      <p>${escapeHtml(request)}</p>
      ${detailsTable(
        "Shipment Details",
        quote,
        deadline ? detailRow("Response deadline", deadline) : "",
      )}
      <p>${escapeHtml(close)}</p>
      <p>${escapeHtml(thanks)}</p>
    `,
    [
      `Dear ${name},`,
      "",
      intro,
      "",
      request,
      "",
      detailsText(
        "Shipment Details",
        quote,
        deadline ? [`Response deadline: ${deadline}`] : [],
      ),
      "",
      close,
      "",
      thanks,
    ].join("\n"),
  );

  return {
    subject: `Quotation request ${quote.id} · ${quote.origin} → ${quote.destination}`,
    html,
    text,
  };
}
