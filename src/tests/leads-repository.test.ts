import { describe, expect, it } from "vitest";
import type { QuoteFormValues } from "@/features/contact/schemas";
import {
  buildQuoteWizardMessage,
  mapAppointmentRowToCalendarEvent,
  mapContactFormToQuoteInsert,
  mapTransportModeToServiceType,
} from "@/services/leads-repository";
import type { QuoteWizardValues } from "@/features/quote/schemas";

describe("leads-repository mappers", () => {
  it("maps transport mode to quote service type", () => {
    expect(mapTransportModeToServiceType("air")).toBe("air");
    expect(mapTransportModeToServiceType("lcl")).toBe("ocean-lcl");
    expect(mapTransportModeToServiceType("fcl")).toBe("ocean-fcl");
  });

  it("maps contact form values to a quote insert row", () => {
    const form: QuoteFormValues = {
      name: "Priya Sharma",
      company: "Tech Mahindra",
      companyAddress: "Pune, Maharashtra",
      email: "priya@example.com",
      phone: "+91 9876543210",
      origin: "Pune",
      destination: "Sydney",
      serviceType: "air",
      productType: "engineering",
      totalPackages: 3,
      approxWeight: "120 kg",
      valueInr: 250000,
      message: "Urgent air freight for electronics",
    };

    const row = mapContactFormToQuoteInsert(form, "QW-TEST");

    expect(row.id).toBe("QW-TEST");
    expect(row.source).toBe("contact_form");
    expect(row.service_type).toBe("air");
    expect(row.product_type).toBe("engineering");
    expect(row.value_inr).toBe(250000);
  });

  it("maps appointment rows to calendar events", () => {
    const event = mapAppointmentRowToCalendarEvent({
      id: "AP-TEST-1",
      source: "form",
      status: "pending",
      name: "Priya Sharma",
      company: "Tech Mahindra",
      email: "priya@example.com",
      phone: "+91 9876543210",
      appointment_type: "freight-planning",
      preferred_date: "2026-08-15",
      preferred_time: "10:00",
      meeting_mode: "video",
      notes: "Mumbai to Dubai lane",
      payload: {},
      created_at: "2026-08-11T10:00:00.000Z",
      updated_at: "2026-08-11T10:00:00.000Z",
    });

    expect(event.kind).toBe("appointment");
    expect(event.title).toBe("Freight Planning — Tech Mahindra");
    expect(event.date).toBe("2026-08-15");
    expect(event.startTime).toBe("10:00");
    expect(event.status).toBe("pending");
    expect(event.relatedId).toBe("AP-TEST-1");
  });

  it("builds a readable summary for quote wizard submissions", () => {
    const wizard = {
      transportMode: "air",
      cargoReadyDate: "2026-08-15",
      cargoItems: [
        {
          description: "Electronics",
          quantity: 2,
          packageType: "carton",
          dimensionUnit: "cm",
          length: 40,
          width: 30,
          height: 20,
          weightKg: 12,
        },
      ],
      insurance: false,
      projectCargo: false,
      packingRequired: false,
      customsBrokerage: true,
    } as QuoteWizardValues;

    const message = buildQuoteWizardMessage(wizard);

    expect(message).toContain("Air Freight");
    expect(message).toContain("2026-08-15");
    expect(message).toContain("Customs brokerage");
  });
});
