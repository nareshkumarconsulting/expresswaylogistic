import { describe, expect, it } from "vitest";
import { DEFINITION_LEAD, withDefinitionLead } from "@/constants/entity";
import { documentDescription, documentTitle } from "@/lib/seo";

describe("visibility SEO helpers", () => {
  it("keeps titles inside the 30–65 character window", () => {
    const title = documentTitle(
      "International Freight Forwarding & Neutral Logistics Provider in India | ExpressWay Logistic",
    );
    expect(title.length).toBeGreaterThanOrEqual(30);
    expect(title.length).toBeLessThanOrEqual(65);
  });

  it("keeps meta descriptions inside 70–160 characters", () => {
    const description = documentDescription(
      "ExpressWay Logistic provides PAN India freight forwarding as a Neutral Logistics Provider, with ocean & air freight, customs clearance, EXIM advisory, project cargo and door-to-door logistics to worldwide destinations.",
    );
    expect(description.length).toBeGreaterThanOrEqual(70);
    expect(description.length).toBeLessThanOrEqual(160);
  });

  it("adds an AEO definition lead when copy lacks is-a language", () => {
    expect(withDefinitionLead("Connect cargo from India to worldwide destinations.")).toContain(
      "is a",
    );
    expect(withDefinitionLead(DEFINITION_LEAD)).toBe(DEFINITION_LEAD);
  });
});
