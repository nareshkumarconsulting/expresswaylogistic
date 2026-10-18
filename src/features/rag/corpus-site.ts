import { siteConfig } from "@/config/site";
import {
  ABOUT_HIGHLIGHTS,
  FAQ_ITEMS,
  INDUSTRIES,
  PROCESS_STEPS,
  STATS,
} from "@/constants/content";
import { SERVICES } from "@/constants/services";
import type { RagDocument } from "@/features/rag/types";

/** Static marketing / company knowledge for Ava and the staff copilot. */
export function buildSiteCorpus(): RagDocument[] {
  const docs: RagDocument[] = [
    {
      id: "company-overview",
      kind: "company",
      title: `${siteConfig.name} overview`,
      text: [
        siteConfig.description,
        `Legal name: ${siteConfig.legalName}`,
        `Tagline: ${siteConfig.tagline}`,
        `Address: ${siteConfig.contact.address}`,
        `Phone: ${siteConfig.contact.phone}`,
        `Email: ${siteConfig.contact.email}`,
        `WhatsApp: +${siteConfig.contact.whatsapp}`,
        `Highlights: ${ABOUT_HIGHLIGHTS.join("; ")}`,
        `Stats: ${STATS.map((s) => `${s.value}${s.suffix ?? ""} ${s.label}`).join("; ")}`,
        `Industries: ${INDUSTRIES.map((item) => item.name).join(", ")}`,
      ].join("\n"),
      href: "/",
    },
  ];

  for (const faq of FAQ_ITEMS) {
    docs.push({
      id: `faq-${faq.question.slice(0, 48).toLowerCase().replace(/\W+/g, "-")}`,
      kind: "faq",
      title: faq.question,
      text: `Question: ${faq.question}\nAnswer: ${faq.answer}`,
      href: "/#faq",
    });
  }

  for (const service of SERVICES) {
    docs.push({
      id: `service-${service.id}`,
      kind: "service",
      title: service.title,
      text: [
        service.description,
        service.details,
        `Highlights: ${service.highlights.join("; ")}`,
      ].join("\n"),
      href: service.href,
    });
  }

  for (const [index, step] of PROCESS_STEPS.entries()) {
    docs.push({
      id: `process-${index + 1}`,
      kind: "process",
      title: `Process step ${index + 1}: ${step.title}`,
      text: step.description,
      href: "/process",
    });
  }

  return docs;
}
