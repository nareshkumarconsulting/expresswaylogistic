/** Approximate founding year — leadership carries 39+ years of international cargo experience. */
export const FOUNDING_YEAR = 1987;

export const FOUNDING_DATE = "1987-01-01";

export const WEBSITE_DOMAIN = "expresswaylogistic.com";

export const CORRESPONDENCE_EMAIL_DOMAIN = "expresswaylogistics.com";

export const EMAIL_DOMAIN_NOTE =
  "The company website is expresswaylogistic.com. Sales correspondence uses sales@expresswaylogistics.com — both domains belong to Expressway Logistic Private Limited.";

export const ENTITY_STATEMENT =
  "ExpressWay Logistic is a Neutral Logistics Provider and freight forwarding company providing PAN India import and export logistics services to worldwide destinations, including ocean freight, air freight, FCL/LCL, consolidation, customs clearance, warehousing, project cargo, EXIM advisory and door-to-door delivery.";

/** Short quotable lead that matches the AEO “is a / defined as” detector. */
export const DEFINITION_LEAD =
  "ExpressWay Logistic is a Neutral Logistics Provider and freight forwarding company connecting PAN India cargo to worldwide destinations.";

const DEFINITION_PATTERN = /\b(what is|is a|refers to|defined as|means that)\b/i;

export function withDefinitionLead(text: string): string {
  const trimmed = text.trim();
  if (DEFINITION_PATTERN.test(trimmed)) return trimmed;
  return `${DEFINITION_LEAD} ${trimmed}`;
}

/** Bump when public copy or schema changes. Drives dateModified / og:updated_time. */
export const CONTENT_UPDATED_AT = "2026-09-04";

export const GEOGRAPHIC_PROPOSITION = "PAN India → Worldwide";

export const COVERAGE_STATEMENT =
  "Serving customers across India through a nationwide logistics network, connecting Indian origins with worldwide destinations.";

export const QUOTE_RESPONSE_STATEMENT =
  "Typical response: within one business day, depending on the completeness of shipment details.";

export const EXPERIENCE_STATEMENT =
  "39+ years of international cargo experience";

export const HQ_LOCALITY = "Noida";
export const HQ_REGION = "Uttar Pradesh";
export const HQ_POSTAL_CODE = "201305";
export const HQ_COUNTRY = "IN";
export const HQ_STREET =
  "Unit No. 623, 6th Floor, Tower-1, Assotech Business Cresterra, Sector-135";
