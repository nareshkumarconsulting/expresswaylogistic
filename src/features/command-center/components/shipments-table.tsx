"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/atoms/badge";
import { Input } from "@/components/atoms/input";
import { Spinner } from "@/components/atoms/spinner";
import { StateAlert } from "@/components/molecules/state-alert";
import type { Shipment } from "@/types";

async function fetchShipments(): Promise<Shipment[]> {
  const res = await fetch("/api/shipments");
  const json = (await res.json()) as { success: boolean; data: Shipment[] };
  if (!res.ok || !json.success) throw new Error("Failed to load shipments");
  return json.data;
}

export function ShipmentsTable() {
  const [query, setQuery] = useState("");
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["shipments"],
    queryFn: fetchShipments,
  });

  const filtered = useMemo(() => {
    if (!data) return [];
    const q = query.toLowerCase();
    return data.filter(
      (s) =>
        s.id.toLowerCase().includes(q) ||
        s.client.toLowerCase().includes(q) ||
        s.origin.toLowerCase().includes(q) ||
        s.destination.toLowerCase().includes(q) ||
        s.status.toLowerCase().includes(q),
    );
  }, [data, query]);

  if (isLoading) {
    return (
      <div className="flex min-h-[30vh] items-center justify-center">
        <Spinner label="Loading shipments" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <StateAlert
        variant="error"
        title="Shipments unavailable"
        onRetry={() => void refetch()}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold">Shipments</h2>
          <p className="text-sm text-muted-foreground">
            Live operational board with risk scoring
          </p>
        </div>
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter by ID, client, lane, status…"
          className="sm:max-w-sm"
          aria-label="Filter shipments"
        />
      </div>

      {filtered.length === 0 ? (
        <StateAlert
          variant="info"
          title="No matching shipments"
          description="Adjust your filter or clear the search."
        />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border bg-card shadow-sm">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead className="border-b bg-muted/50 text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Shipment</th>
                <th className="px-4 py-3 font-medium">Lane</th>
                <th className="px-4 py-3 font-medium">Mode</th>
                <th className="px-4 py-3 font-medium">Client</th>
                <th className="px-4 py-3 font-medium">ETA</th>
                <th className="px-4 py-3 font-medium">Risk</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id} className="border-b last:border-0">
                  <td className="px-4 py-3 font-semibold">{s.id}</td>
                  <td className="px-4 py-3">
                    {s.origin} → {s.destination}
                  </td>
                  <td className="px-4 py-3">{s.type}</td>
                  <td className="px-4 py-3">{s.client}</td>
                  <td className="px-4 py-3">{s.eta}</td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        (s.riskScore ?? 0) >= 60
                          ? "font-semibold text-destructive"
                          : (s.riskScore ?? 0) >= 30
                            ? "font-semibold text-warning-foreground"
                            : "font-semibold text-success"
                      }
                    >
                      {s.riskScore ?? 0}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      variant={
                        s.status === "Delivered"
                          ? "success"
                          : s.status === "Delayed" ||
                              s.status === "Customs Hold"
                            ? "warning"
                            : "secondary"
                      }
                    >
                      {s.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
