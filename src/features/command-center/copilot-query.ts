import type { ShipmentStatus } from "@/types";

export type CopilotQuote = {
  id: string;
  name: string;
  company: string;
  origin: string;
  destination: string;
  status: string;
  serviceLabel: string;
  submittedAt: string;
};

export type QuoteWindow = {
  from: Date;
  until: Date;
  label: string;
};

const IST = "Asia/Kolkata";

export function isQuoteQuestion(query: string): boolean {
  return /\b(quotes?|quotations?|rfqs?)\b/i.test(query);
}

export function isShipmentQuestion(query: string): boolean {
  return /\b(shipments?|shippings?|consignments?|cargos?)\b/i.test(query);
}

/** Tolerates typos like "Last3 months" or "last3days". */
export function normalizeRelativeTimeQuery(query: string): string {
  return query
    .toLowerCase()
    .replace(/\b(last|past|within)(\d+)\b/g, "$1 $2")
    .replace(/\b(\d+)(days?|weeks?|months?)\b/g, "$1 $2");
}

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

function startOfIstDay(now: Date): Date {
  const day = new Intl.DateTimeFormat("en-CA", {
    timeZone: IST,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
  return new Date(`${day}T00:00:00+05:30`);
}

function istYmd(now: Date): { year: number; month: number; day: number } {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: IST,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const year = Number(parts.find((part) => part.type === "year")?.value);
  const month = Number(parts.find((part) => part.type === "month")?.value);
  const day = Number(parts.find((part) => part.type === "day")?.value);
  return { year, month, day };
}

function daysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

function monthsBeforeIst(now: Date, months: number): Date {
  const { year, month, day } = istYmd(now);
  const total = year * 12 + (month - 1) - months;
  const nextYear = Math.floor(total / 12);
  const nextMonth = (total % 12) + 1;
  const clampedDay = Math.min(day, daysInMonth(nextYear, nextMonth));
  return new Date(
    `${nextYear}-${pad(nextMonth)}-${pad(clampedDay)}T00:00:00+05:30`,
  );
}

export function quoteWindow(query: string, now = new Date()): QuoteWindow | null {
  const q = normalizeRelativeTimeQuery(query);
  const startToday = startOfIstDay(now);

  if (/\byesterday\b/.test(q)) {
    return {
      from: new Date(startToday.getTime() - 86_400_000),
      until: new Date(startToday.getTime() - 1),
      label: "yesterday",
    };
  }

  if (/\btoday\b/.test(q)) {
    return { from: startToday, until: now, label: "today" };
  }

  const daysMatch = q.match(/\b(?:last|past|within)\s+(\d+)\s+days?\b/);
  if (daysMatch) {
    const days = Math.min(Number(daysMatch[1]), 365);
    if (days >= 1) {
      return {
        from: new Date(startToday.getTime() - (days - 1) * 86_400_000),
        until: now,
        label: `the last ${days} day${days === 1 ? "" : "s"}`,
      };
    }
  }

  const weeksMatch = q.match(/\b(?:last|past|within)\s+(\d+)\s+weeks?\b/);
  if (weeksMatch) {
    const weeks = Math.min(Number(weeksMatch[1]), 52);
    if (weeks >= 1) {
      const days = weeks * 7;
      return {
        from: new Date(startToday.getTime() - (days - 1) * 86_400_000),
        until: now,
        label: `the last ${weeks} week${weeks === 1 ? "" : "s"}`,
      };
    }
  }

  const monthsMatch = q.match(/\b(?:last|past|within)\s+(\d+)\s+months?\b/);
  if (monthsMatch) {
    const months = Math.min(Number(monthsMatch[1]), 36);
    if (months >= 1) {
      return {
        from: monthsBeforeIst(now, months),
        until: now,
        label: `the last ${months} month${months === 1 ? "" : "s"}`,
      };
    }
  }

  if (/\blast week\b/.test(q)) {
    return {
      from: new Date(startToday.getTime() - 6 * 86_400_000),
      until: now,
      label: "the last week",
    };
  }

  if (/\blast month\b/.test(q)) {
    return {
      from: monthsBeforeIst(now, 1),
      until: now,
      label: "the last month",
    };
  }

  return null;
}

const STATUS_ALIASES: Array<{ status: ShipmentStatus; pattern: RegExp }> = [
  { status: "Delivered", pattern: /\b(completed?|delivered|done|finished)\b/i },
  { status: "Delayed", pattern: /\bdelay(?:ed|s)?\b/i },
  { status: "Customs Hold", pattern: /\bcustoms?\b|\bhold\b/i },
  { status: "In Transit", pattern: /\b(?:in[\s-]?transit|transiting)\b/i },
  { status: "Processing", pattern: /\bprocess(?:ing|ed)?\b/i },
];

export function shipmentStatusFilter(query: string): ShipmentStatus | null {
  for (const entry of STATUS_ALIASES) {
    if (entry.pattern.test(query)) return entry.status;
  }
  return null;
}

export function shipmentAnswer(
  count: number,
  status: ShipmentStatus | null,
  window: QuoteWindow | null,
): string {
  const statusLabel = status
    ? status === "Delivered"
      ? "completed"
      : status.toLowerCase()
    : null;
  const scope = [
    statusLabel ? ` ${statusLabel}` : "",
    window ? ` in ${window.label}` : "",
  ].join("");

  if (count === 0) {
    return `No${statusLabel ? ` ${statusLabel}` : ""} shipments${window ? ` in ${window.label}` : ""} found.`;
  }
  return `${count} shipment${count === 1 ? "" : "s"}${scope}.`;
}

export function selectQuotes<T extends { submittedAt: string }>(
  quotes: T[],
  window: QuoteWindow | null,
): T[] {
  return quotes
    .filter((quote) => {
      if (!window) return true;
      const at = new Date(quote.submittedAt).getTime();
      return at >= window.from.getTime() && at <= window.until.getTime();
    })
    .sort(
      (a, b) =>
        new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime(),
    );
}

export function formatQuoteWhen(iso: string): string {
  return new Date(iso).toLocaleString("en-IN", {
    timeZone: IST,
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function quoteAnswer(
  quotes: CopilotQuote[],
  window: QuoteWindow | null,
  references: string[] = [],
): string {
  const scope = window ? ` ${window.label}` : "";
  const refLabel = references.join(", ");
  if (quotes.length === 0) {
    if (refLabel) return `No quote request matches ${refLabel}.`;
    return window ? `No quote requests ${window.label}.` : "No quote requests found.";
  }
  if (refLabel) {
    return `Found ${quotes.length} quote request${quotes.length === 1 ? "" : "s"} matching ${refLabel}.`;
  }
  return `Found ${quotes.length} quote request${quotes.length === 1 ? "" : "s"}${scope}.`;
}

export type CopilotEmail = {
  id: string;
  subject: string;
  senderName?: string;
  senderEmail: string;
  receivedAt: string;
  category: string;
};

const MONTHS: Record<string, number> = {
  january: 1,
  jan: 1,
  february: 2,
  feb: 2,
  march: 3,
  mar: 3,
  april: 4,
  apr: 4,
  may: 5,
  june: 6,
  jun: 6,
  july: 7,
  jul: 7,
  august: 8,
  aug: 8,
  september: 9,
  sept: 9,
  sep: 9,
  october: 10,
  oct: 10,
  november: 11,
  nov: 11,
  december: 12,
  dec: 12,
};

const MONTH_PATTERN = Object.keys(MONTHS).join("|");

export function isEmailQuestion(query: string): boolean {
  return /\b(e-?mails?|inbox)\b/i.test(query);
}

function istYear(now: Date): number {
  return Number(
    new Intl.DateTimeFormat("en-CA", { timeZone: IST, year: "numeric" }).format(now),
  );
}

function dayWindow(year: number, month: number, day: number): QuoteWindow {
  const from = new Date(
    `${year}-${pad(month)}-${pad(day)}T00:00:00+05:30`,
  );
  return {
    from,
    until: new Date(from.getTime() + 86_400_000 - 1),
    label: `on ${from.toLocaleDateString("en-IN", {
      timeZone: IST,
      day: "numeric",
      month: "short",
      year: "numeric",
    })}`,
  };
}

function yearForMonthDay(month: number, day: number, now: Date, explicit?: number): number {
  if (explicit) return explicit;
  const year = istYear(now);
  const candidate = new Date(`${year}-${pad(month)}-${pad(day)}T00:00:00+05:30`);
  return candidate.getTime() > now.getTime() ? year - 1 : year;
}

export function mentionedDay(query: string, now = new Date()): QuoteWindow | null {
  const q = query.toLowerCase();
  const iso = q.match(/\b(\d{4})-(\d{2})-(\d{2})\b/);
  if (iso) return dayWindow(Number(iso[1]), Number(iso[2]), Number(iso[3]));

  const numeric = q.match(/\b(\d{1,2})[/-](\d{1,2})[/-](\d{4})\b/);
  if (numeric) {
    return dayWindow(Number(numeric[3]), Number(numeric[2]), Number(numeric[1]));
  }

  const dayFirst = q.match(
    new RegExp(`\\b(\\d{1,2})(?:st|nd|rd|th)?\\s+(${MONTH_PATTERN})(?:\\s+(\\d{4}))?\\b`),
  );
  if (dayFirst) {
    const day = Number(dayFirst[1]);
    const month = MONTHS[dayFirst[2]!]!;
    return dayWindow(
      yearForMonthDay(month, day, now, dayFirst[3] ? Number(dayFirst[3]) : undefined),
      month,
      day,
    );
  }

  const monthFirst = q.match(
    new RegExp(
      `\\b(${MONTH_PATTERN})\\s+(\\d{1,2})(?:st|nd|rd|th)?(?:,)?(?:\\s+(\\d{4}))?\\b`,
    ),
  );
  if (monthFirst) {
    const month = MONTHS[monthFirst[1]!]!;
    const day = Number(monthFirst[2]);
    return dayWindow(
      yearForMonthDay(month, day, now, monthFirst[3] ? Number(monthFirst[3]) : undefined),
      month,
      day,
    );
  }

  return null;
}

export function selectByTime<T>(
  items: T[],
  timeOf: (item: T) => string,
  window: QuoteWindow | null,
): T[] {
  return items
    .filter((item) => {
      if (!window) return true;
      const at = new Date(timeOf(item)).getTime();
      return at >= window.from.getTime() && at <= window.until.getTime();
    })
    .sort((a, b) => new Date(timeOf(b)).getTime() - new Date(timeOf(a)).getTime());
}

export function quoteReferences(query: string): string[] {
  const quoted = [...query.matchAll(/['"]([^'"]{3,40})['"]/g)].map((match) => match[1]!.trim());
  const bare = query.match(/\b[A-Za-z0-9][A-Za-z0-9-]{4,}\b/g) ?? [];
  const refs = [...quoted, ...bare].filter(
    (token) => /[A-Za-z]/.test(token) && /\d/.test(token),
  );
  return [...new Set(refs.map((token) => token.toLowerCase()))];
}

export function selectQuotesByReference<T extends { id: string }>(
  quotes: T[],
  references: string[],
): T[] {
  if (references.length === 0) return quotes;
  return quotes.filter((quote) =>
    references.some((reference) => quote.id.toLowerCase().includes(reference)),
  );
}

export function emailAnswer(count: number, day: QuoteWindow | null): string {
  const scope = day ? ` received ${day.label}` : "";
  if (count === 0) {
    return day ? `No emails received ${day.label}.` : "No emails found.";
  }
  return `Found ${count} email${count === 1 ? "" : "s"}${scope}.`;
}
