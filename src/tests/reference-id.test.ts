import { describe, expect, it } from "vitest";
import {
  createNextShipmentId,
  formatShipmentId,
  getIndianFinancialYear,
  parseShipmentIdFinancialYear,
  parseShipmentIdSerial,
} from "@/lib/reference-id";

describe("getIndianFinancialYear", () => {
  it("uses Apr–Mar boundaries", () => {
    expect(getIndianFinancialYear(new Date("2026-03-31T12:00:00+05:30"))).toBe(
      "25-26",
    );
    expect(getIndianFinancialYear(new Date("2026-04-01T12:00:00+05:30"))).toBe(
      "26-27",
    );
    expect(getIndianFinancialYear(new Date("2026-08-26T12:00:00+05:30"))).toBe(
      "26-27",
    );
  });
});

describe("createNextShipmentId", () => {
  it("starts at 10001 for an empty series", () => {
    expect(createNextShipmentId([], new Date("2026-08-26"))).toBe(
      "EWLPL-10001/26-27",
    );
  });

  it("increments within the current financial year", () => {
    expect(
      createNextShipmentId(
        ["EWLPL-10001/26-27", "EWLPL-10005/26-27", "EWLPL-10003/25-26"],
        new Date("2026-08-26"),
      ),
    ).toBe("EWLPL-10006/26-27");
  });

  it("restarts at 10001 in a new financial year", () => {
    expect(
      createNextShipmentId(
        ["EWLPL-10050/25-26"],
        new Date("2026-04-01T12:00:00+05:30"),
      ),
    ).toBe("EWLPL-10001/26-27");
  });
});

describe("shipment id parse helpers", () => {
  it("parses serial and FY", () => {
    expect(parseShipmentIdSerial("EWLPL-10001/26-27")).toBe(10001);
    expect(parseShipmentIdFinancialYear("EWLPL-10001/26-27")).toBe("26-27");
    expect(formatShipmentId(10001, "26-27")).toBe("EWLPL-10001/26-27");
  });
});
