export type SearchIntentPage = {
  url: string;
  primaryKeyword: string;
  searchIntent: string;
  indexable: true;
};

/** Distinct intent per URL — prevents keyword cannibalisation. */
export const SEARCH_INTENT_PAGES: SearchIntentPage[] = [
  {
    url: "/",
    primaryKeyword: "international freight forwarding India",
    searchIntent: "brand + category home",
    indexable: true,
  },
  {
    url: "/services/freight-forwarding",
    primaryKeyword: "freight forwarding India",
    searchIntent: "service",
    indexable: true,
  },
  {
    url: "/services/neutral-logistics-provider",
    primaryKeyword: "Neutral Logistics Provider India",
    searchIntent: "service",
    indexable: true,
  },
  {
    url: "/services/ocean-freight",
    primaryKeyword: "ocean freight from India",
    searchIntent: "service",
    indexable: true,
  },
  {
    url: "/pan-india-logistics",
    primaryKeyword: "PAN India freight forwarding",
    searchIntent: "geography",
    indexable: true,
  },
  {
    url: "/pan-india-logistics/north-india",
    primaryKeyword: "North India freight forwarding",
    searchIntent: "regional geography",
    indexable: true,
  },
  {
    url: "/locations",
    primaryKeyword: "freight forwarding locations India",
    searchIntent: "locations hub",
    indexable: true,
  },
  {
    url: "/locations/mumbai",
    primaryKeyword: "freight forwarding in Mumbai",
    searchIntent: "local service geography",
    indexable: true,
  },
  {
    url: "/locations/icd-dadri",
    primaryKeyword: "ICD Dadri freight forwarding",
    searchIntent: "inland gateway",
    indexable: true,
  },
  {
    url: "/shipping-routes/india-to-usa",
    primaryKeyword: "India to USA freight forwarding",
    searchIntent: "route",
    indexable: true,
  },
  {
    url: "/industries/garments-apparel",
    primaryKeyword: "garment export logistics India",
    searchIntent: "industry",
    indexable: true,
  },
  {
    url: "/quote",
    primaryKeyword: "international freight quote India",
    searchIntent: "conversion",
    indexable: true,
  },
  {
    url: "/resources/guides/how-to-ship-from-india-to-usa",
    primaryKeyword: "how to ship from India to USA",
    searchIntent: "guide",
    indexable: true,
  },
  {
    url: "/resources/guides/how-to-ship-from-india-to-dubai",
    primaryKeyword: "how to ship from India to Dubai",
    searchIntent: "guide",
    indexable: true,
  },
  {
    url: "/resources/guides/fcl-vs-lcl-india-export",
    primaryKeyword: "FCL vs LCL India export",
    searchIntent: "guide",
    indexable: true,
  },
  {
    url: "/resources/case-studies",
    primaryKeyword: "freight forwarding case studies India",
    searchIntent: "proof",
    indexable: true,
  },
];
