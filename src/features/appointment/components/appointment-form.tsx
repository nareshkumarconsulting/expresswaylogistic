"use client";

import { useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CalendarCheck,
  Check,
  Clock,
  MapPin,
  Phone,
  Sparkles,
  Video,
} from "lucide-react";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { FormField } from "@/components/molecules/form-field";
import { StateAlert } from "@/components/molecules/state-alert";
import { cn } from "@/lib/utils";
import { AppointmentSchedulePicker } from "@/features/appointment/components/appointment-schedule-picker";
import { VoiceNotesField } from "@/features/appointment/components/voice-notes-field";
import {
  appointmentFormSchema,
  APPOINTMENT_TYPE_LABELS,
  formatDisplayDate,
  MEETING_MODE_LABELS,
  MEETING_MODES,
  MEETING_TYPES,
  TIME_SLOT_LABELS,
  type AppointmentFormValues,
  type AppointmentType,
  type MeetingMode,
  type MeetingTypeOption,
} from "@/features/appointment/schemas";

const STEPS = [
  { id: "purpose", label: "Purpose", hint: "What brings you in?" },
  { id: "when", label: "Schedule", hint: "Pick your slot" },
  { id: "contact", label: "Details", hint: "How we reach you" },
  { id: "review", label: "Confirm", hint: "One last look" },
] as const;

type StepIndex = 0 | 1 | 2 | 3;

const STEP_FIELDS: (keyof AppointmentFormValues)[][] = [
  ["appointmentType"],
  ["preferredDate", "preferredTime", "meetingMode"],
  ["name", "company", "email", "phone", "notes"],
  [],
];

const MODE_ICONS = {
  video: Video,
  phone: Phone,
  "in-person": MapPin,
} as const;

const STEP_COPY: Record<StepIndex, { title: string; description: string }> = {
  0: {
    title: "What would you like to discuss?",
    description:
      "Each session is led by a specialist — pick the lane that matches your freight or warehouse goal.",
  },
  1: {
    title: "When works best for you?",
    description:
      "Weekday slots in IST, aligned with our Noida operations team.",
  },
  2: {
    title: "Your contact details",
    description:
      "We'll send confirmation and visitor or dial-in instructions here.",
  },
  3: {
    title: "Ready to send the request?",
    description: "Review your booking manifest below, then confirm with ops.",
  },
};

function StepPanel({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-6">
      <header className="space-y-2">
        <p className="text-xs font-semibold tracking-[0.18em] text-accent uppercase">
          Step details
        </p>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground md:text-[1.75rem]">
          {title}
        </h2>
        <p className="max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
          {description}
        </p>
      </header>
      {children}
    </div>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="text-sm font-medium text-destructive" role="alert">
      {message}
    </p>
  );
}

function BookingManifest({
  values,
  step,
  selectedType,
}: {
  values: AppointmentFormValues;
  step: StepIndex;
  selectedType?: MeetingTypeOption;
}) {
  const progress = ((step + 1) / STEPS.length) * 100;
  const hasSchedule = Boolean(values.preferredDate && values.preferredTime);
  const hasContact = Boolean(values.name && values.email);

  return (
    <div className="relative overflow-hidden border border-primary/15 bg-gradient-to-br from-primary via-primary to-brand text-primary-foreground shadow-lg">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        aria-hidden
        style={{
          backgroundImage:
            "repeating-linear-gradient(-45deg, hsl(0 0% 100%) 0, hsl(0 0% 100%) 1px, transparent 1px, transparent 8px)",
        }}
      />
      <div className="relative border-b border-white/10 px-5 py-4">
        <div className="mb-3 flex items-center justify-between gap-2">
          <p className="text-[10px] font-bold tracking-[0.22em] text-accent uppercase">
            Live manifest
          </p>
          <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-white/80 uppercase">
            EW-{String(step + 1).padStart(2, "0")}
          </span>
        </div>
        <div className="h-1 overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="h-full bg-accent"
            initial={false}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>
      </div>

      <div className="relative space-y-4 px-5 py-5 text-sm">
        <div className="space-y-1">
          <p className="text-[10px] font-semibold tracking-[0.16em] text-white/50 uppercase">
            Meeting type
          </p>
          <p className="font-semibold text-white">
            {selectedType?.title ?? "Not selected yet"}
          </p>
          {selectedType ? (
            <p className="text-xs text-white/65">
              {selectedType.duration} · {selectedType.formatHint}
            </p>
          ) : null}
        </div>

        <div className="space-y-1">
          <p className="text-[10px] font-semibold tracking-[0.16em] text-white/50 uppercase">
            Schedule
          </p>
          <p className={cn("font-medium", hasSchedule ? "text-white" : "text-white/45")}>
            {hasSchedule
              ? `${formatDisplayDate(values.preferredDate)} · ${TIME_SLOT_LABELS[values.preferredTime!]} IST`
              : "Date & time pending"}
          </p>
          {values.meetingMode ? (
            <p className="text-xs text-white/65">
              {MEETING_MODE_LABELS[values.meetingMode]}
            </p>
          ) : null}
        </div>

        <div className="space-y-1">
          <p className="text-[10px] font-semibold tracking-[0.16em] text-white/50 uppercase">
            Contact
          </p>
          <p className={cn("font-medium", hasContact ? "text-white" : "text-white/45")}>
            {values.name || "Name pending"}
          </p>
          {values.company ? (
            <p className="text-xs text-white/65">{values.company}</p>
          ) : null}
        </div>

        {selectedType && step === 0 ? (
          <div className="border-t border-white/10 pt-4">
            <p className="mb-2 text-[10px] font-semibold tracking-[0.16em] text-accent uppercase">
              You&apos;ll cover
            </p>
            <ul className="space-y-1.5">
              {selectedType.includes.slice(0, 3).map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-xs text-white/75"
                >
                  <Check className="mt-0.5 size-3 shrink-0 text-accent" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>

      <div className="relative flex items-center justify-between border-t border-white/10 px-5 py-3 text-[10px] font-semibold tracking-[0.14em] text-white/40 uppercase">
        <span>ExpressWay Logistic</span>
        <span>Noida · IST</span>
      </div>
    </div>
  );
}

function MeetingTypeCard({
  type,
  selected,
  onSelect,
}: {
  type: MeetingTypeOption;
  selected: boolean;
  onSelect: () => void;
}) {
  const Icon = type.icon;
  const reduceMotion = useReducedMotion();

  return (
    <motion.button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      whileHover={reduceMotion ? undefined : { y: -2 }}
      whileTap={reduceMotion ? undefined : { scale: 0.99 }}
      className={cn(
        "group relative flex flex-col gap-4 overflow-hidden border p-5 text-left transition-colors duration-300",
        selected
          ? "border-accent bg-accent/[0.06] shadow-[0_0_0_1px_hsl(var(--accent)),0_12px_40px_-12px_hsl(var(--accent)/0.35)]"
          : "border-border bg-card hover:border-primary/25 hover:shadow-md",
      )}
    >
      <div
        className={cn(
          "pointer-events-none absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300",
          type.accent,
          selected ? "opacity-100" : "group-hover:opacity-60",
        )}
        aria-hidden
      />

      <div className="relative flex items-start justify-between gap-3">
        <span
          className={cn(
            "flex size-11 shrink-0 items-center justify-center transition-colors",
            selected
              ? "bg-accent text-accent-foreground shadow-sm"
              : "bg-primary text-primary-foreground",
          )}
        >
          <Icon className="size-5" aria-hidden />
        </span>
        <div className="flex shrink-0 items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-background/80 px-2.5 py-1 text-[10px] font-semibold tracking-wide text-muted-foreground uppercase backdrop-blur-sm">
            <Clock className="size-3" aria-hidden />
            {type.duration}
          </span>
          {selected ? (
            <span className="flex size-6 items-center justify-center bg-accent text-accent-foreground">
              <Check className="size-3.5" aria-hidden />
            </span>
          ) : null}
        </div>
      </div>

      <div className="relative space-y-1.5">
        <p className="text-base font-semibold text-foreground">{type.title}</p>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {type.description}
        </p>
      </div>

      <p className="relative text-[10px] font-bold tracking-[0.14em] text-accent uppercase">
        {type.formatHint}
      </p>

      <AnimatePresence initial={false}>
        {selected ? (
          <motion.ul
            initial={reduceMotion ? false : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={reduceMotion ? undefined : { opacity: 0, height: 0 }}
            className="relative space-y-1.5 overflow-hidden border-t border-accent/20 pt-3"
          >
            {type.includes.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2 text-xs text-muted-foreground"
              >
                <Check className="mt-0.5 size-3 shrink-0 text-accent" aria-hidden />
                {item}
              </li>
            ))}
          </motion.ul>
        ) : null}
      </AnimatePresence>
    </motion.button>
  );
}

export function AppointmentForm() {
  const reduceMotion = useReducedMotion();
  const [step, setStep] = useState<StepIndex>(0);
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [referenceId, setReferenceId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    trigger,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: {
      name: "",
      company: "",
      email: "",
      phone: "",
      appointmentType: undefined,
      preferredDate: "",
      preferredTime: undefined,
      meetingMode: "video",
      notes: "",
    },
    mode: "onChange",
  });

  const values = watch();
  const selectedType = MEETING_TYPES.find(
    (t) => t.id === values.appointmentType,
  );
  const copy = STEP_COPY[step];

  const selectAppointmentType = (id: AppointmentType) => {
    setValue("appointmentType", id, {
      shouldValidate: true,
      shouldDirty: true,
    });
    if (id === "warehouse-visit") {
      setValue("meetingMode", "in-person", {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  };

  const goNext = async () => {
    const fields = STEP_FIELDS[step];
    const ok = fields.length === 0 ? true : await trigger(fields);
    if (!ok) return;
    setStep((s) => Math.min(s + 1, 3) as StepIndex);
  };

  const goBack = () => {
    setStatus("idle");
    setErrorMessage(null);
    setStep((s) => Math.max(s - 1, 0) as StepIndex);
  };

  const onSubmit = async (formValues: AppointmentFormValues) => {
    setStatus("loading");
    setErrorMessage(null);
    setReferenceId(null);
    try {
      const res = await fetch("/api/appointment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formValues),
      });
      const json = (await res.json()) as {
        success: boolean;
        error?: string;
        data?: { referenceId?: string };
      };
      if (!res.ok || !json.success) {
        throw new Error(json.error ?? "Unable to book appointment");
      }
      setReferenceId(json.data?.referenceId ?? null);
      setStatus("success");
      reset({
        name: "",
        company: "",
        email: "",
        phone: "",
        appointmentType: undefined,
        preferredDate: "",
        preferredTime: undefined,
        meetingMode: "video",
        notes: "",
      });
      setStep(0);
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error ? err.message : "Something went wrong",
      );
    }
  };

  const stepMotion = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, x: 16 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -16 },
        transition: { duration: 0.28, ease: "easeOut" as const },
      };

  if (status === "success") {
    return (
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-6 py-6 text-center md:py-10"
      >
        <div className="relative">
          <div className="absolute inset-0 scale-150 rounded-full bg-accent/20 blur-2xl" aria-hidden />
          <div className="relative flex size-16 items-center justify-center bg-accent text-accent-foreground shadow-[var(--ds-shadow-accent-glow)]">
            <Sparkles className="size-7" aria-hidden />
          </div>
        </div>
        <div className="max-w-md space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            Request received
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
            {referenceId
              ? `Reference ${referenceId}. Our ops team will confirm your IST slot by email within one business day.`
              : "Our ops team will confirm your IST slot by email within one business day."}
          </p>
        </div>
        <div className="flex w-full max-w-sm flex-col gap-3 sm:flex-row">
          <Button
            type="button"
            rounded="none"
            className="h-11 flex-1"
            onClick={() => {
              setStatus("idle");
              setReferenceId(null);
            }}
          >
            Book another
          </Button>
          <Button
            type="button"
            variant="outline"
            rounded="none"
            className="h-11 flex-1"
            asChild
          >
            <a href="/quote">Get a freight quote</a>
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_17.5rem] xl:grid-cols-[minmax(0,1fr)_19rem]">
      <form
        className="flex min-w-0 flex-col"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        aria-busy={status === "loading"}
      >
        <div className="border-b border-border/80 pb-6">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold tracking-[0.18em] text-accent uppercase">
                Booking flow
              </p>
              <p className="mt-1 text-lg font-semibold text-foreground">
                Step {step + 1}{" "}
                <span className="font-normal text-muted-foreground">
                  — {STEPS[step].hint}
                </span>
              </p>
            </div>
            <p className="text-xs text-muted-foreground">IST · Noida</p>
          </div>

          <ol
            className="grid grid-cols-4 gap-1 sm:gap-2"
            aria-label="Booking progress"
          >
            {STEPS.map((s, index) => {
              const done = index < step;
              const current = index === step;
              return (
                <li key={s.id} className="min-w-0">
                  <div className="mb-2 flex items-center gap-1">
                    {index > 0 ? (
                      <span
                        className={cn(
                          "hidden h-px flex-1 sm:block",
                          done || current ? "bg-accent" : "bg-border",
                        )}
                        aria-hidden
                      />
                    ) : null}
                    <span
                      className={cn(
                        "relative flex size-8 shrink-0 items-center justify-center text-xs font-bold transition-all",
                        current
                          ? "bg-accent text-accent-foreground shadow-[0_0_0_4px_hsl(var(--accent)/0.15)]"
                          : done
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground",
                      )}
                    >
                      {done ? <Check className="size-3.5" /> : index + 1}
                    </span>
                    {index < STEPS.length - 1 ? (
                      <span
                        className={cn(
                          "hidden h-px flex-1 sm:block",
                          done ? "bg-accent" : "bg-border",
                        )}
                        aria-hidden
                      />
                    ) : null}
                  </div>
                  <span
                    className={cn(
                      "block truncate text-[10px] font-semibold tracking-wide uppercase sm:text-[11px]",
                      current
                        ? "text-foreground"
                        : done
                          ? "text-muted-foreground"
                          : "text-muted-foreground/45",
                    )}
                  >
                    {s.label}
                  </span>
                </li>
              );
            })}
          </ol>
        </div>

        <div className="py-6">
          {status === "error" ? (
            <div className="mb-6">
              <StateAlert
                variant="error"
                title="Booking failed"
                description={errorMessage ?? undefined}
                onRetry={() => setStatus("idle")}
              />
            </div>
          ) : null}

          <AnimatePresence mode="wait" initial={false}>
            {step === 0 ? (
              <motion.div key="purpose" {...stepMotion}>
                <StepPanel title={copy.title} description={copy.description}>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {MEETING_TYPES.map((type) => (
                      <MeetingTypeCard
                        key={type.id}
                        type={type}
                        selected={values.appointmentType === type.id}
                        onSelect={() => selectAppointmentType(type.id)}
                      />
                    ))}
                  </div>
                  <FieldError message={errors.appointmentType?.message} />
                </StepPanel>
              </motion.div>
            ) : null}

            {step === 1 ? (
              <motion.div key="when" {...stepMotion}>
                <StepPanel title={copy.title} description={copy.description}>
                  <AppointmentSchedulePicker
                    selectedDate={values.preferredDate}
                    selectedTime={values.preferredTime}
                    onDateChange={(isoDate) =>
                      setValue("preferredDate", isoDate, {
                        shouldValidate: true,
                        shouldDirty: true,
                      })
                    }
                    onTimeChange={(time) =>
                      setValue("preferredTime", time, {
                        shouldValidate: true,
                        shouldDirty: true,
                      })
                    }
                    dateError={errors.preferredDate?.message}
                    timeError={errors.preferredTime?.message}
                  />

                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-foreground">
                      How would you like to meet?
                    </p>
                    <div className="grid gap-3 sm:grid-cols-3">
                      {MEETING_MODES.map((mode) => {
                        const selected = values.meetingMode === mode;
                        const Icon = MODE_ICONS[mode];
                        return (
                          <button
                            key={mode}
                            type="button"
                            onClick={() =>
                              setValue("meetingMode", mode as MeetingMode, {
                                shouldValidate: true,
                                shouldDirty: true,
                              })
                            }
                            className={cn(
                              "group flex min-h-[5.25rem] flex-col items-center justify-center gap-2.5 border px-3 py-4 text-center transition-all duration-300",
                              selected
                                ? "border-accent bg-accent/10 shadow-[0_0_0_1px_hsl(var(--accent))]"
                                : "border-border bg-card hover:border-primary/20 hover:bg-surface/80",
                            )}
                            aria-pressed={selected}
                          >
                            <span
                              className={cn(
                                "flex size-10 items-center justify-center transition-colors",
                                selected
                                  ? "bg-accent text-accent-foreground"
                                  : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary",
                              )}
                            >
                              <Icon className="size-4" aria-hidden />
                            </span>
                            <span className="text-sm font-medium leading-snug">
                              {MEETING_MODE_LABELS[mode]}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                    <FieldError message={errors.meetingMode?.message} />
                  </div>
                </StepPanel>
              </motion.div>
            ) : null}

            {step === 2 ? (
              <motion.div key="contact" {...stepMotion}>
                <StepPanel title={copy.title} description={copy.description}>
                  <div className="rounded-none border border-border bg-surface/50 p-4 md:p-5">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <FormField
                        label="Name"
                        htmlFor="name"
                        required
                        error={errors.name?.message}
                      >
                        <Input
                          {...register("name")}
                          placeholder="John Doe"
                          autoComplete="name"
                          className="h-11 border-border/80 bg-background"
                        />
                      </FormField>
                      <FormField
                        label="Company"
                        htmlFor="company"
                        required
                        error={errors.company?.message}
                      >
                        <Input
                          {...register("company")}
                          placeholder="Acme Industries"
                          className="h-11 border-border/80 bg-background"
                        />
                      </FormField>
                      <FormField
                        label="Email"
                        htmlFor="email"
                        required
                        error={errors.email?.message}
                      >
                        <Input
                          type="email"
                          {...register("email")}
                          placeholder="you@company.com"
                          autoComplete="email"
                          className="h-11 border-border/80 bg-background"
                        />
                      </FormField>
                      <FormField
                        label="Phone"
                        htmlFor="phone"
                        required
                        error={errors.phone?.message}
                      >
                        <Input
                          type="tel"
                          {...register("phone")}
                          placeholder="+91 98736 93160"
                          autoComplete="tel"
                          className="h-11 border-border/80 bg-background"
                        />
                      </FormField>
                    </div>
                  </div>

                  <VoiceNotesField
                    id="notes"
                    value={values.notes ?? ""}
                    onChange={(next) =>
                      setValue("notes", next, {
                        shouldDirty: true,
                        shouldValidate: true,
                      })
                    }
                    error={errors.notes?.message}
                  />
                </StepPanel>
              </motion.div>
            ) : null}

            {step === 3 ? (
              <motion.div key="review" {...stepMotion}>
                <StepPanel title={copy.title} description={copy.description}>
                  <div className="overflow-hidden border border-primary/15 bg-gradient-to-br from-primary/5 via-background to-accent/5 shadow-sm">
                    <div className="flex items-center justify-between border-b border-border/80 bg-primary px-4 py-3 text-primary-foreground md:px-5">
                      <div>
                        <p className="text-[10px] font-bold tracking-[0.2em] text-accent uppercase">
                          Booking manifest
                        </p>
                        <p className="text-sm font-semibold">ExpressWay Logistic</p>
                      </div>
                      <CalendarCheck className="size-5 text-accent" aria-hidden />
                    </div>
                    <dl>
                      {(
                        [
                          [
                            "Meeting",
                            selectedType?.title ??
                              APPOINTMENT_TYPE_LABELS[
                                getValues("appointmentType") as AppointmentType
                              ],
                          ],
                          [
                            "Duration",
                            selectedType
                              ? `${selectedType.duration} · ${selectedType.formatHint}`
                              : "—",
                          ],
                          [
                            "Date & time",
                            values.preferredDate && values.preferredTime
                              ? `${formatDisplayDate(values.preferredDate)} · ${TIME_SLOT_LABELS[values.preferredTime]} IST`
                              : "—",
                          ],
                          [
                            "Format",
                            values.meetingMode
                              ? MEETING_MODE_LABELS[values.meetingMode]
                              : "—",
                          ],
                          ["Name", values.name || "—"],
                          ["Company", values.company || "—"],
                          ["Email", values.email || "—"],
                          ["Phone", values.phone || "—"],
                          ["Notes", values.notes?.trim() || "—"],
                        ] as const
                      ).map(([label, value], index) => (
                        <div
                          key={label}
                          className={cn(
                            "grid gap-1 px-4 py-3.5 md:grid-cols-[9rem_1fr] md:gap-6 md:px-5",
                            index !== 0 && "border-t border-border/70",
                            index % 2 === 0 ? "bg-background/60" : "bg-surface/40",
                          )}
                        >
                          <dt className="text-[10px] font-bold tracking-[0.16em] text-muted-foreground uppercase">
                            {label}
                          </dt>
                          <dd className="text-sm font-medium text-foreground">
                            {value}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </StepPanel>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-border/80 pt-6 sm:flex-row sm:items-center sm:justify-between">
          {step > 0 ? (
            <Button
              type="button"
              variant="outline"
              rounded="none"
              className="h-11"
              onClick={goBack}
              disabled={status === "loading"}
            >
              <ArrowLeft className="size-4" />
              Back
            </Button>
          ) : (
            <span className="hidden sm:block sm:min-w-24" />
          )}

          {step < 3 ? (
            <Button
              type="button"
              rounded="none"
              className="h-11 sm:min-w-44"
              onClick={goNext}
            >
              Continue
              <ArrowRight className="size-4" />
            </Button>
          ) : (
            <Button
              type="submit"
              rounded="none"
              className="h-11 sm:min-w-52"
              loading={status === "loading"}
            >
              <CalendarCheck className="size-4" />
              Request appointment
            </Button>
          )}
        </div>
      </form>

      <aside className="hidden lg:block">
        <div className="sticky top-28">
          <BookingManifest
            values={values}
            step={step}
            selectedType={selectedType}
          />
        </div>
      </aside>
    </div>
  );
}
