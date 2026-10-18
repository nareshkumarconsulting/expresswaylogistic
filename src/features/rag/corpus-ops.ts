import { SERVICE_TYPE_LABELS } from "@/features/quotes/labels";
import type { RagDocument } from "@/features/rag/types";
import type { EmailIntelligence, ManagedShipment, QuoteRequest } from "@/types";

export function buildOpsCorpus(input: {
  shipments?: ManagedShipment[];
  quotes?: QuoteRequest[];
  emails?: EmailIntelligence[];
}): RagDocument[] {
  const docs: RagDocument[] = [];

  for (const shipment of input.shipments ?? []) {
    docs.push({
      id: `shipment-${shipment.id}`,
      kind: "shipment",
      title: `Shipment ${shipment.id}`,
      text: [
        `Shipment ${shipment.id}`,
        `Client: ${shipment.client}`,
        `Lane: ${shipment.origin} → ${shipment.destination}`,
        `Mode: ${shipment.type}`,
        `Status: ${shipment.status}`,
        `ETA: ${shipment.eta}`,
        shipment.carrierName ? `Carrier: ${shipment.carrierName}` : null,
        shipment.carrierRef ? `Carrier ref: ${shipment.carrierRef}` : null,
        `Risk score: ${shipment.riskScore ?? "n/a"}`,
        `Created: ${shipment.createdAt}`,
        `Updated: ${shipment.updatedAt}`,
      ]
        .filter(Boolean)
        .join("\n"),
      href: `/command-center/shipments?id=${encodeURIComponent(shipment.id)}`,
    });
  }

  for (const quote of input.quotes ?? []) {
    const serviceLabel =
      SERVICE_TYPE_LABELS[quote.serviceType] ?? quote.serviceType;
    docs.push({
      id: `quote-${quote.id}`,
      kind: "quote",
      title: `Quote ${quote.id}`,
      text: [
        `Quote request ${quote.id}`,
        `Contact: ${quote.name} (${quote.company})`,
        `Email: ${quote.email}`,
        `Lane: ${quote.origin} → ${quote.destination}`,
        `Service: ${serviceLabel}`,
        `Status: ${quote.status}`,
        quote.message ? `Cargo notes: ${quote.message}` : null,
        `Submitted: ${quote.submittedAt}`,
      ]
        .filter(Boolean)
        .join("\n"),
      href: `/command-center/quotes?quote=${encodeURIComponent(quote.id)}`,
    });
  }

  for (const email of input.emails ?? []) {
    docs.push({
      id: `email-${email.id}`,
      kind: "email",
      title: email.subject || `Email ${email.id}`,
      text: [
        `Email subject: ${email.subject}`,
        `From: ${email.senderName ? `${email.senderName} <${email.senderEmail}>` : email.senderEmail}`,
        `Category: ${email.category}`,
        `Status: ${email.status}`,
        `Received: ${email.receivedAt}`,
        email.summary ? `Summary: ${email.summary}` : null,
        email.body ? `Body: ${email.body.slice(0, 800)}` : null,
      ]
        .filter(Boolean)
        .join("\n"),
      href: `/command-center/emails?id=${encodeURIComponent(email.id)}`,
    });
  }

  return docs;
}
