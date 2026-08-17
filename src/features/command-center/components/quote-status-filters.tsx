"use client";

import type { ReactNode } from "react";
import { QUOTE_STATUS_GROUPS, quoteStatusTone } from "@/features/command-center/components/quote-status-overview";
import {
  STATUS_CHIP_LABELS,
  STATUS_FILTER_LABELS,
} from "@/features/quotes/labels";
import { cn } from "@/lib/utils";
import type { QuoteRequestStatus } from "@/types";

export type StatusFilter = "all" | QuoteRequestStatus;

type QuoteStatusFiltersProps = {
  value: StatusFilter;
  counts: Record<StatusFilter, number>;
  onChange: (value: StatusFilter) => void;
};

function FilterLane({
  label,
  className,
  columns,
  children,
}: {
  label: string;
  className: string;
  columns: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border p-3 sm:p-4",
        className,
      )}
    >
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </p>
      <div className={cn("grid gap-2", columns)}>{children}</div>
    </div>
  );
}

function StatusChip({
  id,
  count,
  selected,
  onSelect,
}: {
  id: QuoteRequestStatus;
  count: number;
  selected: boolean;
  onSelect: (id: StatusFilter) => void;
}) {
  const tone = quoteStatusTone(id);
  return (
    <button
      type="button"
      aria-pressed={selected}
      aria-label={`${STATUS_FILTER_LABELS[id]}, ${count}`}
      onClick={() => onSelect(selected ? "all" : id)}
      className={cn(
        "flex items-center justify-between gap-2 rounded-lg border px-3 py-2 text-left transition-colors",
        selected
          ? "border-primary bg-primary text-primary-foreground shadow-sm"
          : cn(tone.tile, count === 0 && "opacity-55"),
      )}
    >
      <span className="text-sm font-semibold leading-5">
        {STATUS_CHIP_LABELS[id]}
      </span>
      <span
        className={cn(
          "text-sm font-bold tabular-nums",
          selected ? "text-primary-foreground" : tone.count,
        )}
      >
        {count}
      </span>
    </button>
  );
}

export function QuoteStatusFilters({
  value,
  counts,
  onChange,
}: QuoteStatusFiltersProps) {
  const [customer, forwarders, closed] = QUOTE_STATUS_GROUPS;

  return (
    <div className="space-y-3">
      <div className="grid items-stretch gap-3 lg:grid-cols-2">
        <FilterLane
          label={customer.label}
          className="bg-secondary/10"
          columns="grid-cols-3"
        >
          {customer.statuses.map((status) => (
            <StatusChip
              key={status}
              id={status}
              count={counts[status]}
              selected={value === status}
              onSelect={onChange}
            />
          ))}
        </FilterLane>
        <FilterLane
          label={forwarders.label}
          className="bg-warning/10"
          columns="grid-cols-3"
        >
          {forwarders.statuses.map((status) => (
            <StatusChip
              key={status}
              id={status}
              count={counts[status]}
              selected={value === status}
              onSelect={onChange}
            />
          ))}
        </FilterLane>
      </div>

      <FilterLane
        label={closed.label}
        className="bg-muted/40"
        columns="grid-cols-2 sm:grid-cols-4"
      >
        {closed.statuses.map((status) => (
          <StatusChip
            key={status}
            id={status}
            count={counts[status]}
            selected={value === status}
            onSelect={onChange}
          />
        ))}
      </FilterLane>

      {value !== "all" ? (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => onChange("all")}
            className="text-sm font-semibold text-accent hover:underline"
          >
            Show all
          </button>
        </div>
      ) : null}
    </div>
  );
}
