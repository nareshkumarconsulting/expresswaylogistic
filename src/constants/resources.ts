export type GuideArticle = {
  slug: string;
  title: string;
  h1: string;
  seoTitle: string;
  seoDescription: string;
  directAnswer: string;
  body: string[];
  relatedServiceIds: readonly string[];
};

export type GlossaryTerm = {
  slug: string;
  term: string;
  definition: string;
  relatedServiceIds: readonly string[];
};

export const GUIDES: GuideArticle[] = [
  {
    slug: "what-is-freight-forwarding",
    title: "What is Freight Forwarding?",
    h1: "What is Freight Forwarding?",
    seoTitle: "What is Freight Forwarding? Guide | ExpressWay Logistic",
    seoDescription:
      "Freight forwarding is the coordination of cargo booking, documents, customs and delivery between shipper and consignee. How ExpressWay provides it from India.",
    directAnswer:
      "Freight forwarding is the organisation of international cargo movement: booking space, preparing documents, arranging pickup and delivery, and aligning customs so goods can travel from origin to destination.",
    body: [
      "A freight forwarder does not have to own the ship or aircraft. The job is to select mode, book capacity, assemble the commercial file, and coordinate the parties who physically move and clear the cargo.",
      "From India, that typically includes inland pickup, port or airport handling, ocean or air main carriage, customs filings and destination delivery when those steps are in scope.",
      "ExpressWay Logistic provides PAN India freight forwarding as a Neutral Logistics Provider and complete EXIM logistics provider. See the freight forwarding service page to book.",
    ],
    relatedServiceIds: ["freight-forwarding", "nvocc", "customs-clearance"],
  },
  {
    slug: "what-is-a-neutral-logistics-provider",
    title: "What is a Neutral Logistics Provider?",
    h1: "What is a Neutral Logistics Provider?",
    seoTitle: "What is a Neutral Logistics Provider? Guide | ExpressWay Logistic",
    seoDescription:
      "A Neutral Logistics Provider books ocean space and issues house documentation without operating the vessel. How a Neutral Logistics Provider in India works.",
    directAnswer:
      "A Neutral Logistics Provider books ocean space with vessel operators and issues house documentation to the shipper. It does not operate the ocean vessel.",
    body: [
      "Shippers use a Neutral Logistics Provider to obtain FCL or LCL space and a house bill of lading. The Neutral Logistics Provider in turn has a contract or booking with the ocean carrier.",
      "A Neutral Logistics Provider is not locked to promoting a single liner. ExpressWay sources options so cost and schedule can be compared. We do not publish exclusive carrier lists.",
    ],
    relatedServiceIds: ["nvocc", "ocean-freight", "fcl-shipping", "lcl-shipping"],
  },
  {
    slug: "fcl-vs-lcl",
    title: "FCL vs LCL Shipping",
    h1: "FCL vs LCL Shipping",
    seoTitle: "FCL vs LCL Shipping Guide | ExpressWay Logistic",
    seoDescription:
      "FCL is a dedicated container; LCL shares container space. How to choose for cargo from India.",
    directAnswer:
      "FCL (full container load) uses a dedicated ocean container. LCL (less-than-container load) shares container space with other shippers. Choice depends on volume, packing control and sailing, not on a slogan.",
    body: [
      "FCL suits cargo that fills a box or needs dedicated packing control. LCL suits smaller lots that should not wait to fill a container.",
      "ExpressWay quotes FCL and LCL from the same desk. There is no public container rate card because liner prices move with space and season.",
    ],
    relatedServiceIds: ["fcl-shipping", "lcl-shipping", "consolidation"],
  },
  {
    slug: "how-international-freight-forwarding-works",
    title: "How International Freight Forwarding Works",
    h1: "How International Freight Forwarding Works",
    seoTitle: "How International Freight Forwarding Works | ExpressWay Logistic",
    seoDescription:
      "Quote, booking, documents, pickup, customs, main carriage and delivery — the working sequence for an international shipment from India.",
    directAnswer:
      "International freight forwarding typically follows quote, booking and documents, origin pickup, customs, ocean or air movement, destination clearance and delivery when those steps are booked.",
    body: [
      "The commercial file (invoice, packing list, IEC and licences) must match the cargo. Missing papers delay vessels and flights more often than missing trucks.",
      "See ExpressWay’s process page for the five operating steps used on our files.",
    ],
    relatedServiceIds: ["freight-forwarding", "freight-booking", "door-to-door-logistics"],
  },
  {
    slug: "export-process-from-india",
    title: "Export Process from India",
    h1: "Export Process from India",
    seoTitle: "Export Process from India Guide | ExpressWay Logistic",
    seoDescription:
      "How export cargo typically moves from an Indian origin: commercial documents, shipping bill, customs, port or airport, and main carriage.",
    directAnswer:
      "Export from India generally requires a commercial invoice, packing list, IEC, shipping bill, and a bill of lading or air waybill, plus any product licences, before cargo can load.",
    body: [
      "ExpressWay prepares clearance paperwork for the actual commodity and books ocean or air. Regulatory details vary; verify current requirements for your product.",
    ],
    relatedServiceIds: ["customs-clearance", "exim-consultancy", "ocean-freight"],
  },
  {
    slug: "import-process-in-india",
    title: "Import Process in India",
    h1: "Import Process in India",
    seoTitle: "Import Process in India Guide | ExpressWay Logistic",
    seoDescription:
      "How import cargo typically clears in India: bill of entry, commercial documents, customs and delivery.",
    directAnswer:
      "Import into India typically requires a bill of entry, commercial invoice, packing list, transport document and any licences for the commodity before cargo is released.",
    body: [
      "Project machinery and used equipment often need extra registration or inspection steps. ExpressWay coordinates those files when they are in scope.",
    ],
    relatedServiceIds: ["customs-clearance", "project-cargo", "exim-consultancy"],
  },
  {
    slug: "export-documentation",
    title: "Export Documentation Guide",
    h1: "Export Documentation Guide",
    seoTitle: "Export Documentation Guide | ExpressWay Logistic",
    seoDescription:
      "Typical Indian export documents: invoice, packing list, IEC, shipping bill, bill of lading or air waybill, and commodity certificates.",
    directAnswer:
      "Typical export documents from India include the commercial invoice, packing list, IEC, shipping bill, and bill of lading or air waybill. Extra certificates depend on cargo and destination.",
    body: [
      "Do not treat one generic checklist as legally complete. Pharma, chemicals, used machinery and licensed goods have additional papers.",
    ],
    relatedServiceIds: ["customs-clearance", "exim-consultancy", "freight-forwarding"],
  },
  {
    slug: "import-documentation",
    title: "Import Documentation Guide",
    h1: "Import Documentation Guide",
    seoTitle: "Import Documentation Guide | ExpressWay Logistic",
    seoDescription:
      "Typical Indian import documents: bill of entry, invoice, packing list, transport document and licences.",
    directAnswer:
      "Typical import documents in India include the bill of entry, commercial invoice, packing list, bill of lading or air waybill, and any licences the commodity requires.",
    body: [
      "Customs documentation and requirements vary by commodity, origin, destination and applicable regulations. Customers should verify current regulatory requirements for their shipment.",
    ],
    relatedServiceIds: ["customs-clearance", "project-cargo", "exim-consultancy"],
  },
  {
    slug: "ocean-freight-vs-air-freight",
    title: "Ocean Freight vs Air Freight",
    h1: "Ocean Freight vs Air Freight",
    seoTitle: "Ocean Freight vs Air Freight Guide | ExpressWay Logistic",
    seoDescription:
      "Ocean is usually cheaper for commercial volume; air is used when time or product sensitivity outweighs cost. How ExpressWay compares both from India.",
    directAnswer:
      "Ocean freight is the usual mode for cost-efficient commercial cargo. Air freight is used when transit time or product sensitivity outweighs ocean cost. ExpressWay quotes both from the same desk.",
    body: [
      "Choice is a function of volume, value, deadline and airline or liner acceptance — not a branding preference.",
    ],
    relatedServiceIds: ["ocean-freight", "air-freight", "freight-booking"],
  },
  {
    slug: "how-international-freight-cost-is-calculated",
    title: "How International Freight Cost Is Calculated",
    h1: "How International Freight Cost Is Calculated",
    seoTitle: "How International Freight Cost Is Calculated | ExpressWay Logistic",
    seoDescription:
      "Freight cost depends on origin, destination, mode, cargo type, volume or container size and extras such as customs, insurance and delivery.",
    directAnswer:
      "International freight cost is calculated from origin, destination, mode, cargo type, chargeable weight or volume or container size, and optional services such as customs, warehousing, insurance and door delivery.",
    body: [
      "There is no honest public rate list for all lanes. ExpressWay sources options per shipment. Request a quote with cargo details.",
    ],
    relatedServiceIds: ["freight-booking", "ocean-freight", "air-freight"],
  },
  {
    slug: "how-to-choose-a-freight-forwarder",
    title: "How to Choose a Freight Forwarder",
    h1: "How to Choose a Freight Forwarder",
    seoTitle: "How to Choose a Freight Forwarder | ExpressWay Logistic",
    seoDescription:
      "Choose a forwarder who can state entity type, coverage, modes, documents and what they will not claim. ExpressWay is a PAN India Neutral Logistics Provider.",
    directAnswer:
      "Choose a freight forwarder who can state who they are, which modes they book, which cargo they actually handle, and whether coverage is a network or a claimed office in every city.",
    body: [
      "Ask whether they are a Neutral Logistics Provider, whether they handle both import and export, and how quotes are built. ExpressWay publishes those facts on this site rather than generic excellence claims.",
    ],
    relatedServiceIds: ["freight-forwarding", "nvocc", "exim-consultancy"],
  },
  {
    slug: "what-is-exim",
    title: "What Is EXIM?",
    h1: "What Is EXIM?",
    seoTitle: "What Is EXIM? Guide | ExpressWay Logistic",
    seoDescription:
      "EXIM means export and import trade. How ExpressWay supports EXIM documentation and processes from India.",
    directAnswer:
      "EXIM means export–import: the processes, documents and logistics required to move goods out of or into a country. In India it includes IEC, customs filings and related trade paperwork.",
    body: [
      "ExpressWay provides EXIM advisory attached to actual freight files: documentation, IEC-related assistance, licence assistance and drawback assistance where offered.",
    ],
    relatedServiceIds: ["exim-consultancy", "customs-clearance", "freight-forwarding"],
  },
  {
    slug: "what-is-customs-clearance",
    title: "What Is Customs Clearance?",
    h1: "What Is Customs Clearance?",
    seoTitle: "What Is Customs Clearance? Guide | ExpressWay Logistic",
    seoDescription:
      "Customs clearance is the filing of import or export declarations so cargo can legally enter or leave a customs territory.",
    directAnswer:
      "Customs clearance is the preparation and filing of import or export declarations so cargo can legally leave or enter a customs territory. Requirements vary by commodity and regulation.",
    body: [
      "ExpressWay supports import and export clearance in India as operational assistance, not as universal legal advice. See the customs clearance service page.",
    ],
    relatedServiceIds: ["customs-clearance", "exim-consultancy", "freight-forwarding"],
  },
  {
    slug: "how-to-ship-from-india-to-usa",
    title: "How to Ship from India to the USA",
    h1: "How to Ship from India to the USA",
    seoTitle: "How to Ship from India to the USA | ExpressWay Logistic",
    seoDescription:
      "Steps to export cargo from India to the United States: quote, documents, ocean FCL/LCL or air freight, customs and delivery.",
    directAnswer:
      "To ship from India to the USA, share origin, US destination, cargo type and volume for a quote. ExpressWay books ocean FCL/LCL or air freight, prepares export documents, coordinates pickup and Indian customs, then destination clearance and delivery when in scope.",
    body: [
      "Commercial exports typically need a commercial invoice, packing list, IEC, shipping bill and bill of lading or air waybill. Product-specific licences or certificates may apply.",
      "Ocean FCL suits larger commercial lots; LCL suits smaller volumes. Air is used when transit time outweighs cost. There is no honest public all-in rate — liner and airline prices move with space and season.",
      "ExpressWay coordinates the file as a Neutral Logistics Provider from quote through delivery milestones. Request a quote with cargo details or see the India to USA shipping route page.",
    ],
    relatedServiceIds: ["ocean-freight", "air-freight", "customs-clearance", "door-to-door-logistics"],
  },
  {
    slug: "how-to-ship-from-india-to-dubai",
    title: "How to Ship from India to Dubai",
    h1: "How to Ship from India to Dubai",
    seoTitle: "How to Ship from India to Dubai | ExpressWay Logistic",
    seoDescription:
      "How to move cargo from India to Dubai (UAE): ocean or air booking, export documents, customs and optional door delivery.",
    directAnswer:
      "To ship from India to Dubai, provide Indian origin, Dubai destination, cargo type and volume. ExpressWay can book ocean FCL/LCL or air freight, arrange export paperwork and clearance, and coordinate door delivery in the UAE when booked.",
    body: [
      "India–UAE is a common commercial corridor for garments, engineering goods, pharma and general cargo. Mode choice depends on volume, deadline and product sensitivity.",
      "Export documents from India follow the standard commercial file; UAE import requirements depend on the commodity and current regulations. ExpressWay prepares paperwork for the actual shipment.",
      "Indicative transit varies by carrier, sailing, origin gateway, customs and operational conditions. Request a lane-specific quote rather than relying on generic transit claims.",
    ],
    relatedServiceIds: ["ocean-freight", "air-freight", "customs-clearance", "freight-forwarding"],
  },
  {
    slug: "fcl-vs-lcl-india-export",
    title: "FCL vs LCL for India Export",
    h1: "FCL vs LCL for India Export",
    seoTitle: "FCL vs LCL for India Export Guide | ExpressWay Logistic",
    seoDescription:
      "When Indian exporters should choose FCL or LCL: volume, packing control, sailing frequency and cost trade-offs.",
    directAnswer:
      "For exports from India, choose FCL when cargo fills or justifies a dedicated container and needs packing control. Choose LCL when volume is smaller and sharing container space is more economical than waiting to fill a box.",
    body: [
      "FCL exports from ICDs or coastal ports give the shipper a dedicated container. LCL consolidates multiple exporters’ lots — useful for SME shipments that do not justify a full box.",
      "Cost is not only ocean freight: inland pickup, terminal handling, customs, documentation and destination charges all affect the landed decision. ExpressWay quotes both modes from the same desk.",
      "See also the general FCL vs LCL guide and the ocean freight service page for booking scope.",
    ],
    relatedServiceIds: ["fcl-shipping", "lcl-shipping", "consolidation", "ocean-freight"],
  },
];

export type CaseStudy = {
  slug: string;
  title: string;
  h1: string;
  seoTitle: string;
  seoDescription: string;
  directAnswer: string;
  industry: string;
  mode: string;
  route: string;
  challenge: string;
  approach: string[];
  outcome: string;
  relatedServiceIds: readonly string[];
};

/** Anonymized summaries from verified ExpressWay shipment files. */
export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: "garment-export-fcl-india-to-usa",
    title: "Garment Export FCL — India to USA",
    h1: "Garment export FCL from North India to the United States",
    seoTitle: "Garment Export FCL India to USA Case Example | ExpressWay Logistic",
    seoDescription:
      "Anonymized operational example: FCL garment export from North India to the US with documentation, port movement and delivery coordination.",
    directAnswer:
      "ExpressWay handled an FCL garment export from a North Indian factory to a US consignee: inland pickup to port, export documentation, ocean booking and destination coordination — anonymized from a verified shipment file.",
    industry: "Garments & apparel export",
    mode: "Ocean FCL",
    route: "North India → Nhava Sheva → US East Coast",
    challenge:
      "The exporter needed predictable sailing alignment with a retail delivery window and correct export documentation for textile cargo.",
    approach: [
      "Quoted FCL space as a Neutral Logistics Provider with sailing options matched to the buyer’s window.",
      "Arranged factory pickup through the inland network to the booked port gateway.",
      "Prepared commercial invoice, packing list, shipping bill and bill of lading file aligned to the shipment.",
      "Provided milestone status through main carriage and coordinated destination handover with the US partner agent.",
    ],
    outcome:
      "Cargo moved on the booked sailing with documents accepted at origin customs. The consignee received status updates through delivery coordination. Client identity and commercial values are omitted for privacy.",
    relatedServiceIds: ["fcl-shipping", "customs-clearance", "door-to-door-logistics"],
  },
  {
    slug: "project-machinery-import-lcl",
    title: "Project Machinery Import — LCL Consolidation",
    h1: "Used project machinery import into India via LCL",
    seoTitle: "Project Machinery Import LCL Case Example | ExpressWay Logistic",
    seoDescription:
      "Anonymized operational example: LCL import of used project machinery into India with customs and inland delivery coordination.",
    directAnswer:
      "ExpressWay coordinated an LCL import of used project machinery into India: origin consolidation, ocean movement, import customs and inland delivery to the project site — anonymized from a verified shipment file.",
    industry: "Project & used machinery import",
    mode: "Ocean LCL",
    route: "Europe → Mundra → North India project site",
    challenge:
      "Used machinery imports require correct commodity classification, inspection-related paperwork and careful coordination between port arrival and inland project delivery.",
    approach: [
      "Confirmed cargo details and import documentation requirements before booking LCL space.",
      "Tracked consolidation and main carriage milestones with the shipper’s project team.",
      "Filed and processed import customs documentation for release at the Indian gateway.",
      "Arranged inland transport from port to the project site within the booked scope.",
    ],
    outcome:
      "Machinery cleared and reached the project site per the agreed scope. Specific registration steps varied by commodity; ExpressWay verified applicability for this file. Client identity is omitted for privacy.",
    relatedServiceIds: ["lcl-shipping", "project-cargo", "customs-clearance"],
  },
  {
    slug: "pharma-air-freight-india-to-uae",
    title: "Pharma Air Freight — India to UAE",
    h1: "Temperature-sensitive pharma air export to the UAE",
    seoTitle: "Pharma Air Freight India to UAE Case Example | ExpressWay Logistic",
    seoDescription:
      "Anonymized operational example: air freight export of pharma cargo from India to the UAE with documentation and time-critical coordination.",
    directAnswer:
      "ExpressWay booked air freight for a time-sensitive pharma export from India to the UAE, coordinating export documents, airline acceptance and destination handover — anonymized from a verified shipment file.",
    industry: "Pharmaceutical export",
    mode: "Air freight",
    route: "Delhi airport → Dubai",
    challenge:
      "The shipper needed airline acceptance for regulated pharma cargo and fast transit without document delays at origin.",
    approach: [
      "Confirmed product documentation and airline acceptance requirements before booking.",
      "Prepared export commercial file and customs clearance for airport departure.",
      "Booked air capacity aligned to the required delivery window.",
      "Coordinated destination agent handover and status updates through arrival.",
    ],
    outcome:
      "Cargo departed on the booked flight with origin clearance completed. Destination coordination continued through arrival. Product-specific certificates are omitted; this summary reflects operational steps only.",
    relatedServiceIds: ["air-freight", "customs-clearance", "exim-consultancy"],
  },
];

export const GLOSSARY: GlossaryTerm[] = [
  {
    slug: "neutral-logistics-provider",
    term: "Neutral Logistics Provider",
    definition:
      "A logistics company that books ocean space and issues house documentation without operating the vessel, and is not locked to a single carrier.",
    relatedServiceIds: ["nvocc", "ocean-freight"],
  },
  {
    slug: "fcl",
    term: "FCL",
    definition:
      "Full container load: the shipper’s cargo occupies a dedicated ocean container.",
    relatedServiceIds: ["fcl-shipping"],
  },
  {
    slug: "lcl",
    term: "LCL",
    definition:
      "Less-than-container load: cargo shares a container with other shippers’ lots.",
    relatedServiceIds: ["lcl-shipping"],
  },
  {
    slug: "eta",
    term: "ETA",
    definition:
      "Estimated time of arrival. An operational estimate, not a guaranteed delivery timestamp.",
    relatedServiceIds: ["freight-forwarding"],
  },
  {
    slug: "etd",
    term: "ETD",
    definition:
      "Estimated time of departure from the origin port, airport or other named point.",
    relatedServiceIds: ["freight-booking"],
  },
  {
    slug: "bill-of-lading",
    term: "Bill of Lading",
    definition:
      "Ocean transport document evidencing receipt of cargo and the contract of carriage. House bills may be issued by a Neutral Logistics Provider.",
    relatedServiceIds: ["ocean-freight", "nvocc"],
  },
  {
    slug: "air-waybill",
    term: "Air Waybill",
    definition:
      "Air transport document for cargo moved by aircraft. It is not a document of title in the same way as a negotiable bill of lading.",
    relatedServiceIds: ["air-freight"],
  },
  {
    slug: "iec",
    term: "IEC",
    definition:
      "Importer Exporter Code: the identification number required for most commercial import and export from India.",
    relatedServiceIds: ["exim-consultancy"],
  },
  {
    slug: "shipping-bill",
    term: "Shipping Bill",
    definition:
      "Indian customs export declaration filed for goods leaving India.",
    relatedServiceIds: ["customs-clearance"],
  },
  {
    slug: "bill-of-entry",
    term: "Bill of Entry",
    definition:
      "Indian customs import declaration filed for goods entering India.",
    relatedServiceIds: ["customs-clearance"],
  },
  {
    slug: "freight-forwarder",
    term: "Freight Forwarder",
    definition:
      "A party that organises cargo movement, documentation and related logistics between shipper and consignee.",
    relatedServiceIds: ["freight-forwarding"],
  },
  {
    slug: "consolidation",
    term: "Consolidation",
    definition:
      "Grouping multiple lots into shared ocean or air capacity.",
    relatedServiceIds: ["consolidation"],
  },
  {
    slug: "demurrage",
    term: "Demurrage",
    definition:
      "Charge levied when cargo or a container remains at the terminal beyond the free time allowed. Amounts are terminal- and carrier-specific.",
    relatedServiceIds: ["ocean-freight"],
  },
  {
    slug: "detention",
    term: "Detention",
    definition:
      "Charge levied when a container remains with the merchant beyond the allowed off-terminal time. Amounts are carrier-specific.",
    relatedServiceIds: ["fcl-shipping"],
  },
  {
    slug: "customs-clearance",
    term: "Customs Clearance",
    definition:
      "Filing and processing of import or export declarations so cargo can legally enter or leave a customs territory.",
    relatedServiceIds: ["customs-clearance"],
  },
  {
    slug: "exim",
    term: "EXIM",
    definition:
      "Export and import trade processes, documents and logistics.",
    relatedServiceIds: ["exim-consultancy"],
  },
  {
    slug: "door-to-door",
    term: "Door-to-Door",
    definition:
      "A scoped logistics chain from origin pickup through main carriage to consignee delivery.",
    relatedServiceIds: ["door-to-door-logistics"],
  },
  {
    slug: "transshipment",
    term: "Transshipment",
    definition:
      "Transfer of cargo from one vessel or aircraft to another at an intermediate hub before the final destination.",
    relatedServiceIds: ["ocean-freight"],
  },
  {
    slug: "port-of-loading",
    term: "Port of Loading",
    definition:
      "The ocean port where cargo is loaded onto the vessel.",
    relatedServiceIds: ["ocean-freight"],
  },
  {
    slug: "port-of-discharge",
    term: "Port of Discharge",
    definition:
      "The ocean port where cargo is discharged from the vessel.",
    relatedServiceIds: ["ocean-freight"],
  },
];

export function getGuideBySlug(slug: string) {
  return GUIDES.find((guide) => guide.slug === slug);
}

export function getCaseStudyBySlug(slug: string) {
  return CASE_STUDIES.find((study) => study.slug === slug);
}

export function getGlossaryBySlug(slug: string) {
  return GLOSSARY.find((term) => term.slug === slug);
}
