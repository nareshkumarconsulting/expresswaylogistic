"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Spinner } from "@/components/atoms/spinner";
import { StateAlert } from "@/components/molecules/state-alert";
import { formatNumber } from "@/lib/utils";
import type { QuoteRequest } from "@/types";
import { buildQuoteDailySeries } from "@/features/command-center/components/quote-status-overview";

type QuoteStatusChartProps = {
  quotes: QuoteRequest[];
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
};

const TREND_DAYS = 10;

export function QuoteStatusChart({
  quotes,
  isLoading,
  isError,
  onRetry,
}: QuoteStatusChartProps) {
  const data = buildQuoteDailySeries(quotes, TREND_DAYS);
  const received = data.reduce((sum, point) => sum + point.received, 0);
  const replied = data.reduce((sum, point) => sum + point.replied, 0);
  const closed = data.reduce((sum, point) => sum + point.closed, 0);

  return (
    <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
      <div className="mb-4">
        <h3 className="font-display text-lg font-bold">Daily activity</h3>
        <p className="text-xs text-muted-foreground">
          {isLoading
            ? "Loading daily trend…"
            : quotes.length === 0
              ? `Last ${TREND_DAYS} days`
              : `Last ${TREND_DAYS} days · ${formatNumber(received)} received · ${formatNumber(replied)} replied · ${formatNumber(closed)} closed`}
        </p>
      </div>
      {isLoading ? (
        <div className="flex h-72 items-center justify-center">
          <Spinner label="Loading quote graph" />
        </div>
      ) : isError ? (
        <StateAlert
          variant="error"
          title="Unable to load quote graph"
          onRetry={onRetry}
        />
      ) : quotes.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          A day-by-day view of received, replied, and closed quotes will appear
          here.
        </p>
      ) : (
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="quoteReceived" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(210 78% 18%)" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="hsl(210 78% 18%)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="quoteReplied" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(32 100% 50%)" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="hsl(32 100% 50%)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="quoteClosed" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(152 60% 36%)" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="hsl(152 60% 36%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} width={32} />
              <Tooltip
                formatter={(value, name) => [`${value ?? 0}`, String(name)]}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="received"
                name="Received"
                stroke="hsl(210 78% 18%)"
                fill="url(#quoteReceived)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="replied"
                name="Replied"
                stroke="hsl(32 100% 50%)"
                fill="url(#quoteReplied)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="closed"
                name="Closed"
                stroke="hsl(152 60% 36%)"
                fill="url(#quoteClosed)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
