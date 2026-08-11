import { describe, expect, it, vi } from "vitest";
import {
  formatZodFlattenErrors,
  getAppointmentStepForField,
  getQuoteWizardStepForField,
  scrollToFormField,
  scrollToFormTop,
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

describe("getAppointmentStepForField", () => {
  it("maps purpose fields to step 0", () => {
    expect(getAppointmentStepForField("appointmentType")).toBe(0);
  });

  it("maps schedule fields to step 1", () => {
    expect(getAppointmentStepForField("preferredDate")).toBe(1);
    expect(getAppointmentStepForField("meetingMode")).toBe(1);
  });

  it("maps contact fields to step 2", () => {
    expect(getAppointmentStepForField("email")).toBe(2);
  });
});

describe("scrollToFormField", () => {
  it("scrolls to a field by id", () => {
    document.body.innerHTML = `
      <form id="test-form">
        <input id="email" type="email" />
      </form>
    `;

    const form = document.getElementById("test-form") as HTMLFormElement;
    const input = document.getElementById("email") as HTMLInputElement;
    input.scrollIntoView = vi.fn();
    input.focus = vi.fn();

    expect(scrollToFormField("email", { form })).toBe(true);
    expect(input.scrollIntoView).toHaveBeenCalledWith({
      behavior: "smooth",
      block: "center",
    });
    expect(input.focus).toHaveBeenCalledWith({ preventScroll: true });
  });

  it("falls back to the first invalid field", () => {
    document.body.innerHTML = `
      <form id="test-form">
        <input id="name" aria-invalid="true" />
      </form>
    `;

    const form = document.getElementById("test-form") as HTMLFormElement;
    const input = document.getElementById("name") as HTMLInputElement;
    input.scrollIntoView = vi.fn();
    input.focus = vi.fn();

    expect(scrollToFormField(null, { form })).toBe(true);
    expect(input.scrollIntoView).toHaveBeenCalled();
  });
});

describe("scrollToFormTop", () => {
  it("scrolls the form into view", () => {
    document.body.innerHTML = `<form id="test-form"></form>`;
    const form = document.getElementById("test-form") as HTMLFormElement;
    form.scrollIntoView = vi.fn();

    scrollToFormTop(form);

    expect(form.scrollIntoView).toHaveBeenCalledWith({
      behavior: "smooth",
      block: "start",
    });
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
