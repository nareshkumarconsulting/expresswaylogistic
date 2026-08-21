import { siteConfig } from "@/config/site";
import type { EmailBrandingSettings } from "@/types";

/** Public path for the email-safe logo (white plate PNG). */
export const EMAIL_LOGO_PATH = "/images/expressway-logo-email.png";

/** Always the production CDN URL — emails and previews must not use localhost. */
export function defaultEmailLogoUrl(): string {
  return `${siteConfig.url.replace(/\/$/, "")}${EMAIL_LOGO_PATH}`;
}

export function defaultEmailBranding(): EmailBrandingSettings {
  return {
    id: "default",
    companyName: siteConfig.name,
    tagline: siteConfig.tagline,
    websiteUrl: siteConfig.url,
    contactEmail: siteConfig.contact.email,
    contactPhone: siteConfig.contact.phone,
    contactAddress: siteConfig.contact.address,
    logoUrl: defaultEmailLogoUrl(),
  };
}

function isLegacySiteLogoUrl(url: string): boolean {
  return (
    /\/images\/expressway-logo\.webp(?:\?|$)/i.test(url) ||
    /\/images\/expressway-logo\.png(?:\?|$)/i.test(url) ||
    /\/images\/expressway-logo-transparent\.png(?:\?|$)/i.test(url) ||
    // Normalize any host (localhost / preview) back to the production asset.
    /\/images\/expressway-logo-email\.png(?:\?|$)/i.test(url)
  );
}

export function resolveEmailBranding(
  overrides?: Partial<EmailBrandingSettings> | null,
): EmailBrandingSettings {
  const defaults = defaultEmailBranding();
  if (!overrides) return defaults;

  const rawLogo = overrides.logoUrl?.trim() || defaults.logoUrl || defaultEmailLogoUrl();
  const logoUrl = isLegacySiteLogoUrl(rawLogo)
    ? defaultEmailLogoUrl()
    : rawLogo;

  return {
    id: overrides.id ?? defaults.id,
    companyName: overrides.companyName?.trim() || defaults.companyName,
    tagline: overrides.tagline?.trim() || defaults.tagline,
    websiteUrl: overrides.websiteUrl?.trim() || defaults.websiteUrl,
    contactEmail: overrides.contactEmail?.trim() || defaults.contactEmail,
    contactPhone: overrides.contactPhone?.trim() || defaults.contactPhone,
    contactAddress:
      overrides.contactAddress?.trim() || defaults.contactAddress,
    logoUrl,
    signatureHtml: overrides.signatureHtml?.trim() || undefined,
    updatedAt: overrides.updatedAt,
    updatedBy: overrides.updatedBy,
  };
}
