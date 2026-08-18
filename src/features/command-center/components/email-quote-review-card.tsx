"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import { EmailAiBadge } from "@/features/command-center/components/email-ai-badge";
import { Button } from "@/components/atoms/button";
import { RFQ_FIELD_LABELS } from "@/features/quotes/email-rfq";
import type { QuoteRequest } from "@/types";

type EmailQuoteReviewCardProps = {
  quote: QuoteRequest;
  busy: boolean;
  onConfirm: () => void;
  onDismiss: () => void;
};

export function EmailQuoteReviewCard({
  quote,
  busy,
  onConfirm,
  onDismiss,
}: EmailQuoteReviewCardProps) {
  if (quote.source !== "email") return null;
  if (
    quote.aiReviewStatus !== "needs_review" &&
    quote.aiReviewStatus !== "needs_info"
  ) {
    return null;
  }

  const needsInfo = quote.aiReviewStatus === "needs_info";
  const missing = quote.aiMissingFields ?? [];

  return (
    <section className="rounded-lg border border-primary/20 bg-primary/5 p-4">
      <div className="flex flex-wrap items-center gap-2">
        <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-primary">
          <Sparkles className="size-3.5" aria-hidden />
          Email AI
        </p>
        <EmailAiBadge variant={needsInfo ? "warning" : "accent"}>
          {needsInfo ? "Needs info" : "Ready for review"}
        </EmailAiBadge>
        {quote.aiCompleteness != null ? (
          <EmailAiBadge variant="muted">
            {Math.round(quote.aiCompleteness * 100)}% complete
          </EmailAiBadge>
        ) : null}
      </div>
      <p className="mt-2 text-sm text-foreground">
        {needsInfo
          ? "Created from email with missing pricing details. Sales should chase the client before sending to forwarders."
          : "Created from a complete-enough enquiry. Confirm before quoting the customer or asking partners."}
      </p>
      {missing.length > 0 ? (
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
          {missing.map((field) => (
            <li key={field}>{RFQ_FIELD_LABELS[field] ?? field}</li>
          ))}
        </ul>
      ) : null}
      {quote.aiSuggestedReply ? (
        <div className="mt-3 rounded-md border bg-background p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Suggested chase email
          </p>
          <p className="mt-1 text-sm leading-relaxed">{quote.aiSuggestedReply}</p>
        </div>
      ) : null}
      {quote.emailIntelligenceId ? (
        <p className="mt-3 text-sm">
          <Link
            href={`/command-center/emails?id=${quote.emailIntelligenceId}`}
            className="font-semibold text-accent hover:underline"
          >
            Open original email
          </Link>
        </p>
      ) : null}
      <div className="mt-4 flex flex-wrap gap-2">
        <Button
          type="button"
          size="sm"
          disabled={busy}
          onClick={onConfirm}
        >
          Confirm and take over
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={busy}
          onClick={onDismiss}
        >
          Not a quote
        </Button>
      </div>
    </section>
  );
}
