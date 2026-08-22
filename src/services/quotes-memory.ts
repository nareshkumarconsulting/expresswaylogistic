import type {
  Forwarder,
  QuoteActivityEntry,
  QuoteForwarderRequest,
  QuoteRequest,
} from "@/types";

let quotes: QuoteRequest[] = [];
let forwarders: Forwarder[] = [];
let forwarderRequests: QuoteForwarderRequest[] = [];
let activity: QuoteActivityEntry[] = [];

export function memoryListQuotes(): QuoteRequest[] {
  return quotes.map((quote) => ({ ...quote }));
}

export function memoryGetQuote(id: string): QuoteRequest | null {
  return quotes.find((quote) => quote.id === id) ?? null;
}

export function memorySaveQuote(next: QuoteRequest): QuoteRequest {
  const exists = quotes.some((quote) => quote.id === next.id);
  if (exists) {
    quotes = quotes.map((quote) => (quote.id === next.id ? next : quote));
  } else {
    quotes = [next, ...quotes];
  }
  return { ...next };
}

export function memoryListForwarders(): Forwarder[] {
  return forwarders.map((row) => ({ ...row }));
}

export function memoryGetForwarder(id: string): Forwarder | null {
  return forwarders.find((row) => row.id === id) ?? null;
}

export function memorySaveForwarder(row: Forwarder): Forwarder {
  const existing = forwarders.some((item) => item.id === row.id);
  if (existing) {
    forwarders = forwarders.map((item) => (item.id === row.id ? row : item));
  } else {
    forwarders = [row, ...forwarders];
  }
  return { ...row };
}

export function memoryDeleteForwarder(id: string): boolean {
  const exists = forwarders.some((row) => row.id === id);
  if (!exists) return false;
  forwarders = forwarders.filter((row) => row.id !== id);
  return true;
}

export function memoryListForwarderRequests(
  quoteId: string,
): QuoteForwarderRequest[] {
  return forwarderRequests.filter((row) => row.quoteRequestId === quoteId);
}

export function memoryUpsertForwarderRequest(
  row: QuoteForwarderRequest,
): QuoteForwarderRequest {
  const index = forwarderRequests.findIndex((item) => item.id === row.id);
  if (index >= 0) {
    forwarderRequests[index] = row;
  } else {
    const existing = forwarderRequests.findIndex(
      (item) =>
        item.quoteRequestId === row.quoteRequestId &&
        item.forwarderId === row.forwarderId,
    );
    if (existing >= 0) {
      forwarderRequests[existing] = {
        ...row,
        id: forwarderRequests[existing].id,
      };
      return { ...forwarderRequests[existing] };
    }
    forwarderRequests = [row, ...forwarderRequests];
  }
  return { ...row };
}

export function memoryListActivity(quoteId: string): QuoteActivityEntry[] {
  return activity
    .filter((row) => row.quoteRequestId === quoteId)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
}

export function memoryAddActivity(
  quoteId: string,
  entry: Omit<QuoteActivityEntry, "id" | "createdAt" | "quoteRequestId">,
): QuoteActivityEntry {
  const row: QuoteActivityEntry = {
    id: `${quoteId}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    quoteRequestId: quoteId,
    createdAt: new Date().toISOString(),
    ...entry,
  };
  activity = [row, ...activity];
  return row;
}
