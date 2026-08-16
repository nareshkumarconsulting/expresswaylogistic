import { describe, expect, it } from "vitest";
import {
  computeCustomerQuote,
  computeFromForwarder,
  formatInr,
  parseAmount,
} from "@/features/quotes/money";
import { quoteUpdateSchema, sendToForwardersSchema } from "@/features/quotes/schemas";

describe("parseAmount", () => {
  it("parses Indian formatted amounts", () => {
    expect(parseAmount("₹26,500")).toBe(26500);
  });
});

describe("quote math", () => {
  it("computes customer quote with charges and discount", () => {
    expect(
      computeCustomerQuote({
        amount: 25000,
        additionalCharges: 700,
        discount: 200,
      }),
    ).toBe(25500);
  });

  it("computes customer quote from forwarder cost", () => {
    expect(
      computeFromForwarder({
        forwarderCost: 21800,
        margin: 3500,
        additionalCharges: 700,
      }),
    ).toBe(26000);
  });

  it("formats INR", () => {
    expect(formatInr(26000)).toContain("26,000");
  });
});

describe("quoteUpdateSchema", () => {
  it("accepts new workflow statuses", () => {
    const parsed = quoteUpdateSchema.safeParse({
      status: "Quote Ready / Email Failed",
      quotedAmount: "₹26,500",
    });
    expect(parsed.success).toBe(true);
  });

  it("requires forwarder ids", () => {
    expect(sendToForwardersSchema.safeParse({ forwarderIds: [] }).success).toBe(
      false,
    );
  });
});
