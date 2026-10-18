import { completeJsonObject } from "@/lib/llm-json";
import { logger } from "@/lib/logger";
import type { RagAnswer, RagDocument, RagHit } from "@/features/rag/types";
import { retrieveDocuments } from "@/features/rag/retrieve";

function fallbackAnswer(hits: RagHit[]): string {
  if (hits.length === 0) {
    return "I could not find relevant shipments, quotes, emails, or site knowledge for that question. Try a shipment ID, quote reference, client name, or a service FAQ.";
  }

  const top = hits[0]!;
  const extras =
    hits.length > 1
      ? ` Related: ${hits
          .slice(1, 4)
          .map((hit) => hit.title)
          .join("; ")}.`
      : "";
  return `${top.excerpt}${extras}`;
}

function parseAnswer(payload: unknown): string | null {
  if (!payload || typeof payload !== "object") return null;
  const answer = (payload as { answer?: unknown }).answer;
  return typeof answer === "string" && answer.trim() ? answer.trim() : null;
}

export async function answerWithRag(input: {
  query: string;
  documents: RagDocument[];
  limit?: number;
}): Promise<RagAnswer> {
  const sources = retrieveDocuments(
    input.documents,
    input.query,
    input.limit ?? 6,
  );

  if (sources.length === 0) {
    return {
      answer: fallbackAnswer([]),
      sources: [],
      usedLlm: false,
    };
  }

  const context = sources
    .map(
      (hit, index) =>
        `[${index + 1}] (${hit.kind}) ${hit.title}\n${hit.text.slice(0, 1200)}`,
    )
    .join("\n\n");

  try {
    const payload = await completeJsonObject({
      system: `You are the AI Logistics Copilot for ExpressWay Logistic operations staff.
Answer only from the retrieved context. Be concise and operational.
If the context is incomplete, say what is missing instead of inventing IDs, rates, or statuses.
Prefer concrete counts, IDs, lanes, and next actions when present.
Return JSON: { "answer": string }`,
      user: `Question: ${input.query}\n\nRetrieved context:\n${context}`,
      timeoutMs: 10_000,
    });

    const llmAnswer = parseAnswer(payload);
    if (llmAnswer) {
      return { answer: llmAnswer, sources, usedLlm: true };
    }
  } catch (error) {
    logger.warn("rag.synthesize.failed", {
      error: error instanceof Error ? error.message : "unknown",
    });
  }

  return {
    answer: fallbackAnswer(sources),
    sources,
    usedLlm: false,
  };
}
