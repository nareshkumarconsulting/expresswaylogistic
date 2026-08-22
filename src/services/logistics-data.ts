import type { AiInsight, EmailIntelligence, QuoteRequest, Shipment } from "@/types";

/** Legacy export — demo seeds removed; live data comes from Supabase / in-session memory. */
export const MOCK_SHIPMENTS: Shipment[] = [];

/** Legacy export — demo seeds removed; live data comes from Supabase / in-session memory. */
export const MOCK_QUOTE_REQUESTS: QuoteRequest[] = [];

/** Legacy export — demo seeds removed. */
export const MOCK_AI_INSIGHTS: AiInsight[] = [];

/** Legacy export — demo seeds removed; live data comes from email intelligence ingest. */
export const MOCK_EMAIL_INTELLIGENCE: EmailIntelligence[] = [];

/** Placeholder until analytics is backed by historical shipment data. */
export const SHIPMENT_VOLUME: { month: string; air: number; ocean: number }[] =
  [];

/** Placeholder until analytics is backed by live shipment mix. */
export const FREIGHT_MIX: { name: string; value: number; color: string }[] = [];

/** Placeholder until analytics is backed by live route volume. */
export const TOP_ROUTES: { route: string; volume: number }[] = [];
