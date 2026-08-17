"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Package,
  Plane,
  Ship,
  Clock,
  AlertTriangle,
  FileText,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Badge } from "@/components/atoms/badge";
import { StatCard } from "@/components/molecules/stat-card";
import { StateAlert } from "@/components/molecules/state-alert";
import { Spinner } from "@/components/atoms/spinner";
import { QuoteStatusBoard } from "@/features/command-center/components/quote-status-board";
import { QuoteStatusChart } from "@/features/command-center/components/quote-status-chart";
import { QuoteStatusMixChart } from "@/features/command-center/components/quote-status-mix-chart";
import { ACTIONABLE_QUOTE_STATUSES } from "@/features/command-center/components/quote-status-overview";
import {
  FREIGHT_MIX,
  MOCK_AI_INSIGHTS,
  SHIPMENT_VOLUME,
} from "@/services/logistics-data";
import type { AiInsight, QuoteRequest, Shipment } from "@/types";
import { formatNumber } from "@/lib/utils";

async function fetchShipments(): Promise<Shipment[]> {
  const res = await fetch("/api/shipments");
  const json = (await res.json()) as { success: boolean; data: Shipment[] };
  if (!res.ok || !json.success) throw new Error("Failed to load shipments");
  return json.data;
}

async function fetchQuotes(): Promise<QuoteRequest[]> {
  const res = await fetch("/api/quotes");
  const json = (await res.json()) as {
    success: boolean;
    data: QuoteRequest[];
  };
  if (!res.ok || !json.success) throw new Error("Failed to load quotes");
  return json.data;
}

function statusBadge(status: string) {
  switch (status) {
    case "Delivered":
      return "success" as const;
    case "Customs Hold":
    case "Delayed":
      return "warning" as const;
    case "In Transit":
      return "secondary" as const;
    default:
      return "muted" as const;
  }
}

function severityBadge(severity: AiInsight["severity"]) {
  if (severity === "critical") return "destructive" as const;
  if (severity === "warning") return "warning" as const;
  return "secondary" as const;
}

function SectionHeading({
  id,
  title,
  description,
  action,
}: {
  id: string;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3 border-b border-border pb-3">
      <div>
        <h2 id={id} className="font-display text-xl font-bold">
          {title}
        </h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {action}
    </div>
  );
}

export function CommandOverview() {
  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ["shipments"],
    queryFn: fetchShipments,
  });

  const quotesQuery = useQuery({
    queryKey: ["quotes"],
    queryFn: fetchQuotes,
  });

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Spinner label="Loading command center" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <StateAlert
        variant="error"
        title="Unable to load operations data"
        description="Check your connection and try again."
        onRetry={() => void refetch()}
      />
    );
  }

  const inTransit = data.filter((s) => s.status === "In Transit").length;
  const exceptions = data.filter(
    (s) => s.status === "Customs Hold" || s.status === "Delayed",
  ).length;
  const quotes = quotesQuery.data ?? [];
  const actionableQuotes = quotes.filter((quote) =>
    ACTIONABLE_QUOTE_STATUSES.has(quote.status),
  ).length;
  const quoteSummary = quotesQuery.isLoading
    ? "Loading quote pipeline…"
    : quotesQuery.isError
      ? "Unable to load quotes"
      : quotes.length === 0
        ? "No quote requests yet"
        : `${formatNumber(quotes.length)} total · ${formatNumber(actionableQuotes)} need action`;

  return (
    <div className="space-y-12">
      <section className="space-y-6" aria-labelledby="shipping-heading">
        <SectionHeading
          id="shipping-heading"
          title="Shipping"
          description="Live network, volume, and exceptions"
        />

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Active Shipments"
            value={formatNumber(data.length)}
            delta={isFetching ? "Refreshing…" : "+8.2% vs last week"}
            trend="up"
            icon={Package}
          />
          <StatCard
            label="In Transit"
            value={formatNumber(inTransit)}
            delta="On-network"
            trend="neutral"
            icon={Plane}
          />
          <StatCard
            label="Ocean Bookings"
            value={formatNumber(
              data.filter((s) => s.type === "Ocean Freight").length,
            )}
            delta="Lane utilization 74%"
            trend="up"
            icon={Ship}
          />
          <StatCard
            label="Exceptions"
            value={formatNumber(exceptions)}
            delta="AI monitoring active"
            trend={exceptions > 0 ? "down" : "neutral"}
            icon={AlertTriangle}
          />
        </div>

        <div className="grid gap-6 xl:grid-cols-3">
          <div className="rounded-lg border border-border bg-card p-6 shadow-sm xl:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-lg font-bold">Shipment Volume</h3>
              <span className="text-xs text-muted-foreground">Air vs Ocean</span>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={SHIPMENT_VOLUME}>
                  <defs>
                    <linearGradient id="air" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(210 78% 18%)" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="hsl(210 78% 18%)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="ocean" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(32 100% 50%)" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="hsl(32 100% 50%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="air"
                    stroke="hsl(210 78% 18%)"
                    fill="url(#air)"
                    name="Air"
                  />
                  <Area
                    type="monotone"
                    dataKey="ocean"
                    stroke="hsl(32 100% 50%)"
                    fill="url(#ocean)"
                    name="Ocean"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
            <h3 className="font-display mb-4 text-lg font-bold">Freight Mix</h3>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={FREIGHT_MIX}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                  >
                    {FREIGHT_MIX.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="mt-2 space-y-2">
              {FREIGHT_MIX.map((item) => (
                <li
                  key={item.name}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="flex items-center gap-2">
                    <span
                      className="size-2.5 rounded-full"
                      style={{ background: item.color }}
                    />
                    {item.name}
                  </span>
                  <span className="font-semibold">{item.value}%</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-5">
          <div className="rounded-lg border border-border bg-card p-6 shadow-sm xl:col-span-3">
            <div className="mb-4 flex items-center gap-2">
              <Clock className="size-5 text-accent" />
              <h3 className="font-display text-lg font-bold">Recent Shipments</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead className="border-b text-muted-foreground">
                  <tr>
                    <th className="py-3 pr-4 font-medium">ID</th>
                    <th className="py-3 pr-4 font-medium">Lane</th>
                    <th className="py-3 pr-4 font-medium">Mode</th>
                    <th className="py-3 pr-4 font-medium">Client</th>
                    <th className="py-3 pr-4 font-medium">ETA</th>
                    <th className="py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.slice(0, 6).map((shipment) => (
                    <tr key={shipment.id} className="border-b last:border-0">
                      <td className="py-3 pr-4 font-semibold">{shipment.id}</td>
                      <td className="py-3 pr-4">
                        {shipment.origin} → {shipment.destination}
                      </td>
                      <td className="py-3 pr-4">{shipment.type}</td>
                      <td className="py-3 pr-4">{shipment.client}</td>
                      <td className="py-3 pr-4">{shipment.eta}</td>
                      <td className="py-3">
                        <Badge variant={statusBadge(shipment.status)}>
                          {shipment.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-6 shadow-sm xl:col-span-2">
            <h3 className="font-display mb-4 text-lg font-bold">AI Insights</h3>
            <ul className="space-y-4">
              {MOCK_AI_INSIGHTS.map((insight) => (
                <li
                  key={insight.id}
                  className="rounded-md border border-border bg-muted/40 p-4"
                >
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <Badge variant={severityBadge(insight.severity)}>
                      {insight.severity}
                    </Badge>
                    {insight.relatedShipmentId ? (
                      <span className="text-xs text-muted-foreground">
                        {insight.relatedShipmentId}
                      </span>
                    ) : null}
                  </div>
                  <p className="font-semibold">{insight.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {insight.summary}
                  </p>
                  <p className="mt-2 text-sm font-medium text-primary">
                    {insight.recommendation}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="space-y-6" aria-labelledby="quotes-heading">
        <SectionHeading
          id="quotes-heading"
          title="Quotes"
          description={quoteSummary}
          action={
            <Link
              href="/command-center/quotes"
              className="inline-flex items-center gap-2 text-sm font-semibold text-accent hover:underline"
            >
              <FileText className="size-4" />
              Open quotes
            </Link>
          }
        />

        <QuoteStatusBoard
          quotes={quotes}
          isLoading={quotesQuery.isLoading}
          isError={quotesQuery.isError}
          onRetry={() => void quotesQuery.refetch()}
        />

        <div className="grid gap-6 xl:grid-cols-2">
          <QuoteStatusMixChart
            quotes={quotes}
            isLoading={quotesQuery.isLoading}
            isError={quotesQuery.isError}
            onRetry={() => void quotesQuery.refetch()}
          />
          <QuoteStatusChart
            quotes={quotes}
            isLoading={quotesQuery.isLoading}
            isError={quotesQuery.isError}
            onRetry={() => void quotesQuery.refetch()}
          />
        </div>
      </section>
    </div>
  );
}
