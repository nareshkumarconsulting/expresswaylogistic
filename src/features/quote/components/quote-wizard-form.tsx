"use client";

import { useRef, useState, type ReactNode } from "react";
import { useFieldArray, useForm, Controller, useWatch } from "react-hook-form";
import type { FieldErrors, Path } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Container,
  MapPin,
  Package,
  Plane,
  Plus,
  Send,
  Ship,
  Sparkles,
  Trash2,
  Truck,
} from "lucide-react";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { Textarea } from "@/components/atoms/textarea";
import { Label } from "@/components/atoms/label";
import { FormField } from "@/components/molecules/form-field";
import { StateAlert } from "@/components/molecules/state-alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { QUOTE_RESPONSE_STATEMENT } from "@/constants/entity";
import {
  collectReactHookFormErrors,
  firstErrorFieldPath,
  formatZodFlattenErrors,
  getQuoteWizardStepForField,
  scheduleScrollToFormField,
  scheduleScrollToFormTop,
  type ZodFlattenedError,
} from "@/lib/form-errors";
import {
  createDefaultQuoteWizardValues,
  createEmptyCargoItem,
  DIMENSION_UNITS,
  DIMENSION_UNIT_LABELS,
  DIMENSION_UNIT_SHORT,
  formatCargoTotals,
  formatQuoteAddOns,
  INCOTERM_GROUPS,
  INCOTERM_HINTS,
  INCOTERM_LABELS,
  INSURANCE_COVERAGES,
  INSURANCE_COVERAGE_LABELS,
  PACKAGE_TYPES,
  PACKAGE_TYPE_LABELS,
  PACKING_SCOPES,
  PACKING_SCOPE_LABELS,
  PROJECT_CARGO_TYPES,
  PROJECT_CARGO_TYPE_LABELS,
  quoteWizardSchema,
  REFERRAL_SOURCES,
  REFERRAL_SOURCE_LABELS,
  TRANSPORT_MODE_ACCENTS,
  TRANSPORT_MODE_HINTS,
  TRANSPORT_MODES,
  TRANSPORT_MODE_LABELS,
  type QuoteWizardValues,
  type TransportMode,
  type Incoterm,
} from "@/features/quote/schemas";

const STEPS = [
  { id: "cargo", label: "Cargo", hint: "What are you shipping?" },
  { id: "route", label: "Route", hint: "Origin to destination" },
  { id: "services", label: "Services", hint: "Insurance · project · packing" },
  { id: "contact", label: "Contact", hint: "Who gets the quote?" },
] as const;

type StepIndex = 0 | 1 | 2 | 3;

const STEP_FIELDS: (keyof QuoteWizardValues)[][] = [
  ["cargoReadyDate", "transportMode", "cargoItems"],
  ["origin", "destination", "incoterm"],
  [
    "insurance",
    "insuranceCargoValueInr",
    "insuranceCoverage",
    "projectCargo",
    "projectCargoType",
    "projectRegistrationHelp",
    "projectNotes",
    "packingRequired",
    "packingScope",
    "fumigationRequired",
    "labelingBarcoding",
    "packingNotes",
    "customsBrokerage",
    "dangerousCargoNotes",
  ],
  [
    "existingCustomer",
    "firstName",
    "lastName",
    "company",
    "email",
    "country",
    "city",
    "address",
    "referralSource",
  ],
];

const MODE_ICONS = {
  air: Plane,
  lcl: Ship,
  fcl: Container,
} as const;

const STEP_COPY: Record<StepIndex, { title: string; description: string }> = {
  0: {
    title: "Tell us about your cargo",
    description:
      "Pick a transport mode and describe each line item — dimensions, weight, and commodity.",
  },
  1: {
    title: "Where is it moving?",
    description:
      "Origin and destination locations, Incoterms®, and whether you need pickup or final delivery.",
  },
  2: {
    title: "Insurance, project cargo & packing",
    description:
      "Tell us if you need cargo insurance, project handling, packing/fumigation, or customs support.",
  },
  3: {
    title: "Who should receive the quote?",
    description:
      "Business contact details so our freight desk can send tailored pricing.",
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

function QuoteManifest({
  values,
  step,
  totals,
}: {
  values: QuoteWizardValues;
  step: StepIndex;
  totals: { cbm: string; weightKg: string };
}) {
  const progress = ((step + 1) / STEPS.length) * 100;
  const hasRoute = Boolean(values.origin && values.destination);
  const hasContact = Boolean(values.firstName && values.email);
  const addOns = formatQuoteAddOns(values);

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
            Live quote sheet
          </p>
          <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-white/80 uppercase">
            QT-{String(step + 1).padStart(2, "0")}
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
            Mode
          </p>
          <p className="font-semibold text-white uppercase">
            {values.transportMode}{" "}
            <span className="font-normal text-white/65 normal-case">
              · {TRANSPORT_MODE_LABELS[values.transportMode]}
            </span>
          </p>
          {values.cargoReadyDate ? (
            <p className="text-xs text-white/65">
              Ready {values.cargoReadyDate}
            </p>
          ) : null}
        </div>

        <div className="space-y-1">
          <p className="text-[10px] font-semibold tracking-[0.16em] text-white/50 uppercase">
            Route
          </p>
          <p className={cn("font-medium", hasRoute ? "text-white" : "text-white/45")}>
            {hasRoute
              ? `${values.origin} → ${values.destination}`
              : "Route pending"}
          </p>
          {(values.originPickup || values.destinationDelivery) && hasRoute ? (
            <p className="text-xs text-white/65">
              {[
                values.originPickup && "Origin pickup",
                values.destinationDelivery && "Dest. delivery",
              ]
                .filter(Boolean)
                .join(" · ")}
            </p>
          ) : null}
          {values.incoterm ? (
            <p className="text-xs text-white/65">
              {values.incoterm} · {INCOTERM_LABELS[values.incoterm]}
            </p>
          ) : null}
        </div>

        <div className="space-y-1">
          <p className="text-[10px] font-semibold tracking-[0.16em] text-white/50 uppercase">
            Cargo
          </p>
          <p className="font-medium text-white">
            {totals.cbm} CBM · {totals.weightKg} KG
          </p>
          <p className="text-xs text-white/65">
            {values.cargoItems?.length ?? 0} line item(s)
          </p>
        </div>

        <div className="space-y-1">
          <p className="text-[10px] font-semibold tracking-[0.16em] text-white/50 uppercase">
            Contact
          </p>
          <p className={cn("font-medium", hasContact ? "text-white" : "text-white/45")}>
            {values.firstName
              ? `${values.firstName} ${values.lastName}`.trim()
              : "Contact pending"}
          </p>
          {values.company ? (
            <p className="text-xs text-white/65">{values.company}</p>
          ) : null}
        </div>

        {addOns.length > 0 ? (
          <div className="border-t border-white/10 pt-4">
            <p className="mb-2 text-[10px] font-semibold tracking-[0.16em] text-accent uppercase">
              Add-ons
            </p>
            <ul className="space-y-1.5">
              {addOns.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2 text-xs text-white/75"
                >
                  <Check className="size-3 shrink-0 text-accent" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>

      <div className="relative flex items-center justify-between border-t border-white/10 px-5 py-3 text-[10px] font-semibold tracking-[0.14em] text-white/40 uppercase">
        <span>ExpressWay Logistic</span>
        <span>Freight desk</span>
      </div>
    </div>
  );
}

function TransportModeCard({
  mode,
  selected,
  onSelect,
}: {
  mode: TransportMode;
  selected: boolean;
  onSelect: () => void;
}) {
  const Icon = MODE_ICONS[mode];
  const reduceMotion = useReducedMotion();

  return (
    <motion.button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      whileHover={reduceMotion ? undefined : { y: -2 }}
      whileTap={reduceMotion ? undefined : { scale: 0.99 }}
      className={cn(
        "group relative flex flex-col gap-3 overflow-hidden border p-5 text-left transition-colors duration-300",
        selected
          ? "border-accent bg-accent/[0.06] shadow-[0_0_0_1px_hsl(var(--accent)),0_12px_40px_-12px_hsl(var(--accent)/0.35)]"
          : "border-border bg-card hover:border-primary/25 hover:shadow-md",
      )}
    >
      <div
        className={cn(
          "pointer-events-none absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300",
          TRANSPORT_MODE_ACCENTS[mode],
          selected ? "opacity-100" : "group-hover:opacity-60",
        )}
        aria-hidden
      />
      <div className="relative flex items-start justify-between gap-2">
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
        <span
          className={cn(
            "inline-flex items-center gap-1 text-[10px] font-bold tracking-[0.14em] uppercase",
            selected
              ? "bg-accent px-1.5 py-0.5 text-accent-foreground"
              : "text-accent",
          )}
        >
          {selected ? (
            <Check className="size-3 shrink-0" aria-hidden />
          ) : null}
          {mode}
        </span>
      </div>
      <div className="relative space-y-1">
        <p className="text-sm font-semibold text-foreground">
          {TRANSPORT_MODE_LABELS[mode]}
        </p>
        <p className="text-xs leading-relaxed text-muted-foreground">
          {TRANSPORT_MODE_HINTS[mode]}
        </p>
      </div>
    </motion.button>
  );
}

function RouteConnector({
  origin,
  destination,
  originPickup,
  destinationDelivery,
}: {
  origin: string;
  destination: string;
  originPickup: boolean;
  destinationDelivery: boolean;
}) {
  const hasRoute = Boolean(origin || destination);

  return (
    <div className="relative overflow-hidden border border-border/80 bg-gradient-to-r from-surface/80 via-background to-surface/80 p-4 md:p-5">
      <div className="flex flex-col items-stretch gap-4 md:flex-row md:items-center">
        <div className="flex flex-1 items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center bg-primary text-primary-foreground">
            <MapPin className="size-4" aria-hidden />
          </span>
          <div className="min-w-0">
            <p className="text-[10px] font-bold tracking-[0.16em] text-muted-foreground uppercase">
              Origin
            </p>
            <p className="truncate font-semibold text-foreground">
              {origin || "—"}
            </p>
            {originPickup ? (
              <p className="mt-0.5 flex items-center gap-1 text-xs text-accent">
                <Truck className="size-3" aria-hidden />
                Pickup requested
              </p>
            ) : null}
          </div>
        </div>

        <div className="flex items-center justify-center px-2 md:flex-col">
          <div className="hidden h-px flex-1 bg-border md:block" aria-hidden />
          <span
            className={cn(
              "flex size-9 shrink-0 items-center justify-center rounded-full border text-xs font-bold",
              hasRoute
                ? "border-accent bg-accent/10 text-accent"
                : "border-border bg-muted text-muted-foreground",
            )}
          >
            →
          </span>
          <div className="hidden h-px flex-1 bg-border md:block" aria-hidden />
        </div>

        <div className="flex flex-1 items-start gap-3 md:justify-end md:text-right">
          <div className="min-w-0 md:order-1">
            <p className="text-[10px] font-bold tracking-[0.16em] text-muted-foreground uppercase">
              Destination
            </p>
            <p className="truncate font-semibold text-foreground">
              {destination || "—"}
            </p>
            {destinationDelivery ? (
              <p className="mt-0.5 flex items-center gap-1 text-xs text-accent md:justify-end">
                <Truck className="size-3" aria-hidden />
                Delivery requested
              </p>
            ) : null}
          </div>
          <span className="order-2 flex size-10 shrink-0 items-center justify-center bg-accent text-accent-foreground md:order-2">
            <MapPin className="size-4" aria-hidden />
          </span>
        </div>
      </div>
    </div>
  );
}

function ToggleField({
  id,
  label,
  description,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  description?: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label
      htmlFor={id}
      className={cn(
        "group flex cursor-pointer items-start gap-4 border p-4 transition-all duration-300",
        checked
          ? "border-accent bg-accent/[0.06] shadow-[0_0_0_1px_hsl(var(--accent))]"
          : "border-border bg-card hover:border-primary/20 hover:bg-surface/50",
      )}
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1 size-4 accent-accent"
      />
      <span className="flex-1">
        <span className="block text-sm font-semibold text-foreground">
          {label}
        </span>
        {description ? (
          <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
            {description}
          </span>
        ) : null}
      </span>
      {checked ? (
        <Check className="size-4 shrink-0 text-accent" aria-hidden />
      ) : null}
    </label>
  );
}

function YesNoField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <fieldset className="space-y-2.5">
      <legend className="text-sm font-medium text-foreground">{label}</legend>
      <div className="flex gap-2">
        {[
          { val: true, text: "Yes" },
          { val: false, text: "No" },
        ].map(({ val, text }) => (
          <button
            key={text}
            type="button"
            onClick={() => onChange(val)}
            className={cn(
              "h-10 min-w-[4.5rem] border px-4 text-sm font-semibold transition-all duration-200",
              value === val
                ? "border-accent bg-accent text-accent-foreground shadow-sm"
                : "border-border bg-background text-foreground hover:border-primary/25",
            )}
          >
            {text}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

function IncotermRadioGroup({
  value,
  onChange,
  error,
}: {
  value?: Incoterm;
  onChange: (term: Incoterm) => void;
  error?: string;
}) {
  return (
    <fieldset className="space-y-4">
      <legend className="text-sm font-semibold text-foreground">
        Incoterms® rule
      </legend>
      <p className="text-sm leading-relaxed text-muted-foreground">
        Select the trade term that defines cost and risk between buyer and
        seller. Only one rule applies per shipment.
      </p>
      {INCOTERM_GROUPS.map((group) => (
        <div key={group.id} className="space-y-3">
          <p className="text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
            {group.label}
          </p>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {group.terms.map((term) => {
              const selected = value === term;
              const hint = INCOTERM_HINTS[term];
              return (
                <label
                  key={term}
                  className={cn(
                    "flex cursor-pointer items-start gap-3 border p-3 transition-all duration-200",
                    selected
                      ? "border-accent bg-accent/[0.06] shadow-[0_0_0_1px_hsl(var(--accent))]"
                      : "border-border bg-card hover:border-primary/20 hover:bg-surface/50",
                  )}
                >
                  <input
                    type="radio"
                    name="incoterm"
                    value={term}
                    checked={selected}
                    onChange={() => onChange(term)}
                    className="mt-1 size-4 accent-accent"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-bold tracking-wide text-foreground">
                        {term}
                      </span>
                      <span className="text-sm font-medium text-foreground">
                        {INCOTERM_LABELS[term]}
                      </span>
                    </span>
                    {hint ? (
                      <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">
                        {hint}
                      </span>
                    ) : null}
                  </span>
                  {selected ? (
                    <Check className="size-4 shrink-0 text-accent" aria-hidden />
                  ) : null}
                </label>
              );
            })}
          </div>
        </div>
      ))}
      {error ? (
        <p className="text-sm font-medium text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </fieldset>
  );
}

export function QuoteWizardForm() {
  const reduceMotion = useReducedMotion();
  const formRef = useRef<HTMLFormElement>(null);
  const [step, setStep] = useState<StepIndex>(0);
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<string[]>([]);
  const [referenceId, setReferenceId] = useState<string | null>(null);
  const [showContactErrors, setShowContactErrors] = useState(false);
  const [submitReady, setSubmitReady] = useState(true);

  const {
    register,
    handleSubmit,
    control,
    reset,
    trigger,
    watch,
    setValue,
    setError,
    clearErrors,
    getFieldState,
    formState: { errors },
  } = useForm<QuoteWizardValues>({
    resolver: zodResolver(quoteWizardSchema),
    defaultValues: createDefaultQuoteWizardValues(),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "cargoItems",
  });

  const values = watch();
  const cargoItems = useWatch({ control, name: "cargoItems" }) ?? [];
  const copy = STEP_COPY[step];
  const totals = formatCargoTotals(cargoItems);

  const contactFieldError = (message?: string) =>
    showContactErrors ? message : undefined;

  const scrollBehavior = reduceMotion ? "instant" : "smooth";

  const selectMode = (mode: TransportMode) => {
    setValue("transportMode", mode, { shouldDirty: true });
  };

  const goNext = async () => {
    setStatus("idle");
    setErrorMessage(null);
    setErrorDetails([]);
    const fieldsToValidate = STEP_FIELDS[step];
    const ok =
      fieldsToValidate.length === 0 ? true : await trigger(fieldsToValidate);
    if (!ok) {
      let firstInvalidField =
        fieldsToValidate.find((field) => getFieldState(field).invalid) ?? null;
      if (firstInvalidField === "cargoItems") {
        firstInvalidField = null;
      }
      scheduleScrollToFormField(firstInvalidField, {
        form: formRef.current,
      });
      return;
    }
    const nextStep = Math.min(step + 1, 3) as StepIndex;
    if (nextStep === 3) {
      setShowContactErrors(false);
      setSubmitReady(false);
    }
    setStep(nextStep);
    scheduleScrollToFormTop(formRef.current, { behavior: scrollBehavior });
    if (nextStep === 3) {
      clearErrors(STEP_FIELDS[3]);
      window.setTimeout(() => setSubmitReady(true), 400);
    }
  };

  const goBack = () => {
    setStatus("idle");
    setErrorMessage(null);
    setErrorDetails([]);
    if (step === 3) {
      setShowContactErrors(false);
      setSubmitReady(true);
      clearErrors(STEP_FIELDS[3]);
    }
    setStep((s) => Math.max(s - 1, 0) as StepIndex);
    scheduleScrollToFormTop(formRef.current, { behavior: scrollBehavior });
  };

  const showFormAlert =
    status === "error" && (step !== 3 || showContactErrors);

  const showValidationErrors = (
    messages: string[],
    firstField?: string | null,
  ) => {
    setStatus("error");
    setErrorMessage("Please fix the following before submitting:");
    setErrorDetails(messages);
    if (firstField) {
      setStep(getQuoteWizardStepForField(firstField));
    }
    scheduleScrollToFormField(firstField, { form: formRef.current });
  };

  const onInvalid = (formErrors: FieldErrors<QuoteWizardValues>) => {
    const firstField = firstErrorFieldPath(formErrors);
    if (firstField && getQuoteWizardStepForField(firstField) === 3) {
      setShowContactErrors(true);
    }
    showValidationErrors(
      collectReactHookFormErrors(formErrors),
      firstField,
    );
  };

  const submitQuote = () => {
    if (!submitReady || step !== 3) return;
    setShowContactErrors(true);
    void handleSubmit(onSubmit, onInvalid)();
  };

  const onSubmit = async (formValues: QuoteWizardValues) => {
    setStatus("loading");
    setErrorMessage(null);
    setErrorDetails([]);
    setReferenceId(null);
    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formValues),
      });
      const json = (await res.json()) as {
        success: boolean;
        error?: string;
        details?: ZodFlattenedError;
        data?: { referenceId?: string };
      };
      if (!res.ok || !json.success) {
        if (json.details) {
          const messages = formatZodFlattenErrors(json.details);
          for (const [field, fieldMessages] of Object.entries(
            json.details.fieldErrors,
          )) {
            if (fieldMessages[0]) {
              setError(field as Path<QuoteWizardValues>, {
                type: "server",
                message: fieldMessages[0],
              });
            }
          }
          const firstField = Object.keys(json.details.fieldErrors)[0] ?? null;
          if (firstField && getQuoteWizardStepForField(firstField) === 3) {
            setShowContactErrors(true);
          }
          showValidationErrors(messages, firstField);
          return;
        }

        throw new Error(json.error ?? "Unable to submit quote request");
      }
      setReferenceId(json.data?.referenceId ?? null);
      setStatus("success");
      setShowContactErrors(false);
      reset(createDefaultQuoteWizardValues());
      setStep(0);
    } catch (err) {
      setStatus("error");
      setShowContactErrors(true);
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
        className="flex flex-col items-center gap-6 px-5 py-10 text-center md:px-8 md:py-14"
      >
        <div className="relative">
          <div
            className="absolute inset-0 scale-150 rounded-full bg-accent/20 blur-2xl"
            aria-hidden
          />
          <div className="relative flex size-16 items-center justify-center bg-accent text-accent-foreground shadow-[var(--ds-shadow-accent-glow)]">
            <Sparkles className="size-7" aria-hidden />
          </div>
        </div>
        <div className="max-w-md space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            Quote request received
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
            {referenceId
              ? `Reference ${referenceId}. ${QUOTE_RESPONSE_STATEMENT}`
              : QUOTE_RESPONSE_STATEMENT}
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
            Submit another quote
          </Button>
          <Button
            type="button"
            variant="outline"
            rounded="none"
            className="h-11 flex-1"
            asChild
          >
            <a href="/track">Track a shipment</a>
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_17.5rem] xl:grid-cols-[minmax(0,1fr)_19rem]">
      <form
        ref={formRef}
        id="quote-form"
        className="flex min-w-0 flex-col scroll-mt-24"
        onSubmit={(event) => event.preventDefault()}
        noValidate
        aria-busy={status === "loading"}
      >
        <div className="border-b border-border/80 bg-surface/40 px-5 py-5 md:px-8">
          <p className="mb-4 text-xs leading-relaxed text-muted-foreground">
            Commercial cargo only. Personal effects and household goods are not
            accepted through this form.
          </p>
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold tracking-[0.18em] text-accent uppercase">
                Quote wizard
              </p>
              <p className="mt-1 text-lg font-semibold text-foreground">
                Step {step + 1}{" "}
                <span className="font-normal text-muted-foreground">
                  — {STEPS[step].hint}
                </span>
              </p>
            </div>
            <p className="text-xs text-muted-foreground">~5 min · Freight desk</p>
          </div>

          <ol className="grid grid-cols-4 gap-0" aria-label="Quote progress">
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

        <div className="p-5 md:p-8">
          {showFormAlert ? (
            <StateAlert
              variant="error"
              title={
                errorDetails.length > 0
                  ? "Please review your form"
                  : "Submission failed"
              }
              description={errorMessage ?? undefined}
              details={errorDetails.length > 0 ? errorDetails : undefined}
              onRetry={() => {
                setStatus("idle");
                setErrorMessage(null);
                setErrorDetails([]);
              }}
              className="mb-6"
            />
          ) : null}

          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={step} {...stepMotion}>
              <StepPanel title={copy.title} description={copy.description}>
                {step === 0 ? (
                  <div className="space-y-6">
                    <FormField
                      label="Cargo ready date"
                      htmlFor="cargoReadyDate"
                      required
                      error={errors.cargoReadyDate?.message}
                    >
                      <Input
                        id="cargoReadyDate"
                        type="date"
                        className="h-11 max-w-xs border-border/80 bg-background"
                        {...register("cargoReadyDate")}
                      />
                    </FormField>

                    <div className="space-y-3">
                      <Label className="text-sm font-semibold">
                        Transport mode
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Choose one mode — pricing and transit differ for each.
                      </p>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        {TRANSPORT_MODES.map((mode) => (
                          <TransportModeCard
                            key={mode}
                            mode={mode}
                            selected={values.transportMode === mode}
                            onSelect={() => selectMode(mode)}
                          />
                        ))}
                      </div>
                      {errors.transportMode?.message ? (
                        <p
                          id="transportMode-error"
                          className="text-sm font-medium text-destructive"
                          role="alert"
                        >
                          {errors.transportMode.message}
                        </p>
                      ) : null}
                    </div>

                    <div className="space-y-4">
                      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-border/70 pb-3">
                        <div className="flex items-center gap-2">
                          <span className="flex size-9 items-center justify-center bg-accent/10 text-accent">
                            <Package className="size-4" aria-hidden />
                          </span>
                          <div>
                            <h3 className="text-sm font-semibold text-foreground">
                              Cargo line items
                            </h3>
                            <p className="text-xs text-muted-foreground">
                              Add dimensions and weight per commodity
                            </p>
                          </div>
                        </div>
                        <div className="rounded-none border border-border/80 bg-surface/60 px-3 py-2 text-right text-xs">
                          <p className="text-muted-foreground">
                            Running total
                          </p>
                          <p className="font-bold text-foreground">
                            {totals.cbm} CBM · {totals.weightKg} KG
                          </p>
                        </div>
                      </div>

                      {fields.map((field, index) => (
                        <div
                          key={field.id}
                          className="relative overflow-hidden border border-border/80 bg-card shadow-sm"
                        >
                          <div className="flex items-center justify-between gap-2 border-b border-border/70 bg-surface/50 px-4 py-3">
                            <p className="text-sm font-semibold text-foreground">
                              Line {index + 1}
                            </p>
                            {fields.length > 1 ? (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-8 text-destructive hover:text-destructive"
                                onClick={() => remove(index)}
                              >
                                <Trash2 className="size-4" />
                                Remove
                              </Button>
                            ) : null}
                          </div>

                          <div className="space-y-4 p-4">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                              <FormField
                                label="Commodity description"
                                htmlFor={`cargoItems.${index}.description`}
                                required
                                error={
                                  errors.cargoItems?.[index]?.description
                                    ?.message
                                }
                              >
                                <Input
                                  {...register(
                                    `cargoItems.${index}.description`,
                                  )}
                                  placeholder="e.g. Auto parts, electronics"
                                  className="border-border/80 bg-background"
                                />
                              </FormField>
                              <FormField
                                label="HS code"
                                htmlFor={`cargoItems.${index}.hsCode`}
                                error={
                                  errors.cargoItems?.[index]?.hsCode?.message
                                }
                              >
                                <Input
                                  {...register(`cargoItems.${index}.hsCode`)}
                                  placeholder="Optional"
                                  className="border-border/80 bg-background"
                                />
                              </FormField>
                            </div>

                            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                              <FormField
                                label="Qty"
                                htmlFor={`cargoItems.${index}.quantity`}
                                required
                                error={
                                  errors.cargoItems?.[index]?.quantity?.message
                                }
                              >
                                <Input
                                  type="number"
                                  min={1}
                                  step={1}
                                  className="border-border/80 bg-background"
                                  {...register(`cargoItems.${index}.quantity`)}
                                />
                              </FormField>
                              <FormField
                                label="Type"
                                htmlFor={`cargoItems.${index}.packageType`}
                                required
                                error={
                                  errors.cargoItems?.[index]?.packageType
                                    ?.message
                                }
                              >
                                <Controller
                                  control={control}
                                  name={`cargoItems.${index}.packageType`}
                                  render={({ field: f }) => (
                                    <Select
                                      onValueChange={f.onChange}
                                      value={f.value}
                                    >
                                      <SelectTrigger
                                        id={`cargoItems.${index}.packageType`}
                                      >
                                        <SelectValue placeholder="Type" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {PACKAGE_TYPES.map((type) => (
                                          <SelectItem key={type} value={type}>
                                            {PACKAGE_TYPE_LABELS[type]}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  )}
                                />
                              </FormField>
                              <FormField
                                label="Weight / unit (KG)"
                                htmlFor={`cargoItems.${index}.weightKg`}
                                required
                                error={
                                  errors.cargoItems?.[index]?.weightKg?.message
                                }
                                className="col-span-2 md:col-span-2"
                              >
                                <Input
                                  type="number"
                                  min={0.1}
                                  step={0.1}
                                  className="border-border/80 bg-background"
                                  {...register(`cargoItems.${index}.weightKg`)}
                                />
                              </FormField>
                            </div>

                            <div>
                              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                                <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                                  Dimensions (
                                  {DIMENSION_UNIT_SHORT[
                                    cargoItems[index]?.dimensionUnit ?? "cm"
                                  ]}
                                  )
                                </p>
                                <Controller
                                  control={control}
                                  name={`cargoItems.${index}.dimensionUnit`}
                                  render={({ field: f }) => (
                                    <Select
                                      onValueChange={f.onChange}
                                      value={f.value}
                                    >
                                      <SelectTrigger
                                        id={`cargoItems.${index}.dimensionUnit`}
                                        className="h-8 w-[9.5rem] border-border/80 bg-background text-xs"
                                        aria-label="Dimension unit"
                                      >
                                        <SelectValue placeholder="Unit" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {DIMENSION_UNITS.map((unit) => (
                                          <SelectItem key={unit} value={unit}>
                                            {DIMENSION_UNIT_LABELS[unit]}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  )}
                                />
                              </div>
                              {errors.cargoItems?.[index]?.dimensionUnit
                                ?.message ? (
                                <p className="mb-2 text-sm font-medium text-destructive">
                                  {
                                    errors.cargoItems[index]?.dimensionUnit
                                      ?.message
                                  }
                                </p>
                              ) : null}
                              <div className="grid grid-cols-3 gap-3">
                                {(
                                  [
                                    ["length", "L"],
                                    ["width", "W"],
                                    ["height", "H"],
                                  ] as const
                                ).map(([key, short]) => (
                                  <FormField
                                    key={key}
                                    label={short}
                                    htmlFor={`cargoItems.${index}.${key}`}
                                    required
                                    error={
                                      errors.cargoItems?.[index]?.[key]?.message
                                    }
                                  >
                                    <Input
                                      type="number"
                                      min={0.01}
                                      step="any"
                                      className="border-border/80 bg-background"
                                      {...register(
                                        `cargoItems.${index}.${key}`,
                                      )}
                                    />
                                  </FormField>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}

                      {errors.cargoItems?.message ? (
                        <p className="text-sm font-medium text-destructive">
                          {errors.cargoItems.message}
                        </p>
                      ) : null}

                      <Button
                        type="button"
                        variant="outline"
                        rounded="none"
                        className="h-10 border-dashed"
                        onClick={() => append(createEmptyCargoItem())}
                      >
                        <Plus className="size-4" />
                        Add another line item
                      </Button>
                    </div>
                  </div>
                ) : null}

                {step === 1 ? (
                  <div className="space-y-6">
                    <RouteConnector
                      origin={values.origin}
                      destination={values.destination}
                      originPickup={values.originPickup}
                      destinationDelivery={values.destinationDelivery}
                    />

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <FormField
                        label="Origin city / port / airport"
                        htmlFor="origin"
                        required
                        error={errors.origin?.message}
                      >
                        <Input
                          {...register("origin")}
                          placeholder="e.g. Mumbai, Nhava Sheva"
                          className="h-11 border-border/80 bg-background"
                        />
                      </FormField>
                      <Controller
                        control={control}
                        name="originPickup"
                        render={({ field }) => (
                          <YesNoField
                            label="Need origin pickup?"
                            value={field.value}
                            onChange={field.onChange}
                          />
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <FormField
                        label="Destination city / port / airport"
                        htmlFor="destination"
                        required
                        error={errors.destination?.message}
                      >
                        <Input
                          {...register("destination")}
                          placeholder="e.g. Dubai, Jebel Ali"
                          className="h-11 border-border/80 bg-background"
                        />
                      </FormField>
                      <Controller
                        control={control}
                        name="destinationDelivery"
                        render={({ field }) => (
                          <YesNoField
                            label="Need destination delivery?"
                            value={field.value}
                            onChange={field.onChange}
                          />
                        )}
                      />
                    </div>

                    <Controller
                      control={control}
                      name="incoterm"
                      render={({ field }) => (
                        <IncotermRadioGroup
                          value={field.value}
                          onChange={field.onChange}
                          error={errors.incoterm?.message}
                        />
                      )}
                    />
                  </div>
                ) : null}

                {step === 2 ? (
                  <div className="space-y-5">
                    <div className="space-y-3">
                      <Controller
                        control={control}
                        name="insurance"
                        render={({ field }) => (
                          <ToggleField
                            id="insurance"
                            label="Cargo insurance"
                            description="Marine / cargo cover arranged through leading insurers in India."
                            checked={field.value}
                            onChange={(checked) => {
                              field.onChange(checked);
                              if (!checked) {
                                setValue("insuranceCargoValueInr", undefined);
                                setValue("insuranceCoverage", undefined);
                              }
                            }}
                          />
                        )}
                      />
                      {values.insurance ? (
                        <div className="ml-0 space-y-4 border border-accent/30 bg-accent/[0.04] p-4 md:ml-4">
                          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <FormField
                              label="Insured cargo value (INR)"
                              htmlFor="insuranceCargoValueInr"
                              required
                              error={errors.insuranceCargoValueInr?.message}
                            >
                              <Input
                                id="insuranceCargoValueInr"
                                type="number"
                                min={1}
                                step="1"
                                placeholder="e.g. 1500000"
                                className="h-11 border-border/80 bg-background"
                                {...register("insuranceCargoValueInr", {
                                  setValueAs: (v) =>
                                    v === "" || v == null
                                      ? undefined
                                      : Number(v),
                                })}
                              />
                            </FormField>
                            <FormField
                              label="Coverage type"
                              htmlFor="insuranceCoverage"
                              required
                              error={errors.insuranceCoverage?.message}
                            >
                              <Controller
                                control={control}
                                name="insuranceCoverage"
                                render={({ field }) => (
                                  <Select
                                    onValueChange={field.onChange}
                                    value={field.value}
                                  >
                                    <SelectTrigger
                                      id="insuranceCoverage"
                                      className="h-11 border-border/80 bg-background"
                                      aria-invalid={Boolean(
                                        errors.insuranceCoverage,
                                      )}
                                    >
                                      <SelectValue placeholder="Select coverage" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {INSURANCE_COVERAGES.map((coverage) => (
                                        <SelectItem
                                          key={coverage}
                                          value={coverage}
                                        >
                                          {INSURANCE_COVERAGE_LABELS[coverage]}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                )}
                              />
                            </FormField>
                          </div>
                        </div>
                      ) : null}
                    </div>

                    <div className="space-y-3">
                      <Controller
                        control={control}
                        name="projectCargo"
                        render={({ field }) => (
                          <ToggleField
                            id="projectCargo"
                            label="Project cargo handling"
                            description="Project machinery, second-hand machinery, or project import registration support."
                            checked={field.value}
                            onChange={(checked) => {
                              field.onChange(checked);
                              if (!checked) {
                                setValue("projectCargoType", undefined);
                                setValue("projectRegistrationHelp", false);
                                setValue("projectNotes", "");
                              }
                            }}
                          />
                        )}
                      />
                      {values.projectCargo ? (
                        <div className="ml-0 space-y-4 border border-accent/30 bg-accent/[0.04] p-4 md:ml-4">
                          <FormField
                            label="Project cargo type"
                            htmlFor="projectCargoType"
                            required
                            error={errors.projectCargoType?.message}
                          >
                            <Controller
                              control={control}
                              name="projectCargoType"
                              render={({ field }) => (
                                <Select
                                  onValueChange={field.onChange}
                                  value={field.value}
                                >
                                  <SelectTrigger
                                    id="projectCargoType"
                                    className="h-11 border-border/80 bg-background"
                                    aria-invalid={Boolean(
                                      errors.projectCargoType,
                                    )}
                                  >
                                    <SelectValue placeholder="Select project type" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {PROJECT_CARGO_TYPES.map((type) => (
                                      <SelectItem key={type} value={type}>
                                        {PROJECT_CARGO_TYPE_LABELS[type]}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              )}
                            />
                          </FormField>
                          <Controller
                            control={control}
                            name="projectRegistrationHelp"
                            render={({ field }) => (
                              <ToggleField
                                id="projectRegistrationHelp"
                                label="Need project registration help?"
                                description="Registration with authorities, finalisation, or cancellation of project import."
                                checked={Boolean(field.value)}
                                onChange={field.onChange}
                              />
                            )}
                          />
                          <FormField
                            label="Project notes"
                            htmlFor="projectNotes"
                            error={errors.projectNotes?.message}
                          >
                            <Textarea
                              id="projectNotes"
                              {...register("projectNotes")}
                              placeholder="Machinery specs, project code, authority details, or special clearance requirements"
                              rows={3}
                              className="border-border/80 bg-background"
                            />
                          </FormField>
                        </div>
                      ) : null}
                    </div>

                    <div className="space-y-3">
                      <Controller
                        control={control}
                        name="packingRequired"
                        render={({ field }) => (
                          <ToggleField
                            id="packingRequired"
                            label="Packing & handling"
                            description="Professional packing for general, hazardous, personal effects, or household goods."
                            checked={field.value}
                            onChange={(checked) => {
                              field.onChange(checked);
                              if (!checked) {
                                setValue("packingScope", undefined);
                                setValue("fumigationRequired", false);
                                setValue("labelingBarcoding", false);
                                setValue("packingNotes", "");
                              }
                            }}
                          />
                        )}
                      />
                      {values.packingRequired ? (
                        <div className="ml-0 space-y-4 border border-accent/30 bg-accent/[0.04] p-4 md:ml-4">
                          <FormField
                            label="Packing scope"
                            htmlFor="packingScope"
                            required
                            error={errors.packingScope?.message}
                          >
                            <Controller
                              control={control}
                              name="packingScope"
                              render={({ field }) => (
                                <Select
                                  onValueChange={field.onChange}
                                  value={field.value}
                                >
                                  <SelectTrigger
                                    id="packingScope"
                                    className="h-11 border-border/80 bg-background"
                                    aria-invalid={Boolean(errors.packingScope)}
                                  >
                                    <SelectValue placeholder="Select packing scope" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {PACKING_SCOPES.map((scope) => (
                                      <SelectItem key={scope} value={scope}>
                                        {PACKING_SCOPE_LABELS[scope]}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              )}
                            />
                          </FormField>
                          <Controller
                            control={control}
                            name="fumigationRequired"
                            render={({ field }) => (
                              <ToggleField
                                id="fumigationRequired"
                                label="Fumigation required"
                                description="Arrange fumigation certificates where destination regulations require them."
                                checked={Boolean(field.value)}
                                onChange={field.onChange}
                              />
                            )}
                          />
                          <Controller
                            control={control}
                            name="labelingBarcoding"
                            render={({ field }) => (
                              <ToggleField
                                id="labelingBarcoding"
                                label="Labeling & barcoding"
                                description="Warehouse-ready labeling and barcode marking for storage or dispatch."
                                checked={Boolean(field.value)}
                                onChange={field.onChange}
                              />
                            )}
                          />
                          <FormField
                            label="Packing notes"
                            htmlFor="packingNotes"
                            error={errors.packingNotes?.message}
                          >
                            <Textarea
                              id="packingNotes"
                              {...register("packingNotes")}
                              placeholder="Crate specs, fragile items, household inventory notes, or special packing instructions"
                              rows={3}
                              className="border-border/80 bg-background"
                            />
                          </FormField>
                        </div>
                      ) : null}
                    </div>

                    <Controller
                      control={control}
                      name="customsBrokerage"
                      render={({ field }) => (
                        <ToggleField
                          id="customsBrokerage"
                          label="Customs brokerage"
                          description="Import / export clearance and documentation support."
                          checked={field.value}
                          onChange={field.onChange}
                        />
                      )}
                    />
                    <FormField
                      label="Dangerous or flammable cargo? (declared by shipper)"
                      htmlFor="dangerousCargoNotes"
                      error={errors.dangerousCargoNotes?.message}
                    >
                      <Textarea
                        id="dangerousCargoNotes"
                        {...register("dangerousCargoNotes")}
                        placeholder="Describe UN class, packing group, or special handling (max 2000 characters)"
                        rows={4}
                        className="border-border/80 bg-background"
                      />
                    </FormField>
                  </div>
                ) : null}

                {step === 3 ? (
                  <div className="space-y-6">
                    <Controller
                      control={control}
                      name="existingCustomer"
                      render={({ field }) => (
                        <YesNoField
                          label="Are you currently an ExpressWay customer?"
                          value={field.value}
                          onChange={field.onChange}
                        />
                      )}
                    />

                    <div className="border border-border/80 bg-surface/50 p-4 md:p-5">
                      <p className="mb-4 text-xs font-semibold tracking-[0.16em] text-accent uppercase">
                        Contact person
                      </p>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <FormField
                          label="First name"
                          htmlFor="firstName"
                          required
                          error={contactFieldError(errors.firstName?.message)}
                        >
                          <Input
                            {...register("firstName")}
                            autoComplete="given-name"
                            className="border-border/80 bg-background"
                          />
                        </FormField>
                        <FormField
                          label="Last name"
                          htmlFor="lastName"
                          required
                          error={contactFieldError(errors.lastName?.message)}
                        >
                          <Input
                            {...register("lastName")}
                            autoComplete="family-name"
                            className="border-border/80 bg-background"
                          />
                        </FormField>
                      </div>

                      <div className="mt-4">
                        <FormField
                          label="Company name"
                          htmlFor="company"
                          required
                          error={contactFieldError(errors.company?.message)}
                        >
                          <Input
                            {...register("company")}
                            autoComplete="organization"
                            className="border-border/80 bg-background"
                          />
                        </FormField>
                      </div>

                      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                        <FormField
                          label="Business email"
                          htmlFor="email"
                          required
                          error={contactFieldError(errors.email?.message)}
                        >
                          <Input
                            type="email"
                            {...register("email")}
                            autoComplete="email"
                            className="border-border/80 bg-background"
                          />
                        </FormField>
                        <FormField
                          label="Phone"
                          htmlFor="phone"
                          error={contactFieldError(errors.phone?.message)}
                        >
                          <Input
                            type="tel"
                            {...register("phone")}
                            autoComplete="tel"
                            placeholder="+91 98736 93160"
                            className="border-border/80 bg-background"
                          />
                        </FormField>
                      </div>
                    </div>

                    <div className="border border-border/80 bg-surface/50 p-4 md:p-5">
                      <p className="mb-4 text-xs font-semibold tracking-[0.16em] text-accent uppercase">
                        Business address
                      </p>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <FormField
                          label="Country / area"
                          htmlFor="country"
                          required
                          error={contactFieldError(errors.country?.message)}
                        >
                          <Input
                            {...register("country")}
                            className="border-border/80 bg-background"
                          />
                        </FormField>
                        <FormField
                          label="State / province"
                          htmlFor="state"
                          error={contactFieldError(errors.state?.message)}
                        >
                          <Input
                            {...register("state")}
                            className="border-border/80 bg-background"
                          />
                        </FormField>
                      </div>

                      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                        <FormField
                          label="City"
                          htmlFor="city"
                          required
                          error={contactFieldError(errors.city?.message)}
                        >
                          <Input
                            {...register("city")}
                            autoComplete="address-level2"
                            className="border-border/80 bg-background"
                          />
                        </FormField>
                        <FormField
                          label="Zip / postal code"
                          htmlFor="postalCode"
                          error={contactFieldError(errors.postalCode?.message)}
                        >
                          <Input
                            {...register("postalCode")}
                            autoComplete="postal-code"
                            className="border-border/80 bg-background"
                          />
                        </FormField>
                      </div>

                      <div className="mt-4">
                        <FormField
                          label="Street address"
                          htmlFor="address"
                          required
                          error={contactFieldError(errors.address?.message)}
                        >
                          <Textarea
                            {...register("address")}
                            placeholder="Street, building, PIN code"
                            autoComplete="street-address"
                            className="border-border/80 bg-background"
                          />
                        </FormField>
                      </div>
                    </div>

                    <FormField
                      label="How did you hear about us?"
                      htmlFor="referralSource"
                      required
                      error={contactFieldError(errors.referralSource?.message)}
                    >
                      <Controller
                        control={control}
                        name="referralSource"
                        render={({ field }) => (
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger id="referralSource">
                              <SelectValue placeholder="Select an option" />
                            </SelectTrigger>
                            <SelectContent>
                              {REFERRAL_SOURCES.map((source) => (
                                <SelectItem key={source} value={source}>
                                  {REFERRAL_SOURCE_LABELS[source]}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </FormField>

                    <div className="overflow-hidden border border-primary/15 bg-gradient-to-br from-primary/5 via-background to-accent/5 shadow-sm">
                      <div className="flex items-center justify-between border-b border-border/70 bg-primary px-4 py-3 text-primary-foreground md:px-5">
                        <div>
                          <p className="text-[10px] font-bold tracking-[0.2em] text-accent uppercase">
                            Quote summary
                          </p>
                          <p className="text-sm font-semibold">
                            Ready to submit
                          </p>
                        </div>
                        <Send className="size-5 text-accent" aria-hidden />
                      </div>
                      <dl className="grid grid-cols-1 gap-0 sm:grid-cols-2">
                        {(
                          [
                            [
                              "Mode",
                              `${values.transportMode.toUpperCase()} (${TRANSPORT_MODE_LABELS[values.transportMode]})`,
                            ],
                            [
                              "Route",
                              `${values.origin || "—"} → ${values.destination || "—"}${values.incoterm ? ` · ${values.incoterm}` : ""}`,
                            ],
                            [
                              "Cargo",
                              `${totals.cbm} CBM · ${totals.weightKg} KG · ${values.cargoItems?.length ?? 0} item(s)`,
                            ],
                            [
                              "Add-ons",
                              formatQuoteAddOns(values).join(", ") || "None",
                            ],
                          ] as const
                        ).map(([label, value], index) => (
                          <div
                            key={label}
                            className={cn(
                              "border-border/60 px-4 py-3.5 md:px-5",
                              index % 2 === 0 ? "bg-background/60" : "bg-surface/40",
                              index >= 2 && "border-t sm:border-t-0",
                              index % 2 === 0 && index >= 2 && "sm:border-t",
                            )}
                          >
                            <dt className="text-[10px] font-bold tracking-[0.16em] text-muted-foreground uppercase">
                              {label}
                            </dt>
                            <dd className="mt-1 text-sm font-medium text-foreground">
                              {value}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  </div>
                ) : null}
              </StepPanel>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-border/80 px-5 py-4 sm:flex-row sm:items-center sm:justify-between md:px-8">
          <Button
            type="button"
            variant="outline"
            rounded="none"
            className="h-11 w-full sm:w-auto"
            onClick={goBack}
            disabled={step === 0 || status === "loading"}
          >
            <ArrowLeft className="size-4" />
            Back
          </Button>

          {step < 3 ? (
            <Button
              type="button"
              rounded="none"
              className="h-11 w-full min-w-40 sm:w-auto"
              onClick={goNext}
            >
              Continue
              <ArrowRight className="size-4" />
            </Button>
          ) : (
            <Button
              type="button"
              rounded="none"
              className="h-11 w-full min-w-44 sm:w-auto"
              loading={status === "loading"}
              disabled={!submitReady}
              onClick={submitQuote}
            >
              <Send className="size-4" />
              Submit quote
            </Button>
          )}
        </div>
      </form>

      <aside className="hidden border-l border-border/60 bg-surface/30 lg:block">
        <div className="sticky top-28 p-5 xl:p-6">
          <QuoteManifest values={values} step={step} totals={totals} />
        </div>
      </aside>
    </div>
  );
}
