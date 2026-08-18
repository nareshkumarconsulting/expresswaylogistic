import { describe, expect, it } from "vitest";
import {
  buildMissingInfoReply,
  companyFromSender,
  displayNameFromSender,
  evaluateRfqCompleteness,
  inferQuoteSubtype,
  looksLikeClientRfq,
  mapModeToServiceType,
} from "@/features/quotes/email-rfq";
import { emailIngestSchema } from "@/features/email-intelligence/schemas";
import { quoteUpdateSchema } from "@/features/quotes/schemas";

describe("looksLikeClientRfq", () => {
  it("detects RFQ language", () => {
    expect(looksLikeClientRfq("Please quote Mumbai to Jebel Ali")).toBe(true);
    expect(looksLikeClientRfq("Newsletter: August rates")).toBe(false);
  });
});

describe("inferQuoteSubtype", () => {
  it("treats customer RFQ language as client_rfq", () => {
    expect(
      inferQuoteSubtype({
        subject: "RFQ: Nhava Sheva to Rotterdam",
        body: "Please quote 1x40HQ chemicals, 18 tons.",
      }),
    ).toBe("client_rfq");
  });

  it("treats a priced carrier email as forwarder_rate", () => {
    expect(
      inferQuoteSubtype({
        subject: "Rate for QW-2401",
        body: "Please find our quote USD 1850, validity until 22 Aug.",
        extracted: { price: "1850", carrier: "Maersk" },
      }),
    ).toBe("forwarder_rate");
  });

  it("treats a checking-in email as follow_up", () => {
    expect(
      inferQuoteSubtype({
        subject: "Re: Mumbai enquiry",
        body: "Just following up — any update on the rate?",
      }),
    ).toBe("follow_up");
  });
});

describe("evaluateRfqCompleteness", () => {
  it("marks a full lane + cargo as ready for review", () => {
    const result = evaluateRfqCompleteness({
      origin: "Mumbai",
      destination: "Jebel Ali",
      weight: "18 tons",
      commodity: "chemicals",
      mode: "ocean-fcl",
      readyDate: "2026-08-20",
      incoterms: "FOB",
      confidence: 0.9,
    });
    expect(result.complete).toBe(true);
    expect(result.reviewStatus).toBe("needs_review");
    expect(result.blocking).toEqual([]);
  });

  it("requires origin, destination, and a cargo measure", () => {
    const result = evaluateRfqCompleteness({
      origin: "Mumbai",
      confidence: 0.8,
    });
    expect(result.complete).toBe(false);
    expect(result.reviewStatus).toBe("needs_info");
    expect(result.blocking).toEqual(["destination", "cargo_measure"]);
  });

  it("treats very low confidence as needs_info even when fields exist", () => {
    const result = evaluateRfqCompleteness({
      origin: "Mumbai",
      destination: "Dubai",
      weight: "2 tons",
      confidence: 0.2,
    });
    expect(result.complete).toBe(false);
    expect(result.reviewStatus).toBe("needs_info");
  });
});

describe("email RFQ helpers", () => {
  it("builds a chase reply from missing fields", () => {
    expect(
      buildMissingInfoReply({
        origin: "Mumbai",
        destination: "Dubai",
        missing: ["cargo_measure", "incoterms"],
      }),
    ).toMatch(/Mumbai → Dubai/);
  });

  it("maps ocean FCL language to ocean-fcl", () => {
    expect(mapModeToServiceType("40ft FCL")).toBe("ocean-fcl");
    expect(mapModeToServiceType("air freight")).toBe("air");
  });

  it("falls back to sender identity", () => {
    expect(
      displayNameFromSender({
        senderEmail: "priya.sharma@acme.com",
      }),
    ).toBe("Priya Sharma");
    expect(
      companyFromSender({ senderEmail: "priya.sharma@acme.com" }),
    ).toBe("Acme");
  });
});

describe("ingest and quote schemas", () => {
  it("accepts an email body on ingest", () => {
    const parsed = emailIngestSchema.safeParse({
      sourceAccount: "quotes@expresswaylogistic.com",
      senderEmail: "buyer@acme.com",
      subject: "Please quote Mumbai to Dubai",
      receivedAt: "2026-08-17T10:00:00Z",
      category: "quotation",
      body: "Need rates for 2 tons garments, FOB Nhava Sheva.",
    });
    expect(parsed.success).toBe(true);
    if (parsed.success) expect(parsed.data.body).toContain("2 tons");
  });

  it("coerces LLM confidence labels like high to a 0-1 number", () => {
    const parsed = emailIngestSchema.safeParse({
      sourceAccount: "support@expresswaylogistics.com",
      senderEmail: "nareshkumarconsulting@gmail.com",
      subject: "Please quote Mumbai to Dubai",
      receivedAt: "2026-08-18T09:19:35Z",
      category: "quotation",
      confidence: "high",
      extractedData: {
        origin: "Mumbai",
        destination: "Dubai",
        quoteNo: null,
      },
      body: "Can you send freight rates Mumbai to Dubai?",
    });
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.confidence).toBe(0.85);
      expect(parsed.data.extractedData).toEqual({
        origin: "Mumbai",
        destination: "Dubai",
      });
    }
  });

  it("accepts AI review status on quote update", () => {
    expect(
      quoteUpdateSchema.safeParse({ aiReviewStatus: "confirmed" }).success,
    ).toBe(true);
  });
});
