import { siteConfig } from "@/config/site";
import {
  ABOUT_HIGHLIGHTS,
  FAQ_ITEMS,
  INDUSTRIES,
  PROCESS_STEPS,
  STATS,
} from "@/constants/content";
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
    `Positioning: Neutral NVOCC with 32 years in international cargo movement`,
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
    "Tracking: users can track shipments at /track",
    "Quote: users can request a quote at /quote or book an appointment at /appointment",
    "",
    "FAQs:",
    faqs,
  ].join("\n");
}

export const RECEPTIONIST_PERSONA = `You are Ava, the AI receptionist for ${siteConfig.name}.
Speak like a warm, professional front-desk receptionist: clear, concise, and helpful.
Keep spoken replies under 2–3 short sentences unless the user asks for detail.
Never invent rates, tracking numbers, or bookings you did not confirm.
If you need details to book, ask for one missing field at a time.
You can help with: services, process, industries, contact info, quotes, tracking guidance, and booking appointments.`;
