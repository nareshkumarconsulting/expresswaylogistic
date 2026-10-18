import { NextResponse } from "next/server";
import {
  emailAnswer,
  isEmailQuestion,
  isQuoteQuestion,
  isShipmentQuestion,
  mentionedDay,
  quoteAnswer,
  quoteReferences,
  quoteWindow,
  selectByTime,
  selectQuotes,
  selectQuotesByReference,
  shipmentAnswer,
  shipmentStatusFilter,
  type CopilotEmail,
  type CopilotQuote,
} from "@/features/command-center/copilot-query";
import { aiQuerySchema } from "@/features/contact/schemas";
import { SERVICE_TYPE_LABELS } from "@/features/quotes/labels";
import {
  answerWithRag,
  buildOpsCorpus,
  buildSiteCorpus,
} from "@/features/rag";
import { logger } from "@/lib/logger";
import { listEmailIntelligence } from "@/services/email-intelligence-repository";
import { listManagedQuotes } from "@/services/quotes-repository";
import {
  listManagedShipments,
  listShipments,
} from "@/services/shipments-repository";
import type { AiInsight, ManagedShipment, Shipment } from "@/types";

function toShipmentMatch(shipment: ManagedShipment): Shipment {
  return {
    id: shipment.id,
    origin: shipment.origin,
    destination: shipment.destination,
    type: shipment.type,
    status: shipment.status,
    eta: shipment.eta,
    client: shipment.client,
    predictedEtaHours: shipment.predictedEtaHours,
    riskScore: shipment.riskScore,
  };
}

function sourcesToInsights(
  sources: Awaited<ReturnType<typeof answerWithRag>>["sources"],
): AiInsight[] {
  const now = new Date().toISOString();
  return sources.slice(0, 6).map((source) => ({
    id: source.id,
    severity: "info" as const,
    title: source.title,
    summary: source.excerpt,
    recommendation: source.href
      ? `Open ${source.kind} source`
      : `Retrieved ${source.kind} context`,
    relatedShipmentId:
      source.kind === "shipment" ? source.id.replace(/^shipment-/, "") : undefined,
    createdAt: now,
  }));
}

async function ragFallback(query: string) {
  const [shipments, quotes, emails] = await Promise.all([
    listManagedShipments(),
    listManagedQuotes(),
    listEmailIntelligence(),
  ]);

  const documents = [
    ...buildSiteCorpus(),
    ...buildOpsCorpus({
      shipments: shipments.slice(0, 200),
      quotes: quotes.slice(0, 200),
      emails: (emails ?? []).slice(0, 200),
    }),
  ];

  const rag = await answerWithRag({ query, documents });
  const shipmentMatches = rag.sources
    .filter((source) => source.kind === "shipment")
    .map((source) => {
      const id = source.id.replace(/^shipment-/, "");
      return shipments.find((item) => item.id === id);
    })
    .filter((item): item is ManagedShipment => Boolean(item))
    .map(toShipmentMatch);

  const quoteMatches: CopilotQuote[] = rag.sources
    .filter((source) => source.kind === "quote")
    .map((source) => {
      const id = source.id.replace(/^quote-/, "");
      return quotes.find((item) => item.id === id);
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item))
    .map((quote) => ({
      id: quote.id,
      name: quote.name,
      company: quote.company,
      origin: quote.origin,
      destination: quote.destination,
      status: quote.status,
      serviceLabel: SERVICE_TYPE_LABELS[quote.serviceType] ?? quote.serviceType,
      submittedAt: quote.submittedAt,
    }));

  const emailMatches: CopilotEmail[] = rag.sources
    .filter((source) => source.kind === "email")
    .map((source) => {
      const id = source.id.replace(/^email-/, "");
      return (emails ?? []).find((item) => item.id === id);
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item))
    .map((email) => ({
      id: email.id,
      subject: email.subject,
      senderName: email.senderName,
      senderEmail: email.senderEmail,
      receivedAt: email.receivedAt,
      category: email.category,
    }));

  logger.info("ai.query.rag", {
    query,
    sources: rag.sources.length,
    usedLlm: rag.usedLlm,
  });

  return NextResponse.json({
    success: true,
    data: {
      answer: rag.answer,
      matches: shipmentMatches,
      quotes: quoteMatches,
      emails: emailMatches,
      insights: sourcesToInsights(rag.sources),
      sources: rag.sources.map((source) => ({
        id: source.id,
        kind: source.kind,
        title: source.title,
        excerpt: source.excerpt,
        href: source.href,
        score: source.score,
      })),
      usedLlm: rag.usedLlm,
    },
  });
}

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

    const status = shipmentStatusFilter(query);
    const window = quoteWindow(query);
    const structuredShipmentQuery =
      isShipmentQuestion(query) && (status != null || window != null);

    if (structuredShipmentQuery) {
      const managed = await listManagedShipments();
      const filtered = managed.filter((shipment) => {
        if (status && shipment.status !== status) return false;
        if (!window) return true;
        const at = new Date(
          status ? shipment.updatedAt : shipment.createdAt,
        ).getTime();
        return at >= window.from.getTime() && at <= window.until.getTime();
      });
      const matches = filtered.map(toShipmentMatch);
      logger.info("ai.query", {
        query,
        matches: matches.length,
        status,
        window: window?.label ?? null,
      });
      return NextResponse.json({
        success: true,
        data: {
          answer: shipmentAnswer(matches.length, status, window),
          matches,
          quotes: [],
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

    if (matches.length > 0) {
      const answer = `Found ${matches.length} shipment(s) matching your query. Highest risk: ${
        [...matches].sort(
          (a, b) => (b.riskScore ?? 0) - (a.riskScore ?? 0),
        )[0]?.id
      }.`;
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
    }

    // Free-form ops / knowledge questions → retrieve + optional LLM synthesis.
    return ragFallback(query);
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
