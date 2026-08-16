export type LocationKind = "office" | "city" | "port";

export type LocationPage = {
  slug: string;
  name: string;
  kind: LocationKind;
  region: "north-india" | "west-india" | "south-india" | "east-india";
  h1: string;
  seoTitle: string;
  seoDescription: string;
  directAnswer: string;
  body: string;
  isHeadquarters?: boolean;
};

export type RegionPage = {
  slug: "north-india" | "west-india" | "south-india" | "east-india";
  name: string;
  h1: string;
  seoTitle: string;
  seoDescription: string;
  directAnswer: string;
  body: string;
  hubs: string[];
};

export type RoutePage = {
  slug: string;
  origin: "India";
  destination: string;
  destinationCountry: string;
  h1: string;
  seoTitle: string;
  seoDescription: string;
  directAnswer: string;
  body: string;
  relatedServiceIds: readonly string[];
  relatedIndustrySlugs: readonly string[];
};

export const REGIONS: RegionPage[] = [
  {
    slug: "north-india",
    name: "North India",
    h1: "North India Freight Forwarding for Worldwide Shipping",
    seoTitle: "North India Freight Forwarding | ExpressWay Logistic",
    seoDescription:
      "Freight forwarding for customers in North India — inland pickup, NCR connectivity, and ocean or air movement to worldwide destinations through ExpressWay’s logistics network.",
    directAnswer:
      "ExpressWay Logistic supports customers in North India through a nationwide logistics network, connecting inland origins with Indian ports and airports and onwards to worldwide destinations. Headquarters are in Noida; other North Indian cities are served as origin and destination points, not as claimed branch offices.",
    body: "North India cargo often moves from factories and warehouses in Delhi NCR, including Noida, to gateway ports and airports. ExpressWay coordinates inland pickup, documentation and main carriage (ocean or air) without implying a physical office in every city listed on this site.",
    hubs: ["Noida (headquarters)", "Delhi NCR", "inland pickup to west-coast and other Indian gateways"],
  },
  {
    slug: "west-india",
    name: "West India",
    h1: "West India Freight Forwarding for Worldwide Shipping",
    seoTitle: "West India Freight Forwarding | ExpressWay Logistic",
    seoDescription:
      "Freight forwarding for customers in West India, including Mumbai, Nhava Sheva and Mundra gateway cargo, connecting Indian origins with worldwide destinations.",
    directAnswer:
      "ExpressWay Logistic supports West India cargo through the logistics network, including commercially important gateways such as Mumbai, Nhava Sheva and Mundra. These are service geographies for pickup, port movement and documentation — not a claim of ExpressWay-owned offices at every port.",
    body: "West India is central to India’s containerised ocean trade. Cargo from Gujarat, Maharashtra and nearby origins often gates through Nhava Sheva or Mundra. ExpressWay books ocean and air, coordinates customs paperwork, and arranges inland pickup through the network.",
    hubs: ["Mumbai", "Nhava Sheva (JNPA)", "Mundra", "Ahmedabad"],
  },
  {
    slug: "south-india",
    name: "South India",
    h1: "South India Freight Forwarding for Worldwide Shipping",
    seoTitle: "South India Freight Forwarding | ExpressWay Logistic",
    seoDescription:
      "Freight forwarding for customers in South India — Chennai, Bengaluru, Hyderabad and connected ports and airports — to worldwide destinations.",
    directAnswer:
      "ExpressWay Logistic supports customers in South India through the nationwide logistics network, connecting Chennai, Bengaluru, Hyderabad and related origins with worldwide destinations by ocean or air.",
    body: "South India origins include manufacturing and IT-adjacent cargo as well as traditional export commodities. Chennai is a major ocean gateway; Bengaluru and Hyderabad are important inland and air origins. Service coverage does not mean a local ExpressWay office in each city.",
    hubs: ["Chennai", "Bengaluru", "Hyderabad"],
  },
  {
    slug: "east-india",
    name: "East India",
    h1: "East India Freight Forwarding for Worldwide Shipping",
    seoTitle: "East India Freight Forwarding | ExpressWay Logistic",
    seoDescription:
      "Freight forwarding for customers in East India, including Kolkata gateway cargo, connecting Indian origins with worldwide destinations.",
    directAnswer:
      "ExpressWay Logistic supports East India cargo through the logistics network, including Kolkata as a commercially relevant port and city origin, connecting Indian cargo with worldwide destinations.",
    body: "East India cargo may gate through Kolkata or move inland to other Indian ports depending on commodity and sailing. ExpressWay coordinates documentation, pickup and ocean or air booking without listing unverified branch offices.",
    hubs: ["Kolkata"],
  },
];

export const LOCATIONS: LocationPage[] = [
  {
    slug: "noida",
    name: "Noida",
    kind: "office",
    region: "north-india",
    isHeadquarters: true,
    h1: "ExpressWay Logistic Headquarters in Noida",
    seoTitle: "Freight Forwarding in Noida | ExpressWay Logistic",
    seoDescription:
      "ExpressWay Logistic headquarters in Noida, Uttar Pradesh — PAN India freight forwarding and NVOCC services connecting Indian origins with worldwide destinations.",
    directAnswer:
      "ExpressWay Logistic’s headquarters are in Noida, Uttar Pradesh. The office is the registered operating location for appointments and correspondence. Commercial coverage is PAN India to worldwide destinations, not Noida-only freight.",
    body: "The Noida office is at Unit No. 623, 6th Floor, Tower-1, Assotech Business Cresterra, Sector-135, Noida, G.B. Nagar, Uttar Pradesh 201305. Use this page for office location and North India origin context. For service coverage across India, see PAN India logistics.",
  },
  {
    slug: "delhi-ncr",
    name: "Delhi NCR",
    kind: "city",
    region: "north-india",
    h1: "Freight Forwarding for Customers in Delhi NCR",
    seoTitle: "Freight Forwarding in Delhi NCR | ExpressWay Logistic",
    seoDescription:
      "Freight forwarding services for customers in Delhi NCR — inland pickup, documentation and ocean or air movement to worldwide destinations.",
    directAnswer:
      "ExpressWay Logistic provides freight forwarding services for customers in Delhi NCR through the nationwide logistics network, with headquarters in Noida. This is origin/destination coverage, not a second claimed office in every NCR district.",
    body: "Delhi NCR cargo typically moves from factories and warehouses to Indian ports and airports. ExpressWay books ocean and air, prepares documentation and coordinates customs for import and export from this catchment.",
  },
  {
    slug: "mumbai",
    name: "Mumbai",
    kind: "city",
    region: "west-india",
    h1: "Freight Forwarding for Customers in Mumbai",
    seoTitle: "Freight Forwarding in Mumbai | ExpressWay Logistic",
    seoDescription:
      "Freight forwarding services for customers in Mumbai — ocean and air cargo, documentation and customs coordination to worldwide destinations.",
    directAnswer:
      "ExpressWay Logistic provides freight forwarding services for customers in Mumbai through its logistics network, including connectivity to nearby ocean gateways. This page does not claim a Mumbai branch office.",
    body: "Mumbai is a commercial and logistics hub. Cargo from Mumbai and surrounding origins often uses Nhava Sheva for ocean and Mumbai airport for air. ExpressWay coordinates booking, documents and clearance for those movements.",
  },
  {
    slug: "nhava-sheva",
    name: "Nhava Sheva",
    kind: "port",
    region: "west-india",
    h1: "Nhava Sheva Ocean Freight Coordination",
    seoTitle: "Freight Forwarding in Nhava Sheva | ExpressWay Logistic",
    seoDescription:
      "Ocean freight, FCL/LCL, customs and inland pickup coordination for cargo moving via Nhava Sheva (JNPA).",
    directAnswer:
      "ExpressWay Logistic supports ocean freight moving via Nhava Sheva, including FCL/LCL, documentation, customs coordination and inland pickup through the logistics network. This describes port cargo handling, not an ExpressWay-owned terminal.",
    body: "Nhava Sheva (JNPA) is a primary Indian container gateway. ExpressWay books ocean space, aligns export or import documents, and coordinates inland movement to or from the port. Customs requirements remain shipment-specific.",
  },
  {
    slug: "mundra",
    name: "Mundra",
    kind: "port",
    region: "west-india",
    h1: "Mundra Port Ocean Freight Coordination",
    seoTitle: "Freight Forwarding in Mundra | ExpressWay Logistic",
    seoDescription:
      "Ocean freight, FCL/LCL, customs and inland pickup coordination for cargo moving via Mundra Port.",
    directAnswer:
      "ExpressWay Logistic supports cargo moving via Mundra Port — FCL/LCL, documentation, customs coordination and inland pickup through the logistics network. No claim is made of an ExpressWay-owned Mundra office.",
    body: "Mundra is a major west-coast container gateway, especially for north and west Indian cargo. ExpressWay coordinates ocean booking and paperwork for shipments that gate through Mundra.",
  },
  {
    slug: "chennai",
    name: "Chennai",
    kind: "city",
    region: "south-india",
    h1: "Freight Forwarding for Customers in Chennai",
    seoTitle: "Freight Forwarding in Chennai | ExpressWay Logistic",
    seoDescription:
      "Freight forwarding services for customers in Chennai — ocean and air cargo, port coordination and documentation to worldwide destinations.",
    directAnswer:
      "ExpressWay Logistic provides freight forwarding services for customers in Chennai through the logistics network, including ocean movements associated with Chennai Port. This is service coverage, not a claimed Chennai branch unless separately verified.",
    body: "Chennai is a South India ocean and industrial gateway. ExpressWay books freight, coordinates documents and customs, and arranges inland pickup through the network.",
  },
  {
    slug: "kolkata",
    name: "Kolkata",
    kind: "city",
    region: "east-india",
    h1: "Freight Forwarding for Customers in Kolkata",
    seoTitle: "Freight Forwarding in Kolkata | ExpressWay Logistic",
    seoDescription:
      "Freight forwarding services for customers in Kolkata — ocean and air cargo and documentation to worldwide destinations.",
    directAnswer:
      "ExpressWay Logistic provides freight forwarding services for customers in Kolkata through the logistics network, including cargo associated with Kolkata Port. This page does not claim a Kolkata branch office.",
    body: "Kolkata remains a relevant east-coast gateway for certain commodities and inland catchments. ExpressWay coordinates ocean or air booking and EXIM documents for customers shipping from or to this region.",
  },
  {
    slug: "ahmedabad",
    name: "Ahmedabad",
    kind: "city",
    region: "west-india",
    h1: "Freight Forwarding for Customers in Ahmedabad",
    seoTitle: "Freight Forwarding in Ahmedabad | ExpressWay Logistic",
    seoDescription:
      "Freight forwarding services for customers in Ahmedabad — inland origin cargo connected to west-coast ports and worldwide destinations.",
    directAnswer:
      "ExpressWay Logistic provides freight forwarding services for customers in Ahmedabad through the nationwide logistics network, typically connecting inland cargo to west-coast ocean gateways or air services.",
    body: "Ahmedabad-origin cargo often moves to Mundra or Nhava Sheva for ocean export. ExpressWay handles booking and documentation; inland haulage is arranged through the network.",
  },
  {
    slug: "hyderabad",
    name: "Hyderabad",
    kind: "city",
    region: "south-india",
    h1: "Freight Forwarding for Customers in Hyderabad",
    seoTitle: "Freight Forwarding in Hyderabad | ExpressWay Logistic",
    seoDescription:
      "Freight forwarding services for customers in Hyderabad — inland pickup, air and ocean options to worldwide destinations.",
    directAnswer:
      "ExpressWay Logistic provides freight forwarding services for customers in Hyderabad through the logistics network. Hyderabad is an inland origin and air catchment, not listed here as an ExpressWay office.",
    body: "Hyderabad cargo may move by air from the local airport or inland to a coastal gateway for ocean. ExpressWay maps mode to cargo and deadline, then books and documents the move.",
  },
  {
    slug: "bengaluru",
    name: "Bengaluru",
    kind: "city",
    region: "south-india",
    h1: "Freight Forwarding for Customers in Bengaluru",
    seoTitle: "Freight Forwarding in Bengaluru | ExpressWay Logistic",
    seoDescription:
      "Freight forwarding services for customers in Bengaluru — air and ocean options connecting inland origins with worldwide destinations.",
    directAnswer:
      "ExpressWay Logistic provides freight forwarding services for customers in Bengaluru through the logistics network. This is origin coverage, not a claimed Bengaluru branch office.",
    body: "Bengaluru is a major inland and air origin. ExpressWay books air or ocean, prepares documents and coordinates customs for import and export from this catchment.",
  },
];

export const LOCATION_ALIASES: Record<string, string> = {
  "mundra-port": "mundra",
  "chennai-port": "chennai",
  "kolkata-port": "kolkata",
};

export const ROUTES: RoutePage[] = [
  {
    slug: "india-to-dubai",
    origin: "India",
    destination: "Dubai",
    destinationCountry: "United Arab Emirates",
    h1: "India to Dubai Freight Forwarding",
    seoTitle: "India to Dubai Freight Forwarding | ExpressWay Logistic",
    seoDescription:
      "Ocean and air freight forwarding from origins across India to Dubai, including FCL/LCL, consolidation, documentation and customs coordination.",
    directAnswer:
      "ExpressWay Logistic provides ocean and air freight forwarding from origins across India to Dubai, including FCL/LCL, consolidation, documentation, customs coordination and door-to-door delivery where required.",
    body: "India–Dubai is a commercially used corridor for garments, leather, engineering goods and general cargo. Indicative transit times vary based on origin, destination, carrier, sailing schedule, customs and operational conditions. We do not publish a guaranteed transit.",
    relatedServiceIds: ["ocean-freight", "air-freight", "fcl-shipping", "lcl-shipping"],
    relatedIndustrySlugs: ["garments-apparel", "leather-products", "engineering-goods"],
  },
  {
    slug: "india-to-jeddah",
    origin: "India",
    destination: "Jeddah",
    destinationCountry: "Saudi Arabia",
    h1: "India to Jeddah Freight Forwarding",
    seoTitle: "India to Jeddah Freight Forwarding | ExpressWay Logistic",
    seoDescription:
      "Ocean and air freight forwarding from India to Jeddah, including FCL/LCL, documentation and customs coordination.",
    directAnswer:
      "ExpressWay Logistic provides ocean and air freight forwarding from origins across India to Jeddah, including FCL/LCL, consolidation, documentation, customs coordination and door-to-door delivery where required.",
    body: "Jeddah is a key Saudi gateway for Indian commercial cargo. Mode (ocean or air) depends on cargo and deadline. Transit is indicative only and varies by carrier and operational conditions.",
    relatedServiceIds: ["ocean-freight", "air-freight", "customs-clearance", "consolidation"],
    relatedIndustrySlugs: ["garments-apparel", "engineering-goods", "chemicals"],
  },
  {
    slug: "india-to-doha",
    origin: "India",
    destination: "Doha",
    destinationCountry: "Qatar",
    h1: "India to Doha Freight Forwarding",
    seoTitle: "India to Doha Freight Forwarding | ExpressWay Logistic",
    seoDescription:
      "Ocean and air freight forwarding from India to Doha, including documentation and customs coordination.",
    directAnswer:
      "ExpressWay Logistic provides ocean and air freight forwarding from origins across India to Doha, including FCL/LCL, documentation, customs coordination and door-to-door delivery where required.",
    body: "Doha movements are quoted from actual cargo details. We do not publish fixed rates or guaranteed transits for this corridor.",
    relatedServiceIds: ["air-freight", "ocean-freight", "door-to-door-logistics", "freight-booking"],
    relatedIndustrySlugs: ["engineering-goods", "garments-apparel", "personal-effects"],
  },
  {
    slug: "india-to-saudi-arabia",
    origin: "India",
    destination: "Saudi Arabia",
    destinationCountry: "Saudi Arabia",
    h1: "India to Saudi Arabia Freight Forwarding",
    seoTitle: "India to Saudi Arabia Freight Forwarding | ExpressWay Logistic",
    seoDescription:
      "Freight forwarding from India to Saudi Arabia, including Jeddah and other commercially used gateways, by ocean or air.",
    directAnswer:
      "ExpressWay Logistic provides ocean and air freight forwarding from origins across India to Saudi Arabia, including FCL/LCL, documentation, customs coordination and door-to-door delivery where required.",
    body: "Saudi destinations are served as worldwide delivery points through the logistics network. Gateway choice (for example Jeddah) depends on cargo and consignee location. No ExpressWay office is claimed in Saudi Arabia.",
    relatedServiceIds: ["ocean-freight", "air-freight", "fcl-shipping", "customs-clearance"],
    relatedIndustrySlugs: ["garments-apparel", "engineering-goods", "project-machinery"],
  },
  {
    slug: "india-to-uk",
    origin: "India",
    destination: "United Kingdom",
    destinationCountry: "United Kingdom",
    h1: "India to UK Freight Forwarding",
    seoTitle: "India to UK Freight Forwarding | ExpressWay Logistic",
    seoDescription:
      "Ocean and air freight forwarding from India to the United Kingdom, including FCL/LCL, documentation and customs coordination.",
    directAnswer:
      "ExpressWay Logistic provides ocean and air freight forwarding from origins across India to the United Kingdom, including FCL/LCL, consolidation, documentation, customs coordination and door-to-door delivery where required.",
    body: "UK-bound cargo from India commonly uses ocean FCL/LCL for commercial volumes and air for time-critical lots. Indicative transit varies by gateway, carrier and customs.",
    relatedServiceIds: ["ocean-freight", "air-freight", "lcl-shipping", "customs-clearance"],
    relatedIndustrySlugs: ["garments-apparel", "handicrafts", "engineering-goods"],
  },
  {
    slug: "india-to-germany",
    origin: "India",
    destination: "Germany",
    destinationCountry: "Germany",
    h1: "India to Germany Freight Forwarding",
    seoTitle: "India to Germany Freight Forwarding | ExpressWay Logistic",
    seoDescription:
      "Ocean and air freight forwarding from India to Germany, including FCL/LCL, machinery-related cargo and documentation.",
    directAnswer:
      "ExpressWay Logistic provides ocean and air freight forwarding from origins across India to Germany, including FCL/LCL, documentation, customs coordination and door-to-door delivery where required.",
    body: "Germany is a commercially relevant Europe destination for engineering goods and machinery-related cargo as well as general exports. Import of machinery from Germany to India is a related intent — quote with origin and destination reversed when that is the move.",
    relatedServiceIds: ["ocean-freight", "project-cargo", "customs-clearance", "fcl-shipping"],
    relatedIndustrySlugs: ["engineering-goods", "project-machinery", "second-hand-machinery"],
  },
  {
    slug: "india-to-netherlands",
    origin: "India",
    destination: "Netherlands",
    destinationCountry: "Netherlands",
    h1: "India to Netherlands Freight Forwarding",
    seoTitle: "India to Netherlands Freight Forwarding | ExpressWay Logistic",
    seoDescription:
      "Ocean and air freight forwarding from India to the Netherlands, including Rotterdam gateway cargo, FCL/LCL and documentation.",
    directAnswer:
      "ExpressWay Logistic provides ocean and air freight forwarding from origins across India to the Netherlands, including FCL/LCL, documentation, customs coordination and door-to-door delivery where required.",
    body: "The Netherlands, including Rotterdam as a European ocean gateway, is used for Indian commercial cargo into northern Europe. Transit and routing are indicative and depend on carrier and operational conditions.",
    relatedServiceIds: ["ocean-freight", "fcl-shipping", "lcl-shipping", "consolidation"],
    relatedIndustrySlugs: ["garments-apparel", "engineering-goods", "chemicals"],
  },
  {
    slug: "india-to-usa",
    origin: "India",
    destination: "USA",
    destinationCountry: "United States",
    h1: "India to USA Freight Forwarding",
    seoTitle: "India to USA Freight Forwarding | ExpressWay Logistic",
    seoDescription:
      "Ocean and air freight forwarding from India to the United States, including FCL/LCL, documentation and customs coordination.",
    directAnswer:
      "ExpressWay Logistic provides ocean and air freight forwarding from origins across India to the USA, including FCL/LCL, consolidation, documentation, customs coordination and door-to-door delivery where required.",
    body: "USA-bound cargo is quoted from actual origin, destination gateway, commodity and volume. We do not publish a single USA transit or rate. Customs requirements in the destination country are the consignee’s and local broker’s responsibility unless scoped otherwise.",
    relatedServiceIds: ["ocean-freight", "air-freight", "fcl-shipping", "customs-clearance"],
    relatedIndustrySlugs: ["pharma-bulk-drugs", "garments-apparel", "engineering-goods"],
  },
  {
    slug: "india-to-canada",
    origin: "India",
    destination: "Canada",
    destinationCountry: "Canada",
    h1: "India to Canada Freight Forwarding",
    seoTitle: "India to Canada Freight Forwarding | ExpressWay Logistic",
    seoDescription:
      "Ocean and air freight forwarding from India to Canada, including FCL/LCL, documentation and door-to-door where required.",
    directAnswer:
      "ExpressWay Logistic provides ocean and air freight forwarding from origins across India to Canada, including FCL/LCL, documentation, customs coordination and door-to-door delivery where required.",
    body: "Canada movements include commercial cargo and personal effects when those services are in scope. Transit is indicative only.",
    relatedServiceIds: ["ocean-freight", "air-freight", "door-to-door-logistics", "packing-handling"],
    relatedIndustrySlugs: ["personal-effects", "garments-apparel", "engineering-goods"],
  },
  {
    slug: "india-to-singapore",
    origin: "India",
    destination: "Singapore",
    destinationCountry: "Singapore",
    h1: "India to Singapore Freight Forwarding",
    seoTitle: "India to Singapore Freight Forwarding | ExpressWay Logistic",
    seoDescription:
      "Ocean and air freight forwarding from India to Singapore, including FCL/LCL, consolidation and documentation.",
    directAnswer:
      "ExpressWay Logistic provides ocean and air freight forwarding from origins across India to Singapore, including FCL/LCL, consolidation, documentation, customs coordination and door-to-door delivery where required.",
    body: "Singapore is a commercially used Southeast Asia gateway for Indian cargo, including transshipment beyond Singapore when the booking requires it. Transshipment does not change the need for accurate documents at origin.",
    relatedServiceIds: ["ocean-freight", "air-freight", "consolidation", "lcl-shipping"],
    relatedIndustrySlugs: ["engineering-goods", "chemicals", "garments-apparel"],
  },
  {
    slug: "india-to-thailand",
    origin: "India",
    destination: "Thailand",
    destinationCountry: "Thailand",
    h1: "India to Thailand Freight Forwarding",
    seoTitle: "India to Thailand Freight Forwarding | ExpressWay Logistic",
    seoDescription:
      "Ocean and air freight forwarding from India to Thailand, including FCL/LCL and documentation.",
    directAnswer:
      "ExpressWay Logistic provides ocean and air freight forwarding from origins across India to Thailand, including FCL/LCL, documentation, customs coordination and door-to-door delivery where required.",
    body: "Thailand-bound cargo is quoted per origin city, gateway and commodity. No fixed transit is published.",
    relatedServiceIds: ["ocean-freight", "air-freight", "consolidation", "customs-clearance"],
    relatedIndustrySlugs: ["engineering-goods", "chemicals", "handicrafts"],
  },
  {
    slug: "india-to-indonesia",
    origin: "India",
    destination: "Indonesia",
    destinationCountry: "Indonesia",
    h1: "India to Indonesia Freight Forwarding",
    seoTitle: "India to Indonesia Freight Forwarding | ExpressWay Logistic",
    seoDescription:
      "Ocean and air freight forwarding from India to Indonesia, including FCL/LCL and documentation.",
    directAnswer:
      "ExpressWay Logistic provides ocean and air freight forwarding from origins across India to Indonesia, including FCL/LCL, documentation, customs coordination and door-to-door delivery where required.",
    body: "Indonesia movements depend on the discharge port and commodity. ExpressWay books ocean or air from Indian origins and coordinates origin documentation.",
    relatedServiceIds: ["ocean-freight", "fcl-shipping", "lcl-shipping", "freight-booking"],
    relatedIndustrySlugs: ["engineering-goods", "chemicals", "bulk-cargo"],
  },
];

export function getRegionBySlug(slug: string) {
  return REGIONS.find((region) => region.slug === slug);
}

export function getLocationBySlug(slug: string) {
  const resolved = LOCATION_ALIASES[slug] ?? slug;
  return LOCATIONS.find((location) => location.slug === resolved);
}

export function getRouteBySlug(slug: string) {
  return ROUTES.find((route) => route.slug === slug);
}
