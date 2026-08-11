"use client";

import { format, parse } from "date-fns";
import { CalendarDays, Clock } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import {
  TIME_SLOT_LABELS,
  TIME_SLOTS,
  type PreferredTime,
} from "@/features/appointment/schemas";

type AppointmentSchedulePickerProps = {
  selectedDate: string;
  selectedTime?: PreferredTime;
  onDateChange: (isoDate: string) => void;
  onTimeChange: (time: PreferredTime) => void;
  dateError?: string;
  timeError?: string;
};

function toDate(isoDate: string): Date | undefined {
  if (!isoDate) return undefined;
  const parsed = parse(isoDate, "yyyy-MM-dd", new Date());
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
}

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export function AppointmentSchedulePicker({
  selectedDate,
  selectedTime,
  onDateChange,
  onTimeChange,
  dateError,
  timeError,
}: AppointmentSchedulePickerProps) {
  const selected = toDate(selectedDate);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="flex flex-col overflow-hidden border border-border bg-card shadow-sm">
        <div className="flex items-start gap-3 border-b border-border/80 bg-surface/60 px-4 py-4">
          <span className="flex size-9 shrink-0 items-center justify-center bg-primary text-primary-foreground">
            <CalendarDays className="size-4" aria-hidden />
          </span>
          <div className="space-y-0.5">
            <p className="text-sm font-semibold text-foreground">Pick a date</p>
            <p className="text-xs text-muted-foreground">Weekdays only · IST</p>
          </div>
        </div>
        <div className="flex flex-1 justify-center px-2 py-4 sm:px-3">
          <Calendar
            mode="single"
            selected={selected}
            onSelect={(day) => {
              if (!day) return;
              onDateChange(format(day, "yyyy-MM-dd"));
            }}
            disabled={[
              { before: startOfToday() },
              { dayOfWeek: [0, 6] },
            ]}
            fromMonth={startOfToday()}
            toMonth={
              new Date(
                startOfToday().getFullYear(),
                startOfToday().getMonth() + 3,
                1,
              )
            }
            className="rounded-none"
          />
        </div>
        {dateError ? (
          <p
            id="preferredDate-error"
            className="border-t border-border/80 bg-destructive/5 px-4 py-3 text-sm font-medium text-destructive"
            role="alert"
          >
            {dateError}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col overflow-hidden border border-border bg-card shadow-sm">
        <div className="flex items-start gap-3 border-b border-border/80 bg-surface/60 px-4 py-4">
          <span className="flex size-9 shrink-0 items-center justify-center bg-accent text-accent-foreground">
            <Clock className="size-4" aria-hidden />
          </span>
          <div className="space-y-0.5">
            <p className="text-sm font-semibold text-foreground">Pick a time</p>
            <p className="text-xs text-muted-foreground">
              {selected
                ? format(selected, "EEE, d MMM yyyy")
                : "Select a date first"}
            </p>
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-3 p-4">
          <div className="grid grid-cols-2 gap-2.5">
            {TIME_SLOTS.map((slot) => {
              const isSelected = selectedTime === slot;
              return (
                <button
                  key={slot}
                  type="button"
                  disabled={!selectedDate}
                  onClick={() => onTimeChange(slot)}
                  className={cn(
                    "flex min-h-11 items-center justify-center gap-2 border px-3 py-2.5 text-sm font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-35",
                    isSelected
                      ? "border-accent bg-accent text-accent-foreground shadow-[0_4px_14px_-4px_hsl(var(--accent)/0.55)]"
                      : "border-border bg-background hover:border-primary/25 hover:bg-surface/80",
                  )}
                  aria-pressed={isSelected}
                >
                  <Clock
                    className={cn(
                      "size-3.5",
                      isSelected ? "opacity-90" : "opacity-50",
                    )}
                    aria-hidden
                  />
                  {TIME_SLOT_LABELS[slot]}
                </button>
              );
            })}
          </div>
          {timeError ? (
            <p
              id="preferredTime-error"
              className="text-sm font-medium text-destructive"
              role="alert"
            >
              {timeError}
            </p>
          ) : null}
        </div>
        <div
          className={cn(
            "mt-auto border-t px-4 py-4 text-sm transition-colors",
            selectedDate && selectedTime
              ? "border-accent/30 bg-accent/5"
              : "border-border/80 bg-surface/40 text-muted-foreground",
          )}
        >
          {selectedDate && selectedTime ? (
            <p className="text-foreground">
              <span className="text-[10px] font-bold tracking-[0.16em] text-accent uppercase">
                Locked in ·{" "}
              </span>
              {format(selected!, "EEE, d MMM")} ·{" "}
              {TIME_SLOT_LABELS[selectedTime]} IST
            </p>
          ) : (
            <p>Choose a date and time slot to continue.</p>
          )}
        </div>
      </div>
    </div>
  );
}
