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
    field === "destinationDelivery"
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
