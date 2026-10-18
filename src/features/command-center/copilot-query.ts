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

function startOfIstDay(now: Date): Date {
  const day = new Intl.DateTimeFormat("en-CA", {
    timeZone: IST,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
  return new Date(`${day}T00:00:00+05:30`);
}

export function quoteWindow(query: string, now = new Date()): QuoteWindow | null {
  const q = query.toLowerCase();
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

  if (/\blast week\b/.test(q)) {
    return {
      from: new Date(startToday.getTime() - 6 * 86_400_000),
      until: now,
      label: "the last week",
    };
  }

  return null;
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

export function quoteAnswer(quotes: CopilotQuote[], window: QuoteWindow | null): string {
  const scope = window ? ` ${window.label}` : "";
  if (quotes.length === 0) {
    return window
      ? `No quote requests ${window.label}.`
      : "No quote requests found.";
  }
  return `Found ${quotes.length} quote request${quotes.length === 1 ? "" : "s"}${scope}.`;
}
