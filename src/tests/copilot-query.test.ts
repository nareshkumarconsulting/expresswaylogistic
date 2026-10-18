import { describe, expect, it } from "vitest";
import {
  isEmailQuestion,
  isQuoteQuestion,
  mentionedDay,
  quoteReferences,
  quoteWindow,
  selectByTime,
  selectQuotes,
  selectQuotesByReference,
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

  it("finds one quote from a partial reference", () => {
    const refs = quoteReferences("can you provide details of 'MV4203WZ' for this quote");
    const selected = selectQuotesByReference(
      [{ id: "QW-MV4203WZ" }, { id: "QW-MVDFW105" }],
      refs,
    );
    expect(refs).toEqual(["mv4203wz"]);
    expect(selected.map((quote) => quote.id)).toEqual(["QW-MV4203WZ"]);
  });
});

describe("copilot email questions", () => {
  it("keeps emails received on 14 August", () => {
    expect(isEmailQuestion("can you filter email received on 14th August")).toBe(true);
    const day = mentionedDay("can you filter email received on 14th August", now);
    const selected = selectByTime(
      [
        { id: "on-day", receivedAt: "2026-08-14T10:42:29.000Z" },
        { id: "next-day", receivedAt: "2026-08-15T02:00:00.000Z" },
      ],
      (email) => email.receivedAt,
      day,
    );
    expect(day?.label).toBe("on 14 Aug 2026");
    expect(selected.map((email) => email.id)).toEqual(["on-day"]);
  });
});
