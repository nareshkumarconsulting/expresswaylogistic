export function createQuoteReferenceId(): string {
  return `QW-${Date.now().toString(36).toUpperCase()}`;
}

export function createAppointmentReferenceId(): string {
  return `AP-${Date.now().toString(36).toUpperCase()}`;
}

/** Fixed company prefix for operational shipment / tracking IDs. */
export const SHIPMENT_ID_PREFIX = "EWLPL";

/** First serial issued in each Indian financial year. */
export const SHIPMENT_ID_START_SERIAL = 10_001;

const SHIPMENT_ID_PATTERN =
  /^EWLPL-(\d+)\/(\d{2}-\d{2})$/i;

/**
 * Indian financial year label (Apr–Mar, Asia/Kolkata), e.g. 26-27 for FY 2026–27.
 */
export function getIndianFinancialYear(date: Date = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "numeric",
  }).formatToParts(date);
  const year = Number(parts.find((part) => part.type === "year")?.value);
  const month = Number(parts.find((part) => part.type === "month")?.value);
  if (!year || !month) {
    throw new Error("Unable to resolve Indian financial year");
  }
  const startYear = month >= 4 ? year : year - 1;
  const yy = (y: number) => String(y).slice(-2);
  return `${yy(startYear)}-${yy(startYear + 1)}`;
}

export function formatShipmentId(
  serial: number,
  financialYear: string = getIndianFinancialYear(),
): string {
  return `${SHIPMENT_ID_PREFIX}-${serial}/${financialYear}`;
}

export function parseShipmentIdSerial(id: string): number | null {
  const match = id.trim().match(SHIPMENT_ID_PATTERN);
  if (!match?.[1]) return null;
  const serial = Number.parseInt(match[1], 10);
  return Number.isNaN(serial) ? null : serial;
}

export function parseShipmentIdFinancialYear(id: string): string | null {
  const match = id.trim().match(SHIPMENT_ID_PATTERN);
  return match?.[2] ?? null;
}

/**
 * Next shipment number for the current (or given) FY.
 * Series is unique within the financial year and restarts at 10001 each FY.
 */
export function createNextShipmentId(
  existingIds: string[],
  date: Date = new Date(),
): string {
  const financialYear = getIndianFinancialYear(date);
  let maxSerial = SHIPMENT_ID_START_SERIAL - 1;

  for (const id of existingIds) {
    if (parseShipmentIdFinancialYear(id) !== financialYear) continue;
    const serial = parseShipmentIdSerial(id);
    if (serial !== null && serial > maxSerial) maxSerial = serial;
  }

  return formatShipmentId(maxSerial + 1, financialYear);
}
