import {
  APPOINTMENT_TYPES,
  MEETING_MODES,
  TIME_SLOTS,
  startOfTodayIst,
  type AppointmentType,
  type MeetingMode,
  type PreferredTime,
} from "@/features/appointment/schemas";

const KEY_ALIASES: Record<string, string> = {
  appointment_type: "appointmentType",
  preferred_date: "preferredDate",
  preferred_time: "preferredTime",
  meeting_mode: "meetingMode",
  tracking_id: "trackingId",
  service_type: "serviceType",
  approx_weight: "approxWeight",
};

const TYPE_ALIASES: Record<string, AppointmentType> = {
  "freight-planning": "freight-planning",
  freight: "freight-planning",
  planning: "freight-planning",
  shipping: "freight-planning",
  "customs-advisory": "customs-advisory",
  customs: "customs-advisory",
  clearance: "customs-advisory",
  "project-cargo": "project-cargo",
  project: "project-cargo",
  "exim-advisory": "exim-advisory",
  exim: "exim-advisory",
  licence: "exim-advisory",
  license: "exim-advisory",
  "packing-consult": "packing-consult",
  packing: "packing-consult",
  "warehouse-visit": "warehouse-visit",
  warehouse: "warehouse-visit",
  visit: "warehouse-visit",
  "account-onboarding": "account-onboarding",
  onboarding: "account-onboarding",
  account: "account-onboarding",
};

function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function camelizeArgs(args: Record<string, unknown>): Record<string, unknown> {
  const next: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(args)) {
    next[KEY_ALIASES[key] ?? key] = value;
  }
  return next;
}

function toIsoDate(year: number, month: number, day: number): string | undefined {
  const date = new Date(Date.UTC(year, month - 1, day));
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return undefined;
  }
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function coerceAppointmentType(value: unknown): AppointmentType | undefined {
  const raw = asString(value).toLowerCase().replace(/_/g, "-");
  if (!raw) return undefined;
  if ((APPOINTMENT_TYPES as readonly string[]).includes(raw)) {
    return raw as AppointmentType;
  }
  const slug = raw.replace(/\s+/g, "-");
  if ((APPOINTMENT_TYPES as readonly string[]).includes(slug)) {
    return slug as AppointmentType;
  }
  for (const [alias, id] of Object.entries(TYPE_ALIASES)) {
    if (raw.includes(alias.replace(/-/g, " ")) || raw.includes(alias)) {
      return id;
    }
  }
  return undefined;
}

function coerceTime(value: unknown): PreferredTime | undefined {
  const raw = asString(value).toLowerCase();
  if (!raw) return undefined;
  if ((TIME_SLOTS as readonly string[]).includes(raw)) {
    return raw as PreferredTime;
  }

  const colon = raw.match(/\b([01]?\d|2[0-3])[:.]([0-5]\d)\b/);
  if (colon) {
    let hour = Number(colon[1]);
    const minute = colon[2];
    if (/\bpm\b/.test(raw) && hour < 12) hour += 12;
    if (/\bam\b/.test(raw) && hour === 12) hour = 0;
    const candidate = `${String(hour).padStart(2, "0")}:${minute}`;
    if ((TIME_SLOTS as readonly string[]).includes(candidate)) {
      return candidate as PreferredTime;
    }
  }

  const ampm = raw.match(/\b([1-9]|1[0-2])\s*(am|pm)\b/);
  if (ampm) {
    let hour = Number(ampm[1]);
    if (ampm[2] === "pm" && hour < 12) hour += 12;
    if (ampm[2] === "am" && hour === 12) hour = 0;
    const candidate = `${String(hour).padStart(2, "0")}:00`;
    if ((TIME_SLOTS as readonly string[]).includes(candidate)) {
      return candidate as PreferredTime;
    }
  }

  return undefined;
}

function coerceDate(value: unknown): string | undefined {
  const raw = asString(value)
    .toLowerCase()
    .replace(/(\d+)(st|nd|rd|th)\b/g, "$1")
    .replace(/,/g, " ");
  if (!raw) return undefined;

  const iso = raw.match(/\b(20\d{2})-(\d{2})-(\d{2})\b/);
  if (iso) return toIsoDate(Number(iso[1]), Number(iso[2]), Number(iso[3]));

  const slash = raw.match(/\b(\d{1,2})[/-](\d{1,2})[/-](20\d{2})\b/);
  if (slash) {
    return toIsoDate(Number(slash[3]), Number(slash[2]), Number(slash[1]));
  }

  const months: Record<string, number> = {
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
  const monthNames = Object.keys(months).join("|");
  const monthFirst = raw.match(
    new RegExp(`\\b(${monthNames})\\s+(\\d{1,2})(?:\\s+(20\\d{2}))?\\b`),
  );
  if (monthFirst) {
    const month = months[monthFirst[1]!];
    const day = Number(monthFirst[2]);
    const today = startOfTodayIst();
    const year = monthFirst[3]
      ? Number(monthFirst[3])
      : today.getUTCMonth() + 1 > month! ||
          (today.getUTCMonth() + 1 === month && today.getUTCDate() > day)
        ? today.getUTCFullYear() + 1
        : today.getUTCFullYear();
    return toIsoDate(year, month!, day);
  }

  return undefined;
}

function coerceMeetingMode(value: unknown): MeetingMode | undefined {
  const raw = asString(value).toLowerCase();
  if (!raw) return undefined;
  if ((MEETING_MODES as readonly string[]).includes(raw)) {
    return raw as MeetingMode;
  }
  if (raw.includes("video") || raw.includes("zoom") || raw.includes("online")) {
    return "video";
  }
  if (raw.includes("phone") || raw.includes("call")) return "phone";
  if (raw.includes("person") || raw.includes("office") || raw.includes("visit")) {
    return "in-person";
  }
  return undefined;
}

function coercePhone(value: unknown): string | undefined {
  const raw = asString(value).replace(/[()]/g, " ").replace(/\s+/g, " ").trim();
  if (!raw) return undefined;
  return raw;
}

export function normalizeVoiceBookingArgs(
  args: Record<string, unknown>,
): Record<string, unknown> {
  const next = camelizeArgs(args);
  const appointmentType = coerceAppointmentType(next.appointmentType);
  if (appointmentType) next.appointmentType = appointmentType;
  const preferredDate = coerceDate(next.preferredDate);
  if (preferredDate) next.preferredDate = preferredDate;
  const preferredTime = coerceTime(next.preferredTime);
  if (preferredTime) next.preferredTime = preferredTime;
  const meetingMode = coerceMeetingMode(next.meetingMode);
  if (meetingMode) next.meetingMode = meetingMode;
  const phone = coercePhone(next.phone);
  if (phone) next.phone = phone;
  if (typeof next.email === "string") {
    next.email = next.email.trim().toLowerCase();
  }
  return next;
}
