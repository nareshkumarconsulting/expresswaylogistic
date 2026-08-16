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
    url: "/services/nvocc",
    primaryKeyword: "NVOCC India",
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
    url: "/locations/mumbai",
    primaryKeyword: "freight forwarding in Mumbai",
    searchIntent: "local service geography",
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
];
