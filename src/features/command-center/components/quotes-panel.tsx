"use client";

import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/atoms/badge";
import { Input } from "@/components/atoms/input";
import { Spinner } from "@/components/atoms/spinner";
import { StateAlert } from "@/components/molecules/state-alert";
import {
  QuoteDetailSheet,
  type QuoteUpdatePayload,
} from "@/features/command-center/components/quote-detail-sheet";
import { cn } from "@/lib/utils";
import type { QuoteRequest, QuoteRequestStatus } from "@/types";

const SERVICE_TYPE_LABELS: Record<QuoteRequest["serviceType"], string> = {
  air: "Air Freight",
  "ocean-fcl": "Ocean FCL",
  "ocean-lcl": "Ocean LCL",
  consolidation: "Consolidation",
  customs: "Customs",
  warehousing: "Warehousing",
  "door-to-door": "Door-to-Door",
  "project-cargo": "Project Cargo",
  "cargo-insurance": "Cargo Insurance",
  "exim-advisory": "EXIM Advisory",
  packing: "Packing & Handling",
};

type StatusFilter = "all" | QuoteRequestStatus;

const STATUS_FILTERS: { id: StatusFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "New", label: "New" },
  { id: "In Review", label: "In Review" },
  { id: "Quoted", label: "Quoted" },
  { id: "Won", label: "Won" },
  { id: "Closed", label: "Closed" },
];

async function fetchQuotes(): Promise<QuoteRequest[]> {
  const res = await fetch("/api/quotes");
  const json = (await res.json()) as {
    success: boolean;
    data: QuoteRequest[];
  };
  if (!res.ok || !json.success) throw new Error("Failed to load quotes");
  return json.data;
}

function statusBadgeVariant(
  status: QuoteRequestStatus,
): "secondary" | "warning" | "success" | "accent" | "muted" {
  switch (status) {
    case "New":
      return "secondary";
    case "In Review":
      return "warning";
    case "Quoted":
      return "accent";
    case "Won":
      return "success";
    case "Closed":
      return "muted";
    default:
      return "muted";
  }
}

function formatSubmittedAt(iso: string): string {
  return new Date(iso).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function QuotesPanel() {
  const queryClient = useQueryClient();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["quotes"],
    queryFn: fetchQuotes,
  });

  const selectedQuote = useMemo(
    () => data?.find((q) => q.id === selectedId) ?? null,
    [data, selectedId],
  );

  const counts = useMemo(() => {
    if (!data) {
      return {
        all: 0,
        New: 0,
        "In Review": 0,
        Quoted: 0,
        Won: 0,
        Closed: 0,
      };
    }
    return {
      all: data.length,
      New: data.filter((q) => q.status === "New").length,
      "In Review": data.filter((q) => q.status === "In Review").length,
      Quoted: data.filter((q) => q.status === "Quoted").length,
      Won: data.filter((q) => q.status === "Won").length,
      Closed: data.filter((q) => q.status === "Closed").length,
    };
  }, [data]);

  const filtered = useMemo(() => {
    if (!data) return [];
    const q = query.toLowerCase();
    return data.filter((item) => {
      if (statusFilter !== "all" && item.status !== statusFilter) return false;
      if (!q) return true;
      return (
        item.id.toLowerCase().includes(q) ||
        item.company.toLowerCase().includes(q) ||
        item.name.toLowerCase().includes(q) ||
        item.origin.toLowerCase().includes(q) ||
        item.destination.toLowerCase().includes(q) ||
        item.serviceType.toLowerCase().includes(q) ||
        item.status.toLowerCase().includes(q) ||
        item.message.toLowerCase().includes(q)
      );
    });
  }, [data, query, statusFilter]);

  const openQuote = (id: string) => {
    setSelectedId(id);
    setSheetOpen(true);
  };

  const handleSave = (id: string, update: QuoteUpdatePayload) => {
    queryClient.setQueryData<QuoteRequest[]>(["quotes"], (current) => {
      if (!current) return current;
      return current.map((quote) =>
        quote.id === id
          ? {
              ...quote,
              status: update.status,
              internalNotes: update.internalNotes || undefined,
              quotedAmount: update.quotedAmount || undefined,
              updatedAt: new Date().toISOString(),
            }
          : quote,
      );
    });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[30vh] items-center justify-center">
        <Spinner label="Loading quote requests" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <StateAlert
        variant="error"
        title="Quote requests unavailable"
        onRetry={() => void refetch()}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold">Quote Requests</h2>
          <p className="text-sm text-muted-foreground">
            Click a row to update status, amount, and internal notes
          </p>
        </div>
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter by ID, company, lane, cargo…"
          className="sm:max-w-sm"
          aria-label="Filter quote requests"
        />
      </div>

      <div
        className="inline-flex flex-wrap rounded-lg border border-border bg-card p-1"
        role="tablist"
        aria-label="Filter quotes by status"
      >
        {STATUS_FILTERS.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={statusFilter === item.id}
            onClick={() => setStatusFilter(item.id)}
            className={cn(
              "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              statusFilter === item.id
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {item.label}
            <span className="ml-1.5 tabular-nums opacity-70">
              {counts[item.id]}
            </span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <StateAlert
          variant="info"
          title="No matching quote requests"
          description="Adjust your filter or clear the search."
        />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border bg-card shadow-sm">
          <table className="w-full min-w-[960px] text-left text-sm">
            <thead className="border-b bg-muted/50 text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Reference</th>
                <th className="px-4 py-3 font-medium">Company</th>
                <th className="px-4 py-3 font-medium">Lane</th>
                <th className="px-4 py-3 font-medium">Service</th>
                <th className="px-4 py-3 font-medium">Contact</th>
                <th className="px-4 py-3 font-medium">Submitted</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((quote) => (
                <tr
                  key={quote.id}
                  className={cn(
                    "cursor-pointer border-b last:border-0 align-top transition-colors hover:bg-muted/40",
                    selectedId === quote.id && sheetOpen && "bg-muted/50",
                  )}
                  onClick={() => openQuote(quote.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      openQuote(quote.id);
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  aria-label={`Open quote ${quote.id}`}
                >
                  <td className="px-4 py-3">
                    <p className="font-semibold">{quote.id}</p>
                    <p className="mt-1 max-w-[220px] text-xs text-muted-foreground line-clamp-2">
                      {quote.message}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium">{quote.company}</p>
                    <p className="text-xs text-muted-foreground">{quote.name}</p>
                  </td>
                  <td className="px-4 py-3">
                    {quote.origin} → {quote.destination}
                  </td>
                  <td className="px-4 py-3">
                    {SERVICE_TYPE_LABELS[quote.serviceType]}
                  </td>
                  <td className="px-4 py-3">
                    <p>{quote.email}</p>
                    {quote.phone ? (
                      <p className="text-xs text-muted-foreground">
                        {quote.phone}
                      </p>
                    ) : null}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                    {formatSubmittedAt(quote.submittedAt)}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={statusBadgeVariant(quote.status)}>
                      {quote.status}
                    </Badge>
                    {quote.quotedAmount ? (
                      <p className="mt-1 text-xs text-muted-foreground">
                        {quote.quotedAmount}
                      </p>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <QuoteDetailSheet
        quote={selectedQuote}
        open={sheetOpen}
        onOpenChange={(open) => {
          setSheetOpen(open);
          if (!open) setSelectedId(null);
        }}
        onSave={handleSave}
        statusBadgeVariant={statusBadgeVariant}
      />
    </div>
  );
}
