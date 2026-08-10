"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format, parse } from "date-fns";
import {
  Building2,
  Clock,
  MapPin,
  Package,
  Video,
  Phone,
  Users,
} from "lucide-react";
import { Badge } from "@/components/atoms/badge";
import { Spinner } from "@/components/atoms/spinner";
import { StateAlert } from "@/components/molecules/state-alert";
import { Calendar } from "@/components/ui/calendar";
import {
  APPOINTMENT_TYPE_LABELS,
  MEETING_MODE_LABELS,
  TIME_SLOT_LABELS,
} from "@/features/appointment/schemas";
import { cn } from "@/lib/utils";
import type {
  CalendarEvent,
  CalendarEventKind,
  CalendarEventStatus,
} from "@/types";

type FilterKind = "all" | CalendarEventKind;

const KIND_LABELS: Record<CalendarEventKind, string> = {
  appointment: "Appointment",
  "shipment-eta": "Shipment ETA",
};

function kindBadgeVariant(
  kind: CalendarEventKind,
): "accent" | "default" {
  if (kind === "appointment") return "accent";
  return "default";
}

async function fetchCalendar(): Promise<CalendarEvent[]> {
  const res = await fetch("/api/calendar");
  const json = (await res.json()) as {
    success: boolean;
    data: CalendarEvent[];
  };
  if (!res.ok || !json.success) throw new Error("Failed to load calendar");
  return json.data;
}

function toDayKey(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

function parseDay(iso: string): Date {
  return parse(iso, "yyyy-MM-dd", new Date());
}

function formatTimeLabel(time?: string): string {
  if (!time) return "All day";
  if (time in TIME_SLOT_LABELS) {
    return TIME_SLOT_LABELS[time as keyof typeof TIME_SLOT_LABELS];
  }
  const [h, m] = time.split(":").map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return time;
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 || 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
}

function statusBadgeVariant(
  status: CalendarEventStatus,
): "success" | "warning" | "secondary" | "muted" | "destructive" {
  switch (status) {
    case "confirmed":
    case "completed":
      return "success";
    case "pending":
      return "secondary";
    case "at-risk":
      return "warning";
    case "in-transit":
      return "muted";
    default:
      return "muted";
  }
}

function statusLabel(status: CalendarEventStatus): string {
  switch (status) {
    case "at-risk":
      return "At risk";
    case "in-transit":
      return "In transit";
    default:
      return status.charAt(0).toUpperCase() + status.slice(1);
  }
}

function MeetingModeIcon({
  mode,
}: {
  mode?: CalendarEvent["meetingMode"];
}) {
  if (mode === "phone") return <Phone className="size-3.5 shrink-0" />;
  if (mode === "in-person") return <Users className="size-3.5 shrink-0" />;
  return <Video className="size-3.5 shrink-0" />;
}

function EventCard({ event }: { event: CalendarEvent }) {
  const isAppointment = event.kind === "appointment";
  const isShipment = event.kind === "shipment-eta";

  return (
    <article className="rounded-lg border border-border bg-card p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={kindBadgeVariant(event.kind)}>
              {KIND_LABELS[event.kind]}
            </Badge>
            <Badge variant={statusBadgeVariant(event.status)}>
              {statusLabel(event.status)}
            </Badge>
          </div>
          <h3 className="font-display text-base font-semibold leading-snug">
            {event.title}
          </h3>
        </div>
        <p className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
          <Clock className="size-3.5" />
          {formatTimeLabel(event.startTime)}
          {event.endTime ? ` – ${formatTimeLabel(event.endTime)}` : null}
        </p>
      </div>

      <dl className="mt-3 space-y-1.5 text-sm text-muted-foreground">
        {event.company ? (
          <div className="flex items-center gap-2">
            <Building2 className="size-3.5 shrink-0" />
            <dt className="sr-only">Company</dt>
            <dd>{event.company}</dd>
          </div>
        ) : null}
        {isAppointment && event.appointmentType ? (
          <div className="flex items-center gap-2">
            <Users className="size-3.5 shrink-0" />
            <dt className="sr-only">Type</dt>
            <dd>{APPOINTMENT_TYPE_LABELS[event.appointmentType]}</dd>
          </div>
        ) : null}
        {isAppointment && event.meetingMode ? (
          <div className="flex items-center gap-2">
            <MeetingModeIcon mode={event.meetingMode} />
            <dt className="sr-only">Mode</dt>
            <dd>{MEETING_MODE_LABELS[event.meetingMode]}</dd>
          </div>
        ) : null}
        {isShipment && event.relatedId ? (
          <div className="flex items-center gap-2">
            <Package className="size-3.5 shrink-0" />
            <dt className="sr-only">Shipment</dt>
            <dd>{event.relatedId}</dd>
          </div>
        ) : null}
        {event.location ? (
          <div className="flex items-center gap-2">
            <MapPin className="size-3.5 shrink-0" />
            <dt className="sr-only">Location</dt>
            <dd>{event.location}</dd>
          </div>
        ) : null}
      </dl>

      {event.notes ? (
        <p className="mt-3 border-t border-border pt-3 text-sm text-foreground/80">
          {event.notes}
        </p>
      ) : null}

      {event.relatedId ? (
        <p className="mt-2 text-xs text-muted-foreground">
          Ref: {event.relatedId}
        </p>
      ) : null}
    </article>
  );
}

const FILTERS: { id: FilterKind; label: string }[] = [
  { id: "all", label: "All" },
  { id: "appointment", label: "Appointments" },
  { id: "shipment-eta", label: "Shipments" },
];

export function CalendarPanel() {
  const [selectedDate, setSelectedDate] = useState<Date>(() => new Date());
  const [filter, setFilter] = useState<FilterKind>("all");
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["calendar"],
    queryFn: fetchCalendar,
  });

  const filtered = useMemo(() => {
    if (!data) return [];
    if (filter === "all") return data;
    return data.filter((e) => e.kind === filter);
  }, [data, filter]);

  const eventDays = useMemo(
    () => filtered.map((e) => parseDay(e.date)),
    [filtered],
  );

  const selectedKey = toDayKey(selectedDate);
  const dayEvents = useMemo(
    () =>
      filtered
        .filter((e) => e.date === selectedKey)
        .sort((a, b) => (a.startTime ?? "").localeCompare(b.startTime ?? "")),
    [filtered, selectedKey],
  );

  const upcoming = useMemo(() => {
    const today = toDayKey(new Date());
    return filtered.filter((e) => e.date >= today).slice(0, 6);
  }, [filtered]);

  const counts = useMemo(() => {
    if (!data) {
      return { all: 0, appointment: 0, "shipment-eta": 0 };
    }
    return {
      all: data.length,
      appointment: data.filter((e) => e.kind === "appointment").length,
      "shipment-eta": data.filter((e) => e.kind === "shipment-eta").length,
    };
  }, [data]);

  if (isLoading) {
    return (
      <div className="flex min-h-[30vh] items-center justify-center">
        <Spinner label="Loading calendar" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <StateAlert
        variant="error"
        title="Calendar unavailable"
        onRetry={() => void refetch()}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold">Calendar</h2>
          <p className="text-sm text-muted-foreground">
            Appointments and shipment ETA windows
          </p>
        </div>
        <div
          className="inline-flex flex-wrap rounded-lg border border-border bg-card p-1"
          role="tablist"
          aria-label="Filter calendar events"
        >
          {FILTERS.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={filter === item.id}
              onClick={() => setFilter(item.id)}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                filter === item.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {item.label}
              <span className="ml-1.5 tabular-nums opacity-70">
                {counts[item.id]}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <div className="rounded-lg border border-border bg-card p-4 shadow-sm sm:p-6">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => {
              if (date) setSelectedDate(date);
            }}
            modifiers={{ hasEvent: eventDays }}
            modifiersClassNames={{
              hasEvent:
                "[&>button]:relative [&>button]:after:absolute [&>button]:after:bottom-1 [&>button]:after:left-1/2 [&>button]:after:size-1 [&>button]:after:-translate-x-1/2 [&>button]:after:rounded-full [&>button]:after:bg-accent",
            }}
            className="mx-auto w-full max-w-sm"
            classNames={{
              month_grid: "w-full border-collapse",
              weekday:
                "w-full flex-1 text-[0.7rem] font-semibold tracking-wide text-muted-foreground uppercase",
              week: "mt-1 flex w-full",
              day: "relative flex-1 p-0 text-center text-sm",
            }}
          />
          <div className="mt-4 flex flex-wrap gap-4 border-t border-border pt-4 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-accent" />
              Has events
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="size-2 rounded-sm bg-accent/80" />
              Selected day
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="font-display text-lg font-semibold">
              {format(selectedDate, "EEEE, d MMMM yyyy")}
            </h3>
            <p className="text-sm text-muted-foreground">
              {dayEvents.length === 0
                ? "No events on this day"
                : `${dayEvents.length} event${dayEvents.length === 1 ? "" : "s"}`}
            </p>
          </div>

          {dayEvents.length === 0 ? (
            <StateAlert
              variant="info"
              title="Nothing scheduled"
              description="Pick another day with a marker, or switch the filter above."
            />
          ) : (
            <div className="space-y-3">
              {dayEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>
      </div>

      <section className="space-y-3">
        <div>
          <h3 className="font-display text-lg font-semibold">Upcoming</h3>
          <p className="text-sm text-muted-foreground">
            Next appointments and ETA windows
          </p>
        </div>
        {upcoming.length === 0 ? (
          <StateAlert
            variant="info"
            title="No upcoming events"
            description="There are no future items for the current filter."
          />
        ) : (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {upcoming.map((event) => (
              <button
                key={event.id}
                type="button"
                onClick={() => setSelectedDate(parseDay(event.date))}
                className="rounded-lg border border-border bg-card p-4 text-left shadow-sm transition-colors hover:border-accent/40 hover:bg-muted/30"
              >
                <div className="flex items-center justify-between gap-2">
                  <Badge variant={kindBadgeVariant(event.kind)}>
                    {KIND_LABELS[event.kind]}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {format(parseDay(event.date), "d MMM")} ·{" "}
                    {formatTimeLabel(event.startTime)}
                  </span>
                </div>
                <p className="mt-2 font-medium leading-snug">{event.title}</p>
                {event.company ? (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {event.company}
                  </p>
                ) : null}
              </button>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
