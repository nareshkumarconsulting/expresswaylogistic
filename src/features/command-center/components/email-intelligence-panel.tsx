"use client";

import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Mail, Search } from "lucide-react";
import { Badge } from "@/components/atoms/badge";
import { Input } from "@/components/atoms/input";
import { Spinner } from "@/components/atoms/spinner";
import { StateAlert } from "@/components/molecules/state-alert";
import { EmailDetailSheet } from "@/features/command-center/components/email-detail-sheet";
import {
  EMAIL_CATEGORIES,
  EMAIL_CATEGORY_ICONS,
  EMAIL_CATEGORY_LABELS,
} from "@/features/email-intelligence/schemas";
import { cn } from "@/lib/utils";
import type {
  EmailCategory,
  EmailIntelligence,
  EmailIntelligenceStatus,
  EmailUrgency,
} from "@/types";

type CategoryFilter = "all" | EmailCategory;
type StatusFilter = "all" | EmailIntelligenceStatus;

const CATEGORY_FILTERS: { id: CategoryFilter; label: string }[] = [
  { id: "all", label: "All" },
  ...EMAIL_CATEGORIES.map((c) => ({
    id: c as CategoryFilter,
    label: `${EMAIL_CATEGORY_ICONS[c]} ${EMAIL_CATEGORY_LABELS[c]}`,
  })),
];

const STATUS_FILTERS: { id: StatusFilter; label: string }[] = [
  { id: "all", label: "All statuses" },
  { id: "new", label: "New" },
  { id: "read", label: "Read" },
  { id: "actioned", label: "Actioned" },
  { id: "archived", label: "Archived" },
];

async function fetchEmails(): Promise<EmailIntelligence[]> {
  const res = await fetch("/api/email-intelligence");
  const json = (await res.json()) as {
    success: boolean;
    data: EmailIntelligence[];
  };
  if (!res.ok || !json.success) throw new Error("Failed to load emails");
  return json.data;
}

function formatReceivedAt(iso: string): string {
  return new Date(iso).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });
}

function statusBadgeVariant(
  status: EmailIntelligenceStatus,
): "secondary" | "warning" | "success" | "muted" {
  switch (status) {
    case "new":
      return "secondary";
    case "read":
      return "warning";
    case "actioned":
      return "success";
    case "archived":
      return "muted";
    default:
      return "muted";
  }
}

function urgencyDot(urgency?: EmailUrgency): string {
  switch (urgency) {
    case "critical":
      return "bg-red-500";
    case "high":
      return "bg-orange-500";
    case "medium":
      return "bg-yellow-500";
    default:
      return "bg-gray-300";
  }
}

function getPreviewText(email: EmailIntelligence): string {
  const data = email.extractedData as Record<string, string | undefined>;
  switch (email.category) {
    case "shipment":
      return [data.trackingNo, data.destination, data.eta]
        .filter(Boolean)
        .join(" · ");
    case "quotation":
      return [data.quoteNo, data.price, data.validity]
        .filter(Boolean)
        .join(" · ");
    case "alert":
      return [data.alertType, data.requiredAction].filter(Boolean).join(" · ");
    default:
      return email.summary ?? data.summary ?? "";
  }
}

export function EmailIntelligencePanel() {
  const queryClient = useQueryClient();
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["email-intelligence"],
    queryFn: fetchEmails,
    refetchInterval: 60_000,
  });

  const selectedEmail = useMemo(
    () => data?.find((e) => e.id === selectedId) ?? null,
    [data, selectedId],
  );

  const counts = useMemo(() => {
    const base = { all: 0, shipment: 0, quotation: 0, alert: 0, general: 0 };
    if (!data) return base;
    return {
      all: data.length,
      shipment: data.filter((e) => e.category === "shipment").length,
      quotation: data.filter((e) => e.category === "quotation").length,
      alert: data.filter((e) => e.category === "alert").length,
      general: data.filter((e) => e.category === "general").length,
    };
  }, [data]);

  const filtered = useMemo(() => {
    if (!data) return [];
    const q = query.toLowerCase();
    return data.filter((email) => {
      if (categoryFilter !== "all" && email.category !== categoryFilter) {
        return false;
      }
      if (statusFilter !== "all" && email.status !== statusFilter) {
        return false;
      }
      if (!q) return true;
      return (
        email.subject.toLowerCase().includes(q) ||
        email.senderEmail.toLowerCase().includes(q) ||
        (email.senderName?.toLowerCase().includes(q) ?? false) ||
        email.sourceAccount.toLowerCase().includes(q) ||
        (email.summary?.toLowerCase().includes(q) ?? false)
      );
    });
  }, [data, query, categoryFilter, statusFilter]);

  const handleOpen = (id: string) => {
    setSelectedId(id);
    setSheetOpen(true);
  };

  const handleStatusChange = async (
    id: string,
    status: EmailIntelligenceStatus,
  ) => {
    const res = await fetch(`/api/email-intelligence/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      await queryClient.invalidateQueries({ queryKey: ["email-intelligence"] });
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Spinner label="Loading email intelligence" />
      </div>
    );
  }

  if (isError) {
    return (
      <StateAlert
        variant="error"
        title="Unable to load email intelligence"
        onRetry={() => void refetch()}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Email Intelligence
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            AI-classified emails from client accounts — shipments, quotes, alerts
            & more.
          </p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search subject, sender, account…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {CATEGORY_FILTERS.map((filter) => (
          <button
            key={filter.id}
            type="button"
            onClick={() => setCategoryFilter(filter.id)}
            className={cn(
              "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
              categoryFilter === filter.id
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80",
            )}
          >
            {filter.label}
            <span className="ml-1.5 opacity-70">({counts[filter.id]})</span>
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {STATUS_FILTERS.map((filter) => (
          <button
            key={filter.id}
            type="button"
            onClick={() => setStatusFilter(filter.id)}
            className={cn(
              "rounded-md border px-2.5 py-1 text-xs font-medium transition-colors",
              statusFilter === filter.id
                ? "border-primary bg-primary/5 text-primary"
                : "border-transparent text-muted-foreground hover:border-border",
            )}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center">
          <Mail className="mb-3 size-10 text-muted-foreground/50" />
          <p className="font-medium">No emails match your filters</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Emails will appear here once n8n processes incoming mail.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead>
                <tr className="border-b bg-muted/40 text-left text-xs font-medium text-muted-foreground">
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Subject</th>
                  <th className="px-4 py-3">Sender</th>
                  <th className="px-4 py-3">Account</th>
                  <th className="px-4 py-3">Received</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((email) => (
                  <tr
                    key={email.id}
                    onClick={() => handleOpen(email.id)}
                    className="cursor-pointer border-b transition-colors last:border-0 hover:bg-muted/30"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {email.urgency ? (
                          <span
                            className={cn(
                              "size-2 shrink-0 rounded-full",
                              urgencyDot(email.urgency),
                            )}
                            title={email.urgency}
                          />
                        ) : null}
                        <span>{EMAIL_CATEGORY_ICONS[email.category]}</span>
                      </div>
                    </td>
                    <td className="max-w-xs px-4 py-3">
                      <p className="truncate font-medium">{email.subject}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {getPreviewText(email)}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="truncate">{email.senderName ?? "—"}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {email.senderEmail}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {email.sourceAccount}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                      {formatReceivedAt(email.receivedAt)}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={statusBadgeVariant(email.status)}>
                        {email.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <EmailDetailSheet
        email={selectedEmail}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}
