"use client";

import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/atoms/badge";
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
  STATUS_FILTER_LABELS,
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

export function QuotesPanel() {
  const queryClient = useQueryClient();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [originFilter, setOriginFilter] = useState("");
  const [destinationFilter, setDestinationFilter] = useState("");
  const [serviceFilter, setServiceFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

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
                    <Badge variant={statusBadgeVariant(quote.status)}>
                      {STATUS_FILTER_LABELS[quote.status]}
                    </Badge>
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
