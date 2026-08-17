"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronDown, Package, Truck } from "lucide-react";
import { Button } from "@/components/atoms/button";
import { Badge } from "@/components/atoms/badge";
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
  CONTAINER_TYPE_LABELS,
  PRODUCT_TYPE_LABELS,
} from "@/features/contact/schemas";
import {
  formatDate,
  formatDateTime,
  SERVICE_TYPE_LABELS,
  STATUS_FILTER_LABELS,
  statusBadgeVariant,
} from "@/features/quotes/labels";
import {
  computeFromForwarder,
  formatMoney,
  parseAmount,
} from "@/features/quotes/money";
import {
  cargoItemCbm,
  formatCargoItemDimensions,
  formatCargoItemPackageType,
  formatWizardCompanyAddress,
  insuranceLabel,
  packingLabel,
  projectCargoLabel,
  referralLabel,
  wizardCargoTotals,
  type QuoteWizardPayload,
} from "@/features/quotes/wizard-payload";
import { cn } from "@/lib/utils";
import { QUOTE_REQUEST_STATUSES, type Forwarder, type QuoteRequest } from "@/types";

type WorkPath = "customer" | "partners";

type QuoteDetailSheetProps = {
  quote: QuoteRequest | null;
  forwarders: Forwarder[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onChanged: (quote: QuoteRequest) => void;
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
    <div className="flex justify-between gap-4">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="max-w-[60%] text-right font-medium">{value}</dd>
    </div>
  );
}

function ServiceNeedBadge({ label }: { label: string }) {
  return (
    <Badge variant="accent" className="rounded-none">
      <Truck className="size-3" aria-hidden />
      {label}
    </Badge>
  );
}

function ShipmentDetails({ quote }: { quote: QuoteRequest }) {
  const wizard = quote.wizard;
  const companyAddress =
    quote.companyAddress ??
    (wizard ? formatWizardCompanyAddress(wizard) : undefined);
  const pickupValue =
    quote.originPickup && quote.pickupLocation === "Need origin pickup"
      ? undefined
      : quote.pickupLocation;
  const deliveryValue =
    quote.destinationDelivery &&
    quote.deliveryLocation === "Need destination delivery"
      ? undefined
      : quote.deliveryLocation;

  return (
    <div className="mt-3 space-y-4">
      <dl className="space-y-2 text-sm">
        <Field label="Company" value={quote.company} />
        <Field label="Phone" value={quote.phone} />
        <Field label="Address" value={companyAddress} />
        <Field label="Submitted" value={formatDateTime(quote.submittedAt)} />
        <Field
          label="Cargo ready"
          value={wizard?.cargoReadyDate ?? quote.requiredDeliveryDate}
        />
        <Field label="Pickup" value={pickupValue} />
        <Field label="Delivery" value={deliveryValue} />
        {quote.productType ? (
          <Field
            label="Shipment type"
            value={PRODUCT_TYPE_LABELS[quote.productType]}
          />
        ) : null}
        {quote.containerSize ? (
          <Field
            label="Container"
            value={`${CONTAINER_SIZE_LABELS[quote.containerSize]}${
              quote.containerType
                ? ` · ${CONTAINER_TYPE_LABELS[quote.containerType]}`
                : ""
            }`}
          />
        ) : null}
        {quote.valueInr != null ? (
          <Field
            label="Declared value"
            value={formatMoney(quote.valueInr)}
          />
        ) : null}
        <Field label="Assigned" value={quote.assignedTo} />
      </dl>

      {wizard ? <WizardShipmentDetails wizard={wizard} /> : null}

      {!wizard && (quote.message || quote.additionalRequirements) ? (
        <div className="rounded-lg bg-muted/50 p-3 text-sm whitespace-pre-wrap">
          {quote.message}
          {quote.additionalRequirements
            ? `\n${quote.additionalRequirements}`
            : ""}
        </div>
      ) : null}
    </div>
  );
}

function WizardShipmentDetails({ wizard }: { wizard: QuoteWizardPayload }) {
  const totals = wizardCargoTotals(wizard.cargoItems);
  const insurance = insuranceLabel(wizard);
  const project = projectCargoLabel(wizard);
  const packing = packingLabel(wizard);

  return (
    <div className="space-y-4">
      {wizard.cargoItems.length > 0 ? (
        <section className="space-y-2">
          <h4 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Cargo line items
          </h4>
          <p className="text-sm font-medium">
            {totals.cbm.toFixed(3)} CBM · {totals.weightKg.toFixed(1)} KG
          </p>
          <ul className="space-y-2">
            {wizard.cargoItems.map((item, index) => (
              <li
                key={`${item.description}-${index}`}
                className="rounded-lg border border-border bg-muted/40 p-3 text-sm"
              >
                <p className="font-semibold">
                  Line {index + 1} · {item.description}
                </p>
                <dl className="mt-2 space-y-1">
                  {item.hsCode ? (
                    <Field label="HS code" value={item.hsCode} />
                  ) : null}
                  <Field label="Qty" value={item.quantity} />
                  <Field
                    label="Type"
                    value={formatCargoItemPackageType(item)}
                  />
                  <Field
                    label="Weight / unit"
                    value={`${item.weightKg} KG`}
                  />
                  <Field
                    label="Dimensions"
                    value={formatCargoItemDimensions(item)}
                  />
                  <Field
                    label="Line CBM"
                    value={cargoItemCbm(item).toFixed(3)}
                  />
                </dl>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="space-y-2">
        <h4 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          Add-on services
        </h4>
        <dl className="space-y-2 text-sm">
          <Field label="Insurance" value={insurance ?? "Not requested"} />
          {wizard.insurance && wizard.insuranceCargoValueInr != null ? (
            <Field
              label="Insured value"
              value={formatMoney(wizard.insuranceCargoValueInr)}
            />
          ) : null}
          <Field
            label="Project cargo"
            value={project ?? "Not requested"}
          />
          {wizard.projectRegistrationHelp ? (
            <Field
              label="Project registration"
              value="Help requested"
            />
          ) : null}
          <Field label="Project notes" value={wizard.projectNotes} />
          <Field label="Packing" value={packing ?? "Not requested"} />
          <Field label="Packing notes" value={wizard.packingNotes} />
          <Field
            label="Customs brokerage"
            value={wizard.customsBrokerage ? "Requested" : "Not requested"}
          />
          <Field
            label="Dangerous cargo"
            value={wizard.dangerousCargoNotes}
          />
        </dl>
      </section>

      <dl className="space-y-2 text-sm">
        <Field
          label="Existing customer"
          value={
            wizard.existingCustomer === true
              ? "Yes"
              : wizard.existingCustomer === false
                ? "No"
                : undefined
          }
        />
        <Field label="Heard about us" value={referralLabel(wizard)} />
      </dl>
    </div>
  );
}

function PathCard({
  selected,
  title,
  description,
  onClick,
}: {
  selected: boolean;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-xl border px-3 py-3 text-left transition-colors",
        selected
          ? "border-primary bg-primary/5"
          : "border-border bg-background hover:border-primary/40",
      )}
    >
      <p className="text-sm font-semibold">{title}</p>
      <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
    </button>
  );
}

export function QuoteDetailSheet({
  quote,
  forwarders = [],
  open,
  onOpenChange,
  onChanged,
}: QuoteDetailSheetProps) {
  const [status, setStatus] = useState<QuoteRequest["status"]>("New");
  const [internalNotes, setInternalNotes] = useState("");
  const [quotedAmount, setQuotedAmount] = useState("");
  const [currency, setCurrency] = useState("INR");
  const [additionalCharges, setAdditionalCharges] = useState("");
  const [discount, setDiscount] = useState("");
  const [quoteValidity, setQuoteValidity] = useState("7 days");
  const [margin, setMargin] = useState("");
  const [busy, setBusy] = useState<"save" | "send" | "forwarders" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [workPath, setWorkPath] = useState<WorkPath>("customer");
  const [detailsOpen, setDetailsOpen] = useState(true);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [selectedForwarders, setSelectedForwarders] = useState<string[]>([]);
  const [forwarderSearch, setForwarderSearch] = useState("");
  const [recordId, setRecordId] = useState<string | null>(null);
  const [recordAmount, setRecordAmount] = useState("");
  const [recordTransit, setRecordTransit] = useState("");
  const [recordValidity, setRecordValidity] = useState("");
  const [recordCarrier, setRecordCarrier] = useState("");

  useEffect(() => {
    if (!quote) return;
    setStatus(quote.status);
    setInternalNotes(quote.internalNotes ?? "");
    setQuotedAmount(quote.quotedAmount ?? "");
    setCurrency(quote.currency ?? "INR");
    setAdditionalCharges(
      quote.additionalCharges != null ? String(quote.additionalCharges) : "",
    );
    setDiscount(quote.discount != null ? String(quote.discount) : "");
    setQuoteValidity(quote.quoteValidity ?? "7 days");
    setMargin(quote.margin != null ? String(quote.margin) : "");
    setError(null);
    setPickerOpen(false);
    setDetailsOpen(true);
    setAdvancedOpen(false);
    const hasForwarderWork = (quote.forwarderRequests ?? []).length > 0;
    setWorkPath(
      hasForwarderWork
        ? "partners"
        : quote.isRepeatCustomer
          ? "customer"
          : "partners",
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps -- sync when opening another quote
  }, [quote?.id, open]);

  const payload = useMemo(
    () => ({
      status,
      internalNotes: internalNotes.trim(),
      quotedAmount: quotedAmount.trim(),
      currency,
      additionalCharges: parseAmount(additionalCharges),
      discount: parseAmount(discount),
      quoteValidity: quoteValidity.trim(),
      margin: parseAmount(margin),
      actor: "ops",
    }),
    [
      additionalCharges,
      currency,
      discount,
      internalNotes,
      margin,
      quoteValidity,
      quotedAmount,
      status,
    ],
  );

  if (!quote) return null;

  const previous = quote.previousQuotes ?? [];
  const requests = quote.forwarderRequests ?? [];
  const received = requests.filter((row) => row.status === "Quote Received");
  const activeForwarders = (forwarders ?? []).filter(
    (row) => row.status === "Active",
  );
  const filteredForwarders = activeForwarders.filter((row) => {
    const q = forwarderSearch.toLowerCase();
    if (!q) return true;
    return (
      row.companyName.toLowerCase().includes(q) ||
      row.email.toLowerCase().includes(q) ||
      row.serviceTypes.join(" ").toLowerCase().includes(q)
    );
  });

  const previewFinal =
    parseAmount(quotedAmount) ??
    computeFromForwarder({
      forwarderCost: quote.forwarderCost,
      margin: parseAmount(margin),
      additionalCharges: parseAmount(additionalCharges),
    });

  async function mutate(
    path: string,
    body: unknown,
    kind: "save" | "send" | "forwarders",
  ) {
    setBusy(kind);
    setError(null);
    try {
      const res = await fetch(path, {
        method:
          path.includes("send") ||
          path.includes("forwarder") ||
          path.includes("select")
            ? "POST"
            : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = (await res.json()) as {
        success: boolean;
        data?: QuoteRequest;
        error?: string;
        message?: string;
      };
      if (!json.data) {
        setError(json.error ?? "Request failed");
        return;
      }
      onChanged(json.data);
      if (json.error && !json.success) setError(json.error);
    } catch {
      setError("Network error");
    } finally {
      setBusy(null);
    }
  }

  const failedEmail = quote.status === "Quote Ready / Email Failed";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-[min(100%,28rem)] gap-0 overflow-y-auto p-0 sm:w-[min(100%,36rem)]"
      >
        <div className="border-b border-border px-6 py-5 pr-12">
          <SheetTitle>QUOTE #{quote.id}</SheetTitle>
          <p className="mt-1 text-sm font-medium">
            {quote.origin} → {quote.destination}
          </p>
          <p className="text-sm text-muted-foreground">
            {SERVICE_TYPE_LABELS[quote.serviceType]}
            {quote.approxWeight ? ` · ${quote.approxWeight}` : ""}
            {quote.totalPackages != null ? ` · ${quote.totalPackages} pkgs` : ""}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {quote.name} · {quote.email}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Badge variant={statusBadgeVariant(quote.status)}>
              {STATUS_FILTER_LABELS[quote.status]}
            </Badge>
            {quote.isRepeatCustomer ? (
              <Badge variant="success">Repeat customer</Badge>
            ) : (
              <Badge variant="muted">New customer</Badge>
            )}
            {quote.originPickup ? (
              <ServiceNeedBadge label="Need origin pickup" />
            ) : null}
            {quote.destinationDelivery ? (
              <ServiceNeedBadge label="Need destination delivery" />
            ) : null}
          </div>
        </div>

        <div className="space-y-5 px-6 py-5">
          <div>
            <Button
              type="button"
              variant={detailsOpen ? "outline" : "default"}
              rounded="none"
              className="h-11 w-full justify-between"
              aria-expanded={detailsOpen}
              onClick={() => setDetailsOpen((value) => !value)}
            >
              <span className="inline-flex items-center gap-2">
                <Package className="size-4" aria-hidden />
                {detailsOpen ? "Hide shipment details" : "View shipment details"}
              </span>
              <ChevronDown
                className={cn(
                  "size-4 transition-transform",
                  detailsOpen && "rotate-180",
                )}
                aria-hidden
              />
            </Button>
            {detailsOpen ? <ShipmentDetails quote={quote} /> : null}
          </div>

          <section className="space-y-3">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                How do you want to price this?
              </h3>
              <p className="text-xs text-muted-foreground">
                Repeat customers can go straight to the requester. New requests usually go to partners first.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <PathCard
                selected={workPath === "customer"}
                title="Quote the customer"
                description="Reuse a past rate or type a price, then email the requester."
                onClick={() => setWorkPath("customer")}
              />
              <PathCard
                selected={workPath === "partners"}
                title="Ask partners"
                description="Email forwarders, collect rates, then build the customer quote."
                onClick={() => setWorkPath("partners")}
              />
            </div>
          </section>

          {workPath === "customer" ? (
            <section className="space-y-4 rounded-xl border border-border p-4">
              <div>
                <h3 className="text-sm font-semibold">Customer quote</h3>
                <p className="text-xs text-muted-foreground">
                  This email goes to {quote.email}
                </p>
              </div>

              {previous.length > 0 ? (
                <ul className="space-y-2">
                  {previous.map((item) => (
                    <li key={item.id}>
                      <button
                        type="button"
                        className="flex w-full items-center justify-between gap-2 rounded-lg border border-border px-3 py-2 text-left text-sm hover:bg-muted/50"
                        onClick={() =>
                          setQuotedAmount(item.quotedAmount ?? quotedAmount)
                        }
                      >
                        <span>
                          {item.id}
                          <span className="ml-2 text-xs text-muted-foreground">
                            {formatDate(item.submittedAt)}
                          </span>
                        </span>
                        <span className="font-medium">
                          {item.quotedAmount ?? "Use"}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No previous priced quotes for this email. Enter an amount below.
                </p>
              )}

              <div className="space-y-2">
                <Label htmlFor="quote-amount">Amount</Label>
                <Input
                  id="quote-amount"
                  value={quotedAmount}
                  onChange={(e) => setQuotedAmount(e.target.value)}
                  placeholder="₹26,500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quote-validity">Valid for</Label>
                <Input
                  id="quote-validity"
                  value={quoteValidity}
                  onChange={(e) => setQuoteValidity(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quote-notes">Notes to keep internally</Label>
                <Textarea
                  id="quote-notes"
                  value={internalNotes}
                  onChange={(e) => setInternalNotes(e.target.value)}
                  className="min-h-20"
                />
              </div>

              <button
                type="button"
                className="text-xs font-medium text-muted-foreground hover:text-foreground"
                onClick={() => setAdvancedOpen((value) => !value)}
              >
                {advancedOpen ? "Hide extra fields" : "Charges, margin, status"}
              </button>
              {advancedOpen ? (
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="quote-charges">Additional charges</Label>
                    <Input
                      id="quote-charges"
                      value={additionalCharges}
                      onChange={(e) => setAdditionalCharges(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quote-discount">Discount</Label>
                    <Input
                      id="quote-discount"
                      value={discount}
                      onChange={(e) => setDiscount(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quote-margin">Margin</Label>
                    <Input
                      id="quote-margin"
                      value={margin}
                      onChange={(e) => setMargin(e.target.value)}
                    />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="quote-status">Status</Label>
                    <Select
                      value={status}
                      onValueChange={(value) =>
                        setStatus(value as QuoteRequest["status"])
                      }
                    >
                      <SelectTrigger id="quote-status">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {QUOTE_REQUEST_STATUSES.map((option) => (
                          <SelectItem key={option} value={option}>
                            {STATUS_FILTER_LABELS[option]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ) : null}

              {quote.quoteSentAt ? (
                <p className="text-xs text-muted-foreground">
                  Last emailed {formatDateTime(quote.quoteSentAt)} to{" "}
                  {quote.quoteSentTo}
                </p>
              ) : null}
            </section>
          ) : (
            <section className="space-y-4 rounded-xl border border-border p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-sm font-semibold">Partner rates</h3>
                  <p className="text-xs text-muted-foreground">
                    Ask forwarders first. Then pick a rate and quote the customer.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setPickerOpen((value) => !value)}
                >
                  {pickerOpen ? "Cancel" : "Select partners"}
                </Button>
              </div>

              {pickerOpen ? (
                <div className="space-y-3 rounded-lg bg-muted/40 p-3">
                  <Input
                    value={forwarderSearch}
                    onChange={(e) => setForwarderSearch(e.target.value)}
                    placeholder="Search partners"
                    aria-label="Search forwarders"
                  />
                  <button
                    type="button"
                    className="text-xs font-medium text-accent"
                    onClick={() =>
                      setSelectedForwarders(
                        selectedForwarders.length === filteredForwarders.length
                          ? []
                          : filteredForwarders.map((row) => row.id),
                      )
                    }
                  >
                    Select all
                  </button>
                  <ul className="max-h-48 space-y-2 overflow-y-auto text-sm">
                    {filteredForwarders.map((row) => (
                      <li key={row.id}>
                        <label className="flex cursor-pointer items-start gap-2">
                          <input
                            type="checkbox"
                            className="mt-1"
                            checked={selectedForwarders.includes(row.id)}
                            onChange={(e) => {
                              setSelectedForwarders((current) =>
                                e.target.checked
                                  ? [...current, row.id]
                                  : current.filter((id) => id !== row.id),
                              );
                            }}
                          />
                          <span>
                            <span className="font-medium">{row.companyName}</span>
                            <span className="block text-xs text-muted-foreground">
                              {row.email}
                            </span>
                          </span>
                        </label>
                      </li>
                    ))}
                  </ul>
                  <Button
                    type="button"
                    size="sm"
                    loading={busy === "forwarders"}
                    disabled={selectedForwarders.length === 0}
                    onClick={() =>
                      void mutate(
                        `/api/quotes/${quote.id}/forwarders`,
                        { forwarderIds: selectedForwarders, actor: "ops" },
                        "forwarders",
                      )
                    }
                  >
                    Email selected partners
                  </Button>
                </div>
              ) : null}

              {requests.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No partners asked yet.
                </p>
              ) : (
                <ul className="space-y-2 text-sm">
                  {requests.map((row) => (
                    <li
                      key={row.id}
                      className="rounded-lg border border-border px-3 py-2"
                    >
                      <p className="font-medium">{row.forwarderName}</p>
                      <p className="text-xs text-muted-foreground">
                        {row.quotationAmount != null
                          ? formatMoney(row.quotationAmount, row.currency)
                          : "Waiting"}{" "}
                        · {row.status}
                      </p>
                    </li>
                  ))}
                </ul>
              )}

              {received.length > 0 ? (
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Pick a partner rate
                  </p>
                  {received.map((row) => (
                    <div
                      key={row.id}
                      className="flex items-center justify-between gap-2 rounded-lg border border-border px-3 py-2 text-sm"
                    >
                      <div>
                        <p className="font-medium">{row.forwarderName}</p>
                        <p className="text-xs text-muted-foreground">
                          {row.quotationAmount != null
                            ? formatMoney(row.quotationAmount, row.currency)
                            : "—"}
                          {row.transitTime ? ` · ${row.transitTime}` : ""}
                        </p>
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          void mutate(
                            `/api/quotes/${quote.id}/select-forwarder`,
                            {
                              forwarderRequestId: row.id,
                              margin: parseAmount(margin) ?? 0,
                              additionalCharges: parseAmount(additionalCharges),
                            },
                            "save",
                          )
                        }
                      >
                        Use this rate
                      </Button>
                    </div>
                  ))}
                </div>
              ) : null}

              {requests.length > 0 ? (
                <div className="space-y-2 border-t border-border pt-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Log a partner reply
                  </p>
                  <Select value={recordId ?? ""} onValueChange={setRecordId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Which partner?" />
                    </SelectTrigger>
                    <SelectContent>
                      {requests.map((row) => (
                        <SelectItem key={row.id} value={row.id}>
                          {row.forwarderName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    value={recordAmount}
                    onChange={(e) => setRecordAmount(e.target.value)}
                    placeholder="Amount"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      value={recordTransit}
                      onChange={(e) => setRecordTransit(e.target.value)}
                      placeholder="Transit"
                    />
                    <Input
                      value={recordValidity}
                      onChange={(e) => setRecordValidity(e.target.value)}
                      placeholder="Validity"
                    />
                  </div>
                  <Input
                    value={recordCarrier}
                    onChange={(e) => setRecordCarrier(e.target.value)}
                    placeholder="Carrier"
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    disabled={!recordId || !parseAmount(recordAmount)}
                    onClick={() =>
                      void mutate(
                        `/api/quotes/${quote.id}/forwarder-quotes`,
                        {
                          forwarderRequestId: recordId,
                          quotationAmount: parseAmount(recordAmount),
                          transitTime: recordTransit,
                          validity: recordValidity,
                          carrier: recordCarrier,
                        },
                        "save",
                      )
                    }
                  >
                    Save partner quote
                  </Button>
                </div>
              ) : null}

              {quote.forwarderCost != null ? (
                <div className="rounded-lg bg-muted/50 p-3 text-sm">
                  <p>Partner cost {formatMoney(quote.forwarderCost, currency)}</p>
                  <p>Margin {margin || "0"}</p>
                  <p className="font-semibold">
                    Customer amount{" "}
                    {previewFinal != null
                      ? formatMoney(previewFinal, currency)
                      : "—"}
                  </p>
                  <Button
                    type="button"
                    size="sm"
                    className="mt-2"
                    onClick={() => setWorkPath("customer")}
                  >
                    Continue to customer quote
                  </Button>
                </div>
              ) : null}
            </section>
          )}

          {(quote.activity ?? []).length > 0 ? (
            <section className="space-y-2">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Activity
              </h3>
              <ol className="space-y-2 text-xs">
                {(quote.activity ?? []).slice(0, 6).map((item) => (
                  <li key={item.id}>
                    <p className="text-muted-foreground">
                      {formatDateTime(item.createdAt)}
                    </p>
                    <p>{item.message}</p>
                  </li>
                ))}
              </ol>
            </section>
          ) : null}

          {error ? (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          ) : null}
        </div>

        <div className="sticky bottom-0 mt-auto flex flex-col gap-2 border-t border-border bg-background px-6 py-4 sm:flex-row">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            loading={busy === "save"}
            onClick={() =>
              void mutate(`/api/quotes/${quote.id}`, payload, "save")
            }
          >
            Save
          </Button>
          <Button
            type="button"
            className="flex-1"
            loading={busy === "send"}
            onClick={() =>
              void mutate(`/api/quotes/${quote.id}/send`, payload, "send")
            }
          >
            {failedEmail ? "Retry customer email" : "Email customer quote"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
