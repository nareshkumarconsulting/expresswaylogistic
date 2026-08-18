"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Sparkles } from "lucide-react";
import { Input } from "@/components/atoms/input";
import { Spinner } from "@/components/atoms/spinner";
import { StateAlert } from "@/components/molecules/state-alert";
import { QuoteDetailSheet } from "@/features/command-center/components/quote-detail-sheet";
import {
  QuoteStatusFilters,
  type StatusFilter,
} from "@/features/command-center/components/quote-status-filters";
import {
  formatDateTime,
  SERVICE_TYPE_LABELS,
  STATUS_CHIP_LABELS,
  emailAiBadgeLabel,
  statusBadgeVariant,
} from "@/features/quotes/labels";
import { cn } from "@/lib/utils";
import type { Forwarder, QuoteRequest } from "@/types";
import { QUOTE_REQUEST_STATUSES } from "@/types";

async function fetchQuotes(): Promise<QuoteRequest[]> {
  const res = await fetch("/api/quotes");
  const json = (await res.json()) as {
    success: boolean;
    data: QuoteRequest[];
  };
  if (!res.ok || !json.success) throw new Error("Failed to load quotes");
  return json.data;
}

async function fetchForwarders(): Promise<Forwarder[]> {
  const res = await fetch("/api/forwarders");
  const json = (await res.json()) as { success: boolean; data: Forwarder[] };
  if (!res.ok || !json.success) return [];
  return json.data;
}

async function fetchQuote(id: string): Promise<QuoteRequest> {
  const res = await fetch(`/api/quotes/${id}`);
  const json = (await res.json()) as { success: boolean; data: QuoteRequest };
  if (!res.ok || !json.success) throw new Error("Failed to load quote");
  return json.data;
}

function isStatusFilter(value: string | null): value is StatusFilter {
  return (
    value === "all" ||
    (QUOTE_REQUEST_STATUSES as readonly string[]).includes(value ?? "")
  );
}

type AiFilter = "all" | "email" | "needs_info" | "needs_review";

function isAiFilter(value: string | null): value is AiFilter {
  return (
    value === "all" ||
    value === "email" ||
    value === "needs_info" ||
    value === "needs_review"
  );
}

function statusChipTone(status: QuoteRequest["status"]): string {
  switch (statusBadgeVariant(status)) {
    case "success":
      return "border-success/30 bg-success/10 text-success";
    case "warning":
      return "border-warning/35 bg-warning/10 text-warning-foreground";
    case "accent":
      return "border-accent/35 bg-accent/10 text-accent";
    case "destructive":
      return "border-destructive/30 bg-destructive/10 text-destructive";
    case "secondary":
      return "border-secondary/40 bg-secondary/20 text-secondary-foreground";
    default:
      return "border-border bg-muted/70 text-muted-foreground";
  }
}

function aiChipTone(status: QuoteRequest["aiReviewStatus"]): string {
  if (status === "needs_info") {
    return "border-warning/40 bg-warning/15 text-warning-foreground";
  }
  if (status === "needs_review") {
    return "border-accent/40 bg-accent/15 text-accent";
  }
  return "border-border bg-muted/70 text-muted-foreground";
}

function QuoteRowStatus({ quote }: { quote: QuoteRequest }) {
  const aiLabel = emailAiBadgeLabel(quote);
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span
        className={cn(
          "inline-flex h-6 items-center rounded-full border px-2 text-[11px] font-semibold leading-none",
          statusChipTone(quote.status),
        )}
      >
        {STATUS_CHIP_LABELS[quote.status]}
      </span>
      {aiLabel ? (
        <span
          className={cn(
            "inline-flex h-6 items-center gap-1 rounded-full border px-2 text-[11px] font-semibold leading-none",
            aiChipTone(quote.aiReviewStatus),
          )}
        >
          <Sparkles className="size-3 shrink-0" aria-hidden />
          {aiLabel}
        </span>
      ) : null}
    </div>
  );
}

export function QuotesPanel() {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const statusFromUrl = searchParams.get("status");
  const quoteFromUrl = searchParams.get("quote");
  const aiFromUrl = searchParams.get("ai");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>(
    isStatusFilter(statusFromUrl) ? statusFromUrl : "all",
  );
  const [aiFilter, setAiFilter] = useState<AiFilter>(
    isAiFilter(aiFromUrl) ? aiFromUrl : "all",
  );
  const [originFilter, setOriginFilter] = useState("");
  const [destinationFilter, setDestinationFilter] = useState("");
  const [serviceFilter, setServiceFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(
    quoteFromUrl,
  );
  const [sheetOpen, setSheetOpen] = useState(Boolean(quoteFromUrl));

  useEffect(() => {
    if (isStatusFilter(statusFromUrl)) {
      setStatusFilter(statusFromUrl);
    }
  }, [statusFromUrl]);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["quotes"],
    queryFn: fetchQuotes,
  });

  const { data: forwarders = [] } = useQuery({
    queryKey: ["forwarders"],
    queryFn: fetchForwarders,
  });

  const { data: selectedQuote } = useQuery({
    queryKey: ["quotes", selectedId],
    queryFn: () => fetchQuote(selectedId as string),
    enabled: Boolean(selectedId && sheetOpen),
  });

  const aiCounts = useMemo(() => {
    const items = data ?? [];
    return {
      all: items.length,
      email: items.filter((item) => item.source === "email").length,
      needs_info: items.filter((item) => item.aiReviewStatus === "needs_info")
        .length,
      needs_review: items.filter(
        (item) => item.aiReviewStatus === "needs_review",
      ).length,
    };
  }, [data]);

  const counts = useMemo(() => {
    const base = {
      all: data?.length ?? 0,
    } as Record<StatusFilter, number>;
    for (const status of QUOTE_REQUEST_STATUSES) {
      base[status] = data?.filter((item) => item.status === status).length ?? 0;
    }
    return base;
  }, [data]);

  const filtered = useMemo(() => {
    if (!data) return [];
    const q = query.toLowerCase();
    return data.filter((item) => {
      if (statusFilter !== "all" && item.status !== statusFilter) return false;
      if (aiFilter === "email" && item.source !== "email") return false;
      if (aiFilter === "needs_info" && item.aiReviewStatus !== "needs_info")
        return false;
      if (aiFilter === "needs_review" && item.aiReviewStatus !== "needs_review")
        return false;
      if (serviceFilter !== "all" && item.serviceType !== serviceFilter)
        return false;
      if (
        originFilter &&
        !item.origin.toLowerCase().includes(originFilter.toLowerCase())
      )
        return false;
      if (
        destinationFilter &&
        !item.destination
          .toLowerCase()
          .includes(destinationFilter.toLowerCase())
      )
        return false;
      if (dateFilter && !item.submittedAt.startsWith(dateFilter)) return false;
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
  }, [
    aiFilter,
    data,
    dateFilter,
    destinationFilter,
    originFilter,
    query,
    serviceFilter,
    statusFilter,
  ]);

  const openQuote = (id: string) => {
    setSelectedId(id);
    setSheetOpen(true);
  };

  const handleChanged = (quote: QuoteRequest) => {
    queryClient.setQueryData<QuoteRequest[]>(["quotes"], (current) => {
      if (!current) return current;
      return current.map((item) => (item.id === quote.id ? { ...item, ...quote } : item));
    });
    queryClient.setQueryData(["quotes", quote.id], quote);
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
            Repeat customers can be quoted directly. New requests go to forwarders.
          </p>
        </div>
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search ID, customer, lane…"
          className="sm:max-w-sm"
          aria-label="Search quote requests"
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Input
          value={originFilter}
          onChange={(e) => setOriginFilter(e.target.value)}
          placeholder="Origin"
          aria-label="Filter by origin"
        />
        <Input
          value={destinationFilter}
          onChange={(e) => setDestinationFilter(e.target.value)}
          placeholder="Destination"
          aria-label="Filter by destination"
        />
        <select
          className="h-11 rounded-md border border-input bg-background px-3 text-sm"
          value={serviceFilter}
          onChange={(e) => setServiceFilter(e.target.value)}
          aria-label="Filter by service type"
        >
          <option value="all">All services</option>
          {Object.entries(SERVICE_TYPE_LABELS).map(([id, label]) => (
            <option key={id} value={id}>
              {label}
            </option>
          ))}
        </select>
        <Input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          aria-label="Filter by request date"
        />
      </div>

      <QuoteStatusFilters
        value={statusFilter}
        counts={counts}
        onChange={setStatusFilter}
      />

      <div
        className="flex flex-wrap gap-2"
        role="group"
        aria-label="Email AI filters"
      >
        {(
          [
            ["all", "All sources", aiCounts.all],
            ["email", "Email AI", aiCounts.email],
            ["needs_review", "AI drafts", aiCounts.needs_review],
            ["needs_info", "Needs info", aiCounts.needs_info],
          ] as const
        ).map(([id, label, count]) => (
          <button
            key={id}
            type="button"
            aria-pressed={aiFilter === id}
            onClick={() => setAiFilter(id)}
            className={cn(
              "rounded-lg border px-3 py-1.5 text-sm font-semibold transition-colors",
              aiFilter === id
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background text-muted-foreground hover:text-foreground",
            )}
          >
            {id !== "all" ? (
              <Sparkles className="mr-1 inline size-3.5 align-[-2px]" aria-hidden />
            ) : null}
            {label}{" "}
            <span className="tabular-nums">{count}</span>
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
          <table className="w-full min-w-[1100px] text-left text-sm">
            <thead className="border-b bg-muted/50 text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Request ID</th>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Request date</th>
                <th className="px-4 py-3 font-medium">Origin</th>
                <th className="px-4 py-3 font-medium">Destination</th>
                <th className="px-4 py-3 font-medium">Service</th>
                <th className="px-4 py-3 font-medium">Shipment</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Quotation</th>
                <th className="px-4 py-3 font-medium">Updated</th>
                <th className="px-4 py-3 font-medium">Assigned</th>
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
                  <td className="px-4 py-3 font-semibold">{quote.id}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium">{quote.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {quote.company}
                      {quote.isRepeatCustomer ? " · Repeat" : ""}
                    </p>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                    {formatDateTime(quote.submittedAt)}
                  </td>
                  <td className="px-4 py-3">{quote.origin}</td>
                  <td className="px-4 py-3">{quote.destination}</td>
                  <td className="px-4 py-3">
                    {SERVICE_TYPE_LABELS[quote.serviceType]}
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {quote.approxWeight ?? "—"}
                    {quote.totalPackages != null
                      ? ` · ${quote.totalPackages} pkgs`
                      : ""}
                  </td>
                  <td className="px-4 py-3">
                    <QuoteRowStatus quote={quote} />
                  </td>
                  <td className="px-4 py-3">{quote.quotedAmount ?? "—"}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                    {formatDateTime(quote.updatedAt ?? quote.submittedAt)}
                  </td>
                  <td className="px-4 py-3">{quote.assignedTo ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <QuoteDetailSheet
        quote={selectedQuote ?? data.find((q) => q.id === selectedId) ?? null}
        forwarders={forwarders}
        open={sheetOpen}
        onOpenChange={(open) => {
          setSheetOpen(open);
          if (!open) setSelectedId(null);
        }}
        onChanged={handleChanged}
      />
    </div>
  );
}
