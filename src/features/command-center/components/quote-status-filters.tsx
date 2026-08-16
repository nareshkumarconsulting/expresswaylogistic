"use client";

import { statusBadgeVariant } from "@/features/quotes/labels";
import { cn } from "@/lib/utils";
import type { QuoteRequestStatus } from "@/types";

export type StatusFilter = "all" | QuoteRequestStatus;

const PILL_COPY: Record<StatusFilter, { title: string; who: string }> = {
  all: { title: "All", who: "Every request" },
  New: { title: "New request", who: "From the customer" },
  "Under Review": { title: "In review", who: "Internal team" },
  "Sent to Forwarders": { title: "Quote requested", who: "To partners" },
  "Awaiting Forwarder Quotes": { title: "Waiting on quote", who: "From partners" },
  "Quote Received": { title: "Quote received", who: "From partners" },
  Quoted: { title: "Quote emailed", who: "To the customer" },
  "Quote Ready / Email Failed": {
    title: "Email failed",
    who: "To the customer",
  },
  Accepted: { title: "Accepted", who: "By the customer" },
  Rejected: { title: "Rejected", who: "By the customer" },
  Expired: { title: "Expired", who: "Customer quote lapsed" },
};

const CUSTOMER: StatusFilter[] = ["all", "New", "Under Review", "Quoted"];

const FORWARDERS: StatusFilter[] = [
  "Sent to Forwarders",
  "Awaiting Forwarder Quotes",
  "Quote Received",
];

const CLOSED: StatusFilter[] = [
  "Quote Ready / Email Failed",
  "Accepted",
  "Rejected",
  "Expired",
];

function countTone(id: StatusFilter): string {
  if (id === "all") return "bg-muted text-muted-foreground";
  const variant = statusBadgeVariant(id);
  switch (variant) {
    case "success":
      return "bg-success/15 text-success";
    case "warning":
      return "bg-warning/15 text-warning-foreground";
    case "accent":
      return "bg-accent/15 text-accent";
    case "destructive":
      return "bg-destructive/15 text-destructive";
    case "secondary":
      return "bg-secondary/20 text-secondary-foreground";
    default:
      return "bg-muted text-muted-foreground";
  }
}

function StatusPill({
  id,
  count,
  selected,
  onSelect,
}: {
  id: StatusFilter;
  count: number;
  selected: boolean;
  onSelect: (id: StatusFilter) => void;
}) {
  const copy = PILL_COPY[id];
  return (
    <button
      type="button"
      role="tab"
      aria-selected={selected}
      aria-label={`${copy.title} (${copy.who}), ${count}`}
      title={`${copy.title} — ${copy.who}`}
      onClick={() => onSelect(id)}
      className={cn(
        "inline-flex min-w-[9.5rem] shrink-0 items-center justify-between gap-3 rounded-xl border px-3 py-2 text-left transition-colors",
        selected
          ? "border-primary bg-primary text-primary-foreground shadow-sm"
          : "border-border bg-background text-foreground hover:border-primary/40 hover:bg-muted/50",
      )}
    >
      <span className="min-w-0">
        <span className="block text-sm font-semibold leading-5">{copy.title}</span>
        <span
          className={cn(
            "block text-[11px] leading-4",
            selected ? "text-primary-foreground/80" : "text-muted-foreground",
          )}
        >
          {copy.who}
        </span>
      </span>
      <span
        className={cn(
          "inline-flex min-w-6 items-center justify-center rounded-full px-1.5 text-[11px] font-semibold tabular-nums leading-5",
          selected ? "bg-white/20 text-primary-foreground" : countTone(id),
        )}
      >
        {count}
      </span>
    </button>
  );
}

function StatusRow({
  label,
  hint,
  items,
  value,
  counts,
  onChange,
}: {
  label: string;
  hint: string;
  items: StatusFilter[];
  value: StatusFilter;
  counts: Record<StatusFilter, number>;
  onChange: (value: StatusFilter) => void;
}) {
  return (
    <div className="space-y-2">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          {label}
        </p>
        <p className="text-xs text-muted-foreground">{hint}</p>
      </div>
      <div
        className="flex gap-2 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="tablist"
        aria-label={label}
      >
        {items.map((id) => (
          <StatusPill
            key={id}
            id={id}
            count={counts[id] ?? 0}
            selected={value === id}
            onSelect={onChange}
          />
        ))}
      </div>
    </div>
  );
}

type QuoteStatusFiltersProps = {
  value: StatusFilter;
  counts: Record<StatusFilter, number>;
  onChange: (value: StatusFilter) => void;
};

export function QuoteStatusFilters({
  value,
  counts,
  onChange,
}: QuoteStatusFiltersProps) {
  return (
    <div className="space-y-5 rounded-xl border border-border bg-card p-4">
      <StatusRow
        label="Customer"
        hint="The person who asked for the quotation"
        items={CUSTOMER}
        value={value}
        counts={counts}
        onChange={onChange}
      />
      <div className="border-t border-border pt-5">
        <StatusRow
          label="Forwarders"
          hint="Ask partners for a quote, then wait for their reply"
          items={FORWARDERS}
          value={value}
          counts={counts}
          onChange={onChange}
        />
      </div>
      <div className="border-t border-border pt-5">
        <StatusRow
          label="Closed"
          hint="Finished or failed quotes"
          items={CLOSED}
          value={value}
          counts={counts}
          onChange={onChange}
        />
      </div>
    </div>
  );
}
