export type ServicePageCopy = {
  whatIs: string;
  howProvided: string;
  whoFor: string;
  cargoTypes: string;
  importExport: string;
  oceanAir: string;
  panIndia: string;
  worldwide: string;
  process: string;
  documentation: string;
  benefits: string[];
  whyExpressWay: string;
  relatedServiceIds: readonly string[];
  relatedIndustrySlugs: readonly string[];
  relatedRouteIds: readonly string[];
};

const PAN_INDIA =
  "Serving customers across India through a nationwide logistics network. Noida is the headquarters; listings of cities and ports describe service coverage, not a physical office in every location.";

const WORLDWIDE =
  "Connecting Indian origins with worldwide destinations. Route pages describe commercially used corridors; we do not claim a physical office in every destination country.";

export const SERVICE_PAGES: Record<string, ServicePageCopy> = {
  "freight-forwarding": {
    whatIs:
      "Freight forwarding is the coordination of cargo movement between shipper and consignee: booking space, preparing documents, arranging pickup and delivery, and aligning customs and port handling so the shipment can move.",
    howProvided:
      "ExpressWay maps origin, destination, cargo type and mode, then books ocean or air, prepares documentation, coordinates customs and port handling, and arranges door delivery when that is in scope.",
    whoFor:
      "Indian exporters and importers who need a single desk for international movement rather than booking each step with a different vendor.",
    cargoTypes:
      "Garments, leather, pharma, handicrafts, engineering goods, herbal products, personal effects, project and second-hand machinery, bulk, coastal cargo and chemicals — handled according to the commodity, not a generic template.",
    importExport: "Both import and export shipments.",
    oceanAir: "Ocean freight (FCL/LCL/consolidation) and air freight.",
    panIndia: PAN_INDIA,
    worldwide: WORLDWIDE,
    process:
      "Quote → booking and documents → pickup and origin handling → customs and main carriage → destination clearance and delivery when required.",
    documentation:
      "Typical export files include commercial invoice, packing list, IEC, shipping bill, and bill of lading or air waybill. Additional certificates depend on commodity and destination.",
    benefits: [
      "One coordinating desk from quote through delivery",
      "Mode choice based on cargo and lead time",
      "Documentation prepared for the actual product",
    ],
    whyExpressWay:
      "ExpressWay is a PAN India neutral NVOCC and freight forwarder with 39+ years of cargo experience. Headquarters are in Noida; commercial coverage is India to worldwide destinations.",
    relatedServiceIds: ["nvocc", "ocean-freight", "air-freight", "customs-clearance"],
    relatedIndustrySlugs: ["garments-apparel", "engineering-goods", "leather-products"],
    relatedRouteIds: ["india-to-dubai", "india-to-usa", "india-to-uk"],
  },
  nvocc: {
    whatIs:
      "An NVOCC (Non-Vessel Operating Common Carrier) books ocean space with vessel operators and issues house documentation to the shipper. It does not operate the ocean vessel.",
    howProvided:
      "ExpressWay operates as a neutral NVOCC: FCL and LCL are sourced so you can compare cost and schedule. Consolidation is used when cargo does not fill a container. We do not publish exclusive liner relationship lists.",
    whoFor:
      "Exporters and importers who want ocean options without being locked to a single carrier brand.",
    cargoTypes:
      "General commercial cargo suitable for containerised ocean movement, including garments, leather, handicrafts, engineering goods and consolidated SME lots.",
    importExport: "Inbound and outbound ocean cargo.",
    oceanAir: "Ocean. Air freight is a separate ExpressWay service when time-critical cargo cannot wait for a sailing.",
    panIndia: PAN_INDIA,
    worldwide: WORLDWIDE,
    process:
      "Cargo details and lane → FCL or LCL recommendation → booking → house documentation → origin handling → ocean movement → destination coordination.",
    documentation:
      "House bill of lading, commercial invoice, packing list and shipping bill (export) or bill of entry (import), plus any commodity-specific certificates.",
    benefits: [
      "Neutral booking rather than a single-line lock-in",
      "FCL and LCL on the same desk",
      "Consolidation for smaller volumes",
    ],
    whyExpressWay:
      "Neutral NVOCC is a core ExpressWay identity: ocean space is booked for the shipment, not to fill a proprietary vessel schedule.",
    relatedServiceIds: ["ocean-freight", "fcl-shipping", "lcl-shipping", "consolidation"],
    relatedIndustrySlugs: ["garments-apparel", "leather-products", "handicrafts"],
    relatedRouteIds: ["india-to-dubai", "india-to-singapore", "india-to-netherlands"],
  },
  "ocean-freight": {
    whatIs:
      "Ocean freight is the movement of cargo by sea, typically in containers as FCL or LCL, between a port of loading and a port of discharge.",
    howProvided:
      "ExpressWay arranges export and import ocean freight from India, including FCL, LCL, consolidation, port movement, documentation and customs coordination. Door delivery is added when the shipment requires it.",
    whoFor:
      "Shippers moving commercial volumes where ocean cost and sailing schedules fit the buyer window better than air.",
    cargoTypes:
      "Containerisable commercial cargo across ExpressWay’s industry set, plus bulk and coastal cargo where those modes apply.",
    importExport: "Export from India and import into India.",
    oceanAir: "Ocean is the subject of this page. Air is available when the cargo cannot wait for a vessel.",
    panIndia: PAN_INDIA,
    worldwide: WORLDWIDE,
    process:
      "Lane and cargo review → FCL/LCL choice → booking → origin port handling → ocean movement → destination port and customs → delivery if in scope.",
    documentation:
      "Shipping bill or bill of entry, commercial invoice, packing list, and ocean bill of lading. Commodity licences when required.",
    benefits: [
      "Cost-efficient main carriage for most commercial cargo",
      "FCL, LCL and consolidation on one desk",
      "Port and customs coordination included in the operating model",
    ],
    whyExpressWay:
      "Ocean freight from India is ExpressWay’s primary NVOCC mode, paired with PAN India origin pickup through the logistics network.",
    relatedServiceIds: ["nvocc", "fcl-shipping", "lcl-shipping", "customs-clearance"],
    relatedIndustrySlugs: ["garments-apparel", "bulk-cargo", "engineering-goods"],
    relatedRouteIds: ["india-to-dubai", "india-to-germany", "india-to-usa"],
  },
  "air-freight": {
    whatIs:
      "Air freight is the movement of cargo by aircraft between origin and destination airports, used when transit time or product sensitivity outweighs ocean cost.",
    howProvided:
      "ExpressWay books import and export air cargo, prepares documentation, coordinates airport handling and customs, and arranges delivery when required.",
    whoFor:
      "Shippers of time-critical cargo: samples, pharma, electronics, urgent replacements and high-value commercial lots.",
    cargoTypes:
      "Pharma and bulk drugs, samples, engineering parts, garments on tight buyer windows, and other cargo accepted by the airline for the lane.",
    importExport: "Import and export air cargo.",
    oceanAir: "Air. Ocean remains available when the schedule allows.",
    panIndia: PAN_INDIA,
    worldwide: WORLDWIDE,
    process:
      "Cargo and deadline → air option → booking → origin airport handling → flight → destination airport and customs → delivery if in scope.",
    documentation:
      "Air waybill, commercial invoice, packing list, and shipping bill or bill of entry. Product certificates for regulated cargo.",
    benefits: [
      "Shorter main-carriage time than ocean",
      "Documentation and airport handling on the same desk",
      "Can be combined with door pickup and delivery",
    ],
    whyExpressWay:
      "Air freight is offered as part of complete EXIM logistics, not as a standalone airline. The same team can compare ocean versus air for the same cargo.",
    relatedServiceIds: ["freight-forwarding", "customs-clearance", "door-to-door-logistics", "cargo-insurance"],
    relatedIndustrySlugs: ["pharma-bulk-drugs", "engineering-goods", "herbal-medicaments"],
    relatedRouteIds: ["india-to-dubai", "india-to-uk", "india-to-usa"],
  },
  "fcl-shipping": {
    whatIs:
      "Full container load (FCL) means the shipper’s cargo occupies a dedicated ocean container rather than sharing space with other shippers.",
    howProvided:
      "ExpressWay books FCL, coordinates origin pickup and port handling, supports export documentation, ocean movement, destination clearance and final delivery when those steps are in the booking.",
    whoFor:
      "Exporters and importers with volume, packing control needs, or sailing preferences that justify a dedicated container.",
    cargoTypes:
      "Garments, leather, engineering goods, machinery parts and other cargo that packs safely into a container. Equipment type is confirmed per booking.",
    importExport: "Export FCL from India and import FCL into India.",
    oceanAir: "Ocean FCL. LCL and air are alternatives when volume or time does not fit FCL.",
    panIndia: PAN_INDIA,
    worldwide: WORLDWIDE,
    process:
      "Volume and packing review → container booking → pickup → origin port → ocean movement → destination clearance → delivery if required.",
    documentation:
      "Container packing details, commercial invoice, packing list, shipping bill or bill of entry, and bill of lading.",
    benefits: [
      "Dedicated equipment and packing control",
      "Fewer deconsolidation steps at destination",
      "Clearer sailing identity for the shipper’s cargo",
    ],
    whyExpressWay:
      "FCL is booked as a neutral NVOCC movement. Rates are quoted per shipment; we do not publish a public container tariff.",
    relatedServiceIds: ["lcl-shipping", "ocean-freight", "nvocc", "door-to-door-logistics"],
    relatedIndustrySlugs: ["garments-apparel", "leather-products", "engineering-goods"],
    relatedRouteIds: ["india-to-dubai", "india-to-usa", "india-to-netherlands"],
  },
  "lcl-shipping": {
    whatIs:
      "Less-than-container load (LCL) means cargo shares a container with other shippers’ lots. Space is charged on volume or weight, not on a full box.",
    howProvided:
      "ExpressWay consolidates origin cargo, prepares house documentation, moves the shared container, and deconsolidates at destination so smaller lots can still sail.",
    whoFor:
      "SME exporters, sample programmes and multi-SKU shippers whose volume does not fill a container.",
    cargoTypes:
      "Cartoned commercial cargo that can share a container safely. Hazardous cargo is accepted only where legally and operationally supported.",
    importExport: "Export LCL from India and import LCL into India.",
    oceanAir: "Ocean LCL. Air or FCL may be recommended if volume, time or commodity does not fit shared space.",
    panIndia: PAN_INDIA,
    worldwide: WORLDWIDE,
    process:
      "Volume check → origin consolidation → documentation → ocean movement → destination deconsolidation → delivery if in scope.",
    documentation:
      "House bill of lading for the shipper’s lot, plus the commercial set used for customs.",
    benefits: [
      "Move cargo without waiting to fill a container",
      "Shared-space cost structure for smaller volumes",
      "Same documentation desk as FCL and air",
    ],
    whyExpressWay:
      "LCL sits beside FCL and consolidation on the same NVOCC desk, so the recommendation can change if volume or sailing changes.",
    relatedServiceIds: ["fcl-shipping", "consolidation", "ocean-freight", "nvocc"],
    relatedIndustrySlugs: ["handicrafts", "garments-apparel", "herbal-medicaments"],
    relatedRouteIds: ["india-to-dubai", "india-to-singapore", "india-to-uk"],
  },
  consolidation: {
    whatIs:
      "Consolidation groups multiple lots into shared ocean or air capacity so each shipper pays for space used rather than a dedicated unit.",
    howProvided:
      "ExpressWay consolidates ocean and air cargo through the logistics network, coordinating pickup and destination handling around the shared movement.",
    whoFor:
      "Shippers with recurring smaller lots, mixed SKUs, or buyers who will not wait for FCL volume.",
    cargoTypes:
      "General cargo that can share space. Hazardous cargo only where legally and operationally supported.",
    importExport: "Inbound and outbound consolidation.",
    oceanAir: "Ocean and air consolidation.",
    panIndia: PAN_INDIA,
    worldwide: WORLDWIDE,
    process:
      "Lots received or picked up → grouped into a shared booking → documentation per house lot → main carriage → breakdown at destination.",
    documentation:
      "Each house lot keeps its commercial invoice and packing list; master documentation covers the consolidated movement.",
    benefits: [
      "Lower unit cost than dedicated equipment for small lots",
      "Scheduled movement without FCL wait",
      "Pickup and destination handling coordinated with the groupage",
    ],
    whyExpressWay:
      "Consolidation is a listed ExpressWay capability alongside FCL, LCL and air — used when it is the honest fit for the cargo, not as a slogan.",
    relatedServiceIds: ["lcl-shipping", "ocean-freight", "air-freight", "freight-booking"],
    relatedIndustrySlugs: ["handicrafts", "garments-apparel", "personal-effects"],
    relatedRouteIds: ["india-to-dubai", "india-to-singapore", "india-to-thailand"],
  },
  "customs-clearance": {
    whatIs:
      "Customs clearance is the filing and processing of import or export declarations so cargo can legally leave or enter a customs territory.",
    howProvided:
      "ExpressWay supports import clearance, export clearance, documentation and port clearance. Requirements are shipment-specific.",
    whoFor:
      "Importers and exporters who need operational clearance support alongside freight, not a generic checklist treated as law.",
    cargoTypes:
      "Commercial cargo across ExpressWay industries, including regulated goods where filings must match the product.",
    importExport: "Import customs clearance and export customs clearance.",
    oceanAir: "Applies to ocean and air movements.",
    panIndia: PAN_INDIA,
    worldwide: WORLDWIDE,
    process:
      "Commercial documents received → classification and filing for that shipment → port clearance → cargo released or loaded.",
    documentation:
      "Invoice, packing list, IEC, shipping bill or bill of entry, transport document, and any licences or certificates the commodity requires.",
    benefits: [
      "Clearance coordinated with the freight booking",
      "Filings matched to the actual commodity",
      "Status support while cargo is at port or airport",
    ],
    whyExpressWay:
      "Customs is part of complete EXIM logistics. Disclaimer: Customs documentation and requirements vary by commodity, origin, destination and applicable regulations. Customers should verify current regulatory requirements for their shipment.",
    relatedServiceIds: ["freight-forwarding", "exim-consultancy", "ocean-freight", "air-freight"],
    relatedIndustrySlugs: ["pharma-bulk-drugs", "chemicals", "project-machinery"],
    relatedRouteIds: ["india-to-usa", "india-to-germany", "india-to-dubai"],
  },
  warehousing: {
    whatIs:
      "Warehousing in this context is staging storage — holding cargo before sailing or after arrival, with loading, labeling and packing support as needed.",
    howProvided:
      "Warehousing is arranged through our logistics network. It is not a claim that ExpressWay owns a warehouse in every Indian city.",
    whoFor:
      "Shippers who need cargo held, labeled or packed between factory release and vessel or flight cut-off, or after arrival before final delivery.",
    cargoTypes:
      "General cargo. Hazardous storage only where the facility and law allow it for that product.",
    importExport: "Export staging and import staging.",
    oceanAir: "Used ahead of ocean or air main carriage.",
    panIndia: PAN_INDIA,
    worldwide: WORLDWIDE,
    process:
      "Inbound to the arranged facility → storage / labeling / packing → outbound to port, airport or consignee.",
    documentation:
      "Warehouse receipts and packing lists are aligned to the commercial set used for customs and booking.",
    benefits: [
      "Staging without owning every facility",
      "Loading, unloading, labeling and barcoding",
      "Packing support for outbound moves",
    ],
    whyExpressWay:
      "Storage is offered as a network capability attached to freight, not as a standalone warehouse brand.",
    relatedServiceIds: ["packing-handling", "door-to-door-logistics", "freight-forwarding", "consolidation"],
    relatedIndustrySlugs: ["garments-apparel", "personal-effects", "engineering-goods"],
    relatedRouteIds: ["india-to-dubai", "india-to-uk", "india-to-singapore"],
  },
  "door-to-door-logistics": {
    whatIs:
      "Door-to-door logistics is a scoped chain: pickup at origin, origin handling, freight booking, export documentation, customs, ocean or air movement, destination clearance and final delivery.",
    howProvided:
      "ExpressWay builds the chain for the shipment. Not every booking includes every step; pickup, insurance and delivery are confirmed on the quote.",
    whoFor:
      "Shippers who want one coordinator from factory or warehouse in India to consignee door, rather than managing each vendor themselves.",
    cargoTypes:
      "Commercial cargo and personal effects where door pickup and delivery are operationally feasible.",
    importExport: "Import door-to-door and export door-to-door.",
    oceanAir: "Ocean or air main carriage, chosen for the cargo and deadline.",
    panIndia: PAN_INDIA,
    worldwide: WORLDWIDE,
    process:
      "Pickup → origin handling → freight booking → export documentation → customs → ocean/air movement → destination clearance → final delivery.",
    documentation:
      "The commercial set plus transport documents for the booked mode, and delivery instructions for the consignee site.",
    benefits: [
      "Single coordinating desk across the chain",
      "PAN India origin pickup through the network",
      "Clear scope: which steps are in and which are not",
    ],
    whyExpressWay:
      "Door-to-door is a listed ExpressWay service line, used when the shipper wants origin-to-consignee coordination rather than port-to-port only.",
    relatedServiceIds: ["freight-forwarding", "customs-clearance", "ocean-freight", "air-freight"],
    relatedIndustrySlugs: ["personal-effects", "garments-apparel", "project-machinery"],
    relatedRouteIds: ["india-to-dubai", "india-to-canada", "india-to-uk"],
  },
  "project-cargo": {
    whatIs:
      "Project cargo is machinery and project shipments that need extra documentation, clearance, registration and delivery coordination beyond a standard commercial carton move.",
    howProvided:
      "ExpressWay supports project machinery and project imports including documentation, clearance, registration with authorities where required, and delivery coordination. Specialised lifting is confirmed per shipment with appropriate partners — we do not claim in-house heavy-lift as a default capability.",
    whoFor:
      "Importers of project and second-hand machinery and exporters of industrial equipment that needs authority paperwork.",
    cargoTypes:
      "Project machinery, second-hand machinery and related project imports.",
    importExport: "Commonly import into India; export of machinery is also in scope when the cargo fits.",
    oceanAir: "Usually ocean; air for critical components when justified.",
    panIndia: PAN_INDIA,
    worldwide: WORLDWIDE,
    process:
      "Specs and packing review → mode and documentation plan → booking → clearance and registration steps → delivery coordination.",
    documentation:
      "Commercial invoice, packing list, machinery specs, and any registration, inspection or licence papers the project requires.",
    benefits: [
      "Clearance and registration support on the same desk as freight",
      "Used-machinery paperwork treated as a known cargo type",
      "Delivery coordinated to the project site when in scope",
    ],
    whyExpressWay:
      "Project cargo is a stated ExpressWay capability, including second-hand machinery — scoped per job, not advertised as unlimited heavy-lift.",
    relatedServiceIds: ["customs-clearance", "ocean-freight", "freight-forwarding", "exim-consultancy"],
    relatedIndustrySlugs: ["project-machinery", "second-hand-machinery", "engineering-goods"],
    relatedRouteIds: ["india-to-germany", "india-to-usa", "india-to-uk"],
  },
  "cargo-insurance": {
    whatIs:
      "Cargo insurance (often marine cargo insurance) is a policy covering loss or damage to goods in transit, subject to policy terms.",
    howProvided:
      "Insurance can be arranged through appropriate insurance providers, subject to policy terms and eligibility. ExpressWay is not an insurer and does not underwrite risk.",
    whoFor:
      "Shippers who want transit cover discussed alongside the freight booking, especially on higher-value or longer ocean moves.",
    cargoTypes:
      "Import and export cargo where an insurer will accept the commodity, packing and voyage.",
    importExport: "Import and export cover options.",
    oceanAir: "Considered for ocean and air, depending on the policy.",
    panIndia: PAN_INDIA,
    worldwide: WORLDWIDE,
    process:
      "Declared value and voyage → provider option → policy subject to eligibility → documents retained with the shipment file.",
    documentation:
      "Commercial invoice and packing list are typically required; claims follow the insurer’s process, not ExpressWay’s freight terms.",
    benefits: [
      "Cover discussed with the booking, not as an afterthought",
      "Arranged through insurance providers",
      "No implication that ExpressWay is the underwriter",
    ],
    whyExpressWay:
      "Cargo insurance is offered as arrangement support. Policy wording and eligibility belong to the insurer.",
    relatedServiceIds: ["freight-forwarding", "ocean-freight", "air-freight", "door-to-door-logistics"],
    relatedIndustrySlugs: ["engineering-goods", "pharma-bulk-drugs", "project-machinery"],
    relatedRouteIds: ["india-to-usa", "india-to-germany", "india-to-dubai"],
  },
  "exim-consultancy": {
    whatIs:
      "EXIM consultancy is advisory support on export and import processes, documentation, IEC-related questions, and licence or drawback assistance where that help is actually offered for the shipment.",
    howProvided:
      "ExpressWay advises on documentation and process, coordinates with customs on the freight file, and assists with licences and drawback where applicable. Government scheme names change; we do not treat historical programme labels as currently in force without verification.",
    whoFor:
      "New exporters, importers facing documentation gaps, and companies that need process guidance alongside freight.",
    cargoTypes:
      "Any cargo ExpressWay moves, with extra attention on licensed or regulated products.",
    importExport: "Export and import processes.",
    oceanAir: "Advisory applies regardless of ocean or air main carriage.",
    panIndia: PAN_INDIA,
    worldwide: WORLDWIDE,
    process:
      "Trade need identified → document and process review → filings and licence steps that apply → freight and clearance execution.",
    documentation:
      "IEC, commercial set, shipping bill or bill of entry, and any current licence or drawback papers that apply to that shipment.",
    benefits: [
      "Process guidance attached to an actual freight file",
      "IEC and documentation assistance",
      "Drawback assistance where offered",
    ],
    whyExpressWay:
      "EXIM advisory is a listed service line. It is operational guidance, not a substitute for a chartered accountant or legal opinion on tax schemes.",
    relatedServiceIds: ["customs-clearance", "freight-forwarding", "project-cargo", "freight-booking"],
    relatedIndustrySlugs: ["pharma-bulk-drugs", "chemicals", "engineering-goods"],
    relatedRouteIds: ["india-to-usa", "india-to-uk", "india-to-germany"],
  },
  "packing-handling": {
    whatIs:
      "Packing and handling is the physical preparation of cargo — packing, stacking and handling — so it can be moved by ocean or air without avoidable damage.",
    howProvided:
      "ExpressWay packs and handles general cargo and personal effects / household goods. Hazardous cargo is accepted only where legally and operationally supported. Fumigation is arranged when destination rules require it.",
    whoFor:
      "Shippers of fragile, household or industrial cargo that needs packing beyond factory cartons, and moving shipments of personal effects.",
    cargoTypes:
      "General cargo, personal effects, household goods. Hazardous cargo only where supported.",
    importExport: "Export packing and import handling as scoped.",
    oceanAir: "Packing is mode-agnostic; marks and certificates follow the booked mode.",
    panIndia: PAN_INDIA,
    worldwide: WORLDWIDE,
    process:
      "Cargo survey or description → packing method → marks and documents → handover to origin handling or main carriage.",
    documentation:
      "Packing list aligned to the invoice; fumigation certificate when arranged; dangerous-goods papers only when that cargo is accepted.",
    benefits: [
      "Packing matched to the commodity",
      "Household and personal-effects handling",
      "No unsupported dangerous-goods claims",
    ],
    whyExpressWay:
      "Packing is listed because cargo condition is part of a successful EXIM move, not because every DG class is accepted.",
    relatedServiceIds: ["warehousing", "door-to-door-logistics", "freight-forwarding", "ocean-freight"],
    relatedIndustrySlugs: ["personal-effects", "handicrafts", "engineering-goods"],
    relatedRouteIds: ["india-to-dubai", "india-to-canada", "india-to-uk"],
  },
  "freight-booking": {
    whatIs:
      "Freight booking is the request and confirmation of ocean or air space for inbound or outbound cargo, based on cargo details rather than a public rate card.",
    howProvided:
      "Share origin, destination, cargo type, quantity, weight or volume, and any FCL/LCL or air preference. ExpressWay sources available options and coordinates documentation around the booking.",
    whoFor:
      "Importers and exporters who already know the lane and cargo and need space and a working rate, not a consulting meeting.",
    cargoTypes:
      "Commercial cargo for which ocean or air space can be obtained on the requested dates.",
    importExport: "Inbound and outbound.",
    oceanAir: "Ocean, air, or both compared on the same request.",
    panIndia: PAN_INDIA,
    worldwide: WORLDWIDE,
    process:
      "Rate request with cargo details → available options → confirmation → documentation and origin handling as scoped.",
    documentation:
      "Booking confirmation, then the commercial set and transport document for the chosen mode.",
    benefits: [
      "Inbound and outbound on one desk",
      "Ocean and air compared when useful",
      "No fictional public tariff",
    ],
    whyExpressWay:
      "Booking is the conversion path from SEO pages into the existing quote workflow. Request a Quote is the primary CTA.",
    relatedServiceIds: ["ocean-freight", "air-freight", "fcl-shipping", "lcl-shipping"],
    relatedIndustrySlugs: ["garments-apparel", "engineering-goods", "chemicals"],
    relatedRouteIds: ["india-to-dubai", "india-to-usa", "india-to-singapore"],
  },
};
