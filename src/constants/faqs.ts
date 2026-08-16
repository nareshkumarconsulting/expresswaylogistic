import { QUOTE_RESPONSE_STATEMENT } from "@/constants/entity";

export type FaqItem = {
  question: string;
  answer: string;
};

export const CORE_INTENT_FAQS: FaqItem[] = [
  {
    question: "What does ExpressWay Logistic do?",
    answer:
      "ExpressWay Logistic is an Indian neutral NVOCC and freight forwarding company providing PAN India import and export logistics to worldwide destinations, including ocean freight, air freight, FCL/LCL, consolidation, customs clearance, warehousing, project cargo, EXIM advisory and door-to-door delivery.",
  },
  {
    question: "Does ExpressWay provide PAN India logistics services?",
    answer:
      "Yes. ExpressWay supports customers across India through a nationwide logistics network, connecting Indian origins with worldwide destinations. Headquarters are in Noida. City and port pages describe service coverage, not a physical office in every location.",
  },
  {
    question: "How can I ship cargo from India to Dubai?",
    answer:
      "Request a quote with origin in India, destination Dubai, cargo type and volume. ExpressWay can book ocean FCL/LCL or air freight, then coordinate packing if needed, pickup, export documents, clearance, status updates and door delivery when required. Indicative transit varies by carrier, sailing, origin, destination, customs and operational conditions.",
  },
  {
    question: "What documents are required for international shipping from India?",
    answer:
      "Typical export documents include a commercial invoice, packing list, the exporter’s IEC, and a shipping bill with a bill of lading (ocean) or air waybill (air). Hazardous goods, pharma, used machinery and licensed cargo may need extra certificates. ExpressWay prepares clearance paperwork for the actual shipment. Requirements vary; this is not a complete legal checklist for every cargo.",
  },
  {
    question: "How is international freight pricing calculated?",
    answer:
      "There is no single published rate. Cost depends on origin, destination, mode (sea or air), cargo type, volume or container size, and extras such as customs, warehousing, insurance or door delivery. Share those details on the quote form. ExpressWay does not quote a price without cargo and lane details.",
  },
];

export const HOME_SUPPORTING_FAQS: FaqItem[] = [
  {
    question: "What does ExpressWay Logistic do?",
    answer:
      "We are a neutral NVOCC and freight forwarder offering ocean and air freight, consolidation, customs clearance, warehousing, project cargo, cargo insurance arrangement, packing, and door-to-door delivery — plus EXIM guidance such as licence and drawback assistance where offered.",
  },
  {
    question: "Which cargo types do you specialise in?",
    answer:
      "Exports include leather, garments, handicrafts, pharma, engineering goods, herbal products and personal effects. Imports include project and second-hand machinery, bulk cargo, coastal cargo, chemicals and bulk drugs.",
  },
  {
    question: "Can I track my shipment in real time?",
    answer:
      "Yes. Use the public tracking page with an ExpressWay tracking ID (format EW-XXXXX) for operational status, ETA and milestone history. Public lookup does not expose full commercial invoices or client account data.",
  },
  {
    question: "How quickly can I get a freight quote?",
    answer: QUOTE_RESPONSE_STATEMENT,
  },
  {
    question: "Do you help with EXIM licences and drawback?",
    answer:
      "Yes, where that support is applicable to the shipment. We assist with documentation, IEC-related questions, licence assistance and drawback assistance as part of EXIM advisory. Government schemes change; current applicability is verified for the actual trade, not assumed from historical programme names.",
  },
  {
    question: "Does ExpressWay provide PAN India logistics services?",
    answer:
      "Yes. Serving customers across India through a nationwide logistics network, connecting Indian origins with worldwide destinations.",
  },
  {
    question: "Which Indian ports can ExpressWay support?",
    answer:
      "ExpressWay supports cargo moving via commercially used Indian gateways including Nhava Sheva, Mundra, Chennai and Kolkata, with inland pickup arranged through the logistics network. Port pages describe cargo movement, not ExpressWay-owned terminals.",
  },
  {
    question: "Can ExpressWay arrange door-to-door delivery?",
    answer:
      "Yes, when door delivery is in the booking scope: pickup, origin handling, freight, documents, customs, main carriage, destination clearance and final delivery. Not every quote includes every step.",
  },
  {
    question: "Does ExpressWay handle both imports and exports?",
    answer:
      "Yes. Ocean NVOCC, air freight, consolidation, customs, warehousing and door-to-door cover inbound and outbound cargo.",
  },
  {
    question: "How is international freight pricing calculated?",
    answer: CORE_INTENT_FAQS[4].answer,
  },
];

export const FAQ_ITEMS: FaqItem[] = [
  ...CORE_INTENT_FAQS,
  ...HOME_SUPPORTING_FAQS.filter(
    (item) => !CORE_INTENT_FAQS.some((core) => core.question === item.question),
  ),
];

export const SERVICES_PAGE_FAQS: FaqItem[] = [
  CORE_INTENT_FAQS[0],
  CORE_INTENT_FAQS[4],
  {
    question: "Do you handle both import and export freight?",
    answer:
      "Yes. Ocean NVOCC, air freight, consolidation, customs, warehousing and door-to-door cover inbound and outbound cargo.",
  },
  {
    question: "What is a neutral NVOCC?",
    answer:
      "A neutral NVOCC books ocean space without locking you into a single carrier. ExpressWay sources FCL and LCL options so you can compare cost and schedule. We do not publish exclusive liner lists.",
  },
  {
    question: "Can I book only customs or only freight?",
    answer:
      "Yes. ExpressWay can provide individual services such as freight booking or customs clearance where the shipment scope allows it. The exact service combination depends on the cargo, origin, destination and operational requirements.",
  },
];

export const PROCESS_PAGE_FAQS: FaqItem[] = [
  CORE_INTENT_FAQS[2],
  CORE_INTENT_FAQS[3],
  {
    question: "How do I start an international shipment with ExpressWay?",
    answer:
      "Share origin, destination and cargo on the quote form. After you confirm, we book sea or air, prepare documents, pick up cargo, clear it, and deliver to the consignee when door delivery is in scope.",
  },
  {
    question: "How long does international transit take?",
    answer:
      "Indicative transit times vary based on origin, destination, carrier, sailing schedule, customs and operational conditions. Your quote states the booked mode and expected window. We do not publish guaranteed transits.",
  },
  {
    question: "Who prepares the shipping documents?",
    answer:
      "You provide commercial details — invoice, packing list, and any licences you already hold. ExpressWay books freight, prepares clearance documentation, and files for port and customs so cargo is not waiting on paperwork.",
  },
];

export const INDUSTRIES_PAGE_FAQS: FaqItem[] = [
  HOME_SUPPORTING_FAQS[1],
  {
    question: "Can you handle project machinery exports and imports?",
    answer:
      "Yes. Project cargo covers machinery and project imports including registration, clearance, finalisation and cancellation with authorities when required. Specialised lifting is confirmed per shipment.",
  },
  {
    question: "Do you move chemicals and pharma?",
    answer:
      "Yes. Chemicals need compliant packing and declarations before they are offered to a line. Pharma and bulk drugs need handling and documentation matched to the product. Hazardous cargo is accepted only where legally and operationally supported.",
  },
];

export const ABOUT_PAGE_FAQS: FaqItem[] = [
  {
    question: "Who is ExpressWay Logistic?",
    answer:
      "ExpressWay Logistic (legal name Expressway Logistic Private Limited) is an Indian neutral NVOCC and freight forwarding company. Headquarters are in Noida, Uttar Pradesh. Leadership includes Sunil Kumar, CEO & Managing Director, and Jugendra Singh, General Manager & Business Development Officer.",
  },
  {
    question: "Where does ExpressWay operate?",
    answer:
      "The company serves customers across India through a nationwide logistics network and connects Indian origins with worldwide destinations. Noida is the office location, not the limit of geographic coverage.",
  },
  {
    question: "Is ExpressWay an NVOCC?",
    answer:
      "Yes. ExpressWay operates as a neutral NVOCC for ocean cargo, alongside freight forwarding, customs clearance, warehousing arranged through the network, project cargo and related EXIM services.",
  },
  {
    question: "Does ExpressWay provide air and ocean freight?",
    answer:
      "Yes. Primary modes are ocean freight and air freight, including FCL, LCL and consolidation on ocean.",
  },
];

export const QUOTE_PAGE_FAQS: FaqItem[] = [
  CORE_INTENT_FAQS[4],
  CORE_INTENT_FAQS[2],
  {
    question: "How quickly can I get a freight quote?",
    answer: QUOTE_RESPONSE_STATEMENT,
  },
  {
    question: "What details do you need for an accurate quote?",
    answer:
      "Origin, destination, mode preference if you have one (sea or air), cargo type, approximate weight or CBM or container size, and any extras (customs, packing, insurance, door delivery). Incomplete details produce a wider estimate, not a bookable rate.",
  },
  {
    question: "Do you publish a freight rate list?",
    answer:
      "No. Liner and air rates move with space, fuel and season. ExpressWay sources competitive options per shipment instead of a static public tariff.",
  },
];

export const TRACK_PAGE_FAQS: FaqItem[] = [
  {
    question: "What information is needed to track a shipment?",
    answer:
      "An ExpressWay tracking, booking or shipment reference (format EW-XXXXX on the public tracker). Enter it on this page. Do not share commercial invoices in the public form.",
  },
  {
    question: "What do shipment statuses mean?",
    answer:
      "Public status shows operational milestones such as booked, in transit, arrived and delivered where those events exist for the file. Wording follows the tracking record, not a marketing label.",
  },
  {
    question: "What if no result is found?",
    answer:
      "Confirm the reference from your booking confirmation. If the ID is new, it may not be in the public tracker yet. Contact sales@expresswaylogistics.com or +91 98736 93160 with the reference — do not paste private documents into search engines or public forms.",
  },
  {
    question: "Does public tracking show my company details?",
    answer:
      "No. Public lookup shows operational status, lane, mode, ETA and timeline events — not full commercial invoices or client account data.",
  },
];

export const APPOINTMENT_PAGE_FAQS: FaqItem[] = [
  {
    question: "Why should I schedule an appointment?",
    answer:
      "Book a meeting for logistics consultation, EXIM discussion, freight planning or customs discussion when a form is not enough. Use the quote form when you already know origin, destination and cargo details.",
  },
  {
    question: "Who should schedule?",
    answer:
      "Importers, exporters, procurement and logistics managers who need to walk through a lane, project cargo, licences or a warehouse discussion with the Noida team.",
  },
  {
    question: "Where are in-person meetings held?",
    answer:
      "In-person appointments take place at Unit No. 623, 6th Floor, Tower-1, Assotech Business Cresterra, Sector-135, Noida. Remote video and phone meetings are available for clients across India and abroad.",
  },
  {
    question: "What timezone are the slots in?",
    answer:
      "Slots are in India Standard Time (IST), aligned with the Noida operations team.",
  },
  {
    question: "Can I reschedule or cancel?",
    answer:
      "Yes. Reply to your confirmation email or call at least 24 hours ahead and we will move or cancel the appointment.",
  },
];

export const CONTACT_PAGE_FAQS: FaqItem[] = [
  ABOUT_PAGE_FAQS[1],
  {
    question: "How do I request a freight quote?",
    answer:
      "Use the quote page with origin, destination and cargo details, email sales@expresswaylogistics.com, or call +91 98736 93160.",
  },
  {
    question: "What is the official office address?",
    answer:
      "Unit No. 623, 6th Floor, Tower-1, Assotech Business Cresterra, Sector-135, Noida, G.B. Nagar, Uttar Pradesh 201305.",
  },
];

export const PAN_INDIA_FAQS: FaqItem[] = [
  CORE_INTENT_FAQS[1],
  {
    question: "Does ExpressWay have an office in every Indian city?",
    answer:
      "No. Headquarters are in Noida. Other cities and ports listed on this site are service coverage through the nationwide logistics network, not claimed branch offices.",
  },
  {
    question: "Can you pick up cargo inland, not only at ports?",
    answer:
      "Yes. Inland pickup is arranged through the logistics network so factory and warehouse cargo can move to the booked port or airport.",
  },
];

export { getServiceFaqs } from "@/constants/service-faqs";

export const EXPORT_DOCUMENT_POINTS = [
  "Commercial invoice and packing list",
  "Exporter IEC and shipping bill",
  "Bill of lading (ocean) or air waybill (air)",
  "Licences or certificates when the cargo or destination requires them",
] as const;
