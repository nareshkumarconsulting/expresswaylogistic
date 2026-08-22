import { describe, expect, it } from "vitest";
import type { QuoteFormValues } from "@/features/contact/schemas";
import {
  buildQuoteWizardMessage,
  mapAppointmentRowToCalendarEvent,
  mapContactFormToQuoteInsert,
  mapQuoteWizardToQuoteInsert,
  mapTransportModeToServiceType,
} from "@/services/leads-repository";
import type { QuoteWizardValues } from "@/features/quote/schemas";
import { parseQuoteWizardPayload } from "@/features/quotes/wizard-payload";

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
      originPickup: true,
      destinationDelivery: false,
      incoterm: "CIF",
      insurance: false,
      projectCargo: false,
      packingRequired: false,
      customsBrokerage: true,
    } as QuoteWizardValues;

    const message = buildQuoteWizardMessage(wizard);

    expect(message).toContain("Air Freight");
    expect(message).toContain("2026-08-15");
    expect(message).toContain("CIF");
    expect(message).toContain("Customs brokerage");
    expect(message).toContain("Need origin pickup");
    expect(message).not.toContain("Need destination delivery");
  });

  it("maps quote wizard pickup, delivery, cargo totals, and payload", () => {
    const wizard = {
      firstName: "Naresh",
      lastName: "Kumar",
      company: "nareshkumarconsulting.com",
      email: "nareshsam02@gmail.com",
      phone: "+19958696357",
      origin: "Mumbai",
      destination: "Ghana",
      originPickup: true,
      destinationDelivery: true,
      incoterm: "FOB",
      transportMode: "fcl",
      cargoReadyDate: "2026-08-20",
      cargoItems: [
        {
          description: "Computer Parts",
          hsCode: "8473.30",
          quantity: 300,
          packageType: "carton",
          dimensionUnit: "cm",
          length: 200,
          width: 400,
          height: 100,
          weightKg: 1200,
        },
      ],
      insurance: true,
      insuranceCoverage: "all-risk",
      insuranceCargoValueInr: 1500000,
      projectCargo: false,
      packingRequired: false,
      customsBrokerage: false,
      address: "D-1101, Fusion Homes Tech zone IV",
      city: "Greater Noida West",
      state: "Uttar Pradesh",
      postalCode: "201318",
      country: "India",
    } as QuoteWizardValues;

    const row = mapQuoteWizardToQuoteInsert(wizard, "QW-TEST-FCL");
    const parsed = parseQuoteWizardPayload(row.payload);

    expect(row.pickup_location).toBe("Need origin pickup");
    expect(row.delivery_location).toBe("Need destination delivery");
    expect(row.approx_weight).toBe("360000.0 KG · 2400.000 CBM");
    expect(row.total_packages).toBe(300);
    expect(row.company_address).toContain("Greater Noida West");
    expect(parsed?.originPickup).toBe(true);
    expect(parsed?.destinationDelivery).toBe(true);
    expect(parsed?.incoterm).toBe("FOB");
    expect(parsed?.cargoItems[0]?.hsCode).toBe("8473.30");
    expect(parsed?.insuranceCoverage).toBe("all-risk");
  });
});
