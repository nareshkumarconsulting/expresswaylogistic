const STOP_WORDS = new Set([
  "a",
  "an",
  "the",
  "and",
  "or",
  "of",
  "to",
  "in",
  "on",
  "for",
  "is",
  "are",
  "was",
  "were",
  "be",
  "by",
  "with",
  "from",
  "at",
  "as",
  "it",
  "this",
  "that",
  "how",
  "many",
  "what",
  "which",
  "who",
  "when",
  "where",
  "can",
  "you",
  "me",
  "please",
  "tell",
  "about",
  "give",
  "list",
  "show",
]);

/** Lowercase alphanumeric tokens, stripping light stop words. */
export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9/@.+\-\s]/g, " ")
    .split(/\s+/)
    .map((token) => token.trim())
    .filter((token) => token.length > 1 && !STOP_WORDS.has(token));
}

export function excerpt(text: string, max = 220): string {
  const cleaned = text.replace(/\s+/g, " ").trim();
  if (cleaned.length <= max) return cleaned;
  return `${cleaned.slice(0, max - 1).trimEnd()}…`;
}
