"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Spinner } from "@/components/atoms/spinner";
import { StateAlert } from "@/components/molecules/state-alert";
import { STATUS_FILTER_LABELS } from "@/features/quotes/labels";
import type { QuoteRequest } from "@/types";
import { QUOTE_REQUEST_STATUSES } from "@/types";
import {
  countQuotesByStatus,
  quoteStatusColor,
} from "@/features/command-center/components/quote-status-overview";

type QuoteStatusMixChartProps = {
  quotes: QuoteRequest[];
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
};

export function QuoteStatusMixChart({
  quotes,
  isLoading,
  isError,
  onRetry,
}: QuoteStatusMixChartProps) {
  const counts = countQuotesByStatus(quotes);
  const data = QUOTE_REQUEST_STATUSES.map((status) => ({
    status,
    label: STATUS_FILTER_LABELS[status],
    count: counts[status],
    fill: quoteStatusColor(status),
  }));

  return (
    <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
      <div className="mb-4">
        <h3 className="font-display text-lg font-bold">Status mix</h3>
        <p className="text-xs text-muted-foreground">
          How many quotes sit in each status right now
        </p>
      </div>
      {isLoading ? (
        <div className="flex h-72 items-center justify-center">
          <Spinner label="Loading status mix" />
        </div>
      ) : isError ? (
        <StateAlert
          variant="error"
          title="Unable to load status mix"
          onRetry={onRetry}
        />
      ) : quotes.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Status counts will appear here once quotes come in.
        </p>
      ) : (
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 4, right: 12, left: 4, bottom: 4 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e2e8f0"
                horizontal={false}
              />
              <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12 }} />
              <YAxis
                type="category"
                dataKey="label"
                width={128}
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                formatter={(value) => [`${value ?? 0}`, "Requests"]}
                labelFormatter={(label) => String(label)}
              />
              <Bar dataKey="count" name="Requests" radius={[0, 4, 4, 0]}>
                {data.map((entry) => (
                  <Cell key={entry.status} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
