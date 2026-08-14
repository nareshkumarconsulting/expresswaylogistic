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
import {
  VOICE_QUOTE_SERVICES,
  type BookingDraft,
  type QuoteDraft,
  type TrackingDraft,
  type VoiceAgentAction,
  type VoiceAgentResponse,
} from "@/features/voice-agent/schemas";

type Intent = VoiceAgentResponse["data"]["intent"];
type TaskMode = "none" | "appointment" | "quote" | "tracking";

type QuoteField = (typeof QUOTE_FIELDS)[number];

const QUOTE_FIELDS = [
  "name",
  "company",
  "email",
  "phone",
  "origin",
  "destination",
  "serviceType",
  "cargo",
] as const satisfies readonly (keyof QuoteDraft)[];

const FIELD_PROMPTS_HI: Record<BookingField, string> = {
  name: "Aapka poora naam kya hai?",
  company: "Aap kis company se hain?",
  email:
    "Confirmation ke liye email bataiye. Aap bol sakte hain, jaise naam at gmail.com.",
  phone: "Phone number bataiye?",
  appointmentType:
    "Kaunsi meeting chahiye — freight planning, customs, warehouse visit, ya account onboarding?",
  preferredDate:
    "Kaunsa weekday theek rahega? Jaise Tuesday, ya August barah.",
  preferredTime: "Kaunsa time theek hai? Jaise das baje ya teen baje.",
  meetingMode: "Video, phone, ya office mein milna — kya prefer karenge?",
};

const QUOTE_PROMPTS_HI: Record<QuoteField, string> = {
  name: "Aapka poora naam kya hai?",
  company: "Yeh quote kis company ke liye hai?",
  email: "Quote kis email par bhejun?",
  phone: "Phone number bataiye?",
  origin: "Cargo kahan se jaayega?",
  destination: "Aur kahan bhejna hai?",
  serviceType:
    "Kaunsi service chahiye — air freight, ocean FCL, ocean LCL, customs, warehousing, ya door to door?",
  cargo: "Cargo kya hai, aur roughly kitna weight hai?",
};

const SERVICE_LABELS: Record<(typeof VOICE_QUOTE_SERVICES)[number], string> = {
  air: "air freight",
  "ocean-fcl": "ocean FCL",
  "ocean-lcl": "ocean LCL",
  consolidation: "consolidation",
  customs: "customs clearance",
  warehousing: "warehousing",
  "door-to-door": "door to door",
  "project-cargo": "project cargo",
  "cargo-insurance": "cargo insurance",
  "exim-advisory": "EXIM advisory",
  packing: "packing",
};

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

const QUOTE_PROMPTS: Record<QuoteField, string> = {
  name: "May I have your full name?",
  company: "Which company is this quote for?",
  email: "What's the best email for the quote?",
  phone: "And a phone number we can reach you on?",
  origin: "Where is the cargo shipping from?",
  destination: "And where is it going?",
  serviceType:
    "Which service do you need — air freight, ocean FCL, ocean LCL, customs, warehousing, or door to door?",
  cargo: "Briefly, what is the cargo, and roughly how much does it weigh?",
};

function normalize(text: string): string {
  return text.toLowerCase().trim().replace(/\s+/g, " ");
}

function includesAny(text: string, phrases: string[]): boolean {
  return phrases.some((p) => text.includes(p));
}

function isHinglish(text: string): boolean {
  return includesAny(normalize(text), [
    "kya",
    "aap",
    "hai",
    "hain",
    "chahie",
    "chahiye",
    "mein",
    "nahin",
    "nahi",
    "mera",
    "meri",
    "naam",
    "sakte",
    "sakti",
    "poora",
    "pura",
    "ke liye",
    "bataiye",
    "ji",
  ]);
}

function useHindi(message: string, locale?: "en" | "hi"): boolean {
  return isHinglish(message) || locale === "hi";
}

function nextLocale(
  message: string,
  previous?: "en" | "hi",
): "en" | "hi" | undefined {
  if (isHinglish(message)) return "hi";
  return previous;
}

function bookingPrompt(
  field: BookingField,
  hindi: boolean,
  firstAsk: boolean,
): string {
  const prompt = hindi ? FIELD_PROMPTS_HI[field] : FIELD_PROMPTS[field];
  if (!firstAsk) return prompt;
  return hindi
    ? `Haan, appointment book kar sakti hoon. ${prompt}`
    : `I'd be happy to book that. ${prompt}`;
}

function quotePrompt(field: QuoteField, hindi: boolean, firstAsk: boolean): string {
  const prompt = hindi ? QUOTE_PROMPTS_HI[field] : QUOTE_PROMPTS[field];
  if (!firstAsk) return prompt;
  return hindi
    ? `Haan, quote request le sakti hoon. ${prompt}`
    : `I can take a quote request now. ${prompt}`;
}

function wantsQuoteTask(text: string): boolean {
  const t = normalize(text);
  if (/\bat the rate\b/.test(t) || /\bgmail\.com\b/.test(t) || /\byahoo\.com\b/.test(t)) {
    return false;
  }
  if (/\bappointment\b/.test(t) && !/\bquote\b/.test(t)) return false;
  const quoteWord = String.raw`(?:quote|quotation|code|coat|quota|court)`;
  return (
    new RegExp(String.raw`\b(need|want|get|give me|ask for)\s+(a\s+|an\s+)?${quoteWord}\b`).test(t) ||
    new RegExp(String.raw`\b${quoteWord}\s+(request|please|chahie|chahiye)\b`).test(t) ||
    /\b(quote|quotation)\s+chah(?:ie|iye)\b/.test(t) ||
    /\b(pricing|price list|estimate)\b/.test(t) ||
    t.includes("quote request") ||
    (/\bquote\b/.test(t) && !/\b(book|appointment|email|gmail)\b/.test(t))
  );
}

function wantsTrackTask(text: string): boolean {
  const t = normalize(text);
  return (
    includesAny(t, [
      "track",
      "tracking",
      "shipment status",
      "where is my",
      "awb",
      "track karo",
      "track karein",
    ]) || Boolean(parseTrackingId(text))
  );
}

function wantsAppointmentTask(text: string): boolean {
  const t = normalize(text);
  return includesAny(t, [
    "appointment",
    "book a meeting",
    "book an appointment",
    "schedule",
    "speak to someone",
    "consultation",
    "appointment book",
    "meeting book",
  ]);
}

export function detectIntent(message: string, mode: TaskMode = "none"): Intent {
  const t = normalize(message);

  const sayingGoodbye = includesAny(t, [
    "bye",
    "goodbye",
    "that's all",
    "thats all",
    "no more",
  ]);
  const thanksOnly =
    mode === "none" &&
    includesAny(t, ["thank you", "thanks"]) &&
    !wantsAppointmentTask(message) &&
    !wantsQuoteTask(message);

  if (sayingGoodbye || thanksOnly) {
    return "goodbye";
  }

  const wantsTrack = wantsTrackTask(message);
  const wantsQuote = wantsQuoteTask(message);
  const wantsAppointment = wantsAppointmentTask(message);

  if (mode === "appointment") {
    if (wantsTrack) return "tracking";
    if (wantsQuote) return "quote";
    return "appointment";
  }
  if (mode === "quote") {
    if (wantsTrack) return "tracking";
    if (wantsAppointment) return "appointment";
    return "quote";
  }
  if (mode === "tracking") {
    if (wantsQuote) return "quote";
    if (wantsAppointment) return "appointment";
    return "tracking";
  }

  if (
    includesAny(t, ["hindi", "hinglish"]) ||
    includesAny(t, ["hello", "hi ", "hi,", "hey", "good morning", "good afternoon", "good evening", "namaste"]) ||
    t === "hi"
  ) {
    return "greeting";
  }

  if (wantsTrack || parseTrackingId(message)) {
    return "tracking";
  }

  if (wantsQuote) {
    return "quote";
  }

  if (wantsAppointment || includesAny(t, ["book", "meeting"])) {
    return "appointment";
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
  const direct = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  if (direct) return direct[0]!.toLowerCase();

  let t = normalize(text)
    .replace(/\[at\]/g, "@")
    .replace(/\bat the rate(?: of)?\b/g, "@")
    .replace(/\bat rate\b/g, "@")
    .replace(/\bdot\b/g, ".")
    .replace(/\bit'?s\s+/g, " ")
    .replace(/\b(?:my|the|meri|mera)\s+email(?:\s+address)?(?:\s+is)?\s+/g, " ")
    .replace(/\bemail\s+/g, " ");

  const spoken = t.match(
    /([a-z0-9][a-z0-9._%+\-\s]{1,64})\s*(?:@|at)\s*([a-z0-9.-]+\.[a-z]{2,})/i,
  );
  if (!spoken) return undefined;

  const local = spoken[1]!.replace(/\s+/g, "").replace(/[^a-z0-9._%+-]/g, "");
  const domain = spoken[2]!.replace(/\s+/g, "");
  if (local.length < 2) return undefined;
  return `${local}@${domain}`.toLowerCase();
}

function parsePhone(text: string): string | undefined {
  const match = text.match(/(?:\+?\d[\d\s-]{7,18}\d)/);
  if (!match) return undefined;
  const cleaned = match[0]!.replace(/[^\d+]/g, "");
  return cleaned.length >= 8 ? match[0]!.trim() : undefined;
}

function looksLikeName(text: string): boolean {
  const t = text.trim();
  if (t.length < 2 || t.length > 80) return false;
  if (/[@\d]/.test(t)) return false;
  if (
    includesAny(normalize(t), [
      "quote",
      "appointment",
      "track",
      "booking",
      "schedule",
      "meeting",
      "service",
      "hello",
      "email",
      "gmail",
    ])
  ) {
    return false;
  }
  if (
    includesAny(normalize(t), [
      "my name is",
      "i am",
      "i'm",
      "this is",
      "naam hai",
      "naam he",
    ])
  ) {
    return true;
  }
  const words = t.replace(/\b(hai|hain|ji)\s*$/i, "").trim().split(/\s+/);
  return /^[A-Za-z][A-Za-z .'-]+$/.test(t.replace(/\b(hai|hain|ji)\s*$/i, "").trim()) &&
    words.length <= 5;
}

function extractName(text: string): string | undefined {
  const named = text.match(
    /(?:my name is|i am|i'm|this is|pura naam hai|poora naam hai|mera naam hai|meri naam hai|naam hai|name is)\s+([A-Za-z][A-Za-z .'-]{1,50})/i,
  );
  if (named?.[1]) {
    return named[1]
      .trim()
      .replace(/\b(hai|hain|ji|consulting|pvt|ltd)\s*$/i, "")
      .trim()
      .replace(/[.,!?]$/, "");
  }
  const cleaned = text.trim().replace(/\b(hai|hain|ji)\s*$/i, "").trim();
  if (looksLikeName(cleaned)) return cleaned;
  return undefined;
}

function extractCompany(text: string): string | undefined {
  const named = text.match(
    /(?:company(?:\s+ka)?\s+naam(?:\s+hai)?|company is|we are|we're|from|with)\s+([A-Za-z0-9][A-Za-z0-9 .&'-]{1,60})/i,
  );
  if (named?.[1]) {
    return named[1]
      .trim()
      .replace(/\b(hai|hain)\s*$/i, "")
      .replace(/[.,!?]$/, "")
      .trim();
  }
  const t = text.trim().replace(/\b(hai|hain)\s*$/i, "").trim();
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

function isCancelTask(message: string): boolean {
  return includesAny(normalize(message), [
    "cancel booking",
    "cancel appointment",
    "cancel quote",
    "stop booking",
    "stop quote",
    "never mind",
    "nevermind",
  ]);
}

export function parseTrackingId(text: string): string | undefined {
  const compact = text.replace(/[\s.]/g, "");
  const ew = compact.match(/EW-?(\d{4,8})/i);
  if (ew) return `EW-${ew[1]}`;

  const labeled = text.match(
    /\b(?:tracking(?:\s+id)?|awb|container(?:\s+no(?:\.|umber)?)?|id)\s*[:#-]?\s*([A-Za-z0-9-]{4,32})\b/i,
  );
  if (labeled?.[1] && !/^(id|awb|the|my)$/i.test(labeled[1])) {
    return labeled[1].toUpperCase();
  }

  const token = text.match(/\b([A-Z]{2,5}-?\d{4,12})\b/i);
  if (token?.[1] && token[1].length >= 6) return token[1].toUpperCase();
  return undefined;
}

function parseServiceType(
  text: string,
): (typeof VOICE_QUOTE_SERVICES)[number] | undefined {
  const t = normalize(text);
  if (includesAny(t, ["door to door", "door-to-door", "dtd"])) return "door-to-door";
  if (includesAny(t, ["fcl", "full container", "full box"])) return "ocean-fcl";
  if (includesAny(t, ["lcl", "less than container", "shared container"])) {
    return "ocean-lcl";
  }
  if (includesAny(t, ["air freight", "air cargo", "by air"])) return "air";
  if (/\bair\b/.test(t)) return "air";
  if (includesAny(t, ["ocean", "sea freight", "sea cargo"])) return "ocean-lcl";
  if (includesAny(t, ["consolidat"])) return "consolidation";
  if (includesAny(t, ["customs", "clearance"])) return "customs";
  if (includesAny(t, ["warehouse", "storage", "bonded"])) return "warehousing";
  if (includesAny(t, ["project cargo", "machinery"])) return "project-cargo";
  if (includesAny(t, ["insurance"])) return "cargo-insurance";
  if (includesAny(t, ["exim", "licence", "license"])) return "exim-advisory";
  if (includesAny(t, ["packing", "packaging"])) return "packing";
  return undefined;
}

function parseLane(text: string): { origin?: string; destination?: string } {
  const match = text.match(
    /\b(?:from|origin)\s+(.+?)\s+(?:to|destination)\s+(.+)/i,
  );
  if (!match) return {};
  const origin = match[1]?.trim().replace(/[.,!?]$/, "");
  const destination = match[2]?.trim().replace(/[.,!?]$/, "");
  if (!origin || origin.length < 2 || !destination || destination.length < 2) {
    return {};
  }
  return { origin, destination };
}

function parsePlace(text: string): string | undefined {
  const named = text.match(
    /\b(?:from|to|origin is|destination is)\s+([A-Za-z][A-Za-z .'-]{1,60})/i,
  );
  if (named?.[1]) return named[1].trim().replace(/[.,!?]$/, "");
  const t = text.trim();
  if (t.length >= 2 && t.length <= 80 && !parseEmail(t) && !parsePhone(t)) {
    return t.replace(/[.,!?]$/, "");
  }
  return undefined;
}

function parseWeight(text: string): string | undefined {
  const match = text.match(
    /\b(\d+(?:\.\d+)?)\s*(kg|kgs|kilo|kilos|kilograms|ton|tons|tonne|tonnes|lb|lbs)\b/i,
  );
  if (!match) return undefined;
  return `${match[1]} ${match[2]!.toLowerCase()}`;
}

function nextQuoteField(draft: QuoteDraft): QuoteField | null {
  for (const field of QUOTE_FIELDS) {
    if (!draft[field]) return field;
  }
  return null;
}

function isQuoteComplete(
  draft: QuoteDraft,
): draft is Required<
  Pick<
    QuoteDraft,
    | "name"
    | "company"
    | "email"
    | "phone"
    | "origin"
    | "destination"
    | "serviceType"
    | "cargo"
  >
> &
  QuoteDraft {
  return QUOTE_FIELDS.every((field) => Boolean(draft[field]));
}

export function mergeQuoteDraft(
  draft: QuoteDraft,
  message: string,
  askingFor: QuoteField | null,
): QuoteDraft {
  const next: QuoteDraft = { ...draft };

  const email = parseEmail(message);
  if (email) next.email = email;

  const phone = parsePhone(message);
  if (phone && (askingFor === "phone" || !next.phone)) next.phone = phone;

  const lane = parseLane(message);
  if (lane.origin) next.origin = lane.origin;
  if (lane.destination) next.destination = lane.destination;

  const serviceType = parseServiceType(message);
  if (serviceType) next.serviceType = serviceType;

  const weight = parseWeight(message);
  if (weight) next.approxWeight = weight;

  if (askingFor === "name" || (!next.name && !askingFor && looksLikeName(message))) {
    const name = extractName(message);
    if (name) next.name = name;
  }

  if (askingFor === "company") {
    const company = extractCompany(message);
    if (company) next.company = company;
  }

  if (askingFor === "origin" && !next.origin) {
    const origin = parsePlace(message);
    if (origin) next.origin = origin;
  }

  if (askingFor === "destination" && !next.destination) {
    const destination = parsePlace(message);
    if (destination) next.destination = destination;
  }

  if (askingFor === "cargo") {
    const cargo = message.trim();
    if (cargo.length >= 4) next.cargo = cargo;
  } else if (!next.cargo && parseWeight(message) && message.trim().length >= 10) {
    next.cargo = message.trim();
  }

  const locale = nextLocale(message, draft.locale);
  if (locale) next.locale = locale;

  return next;
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

  if (askingFor === "name" || (!next.name && !askingFor && looksLikeName(message))) {
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

  const locale = nextLocale(message, draft.locale);
  if (locale) next.locale = locale;

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

function answerQuoteStart(hindi: boolean): string {
  return hindi
    ? `Haan, quote request le sakti hoon. ${QUOTE_PROMPTS_HI.name}`
    : `I can take a quote request now. ${QUOTE_PROMPTS.name}`;
}

function answerTrackingAsk(hindi: boolean): string {
  return hindi
    ? `Main dhoondh sakti hoon. Tracking ID boliye, jaise E W 10846.`
    : `I can look that up. Please say your tracking ID, for example E W 10846.`;
}

function answerUnknown(hindi: boolean): string {
  return hindi
    ? `Main services, tracking, quote, ya appointment mein madad kar sakti hoon. Aap kya chahte hain?`
    : `I can help with our services, shipping process, contact details, tracking, quotes, or booking an appointment. What would you like?`;
}

function greeting(hindi: boolean): string {
  return hindi
    ? `Namaste, main Ava hoon, ExpressWay receptionist. Main quote le sakti hoon, shipment track kar sakti hoon, ya appointment book kar sakti hoon. Bataiye, aap kya chahte hain?`
    : `Hello! I'm Ava, the ExpressWay receptionist. I can explain our services, take a quote, track a shipment, or book an appointment. How can I help?`;
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

function goodbye(): string {
  return `Thank you for contacting ${siteConfig.name}. Have a great day — we're here anytime you need us.`;
}

export type ReceptionistTurn = {
  reply: string;
  intent: Intent;
  bookingDraft: BookingDraft;
  quoteDraft: QuoteDraft;
  trackingDraft: TrackingDraft;
  action: VoiceAgentAction;
  readyToBook: boolean;
  readyToQuote: boolean;
  lookupTrackingId?: string;
};

export function runReceptionistTurn(input: {
  message: string;
  bookingDraft?: BookingDraft;
  quoteDraft?: QuoteDraft;
  trackingDraft?: TrackingDraft;
}): ReceptionistTurn {
  let bookingDraft = input.bookingDraft ?? {};
  let quoteDraft = input.quoteDraft ?? {};
  let trackingDraft = input.trackingDraft ?? {};

  const mode: TaskMode = bookingDraft.inProgress
    ? "appointment"
    : quoteDraft.inProgress
      ? "quote"
      : trackingDraft.inProgress
        ? "tracking"
        : "none";

  if (mode !== "none" && isCancelTask(input.message)) {
    return {
      reply: "No problem — I've cancelled that. How else can I help?",
      intent: mode,
      bookingDraft: {},
      quoteDraft: {},
      trackingDraft: {},
      action: { type: "none" },
      readyToBook: false,
      readyToQuote: false,
    };
  }

  const intent = detectIntent(input.message, mode);

  if (intent !== "appointment") bookingDraft = {};
  if (intent !== "quote") quoteDraft = {};
  if (intent !== "tracking") trackingDraft = {};

  const askingForBooking =
    mode === "appointment" && intent === "appointment"
      ? nextMissingField(input.bookingDraft ?? {})
      : null;
  const askingForQuote =
    mode === "quote" && intent === "quote"
      ? nextQuoteField(input.quoteDraft ?? {})
      : null;

  if (intent === "appointment") {
    bookingDraft = mergeBookingDraft(
      input.bookingDraft ?? {},
      input.message,
      askingForBooking,
    );
  }
  if (intent === "quote") {
    quoteDraft = mergeQuoteDraft(
      input.quoteDraft ?? {},
      input.message,
      askingForQuote,
    );
  }
  if (intent === "tracking") {
    trackingDraft = {
      ...(input.trackingDraft ?? {}),
      trackingId:
        parseTrackingId(input.message) ?? input.trackingDraft?.trackingId,
    };
  }

  let action: VoiceAgentAction = { type: "none" };
  let reply: string;
  let readyToBook = false;
  let readyToQuote = false;
  let lookupTrackingId: string | undefined;
  const hindi = useHindi(
    input.message,
    bookingDraft.locale ?? quoteDraft.locale,
  );

  switch (intent) {
    case "greeting":
      reply = greeting(hindi);
      break;
    case "goodbye":
      reply = goodbye();
      bookingDraft = {};
      quoteDraft = {};
      trackingDraft = {};
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
    case "quote": {
      quoteDraft = { ...quoteDraft, inProgress: true };
      const missing = nextQuoteField(quoteDraft);
      const hi = useHindi(input.message, quoteDraft.locale);
      if (!missing && isQuoteComplete(quoteDraft)) {
        const service = SERVICE_LABELS[quoteDraft.serviceType];
        reply = hi
          ? `Theek hai. Main ${service} ka quote ${quoteDraft.origin} se ${quoteDraft.destination} ke liye bhej rahi hoon.`
          : `Perfect. I'll submit a ${service} quote from ${quoteDraft.origin} to ${quoteDraft.destination}. One moment.`;
        readyToQuote = true;
      } else if (missing) {
        reply = quotePrompt(missing, hi, mode !== "quote");
      } else {
        reply = answerQuoteStart(hi);
      }
      break;
    }
    case "tracking": {
      trackingDraft = { ...trackingDraft, inProgress: true };
      const hi = useHindi(input.message, bookingDraft.locale ?? quoteDraft.locale);
      if (trackingDraft.trackingId) {
        lookupTrackingId = trackingDraft.trackingId;
        reply = hi
          ? `Main ${trackingDraft.trackingId} abhi check karti hoon.`
          : `I'll look up ${trackingDraft.trackingId} now.`;
      } else {
        reply = answerTrackingAsk(hi);
        action = { type: "navigate", href: "/track", label: "Track shipment" };
      }
      break;
    }
    case "faq": {
      reply = answerFaq(input.message) ?? answerUnknown(hindi);
      break;
    }
    case "appointment": {
      bookingDraft = { ...bookingDraft, inProgress: true };
      const missing = nextMissingField(bookingDraft);
      const hi = useHindi(input.message, bookingDraft.locale);
      if (!missing && isDraftComplete(bookingDraft)) {
        const meeting = MEETING_TYPES.find(
          (m) => m.id === bookingDraft.appointmentType,
        );
        reply = hi
          ? `Theek hai. Main aapki ${meeting?.title ?? "appointment"} ${bookingDraft.preferredDate} ko ${bookingDraft.preferredTime} par ${bookingDraft.meetingMode} se book karti hoon.`
          : `Perfect. I'll book your ${meeting?.title ?? "appointment"} on ${bookingDraft.preferredDate} at ${bookingDraft.preferredTime} via ${bookingDraft.meetingMode}. One moment.`;
        readyToBook = true;
      } else if (missing) {
        const firstAsk = mode !== "appointment";
        if (
          !firstAsk &&
          askingForBooking === "preferredDate" &&
          missing === "preferredDate"
        ) {
          reply = hi
            ? "Weekday date boliye. Jaise Tuesday, kal, ya August barah."
            : "I need a weekday date. Try saying August twelfth, next Tuesday, or tomorrow.";
        } else if (
          !firstAsk &&
          askingForBooking === "preferredTime" &&
          missing === "preferredTime"
        ) {
          reply = hi
            ? "Time slot boliye. Jaise das baje ya teen baje."
            : "Please choose a slot like ten AM, eleven AM, two PM, or three PM.";
        } else {
          reply = bookingPrompt(missing, hi, firstAsk);
        }
      } else {
        reply = bookingPrompt("name", hi, true);
      }
      break;
    }
    default: {
      const faq = answerFaq(input.message);
      reply = faq ?? answerUnknown(hindi);
      break;
    }
  }

  return {
    reply,
    intent,
    bookingDraft,
    quoteDraft,
    trackingDraft,
    action,
    readyToBook,
    readyToQuote,
    lookupTrackingId,
  };
}
