import type {
  ClientEmailDraftInput,
  ClientEmailRefineInput,
} from "@/features/client-email/schemas";
import {
  composeClientEmailBodyText,
  type ClientEmailComposeParts,
} from "@/features/client-email/email-render";
import { completeJsonObject } from "@/lib/llm-json";
import { logger } from "@/lib/logger";
import { listEmailIntelligence } from "@/services/email-intelligence-repository";
import {
  getManagedQuote,
  listManagedQuotes,
} from "@/services/quotes-repository";
import type { EmailIntelligence, QuoteRequest } from "@/types";

export type ClientEmailDraftResult = ClientEmailComposeParts & {
  subject: string;
  suggestedTo: string[];
  clientName?: string;
  clientCompany?: string;
  quoteRequestId?: string;
  contextNotes: string[];
};

function asString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function parseDraftJson(raw: unknown): ClientEmailComposeParts & {
  subject?: string;
} | null {
  if (!raw || typeof raw !== "object") return null;
  const obj = raw as Record<string, unknown>;
  const subject = asString(obj.subject);
  const greeting = asString(obj.greeting);
  const body = asString(obj.body);
  const cta = asString(obj.cta);
  if (!greeting || !body) return null;
  return { subject, greeting, body, cta };
}

function isPlaceholderName(value?: string | null): boolean {
  if (!value?.trim()) return true;
  return /^(unknown(?:\s+company)?|n\/?a|valued\s+client|sir\/?madam|customer|client)$/i.test(
    value.trim(),
  );
}

/** Prefer a real person name; fall back to company team. */
export function resolveRecipientDisplayName(input: {
  quoteName?: string | null;
  quoteCompany?: string | null;
  clientName?: string | null;
  clientCompany?: string | null;
}): string | undefined {
  const person = [input.quoteName, input.clientName]
    .map((value) => value?.trim())
    .find((value) => value && !isPlaceholderName(value));
  if (person) return person;

  const company = [input.quoteCompany, input.clientCompany]
    .map((value) => value?.trim())
    .find((value) => value && !isPlaceholderName(value));
  if (company) return `${company} Team`;

  return undefined;
}

export function greetingForRecipient(name?: string): string {
  return name ? `Dear ${name},` : "Dear Sir/Madam,";
}

function suggestedTo(
  quote: QuoteRequest | undefined,
  clientEmail?: string,
): string[] {
  if (quote?.email) return [quote.email];
  if (clientEmail) return [clientEmail];
  return [];
}

async function loadQuoteContext(
  input: Pick<ClientEmailDraftInput, "quoteRequestId" | "clientEmail">,
): Promise<{
  quote?: QuoteRequest;
  relatedEmails: EmailIntelligence[];
  contextNotes: string[];
}> {
  const notes: string[] = [];
  let quote: QuoteRequest | undefined;

  if (input.quoteRequestId) {
    quote = (await getManagedQuote(input.quoteRequestId)) ?? undefined;
    if (!quote) notes.push("Selected quote was not found.");
  } else if (input.clientEmail) {
    const quotes = await listManagedQuotes();
    quote = quotes.find(
      (item) =>
        item.email.toLowerCase() === input.clientEmail!.toLowerCase(),
    );
  }

  let relatedEmails: EmailIntelligence[] = [];
  try {
    const emails = (await listEmailIntelligence()) ?? [];
    const needle = (
      quote?.email ??
      input.clientEmail ??
      ""
    ).toLowerCase();
    relatedEmails = emails
      .filter((email) => {
        if (quote?.id && email.quoteRequestId === quote.id) return true;
        if (!needle) return false;
        return email.senderEmail.toLowerCase() === needle;
      })
      .slice(0, 5);
  } catch (error) {
    logger.warn("client-email.context.emails_failed", {
      error: error instanceof Error ? error.message : "unknown",
    });
  }

  if (quote) {
    notes.push(
      `Using quote ${quote.id} for ${quote.company} (${quote.origin} → ${quote.destination}, status ${quote.status}).`,
    );
  }
  if (relatedEmails.length > 0) {
    notes.push(
      `Found ${relatedEmails.length} recent inbound email(s) from this client.`,
    );
  }
  if (!quote && !input.clientEmail) {
    notes.push(
      "No client quote selected — draft will avoid inventing shipment details.",
    );
  }

  return { quote, relatedEmails, contextNotes: notes };
}

function buildContextBlock(
  quote: QuoteRequest | undefined,
  emails: EmailIntelligence[],
  recipientName?: string,
  clientEmail?: string,
  clientCompany?: string,
): string {
  const lines: string[] = [];

  if (quote || recipientName || clientEmail) {
    lines.push("QUOTE / CLIENT CONTEXT (verified — use only these facts):");
    if (recipientName) {
      lines.push(`- Recipient name (REQUIRED in greeting): ${recipientName}`);
    }
    if (quote) {
      lines.push(`- Client name: ${quote.name}`);
      lines.push(`- Company: ${quote.company}`);
      lines.push(`- Email: ${quote.email}`);
      if (quote.phone) lines.push(`- Phone: ${quote.phone}`);
      lines.push(`- Quote ID: ${quote.id}`);
      lines.push(`- Status: ${quote.status}`);
      lines.push(`- Lane: ${quote.origin} → ${quote.destination}`);
      lines.push(`- Service: ${quote.serviceType}`);
      if (quote.requiredDeliveryDate) {
        lines.push(`- Required delivery: ${quote.requiredDeliveryDate}`);
      }
      if (quote.quotedAmount) {
        lines.push(`- Quoted amount: ${quote.quotedAmount}`);
      }
      if (quote.quoteValidity) lines.push(`- Validity: ${quote.quoteValidity}`);
      if (quote.message) lines.push(`- Client message: ${quote.message}`);
      if (quote.aiSuggestedReply) {
        lines.push(
          `- Background only (do not copy unless OPS asks): ${quote.aiSuggestedReply}`,
        );
      }
      const recentActivity = (quote.activity ?? []).slice(0, 5);
      for (const entry of recentActivity) {
        lines.push(
          `- Activity: ${entry.action} — ${entry.message} (${entry.createdAt})`,
        );
      }
    } else {
      if (clientCompany && !isPlaceholderName(clientCompany)) {
        lines.push(`- Company: ${clientCompany}`);
      }
      if (clientEmail) lines.push(`- Email: ${clientEmail}`);
    }
  } else {
    lines.push("No verified quote/shipment context was provided.");
  }

  if (emails.length > 0) {
    lines.push("");
    lines.push(
      "RECENT INBOUND COMMUNICATION (background only — do not change the email purpose):",
    );
    for (const email of emails) {
      lines.push(
        `- ${email.receivedAt}: "${email.subject}" — ${email.summary ?? "no summary"}`,
      );
    }
  }

  return lines.join("\n");
}

const SYSTEM_PROMPT = `You are the personal AI account manager for ExpressWay Logistic, a freight forwarding company.
Write concise, professional client emails that feel personally written for the specific client.

Rules:
- The OPS INSTRUCTION defines the email purpose. Subject and body must match that purpose.
- Quote / inbound email context is for verified facts only (names, company, quote ID, lane, status). Do not let status, missing fields, or prior AI replies rewrite the purpose.
- Never invent missing facts (rates, dates, AWB numbers, commitments, legal terms).
- Only use details present in the provided context.
- Ask for missing details only when the OPS INSTRUCTION asks for that (or clearly requires it to fulfill the ask). Do not default to an "additional details" request.
- Subject should be specific to the OPS INSTRUCTION (e.g. proposal / introduction / update) and may include the quote ID when relevant — not a generic follow-up unless instructed.
- Include a clear greeting, body, and soft CTA.
- greeting MUST use the Recipient name from context exactly (e.g. "Dear Naresh Kumar,"). Never use "Dear Valued Client," "Dear Customer," or other generic greetings when a recipient name is provided.
- Keep the tone warm, competent, and human — not generic marketing.
- Return JSON only with keys: subject, greeting, body, cta.
- body should be plain text with short paragraphs separated by blank lines (no HTML).
- greeting should be a single line like "Dear Priya,".
- cta should be one short closing ask or next step.`;

export async function draftClientEmail(
  input: ClientEmailDraftInput,
): Promise<ClientEmailDraftResult> {
  const { quote, relatedEmails, contextNotes } = await loadQuoteContext(input);
  const recipientName = resolveRecipientDisplayName({
    quoteName: quote?.name,
    quoteCompany: quote?.company,
    clientName: input.clientName,
    clientCompany: input.clientCompany,
  });
  const contextBlock = buildContextBlock(
    quote,
    relatedEmails,
    recipientName,
    input.clientEmail,
    input.clientCompany ?? quote?.company,
  );
  const tone = input.toneHint?.trim()
    ? `Tone guidance: ${input.toneHint.trim()}`
    : "Tone guidance: professional, concise, personalized.";

  const raw = await completeJsonObject({
    system: SYSTEM_PROMPT,
    user: [
      tone,
      "",
      "OPS INSTRUCTION (primary — write this email; subject must reflect this):",
      input.prompt,
      "",
      contextBlock,
      "",
      recipientName
        ? `Greeting must be exactly: ${greetingForRecipient(recipientName)}`
        : "No recipient name on file — use Dear Sir/Madam,",
      "Produce subject, greeting, body, and cta now. Match the OPS INSTRUCTION, not prior suggested replies.",
    ].join("\n"),
    timeoutMs: 20_000,
  });

  const parsed = parseDraftJson(raw);
  const resolvedCompany =
    (!isPlaceholderName(quote?.company) ? quote?.company : undefined) ||
    (!isPlaceholderName(input.clientCompany)
      ? input.clientCompany
      : undefined);

  if (!parsed?.subject) {
    const fallback = fallbackDraft(input.prompt, quote, recipientName);
    return {
      ...fallback,
      suggestedTo: suggestedTo(quote, input.clientEmail),
      clientName: recipientName,
      clientCompany: resolvedCompany,
      quoteRequestId: quote?.id,
      contextNotes: [
        ...contextNotes,
        "AI draft unavailable — generated a safe template stub for editing.",
      ],
    };
  }

  return {
    subject: parsed.subject,
    // Deterministic greeting — do not trust the model with the name.
    greeting: greetingForRecipient(recipientName),
    body: parsed.body,
    cta: parsed.cta,
    suggestedTo: suggestedTo(quote, input.clientEmail),
    clientName: recipientName ?? quote?.name,
    clientCompany: resolvedCompany,
    quoteRequestId: quote?.id,
    contextNotes,
  };
}

export async function refineClientEmail(
  input: ClientEmailRefineInput,
): Promise<ClientEmailDraftResult> {
  const { quote, relatedEmails, contextNotes } = await loadQuoteContext(input);
  const recipientName = resolveRecipientDisplayName({
    quoteName: quote?.name,
    quoteCompany: quote?.company,
    clientName: input.clientName,
    clientCompany: input.clientCompany,
  });
  const contextBlock = buildContextBlock(
    quote,
    relatedEmails,
    recipientName,
    input.clientEmail,
    input.clientCompany ?? quote?.company,
  );

  const raw = await completeJsonObject({
    system: SYSTEM_PROMPT,
    user: [
      contextBlock,
      "",
      "CURRENT DRAFT:",
      `subject: ${input.subject}`,
      `greeting: ${input.greeting}`,
      `body:\n${input.body}`,
      input.cta ? `cta: ${input.cta}` : "",
      "",
      "REFINE INSTRUCTION:",
      input.instruction,
      "",
      recipientName
        ? `Keep greeting as: ${greetingForRecipient(recipientName)}`
        : "",
      "Return the full updated email JSON (subject, greeting, body, cta). Do not invent new facts.",
    ].join("\n"),
    timeoutMs: 20_000,
  });

  const parsed = parseDraftJson(raw);
  const resolvedCompany =
    (!isPlaceholderName(quote?.company) ? quote?.company : undefined) ||
    (!isPlaceholderName(input.clientCompany)
      ? input.clientCompany
      : undefined);

  if (!parsed) {
    return {
      subject: input.subject,
      greeting: recipientName
        ? greetingForRecipient(recipientName)
        : input.greeting,
      body: input.body,
      cta: input.cta,
      suggestedTo: suggestedTo(quote, input.clientEmail),
      clientName: recipientName ?? quote?.name,
      clientCompany: resolvedCompany,
      quoteRequestId: quote?.id ?? input.quoteRequestId,
      contextNotes: [
        ...contextNotes,
        "AI refine unavailable — kept your current draft.",
      ],
    };
  }

  return {
    subject: parsed.subject ?? input.subject,
    greeting: recipientName
      ? greetingForRecipient(recipientName)
      : (parsed.greeting ?? input.greeting),
    body: parsed.body,
    cta: parsed.cta ?? input.cta,
    suggestedTo: suggestedTo(quote, input.clientEmail),
    clientName: recipientName ?? quote?.name,
    clientCompany: resolvedCompany,
    quoteRequestId: quote?.id ?? input.quoteRequestId,
    contextNotes,
  };
}

function fallbackDraft(
  prompt: string,
  quote?: QuoteRequest,
  recipientName?: string,
): ClientEmailComposeParts & { subject: string } {
  const name = recipientName || quote?.name?.trim();
  const subject = quote
    ? `Update on your shipment enquiry · ${quote.id}`
    : "Update from ExpressWay Logistic";
  const body = [
    "Thank you for your continued trust in ExpressWay Logistic.",
    "",
    prompt.trim(),
    "",
    quote
      ? `This note relates to quote ${quote.id} (${quote.origin} → ${quote.destination}).`
      : "Please reply with any details we should confirm before we proceed.",
  ].join("\n");

  return {
    subject,
    greeting: greetingForRecipient(name),
    body,
    cta: "Please let us know if you would like us to proceed or need any clarification.",
  };
}

export function draftPartsToPlainBody(parts: ClientEmailComposeParts): string {
  return composeClientEmailBodyText(parts);
}
