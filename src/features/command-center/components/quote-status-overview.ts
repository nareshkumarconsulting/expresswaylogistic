import { statusBadgeVariant } from "@/features/quotes/labels";
import {
  QUOTE_REQUEST_STATUSES,
  type QuoteRequest,
  type QuoteRequestStatus,
} from "@/types";

export const ACTIONABLE_QUOTE_STATUSES = new Set<QuoteRequestStatus>([
  "New",
  "Under Review",
  "Sent to Forwarders",
  "Awaiting Forwarder Quotes",
  "Quote Received",
  "Quote Ready / Email Failed",
]);

export const QUOTE_STATUS_GROUPS: {
  label: string;
  hint: string;
  statuses: readonly QuoteRequestStatus[];
}[] = [
  {
    label: "Customer",
    hint: "Inbound requests and quotes sent back",
    statuses: ["New", "Under Review", "Quoted"],
  },
  {
    label: "Forwarders",
    hint: "Quotes requested from partners",
    statuses: [
      "Sent to Forwarders",
      "Awaiting Forwarder Quotes",
      "Quote Received",
    ],
  },
  {
    label: "Closed",
    hint: "Won, lost, or failed",
    statuses: [
      "Quote Ready / Email Failed",
      "Accepted",
      "Rejected",
      "Expired",
    ],
  },
];

export function quoteStatusColor(status: QuoteRequestStatus): string {
  switch (statusBadgeVariant(status)) {
    case "success":
      return "hsl(152 60% 36%)";
    case "warning":
      return "hsl(38 92% 50%)";
    case "accent":
      return "hsl(32 100% 50%)";
    case "destructive":
      return "hsl(0 84% 55%)";
    case "secondary":
      return "hsl(205 90% 60%)";
    default:
      return "hsl(210 10% 40%)";
  }
}

export function quoteStatusTone(status: QuoteRequestStatus) {
  switch (statusBadgeVariant(status)) {
    case "success":
      return {
        bar: "bg-success",
        tile: "border-success/25 bg-success/5 hover:bg-success/10",
        count: "text-success",
      };
    case "warning":
      return {
        bar: "bg-warning",
        tile: "border-warning/30 bg-warning/10 hover:bg-warning/15",
        count: "text-warning-foreground",
      };
    case "accent":
      return {
        bar: "bg-accent",
        tile: "border-accent/25 bg-accent/5 hover:bg-accent/10",
        count: "text-accent",
      };
    case "destructive":
      return {
        bar: "bg-destructive",
        tile: "border-destructive/30 bg-destructive/5 hover:bg-destructive/10",
        count: "text-destructive",
      };
    case "secondary":
      return {
        bar: "bg-secondary",
        tile: "border-secondary/40 bg-secondary/15 hover:bg-secondary/25",
        count: "text-secondary-foreground",
      };
    default:
      return {
        bar: "bg-muted-foreground/40",
        tile: "border-border bg-muted/40 hover:bg-muted/60",
        count: "text-muted-foreground",
      };
  }
}

export function countQuotesByStatus(
  quotes: { status: QuoteRequestStatus }[],
): Record<QuoteRequestStatus, number> {
  const counts = Object.fromEntries(
    QUOTE_REQUEST_STATUSES.map((status) => [status, 0]),
  ) as Record<QuoteRequestStatus, number>;

  for (const quote of quotes) {
    counts[quote.status] += 1;
  }

  return counts;
}

const CLOSED_QUOTE_STATUSES = new Set<QuoteRequestStatus>([
  "Accepted",
  "Rejected",
  "Expired",
]);

export type QuoteDailyPoint = {
  date: string;
  label: string;
  received: number;
  replied: number;
  closed: number;
};

function toKolkataDateKey(value: string | Date): string {
  return new Date(value).toLocaleDateString("en-CA", {
    timeZone: "Asia/Kolkata",
  });
}

function shiftDateKey(key: string, days: number): string {
  const [year, month, day] = key.split("-").map(Number);
  const shifted = new Date(Date.UTC(year, month - 1, day + days));
  const yyyy = shifted.getUTCFullYear();
  const mm = String(shifted.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(shifted.getUTCDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function formatDayLabel(key: string): string {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
}

function repliedAt(quote: QuoteRequest): string | undefined {
  if (quote.quoteSentAt) return quote.quoteSentAt;
  if (quote.status === "Quoted" && quote.updatedAt) return quote.updatedAt;
  return undefined;
}

function closedAt(quote: QuoteRequest): string | undefined {
  if (!CLOSED_QUOTE_STATUSES.has(quote.status)) return undefined;
  return quote.updatedAt ?? quote.submittedAt;
}

export function buildQuoteDailySeries(
  quotes: QuoteRequest[],
  days = 14,
): QuoteDailyPoint[] {
  const end = toKolkataDateKey(new Date());
  const start = shiftDateKey(end, -(days - 1));
  const keys = Array.from({ length: days }, (_, index) =>
    shiftDateKey(start, index),
  );

  const buckets = new Map(
    keys.map((date) => [
      date,
      {
        date,
        label: formatDayLabel(date),
        received: 0,
        replied: 0,
        closed: 0,
      } satisfies QuoteDailyPoint,
    ]),
  );

  const bump = (
    iso: string | undefined,
    field: "received" | "replied" | "closed",
  ) => {
    if (!iso) return;
    const bucket = buckets.get(toKolkataDateKey(iso));
    if (!bucket) return;
    bucket[field] += 1;
  };

  for (const quote of quotes) {
    bump(quote.submittedAt, "received");
    bump(repliedAt(quote), "replied");
    bump(closedAt(quote), "closed");
  }

  return keys.map((key) => buckets.get(key) as QuoteDailyPoint);
}
