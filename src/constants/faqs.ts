export type FaqItem = {
  question: string;
  answer: string;
};

export const CORE_INTENT_FAQS: FaqItem[] = [
  {
    question:
      "What international freight forwarding services does ExpressWay Logistic provide?",
    answer:
      "ExpressWay Logistic is a neutral NVOCC offering ocean freight (FCL and LCL), air freight, consolidation, customs clearance, warehousing, door-to-door delivery, project cargo, cargo insurance, EXIM trade advisory, packing and handling, and sea/air freight booking. One desk in Noida handles import and export from quote through delivery.",
  },
  {
    question: "How can I ship cargo from India to Dubai?",
    answer:
      "Request a quote with origin in India, destination Dubai, cargo type, and volume. ExpressWay books ocean FCL/LCL or air freight on India–Middle East lanes (typical transit about 3–7 days to Dubai, Jeddah, or Doha), then handles packing if needed, pickup, export documents, clearance, status updates, and door delivery when required. Start on the quote form or follow the five-step process.",
  },
  {
    question: "What documents are required for international shipping from India?",
    answer:
      "Typical export documents include a commercial invoice, packing list, the exporter’s IEC, and a shipping bill with a bill of lading (ocean) or air waybill (air). Hazardous goods, pharma, used machinery, and licensed cargo may need extra certificates or licences. ExpressWay prepares clearance paperwork and tells you what your lane and commodity require — we do not treat one generic checklist as legally complete for every shipment.",
  },
  {
    question: "Which freight forwarding company can handle my export shipment?",
    answer:
      "Expressway Logistic Pvt Ltd (ExpressWay Logistic) is a Noida-based neutral NVOCC that handles export shipments — leather, garments, handicrafts, pharma, engineering goods, herbal products, personal effects, and more — plus import project machinery, bulk, coastal cargo, and chemicals. Contact sales@expresswaylogistics.com or +91 98736 93160, or request a quote.",
  },
  {
    question: "How much does international freight forwarding cost?",
    answer:
      "There is no single published rate. Cost depends on origin, destination, mode (sea or air), cargo type, volume or container size, and extras such as customs, warehousing, insurance, or door delivery. Share those details on the quote form; the ExpressWay desk typically responds within two business hours with competitive options. We do not quote a price without cargo and lane details.",
  },
];

export const HOME_SUPPORTING_FAQS: FaqItem[] = [
  {
    question: "What does ExpressWay Logistic do?",
    answer:
      "We are a neutral NVOCC and freight forwarder offering ocean and air freight, consolidation, customs clearance, warehousing, project cargo, cargo insurance, packing, and door-to-door delivery — plus EXIM guidance such as licence and drawback assistance.",
  },
  {
    question: "Which cargo types do you specialise in?",
    answer:
      "Exports include leather, garments, handicrafts, pharma, engineering goods, herbal products, and personal effects. Imports include project and second-hand machinery, bulk cargo, coastal cargo, chemicals, and bulk drugs.",
  },
  {
    question: "Can I track my shipment in real time?",
    answer:
      "Yes. Use the public tracking page with an ExpressWay tracking ID (format EW-XXXXX) for live status, ETA, and milestone history. The ops desk also provides round-the-clock shipment detail support.",
  },
  {
    question: "How quickly can I get a freight quote?",
    answer:
      "Submit the quote form with origin, destination, and cargo details. Our team typically responds within two business hours with competitive sea or air options.",
  },
  {
    question: "Do you help with EXIM licences and drawback?",
    answer:
      "Yes. We assist clients with DEPB / advance licence requirements and drawback claims as part of our EXIM trade advisory support.",
  },
];

export const FAQ_ITEMS: FaqItem[] = [
  ...CORE_INTENT_FAQS,
  ...HOME_SUPPORTING_FAQS,
];

export const SERVICES_PAGE_FAQS: FaqItem[] = [
  CORE_INTENT_FAQS[0],
  CORE_INTENT_FAQS[4],
  {
    question: "Do you handle both import and export freight?",
    answer:
      "Yes. Ocean NVOCC, air freight, consolidation, customs, warehousing, and door-to-door cover inbound and outbound cargo. Project cargo and used machinery are a common import specialisation; garments, leather, and handicrafts are common exports.",
  },
  {
    question: "What is a neutral NVOCC?",
    answer:
      "A neutral NVOCC books ocean space through liner relationships without locking you into a single carrier. ExpressWay sources competitive FCL and LCL options so you can compare cost and schedule rather than a house-only sailing.",
  },
  {
    question: "Can I book only customs or only freight?",
    answer:
      "Yes. You can use a single line — for example ocean booking, air freight, or customs clearance — or combine door-to-door with packing, insurance, and EXIM advisory. Tell us what you already have in place when you request a quote.",
  },
];

export const PROCESS_PAGE_FAQS: FaqItem[] = [
  CORE_INTENT_FAQS[1],
  CORE_INTENT_FAQS[2],
  {
    question: "How do I start an international shipment with ExpressWay?",
    answer:
      "Share origin, destination, and cargo on the quote form. After you confirm, we book sea or air, prepare documents, pick up cargo, clear it, and deliver to the consignee when door delivery is in scope. The same desk stays with the shipment.",
  },
  {
    question: "How long does India to Middle East transit take?",
    answer:
      "India to the Middle East is typically about 3–7 days depending on mode and gateway (Dubai, Jeddah, Doha). Europe is often 5–14 days, Southeast Asia 2–6 days, and North America 7–21 days. Your quote states the booked mode and expected window.",
  },
  {
    question: "Who prepares the shipping documents?",
    answer:
      "You provide commercial details — invoice, packing list, and any licences you already hold. ExpressWay books freight, prepares clearance documentation, and files for port and customs so cargo is not waiting on paperwork.",
  },
];

export const INDUSTRIES_PAGE_FAQS: FaqItem[] = [
  CORE_INTENT_FAQS[3],
  {
    question: "Which cargo types do you specialise in?",
    answer:
      "Exports include leather, garments, handicrafts, pharma, engineering goods, herbal products, and personal effects. Imports include project and second-hand machinery, bulk cargo, coastal cargo, chemicals, and bulk drugs.",
  },
  {
    question: "Can you handle project machinery exports and imports?",
    answer:
      "Yes. Project cargo covers machinery and project imports including registration, clearance, finalisation, and cancellation with authorities, plus heavy-lift coordination when the cargo requires it.",
  },
  {
    question: "Do you move chemicals and pharma?",
    answer:
      "Yes. Chemicals need compliant packing and declarations before they are offered to a line. Pharma and bulk drugs need temperature-aware handling and documentation matched to the product, not a generic freight template.",
  },
];

export const ABOUT_PAGE_FAQS: FaqItem[] = [
  CORE_INTENT_FAQS[3],
  CORE_INTENT_FAQS[0],
  {
    question: "Where is ExpressWay Logistic located?",
    answer:
      "Headquarters are at Unit No. 623, 6th Floor, Tower-1, Assotech Business Cresterra, Sector-135, Noida, G.B. Nagar, Uttar Pradesh 201305. In-person appointments and warehouse discussions are booked from that office.",
  },
  {
    question: "How long has ExpressWay been in international cargo?",
    answer:
      "Expressway Logistic Pvt Ltd is promoted by professionals with 39 years in international cargo movement. The company operates as a neutral NVOCC with 24×7 shipment and documentation support.",
  },
];

export const QUOTE_PAGE_FAQS: FaqItem[] = [
  CORE_INTENT_FAQS[4],
  CORE_INTENT_FAQS[1],
  {
    question: "How quickly can I get a freight quote?",
    answer:
      "Submit origin, destination, cargo type, and volume. The desk typically responds within two business hours, and the quote form states a one-business-day outer window.",
  },
  {
    question: "What details do you need for an accurate quote?",
    answer:
      "Origin, destination, mode preference if you have one (sea or air), cargo type, approximate weight or CBM or container size, and any extras (customs, packing, insurance, door delivery). Incomplete details produce a wider estimate, not a bookable rate.",
  },
  {
    question: "Do you publish a freight rate list?",
    answer:
      "No. Liner and air rates move with space, fuel, and season. ExpressWay sources competitive options per shipment instead of a static public tariff.",
  },
];

export const TRACK_PAGE_FAQS: FaqItem[] = [
  {
    question: "Can I track my shipment in real time?",
    answer:
      "Yes. Enter your ExpressWay tracking ID (format EW-XXXXX) on this page for live status, origin and destination, mode, ETA, and milestone history. Demo IDs are available if you are evaluating the site.",
  },
  {
    question: "What if I do not have a tracking ID yet?",
    answer:
      "Tracking IDs are issued after cargo is booked with ExpressWay. Request a quote or book an appointment to start a shipment. For status on an existing move, use the ID from your booking confirmation or ask sales@expresswaylogistics.com.",
  },
  {
    question: "Does public tracking show my company details?",
    answer:
      "No. Public lookup shows operational status, lane, mode, ETA, and timeline events — not full commercial invoices or client account data.",
  },
];

export const APPOINTMENT_PAGE_FAQS: FaqItem[] = [
  CORE_INTENT_FAQS[3],
  {
    question: "Should I book a meeting or request a quote?",
    answer:
      "Use the quote form when you already know origin, destination, and cargo details. Book a meeting for freight planning, customs guidance, project cargo, EXIM licences, packing advice, a warehouse tour, or new shipper onboarding.",
  },
  {
    question: "What should I prepare before the appointment?",
    answer:
      "Have commodity type, approximate weight/volume, Incoterms if known, and any past shipping pain points ready. For customs or project meetings, bring sample invoices, packing lists, or machinery specs if available.",
  },
  {
    question: "Where are in-person meetings held?",
    answer:
      "In-person appointments and warehouse visits take place at Unit No. 623, 6th Floor, Tower-1, Assotech Business Cresterra, Sector-135, Noida. We send visitor instructions with your confirmation.",
  },
  {
    question: "What timezone are the slots in?",
    answer:
      "Slots are in India Standard Time (IST), aligned with our Noida operations team. Remote video and phone meetings are available for clients across India and abroad.",
  },
  {
    question: "Can I reschedule or cancel?",
    answer:
      "Yes. Reply to your confirmation email or call us at least 24 hours ahead and we will move or cancel the appointment.",
  },
];

export function getServiceFaqs(title: string): FaqItem[] {
  return [
    {
      question: `What is ExpressWay Logistic’s ${title} service?`,
      answer: `${title} is one of the international freight forwarding services offered by ExpressWay Logistic, a neutral NVOCC in Noida. It can be booked on its own or combined with customs, packing, insurance, and door-to-door delivery for import or export.`,
    },
    {
      question: `How much does ${title} cost?`,
      answer: `Pricing for ${title} depends on origin, destination, cargo type, volume, and whether you add clearance or delivery. There is no public rate card. Request a quote with those details for competitive sea or air options.`,
    },
    {
      question: `How do I book ${title} from India?`,
      answer: `Share origin, destination, and cargo on the quote form, or book an appointment with the Noida desk. After you confirm, ExpressWay books the move, prepares documents, and keeps status updates through delivery when that is in scope.`,
    },
    CORE_INTENT_FAQS[2],
  ];
}

export const EXPORT_DOCUMENT_POINTS = [
  "Commercial invoice and packing list",
  "Exporter IEC and shipping bill",
  "Bill of lading (ocean) or air waybill (air)",
  "Licences or certificates when the cargo or destination requires them",
] as const;
