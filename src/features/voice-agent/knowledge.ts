import { siteConfig } from "@/config/site";
import {
  ABOUT_HIGHLIGHTS,
  FAQ_ITEMS,
  INDUSTRIES,
  PROCESS_STEPS,
  STATS,
} from "@/constants/content";
import { QUOTE_RESPONSE_STATEMENT } from "@/constants/entity";
import { SERVICES } from "@/constants/services";
import {
  MEETING_TYPES,
  TIME_SLOTS,
} from "@/features/appointment/schemas";

/** Plain-text knowledge pack the receptionist uses to answer site questions. */
export function buildSiteKnowledge(): string {
  const services = SERVICES.map(
    (s) => `- ${s.title}: ${s.description}`,
  ).join("\n");

  const process = PROCESS_STEPS.map(
    (s, i) => `${i + 1}. ${s.title} — ${s.description}`,
  ).join("\n");

  const industries = INDUSTRIES.map((i) => i.name).join(", ");

  const faqs = FAQ_ITEMS.map(
    (f) => `Q: ${f.question}\nA: ${f.answer}`,
  ).join("\n\n");

  const meetings = MEETING_TYPES.map(
    (m) =>
      `- ${m.title} (${m.id}): ${m.duration}, ${m.formatHint}. ${m.description}`,
  ).join("\n");

  const stats = STATS.map(
    (s) => `${s.value}${s.suffix ?? ""} ${s.label}`,
  ).join("; ");

  return [
    `Company: ${siteConfig.name}`,
    `Legal name: ${siteConfig.legalName}`,
    `Tagline: ${siteConfig.tagline}`,
    `About: ${siteConfig.description}`,
    `Positioning: Neutral NVOCC with 39+ years of international cargo experience`,
    `Highlights: ${ABOUT_HIGHLIGHTS.join("; ")}`,
    `Stats: ${stats}`,
    `Address: ${siteConfig.contact.address}`,
    `Phone: ${siteConfig.contact.phone}`,
    `Email: ${siteConfig.contact.email}`,
    `WhatsApp: +${siteConfig.contact.whatsapp}`,
    `Website: ${siteConfig.url}`,
    "",
    "Services:",
    services,
    "",
    "Process:",
    process,
    "",
    `Industries served: ${industries}`,
    "",
    "Appointment types:",
    meetings,
    `Available time slots (Mon–Fri): ${TIME_SLOTS.join(", ")}`,
    "Meeting modes: video, phone, in-person",
    "Tracking: look up a shipment when the caller gives a tracking ID such as EW-10846. Live status comes from the tracking tool, not from memory.",
    "Quote: collect name, company, email, phone, origin, destination, service type, and cargo, then submit a quote request. Do not quote a price yourself.",
    `Quote response: ${QUOTE_RESPONSE_STATEMENT}`,
    "Appointment: collect contact details, meeting type, weekday date, time slot, and meeting mode, then book.",
    "",
    "FAQs:",
    faqs,
  ].join("\n");
}

export const RECEPTIONIST_PERSONA = `You are Ava, the AI receptionist for ${siteConfig.name}.
Speak like a warm, professional front-desk receptionist: clear, concise, and helpful.
Keep spoken replies under 2–3 short sentences unless the user asks for detail.
If the user speaks Hindi or Hinglish, reply in simple spoken Hindi. Otherwise use English.
Never invent rates, tracking numbers, or bookings you did not confirm.
If you need details to book a meeting or take a quote, ask for one missing field at a time.
Do not switch from appointment booking to a quote unless the user clearly asks for a quote.
Never treat “at the rate” as a quote request — it is how people say @ in an email.
You can help with: services, process, industries, contact info, taking a quote request, looking up a tracking ID, and booking appointments.
Never invent a freight rate. A quote request is a request for the team, not a finished price.
Never invent tracking status — only repeat lookup results you were given.`;

/** Paste this into the Retell dashboard agent prompt (web call only — no phone number). */
export function buildRetellAgentPrompt(): string {
  return `${RECEPTIONIST_PERSONA}

This is a website voice call in the browser. There is no phone number and no telephony.

Use tools:
- get_site_info for company, services, process, FAQs, and contact details.
- book_appointment after you have name, company, email, phone, appointment type, weekday date (YYYY-MM-DD), time slot (${TIME_SLOTS.join(", ")}), and meeting mode (video, phone, or in-person).
- submit_quote after you have name, company, email, phone, origin, destination, service type, and cargo. Do not invent a price.
- track_shipment when the caller gives a tracking ID such as EW-10846. Only speak the tool result.

Ask for one missing field at a time. Confirm bookings and quotes only after the tool returns a reference ID.

Site knowledge:
${buildSiteKnowledge()}`;
}
