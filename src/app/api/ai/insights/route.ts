import { NextResponse } from "next/server";
import {
  emailAnswer,
  isEmailQuestion,
  isQuoteQuestion,
  mentionedDay,
  quoteAnswer,
  quoteReferences,
  quoteWindow,
  selectByTime,
  selectQuotes,
  selectQuotesByReference,
  type CopilotEmail,
  type CopilotQuote,
} from "@/features/command-center/copilot-query";
import { aiQuerySchema } from "@/features/contact/schemas";
import { SERVICE_TYPE_LABELS } from "@/features/quotes/labels";
import { logger } from "@/lib/logger";
import { listEmailIntelligence } from "@/services/email-intelligence-repository";
import { listManagedQuotes } from "@/services/quotes-repository";
import { listShipments } from "@/services/shipments-repository";

export async function GET() {
  return NextResponse.json({
    success: true,
    data: [],
  });
}

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const parsed = aiQuerySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Invalid query" },
        { status: 400 },
      );
    }

    const query = parsed.data.query;
    const q = query.toLowerCase();

    if (isEmailQuestion(query)) {
      const day = mentionedDay(query) ?? quoteWindow(query);
      const emails: CopilotEmail[] = selectByTime(
        (await listEmailIntelligence()) ?? [],
        (email) => email.receivedAt,
        day,
      ).map((email) => ({
        id: email.id,
        subject: email.subject,
        senderName: email.senderName,
        senderEmail: email.senderEmail,
        receivedAt: email.receivedAt,
        category: email.category,
      }));
      logger.info("ai.query", { query, emails: emails.length });
      return NextResponse.json({
        success: true,
        data: {
          answer: emailAnswer(emails.length, day),
          matches: [],
          quotes: [],
          emails: emails.slice(0, 30),
          insights: [],
        },
      });
    }

    if (isQuoteQuestion(query)) {
      const window = quoteWindow(query);
      const references = quoteReferences(query);
      const quotes: CopilotQuote[] = selectQuotesByReference(
        selectQuotes(await listManagedQuotes(), window),
        references,
      ).map((quote) => ({
        id: quote.id,
        name: quote.name,
        company: quote.company,
        origin: quote.origin,
        destination: quote.destination,
        status: quote.status,
        serviceLabel: SERVICE_TYPE_LABELS[quote.serviceType] ?? quote.serviceType,
        submittedAt: quote.submittedAt,
      }));
      logger.info("ai.query", { query, quotes: quotes.length });
      return NextResponse.json({
        success: true,
        data: {
          answer: quoteAnswer(quotes, window, references),
          matches: [],
          quotes,
          emails: [],
          insights: [],
        },
      });
    }

    const shipments = await listShipments();
    const matches = shipments.filter(
      (s) =>
        s.id.toLowerCase().includes(q) ||
        s.client.toLowerCase().includes(q) ||
        s.origin.toLowerCase().includes(q) ||
        s.destination.toLowerCase().includes(q) ||
        s.status.toLowerCase().includes(q),
    );

    const answer =
      matches.length > 0
        ? `Found ${matches.length} shipment(s) matching your query. Highest risk: ${
            [...matches].sort(
              (a, b) => (b.riskScore ?? 0) - (a.riskScore ?? 0),
            )[0]?.id
          }.`
        : "No direct shipment matches. Add shipments or refine your query.";

    logger.info("ai.query", { query, matches: matches.length });

    return NextResponse.json({
      success: true,
      data: {
        answer,
        matches,
        quotes: [],
        emails: [],
        insights: [],
      },
    });
  } catch (error) {
    logger.error("ai.query.failed", {
      error: error instanceof Error ? error.message : "unknown",
    });
    return NextResponse.json(
      { success: false, error: "AI query failed" },
      { status: 500 },
    );
  }
}
