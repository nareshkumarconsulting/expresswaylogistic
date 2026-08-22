import type { FieldErrors, FieldValues } from "react-hook-form";

export type ZodFlattenedError = {
  formErrors: string[];
  fieldErrors: Record<string, string[]>;
};

const QUOTE_FIELD_LABELS: Record<string, string> = {
  cargoReadyDate: "Cargo ready date",
  transportMode: "Transport mode",
  origin: "Origin",
  destination: "Destination",
  incoterm: "Incoterms rule",
  firstName: "First name",
  lastName: "Last name",
  company: "Company",
  email: "Email",
  phone: "Phone",
  country: "Country",
  state: "State / province",
  city: "City",
  postalCode: "Postal code",
  address: "Address",
  referralSource: "How you heard about us",
  insurance: "Insurance",
  insuranceCargoValueInr: "Insured cargo value",
  insuranceCoverage: "Insurance coverage",
  projectCargo: "Project cargo",
  projectCargoType: "Project cargo type",
  projectRegistrationHelp: "Project registration help",
  projectNotes: "Project notes",
  packingRequired: "Packing & handling",
  packingScope: "Packing scope",
  fumigationRequired: "Fumigation",
  labelingBarcoding: "Labeling & barcoding",
  packingNotes: "Packing notes",
  customsBrokerage: "Customs brokerage",
  dangerousCargoNotes: "Dangerous cargo notes",
  dimensionUnit: "Dimension unit",
  length: "Length",
  width: "Width",
  height: "Height",
  weightKg: "Weight per unit",
  quantity: "Quantity",
  packageType: "Package type",
  description: "Commodity description",
  hsCode: "HS code",
};

function labelForField(path: string): string {
  const cargoMatch = path.match(/^cargoItems\.(\d+)\.(.+)$/);
  if (cargoMatch) {
    const line = Number(cargoMatch[1]) + 1;
    const field = cargoMatch[2];
    const label = QUOTE_FIELD_LABELS[field] ?? field;
    return `Line ${line} — ${label}`;
  }

  return QUOTE_FIELD_LABELS[path] ?? path;
}

export function formatZodFlattenErrors(details: ZodFlattenedError): string[] {
  const messages = [...details.formErrors];

  for (const [field, fieldMessages] of Object.entries(details.fieldErrors)) {
    for (const message of fieldMessages) {
      messages.push(`${labelForField(field)}: ${message}`);
    }
  }

  return messages;
}

export function collectReactHookFormErrors<T extends FieldValues>(
  errors: FieldErrors<T>,
  prefix = "",
): string[] {
  const messages: string[] = [];

  for (const [key, value] of Object.entries(errors)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (!value) continue;

    if ("message" in value && typeof value.message === "string") {
      messages.push(`${labelForField(path)}: ${value.message}`);
      continue;
    }

    if (typeof value === "object") {
      messages.push(
        ...collectReactHookFormErrors(value as FieldErrors<T>, path),
      );
    }
  }

  return messages;
}

export function firstErrorFieldPath<T extends FieldValues>(
  errors: FieldErrors<T>,
  prefix = "",
): string | null {
  for (const [key, value] of Object.entries(errors)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (!value) continue;

    if ("message" in value && value.message) {
      return path;
    }

    if (typeof value === "object" && !("message" in value)) {
      const nested = firstErrorFieldPath(value as FieldErrors<T>, path);
      if (nested) return nested;
    }
  }

  return null;
}

type ScrollToFormFieldOptions = {
  form?: HTMLElement | null;
  behavior?: ScrollBehavior;
};

function focusScrollTarget(element: HTMLElement, behavior: ScrollBehavior) {
  element.scrollIntoView({ behavior, block: "center" });
  if (element.matches("input, select, textarea, button, [tabindex]")) {
    element.focus({ preventScroll: true });
  }
}

function queryFieldElement(
  fieldPath: string,
  root: ParentNode,
): HTMLElement | null {
  const byId = root.querySelector<HTMLElement>(`#${CSS.escape(fieldPath)}`);
  if (byId) return byId;

  const byName = root.querySelector<HTMLElement>(
    `[name="${CSS.escape(fieldPath)}"]`,
  );
  if (byName) return byName;

  const byDataField = root.querySelector<HTMLElement>(
    `[data-field="${CSS.escape(fieldPath)}"]`,
  );
  if (byDataField) return byDataField;

  const byFieldError = root.querySelector<HTMLElement>(
    `#${CSS.escape(`${fieldPath}-error`)}`,
  );
  if (byFieldError) return byFieldError;

  return null;
}

function queryFirstInvalidElement(root: ParentNode): HTMLElement | null {
  const invalid = root.querySelector<HTMLElement>('[aria-invalid="true"]');
  if (invalid) return invalid;

  const fieldError = root.querySelector<HTMLElement>(
    '[id$="-error"][role="alert"]',
  );
  if (fieldError) return fieldError;

  const alert = root.querySelector<HTMLElement>('[role="alert"]');
  if (alert) return alert;

  return null;
}

export function scrollToFormField(
  fieldPath: string | null | undefined,
  options?: ScrollToFormFieldOptions,
): boolean {
  if (typeof window === "undefined") return false;

  const behavior = options?.behavior ?? "smooth";
  const root = options?.form ?? document;

  if (fieldPath) {
    const target = queryFieldElement(fieldPath, root);
    if (target) {
      focusScrollTarget(target, behavior);
      return true;
    }
  }

  const fallback = queryFirstInvalidElement(root);
  if (fallback) {
    focusScrollTarget(fallback, behavior);
    return true;
  }

  return false;
}

export function scheduleScrollToFormField(
  fieldPath: string | null | undefined,
  options?: ScrollToFormFieldOptions,
): void {
  if (typeof window === "undefined") return;

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      scrollToFormField(fieldPath, options);
    });
  });
}

export function scrollToFormTop(
  form?: HTMLElement | null,
  options?: Pick<ScrollToFormFieldOptions, "behavior">,
): void {
  if (typeof window === "undefined") return;

  const behavior = options?.behavior ?? "smooth";
  if (form) {
    form.scrollIntoView({ behavior, block: "start" });
    return;
  }

  window.scrollTo({ top: 0, behavior });
}

export function scheduleScrollToFormTop(
  form?: HTMLElement | null,
  options?: Pick<ScrollToFormFieldOptions, "behavior">,
): void {
  if (typeof window === "undefined") return;

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      scrollToFormTop(form, options);
    });
  });
}

export function getAppointmentStepForField(field: string): 0 | 1 | 2 | 3 {
  if (field === "appointmentType") {
    return 0;
  }

  if (
    field === "preferredDate" ||
    field === "preferredTime" ||
    field === "meetingMode"
  ) {
    return 1;
  }

  if (
    field === "name" ||
    field === "company" ||
    field === "email" ||
    field === "phone" ||
    field === "notes"
  ) {
    return 2;
  }

  return 3;
}

export function getQuoteWizardStepForField(field: string): 0 | 1 | 2 | 3 {
  if (
    field === "cargoReadyDate" ||
    field === "transportMode" ||
    field.startsWith("cargoItems")
  ) {
    return 0;
  }

  if (
    field === "origin" ||
    field === "destination" ||
    field === "originPickup" ||
    field === "destinationDelivery" ||
    field === "incoterm"
  ) {
    return 1;
  }

  if (
    field === "insurance" ||
    field === "insuranceCargoValueInr" ||
    field === "insuranceCoverage" ||
    field === "projectCargo" ||
    field === "projectCargoType" ||
    field === "projectRegistrationHelp" ||
    field === "projectNotes" ||
    field === "packingRequired" ||
    field === "packingScope" ||
    field === "fumigationRequired" ||
    field === "labelingBarcoding" ||
    field === "packingNotes" ||
    field === "customsBrokerage" ||
    field === "dangerousCargoNotes"
  ) {
    return 2;
  }

  return 3;
}
