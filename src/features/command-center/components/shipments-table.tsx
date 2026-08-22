"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil } from "lucide-react";
import { Badge } from "@/components/atoms/badge";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { Spinner } from "@/components/atoms/spinner";
import { StateAlert } from "@/components/molecules/state-alert";
import { ShipmentDetailSheet } from "@/features/command-center/components/shipment-detail-sheet";
import { statusBadgeVariant } from "@/features/shipments/labels";
import type { ManagedShipment, Shipment } from "@/types";

async function fetchShipments(): Promise<Shipment[]> {
  const res = await fetch("/api/shipments");
  const json = (await res.json()) as { success: boolean; data: Shipment[] };
  if (!res.ok || !json.success) throw new Error("Failed to load shipments");
  return json.data;
}

async function fetchShipment(id: string): Promise<ManagedShipment> {
  const res = await fetch(`/api/shipments/${id}`);
  const json = (await res.json()) as {
    success: boolean;
    data: ManagedShipment;
  };
  if (!res.ok || !json.success) throw new Error("Failed to load shipment");
  return json.data;
}

export function ShipmentsTable() {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const shipmentFromUrl = searchParams.get("shipment");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(
    shipmentFromUrl,
  );
  const [detail, setDetail] = useState<ManagedShipment | null>(null);
  const [sheetOpen, setSheetOpen] = useState(Boolean(shipmentFromUrl));

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["shipments"],
    queryFn: fetchShipments,
  });

  useEffect(() => {
    if (!shipmentFromUrl) return;
    setSelectedId(shipmentFromUrl);
    setSheetOpen(true);
  }, [shipmentFromUrl]);

  useEffect(() => {
    if (!selectedId || !sheetOpen) return;
    let cancelled = false;
    void fetchShipment(selectedId)
      .then((row) => {
        if (!cancelled) setDetail(row);
      })
      .catch(() => {
        if (!cancelled) {
          setDetail(null);
          setSheetOpen(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [selectedId, sheetOpen]);

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

  const openShipment = (id: string) => {
    setSelectedId(id);
    setSheetOpen(true);
  };

  const handleChanged = (updated: ManagedShipment) => {
    setDetail(updated);
    queryClient.setQueryData<Shipment[]>(["shipments"], (current) => {
      if (!current) return current;
      return current.map((row) =>
        row.id === updated.id
          ? {
              id: updated.id,
              origin: updated.origin,
              destination: updated.destination,
              type: updated.type,
              status: updated.status,
              eta: updated.eta,
              client: updated.client,
              predictedEtaHours: updated.predictedEtaHours,
              riskScore: updated.riskScore,
            }
          : row,
      );
    });
  };

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
    <>
      <div className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold">Shipments</h2>
            <p className="text-sm text-muted-foreground">
              Click <strong className="font-semibold text-foreground">Update</strong>{" "}
              on a row to change status (e.g. after a phone call)
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
            description="Adjust your filter or use + New Shipment in the header to create a booking."
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
                  <th className="px-4 py-3 font-medium">Action</th>
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
                      <Badge variant={statusBadgeVariant(s.status)}>
                        {s.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        rounded="none"
                        onClick={() => openShipment(s.id)}
                      >
                        <Pencil className="size-3.5" aria-hidden />
                        Update
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ShipmentDetailSheet
        shipment={detail}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        onChanged={handleChanged}
      />
    </>
  );
}
