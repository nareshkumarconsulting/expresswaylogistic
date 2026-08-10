import { siteConfig } from "@/config/site";
import { FAQ_ITEMS, INDUSTRIES, PROCESS_STEPS } from "@/constants/content";
import { SERVICES } from "@/constants/services";
import {
  APPOINTMENT_TYPES,
  MEETING_MODES,
  MEETING_TYPES,
  TIME_SLOTS,
  type AppointmentType,
  type MeetingMode,
  type PreferredTime,
} from "@/features/appointment/schemas";
import type {
  BookingDraft,
  VoiceAgentAction,
  VoiceAgentResponse,
} from "@/features/voice-agent/schemas";

type Intent = VoiceAgentResponse["data"]["intent"];

const BOOKING_FIELDS = [
  "name",
  "company",
  "email",
  "phone",
  "appointmentType",
  "preferredDate",
  "preferredTime",
  "meetingMode",
] as const satisfies readonly (keyof BookingDraft)[];

type BookingField = (typeof BOOKING_FIELDS)[number];

const FIELD_PROMPTS: Record<BookingField, string> = {
  name: "May I have your full name?",
  company: "Which company are you with?",
  email: "What's the best email for the confirmation?",
  phone: "And a phone number we can reach you on?",
  appointmentType:
    "What type of meeting do you need — freight planning, customs advisory, warehouse visit, or account onboarding?",
  preferredDate:
    "Which weekday works best? You can say something like August twelfth, or next Tuesday.",
  preferredTime:
    "What time works for you? For example, ten AM or three PM.",
  meetingMode: "Would you prefer video, phone, or an in-person meeting?",
};

function normalize(text: string): string {
  return text.toLowerCase().trim().replace(/\s+/g, " ");
}

function includesAny(text: string, phrases: string[]): boolean {
  return phrases.some((p) => text.includes(p));
}

export function detectIntent(message: string, drafting: boolean): Intent {
  const t = normalize(message);

  if (
    includesAny(t, [
      "bye",
      "goodbye",
      "that's all",
      "thats all",
      "thank you",
      "thanks",
      "no more",
    ])
  ) {
    return "goodbye";
  }

  if (
    drafting ||
    includesAny(t, [
      "appointment",
      "book",
      "schedule",
      "meeting",
      "speak to someone",
      "talk to",
      "consultation",
    ])
  ) {
    return "appointment";
  }

  if (
    includesAny(t, ["hello", "hi ", "hi,", "hey", "good morning", "good afternoon", "good evening"]) ||
    t === "hi"
  ) {
    return "greeting";
  }

  if (
    includesAny(t, [
      "track",
      "tracking",
      "shipment status",
      "where is my",
      "awb",
      "container",
    ])
  ) {
    return "tracking";
  }

  if (
    includesAny(t, ["quote", "pricing", "price", "rate", "cost", "estimate"])
  ) {
    return "quote";
  }

  if (
    includesAny(t, [
      "contact",
      "phone",
      "email",
      "address",
      "whatsapp",
      "call you",
      "reach you",
    ])
  ) {
    return "contact";
  }

  if (includesAny(t, ["service", "freight", "shipping", "air", "ocean", "warehouse", "customs", "road"])) {
    return "services";
  }

  if (includesAny(t, ["process", "how it works", "how do you", "steps"])) {
    return "process";
  }

  if (includesAny(t, ["industr", "sectors", "vertical"])) {
    return "industries";
  }

  if (includesAny(t, ["about", "who are you", "company", "experience"])) {
    return "about";
  }

  if (FAQ_ITEMS.some((f) => t.includes(normalize(f.question).slice(0, 24)))) {
    return "faq";
  }

  return "unknown";
}

function parseAppointmentType(text: string): AppointmentType | undefined {
  const t = normalize(text);
  if (includesAny(t, ["freight", "planning", "shipping plan", "consolidation"])) {
    return "freight-planning";
  }
  if (includesAny(t, ["customs", "advisory", "clearance meeting"])) {
    return "customs-advisory";
  }
  if (includesAny(t, ["project cargo", "project machinery", "second hand", "project import"])) {
    return "project-cargo";
  }
  if (includesAny(t, ["exim", "licence", "license", "drawback", "depb"])) {
    return "exim-advisory";
  }
  if (includesAny(t, ["packing", "household", "personal effects", "fumigation"])) {
    return "packing-consult";
  }
  if (includesAny(t, ["warehouse", "facility", "visit"])) return "warehouse-visit";
  if (includesAny(t, ["onboarding", "account", "new client"])) {
    return "account-onboarding";
  }

  for (const id of APPOINTMENT_TYPES) {
    if (t.includes(id.replace(/-/g, " ")) || t.includes(id)) return id;
  }
  return undefined;
}

function parseMeetingMode(text: string): MeetingMode | undefined {
  const t = normalize(text);
  if (includesAny(t, ["video", "zoom", "teams", "google meet", "online"])) return "video";
  if (includesAny(t, ["phone", "call", "telephone"])) return "phone";
  if (includesAny(t, ["in person", "in-person", "office", "visit", "face to face"])) {
    return "in-person";
  }
  for (const mode of MEETING_MODES) {
    if (t === mode) return mode;
  }
  return undefined;
}

function parseTime(text: string): PreferredTime | undefined {
  const t = normalize(text);
  const colonMatch = t.match(/\b([01]?\d|2[0-3]):([0-5]\d)\b/);
  if (colonMatch) {
    const candidate =
      `${colonMatch[1]!.padStart(2, "0")}:${colonMatch[2]}` as PreferredTime;
    if ((TIME_SLOTS as readonly string[]).includes(candidate)) return candidate;
  }

  const ampm = t.match(/\b([1-9]|1[0-2])\s*(?:o'?clock\s*)?(am|pm)\b/);
  if (ampm) {
    let hour = Number(ampm[1]);
    const meridiem = ampm[2];
    if (meridiem === "pm" && hour < 12) hour += 12;
    if (meridiem === "am" && hour === 12) hour = 0;
    const candidate = `${String(hour).padStart(2, "0")}:00` as PreferredTime;
    if ((TIME_SLOTS as readonly string[]).includes(candidate)) return candidate;
  }

  // Spoken "10" / "three" while asking for time is handled by merge with askingFor.
  const hourOnly = t.match(/\b([1-9]|1[0-7])\b/);
  if (hourOnly && /time|o'?clock|am|pm/.test(t)) {
    const hour = Number(hourOnly[1]);
    const candidate = `${String(hour).padStart(2, "0")}:00` as PreferredTime;
    if ((TIME_SLOTS as readonly string[]).includes(candidate)) return candidate;
  }

  return undefined;
}

const MONTHS: Record<string, number> = {
  january: 1,
  jan: 1,
  february: 2,
  feb: 2,
  march: 3,
  mar: 3,
  april: 4,
  apr: 4,
  may: 5,
  june: 6,
  jun: 6,
  july: 7,
  jul: 7,
  august: 8,
  aug: 8,
  september: 9,
  sep: 9,
  sept: 9,
  october: 10,
  oct: 10,
  november: 11,
  nov: 11,
  december: 12,
  dec: 12,
};

const WEEKDAYS: Record<string, number> = {
  sunday: 0,
  sun: 0,
  monday: 1,
  mon: 1,
  tuesday: 2,
  tue: 2,
  tues: 2,
  wednesday: 3,
  wed: 3,
  thursday: 4,
  thu: 4,
  thur: 4,
  thurs: 4,
  friday: 5,
  fri: 5,
  saturday: 6,
  sat: 6,
};

function todayStartLocal(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function toIsoDate(year: number, month: number, day: number): string | undefined {
  if (month < 1 || month > 12 || day < 1 || day > 31) return undefined;
  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return undefined;
  }
  const dayOfWeek = date.getDay();
  if (dayOfWeek === 0 || dayOfWeek === 6) return undefined;
  if (date < todayStartLocal()) return undefined;
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function nextWeekday(targetDow: number): string {
  const d = todayStartLocal();
  const current = d.getDay();
  let delta = (targetDow - current + 7) % 7;
  if (delta === 0) delta = 7; // "Monday" means next occurrence if today is Monday
  d.setDate(d.getDate() + delta);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function parseDate(text: string): string | undefined {
  const t = normalize(text)
    .replace(/(\d+)(st|nd|rd|th)\b/g, "$1")
    .replace(/,/g, " ");

  const iso = t.match(/\b(20\d{2})-(\d{2})-(\d{2})\b/);
  if (iso) {
    return toIsoDate(Number(iso[1]), Number(iso[2]), Number(iso[3]));
  }

  // DD/MM/YYYY or DD-MM-YYYY (common in India)
  const slash = t.match(/\b(\d{1,2})[/-](\d{1,2})[/-](20\d{2})\b/);
  if (slash) {
    return toIsoDate(Number(slash[3]), Number(slash[2]), Number(slash[1]));
  }

  if (/\btoday\b/.test(t)) {
    const d = todayStartLocal();
    return toIsoDate(d.getFullYear(), d.getMonth() + 1, d.getDate());
  }

  if (/\btomorrow\b/.test(t)) {
    const d = todayStartLocal();
    d.setDate(d.getDate() + 1);
    return toIsoDate(d.getFullYear(), d.getMonth() + 1, d.getDate());
  }

  const relativeWeekday = t.match(
    /\b(?:on\s+)?(?:next\s+)?(sunday|sun|monday|mon|tuesday|tue|tues|wednesday|wed|thursday|thu|thur|thurs|friday|fri|saturday|sat)\b/,
  );
  if (relativeWeekday?.[1] && !/\b(january|february|march|april|may|june|july|august|september|october|november|december)\b/.test(t)) {
    const dow = WEEKDAYS[relativeWeekday[1]];
    if (dow !== undefined && dow !== 0 && dow !== 6) {
      return nextWeekday(dow);
    }
  }

  // "August 12" / "August 12 2026" / "12 August" / "12 August 2026"
  const monthNames = Object.keys(MONTHS).join("|");
  const monthFirst = t.match(
    new RegExp(`\\b(${monthNames})\\s+(\\d{1,2})(?:\\s+(20\\d{2}))?\\b`),
  );
  if (monthFirst) {
    const month = MONTHS[monthFirst[1]!];
    const day = Number(monthFirst[2]);
    const year = monthFirst[3]
      ? Number(monthFirst[3])
      : inferYear(month!, day);
    return toIsoDate(year, month!, day);
  }

  const dayFirst = t.match(
    new RegExp(`\\b(\\d{1,2})\\s+(?:of\\s+)?(${monthNames})(?:\\s+(20\\d{2}))?\\b`),
  );
  if (dayFirst) {
    const day = Number(dayFirst[1]);
    const month = MONTHS[dayFirst[2]!];
    const year = dayFirst[3]
      ? Number(dayFirst[3])
      : inferYear(month!, day);
    return toIsoDate(year, month!, day);
  }

  // Partial speech like "12 2026" — use current/next month if day is valid
  const dayYear = t.match(/\b(\d{1,2})\s+(20\d{2})\b/);
  if (dayYear) {
    const day = Number(dayYear[1]);
    const year = Number(dayYear[2]);
    const now = todayStartLocal();
    let month = now.getFullYear() === year ? now.getMonth() + 1 : 1;
    let candidate = toIsoDate(year, month, day);
    if (!candidate) {
      // try following months in that year
      for (let m = month; m <= 12; m += 1) {
        candidate = toIsoDate(year, m, day);
        if (candidate) break;
      }
    }
    return candidate;
  }

  return undefined;
}

function inferYear(month: number, day: number): number {
  const now = todayStartLocal();
  const thisYear = now.getFullYear();
  const candidate = new Date(thisYear, month - 1, day);
  candidate.setHours(0, 0, 0, 0);
  if (candidate >= now) return thisYear;
  return thisYear + 1;
}

function parseSpokenHour(text: string): PreferredTime | undefined {
  const t = normalize(text);
  const words: Record<string, number> = {
    nine: 9,
    ten: 10,
    eleven: 11,
    twelve: 12,
    two: 14,
    three: 15,
    four: 16,
    five: 17,
  };

  for (const [word, hour] of Object.entries(words)) {
    if (new RegExp(`\\b${word}\\b`).test(t)) {
      const candidate = `${String(hour).padStart(2, "0")}:00` as PreferredTime;
      if ((TIME_SLOTS as readonly string[]).includes(candidate)) return candidate;
    }
  }

  const ampm = parseTime(text);
  if (ampm) return ampm;

  const bare = t.match(/^\s*([1-9]|1[0-7])\s*(?::00)?\s*$/);
  if (bare) {
    let hour = Number(bare[1]);
    // 1-5 without am/pm in business context usually afternoon slots
    if (hour >= 1 && hour <= 5) hour += 12;
    const candidate = `${String(hour).padStart(2, "0")}:00` as PreferredTime;
    if ((TIME_SLOTS as readonly string[]).includes(candidate)) return candidate;
  }

  return undefined;
}

function parseEmail(text: string): string | undefined {
  const match = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  return match?.[0];
}

function parsePhone(text: string): string | undefined {
  const match = text.match(/(?:\+?\d[\d\s-]{7,18}\d)/);
  if (!match) return undefined;
  const cleaned = match[0]!.replace(/[^\d+]/g, "");
  return cleaned.length >= 8 ? match[0]!.trim() : undefined;
}

function looksLikeName(text: string): boolean {
  const t = text.trim();
  if (t.length < 2 || t.length > 60) return false;
  if (/[@\d]/.test(t)) return false;
  if (includesAny(normalize(t), ["my name is", "i am", "i'm", "this is"])) return true;
  return /^[A-Za-z][A-Za-z .'-]+$/.test(t) && t.split(/\s+/).length <= 4;
}

function extractName(text: string): string | undefined {
  const named = text.match(
    /(?:my name is|i am|i'm|this is)\s+([A-Za-z][A-Za-z .'-]{1,50})/i,
  );
  if (named?.[1]) return named[1].trim().replace(/[.,!?]$/, "");
  if (looksLikeName(text)) return text.trim();
  return undefined;
}

function extractCompany(text: string): string | undefined {
  const named = text.match(
    /(?:company is|we are|we're|from|with)\s+([A-Za-z0-9][A-Za-z0-9 .&'-]{1,60})/i,
  );
  if (named?.[1]) return named[1].trim().replace(/[.,!?]$/, "");
  const t = text.trim();
  if (t.length >= 2 && t.length <= 80 && !parseEmail(t) && !parsePhone(t)) {
    return t;
  }
  return undefined;
}

function nextMissingField(draft: BookingDraft): BookingField | null {
  for (const field of BOOKING_FIELDS) {
    if (!draft[field]) return field;
  }
  return null;
}

function isCancelBooking(message: string): boolean {
  return includesAny(normalize(message), [
    "cancel booking",
    "cancel appointment",
    "stop booking",
    "never mind",
    "nevermind",
  ]);
}

export function mergeBookingDraft(
  draft: BookingDraft,
  message: string,
  askingFor: BookingField | null,
): BookingDraft {
  const next: BookingDraft = { ...draft };
  const t = normalize(message);

  const email = parseEmail(message);
  if (email) next.email = email;

  const phone = parsePhone(message);
  if (phone && (askingFor === "phone" || !next.phone)) next.phone = phone;

  const date = parseDate(message);
  if (date) next.preferredDate = date;

  const time = parseTime(message);
  if (time) next.preferredTime = time;

  // Bare hour while collecting time: "10", "3 pm" already handled; also "ten"
  if (askingFor === "preferredTime" && !next.preferredTime) {
    const spokenHour = parseSpokenHour(message);
    if (spokenHour) next.preferredTime = spokenHour;
  }

  const appointmentType = parseAppointmentType(message);
  if (appointmentType) next.appointmentType = appointmentType;

  const meetingMode = parseMeetingMode(message);
  if (meetingMode) next.meetingMode = meetingMode;

  if (askingFor === "name" || (!next.name && looksLikeName(message))) {
    const name = extractName(message);
    if (name) next.name = name;
  }

  if (askingFor === "company") {
    const company = extractCompany(message);
    if (company) next.company = company;
  }

  if (includesAny(t, ["note", "about cargo", "regarding"])) {
    next.notes = message.trim();
  }

  return next;
}

function isDraftComplete(draft: BookingDraft): draft is Required<
  Pick<
    BookingDraft,
    | "name"
    | "company"
    | "email"
    | "phone"
    | "appointmentType"
    | "preferredDate"
    | "preferredTime"
    | "meetingMode"
  >
> &
  BookingDraft {
  return BOOKING_FIELDS.every((field) => Boolean(draft[field]));
}

function answerServices(): string {
  const list = SERVICES.map((s) => s.title).join(", ");
  return `We offer ${list}. Which service would you like to know more about?`;
}

function answerProcess(): string {
  const steps = PROCESS_STEPS.map((s) => s.title).join(", then ");
  return `Our process is simple: ${steps}. I can also help you book a planning call.`;
}

function answerIndustries(): string {
  return `We support ${INDUSTRIES.map((i) => i.name).join(", ")}. What industry is your cargo in?`;
}

function answerContact(): string {
  return `You can reach us at ${siteConfig.contact.phone}, email ${siteConfig.contact.email}, or WhatsApp. We're at ${siteConfig.contact.address}.`;
}

function answerAbout(): string {
  return `${siteConfig.name} provides ${siteConfig.description} How can I help you today?`;
}

function answerQuote(): string {
  return `I can guide you to a quote. Share origin, destination, and cargo type on the contact form, or say "book an appointment" and I'll schedule a specialist. Our team typically responds within two business hours.`;
}

function answerTracking(): string {
  return `You can track any shipment on our Track page. Open Track Shipment, enter your tracking ID, and you'll see live status and ETA updates.`;
}

function answerFaq(message: string): string | null {
  const t = normalize(message);
  const hit = FAQ_ITEMS.find((f) => {
    const q = normalize(f.question);
    return (
      t.includes(q.slice(0, 20)) ||
      q.split(" ").filter((w) => w.length > 4).some((w) => t.includes(w))
    );
  });
  return hit?.answer ?? null;
}

function answerUnknown(): string {
  return `I can help with our services, shipping process, contact details, tracking, quotes, or booking an appointment. What would you like?`;
}

function greeting(): string {
  return `Hello! I'm Ava, the ExpressWay receptionist. I can explain our services, help you track a shipment, or book an appointment. How can I help?`;
}

function goodbye(): string {
  return `Thank you for contacting ${siteConfig.name}. Have a great day — we're here anytime you need us.`;
}

export type ReceptionistTurn = {
  reply: string;
  intent: Intent;
  bookingDraft: BookingDraft;
  action: VoiceAgentAction;
  readyToBook: boolean;
};

export function runReceptionistTurn(input: {
  message: string;
  bookingDraft?: BookingDraft;
}): ReceptionistTurn {
  const previous = input.bookingDraft ?? {};
  const drafting = Boolean(previous.inProgress);

  if (drafting && isCancelBooking(input.message)) {
    return {
      reply: "No problem — I've cancelled the booking. How else can I help?",
      intent: "appointment",
      bookingDraft: {},
      action: { type: "none" },
      readyToBook: false,
    };
  }

  const askingFor = drafting ? nextMissingField(previous) : null;

  let bookingDraft = mergeBookingDraft(previous, input.message, askingFor);
  if (drafting) bookingDraft = { ...bookingDraft, inProgress: true };

  const intent = detectIntent(input.message, drafting);

  let action: VoiceAgentAction = { type: "none" };
  let reply: string;
  let readyToBook = false;

  switch (intent) {
    case "greeting":
      reply = greeting();
      break;
    case "goodbye":
      reply = goodbye();
      bookingDraft = {};
      break;
    case "services":
      reply = answerServices();
      action = { type: "navigate", href: "/#services", label: "View services" };
      break;
    case "process":
      reply = answerProcess();
      action = { type: "navigate", href: "/#process", label: "View process" };
      break;
    case "industries":
      reply = answerIndustries();
      action = { type: "navigate", href: "/#industries", label: "View industries" };
      break;
    case "contact":
      reply = answerContact();
      action = { type: "navigate", href: "/quote", label: "Contact form" };
      break;
    case "about":
      reply = answerAbout();
      action = { type: "navigate", href: "/about", label: "About us" };
      break;
    case "quote":
      reply = answerQuote();
      action = { type: "navigate", href: "/quote", label: "Get a quote" };
      break;
    case "tracking":
      reply = answerTracking();
      action = { type: "navigate", href: "/track", label: "Track shipment" };
      break;
    case "faq": {
      reply = answerFaq(input.message) ?? answerUnknown();
      break;
    }
    case "appointment": {
      bookingDraft = { ...bookingDraft, inProgress: true };
      const missing = nextMissingField(bookingDraft);
      if (!missing && isDraftComplete(bookingDraft)) {
        const meeting = MEETING_TYPES.find(
          (m) => m.id === bookingDraft.appointmentType,
        );
        reply = `Perfect. I'll book your ${meeting?.title ?? "appointment"} on ${bookingDraft.preferredDate} at ${bookingDraft.preferredTime} via ${bookingDraft.meetingMode}. One moment.`;
        readyToBook = true;
      } else if (missing) {
        const firstAsk = !drafting;
        if (
          !firstAsk &&
          askingFor === "preferredDate" &&
          missing === "preferredDate"
        ) {
          reply =
            "I need a weekday date. Try saying August twelfth, next Tuesday, or tomorrow.";
        } else if (
          !firstAsk &&
          askingFor === "preferredTime" &&
          missing === "preferredTime"
        ) {
          reply =
            "Please choose a slot like ten AM, eleven AM, two PM, or three PM.";
        } else {
          reply = firstAsk
            ? `I'd be happy to book that. ${FIELD_PROMPTS[missing]}`
            : FIELD_PROMPTS[missing];
        }
      } else {
        reply = `I'd be happy to book that. ${FIELD_PROMPTS.name}`;
      }
      break;
    }
    default: {
      const faq = answerFaq(input.message);
      reply = faq ?? answerUnknown();
      break;
    }
  }

  return { reply, intent, bookingDraft, action, readyToBook };
}
