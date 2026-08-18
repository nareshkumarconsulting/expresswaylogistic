"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Inbox,
  Mail,
  Paperclip,
  Search,
  Sparkles,
} from "lucide-react";
import { Input } from "@/components/atoms/input";
import { Spinner } from "@/components/atoms/spinner";
import { StateAlert } from "@/components/molecules/state-alert";
import { emailQuoteActionLabel } from "@/features/command-center/components/email-ai-badge";
import { EmailDetailView } from "@/features/command-center/components/email-detail-view";
import { CATEGORY_UI } from "@/features/command-center/email-category-ui";
import { EMAIL_CATEGORIES } from "@/features/email-intelligence/schemas";
import { cn } from "@/lib/utils";
import type {
  EmailCategory,
  EmailIntelligence,
  EmailIntelligenceStatus,
  EmailUrgency,
} from "@/types";

type CategoryFilter = "all" | EmailCategory;
type StatusFilter = "all" | EmailIntelligenceStatus;

const STATUS_FILTERS: { id: StatusFilter; label: string }[] = [
  { id: "all", label: "All" },
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

function formatListTime(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
    });
  }
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

function accountLabel(account: string): string {
  return account.split("@")[0] ?? account;
}

function urgencyBar(urgency?: EmailUrgency): string {
  switch (urgency) {
    case "critical":
      return "bg-destructive";
    case "high":
      return "bg-warning";
    case "medium":
      return "bg-accent";
    default:
      return "bg-transparent";
  }
}

export function EmailIntelligencePanel() {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const idFromUrl = searchParams.get("id");
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [accountFilter, setAccountFilter] = useState("all");
  const [selectedId, setSelectedId] = useState<string | null>(idFromUrl);
  const autoReadIds = useRef(new Set<string>());

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["email-intelligence"],
    queryFn: fetchEmails,
    refetchInterval: 60_000,
  });

  const selectedEmail = useMemo(
    () => data?.find((e) => e.id === selectedId) ?? null,
    [data, selectedId],
  );

  const accounts = useMemo(() => {
    if (!data) return [];
    return [...new Set(data.map((e) => e.sourceAccount))].sort();
  }, [data]);

  const counts = useMemo(() => {
    const base = {
      all: 0,
      shipment: 0,
      quotation: 0,
      alert: 0,
      general: 0,
      new: 0,
    };
    if (!data) return base;
    return {
      all: data.length,
      shipment: data.filter((e) => e.category === "shipment").length,
      quotation: data.filter((e) => e.category === "quotation").length,
      alert: data.filter((e) => e.category === "alert").length,
      general: data.filter((e) => e.category === "general").length,
      new: data.filter((e) => e.status === "new").length,
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
      if (accountFilter !== "all" && email.sourceAccount !== accountFilter) {
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
  }, [data, query, categoryFilter, statusFilter, accountFilter]);

  useEffect(() => {
    if (!selectedId || !data) return;
    if (!data.some((email) => email.id === selectedId)) {
      setSelectedId(null);
    }
  }, [data, selectedId]);

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

  useEffect(() => {
    if (!selectedEmail || selectedEmail.status !== "new") return;
    if (autoReadIds.current.has(selectedEmail.id)) return;
    autoReadIds.current.add(selectedEmail.id);
    void handleStatusChange(selectedEmail.id, "read");
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mark-read once per open
  }, [selectedEmail?.id]);

  const handleOpen = (id: string) => {
    setSelectedId(id);
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
    <div className="flex h-[calc(100dvh-7rem)] min-h-0 flex-col gap-3">
      <div className="flex shrink-0 items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-bold">Email Intelligence</h2>
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{counts.new}</span>{" "}
            new · {counts.all} total
          </p>
        </div>
      </div>

      <div className="grid shrink-0 grid-cols-2 gap-2 lg:grid-cols-4">
        <button
          type="button"
          onClick={() => {
            setCategoryFilter("all");
            setStatusFilter("new");
          }}
          className={cn(
            "flex items-center gap-2 rounded-lg border bg-card px-3 py-2 text-left shadow-sm transition-colors hover:border-primary/40",
            statusFilter === "new" && categoryFilter === "all"
              ? "border-primary ring-1 ring-primary/20"
              : "border-border",
          )}
        >
          <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-accent/15 text-accent">
            <Mail className="size-4" aria-hidden />
          </span>
          <span className="min-w-0">
            <span className="block text-xs text-muted-foreground">Needs review</span>
            <span className="text-lg font-bold tabular-nums leading-tight">
              {counts.new}
            </span>
          </span>
        </button>
        {EMAIL_CATEGORIES.filter((c) => c !== "general").map((category) => {
          const meta = CATEGORY_UI[category];
          const Icon = meta.icon;
          const active = categoryFilter === category;
          return (
            <button
              key={category}
              type="button"
              onClick={() => {
                setCategoryFilter(active ? "all" : category);
                setStatusFilter("all");
              }}
              className={cn(
                "flex items-center gap-2 rounded-lg border bg-card px-3 py-2 text-left shadow-sm transition-colors hover:border-primary/40",
                active
                  ? "border-primary ring-1 ring-primary/20"
                  : "border-border",
              )}
            >
              <span
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-md",
                  meta.wrap,
                )}
              >
                <Icon className="size-4" aria-hidden />
              </span>
              <span className="min-w-0">
                <span className="block text-xs text-muted-foreground">
                  {meta.label}
                </span>
                <span className="text-lg font-bold tabular-nums leading-tight">
                  {counts[category]}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border bg-card shadow-sm">
        <div className="flex flex-col gap-3 border-b p-3 md:flex-row md:items-center md:justify-between md:px-4">
          <div
            className="inline-flex flex-wrap rounded-lg border border-border bg-muted/40 p-1"
            role="tablist"
            aria-label="Filter emails by status"
          >
            {STATUS_FILTERS.map((item) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={statusFilter === item.id}
                onClick={() => setStatusFilter(item.id)}
                className={cn(
                  "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                  statusFilter === item.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="flex flex-1 flex-col gap-2 sm:flex-row md:max-w-xl md:justify-end">
            {accounts.length > 1 ? (
              <select
                value={accountFilter}
                onChange={(e) => setAccountFilter(e.target.value)}
                aria-label="Filter by inbox"
                className="h-10 rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="all">All inboxes</option>
                {accounts.map((account) => (
                  <option key={account} value={account}>
                    {accountLabel(account)}
                  </option>
                ))}
              </select>
            ) : null}
            <div className="relative min-w-0 flex-1">
              <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search subject, sender, account…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-9"
                aria-label="Search emails"
              />
            </div>
          </div>
        </div>

        <div className="grid min-h-0 flex-1 overflow-hidden lg:grid-cols-[minmax(20rem,26rem)_1fr]">
          <div
            className={cn(
              "flex min-h-0 flex-col border-b lg:border-r lg:border-b-0",
              selectedId && "hidden lg:flex",
            )}
          >
            <div
              className="flex gap-1 overflow-x-auto border-b p-2"
              role="tablist"
              aria-label="Filter by category"
            >
              <button
                type="button"
                role="tab"
                aria-selected={categoryFilter === "all"}
                onClick={() => setCategoryFilter("all")}
                className={cn(
                  "shrink-0 rounded-md px-2.5 py-1.5 text-xs font-medium",
                  categoryFilter === "all"
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                All
              </button>
              {EMAIL_CATEGORIES.map((category) => {
                const meta = CATEGORY_UI[category];
                const Icon = meta.icon;
                return (
                  <button
                    key={category}
                    type="button"
                    role="tab"
                    aria-selected={categoryFilter === category}
                    onClick={() => setCategoryFilter(category)}
                    className={cn(
                      "inline-flex shrink-0 items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium",
                      categoryFilter === category
                        ? "bg-muted text-foreground"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <Icon className={cn("size-3.5", meta.tint)} aria-hidden />
                    {meta.short}
                  </button>
                );
              })}
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto">
              {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                  <Mail className="mb-3 size-10 text-muted-foreground/50" />
                  <p className="font-medium">No emails match your filters</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Incoming mail will appear here after n8n classifies it.
                  </p>
                </div>
              ) : (
                <ul>
                  {filtered.map((email) => {
                    const meta = CATEGORY_UI[email.category];
                    const Icon = meta.icon;
                    const isSelected = email.id === selectedId;
                    const isNew = email.status === "new";
                    return (
                      <li key={email.id}>
                        <button
                          type="button"
                          onClick={() => handleOpen(email.id)}
                          className={cn(
                            "relative flex w-full gap-2.5 border-b px-3 py-2 text-left transition-colors hover:bg-muted/40",
                            isSelected && "bg-muted/60",
                            isNew && "bg-primary/[0.03]",
                          )}
                        >
                          <span
                            className={cn(
                              "absolute inset-y-0 left-0 w-0.5",
                              urgencyBar(email.urgency),
                            )}
                            aria-hidden
                          />
                          <span
                            className={cn(
                              "mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md",
                              meta.wrap,
                            )}
                          >
                            <Icon className="size-3.5" aria-hidden />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="flex items-center justify-between gap-2">
                              <span
                                className={cn(
                                  "truncate text-sm",
                                  isNew
                                    ? "font-semibold text-foreground"
                                    : "font-medium text-foreground/90",
                                )}
                              >
                                {email.senderName ?? email.senderEmail}
                              </span>
                              <span className="flex shrink-0 items-center gap-1.5 text-[11px] text-muted-foreground">
                                {email.hasAttachments ? (
                                  <Paperclip
                                    className="size-3"
                                    aria-label="Has attachments"
                                  />
                                ) : null}
                                {formatListTime(email.receivedAt)}
                              </span>
                            </span>
                            <span className="mt-0.5 flex items-center gap-2">
                              <span
                                className={cn(
                                  "min-w-0 flex-1 truncate text-xs",
                                  isNew
                                    ? "font-medium text-foreground"
                                    : "text-muted-foreground",
                                )}
                              >
                                {email.subject}
                              </span>
                              {emailQuoteActionLabel(email.quoteAction) ? (
                                <span className="inline-flex shrink-0 items-center gap-0.5 text-[10px] font-semibold text-primary">
                                  <Sparkles className="size-3" aria-hidden />
                                  {emailQuoteActionLabel(email.quoteAction)}
                                </span>
                              ) : email.quoteRequestId ? (
                                <span className="inline-flex shrink-0 items-center gap-0.5 text-[10px] font-semibold text-primary">
                                  <Sparkles className="size-3" aria-hidden />
                                  Linked quote
                                </span>
                              ) : null}
                              {isNew ? (
                                <span className="size-1.5 shrink-0 rounded-full bg-accent" />
                              ) : null}
                            </span>
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>

          <div
            className={cn(
              "flex min-h-0 flex-col overflow-hidden bg-background",
              !selectedEmail && "hidden lg:flex",
            )}
          >
            {selectedEmail ? (
              <EmailDetailView
                email={selectedEmail}
                onBack={() => setSelectedId(null)}
                onStatusChange={handleStatusChange}
              />
            ) : (
              <div className="flex h-full flex-col items-center justify-center px-8 text-center">
                <Inbox className="mb-3 size-10 text-muted-foreground/40" />
                <p className="font-medium">Select an email</p>
                <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                  Choose a message from the inbox to see the AI summary and
                  extracted fields.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
