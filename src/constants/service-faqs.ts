type FaqItem = {
  question: string;
  answer: string;
};

const QUOTE =
  "Share origin, destination, cargo type, and weight or volume on the quote form. There is no public rate card. Options depend on the actual file.";

/** Unique FAQs per service — natural shipper questions, not keyword stuffing. */
export const SERVICE_FAQS: Record<string, FaqItem[]> = {
  "freight-forwarding": [
    {
      question: "What does a freight forwarder do?",
      answer:
        "A freight forwarder organises the move: booking ocean or air space, assembling documents, arranging pickup, coordinating customs and port or airport handling, and arranging delivery when that is in scope. ExpressWay does this as a PAN India Neutral Logistics Provider connecting Indian origins with worldwide destinations.",
    },
    {
      question: "Is a freight forwarder the same as a shipping line?",
      answer:
        "No. A shipping line operates vessels. ExpressWay books space and coordinates the file. As a Neutral Logistics Provider we source FCL and LCL options rather than locking you to a single liner.",
    },
    {
      question: "Do you handle both import and export?",
      answer:
        "Yes. Freight forwarding covers inbound and outbound cargo. Project and used machinery are a common import specialisation; garments, leather and handicrafts are common exports.",
    },
    {
      question: "What cargo details do you need for a forwarding quote?",
      answer:
        "Origin city, destination, commodity, approximate weight or CBM or container size, preferred mode if you have one, and whether pickup, door delivery or insurance is required.",
    },
    {
      question: "Can I use ExpressWay for only part of the chain?",
      answer:
        "Yes. You can book forwarding with or without customs, packing, warehousing or door delivery. Tell us what you already have in place.",
    },
    {
      question: "Do you pick up cargo only from ports?",
      answer:
        "No. Inland pickup is arranged through the nationwide logistics network so factory and warehouse cargo can move to the booked port or airport. Headquarters are in Noida; coverage is not limited to that city.",
    },
    {
      question: "How is freight forwarding priced?",
      answer: QUOTE,
    },
    {
      question: "How do I start a shipment?",
      answer:
        "Request a quote or book an appointment. After you confirm, ExpressWay books the mode, prepares documents, and keeps operational status updates through the scoped steps.",
    },
  ],
  nvocc: [
    {
      question: "What is a Neutral Logistics Provider?",
      answer:
        "A Neutral Logistics Provider books ocean space with vessel operators and issues house documentation to the shipper, without operating the vessel and without locking you to a single liner.",
    },
    {
      question: "What does “neutral” mean here?",
      answer:
        "Neutral means ExpressWay is not locked to promoting a single carrier. FCL and LCL are sourced so you can compare cost and schedule. We do not publish exclusive liner lists.",
    },
    {
      question: "How is a Neutral Logistics Provider different from a freight forwarder?",
      answer:
        "Freight forwarding is the broader coordination of the move. A Neutral Logistics Provider also books ocean space and issues house documentation. ExpressWay provides both, plus customs and door delivery when scoped.",
    },
    {
      question: "Do you issue a bill of lading?",
      answer:
        "Ocean shipments typically move with a house bill of lading issued for the shipper’s lot, alongside the commercial invoice, packing list and shipping bill or bill of entry. Exact documents depend on the booking.",
    },
    {
      question: "Can you move LCL as well as FCL?",
      answer:
        "Yes. Coverage includes FCL, LCL and consolidation for lots that do not fill a container.",
    },
    {
      question: "Is this only for export from India?",
      answer:
        "No. ExpressWay books inbound and outbound ocean cargo as a Neutral Logistics Provider.",
    },
    {
      question: "Do you operate your own ships?",
      answer:
        "No. ExpressWay does not operate the vessel. Space is booked with ocean carriers for the shipment.",
    },
    {
      question: "How do I book ocean space?",
      answer: QUOTE,
    },
  ],
  "ocean-freight": [
    {
      question: "When should I use ocean freight instead of air?",
      answer:
        "Ocean is usually the cost-efficient mode for commercial volume when the buyer window can accept a sailing. Air is used when time or product sensitivity outweighs ocean cost. ExpressWay can compare both on the same quote.",
    },
    {
      question: "Do you offer FCL and LCL on ocean?",
      answer:
        "Yes. Ocean freight includes FCL, LCL and consolidation. The choice depends on volume, packing control and sailing — not on a slogan.",
    },
    {
      question: "Which Indian ports can you support?",
      answer:
        "Cargo is coordinated via commercially used gateways including Nhava Sheva, Mundra, Chennai and Kolkata, with inland pickup through the logistics network. Port pages describe cargo movement, not ExpressWay-owned terminals.",
    },
    {
      question: "How long does ocean freight from India take?",
      answer:
        "Indicative transit varies by origin, destination, carrier, sailing schedule, customs and operational conditions. We do not publish a guaranteed transit. Your quote states the booked mode and expected window.",
    },
    {
      question: "What documents are needed for ocean export?",
      answer:
        "Typically a commercial invoice, packing list, IEC, shipping bill and bill of lading. Licences or certificates depend on commodity and destination. This is not a complete legal checklist for every cargo.",
    },
    {
      question: "Do you handle ocean import into India?",
      answer:
        "Yes. Import ocean freight includes destination port coordination and bill of entry support when clearance is in scope.",
    },
    {
      question: "Can ocean freight include door pickup and delivery?",
      answer:
        "Yes, when those steps are confirmed on the booking. Door-to-door is scoped per shipment, not assumed on every ocean quote.",
    },
    {
      question: "Do you publish ocean rates online?",
      answer:
        "No. Liner rates move with space, fuel and season. Request a quote with cargo and lane details.",
    },
  ],
  "air-freight": [
    {
      question: "When is air freight the right mode?",
      answer:
        "When transit time or product sensitivity outweighs ocean cost — samples, pharma, electronics, urgent replacements and high-value lots that cannot wait for a sailing.",
    },
    {
      question: "Do you handle import and export air cargo?",
      answer:
        "Yes. ExpressWay books inbound and outbound air freight from origins across India to worldwide destinations.",
    },
    {
      question: "What is an air waybill?",
      answer:
        "The air waybill is the air transport document for the shipment. It is not a document of title in the same way as a negotiable ocean bill of lading.",
    },
    {
      question: "How is air freight charged?",
      answer:
        "Airlines typically charge on chargeable weight: the greater of actual weight and volumetric weight. Exact calculation depends on the airline and booking. Share dimensions and weight on the quote.",
    },
    {
      question: "Can air freight include airport handling and customs?",
      answer:
        "Yes. Documentation, airport handling and customs coordination are part of how ExpressWay provides air freight when those steps are in scope.",
    },
    {
      question: "Do you guarantee same-day or next-flight departure?",
      answer:
        "No. Flight availability depends on space, cut-off, commodity acceptance and operational conditions. The quote states available options, not a guaranteed flight.",
    },
    {
      question: "Can dangerous goods go by air?",
      answer:
        "Only where legally and operationally supported for that commodity, packing and airline. Acceptance is confirmed per shipment. Unsupported DG classes are not implied.",
    },
    {
      question: "How do I request an air freight quote?",
      answer: QUOTE,
    },
  ],
  "fcl-shipping": [
    {
      question: "What is FCL shipping?",
      answer:
        "Full container load means your cargo occupies a dedicated ocean container rather than sharing space with other shippers.",
    },
    {
      question: "When is FCL better than LCL?",
      answer:
        "FCL suits volume that fills a box, or cargo that needs dedicated packing control or a specific sailing. LCL suits smaller lots that should not wait to fill a container.",
    },
    {
      question: "Which container types can you book?",
      answer:
        "Equipment is confirmed per booking. We do not publish a static catalogue as universally available for every lane and date.",
    },
    {
      question: "Do you publish FCL rates per container?",
      answer:
        "No. There is no public container tariff. Rates are quoted per origin, destination, equipment and sailing.",
    },
    {
      question: "Does FCL include origin pickup?",
      answer:
        "Pickup, port handling, destination clearance and delivery are added when those steps are in the booking. Confirm scope on the quote.",
    },
    {
      question: "Who loads the container?",
      answer:
        "Stuffing is arranged according to the booking — shipper load or coordinated stuffing. Marks and the packing list must match the commercial invoice.",
    },
    {
      question: "What are demurrage and detention?",
      answer:
        "Demurrage is typically charged when a container stays at the terminal beyond free time. Detention is typically charged when equipment stays with the merchant beyond allowed off-terminal time. Amounts are carrier- and terminal-specific.",
    },
    {
      question: "Can FCL move import cargo into India?",
      answer:
        "Yes. Import FCL includes destination port and clearance coordination when those steps are scoped.",
    },
  ],
  "lcl-shipping": [
    {
      question: "What is LCL shipping?",
      answer:
        "Less-than-container load means your cargo shares an ocean container with other shippers’ lots. Space is typically charged on volume or weight, not on a full box.",
    },
    {
      question: "How small can an LCL shipment be?",
      answer:
        "LCL is used when volume does not justify FCL. Minimums vary by consolidator and lane. Share CBM or weight on the quote; we will say if FCL or air is a better fit.",
    },
    {
      question: "Does LCL take longer than FCL?",
      answer:
        "LCL includes origin consolidation and destination deconsolidation, so the calendar can be longer than a dedicated FCL sailing. Actual time still depends on carrier, CFS cut-off, customs and operations. We do not publish a guaranteed extra-day figure.",
    },
    {
      question: "Is LCL cheaper than FCL?",
      answer:
        "For small lots, shared space is usually more economical than paying for a full container. Once volume approaches a box, FCL can be cheaper and simpler. That comparison is done on the quote.",
    },
    {
      question: "Do I get my own bill of lading on LCL?",
      answer:
        "The house lot typically has its own house bill of lading. Master documentation covers the consolidated container.",
    },
    {
      question: "Can hazardous cargo move as LCL?",
      answer:
        "Only where legally and operationally supported for that commodity and the consolidation. Many DG classes cannot share a box. Confirm before tendering cargo.",
    },
    {
      question: "Do you deconsolidate at destination?",
      answer:
        "Yes. Destination deconsolidation is part of LCL. Final delivery is included only when it is in the booking scope.",
    },
    {
      question: "How do I get an LCL quote?",
      answer: QUOTE,
    },
  ],
  consolidation: [
    {
      question: "What is cargo consolidation?",
      answer:
        "Consolidation groups multiple lots into shared ocean or air capacity so each shipper pays for space used rather than a dedicated container or pallet.",
    },
    {
      question: "Is consolidation the same as LCL?",
      answer:
        "LCL is ocean groupage in a shared container. Consolidation at ExpressWay also includes air groupage. Both are shared-space products for smaller lots.",
    },
    {
      question: "Who is consolidation for?",
      answer:
        "SME exporters, sample programmes and multi-SKU shippers whose volume does not fill dedicated equipment.",
    },
    {
      question: "Can different commodities share a consolidation?",
      answer:
        "Only when they can legally and safely share space. Hazardous cargo is accepted only where supported. Incompatible cargo is not mixed.",
    },
    {
      question: "Do you pick up lots from different factories?",
      answer:
        "Pickup can be coordinated through the logistics network so lots meet the consolidated booking. Confirm origin addresses on the quote.",
    },
    {
      question: "How are documents handled on a consolidated shipment?",
      answer:
        "Each house lot keeps its commercial invoice and packing list. Master documentation covers the grouped movement.",
    },
    {
      question: "Is consolidation always the cheapest option?",
      answer:
        "It is often cheaper for small lots. If volume, timing or commodity does not fit shared space, FCL or air may be recommended instead.",
    },
    {
      question: "How do I book consolidation?",
      answer: QUOTE,
    },
  ],
  "customs-clearance": [
    {
      question: "What is customs clearance?",
      answer:
        "Customs clearance is the filing and processing of import or export declarations so cargo can legally leave or enter a customs territory.",
    },
    {
      question: "Do you handle both import and export clearance in India?",
      answer:
        "Yes. Import clearance typically involves a bill of entry; export clearance typically involves a shipping bill, plus the commercial set for that commodity.",
    },
    {
      question: "What documents are required for Indian customs?",
      answer:
        "Typically invoice, packing list, IEC, shipping bill or bill of entry, and the transport document, plus any licences the product requires. Requirements vary by commodity, origin, destination and regulation. Customers should verify current rules for their shipment.",
    },
    {
      question: "Is this legal or tax advice?",
      answer:
        "No. ExpressWay provides operational clearance support on the freight file. It is not a substitute for a legal opinion or a chartered accountant on classification, valuation or tax schemes.",
    },
    {
      question: "Can you clear cargo if another forwarder booked the freight?",
      answer:
        "Often yes, if you provide the commercial file and transport documents. Tell us what is already booked when you request support.",
    },
    {
      question: "Why was my cargo held at customs?",
      answer:
        "Holds can follow document mismatch, examination, licences or valuation queries. ExpressWay helps resolve holds on files we are clearing; we cannot guarantee a release time.",
    },
    {
      question: "Do you clear cargo at every Indian port?",
      answer:
        "Clearance is coordinated for cargo moving via commercially used gateways. Scope is confirmed per shipment and port.",
    },
    {
      question: "How do I start a clearance file?",
      answer:
        "Send the commercial invoice, packing list, IEC and transport document, plus commodity details. We confirm what else that product needs.",
    },
  ],
  warehousing: [
    {
      question: "Do you own warehouses in every city?",
      answer:
        "No. Warehousing is arranged through our logistics network. That is staging storage, not a claim of ExpressWay-owned facilities in every Indian city.",
    },
    {
      question: "What warehouse services are included?",
      answer:
        "General cargo storage, loading and unloading, labeling, barcoding and packing support as needed before sailing or after arrival.",
    },
    {
      question: "Can I store cargo long term?",
      answer:
        "This service is described as staging around a freight move. Longer storage depends on the arranged facility and the cargo. Ask on the quote rather than assuming unlimited storage.",
    },
    {
      question: "Do you store hazardous cargo?",
      answer:
        "Only where the facility and law allow it for that product. Hazardous storage is not implied for every warehouse booking.",
    },
    {
      question: "Is inventory management included?",
      answer:
        "Labeling and barcoding are offered. Full WMS inventory control is not claimed unless confirmed for that booking.",
    },
    {
      question: "Can warehousing be combined with ocean or air booking?",
      answer:
        "Yes. Staging is typically used so cargo meets a vessel or flight cut-off, or waits for delivery after arrival.",
    },
    {
      question: "Where is cargo stored?",
      answer:
        "Location is confirmed per shipment through the network, aligned to the origin or destination gateway — not a public map of owned sheds.",
    },
    {
      question: "How do I request warehousing?",
      answer:
        "Share cargo type, packing, expected in/out dates and whether the cargo is going ocean or air. We confirm network availability.",
    },
  ],
  "door-to-door-logistics": [
    {
      question: "What does door-to-door include?",
      answer:
        "When fully scoped: pickup, origin handling, freight booking, export documentation, customs, ocean or air movement, destination clearance and final delivery. Not every quote includes every step.",
    },
    {
      question: "Is door-to-door the same as DDP?",
      answer:
        "No. Door-to-door describes logistics steps. Incoterms (such as FOB, CIF or DDP) allocate cost and risk. Confirm Incoterms on the quote; we do not assume DDP.",
    },
    {
      question: "Can you pick up from a factory anywhere in India?",
      answer:
        "Pickup is arranged through the nationwide logistics network. Coverage is PAN India origins, not a physical office in every city.",
    },
    {
      question: "Do you deliver to the consignee’s warehouse abroad?",
      answer:
        "Final delivery is arranged when it is in the booking. Destination country delivery partners are part of the network; we do not claim ExpressWay offices abroad.",
    },
    {
      question: "Can door-to-door use ocean or air?",
      answer:
        "Yes. Main carriage is ocean or air depending on cargo and deadline.",
    },
    {
      question: "Is insurance included in door-to-door?",
      answer:
        "Only if requested. Insurance can be arranged through insurance providers, subject to policy terms. ExpressWay is not an insurer.",
    },
    {
      question: "What if I only need port-to-port?",
      answer:
        "Say so on the quote. Door pickup and delivery can be left out so the file is port-to-port or airport-to-airport.",
    },
    {
      question: "How do I quote a door-to-door move?",
      answer:
        "Give pickup address, delivery address, commodity, weight or volume, and preferred mode if you have one.",
    },
  ],
  "project-cargo": [
    {
      question: "What counts as project cargo?",
      answer:
        "Machinery and project shipments that need extra documentation, clearance, registration and delivery coordination beyond a standard cartonised commercial move.",
    },
    {
      question: "Do you handle second-hand machinery?",
      answer:
        "Yes. Used equipment often needs inspection and extra paperwork. ExpressWay treats second-hand machinery as a known cargo type, scoped per job.",
    },
    {
      question: "Do you provide in-house heavy lift?",
      answer:
        "Specialised lifting is confirmed per shipment with appropriate partners. We do not claim in-house heavy-lift as a default capability.",
    },
    {
      question: "Can you help with project import registration in India?",
      answer:
        "Yes, where the project requires registration, clearance, finalisation or cancellation with authorities. Requirements are shipment-specific.",
    },
    {
      question: "Is project cargo only import into India?",
      answer:
        "Import of machinery is common. Export of industrial equipment is also in scope when the cargo fits.",
    },
    {
      question: "What specifications should I send for a project quote?",
      answer:
        "Dimensions, weight, packing, origin, destination, whether the cargo is new or used, and any drawings or photos of out-of-gauge pieces.",
    },
    {
      question: "Can oversized cargo go by air?",
      answer:
        "Sometimes, if the piece fits aircraft limits and the airline accepts it. Many project pieces move by ocean. Mode is confirmed after specs are reviewed.",
    },
    {
      question: "How is project cargo priced?",
      answer:
        "From actual dimensions, weight, route and handling — not from a public tariff. Request a quote with specs.",
    },
  ],
  "cargo-insurance": [
    {
      question: "Is ExpressWay an insurance company?",
      answer:
        "No. ExpressWay is not an insurer and does not underwrite risk. Insurance can be arranged through appropriate insurance providers, subject to policy terms and eligibility.",
    },
    {
      question: "What is cargo or marine insurance?",
      answer:
        "A policy that can cover loss or damage to goods in transit, subject to the insurer’s wording. It is separate from the freight contract.",
    },
    {
      question: "Is insurance included in every freight quote?",
      answer:
        "No. Cover is discussed when you ask for it. Declare value and voyage on the quote if you want an option.",
    },
    {
      question: "Does insurance cover delay?",
      answer:
        "Delay cover depends on the policy. Many cargo policies focus on physical loss or damage, not late arrival. Read the insurer’s terms; we do not rewrite them.",
    },
    {
      question: "Can you arrange cover for import and export?",
      answer:
        "Import and export cover options can be discussed where a provider will accept the commodity, packing and voyage.",
    },
    {
      question: "What documents are needed if I have a claim?",
      answer:
        "Typically the commercial invoice, packing list, transport document and the insurer’s claim forms. Claims follow the insurer’s process.",
    },
    {
      question: "Should I insure LCL and air cargo as well as FCL?",
      answer:
        "Cover is a commercial decision based on value and risk. ExpressWay can arrange a provider option; we do not insist on a single product.",
    },
    {
      question: "How do I add insurance to a booking?",
      answer:
        "Ask on the quote form and declare cargo value. Eligibility and premium belong to the insurer.",
    },
  ],
  "exim-consultancy": [
    {
      question: "What is EXIM consultancy?",
      answer:
        "Advisory support on export and import processes, documentation, IEC-related questions, and licence or drawback assistance where that help is actually offered for the shipment.",
    },
    {
      question: "Do I need an IEC to export from India?",
      answer:
        "Most commercial export and import from India requires an Importer Exporter Code. ExpressWay can assist with IEC-related questions on a live freight file. Confirm current DGFT rules for your entity.",
    },
    {
      question: "Do you still work with DEPB?",
      answer:
        "Government scheme names change. We do not treat historical programme labels as currently in force. Licence and drawback assistance is offered where it actually applies to the shipment after verification.",
    },
    {
      question: "Can you file drawback claims?",
      answer:
        "Drawback assistance is offered where applicable to the shipment. It is operational support, not a guarantee of a refund amount or timeline.",
    },
    {
      question: "Is EXIM advice a legal opinion?",
      answer:
        "No. It is process and documentation guidance attached to freight. Classification, valuation and tax treatment may need your CHA, CA or counsel.",
    },
    {
      question: "Who should book an EXIM discussion?",
      answer:
        "New exporters, importers facing documentation gaps, and teams that need process guidance alongside a quote. Use the appointment page for a consultation; use the quote form when the lane and cargo are already known.",
    },
    {
      question: "Can you help only with paperwork, not freight?",
      answer:
        "Yes. Tell us you need documentation or licence assistance without a booking, and we will say what we can take on.",
    },
    {
      question: "How do I start?",
      answer:
        "Share commodity, origin, destination and which documents you already hold. Book an appointment or request a quote.",
    },
  ],
  "packing-handling": [
    {
      question: "What cargo do you pack?",
      answer:
        "General cargo and personal effects / household goods. Packing is matched to the commodity so it can move by ocean or air without avoidable damage.",
    },
    {
      question: "Do you pack hazardous cargo?",
      answer:
        "Hazardous cargo is accepted only where legally and operationally supported for that commodity and lane. Unsupported dangerous-goods classes are not implied.",
    },
    {
      question: "Can you pack household goods for a move abroad?",
      answer:
        "Yes. Personal effects and household goods are a listed packing and handling type, often combined with door-to-door when scoped.",
    },
    {
      question: "Do you arrange fumigation?",
      answer:
        "Fumigation can be arranged when destination rules require certificates. It is not added to every packing job by default.",
    },
    {
      question: "Is export packing the same as domestic packing?",
      answer:
        "Export packing usually needs marks, moisture and stacking that survive ocean or air and customs examination. Tell us the mode and destination.",
    },
    {
      question: "Can packing be done at my factory?",
      answer:
        "On-site versus facility packing is confirmed per job, depending on cargo, access and the network arrangement.",
    },
    {
      question: "Do you crate machinery?",
      answer:
        "Industrial packing is discussed against actual dimensions and photos. Project and used machinery often need custom crates; that is scoped, not assumed.",
    },
    {
      question: "How do I request packing?",
      answer:
        "Describe the cargo, photos if possible, origin, destination and mode. We confirm what packing the file needs.",
    },
  ],
  "freight-booking": [
    {
      question: "What is a freight booking?",
      answer:
        "The request and confirmation of ocean or air space for inbound or outbound cargo, based on cargo details rather than a public rate card.",
    },
    {
      question: "What information do you need to book space?",
      answer:
        "Origin, destination, commodity, quantity, weight or volume, ready date, and FCL/LCL or air preference if you have one. HS code helps when you have it.",
    },
    {
      question: "Can you book both ocean and air on one request?",
      answer:
        "Yes. Say if you want both compared. ExpressWay sources available options for the file.",
    },
    {
      question: "Do you act as booking agent only?",
      answer:
        "You can request booking without door delivery or packing. Documentation around the booking is coordinated; extra services are optional.",
    },
    {
      question: "How soon is space confirmed?",
      answer:
        "Confirmation depends on carrier or airline space, commodity acceptance and the completeness of your details. We do not guarantee a fixed number of hours.",
    },
    {
      question: "Can I book without a company IEC?",
      answer:
        "Commercial import and export from India typically requires an IEC. Personal effects may follow a different path. Tell us the cargo type so we do not assume.",
    },
    {
      question: "Is a booking the same as a binding rate?",
      answer:
        "A working option becomes bookable when you confirm and the line or airline still has space. Rates move; we do not publish a frozen public tariff.",
    },
    {
      question: "How do I request a booking?",
      answer:
        "Use Request a Quote with origin, destination and cargo details. That is the conversion path into the quote desk.",
    },
  ],
};

export function getServiceFaqs(serviceId: string, title?: string): FaqItem[] {
  const faqs = SERVICE_FAQS[serviceId];
  if (faqs?.length) return faqs;
  return [
    {
      question: `What is ExpressWay Logistic’s ${title ?? "this"} service?`,
      answer:
        "This is one of the freight forwarding services offered by ExpressWay Logistic, a PAN India Neutral Logistics Provider. Request a quote with origin, destination and cargo details.",
    },
  ];
}
