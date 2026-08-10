import { describe, expect, it } from "vitest";
import {
  formatZodFlattenErrors,
  getQuoteWizardStepForField,
} from "@/lib/form-errors";

describe("formatZodFlattenErrors", () => {
  it("formats field errors with friendly labels", () => {
    const messages = formatZodFlattenErrors({
      formErrors: [],
      fieldErrors: {
        referralSource: ["Tell us how you heard about us"],
        "cargoItems.0.length": ["Length must be greater than zero"],
      },
    });

    expect(messages).toEqual([
      "How you heard about us: Tell us how you heard about us",
      "Line 1 — Length: Length must be greater than zero",
    ]);
  });
});

describe("getQuoteWizardStepForField", () => {
  it("maps cargo fields to step 0", () => {
    expect(getQuoteWizardStepForField("cargoItems.0.height")).toBe(0);
  });

  it("maps contact fields to step 3", () => {
    expect(getQuoteWizardStepForField("email")).toBe(3);
  });

  it("maps insurance and packing fields to step 2", () => {
    expect(getQuoteWizardStepForField("insuranceCoverage")).toBe(2);
    expect(getQuoteWizardStepForField("projectCargoType")).toBe(2);
    expect(getQuoteWizardStepForField("packingScope")).toBe(2);
  });
});
