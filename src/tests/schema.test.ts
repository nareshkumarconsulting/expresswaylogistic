import { describe, expect, it } from "vitest";
import { siteConfig } from "@/config/site";
import {
  ORGANIZATION_ID,
  WEBSITE_ID,
  organizationSchema,
  webPageSchema,
  websiteSchema,
} from "@/lib/schema";

describe("AEO schema helpers", () => {
  it("organizationSchema includes entity disambiguation fields", () => {
    const schema = organizationSchema();

    expect(schema["@id"]).toBe(ORGANIZATION_ID);
    expect(schema.foundingDate).toBe("1987-01-01");
    expect(schema.sameAs).toEqual(Object.values(siteConfig.social));
    expect(schema.alternateName).toContain(siteConfig.legalName);
    expect(schema.contactPoint.email).toBe(siteConfig.contact.email);
  });

  it("websiteSchema links to organization and has stable @id", () => {
    const schema = websiteSchema();

    expect(schema["@id"]).toBe(WEBSITE_ID);
    expect(schema.publisher).toEqual({ "@id": ORGANIZATION_ID });
  });

  it("webPageSchema references website graph node", () => {
    const schema = webPageSchema({
      name: "About ExpressWay Logistic",
      description: "About page",
      path: "/about",
    });

    expect(schema.isPartOf).toEqual({ "@id": WEBSITE_ID });
    expect(schema.about).toEqual({ "@id": ORGANIZATION_ID });
    expect(schema.url).toBe(`${siteConfig.url}/about`);
  });
});
