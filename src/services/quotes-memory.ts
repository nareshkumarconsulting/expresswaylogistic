import { MOCK_QUOTE_REQUESTS } from "@/services/logistics-data";
import type {
  Forwarder,
  QuoteActivityEntry,
  QuoteForwarderRequest,
  QuoteRequest,
} from "@/types";

function cloneQuotes(): QuoteRequest[] {
  return MOCK_QUOTE_REQUESTS.map((quote) => ({ ...quote }));
}

export const MOCK_FORWARDERS: Forwarder[] = [
  {
    id: "11111111-1111-4111-8111-111111111111",
    companyName: "DHL Forwarding Partner",
    contactPerson: "Anita Rao",
    email: "anita.rao@example.com",
    phone: "+91 98100 11111",
    country: "India",
    serviceTypes: ["air", "ocean-fcl", "door-to-door"],
    originLocations: ["Delhi", "Mumbai"],
    destinationLocations: ["London", "Dubai", "Singapore"],
    preferredRoutes: "India ↔ Europe / GCC",
    status: "Active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "22222222-2222-4222-8222-222222222222",
    companyName: "ABC Logistics",
    contactPerson: "Suresh Nair",
    email: "suresh.nair@example.com",
    phone: "+91 98200 22222",
    country: "India",
    serviceTypes: ["ocean-fcl", "ocean-lcl", "consolidation"],
    originLocations: ["Mumbai", "Chennai"],
    destinationLocations: ["Rotterdam", "Hamburg"],
    preferredRoutes: "West Coast India ↔ North Europe",
    status: "Active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "33333333-3333-4333-8333-333333333333",
    companyName: "Global Freight Services",
    contactPerson: "Mei Chen",
    email: "mei.chen@example.com",
    country: "Singapore",
    serviceTypes: ["air", "ocean-lcl"],
    originLocations: ["Mumbai", "Bengaluru"],
    destinationLocations: ["Singapore", "Hong Kong"],
    preferredRoutes: "India ↔ SEA",
    status: "Active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "44444444-4444-4444-8444-444444444444",
    companyName: "XYZ Shipping Solutions",
    contactPerson: "Omar Khan",
    email: "omar.khan@example.com",
    country: "UAE",
    serviceTypes: ["ocean-fcl", "warehousing"],
    originLocations: ["Mundra", "Nhava Sheva"],
    destinationLocations: ["Jebel Ali"],
    status: "Inactive",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

let quotes = cloneQuotes();
let forwarders = MOCK_FORWARDERS.map((row) => ({ ...row }));
let forwarderRequests: QuoteForwarderRequest[] = [];
let activity: QuoteActivityEntry[] = [];

export function memoryListQuotes(): QuoteRequest[] {
  return quotes.map((quote) => ({ ...quote }));
}

export function memoryGetQuote(id: string): QuoteRequest | null {
  return quotes.find((quote) => quote.id === id) ?? null;
}

export function memorySaveQuote(next: QuoteRequest): QuoteRequest {
  quotes = quotes.map((quote) => (quote.id === next.id ? next : quote));
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
      forwarderRequests[existing] = { ...row, id: forwarderRequests[existing].id };
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
