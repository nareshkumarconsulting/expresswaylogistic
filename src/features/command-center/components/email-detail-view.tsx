"use client";

import { ArrowLeft, Paperclip, Sparkles } from "lucide-react";
import { Badge } from "@/components/atoms/badge";
import { Button } from "@/components/atoms/button";
import { CATEGORY_UI } from "@/features/command-center/email-category-ui";
import { EMAIL_CATEGORY_LABELS } from "@/features/email-intelligence/schemas";
import { cn } from "@/lib/utils";
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

type EmailDetailViewProps = {
  email: EmailIntelligence;
  onBack?: () => void;
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

function accountLabel(account: string): string {
  return account.split("@")[0] ?? account;
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

  const fields = (fieldsByCategory[email.category] ?? []).filter(({ key }) =>
    Boolean(data[key]),
  );

  if (fields.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No structured fields were extracted from this email.
      </p>
    );
  }

  return (
    <dl className="grid gap-3 sm:grid-cols-2">
      {fields.map(({ key, label }) => (
        <div key={key} className="rounded-lg border bg-muted/30 p-3">
          <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
          <dd className="mt-1 text-sm font-medium text-foreground">
            {data[key]}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export function EmailDetailView({
  email,
  onBack,
  onStatusChange,
}: EmailDetailViewProps) {
  const categoryUi = CATEGORY_UI[email.category];
  const CategoryIcon = categoryUi.icon;

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex shrink-0 items-start gap-3 border-b px-4 py-4 md:px-6">
        {onBack ? (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="mt-0.5 shrink-0 lg:hidden"
            onClick={onBack}
            aria-label="Back to inbox"
          >
            <ArrowLeft className="size-4" />
          </Button>
        ) : null}
        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={cn(
                "inline-flex size-8 items-center justify-center rounded-md",
                categoryUi.wrap,
              )}
            >
              <CategoryIcon className="size-4" aria-hidden />
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
          <h2 className="font-display text-xl font-bold leading-snug">
            {email.subject}
          </h2>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
            <span>
              {email.senderName ?? email.senderEmail}
              {email.senderName ? (
                <span className="text-muted-foreground/80">
                  {" "}
                  &lt;{email.senderEmail}&gt;
                </span>
              ) : null}
            </span>
            <span aria-hidden>·</span>
            <span>{formatDateTime(email.receivedAt)}</span>
            <span aria-hidden>·</span>
            <span className="rounded-md bg-muted px-1.5 py-0.5 text-xs font-medium text-foreground">
              {accountLabel(email.sourceAccount)}
            </span>
          </div>
          <div>
            <p className="mb-2 text-xs font-medium text-muted-foreground">
              Status
            </p>
            <div
              className="flex flex-wrap gap-2"
              role="group"
              aria-label="Update email status"
            >
              {STATUS_OPTIONS.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => onStatusChange(email.id, option)}
                  className={cn(
                    "rounded-md border px-3 py-1.5 text-xs font-semibold transition-colors",
                    email.status === option
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground",
                  )}
                >
                  {STATUS_LABELS[option]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="min-h-0 flex-1 space-y-6 overflow-y-auto px-4 py-5 md:px-6">
        {email.summary ? (
          <div className="rounded-lg border border-primary/15 bg-primary/5 p-4">
            <p className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-primary uppercase">
              <Sparkles className="size-3.5" aria-hidden />
              AI summary
            </p>
            <p className="mt-2 text-sm leading-relaxed text-foreground">
              {email.summary}
            </p>
          </div>
        ) : null}

        <div>
          <p className="mb-3 text-sm font-semibold">Extracted information</p>
          <ExtractedFields email={email} />
        </div>

        {email.hasAttachments && email.attachmentNames.length > 0 ? (
          <div>
            <p className="mb-2 text-sm font-semibold">Attachments</p>
            <ul className="space-y-2">
              {email.attachmentNames.map((name) => (
                <li
                  key={name}
                  className="flex items-center gap-2 rounded-md border bg-muted/30 px-3 py-2 text-sm"
                >
                  <Paperclip className="size-4 shrink-0 text-muted-foreground" />
                  <span className="truncate">{name}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </div>
  );
}
