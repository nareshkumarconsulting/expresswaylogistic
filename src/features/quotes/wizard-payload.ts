import {
  DIMENSION_UNIT_SHORT,
  INSURANCE_COVERAGE_LABELS,
  INSURANCE_COVERAGES,
  PACKAGE_TYPE_LABELS,
  PACKAGE_TYPES,
  PACKING_SCOPE_LABELS,
  PACKING_SCOPES,
  PROJECT_CARGO_TYPE_LABELS,
  PROJECT_CARGO_TYPES,
  REFERRAL_SOURCE_LABELS,
  REFERRAL_SOURCES,
  calculateCargoTotals,
  dimensionToCm,
  type CargoItemValues,
  type DimensionUnit,
  type InsuranceCoverage,
  type PackageType,
  type PackingScope,
  type ProjectCargoType,
  type ReferralSource,
} from "@/features/quote/schemas";

export type QuoteWizardCargoItem = {
  description: string;
  hsCode?: string;
  quantity: number;
  packageType?: PackageType;
  dimensionUnit: DimensionUnit;
  length: number;
  width: number;
  height: number;
  weightKg: number;
};

export type QuoteWizardPayload = {
  originPickup: boolean;
  destinationDelivery: boolean;
  cargoReadyDate?: string;
  cargoItems: QuoteWizardCargoItem[];
  insurance: boolean;
  insuranceCargoValueInr?: number;
  insuranceCoverage?: InsuranceCoverage;
  projectCargo: boolean;
  projectCargoType?: ProjectCargoType;
  projectRegistrationHelp?: boolean;
  projectNotes?: string;
  packingRequired: boolean;
  packingScope?: PackingScope;
  fumigationRequired?: boolean;
  labelingBarcoding?: boolean;
  packingNotes?: string;
  customsBrokerage: boolean;
  dangerousCargoNotes?: string;
  existingCustomer?: boolean;
  country?: string;
  state?: string;
  city?: string;
  postalCode?: string;
  address?: string;
  referralSource?: ReferralSource;
};

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function asString(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function asNumber(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }
  return undefined;
}

function asBoolean(value: unknown): boolean {
  return value === true;
}

function isPackageType(value: unknown): value is PackageType {
  return (
    typeof value === "string" &&
    (PACKAGE_TYPES as readonly string[]).includes(value)
  );
}

function isDimensionUnit(value: unknown): value is DimensionUnit {
  return value === "cm" || value === "in" || value === "mm" || value === "m";
}

function isInsuranceCoverage(value: unknown): value is InsuranceCoverage {
  return (
    typeof value === "string" &&
    (INSURANCE_COVERAGES as readonly string[]).includes(value)
  );
}

function isProjectCargoType(value: unknown): value is ProjectCargoType {
  return (
    typeof value === "string" &&
    (PROJECT_CARGO_TYPES as readonly string[]).includes(value)
  );
}

function isPackingScope(value: unknown): value is PackingScope {
  return (
    typeof value === "string" &&
    (PACKING_SCOPES as readonly string[]).includes(value)
  );
}

function isReferralSource(value: unknown): value is ReferralSource {
  return (
    typeof value === "string" &&
    (REFERRAL_SOURCES as readonly string[]).includes(value)
  );
}

function parseCargoItem(value: unknown): QuoteWizardCargoItem | null {
  const record = asRecord(value);
  if (!record) return null;
  const description = asString(record.description);
  if (!description) return null;
  return {
    description,
    hsCode: asString(record.hsCode),
    quantity: asNumber(record.quantity) ?? 0,
    packageType: isPackageType(record.packageType)
      ? record.packageType
      : undefined,
    dimensionUnit: isDimensionUnit(record.dimensionUnit)
      ? record.dimensionUnit
      : "cm",
    length: asNumber(record.length) ?? 0,
    width: asNumber(record.width) ?? 0,
    height: asNumber(record.height) ?? 0,
    weightKg: asNumber(record.weightKg) ?? 0,
  };
}

export function parseQuoteWizardPayload(
  payload: unknown,
): QuoteWizardPayload | null {
  const record = asRecord(payload);
  if (!record || !Array.isArray(record.cargoItems)) return null;

  return {
    originPickup: asBoolean(record.originPickup),
    destinationDelivery: asBoolean(record.destinationDelivery),
    cargoReadyDate: asString(record.cargoReadyDate),
    cargoItems: record.cargoItems
      .map(parseCargoItem)
      .filter((item): item is QuoteWizardCargoItem => item != null),
    insurance: asBoolean(record.insurance),
    insuranceCargoValueInr: asNumber(record.insuranceCargoValueInr),
    insuranceCoverage: isInsuranceCoverage(record.insuranceCoverage)
      ? record.insuranceCoverage
      : undefined,
    projectCargo: asBoolean(record.projectCargo),
    projectCargoType: isProjectCargoType(record.projectCargoType)
      ? record.projectCargoType
      : undefined,
    projectRegistrationHelp: asBoolean(record.projectRegistrationHelp),
    projectNotes: asString(record.projectNotes),
    packingRequired: asBoolean(record.packingRequired),
    packingScope: isPackingScope(record.packingScope)
      ? record.packingScope
      : undefined,
    fumigationRequired: asBoolean(record.fumigationRequired),
    labelingBarcoding: asBoolean(record.labelingBarcoding),
    packingNotes: asString(record.packingNotes),
    customsBrokerage: asBoolean(record.customsBrokerage),
    dangerousCargoNotes: asString(record.dangerousCargoNotes),
    existingCustomer:
      record.existingCustomer === true
        ? true
        : record.existingCustomer === false
          ? false
          : undefined,
    country: asString(record.country),
    state: asString(record.state),
    city: asString(record.city),
    postalCode: asString(record.postalCode),
    address: asString(record.address),
    referralSource: isReferralSource(record.referralSource)
      ? record.referralSource
      : undefined,
  };
}

export function formatWizardCompanyAddress(
  wizard: QuoteWizardPayload,
): string | undefined {
  const parts = [
    wizard.address,
    wizard.city,
    wizard.state,
    wizard.postalCode,
    wizard.country,
  ].filter((part): part is string => Boolean(part));
  return parts.length > 0 ? parts.join(", ") : undefined;
}

export function cargoItemCbm(item: QuoteWizardCargoItem): number {
  const length = dimensionToCm(item.length, item.dimensionUnit);
  const width = dimensionToCm(item.width, item.dimensionUnit);
  const height = dimensionToCm(item.height, item.dimensionUnit);
  return ((length * width * height) / 1_000_000) * (item.quantity || 0);
}

export function formatCargoItemDimensions(item: QuoteWizardCargoItem): string {
  const unit = DIMENSION_UNIT_SHORT[item.dimensionUnit];
  return `${item.length} × ${item.width} × ${item.height} ${unit}`;
}

export function formatCargoItemPackageType(
  item: QuoteWizardCargoItem,
): string | undefined {
  return item.packageType ? PACKAGE_TYPE_LABELS[item.packageType] : undefined;
}

export function wizardCargoTotals(items: QuoteWizardCargoItem[]) {
  return calculateCargoTotals(items as CargoItemValues[]);
}

export function insuranceLabel(wizard: QuoteWizardPayload): string | undefined {
  if (!wizard.insurance) return undefined;
  return wizard.insuranceCoverage
    ? INSURANCE_COVERAGE_LABELS[wizard.insuranceCoverage]
    : "Cargo insurance requested";
}

export function projectCargoLabel(wizard: QuoteWizardPayload): string | undefined {
  if (!wizard.projectCargo) return undefined;
  return wizard.projectCargoType
    ? PROJECT_CARGO_TYPE_LABELS[wizard.projectCargoType]
    : "Project cargo handling";
}

export function packingLabel(wizard: QuoteWizardPayload): string | undefined {
  if (!wizard.packingRequired) return undefined;
  const scope = wizard.packingScope
    ? PACKING_SCOPE_LABELS[wizard.packingScope]
    : "Packing & handling";
  const extras = [
    wizard.fumigationRequired ? "fumigation" : null,
    wizard.labelingBarcoding ? "labeling & barcoding" : null,
  ].filter((part): part is string => part != null);
  return extras.length > 0 ? `${scope} (+${extras.join(", ")})` : scope;
}

export function referralLabel(wizard: QuoteWizardPayload): string | undefined {
  return wizard.referralSource
    ? REFERRAL_SOURCE_LABELS[wizard.referralSource]
    : undefined;
}
