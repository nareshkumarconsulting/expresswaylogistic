import { describe, expect, it } from "vitest";
import { buildSiteCorpus } from "@/features/rag/corpus-site";
import { buildOpsCorpus } from "@/features/rag/corpus-ops";
import { retrieveDocuments } from "@/features/rag/retrieve";
import { tokenize } from "@/features/rag/tokenize";
import type { ManagedShipment, QuoteRequest } from "@/types";

describe("rag tokenize", () => {
  it("drops stop words and keeps logistics tokens", () => {
    expect(tokenize("How many shipments completed in Dubai")).toEqual([
      "shipments",
      "completed",
      "dubai",
    ]);
  });
});

describe("rag retrieve", () => {
  it("ranks ocean freight FAQ above unrelated company stats", () => {
    const corpus = buildSiteCorpus();
    const hits = retrieveDocuments(
      corpus,
      "What documents are required for international shipping from India?",
      5,
    );
    expect(hits.length).toBeGreaterThan(0);
    expect(hits[0]?.kind).toBe("faq");
    expect(hits[0]?.title.toLowerCase()).toContain("documents");
  });

  it("finds a shipment by client and lane from ops corpus", () => {
    const shipments = [
      {
        id: "EWLPL-10001/26-27",
        origin: "Nhava Sheva",
        destination: "Jebel Ali",
        type: "Ocean Freight",
        status: "In Transit",
        eta: "3 days",
        client: "Acme Exports",
        createdAt: "2026-09-01T10:00:00.000Z",
        updatedAt: "2026-09-10T10:00:00.000Z",
        contactName: "Riya",
        contactEmail: "riya@acme.test",
        bookingBasis: "export",
      },
      {
        id: "EWLPL-10002/26-27",
        origin: "Delhi",
        destination: "Frankfurt",
        type: "Air Freight",
        status: "Delivered",
        eta: "Due",
        client: "Nordic Pharma",
        createdAt: "2026-08-01T10:00:00.000Z",
        updatedAt: "2026-08-20T10:00:00.000Z",
        contactName: "Sam",
        contactEmail: "sam@nordic.test",
        bookingBasis: "export",
      },
    ] as ManagedShipment[];

    const hits = retrieveDocuments(
      buildOpsCorpus({ shipments }),
      "Acme shipment to Jebel Ali",
      3,
    );
    expect(hits[0]?.id).toBe("shipment-EWLPL-10001/26-27");
  });

  it("retrieves quote requests by company name", () => {
    const quotes = [
      {
        id: "QW-MV4203WZ",
        name: "Anita",
        company: "Bright Leather Co",
        email: "anita@bright.test",
        origin: "Kanpur",
        destination: "Hamburg",
        serviceType: "ocean-fcl",
        message: "Finished leather",
        status: "New",
        submittedAt: "2026-10-01T08:00:00.000Z",
      },
    ] as QuoteRequest[];

    const hits = retrieveDocuments(
      buildOpsCorpus({ quotes }),
      "quote for Bright Leather ocean to Hamburg",
      2,
    );
    expect(hits[0]?.id).toBe("quote-QW-MV4203WZ");
  });
});
