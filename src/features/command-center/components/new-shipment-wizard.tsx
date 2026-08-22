"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Package,
  Plane,
  Ship,
  Truck,
} from "lucide-react";
import { toast } from "sonner";
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
import {
  CONTAINER_SIZE_LABELS,
  CONTAINER_SIZES,
  CONTAINER_TYPE_LABELS,
  CONTAINER_TYPES,
  PRODUCT_TYPE_LABELS,
  PRODUCT_TYPES,
} from "@/features/contact/schemas";
import {
  BOOKING_BASES,
  BOOKING_BASIS_LABELS,
  createDefaultShipmentValues,
  createShipmentSchema,
  FREIGHT_MODES,
  SHIPMENT_STEP_FIELDS,
  SHIPMENT_WIZARD_STEPS,
  type CreateShipmentInput,
  type ShipmentWizardStepId,
} from "@/features/shipments/schemas";
import { cn } from "@/lib/utils";
import { useUiStore } from "@/store/ui-store";
import type { Forwarder, Shipment } from "@/types";

type WizardPhase = "form" | "success";

type NewShipmentWizardProps = {
  forwarders?: Forwarder[];
};

function freightModeIcon(mode: CreateShipmentInput["freightMode"]) {
  if (mode === "Air Freight") return Plane;
  if (mode === "Road Freight") return Truck;
  return Ship;
}

function ReviewRow({ label, value }: { label: string; value?: string | number | null }) {
  if (value == null || value === "") return null;
  return (
    <div className="flex justify-between gap-4 text-sm">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="max-w-[60%] text-right font-medium">{value}</dd>
    </div>
  );
}

export function NewShipmentWizard({ forwarders = [] }: NewShipmentWizardProps) {
  const queryClient = useQueryClient();
  const open = useUiStore((s) => s.newShipmentOpen);
  const setOpen = useUiStore((s) => s.setNewShipmentOpen);
  const [step, setStep] = useState<ShipmentWizardStepId>("client");
  const [phase, setPhase] = useState<WizardPhase>("form");
  const [form, setForm] = useState(createDefaultShipmentValues);
  const [errors, setErrors] = useState<Partial<Record<keyof CreateShipmentInput, string>>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [created, setCreated] = useState<Shipment | null>(null);

  const stepIndex = SHIPMENT_WIZARD_STEPS.findIndex((item) => item.id === step);
  const activeForwarders = useMemo(
    () => forwarders.filter((row) => row.status === "Active"),
    [forwarders],
  );

  const reset = () => {
    setStep("client");
    setPhase("form");
    setForm(createDefaultShipmentValues());
    setErrors({});
    setSubmitError(null);
    setCreated(null);
  };

  const close = () => {
    setOpen(false);
    window.setTimeout(reset, 200);
  };

  const patch = <K extends keyof CreateShipmentInput>(
    key: K,
    value: CreateShipmentInput[K],
  ) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => {
      if (!current[key]) return current;
      const next = { ...current };
      delete next[key];
      return next;
    });
  };

  const validateStep = (stepId: ShipmentWizardStepId) => {
    const fields = SHIPMENT_STEP_FIELDS[stepId];
    const parsed = createShipmentSchema.safeParse(form);
    if (parsed.success) {
      setErrors({});
      return true;
    }

    const nextErrors: Partial<Record<keyof CreateShipmentInput, string>> = {};
    for (const issue of parsed.error.issues) {
      const path = issue.path[0];
      if (typeof path === "string" && fields.includes(path as keyof CreateShipmentInput)) {
        nextErrors[path as keyof CreateShipmentInput] = issue.message;
      }
    }

    if (stepId === "cargo") {
      for (const issue of parsed.error.issues) {
        const path = issue.path[0];
        if (path === "approxWeight" || path === "totalPackages") {
          nextErrors.approxWeight = issue.message;
        }
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const goNext = () => {
    if (!validateStep(step)) return;
    const next = SHIPMENT_WIZARD_STEPS[stepIndex + 1];
    if (next) setStep(next.id);
  };

  const goBack = () => {
    const prev = SHIPMENT_WIZARD_STEPS[stepIndex - 1];
    if (prev) setStep(prev.id);
  };

  const submit = async () => {
    setSubmitError(null);
    const parsed = createShipmentSchema.safeParse(form);
    if (!parsed.success) {
      setErrors(
        Object.fromEntries(
          parsed.error.issues.map((issue) => [
            issue.path[0],
            issue.message,
          ]),
        ) as Partial<Record<keyof CreateShipmentInput, string>>,
      );
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/shipments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const json = (await res.json()) as {
        success: boolean;
        data?: Shipment;
        error?: string;
      };
      if (!res.ok || !json.success || !json.data) {
        throw new Error(json.error ?? "Failed to create shipment");
      }
      setCreated(json.data);
      setPhase("success");
      await queryClient.invalidateQueries({ queryKey: ["shipments"] });
      toast.success(`Shipment ${json.data.id} created`);
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Failed to create shipment",
      );
    } finally {
      setSaving(false);
    }
  };

  const ModeIcon = freightModeIcon(form.freightMode);

  return (
    <Sheet
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) close();
        else setOpen(true);
      }}
    >
      <SheetContent side="right" className="w-[min(100%,32rem)] gap-0 p-0">
        {phase === "form" ? (
          <>
            <div className="border-b border-border px-6 py-5">
              <SheetTitle>New shipment</SheetTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                Manual booking — walk-in or repeat client without a quote in the system.
              </p>
              <ol
                className="mt-4 flex gap-2"
                aria-label="Shipment wizard steps"
              >
                {SHIPMENT_WIZARD_STEPS.map((item, index) => (
                  <li
                    key={item.id}
                    className={cn(
                      "h-1.5 flex-1 rounded-full",
                      index <= stepIndex ? "bg-accent" : "bg-muted",
                    )}
                    aria-hidden
                  />
                ))}
              </ol>
              <p className="mt-2 text-xs font-medium text-muted-foreground">
                Step {stepIndex + 1} of {SHIPMENT_WIZARD_STEPS.length}:{" "}
                {SHIPMENT_WIZARD_STEPS[stepIndex]?.label}
              </p>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
              {step === "client" ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="clientCompany">Client company</Label>
                    <Input
                      id="clientCompany"
                      value={form.clientCompany}
                      onChange={(e) => patch("clientCompany", e.target.value)}
                      placeholder="Reliance Industries"
                    />
                    {errors.clientCompany ? (
                      <p className="text-xs text-destructive">{errors.clientCompany}</p>
                    ) : null}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactName">Contact name</Label>
                    <Input
                      id="contactName"
                      value={form.contactName}
                      onChange={(e) => patch("contactName", e.target.value)}
                      placeholder="Priya Sharma"
                    />
                    {errors.contactName ? (
                      <p className="text-xs text-destructive">{errors.contactName}</p>
                    ) : null}
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="contactEmail">Email</Label>
                      <Input
                        id="contactEmail"
                        type="email"
                        value={form.contactEmail}
                        onChange={(e) => patch("contactEmail", e.target.value)}
                        placeholder="ops@client.com"
                      />
                      {errors.contactEmail ? (
                        <p className="text-xs text-destructive">{errors.contactEmail}</p>
                      ) : null}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactPhone">Phone</Label>
                      <Input
                        id="contactPhone"
                        value={form.contactPhone ?? ""}
                        onChange={(e) => patch("contactPhone", e.target.value)}
                        placeholder="+91 98736 93160"
                      />
                      {errors.contactPhone ? (
                        <p className="text-xs text-destructive">{errors.contactPhone}</p>
                      ) : null}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bookingBasis">Booking confirmation</Label>
                    <Select
                      value={form.bookingBasis}
                      onValueChange={(value) =>
                        patch("bookingBasis", value as CreateShipmentInput["bookingBasis"])
                      }
                    >
                      <SelectTrigger id="bookingBasis">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {BOOKING_BASES.map((basis) => (
                          <SelectItem key={basis} value={basis}>
                            {BOOKING_BASIS_LABELS[basis]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="assignedTo">Assigned ops owner</Label>
                    <Input
                      id="assignedTo"
                      value={form.assignedTo ?? ""}
                      onChange={(e) => patch("assignedTo", e.target.value)}
                      placeholder="Operations Team"
                    />
                  </div>
                </>
              ) : null}

              {step === "lane" ? (
                <>
                  <div className="space-y-2">
                    <Label>Freight mode</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {FREIGHT_MODES.map((mode) => {
                        const Icon = freightModeIcon(mode);
                        const active = form.freightMode === mode;
                        return (
                          <button
                            key={mode}
                            type="button"
                            onClick={() => patch("freightMode", mode)}
                            className={cn(
                              "flex flex-col items-center gap-2 border p-3 text-xs font-medium transition-colors",
                              active
                                ? "border-accent bg-accent/10 text-foreground"
                                : "border-border hover:bg-muted/50",
                            )}
                          >
                            <Icon className="size-4" aria-hidden />
                            {mode.replace(" Freight", "")}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="origin">Origin</Label>
                    <Input
                      id="origin"
                      value={form.origin}
                      onChange={(e) => patch("origin", e.target.value)}
                      placeholder="Mumbai, Maharashtra"
                    />
                    {errors.origin ? (
                      <p className="text-xs text-destructive">{errors.origin}</p>
                    ) : null}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="destination">Destination</Label>
                    <Input
                      id="destination"
                      value={form.destination}
                      onChange={(e) => patch("destination", e.target.value)}
                      placeholder="Dubai, UAE"
                    />
                    {errors.destination ? (
                      <p className="text-xs text-destructive">{errors.destination}</p>
                    ) : null}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pickupLocation">Pickup location</Label>
                    <Input
                      id="pickupLocation"
                      value={form.pickupLocation ?? ""}
                      onChange={(e) => patch("pickupLocation", e.target.value)}
                      placeholder="Factory / warehouse address"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="deliveryLocation">Delivery location</Label>
                    <Input
                      id="deliveryLocation"
                      value={form.deliveryLocation ?? ""}
                      onChange={(e) => patch("deliveryLocation", e.target.value)}
                      placeholder="Consignee address"
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="cargoReadyDate">Cargo ready date</Label>
                      <Input
                        id="cargoReadyDate"
                        type="date"
                        value={form.cargoReadyDate}
                        onChange={(e) => patch("cargoReadyDate", e.target.value)}
                      />
                      {errors.cargoReadyDate ? (
                        <p className="text-xs text-destructive">{errors.cargoReadyDate}</p>
                      ) : null}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="targetDeliveryDate">Target delivery</Label>
                      <Input
                        id="targetDeliveryDate"
                        type="date"
                        value={form.targetDeliveryDate ?? ""}
                        onChange={(e) => patch("targetDeliveryDate", e.target.value)}
                      />
                    </div>
                  </div>
                </>
              ) : null}

              {step === "cargo" ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="productType">Product type</Label>
                    <Select
                      value={form.productType}
                      onValueChange={(value) =>
                        patch("productType", value as CreateShipmentInput["productType"])
                      }
                    >
                      <SelectTrigger id="productType">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {PRODUCT_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>
                            {PRODUCT_TYPE_LABELS[type]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="totalPackages">Total packages</Label>
                      <Input
                        id="totalPackages"
                        type="number"
                        min={1}
                        value={form.totalPackages ?? ""}
                        onChange={(e) =>
                          patch(
                            "totalPackages",
                            e.target.value ? Number(e.target.value) : undefined,
                          )
                        }
                        placeholder="24"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="approxWeight">Approx. weight</Label>
                      <Input
                        id="approxWeight"
                        value={form.approxWeight ?? ""}
                        onChange={(e) => patch("approxWeight", e.target.value)}
                        placeholder="1200 kg"
                      />
                    </div>
                  </div>
                  {errors.approxWeight ? (
                    <p className="text-xs text-destructive">{errors.approxWeight}</p>
                  ) : null}
                  {form.freightMode === "Ocean Freight" ? (
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="containerSize">Container size</Label>
                        <Select
                          value={form.containerSize ?? ""}
                          onValueChange={(value) =>
                            patch(
                              "containerSize",
                              value as CreateShipmentInput["containerSize"],
                            )
                          }
                        >
                          <SelectTrigger id="containerSize">
                            <SelectValue placeholder="Optional" />
                          </SelectTrigger>
                          <SelectContent>
                            {CONTAINER_SIZES.map((size) => (
                              <SelectItem key={size} value={size}>
                                {CONTAINER_SIZE_LABELS[size]}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="containerType">Container type</Label>
                        <Select
                          value={form.containerType ?? ""}
                          onValueChange={(value) =>
                            patch(
                              "containerType",
                              value as CreateShipmentInput["containerType"],
                            )
                          }
                        >
                          <SelectTrigger id="containerType">
                            <SelectValue placeholder="Optional" />
                          </SelectTrigger>
                          <SelectContent>
                            {CONTAINER_TYPES.map((type) => (
                              <SelectItem key={type} value={type}>
                                {CONTAINER_TYPE_LABELS[type]}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.containerType ? (
                          <p className="text-xs text-destructive">{errors.containerType}</p>
                        ) : null}
                      </div>
                    </div>
                  ) : null}
                  <div className="space-y-2">
                    <Label htmlFor="valueInr">Declared value (INR)</Label>
                    <Input
                      id="valueInr"
                      type="number"
                      min={0}
                      value={form.valueInr ?? ""}
                      onChange={(e) =>
                        patch(
                          "valueInr",
                          e.target.value ? Number(e.target.value) : undefined,
                        )
                      }
                      placeholder="2500000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="internalNotes">Internal notes</Label>
                    <Textarea
                      id="internalNotes"
                      value={form.internalNotes ?? ""}
                      onChange={(e) => patch("internalNotes", e.target.value)}
                      placeholder="Special handling, docs pending, etc."
                      rows={3}
                    />
                  </div>
                </>
              ) : null}

              {step === "booking" ? (
                <>
                  <div className="rounded-lg border border-border bg-muted/30 p-4">
                    <div className="flex items-start gap-3">
                      <div className="rounded-md bg-accent/15 p-2 text-accent">
                        <ModeIcon className="size-4" aria-hidden />
                      </div>
                      <div className="min-w-0 flex-1 space-y-2">
                        <p className="font-semibold">{form.clientCompany || "New client"}</p>
                        <p className="text-sm text-muted-foreground">
                          {form.origin || "Origin"} → {form.destination || "Destination"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {form.freightMode}
                          {form.totalPackages ? ` · ${form.totalPackages} packages` : ""}
                          {form.approxWeight ? ` · ${form.approxWeight}` : ""}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="carrierName">Carrier / line</Label>
                    <Input
                      id="carrierName"
                      value={form.carrierName ?? ""}
                      onChange={(e) => patch("carrierName", e.target.value)}
                      placeholder="Maersk, Emirates SkyCargo, etc."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="carrierRef">AWB / BL / booking ref</Label>
                    <Input
                      id="carrierRef"
                      value={form.carrierRef ?? ""}
                      onChange={(e) => patch("carrierRef", e.target.value)}
                      placeholder="MAEU123456789"
                    />
                  </div>
                  {activeForwarders.length > 0 ? (
                    <div className="space-y-2">
                      <Label htmlFor="forwarderId">Forwarder used</Label>
                      <Select
                        value={form.forwarderId ?? ""}
                        onValueChange={(value) => patch("forwarderId", value)}
                      >
                        <SelectTrigger id="forwarderId">
                          <SelectValue placeholder="Optional" />
                        </SelectTrigger>
                        <SelectContent>
                          {activeForwarders.map((forwarder) => (
                            <SelectItem key={forwarder.id} value={forwarder.id}>
                              {forwarder.companyName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ) : null}
                  <div className="space-y-2">
                    <Label htmlFor="estimatedEta">Estimated arrival</Label>
                    <Input
                      id="estimatedEta"
                      type="datetime-local"
                      value={form.estimatedEta ?? ""}
                      onChange={(e) => patch("estimatedEta", e.target.value)}
                    />
                  </div>

                  <dl className="space-y-2 rounded-lg border border-border p-4">
                    <ReviewRow label="Contact" value={form.contactName} />
                    <ReviewRow label="Email" value={form.contactEmail} />
                    <ReviewRow
                      label="Booking basis"
                      value={BOOKING_BASIS_LABELS[form.bookingBasis]}
                    />
                    <ReviewRow
                      label="Product"
                      value={PRODUCT_TYPE_LABELS[form.productType]}
                    />
                    <ReviewRow label="Cargo ready" value={form.cargoReadyDate} />
                  </dl>

                  {submitError ? (
                    <p className="text-sm text-destructive">{submitError}</p>
                  ) : null}
                </>
              ) : null}
            </div>

            <div className="flex items-center justify-between border-t border-border px-6 py-4">
              {stepIndex > 0 ? (
                <Button type="button" variant="outline" rounded="none" onClick={goBack}>
                  <ArrowLeft className="size-4" />
                  Back
                </Button>
              ) : (
                <span />
              )}
              {step === "booking" ? (
                <Button
                  type="button"
                  rounded="none"
                  loading={saving}
                  onClick={() => void submit()}
                >
                  Create shipment
                </Button>
              ) : (
                <Button type="button" rounded="none" onClick={goNext}>
                  Continue
                  <ArrowRight className="size-4" />
                </Button>
              )}
            </div>
          </>
        ) : (
          <div className="flex h-full flex-col px-6 py-8">
            <div className="flex flex-1 flex-col items-center justify-center text-center">
              <div className="mb-4 rounded-full bg-success/15 p-4 text-success">
                <CheckCircle2 className="size-8" aria-hidden />
              </div>
              <SheetTitle>Shipment created</SheetTitle>
              <p className="mt-2 text-2xl font-bold">{created?.id}</p>
              <p className="mt-2 max-w-xs text-sm text-muted-foreground">
                {created?.client} · {created?.origin} → {created?.destination}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Status: {created?.status} · ETA: {created?.eta}
              </p>
            </div>
            <div className="space-y-3">
              <Button asChild rounded="none" className="w-full">
                <Link href="/command-center/shipments">View on board</Link>
              </Button>
              <Button
                type="button"
                variant="outline"
                rounded="none"
                className="w-full"
                onClick={reset}
              >
                <Package className="size-4" />
                Create another
              </Button>
              <Button
                type="button"
                variant="ghost"
                rounded="none"
                className="w-full"
                onClick={close}
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
