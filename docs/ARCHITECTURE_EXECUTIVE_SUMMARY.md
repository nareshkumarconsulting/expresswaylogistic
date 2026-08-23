# ExpressWay Logistic — Architecture Executive Summary

**One-page overview for stakeholders** · Full detail: [ARCHITECTURE.md](./ARCHITECTURE.md) · Poster: [expressway-system-architecture.png](./expressway-system-architecture.png)

---

## What we built

A **dual-surface logistics SaaS**: a public marketing website for lead acquisition, and an **AI Logistics Command Center** for sales and operations — unified on a single **Next.js 16** application hosted on **Vercel**.

| Surface | Users | Core capabilities |
| --- | --- | --- |
| **Marketing site** | Shippers, importers/exporters | Quote wizard, contact, appointments, shipment tracking, Ava voice agent, 100+ SEO pages |
| **Command Center** | Sales / ops staff | Quote pipeline, forwarder RFQs, email intelligence, client email agent, shipments, analytics, AI copilot |

---

## Platform at a glance

```
Customers ──► Public Site + Ava Voice ──► REST API (/api/*) ──► Supabase Postgres
Staff     ──► Command Center ──────────► REST API (protected) ──► Resend Email
Inboxes   ──► n8n (VPS) ───────────────► Ingest webhook ────────► Groq / Gemini / OpenAI
```

| Layer | Technology |
| --- | --- |
| App | Next.js 16, React 19, TypeScript, Tailwind |
| Hosting | Vercel (Fluid Compute) |
| Database & auth | Supabase Postgres + Auth + RLS |
| Email automation | n8n on separate VPS (IMAP/Gmail/Rediffmail) |
| Outbound email | Resend |
| AI | Groq (primary), Gemini, OpenAI |
| Voice | Retell WebRTC or browser speech + TTS |

---

## Key business flows

**1. Website quote** — Customer submits quote wizard → validated + rate-limited → stored in Postgres → webhook/Resend alert → staff reviews in Command Center → RFQ to forwarders → customer quote email.

**2. Email intelligence** — Client inbox email → n8n AI classification → secure ingest API → auto-draft quote if RFQ detected → staff confirms in Command Center.

**3. Shipment ops** — Quote accepted → shipment created (`EW-xxxxx`) → status board in Command Center → public tracking lookup.

---

## Security & reliability

- Staff routes gated by Supabase session (demo fallback for local dev)
- Security headers, CSP, HSTS via middleware
- Public forms rate-limited (6–8 req/IP/min)
- n8n ingest protected by bearer secret (`EMAIL_INGEST_SECRET`)
- Service-role DB access server-side only; RLS for authenticated staff
- CI: typecheck, lint, unit tests, production build on every PR

---

## Deployment split

| Component | Where | Why |
| --- | --- | --- |
| Next.js app | Vercel | Serverless, global CDN, zero-config |
| Postgres + Auth | Supabase | Managed DB, staff login |
| n8n workflows | VPS / n8n Cloud | Long-running IMAP listeners — not suitable for Vercel |
| LLM / email / voice | SaaS APIs | Pay-per-use, no infra |

**Production domain:** expresswaylogistic.com

---

## Roadmap hooks (designed in, not yet live)

- **WhatsApp AI agent** — Meta Cloud API (number in review)
- **Live TMS / carrier tracking** — repository adapter swap, no UI rewrite
- **ERP connectors** — same API-first webhook pattern as n8n ingest

---

## Documentation index

| Doc | Audience |
| --- | --- |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Engineering — full technical architecture |
| [expressway-technical-architecture.png](./expressway-technical-architecture.png) | Updated architecture diagram (companion to poster) |
| [PRODUCT_OVERVIEW.md](./PRODUCT_OVERVIEW.md) | Product + feature reference |
| [PRODUCTION_SETUP.md](./PRODUCTION_SETUP.md) | Go-live checklist |
