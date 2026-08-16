"use client";

import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/atoms/badge";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { Label } from "@/components/atoms/label";
import { Textarea } from "@/components/atoms/textarea";
import { Spinner } from "@/components/atoms/spinner";
import { StateAlert } from "@/components/molecules/state-alert";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import type { Forwarder } from "@/types";

async function fetchForwarders(): Promise<Forwarder[]> {
  const res = await fetch("/api/forwarders");
  const json = (await res.json()) as { success: boolean; data: Forwarder[] };
  if (!res.ok || !json.success) throw new Error("Failed to load forwarders");
  return json.data;
}

const EMPTY_FORM = {
  companyName: "",
  contactPerson: "",
  email: "",
  phone: "",
  address: "",
  country: "",
  serviceTypes: "",
  originLocations: "",
  destinationLocations: "",
  preferredRoutes: "",
  notes: "",
  status: "Active" as Forwarder["status"],
};

export function ForwardersPanel() {
  const queryClient = useQueryClient();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "Active" | "Inactive">(
    "all",
  );
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Forwarder | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["forwarders"],
    queryFn: fetchForwarders,
  });

  const filtered = useMemo(() => {
    if (!data) return [];
    const q = query.toLowerCase();
    return data.filter((row) => {
      if (statusFilter !== "all" && row.status !== statusFilter) return false;
      if (!q) return true;
      return (
        row.companyName.toLowerCase().includes(q) ||
        row.email.toLowerCase().includes(q) ||
        (row.contactPerson ?? "").toLowerCase().includes(q) ||
        row.serviceTypes.join(" ").toLowerCase().includes(q) ||
        (row.preferredRoutes ?? "").toLowerCase().includes(q)
      );
    });
  }, [data, query, statusFilter]);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setError(null);
    setOpen(true);
  };

  const openEdit = (row: Forwarder) => {
    setEditing(row);
    setForm({
      companyName: row.companyName,
      contactPerson: row.contactPerson ?? "",
      email: row.email,
      phone: row.phone ?? "",
      address: row.address ?? "",
      country: row.country ?? "",
      serviceTypes: row.serviceTypes.join(", "),
      originLocations: row.originLocations.join(", "),
      destinationLocations: row.destinationLocations.join(", "),
      preferredRoutes: row.preferredRoutes ?? "",
      notes: row.notes ?? "",
      status: row.status,
    });
    setError(null);
    setOpen(true);
  };

  const splitList = (value: string) =>
    value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

  const save = async () => {
    setSaving(true);
    setError(null);
    const payload = {
      companyName: form.companyName,
      contactPerson: form.contactPerson || undefined,
      email: form.email,
      phone: form.phone || undefined,
      address: form.address || undefined,
      country: form.country || undefined,
      serviceTypes: splitList(form.serviceTypes),
      originLocations: splitList(form.originLocations),
      destinationLocations: splitList(form.destinationLocations),
      preferredRoutes: form.preferredRoutes || undefined,
      notes: form.notes || undefined,
      status: form.status,
    };
    const url = editing ? `/api/forwarders/${editing.id}` : "/api/forwarders";
    const res = await fetch(url, {
      method: editing ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = (await res.json()) as { success: boolean; error?: string };
    setSaving(false);
    if (!res.ok || !json.success) {
      setError(json.error ?? "Could not save forwarder");
      return;
    }
    await queryClient.invalidateQueries({ queryKey: ["forwarders"] });
    setOpen(false);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[30vh] items-center justify-center">
        <Spinner label="Loading forwarders" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <StateAlert
        variant="error"
        title="Forwarders unavailable"
        onRetry={() => void refetch()}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold">Forwarders</h2>
          <p className="text-sm text-muted-foreground">
            Directory used when requesting competitive quotes.
          </p>
        </div>
        <Button type="button" rounded="none" onClick={openCreate}>
          Add Forwarder
        </Button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search company, contact, services, routes…"
          aria-label="Search forwarders"
        />
        <select
          className="h-11 rounded-md border border-input bg-background px-3 text-sm sm:w-40"
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value as typeof statusFilter)
          }
          aria-label="Filter by status"
        >
          <option value="all">All statuses</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <StateAlert
          variant="info"
          title="No matching forwarders"
          description="Add a forwarder or clear filters."
        />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border bg-card shadow-sm">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="border-b bg-muted/50 text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Forwarder</th>
                <th className="px-4 py-3 font-medium">Contact</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Services</th>
                <th className="px-4 py-3 font-medium">Routes</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr
                  key={row.id}
                  className="cursor-pointer border-b last:border-0 hover:bg-muted/40"
                  onClick={() => openEdit(row)}
                >
                  <td className="px-4 py-3 font-medium">{row.companyName}</td>
                  <td className="px-4 py-3">{row.contactPerson ?? "—"}</td>
                  <td className="px-4 py-3">{row.email}</td>
                  <td className="px-4 py-3 text-xs">
                    {row.serviceTypes.join(", ") || "—"}
                  </td>
                  <td className="px-4 py-3 text-xs">
                    {row.preferredRoutes ||
                      `${row.originLocations.slice(0, 2).join(", ")} → ${row.destinationLocations.slice(0, 2).join(", ")}`}
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      variant={row.status === "Active" ? "success" : "muted"}
                    >
                      {row.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="w-[min(100%,28rem)] overflow-y-auto">
          <SheetTitle>{editing ? "Edit forwarder" : "Add forwarder"}</SheetTitle>
          <div className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fwd-company">Company name</Label>
              <Input
                id="fwd-company"
                value={form.companyName}
                onChange={(e) =>
                  setForm((current) => ({
                    ...current,
                    companyName: e.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fwd-contact">Contact person</Label>
              <Input
                id="fwd-contact"
                value={form.contactPerson}
                onChange={(e) =>
                  setForm((current) => ({
                    ...current,
                    contactPerson: e.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fwd-email">Email</Label>
              <Input
                id="fwd-email"
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm((current) => ({ ...current, email: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fwd-phone">Phone</Label>
              <Input
                id="fwd-phone"
                value={form.phone}
                onChange={(e) =>
                  setForm((current) => ({ ...current, phone: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fwd-country">Country</Label>
              <Input
                id="fwd-country"
                value={form.country}
                onChange={(e) =>
                  setForm((current) => ({
                    ...current,
                    country: e.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fwd-address">Address</Label>
              <Textarea
                id="fwd-address"
                value={form.address}
                onChange={(e) =>
                  setForm((current) => ({
                    ...current,
                    address: e.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fwd-services">Service types (comma separated)</Label>
              <Input
                id="fwd-services"
                value={form.serviceTypes}
                onChange={(e) =>
                  setForm((current) => ({
                    ...current,
                    serviceTypes: e.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fwd-origins">Origin locations</Label>
              <Input
                id="fwd-origins"
                value={form.originLocations}
                onChange={(e) =>
                  setForm((current) => ({
                    ...current,
                    originLocations: e.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fwd-dest">Destination locations</Label>
              <Input
                id="fwd-dest"
                value={form.destinationLocations}
                onChange={(e) =>
                  setForm((current) => ({
                    ...current,
                    destinationLocations: e.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fwd-routes">Preferred / supported routes</Label>
              <Input
                id="fwd-routes"
                value={form.preferredRoutes}
                onChange={(e) =>
                  setForm((current) => ({
                    ...current,
                    preferredRoutes: e.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fwd-notes">Notes</Label>
              <Textarea
                id="fwd-notes"
                value={form.notes}
                onChange={(e) =>
                  setForm((current) => ({ ...current, notes: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fwd-status">Status</Label>
              <select
                id="fwd-status"
                className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm"
                value={form.status}
                onChange={(e) =>
                  setForm((current) => ({
                    ...current,
                    status: e.target.value as Forwarder["status"],
                  }))
                }
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            {error ? (
              <p className="text-sm text-destructive">{error}</p>
            ) : null}
            <Button
              type="button"
              rounded="none"
              className="w-full"
              loading={saving}
              onClick={() => void save()}
            >
              {editing ? "Save changes" : "Add forwarder"}
            </Button>
            {editing ? (
              <Button
                type="button"
                variant="outline"
                rounded="none"
                className="w-full"
                onClick={() => {
                  setForm((current) => ({
                    ...current,
                    status: current.status === "Active" ? "Inactive" : "Active",
                  }));
                }}
              >
                {form.status === "Active" ? "Mark inactive" : "Mark active"}
              </Button>
            ) : null}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
