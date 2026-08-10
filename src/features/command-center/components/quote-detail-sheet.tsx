"use client";

import { useEffect, useState } from "react";
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
import type { QuoteRequest, QuoteRequestStatus } from "@/types";
import {
  CONTAINER_SIZE_LABELS,
  CONTAINER_TYPE_LABELS,
  PRODUCT_TYPE_LABELS,
} from "@/features/contact/schemas";

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

const STATUS_OPTIONS: QuoteRequestStatus[] = [
  "New",
  "In Review",
  "Quoted",
  "Won",
  "Closed",
];

export type QuoteUpdatePayload = {
  status: QuoteRequestStatus;
  internalNotes: string;
  quotedAmount: string;
};

type QuoteDetailSheetProps = {
  quote: QuoteRequest | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (id: string, update: QuoteUpdatePayload) => void;
  statusBadgeVariant: (
    status: QuoteRequestStatus,
  ) => "secondary" | "warning" | "success" | "accent" | "muted";
};

function formatSubmittedAt(iso: string): string {
  return new Date(iso).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function QuoteDetailSheet({
  quote,
  open,
  onOpenChange,
  onSave,
  statusBadgeVariant,
}: QuoteDetailSheetProps) {
  const [status, setStatus] = useState<QuoteRequestStatus>("New");
  const [internalNotes, setInternalNotes] = useState("");
  const [quotedAmount, setQuotedAmount] = useState("");
  const [savedFlash, setSavedFlash] = useState(false);

  useEffect(() => {
    if (!quote) return;
    setStatus(quote.status);
    setInternalNotes(quote.internalNotes ?? "");
    setQuotedAmount(quote.quotedAmount ?? "");
    setSavedFlash(false);
    // Reset the form only when opening a different quote.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional: sync on id change only
  }, [quote?.id]);

  if (!quote) return null;

  const dirty =
    status !== quote.status ||
    internalNotes !== (quote.internalNotes ?? "") ||
    quotedAmount !== (quote.quotedAmount ?? "");

  const handleSave = () => {
    onSave(quote.id, {
      status,
      internalNotes: internalNotes.trim(),
      quotedAmount: quotedAmount.trim(),
    });
    setSavedFlash(true);
  };

  const handleReset = () => {
    setStatus(quote.status);
    setInternalNotes(quote.internalNotes ?? "");
    setQuotedAmount(quote.quotedAmount ?? "");
    setSavedFlash(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-[min(100%,28rem)] gap-0 overflow-y-auto p-0 sm:w-[min(100%,32rem)]"
      >
        <div className="border-b border-border px-6 py-5 pr-12">
          <SheetTitle>{quote.id}</SheetTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            {quote.company} · {quote.name}
          </p>
          <div className="mt-3">
            <Badge variant={statusBadgeVariant(quote.status)}>
              {quote.status}
            </Badge>
          </div>
        </div>

        <div className="space-y-6 px-6 py-5">
          <section className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Request details
            </h3>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Lane</dt>
                <dd className="text-right font-medium">
                  {quote.origin} → {quote.destination}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Service</dt>
                <dd className="text-right font-medium">
                  {SERVICE_TYPE_LABELS[quote.serviceType]}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Submitted</dt>
                <dd className="text-right">
                  {formatSubmittedAt(quote.submittedAt)}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Email</dt>
                <dd className="text-right break-all">{quote.email}</dd>
              </div>
              {quote.phone ? (
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Phone</dt>
                  <dd className="text-right">{quote.phone}</dd>
                </div>
              ) : null}
              {quote.companyAddress ? (
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Company address</dt>
                  <dd className="max-w-[60%] text-right">{quote.companyAddress}</dd>
                </div>
              ) : null}
              {quote.productType ? (
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Product type</dt>
                  <dd className="text-right font-medium">
                    {PRODUCT_TYPE_LABELS[quote.productType]}
                  </dd>
                </div>
              ) : null}
              {quote.totalPackages != null ? (
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Total packages</dt>
                  <dd className="text-right font-medium">{quote.totalPackages}</dd>
                </div>
              ) : null}
              {quote.approxWeight ? (
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Approx weight</dt>
                  <dd className="text-right font-medium">{quote.approxWeight}</dd>
                </div>
              ) : null}
              {quote.containerSize ? (
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Container size</dt>
                  <dd className="text-right font-medium">
                    {CONTAINER_SIZE_LABELS[quote.containerSize]}
                  </dd>
                </div>
              ) : null}
              {quote.containerType ? (
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Container type</dt>
                  <dd className="text-right font-medium">
                    {CONTAINER_TYPE_LABELS[quote.containerType]}
                  </dd>
                </div>
              ) : null}
              {quote.valueInr != null ? (
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Declared value</dt>
                  <dd className="text-right font-medium">
                    ₹{quote.valueInr.toLocaleString("en-IN")}
                  </dd>
                </div>
              ) : null}
            </dl>
            <div className="rounded-md border border-border bg-muted/40 p-3 text-sm">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Cargo notes
              </p>
              <p className="text-foreground/90">{quote.message}</p>
            </div>
          </section>

          <section className="space-y-4 border-t border-border pt-5">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Ops update
            </h3>

            <div className="space-y-2">
              <Label htmlFor="quote-status">Status</Label>
              <Select
                value={status}
                onValueChange={(value) =>
                  setStatus(value as QuoteRequestStatus)
                }
              >
                <SelectTrigger id="quote-status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex flex-wrap gap-2 pt-1">
                {STATUS_OPTIONS.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setStatus(option)}
                    className={
                      status === option
                        ? "rounded-md border border-primary bg-primary px-2.5 py-1 text-xs font-medium text-primary-foreground"
                        : "rounded-md border border-border bg-card px-2.5 py-1 text-xs font-medium text-muted-foreground hover:text-foreground"
                    }
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quote-amount">Quoted amount</Label>
              <Input
                id="quote-amount"
                value={quotedAmount}
                onChange={(e) => setQuotedAmount(e.target.value)}
                placeholder="e.g. ₹1,25,000 or $2,400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="quote-notes">Internal notes</Label>
              <Textarea
                id="quote-notes"
                value={internalNotes}
                onChange={(e) => setInternalNotes(e.target.value)}
                placeholder="Follow-ups, rate assumptions, next action…"
                className="min-h-28"
              />
            </div>

            {savedFlash && !dirty ? (
              <p className="text-sm font-medium text-success" role="status">
                Changes saved locally (frontend only)
              </p>
            ) : null}
          </section>
        </div>

        <div className="sticky bottom-0 mt-auto flex gap-2 border-t border-border bg-background px-6 py-4">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            rounded="none"
            onClick={handleReset}
            disabled={!dirty}
          >
            Reset
          </Button>
          <Button
            type="button"
            className="flex-1"
            rounded="none"
            onClick={handleSave}
            disabled={!dirty}
          >
            Save update
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
