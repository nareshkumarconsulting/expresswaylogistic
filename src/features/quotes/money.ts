export function parseAmount(value: string | number | null | undefined): number | null {
  if (value == null || value === "") return null;
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }
  const parsed = Number(String(value).replace(/[₹$,\s]/g, ""));
  return Number.isFinite(parsed) ? parsed : null;
}

export function formatInr(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}

export function formatMoney(amount: number, currency = "INR"): string {
  if (currency === "INR") return formatInr(amount);
  return `${currency} ${amount.toLocaleString("en-IN")}`;
}

export function computeCustomerQuote(input: {
  amount?: number | null;
  additionalCharges?: number | null;
  discount?: number | null;
}): number | null {
  const amount = input.amount ?? null;
  if (amount == null) return null;
  return amount + (input.additionalCharges ?? 0) - (input.discount ?? 0);
}

export function computeFromForwarder(input: {
  forwarderCost?: number | null;
  margin?: number | null;
  additionalCharges?: number | null;
}): number | null {
  const cost = input.forwarderCost ?? null;
  if (cost == null) return null;
  return cost + (input.margin ?? 0) + (input.additionalCharges ?? 0);
}
