import { describe, expect, it } from "vitest";
import {
  isQuoteQuestion,
  quoteWindow,
  selectQuotes,
} from "@/features/command-center/copilot-query";

const now = new Date("2026-10-18T07:16:00.000Z");

describe("copilot quote questions", () => {
  it("recognizes a quote list question", () => {
    expect(isQuoteQuestion("Give me the list of quotes created in the last 3 days")).toBe(
      true,
    );
    expect(isQuoteQuestion("Which shipments are at risk")).toBe(false);
  });

  it("keeps quotes from the last 3 India calendar days", () => {
    const window = quoteWindow(
      "Give me the list of quotes created in the last 3 days",
      now,
    );
    const selected = selectQuotes(
      [
        { id: "today", submittedAt: "2026-10-18T06:23:32.170Z" },
        { id: "within", submittedAt: "2026-10-16T09:52:05.587Z" },
        { id: "older", submittedAt: "2026-10-14T14:52:35.638Z" },
      ],
      window,
    );
    expect(window?.label).toBe("the last 3 days");
    expect(selected.map((quote) => quote.id)).toEqual(["today", "within"]);
  });
});
