"use client";

import Link from "next/link";
import { Spinner } from "@/components/atoms/spinner";
import { StateAlert } from "@/components/molecules/state-alert";
import {
  QuoteStatusPipeline,
  QuoteStatusTileBody,
  quoteStatusTileClass,
} from "@/features/command-center/components/quote-status-pipeline";
import { countQuotesByStatus } from "@/features/command-center/components/quote-status-overview";
import type { QuoteRequest } from "@/types";

type QuoteStatusBoardProps = {
  quotes: QuoteRequest[];
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
};

export function QuoteStatusBoard({
  quotes,
  isLoading,
  isError,
  onRetry,
}: QuoteStatusBoardProps) {
  const counts = countQuotesByStatus(quotes);

  if (isLoading) {
    return (
      <div className="flex min-h-[8rem] items-center justify-center rounded-lg border border-border bg-card">
        <Spinner label="Loading quote status" />
      </div>
    );
  }

  if (isError) {
    return (
      <StateAlert
        variant="error"
        title="Unable to load quote status"
        onRetry={onRetry}
      />
    );
  }

  if (quotes.length === 0) {
    return (
      <p className="rounded-lg border border-border bg-card px-4 py-6 text-sm text-muted-foreground">
        New website submissions will appear here by status.
      </p>
    );
  }

  return (
    <QuoteStatusPipeline
      counts={counts}
      renderTile={(status, count) => (
        <Link
          key={status}
          href={`/command-center/quotes?status=${encodeURIComponent(status)}`}
          className={quoteStatusTileClass(status, count)}
        >
          <QuoteStatusTileBody status={status} count={count} />
        </Link>
      )}
    />
  );
}
