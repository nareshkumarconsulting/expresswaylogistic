import { randomUUID } from "crypto";
import { defaultEmailBranding } from "@/features/client-email/branding";
import type { ClientEmailMessage, EmailBrandingSettings } from "@/types";

let messages: ClientEmailMessage[] = [];
let branding: EmailBrandingSettings = defaultEmailBranding();

export function memoryListClientEmails(filters?: {
  quoteRequestId?: string;
  clientEmail?: string;
}): ClientEmailMessage[] {
  return messages
    .filter((row) => {
      if (
        filters?.quoteRequestId &&
        row.quoteRequestId !== filters.quoteRequestId
      ) {
        return false;
      }
      if (filters?.clientEmail) {
        const needle = filters.clientEmail.toLowerCase();
        const hit = [...row.toRecipients, ...row.ccRecipients].some(
          (email) => email.toLowerCase() === needle,
        );
        if (!hit) return false;
      }
      return true;
    })
    .map((row) => ({ ...row }));
}

export function memorySaveClientEmail(
  input: Omit<ClientEmailMessage, "id" | "createdAt" | "updatedAt"> & {
    id?: string;
  },
): ClientEmailMessage {
  const now = new Date().toISOString();
  if (input.id) {
    const index = messages.findIndex((row) => row.id === input.id);
    if (index >= 0) {
      const updated: ClientEmailMessage = {
        ...messages[index],
        ...input,
        id: input.id,
        updatedAt: now,
      };
      messages[index] = updated;
      return { ...updated };
    }
  }

  const created: ClientEmailMessage = {
    id: input.id ?? randomUUID(),
    quoteRequestId: input.quoteRequestId,
    clientName: input.clientName,
    clientCompany: input.clientCompany,
    toRecipients: input.toRecipients,
    ccRecipients: input.ccRecipients,
    bccRecipients: input.bccRecipients,
    subject: input.subject,
    bodyText: input.bodyText,
    bodyHtml: input.bodyHtml,
    prompt: input.prompt,
    status: input.status,
    providerMessageId: input.providerMessageId,
    errorMessage: input.errorMessage,
    sentBy: input.sentBy,
    sentAt: input.sentAt,
    createdAt: now,
    updatedAt: now,
  };
  messages = [created, ...messages];
  return { ...created };
}

export function memoryGetClientEmail(
  id: string,
): ClientEmailMessage | undefined {
  return messages.find((row) => row.id === id);
}

export function memoryGetBranding(): EmailBrandingSettings {
  return { ...branding };
}

export function memorySaveBranding(
  next: EmailBrandingSettings,
): EmailBrandingSettings {
  branding = {
    ...next,
    id: "default",
    updatedAt: new Date().toISOString(),
  };
  return { ...branding };
}
