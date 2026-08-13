"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/atoms/button";
import { Badge } from "@/components/atoms/badge";
import { Label } from "@/components/atoms/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import {
  EMAIL_CATEGORY_ICONS,
  EMAIL_CATEGORY_LABELS,
} from "@/features/email-intelligence/schemas";
import type {
  EmailIntelligence,
  EmailIntelligenceStatus,
  EmailUrgency,
} from "@/types";

const STATUS_OPTIONS: EmailIntelligenceStatus[] = [
  "new",
  "read",
  "actioned",
  "archived",
];

const STATUS_LABELS: Record<EmailIntelligenceStatus, string> = {
  new: "New",
  read: "Read",
  actioned: "Actioned",
  archived: "Archived",
};

type EmailDetailSheetProps = {
  email: EmailIntelligence | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStatusChange: (id: string, status: EmailIntelligenceStatus) => void;
};

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function urgencyBadgeVariant(
  urgency?: EmailUrgency,
): "destructive" | "warning" | "secondary" | "muted" {
  switch (urgency) {
    case "critical":
      return "destructive";
    case "high":
      return "warning";
    case "medium":
      return "secondary";
    default:
      return "muted";
  }
}

function ExtractedFields({ email }: { email: EmailIntelligence }) {
  const data = email.extractedData as Record<string, string | undefined>;

  const fieldsByCategory: Record<string, { key: string; label: string }[]> = {
    shipment: [
      { key: "awb", label: "AWB / BL No." },
      { key: "trackingNo", label: "Tracking No." },
      { key: "pickup", label: "Pickup" },
      { key: "destination", label: "Destination" },
      { key: "status", label: "Status" },
      { key: "eta", label: "ETA" },
    ],
    quotation: [
      { key: "quoteNo", label: "Quote No." },
      { key: "origin", label: "Origin" },
      { key: "destination", label: "Destination" },
      { key: "carrier", label: "Carrier" },
      { key: "price", label: "Price" },
      { key: "validity", label: "Validity" },
    ],
    alert: [
      { key: "alertType", label: "Alert Type" },
      { key: "requiredAction", label: "Required Action" },
      { key: "deadline", label: "Deadline" },
    ],
    general: [
      { key: "sender", label: "Sender" },
      { key: "subject", label: "Subject" },
      { key: "date", label: "Date" },
      { key: "summary", label: "Summary" },
    ],
  };

  const fields = fieldsByCategory[email.category] ?? [];

  return (
    <dl className="grid gap-3 sm:grid-cols-2">
      {fields.map(({ key, label }) => {
        const value = data[key];
        if (!value) return null;
        return (
          <div key={key} className="rounded-lg border bg-muted/30 p-3">
            <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
            <dd className="mt-1 text-sm font-medium text-foreground">{value}</dd>
          </div>
        );
      })}
    </dl>
  );
}

export function EmailDetailSheet({
  email,
  open,
  onOpenChange,
  onStatusChange,
}: EmailDetailSheetProps) {
  const [status, setStatus] = useState<EmailIntelligenceStatus>("new");
  const [savedFlash, setSavedFlash] = useState(false);

  useEffect(() => {
    if (!email) return;
    setStatus(email.status);
    setSavedFlash(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- sync on id change only
  }, [email?.id]);

  if (!email) return null;

  const dirty = status !== email.status;

  const handleSave = () => {
    onStatusChange(email.id, status);
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 2000);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
        <SheetTitle className="sr-only">Email intelligence detail</SheetTitle>

        <div className="space-y-6 pt-2">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-2xl">
                {EMAIL_CATEGORY_ICONS[email.category]}
              </span>
              <Badge variant="secondary">
                {EMAIL_CATEGORY_LABELS[email.category]}
              </Badge>
              {email.urgency ? (
                <Badge variant={urgencyBadgeVariant(email.urgency)}>
                  {email.urgency}
                </Badge>
              ) : null}
              {email.confidence != null ? (
                <Badge variant="muted">
                  {Math.round(email.confidence * 100)}% confidence
                </Badge>
              ) : null}
            </div>
            <h2 className="text-xl font-semibold leading-snug">{email.subject}</h2>
            <p className="text-sm text-muted-foreground">
              From {email.senderName ?? email.senderEmail} ·{" "}
              {formatDateTime(email.receivedAt)}
            </p>
            <p className="text-xs text-muted-foreground">
              Account: {email.sourceAccount}
            </p>
          </div>

          {email.summary ? (
            <div className="rounded-lg border bg-card p-4">
              <p className="text-sm font-medium text-muted-foreground">AI Summary</p>
              <p className="mt-2 text-sm leading-relaxed">{email.summary}</p>
            </div>
          ) : null}

          <div>
            <p className="mb-3 text-sm font-semibold">Extracted Information</p>
            <ExtractedFields email={email} />
          </div>

          {email.hasAttachments && email.attachmentNames.length > 0 ? (
            <div>
              <p className="mb-2 text-sm font-semibold">Attachments</p>
              <ul className="space-y-1 text-sm text-muted-foreground">
                {email.attachmentNames.map((name) => (
                  <li key={name}>📎 {name}</li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="space-y-2 border-t pt-4">
            <Label htmlFor="email-status">Status</Label>
            <Select
              value={status}
              onValueChange={(v) => setStatus(v as EmailIntelligenceStatus)}
            >
              <SelectTrigger id="email-status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((s) => (
                  <SelectItem key={s} value={s}>
                    {STATUS_LABELS[s]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-3">
            <Button onClick={handleSave} disabled={!dirty}>
              Save status
            </Button>
            {savedFlash ? (
              <span className="text-sm text-green-600">Saved</span>
            ) : null}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
