"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ExternalLink, Phone } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/atoms/badge";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { Label } from "@/components/atoms/label";
import { Textarea } from "@/components/atoms/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { PRODUCT_TYPE_LABELS } from "@/features/contact/schemas";
import {
  BOOKING_BASIS_LABELS,
  type UpdateShipmentInput,
} from "@/features/shipments/schemas";
import {
  formatDateTime,
  statusBadgeVariant,
} from "@/features/shipments/labels";
import type { ManagedShipment, ShipmentStatus } from "@/types";
import { SHIPMENT_STATUSES } from "@/types";
import { EstimatedRouteMapCard } from "@/features/tracking/components/estimated-route-map-card";

type ShipmentDetailSheetProps = {
  shipment: ManagedShipment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onChanged: (shipment: ManagedShipment) => void;
};

function Field({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) {
  if (value == null || value === "") return null;
  return (
    <div className="flex justify-between gap-4 text-sm">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="max-w-[60%] text-right font-medium">{value}</dd>
    </div>
  );
}

function toDatetimeLocalValue(iso?: string): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60_000);
  return local.toISOString().slice(0, 16);
}

export function ShipmentDetailSheet({
  shipment,
  open,
  onOpenChange,
  onChanged,
}: ShipmentDetailSheetProps) {
  const [status, setStatus] = useState<ShipmentStatus>("Processing");
  const [carrierName, setCarrierName] = useState("");
  const [carrierRef, setCarrierRef] = useState("");
  const [estimatedEta, setEstimatedEta] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [internalNotes, setInternalNotes] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!shipment) return;
    setStatus(shipment.status);
    setCarrierName(shipment.carrierName ?? "");
    setCarrierRef(shipment.carrierRef ?? "");
    setEstimatedEta(toDatetimeLocalValue(shipment.estimatedEtaIso));
    setAssignedTo(shipment.assignedTo ?? "");
    setInternalNotes(shipment.internalNotes ?? "");
  }, [shipment]);

  if (!shipment) return null;

  const bookingLabel =
    BOOKING_BASIS_LABELS[
      shipment.bookingBasis as keyof typeof BOOKING_BASIS_LABELS
    ] ?? shipment.bookingBasis;

  const save = async () => {
    const payload: UpdateShipmentInput = {
      status,
      carrierName,
      carrierRef,
      assignedTo,
      internalNotes,
      estimatedEta: estimatedEta
        ? new Date(estimatedEta).toISOString()
        : "",
    };

    setSaving(true);
    try {
      const res = await fetch(`/api/shipments/${shipment.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = (await res.json()) as {
        success: boolean;
        data?: ManagedShipment;
        error?: string;
      };
      if (!res.ok || !json.success || !json.data) {
        throw new Error(json.error ?? "Failed to update shipment");
      }
      onChanged(json.data);
      toast.success("Shipment updated");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update shipment",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full overflow-y-auto sm:max-w-xl"
      >
        <SheetTitle className="font-display text-left text-xl font-bold">
          Shipment {shipment.id}
        </SheetTitle>

        <div className="mt-2 space-y-6 pb-8">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              {shipment.origin} → {shipment.destination} · {shipment.type}
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={statusBadgeVariant(shipment.status)}>
                {shipment.status}
              </Badge>
              <Badge variant="secondary">{bookingLabel}</Badge>
              {shipment.bookingBasis === "verbal_ok" ? (
                <Badge variant="accent" className="gap-1">
                  <Phone className="size-3" aria-hidden />
                  Phone booking
                </Badge>
              ) : null}
            </div>
            <p className="text-xs text-muted-foreground">
              Update status after phone calls or carrier updates. Public tracking
              at /track reflects saved status.
            </p>
          </div>

          <section className="space-y-3 rounded-lg border border-border p-4">
            <EstimatedRouteMapCard
              origin={shipment.origin}
              destination={shipment.destination}
              status={shipment.status}
              mode={shipment.type}
              eta={shipment.eta}
              estimatedEtaIso={shipment.estimatedEtaIso}
              createdAt={shipment.createdAt}
              predictedEtaHours={shipment.predictedEtaHours}
              theme="light"
            />
          </section>

          <section className="space-y-4 rounded-lg border-2 border-accent/30 bg-accent/5 p-4">
            <div>
              <h3 className="font-semibold">Update status</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                1. Pick a new status below · 2. Click{" "}
                <strong className="text-foreground">Save changes</strong>
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="shipment-status">Status</Label>
              <Select
                value={status}
                onValueChange={(value) => setStatus(value as ShipmentStatus)}
              >
                <SelectTrigger id="shipment-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SHIPMENT_STATUSES.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="carrier-name">Carrier</Label>
                <Input
                  id="carrier-name"
                  value={carrierName}
                  onChange={(e) => setCarrierName(e.target.value)}
                  placeholder="Maersk, Emirates SkyCargo…"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="carrier-ref">AWB / BL / booking ref</Label>
                <Input
                  id="carrier-ref"
                  value={carrierRef}
                  onChange={(e) => setCarrierRef(e.target.value)}
                  placeholder="Reference from carrier"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="estimated-eta">Estimated arrival</Label>
              <Input
                id="estimated-eta"
                type="datetime-local"
                value={estimatedEta}
                onChange={(e) => setEstimatedEta(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="assigned-to">Assigned to</Label>
              <Input
                id="assigned-to"
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                placeholder="Ops owner"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="internal-notes">Internal notes</Label>
              <Textarea
                id="internal-notes"
                value={internalNotes}
                onChange={(e) => setInternalNotes(e.target.value)}
                placeholder="Phone call notes, customs instructions…"
                rows={4}
              />
            </div>
            <Button
              rounded="none"
              className="w-full sm:w-auto"
              disabled={saving}
              onClick={() => void save()}
            >
              {saving ? "Saving…" : "Save changes"}
            </Button>
          </section>

          <section className="space-y-3 rounded-lg border border-border p-4">
            <h3 className="font-semibold">Client & booking</h3>
            <dl className="space-y-2">
              <Field label="Company" value={shipment.client} />
              <Field label="Contact" value={shipment.contactName} />
              <Field label="Email" value={shipment.contactEmail} />
              <Field label="Phone" value={shipment.contactPhone} />
              <Field label="Cargo ready" value={shipment.cargoReadyDate} />
              <Field label="Target delivery" value={shipment.targetDeliveryDate} />
              <Field label="Pickup" value={shipment.pickupLocation} />
              <Field label="Delivery" value={shipment.deliveryLocation} />
              {shipment.productType ? (
                <Field
                  label="Product"
                  value={
                    PRODUCT_TYPE_LABELS[
                      shipment.productType as keyof typeof PRODUCT_TYPE_LABELS
                    ] ?? shipment.productType
                  }
                />
              ) : null}
              <Field label="Packages" value={shipment.totalPackages} />
              <Field label="Weight" value={shipment.approxWeight} />
              <Field label="Created" value={formatDateTime(shipment.createdAt)} />
              <Field label="Updated" value={formatDateTime(shipment.updatedAt)} />
            </dl>
          </section>

          <Link
            href={`/track?id=${encodeURIComponent(shipment.id)}`}
            target="_blank"
            className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline"
          >
            Open public tracker
            <ExternalLink className="size-3.5" aria-hidden />
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
}
