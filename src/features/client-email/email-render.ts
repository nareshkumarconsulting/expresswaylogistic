import type { EmailBrandingSettings } from "@/types";
import { resolveEmailBranding } from "@/features/client-email/branding";

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function paragraphsFromText(body: string): string {
  return body
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => {
      const lines = escapeHtml(block).replaceAll("\n", "<br/>");
      return `<p style="margin:0 0 14px;">${lines}</p>`;
    })
    .join("");
}

function defaultSignatureHtml(branding: EmailBrandingSettings): string {
  const website = branding.websiteUrl
    ? `<br/><a href="${escapeHtml(branding.websiteUrl)}" style="color:#0f172a;text-decoration:none;">${escapeHtml(branding.websiteUrl.replace(/^https?:\/\//, ""))}</a>`
    : "";
  const tagline = branding.tagline
    ? `<br/><span style="color:#64748b;font-size:13px;">${escapeHtml(branding.tagline)}</span>`
    : "";
  const logo = branding.logoUrl
    ? `<p style="margin:0 0 14px;"><img src="${escapeHtml(branding.logoUrl)}" alt="${escapeHtml(branding.companyName)}" width="220" height="147" style="display:block;width:220px;max-width:100%;height:auto;border:0;outline:none;text-decoration:none;" /></p>`
    : "";

  return `
    ${logo}
    <p style="margin:0;line-height:1.55;">
      Regards,<br/>
      <strong>${escapeHtml(branding.companyName)}</strong>${tagline}<br/>
      ${escapeHtml(branding.contactAddress ?? "")}<br/>
      ${escapeHtml(branding.contactPhone ?? "")}<br/>
      <a href="mailto:${escapeHtml(branding.contactEmail ?? "")}" style="color:#0f172a;">${escapeHtml(branding.contactEmail ?? "")}</a>${website}
    </p>
  `.trim();
}

function defaultSignatureText(branding: EmailBrandingSettings): string {
  return [
    "Regards,",
    branding.companyName,
    branding.tagline,
    branding.contactAddress,
    branding.contactPhone,
    branding.contactEmail,
    branding.websiteUrl,
  ]
    .filter(Boolean)
    .join("\n");
}

export type ClientEmailComposeParts = {
  greeting: string;
  body: string;
  cta?: string;
};

export function composeClientEmailBodyText(parts: ClientEmailComposeParts): string {
  const sections = [parts.greeting.trim(), "", parts.body.trim()];
  if (parts.cta?.trim()) {
    sections.push("", parts.cta.trim());
  }
  return sections.join("\n");
}

export function renderClientEmail(
  parts: ClientEmailComposeParts,
  brandingInput?: Partial<EmailBrandingSettings> | null,
): { html: string; text: string } {
  const branding = resolveEmailBranding(brandingInput);
  const bodyHtml = [
    `<p style="margin:0 0 14px;">${escapeHtml(parts.greeting.trim())}</p>`,
    paragraphsFromText(parts.body),
    parts.cta?.trim()
      ? `<p style="margin:18px 0 0;">${escapeHtml(parts.cta.trim())}</p>`
      : "",
  ].join("");

  const signatureHtml =
    branding.signatureHtml?.trim() || defaultSignatureHtml(branding);
  const signatureText = branding.signatureHtml?.trim()
    ? "\n\n[Company signature]"
    : `\n\n${defaultSignatureText(branding)}`;

  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;color:#0f172a;line-height:1.6;max-width:640px;font-size:15px;">
      ${bodyHtml}
      <div style="margin-top:28px;padding-top:20px;border-top:1px solid #e2e8f0;">
        ${signatureHtml}
      </div>
    </div>
  `.trim();

  const text = `${composeClientEmailBodyText(parts)}${signatureText}`;

  return { html, text };
}

export function renderClientEmailFromPlainBody(
  bodyText: string,
  brandingInput?: Partial<EmailBrandingSettings> | null,
): { html: string; text: string } {
  const branding = resolveEmailBranding(brandingInput);
  const signatureHtml =
    branding.signatureHtml?.trim() || defaultSignatureHtml(branding);
  const signatureText = branding.signatureHtml?.trim()
    ? "\n\n[Company signature]"
    : `\n\n${defaultSignatureText(branding)}`;

  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;color:#0f172a;line-height:1.6;max-width:640px;font-size:15px;">
      ${paragraphsFromText(bodyText)}
      <div style="margin-top:28px;padding-top:20px;border-top:1px solid #e2e8f0;">
        ${signatureHtml}
      </div>
    </div>
  `.trim();

  return { html, text: `${bodyText.trim()}${signatureText}` };
}
