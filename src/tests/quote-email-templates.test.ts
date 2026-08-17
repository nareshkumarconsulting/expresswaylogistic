import { describe, expect, it } from "vitest";
import { siteConfig } from "@/config/site";
import {
  customerQuoteEmail,
  customerReceivedEmail,
  forwarderRfqEmail,
} from "@/features/quotes/email-templates";
import type { Forwarder, QuoteRequest } from "@/types";

const quote: QuoteRequest = {
  id: "QW-TEST",
  name: "Naresh Kumar",
  company: "nareshkumarconsulting.com",
  email: "nareshsam02@gmail.com",
  origin: "Noida",
  destination: "Dubai",
  serviceType: "ocean-fcl",
  message: "Computer Parts",
  status: "New",
  submittedAt: "2026-08-17T08:47:00.000Z",
  originPickup: true,
  destinationDelivery: false,
  quoteValidity: "7 days",
  currency: "INR",
  wizard: {
    originPickup: true,
    destinationDelivery: false,
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
    insurance: false,
    projectCargo: false,
    packingRequired: false,
    customsBrokerage: false,
  },
};

const forwarder: Forwarder = {
  id: "fwd-1",
  companyName: "ABC Logistics",
  contactPerson: "Suresh Nair",
  email: "suresh.nair@example.com",
  serviceTypes: ["ocean-fcl"],
  originLocations: ["Noida"],
  destinationLocations: ["Dubai"],
  status: "Active",
  createdAt: "2026-08-17T00:00:00.000Z",
  updatedAt: "2026-08-17T00:00:00.000Z",
};

describe("quote email templates", () => {
  it("sends a professional customer quotation letter", () => {
    const email = customerQuoteEmail(quote, 26500);

    expect(email.text).toContain("Dear Naresh Kumar,");
    expect(email.text).toContain(
      "Thank you for reaching out to ExpressWay Logistic for your shipment requirement.",
    );
    expect(email.text).toContain(
      "We are pleased to share our quotation for the requested shipment from Noida to Dubai.",
    );
    expect(email.text).toContain("Quotation Details");
    expect(email.text).toContain("Origin pickup: Required");
    expect(email.text).toContain("HS 8473.30");
    expect(email.text).toContain(
      "We hope the above quotation meets your requirements.",
    );
    expect(email.text).toContain(
      "Thank you for considering ExpressWay Logistic. We look forward to serving you and building a long-term business relationship.",
    );
    expect(email.text).toContain("Regards,");
    expect(email.text).toContain(siteConfig.contact.address);
    expect(email.text).toContain(siteConfig.contact.phone);
    expect(email.text).toContain(siteConfig.contact.email);
    expect(email.html).toContain("Dear Naresh Kumar,");
    expect(email.html).toContain("Quotation Details");
  });

  it("acknowledges the requester professionally", () => {
    const email = customerReceivedEmail(quote);
    expect(email.text).toContain("Dear Naresh Kumar,");
    expect(email.text).toContain(
      "Thank you for reaching out to ExpressWay Logistic for your shipment requirement.",
    );
    expect(email.text).toContain("Regards,");
    expect(email.text).toContain(siteConfig.contact.email);
  });

  it("sends a professional forwarder RFQ with the same sign-off", () => {
    const email = forwarderRfqEmail(quote, forwarder, "20 Aug 2026");
    expect(email.text).toContain("Dear Suresh Nair,");
    expect(email.text).toContain(
      "We are requesting a freight quotation for a shipment from Noida to Dubai.",
    );
    expect(email.text).toContain("Shipment Details");
    expect(email.text).toContain("Origin pickup: Required");
    expect(email.text).toContain("Regards,");
    expect(email.text).toContain(siteConfig.contact.address);
    expect(email.text).toContain(siteConfig.contact.phone);
    expect(email.text).toContain(siteConfig.contact.email);
  });
});
