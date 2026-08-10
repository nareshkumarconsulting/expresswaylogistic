import type {
  AiInsight,
  CalendarEvent,
  QuoteRequest,
  Shipment,
  TrackingResult,
} from "@/types";

function isoDateFromOffset(dayOffset: number): string {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + dayOffset);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

/** Next weekday on or after today + offset (skips Sat/Sun). */
function isoWeekdayFromOffset(dayOffset: number): string {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + dayOffset);
  while (d.getDay() === 0 || d.getDay() === 6) {
    d.setDate(d.getDate() + 1);
  }
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export const MOCK_SHIPMENTS: Shipment[] = [
  {
    id: "EW-10847",
    origin: "Mumbai",
    destination: "Dubai",
    type: "Air Freight",
    status: "In Transit",
    eta: "2 hours",
    client: "Reliance Industries",
    predictedEtaHours: 2.1,
    riskScore: 12,
  },
  {
    id: "EW-10846",
    origin: "Delhi",
    destination: "London",
    type: "Air Freight",
    status: "Customs Hold",
    eta: "Pending",
    client: "Tata Motors",
    predictedEtaHours: 18,
    riskScore: 78,
  },
  {
    id: "EW-10845",
    origin: "Chennai",
    destination: "Singapore",
    type: "Ocean Freight",
    status: "In Transit",
    eta: "4 days",
    client: "Adani Group",
    predictedEtaHours: 96,
    riskScore: 22,
  },
  {
    id: "EW-10844",
    origin: "Bengaluru",
    destination: "San Francisco",
    type: "Air Freight",
    status: "Delivered",
    eta: "Completed",
    client: "Infosys",
    predictedEtaHours: 0,
    riskScore: 5,
  },
  {
    id: "EW-10843",
    origin: "Mumbai",
    destination: "Rotterdam",
    type: "Ocean Freight",
    status: "Processing",
    eta: "12 days",
    client: "Mahindra & Mahindra",
    predictedEtaHours: 288,
    riskScore: 31,
  },
  {
    id: "EW-10842",
    origin: "Hyderabad",
    destination: "Frankfurt",
    type: "Air Freight",
    status: "In Transit",
    eta: "6 hours",
    client: "Wipro",
    predictedEtaHours: 6.4,
    riskScore: 18,
  },
  {
    id: "EW-10841",
    origin: "Kolkata",
    destination: "Hong Kong",
    type: "Ocean Freight",
    status: "Delayed",
    eta: "9 days",
    client: "ITC Limited",
    predictedEtaHours: 216,
    riskScore: 64,
  },
  {
    id: "EW-10840",
    origin: "Pune",
    destination: "Sydney",
    type: "Air Freight",
    status: "Delivered",
    eta: "Completed",
    client: "Tech Mahindra",
    predictedEtaHours: 0,
    riskScore: 4,
  },
];

export const MOCK_CALENDAR_EVENTS: CalendarEvent[] = [
  {
    id: "cal-ap-1001",
    title: "Freight Planning — Reliance Industries",
    kind: "appointment",
    date: isoWeekdayFromOffset(0),
    startTime: "10:00",
    endTime: "10:30",
    status: "confirmed",
    company: "Reliance Industries",
    meetingMode: "video",
    appointmentType: "freight-planning",
    relatedId: "AP-1001",
    notes: "Mumbai → Dubai lane options and pickup window",
  },
  {
    id: "cal-ap-1002",
    title: "Customs Advisory — Tata Motors",
    kind: "appointment",
    date: isoWeekdayFromOffset(1),
    startTime: "11:00",
    endTime: "11:45",
    status: "confirmed",
    company: "Tata Motors",
    meetingMode: "phone",
    appointmentType: "customs-advisory",
    relatedId: "AP-1002",
    notes: "Invoice amendment for London customs hold",
  },
  {
    id: "cal-ap-1003",
    title: "Warehouse Visit — Adani Group",
    kind: "appointment",
    date: isoWeekdayFromOffset(3),
    startTime: "14:00",
    endTime: "15:00",
    status: "pending",
    company: "Adani Group",
    location: "Assotech Business Cresterra, Sector-135, Noida",
    meetingMode: "in-person",
    appointmentType: "warehouse-visit",
    relatedId: "AP-1003",
  },
  {
    id: "cal-ap-1004",
    title: "Account Onboarding — Wipro",
    kind: "appointment",
    date: isoWeekdayFromOffset(5),
    startTime: "15:00",
    endTime: "15:45",
    status: "confirmed",
    company: "Wipro",
    meetingMode: "video",
    appointmentType: "account-onboarding",
    relatedId: "AP-1004",
    notes: "Command Center access and preferred lanes",
  },
  {
    id: "cal-ap-1005",
    title: "Freight Planning — Mahindra & Mahindra",
    kind: "appointment",
    date: isoWeekdayFromOffset(8),
    startTime: "09:00",
    endTime: "09:30",
    status: "pending",
    company: "Mahindra & Mahindra",
    meetingMode: "video",
    appointmentType: "freight-planning",
    relatedId: "AP-1005",
    notes: "Ocean booking for Mumbai → Rotterdam",
  },
  {
    id: "cal-eta-10847",
    title: "ETA — EW-10847 Mumbai → Dubai",
    kind: "shipment-eta",
    date: isoDateFromOffset(0),
    startTime: "16:00",
    status: "in-transit",
    company: "Reliance Industries",
    relatedId: "EW-10847",
    notes: "Air freight arrival window",
  },
  {
    id: "cal-eta-10842",
    title: "ETA — EW-10842 Hyderabad → Frankfurt",
    kind: "shipment-eta",
    date: isoDateFromOffset(0),
    startTime: "20:00",
    status: "in-transit",
    company: "Wipro",
    relatedId: "EW-10842",
    notes: "Air freight arrival window",
  },
  {
    id: "cal-eta-10846",
    title: "ETA — EW-10846 Delhi → London",
    kind: "shipment-eta",
    date: isoDateFromOffset(1),
    startTime: "12:00",
    status: "at-risk",
    company: "Tata Motors",
    relatedId: "EW-10846",
    notes: "Customs hold — ETA may slip 14–22 hours",
  },
  {
    id: "cal-eta-10845",
    title: "ETA — EW-10845 Chennai → Singapore",
    kind: "shipment-eta",
    date: isoDateFromOffset(4),
    startTime: "09:00",
    status: "in-transit",
    company: "Adani Group",
    relatedId: "EW-10845",
    notes: "Ocean sailing expected berth",
  },
  {
    id: "cal-eta-10841",
    title: "ETA — EW-10841 Kolkata → Hong Kong",
    kind: "shipment-eta",
    date: isoDateFromOffset(9),
    startTime: "18:00",
    status: "at-risk",
    company: "ITC Limited",
    relatedId: "EW-10841",
    notes: "Port congestion may add up to 48 hours",
  },
  {
    id: "cal-eta-10843",
    title: "ETA — EW-10843 Mumbai → Rotterdam",
    kind: "shipment-eta",
    date: isoDateFromOffset(12),
    startTime: "10:00",
    status: "in-transit",
    company: "Mahindra & Mahindra",
    relatedId: "EW-10843",
    notes: "Ocean freight processing → transit",
  },
];

function isoDateTimeFromOffset(dayOffset: number, hour = 10, minute = 0): string {
  const d = new Date();
  d.setHours(hour, minute, 0, 0);
  d.setDate(d.getDate() + dayOffset);
  return d.toISOString();
}

export const MOCK_QUOTE_REQUESTS: QuoteRequest[] = [
  {
    id: "QW-2401",
    name: "Priya Sharma",
    company: "Tech Mahindra",
    email: "priya.sharma@techmahindra.com",
    phone: "+91 98736 93160",
    origin: "Pune",
    destination: "Sydney",
    serviceType: "air",
    message:
      "Urgent air freight for electronics; need door-to-door quote within 24 hours",
    status: "New",
    submittedAt: isoDateTimeFromOffset(0, 9, 30),
  },
  {
    id: "QW-2400",
    name: "Rahul Mehta",
    company: "Reliance Industries",
    email: "rahul.mehta@ril.com",
    phone: "+91 98200 11223",
    origin: "Mumbai",
    destination: "Dubai",
    serviceType: "ocean-fcl",
    message: "2×40' HC weekly lane for FMCG; include destination THC and delivery.",
    status: "In Review",
    submittedAt: isoDateTimeFromOffset(-1, 14, 15),
    internalNotes: "Waiting on destination delivery ZIP from shipper.",
    updatedAt: isoDateTimeFromOffset(-1, 16, 0),
  },
  {
    id: "QW-2399",
    name: "Ananya Iyer",
    company: "Tata Motors",
    email: "ananya.iyer@tatamotors.com",
    origin: "Delhi",
    destination: "London",
    serviceType: "customs",
    message: "Need customs advisory quote for auto parts HS codes and broker fees.",
    status: "Quoted",
    submittedAt: isoDateTimeFromOffset(-2, 11, 0),
    quotedAmount: "₹48,500",
    internalNotes: "Sent HS advisory + broker fee breakdown via email.",
    updatedAt: isoDateTimeFromOffset(-1, 9, 30),
  },
  {
    id: "QW-2398",
    name: "Vikram Singh",
    company: "Adani Group",
    email: "vikram.singh@adani.com",
    phone: "+91 99887 66554",
    origin: "Chennai",
    destination: "Singapore",
    serviceType: "ocean-lcl",
    message: "LCL consolidation for machinery spare parts, ~4 CBM, non-haz.",
    status: "Won",
    submittedAt: isoDateTimeFromOffset(-4, 16, 45),
  },
  {
    id: "QW-2397",
    name: "Neha Kapoor",
    company: "Infosys",
    email: "neha.kapoor@infosys.com",
    origin: "Bengaluru",
    destination: "San Francisco",
    serviceType: "air",
    message: "IT equipment air freight; prefer next-day pickup from Whitefield.",
    status: "Closed",
    submittedAt: isoDateTimeFromOffset(-6, 10, 20),
  },
  {
    id: "QW-2396",
    name: "Amit Joshi",
    company: "Mahindra & Mahindra",
    email: "amit.joshi@mahindra.com",
    phone: "+91 97654 32109",
    origin: "Mumbai",
    destination: "Rotterdam",
    serviceType: "warehousing",
    message: "Short-term bonded storage quote before ocean sailing to Rotterdam.",
    status: "In Review",
    submittedAt: isoDateTimeFromOffset(-3, 13, 10),
  },
];

export const MOCK_AI_INSIGHTS: AiInsight[] = [
  {
    id: "ai-1",
    severity: "critical",
    title: "Customs delay risk — EW-10846",
    summary:
      "Documentation mismatch detected on Delhi → London air freight. Similar holds historically add 14–22 hours.",
    recommendation:
      "Escalate commercial invoice amendment and pre-alert London customs broker.",
    relatedShipmentId: "EW-10846",
    createdAt: new Date().toISOString(),
  },
  {
    id: "ai-2",
    severity: "warning",
    title: "Weather impact on Asia lane",
    summary:
      "Port congestion near Hong Kong may delay EW-10841 by up to 48 hours.",
    recommendation:
      "Offer customer proactive ETA update and evaluate feeder reroute via Singapore.",
    relatedShipmentId: "EW-10841",
    createdAt: new Date().toISOString(),
  },
  {
    id: "ai-3",
    severity: "info",
    title: "Cost optimization opportunity",
    summary:
      "Ocean consolidation for Chennai → Singapore LCL could reduce cost 11% next week.",
    recommendation:
      "Bundle pending FMCG bookings into Thursday sailing.",
    createdAt: new Date().toISOString(),
  },
];

export function findTracking(trackingId: string): TrackingResult | null {
  const shipment = MOCK_SHIPMENTS.find(
    (s) => s.id.toLowerCase() === trackingId.toLowerCase(),
  );
  if (!shipment) return null;

  return {
    trackingId: shipment.id,
    status: shipment.status,
    origin: shipment.origin,
    destination: shipment.destination,
    mode: shipment.type,
    eta: shipment.eta,
    lastUpdate: new Date().toISOString(),
    events: [
      {
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
        location: shipment.origin,
        description: "Shipment booked and cargo received",
      },
      {
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
        location: shipment.origin,
        description: "Departed origin hub",
      },
      {
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
        location: "En route",
        description: `Status: ${shipment.status}`,
      },
    ],
  };
}

export const SHIPMENT_VOLUME = [
  { month: "Jan", air: 342, ocean: 198 },
  { month: "Feb", air: 389, ocean: 234 },
  { month: "Mar", air: 421, ocean: 276 },
  { month: "Apr", air: 398, ocean: 312 },
  { month: "May", air: 467, ocean: 289 },
  { month: "Jun", air: 512, ocean: 356 },
  { month: "Jul", air: 489, ocean: 402 },
  { month: "Aug", air: 534, ocean: 378 },
  { month: "Sep", air: 578, ocean: 421 },
  { month: "Oct", air: 612, ocean: 467 },
  { month: "Nov", air: 589, ocean: 512 },
  { month: "Dec", air: 643, ocean: 534 },
];

export const FREIGHT_MIX = [
  { name: "Air", value: 38, color: "hsl(210 78% 18%)" },
  { name: "Ocean", value: 29, color: "hsl(32 100% 50%)" },
  { name: "Road", value: 24, color: "hsl(205 90% 60%)" },
  { name: "Custom", value: 9, color: "hsl(210 10% 60%)" },
];

export const TOP_ROUTES = [
  { route: "Mumbai → Dubai", volume: 1247 },
  { route: "Delhi → London", volume: 1089 },
  { route: "Chennai → Singapore", volume: 934 },
  { route: "Kolkata → Hong Kong", volume: 812 },
  { route: "Mumbai → New York", volume: 756 },
];
