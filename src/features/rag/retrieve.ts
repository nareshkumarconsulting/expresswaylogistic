import { excerpt, tokenize } from "@/features/rag/tokenize";
import type { RagDocument, RagHit } from "@/features/rag/types";

/**
 * Lightweight BM25-style lexical retrieval.
 * No embeddings or vector DB required — works offline with any corpus size
 * we currently have (site knowledge + recent ops rows).
 */
export function retrieveDocuments(
  documents: RagDocument[],
  query: string,
  limit = 6,
): RagHit[] {
  const queryTokens = tokenize(query);
  if (queryTokens.length === 0 || documents.length === 0) return [];

  const docTokens = documents.map((doc) => tokenize(`${doc.title} ${doc.text}`));
  const df = new Map<string, number>();
  for (const tokens of docTokens) {
    for (const token of new Set(tokens)) {
      df.set(token, (df.get(token) ?? 0) + 1);
    }
  }

  const avgDl =
    docTokens.reduce((sum, tokens) => sum + tokens.length, 0) /
    Math.max(docTokens.length, 1);
  const k1 = 1.2;
  const b = 0.75;
  const n = documents.length;

  const scored: RagHit[] = documents.map((doc, index) => {
    const tokens = docTokens[index]!;
    const tf = new Map<string, number>();
    for (const token of tokens) {
      tf.set(token, (tf.get(token) ?? 0) + 1);
    }

    let score = 0;
    for (const token of queryTokens) {
      const termFrequency = tf.get(token) ?? 0;
      if (termFrequency === 0) continue;
      const docFrequency = df.get(token) ?? 0;
      const idf = Math.log(1 + (n - docFrequency + 0.5) / (docFrequency + 0.5));
      const denom = termFrequency + k1 * (1 - b + (b * tokens.length) / avgDl);
      score += idf * ((termFrequency * (k1 + 1)) / denom);

      // Soft boost when the query token appears in the title.
      if (tokenize(doc.title).includes(token)) score += 0.35;
    }

    return {
      ...doc,
      score,
      excerpt: excerpt(doc.text),
    };
  });

  return scored
    .filter((hit) => hit.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
