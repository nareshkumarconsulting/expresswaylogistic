"use client";

import type { ReactNode } from "react";
import { ArrowDown, ArrowRight, CheckCircle2, Truck, User } from "lucide-react";
import { STATUS_FILTER_LABELS } from "@/features/quotes/labels";
import { cn } from "@/lib/utils";
import type { QuoteRequestStatus } from "@/types";
import {
  QUOTE_STATUS_GROUPS,
  quoteStatusTone,
} from "@/features/command-center/components/quote-status-overview";

export function quoteStatusTileClass(
  status: QuoteRequestStatus,
  count: number,
  selected = false,
) {
  const tone = quoteStatusTone(status);
  return cn(
    "rounded-lg border px-4 py-4 text-left transition-colors",
    tone.tile,
    count === 0 && "opacity-55",
    selected && "ring-2 ring-primary ring-offset-2 ring-offset-background",
  );
}

export function QuoteStatusTileBody({
  status,
  count,
}: {
  status: QuoteRequestStatus;
  count: number;
}) {
  const tone = quoteStatusTone(status);
  return (
    <>
      <p
        className={cn(
          "text-3xl font-bold tabular-nums leading-none",
          tone.count,
        )}
      >
        {count}
      </p>
      <p className="mt-2 text-sm font-semibold leading-5">
        {STATUS_FILTER_LABELS[status]}
      </p>
      <p className="mt-0.5 text-[11px] text-muted-foreground">
        {count === 1 ? "1 request" : `${count} requests`}
      </p>
    </>
  );
}

function StatusGroup({
  label,
  hint,
  icon: Icon,
  columns,
  children,
}: {
  label: string;
  hint: string;
  icon: typeof User;
  columns: string;
  children: ReactNode;
}) {
  return (
    <div className="min-w-0 space-y-3">
      <div className="flex items-start gap-2">
        <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md bg-background/80 text-primary">
          <Icon className="size-4" aria-hidden />
        </span>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            {label}
          </p>
          <p className="text-xs text-muted-foreground">{hint}</p>
        </div>
      </div>
      <div className={cn("grid gap-3", columns)}>{children}</div>
    </div>
  );
}

function PipelineHandoff({
  label,
  direction,
}: {
  label: string;
  direction: "right" | "down";
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-center gap-0",
        direction === "right"
          ? "px-2 py-1 lg:flex-col lg:self-stretch lg:px-1 lg:py-4"
          : "px-6 py-1",
      )}
      aria-hidden
    >
      <span
        className={cn(
          "bg-border",
          direction === "right"
            ? "h-px w-8 lg:h-full lg:min-h-6 lg:w-px"
            : "h-px min-w-8 flex-1",
        )}
      />
      <div className="z-10 mx-1 flex shrink-0 flex-col items-center gap-1 rounded-full border border-border bg-background px-2.5 py-2 shadow-sm">
        <span className="flex size-7 items-center justify-center rounded-full bg-accent text-accent-foreground">
          {direction === "right" ? (
            <>
              <ArrowDown className="size-3.5 lg:hidden" />
              <ArrowRight className="hidden size-3.5 lg:block" />
            </>
          ) : (
            <ArrowDown className="size-3.5" />
          )}
        </span>
        <span className="max-w-[4.75rem] text-center text-[10px] font-semibold uppercase leading-3 tracking-[0.12em] text-muted-foreground">
          {label}
        </span>
      </div>
      <span
        className={cn(
          "bg-border",
          direction === "right"
            ? "h-px w-8 lg:h-full lg:min-h-6 lg:w-px"
            : "h-px min-w-8 flex-1",
        )}
      />
    </div>
  );
}

type QuoteStatusPipelineProps = {
  counts: Record<QuoteRequestStatus, number>;
  renderTile: (status: QuoteRequestStatus, count: number) => ReactNode;
};

export function QuoteStatusPipeline({
  counts,
  renderTile,
}: QuoteStatusPipelineProps) {
  const [customer, forwarders, closed] = QUOTE_STATUS_GROUPS;

  return (
    <div className="space-y-1">
      <div className="grid items-stretch gap-0 rounded-xl border border-border bg-card lg:grid-cols-[1fr_auto_1fr]">
        <div className="bg-secondary/10 p-4 sm:p-5">
          <StatusGroup
            label={customer.label}
            hint={customer.hint}
            icon={User}
            columns="grid-cols-3"
          >
            {customer.statuses.map((status) =>
              renderTile(status, counts[status]),
            )}
          </StatusGroup>
        </div>
        <PipelineHandoff label="Ask partners" direction="right" />
        <div className="bg-warning/10 p-4 sm:p-5">
          <StatusGroup
            label={forwarders.label}
            hint={forwarders.hint}
            icon={Truck}
            columns="grid-cols-3"
          >
            {forwarders.statuses.map((status) =>
              renderTile(status, counts[status]),
            )}
          </StatusGroup>
        </div>
      </div>

      <PipelineHandoff label="Then close" direction="down" />

      <div className="rounded-xl border border-border bg-muted/40 p-4 sm:p-5">
        <StatusGroup
          label={closed.label}
          hint={closed.hint}
          icon={CheckCircle2}
          columns="grid-cols-2 sm:grid-cols-4"
        >
          {closed.statuses.map((status) => renderTile(status, counts[status]))}
        </StatusGroup>
      </div>
    </div>
  );
}
