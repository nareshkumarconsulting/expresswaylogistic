# ExpressWay Logistic

Premium logistics SaaS for [expresswaylogistic.com](https://expresswaylogistic.com) — marketing website + **AI Logistics Command Center**.

## Product

1. **Enterprise website** — SEO/AEO optimized marketing site (services, industries, process, quotes, tracking).
2. **AI Logistics Command Center** — operations dashboard with shipment boards, analytics, exception risk scoring, and natural-language AI copilot.

## Stack

- Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4
- Framer Motion · React Hook Form · Zod · TanStack Query · Zustand
- Vitest · Playwright · Docker · GitHub Actions

## Architecture

Feature-based modules with Atomic Design:

```
src/
  app/                 # Routes (marketing, dashboard, API)
  components/
    atoms|molecules|organisms|templates|layouts
  features/            # contact, tracking, command-center, …
  services/            # data & integrations
  lib/ config/ types/ store/ providers/
```

Business logic lives in `features/`. UI primitives stay in Atomic Design layers. Pages compose templates/features only.

## Getting started

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Key routes

| Route | Description |
| --- | --- |
| `/` | Marketing homepage |
| `/services` | Service catalogue |
| `/track` | Public shipment tracking (`EW-10847`) |
| `/login` | Command Center sign-in (Supabase Auth) |
| `/command-center` | AI Logistics Command Center (auth required) |
| `/command-center/emails` | AI Email Intelligence board (auth required) |
| `/command-center/quotes` | Quote requests, including email AI drafts (auth required) |
| `/command-center/ai` | Natural-language copilot |
| `/api/health` | Health check |

Staff sign-in uses **Supabase Auth** when `NEXT_PUBLIC_SUPABASE_ANON_KEY` is set ([setup guide](docs/SUPABASE.md)). Demo fallback: `AUTH_EMAIL` / `AUTH_PASSWORD`.

## Scripts

```bash
npm run dev          # local development
npm run build        # production build
npm run start        # start production server
npm run typecheck    # TypeScript
npm run lint         # ESLint
npm run test         # Vitest unit/component tests
npm run test:e2e     # Playwright
npm run n8n          # Start local n8n (email pipeline dev)
npm run verify:email-intelligence  # Test ingest API (local or production)
```

## Environment

See `.env.example`:

- `NEXT_PUBLIC_APP_URL` — canonical site URL
- `CONTACT_WEBHOOK_URL` — optional CRM / n8n webhook for quote, appointment, and contact submissions
- `RESEND_API_KEY` — outbound email (lead alerts + customer/forwarder quotes)
- `LEAD_NOTIFY_EMAIL` — inbox for lead emails (default `sales@expresswaylogistics.com`)
- `LEAD_NOTIFY_FROM` / `QUOTE_EMAIL_FROM` — Resend from address (verify domain in production)
- `QUOTE_EMAIL_REPLY_TO` — reply-to for customer and forwarder quote emails
- `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` — Postgres + Command Center staff login ([setup guide](docs/SUPABASE.md))
- `AUTH_EMAIL` / `AUTH_PASSWORD` — credentials used by `scripts/bootstrap-staff.mjs` and demo auth fallback
- `AUTH_SESSION_SECRET` — optional demo session cookie value
- `GROQ_API_KEY` — optional; n8n classify + app quote drafts + Ava TTS (recommended, free tier)
- `GROQ_TTS_VOICE` — `hannah` (default), `autumn`, `diana`, `austin`, `daniel`, `troy`
- `OPENAI_API_KEY` — optional fallback for Ava TTS if Groq is unset
- `OPENAI_TTS_VOICE` — `nova` (default), `shimmer`, `coral`, etc.
- `RETELL_API_KEY` / `RETELL_AGENT_ID` / `RETELL_TOOL_SECRET` — optional Retell **web call** (browser only, no phone number). When set, Talk to Ava uses Retell; otherwise the built-in browser receptionist stays on.
- `EMAIL_INGEST_SECRET` — n8n → `/api/email-intelligence/ingest` webhook auth
- Observability hooks for GA4, GTM, Clarity, Sentry

## Ava voice (web only)

Talk to Ava in the help menu is a **browser call**. There is no inbound phone number and no Twilio/SIP setup.

1. Create a Retell agent (Web Call). Do **not** buy or attach a phone number.
2. Paste the prompt from `buildRetellAgentPrompt()` in `src/features/voice-agent/knowledge.ts`.
3. Add custom functions pointing at `https://your-domain/api/voice-agent/retell/tools` (or `...?name=book_appointment` if Payload: args only is on):
   - `get_site_info`
   - `book_appointment`
   - `submit_quote`
   - `track_shipment`
4. Header: `Authorization: Bearer <RETELL_TOOL_SECRET>`
5. Set `RETELL_API_KEY`, `RETELL_AGENT_ID`, and `RETELL_TOOL_SECRET` in `.env.local` / Vercel.

If those env vars are missing, Ava falls back to the on-site speech receptionist.

## Email intelligence (production)

AI-classified client emails (shipment, quotes, alerts) via n8n → Supabase → Command Center.

| Doc | Purpose |
| --- | --- |
| [Production setup (step-by-step)](docs/PRODUCTION_SETUP.md) | Vercel + Supabase + n8n VPS go-live |
| [Local n8n setup](docs/N8N_SETUP.md) | Dev environment |
| [Architecture & API](docs/EMAIL_INTELLIGENCE.md) | Workflow design |

Import workflow: `n8n/expressway-email-intelligence.workflow.json`

## Docker

```bash
docker compose up --build
```

## Deployment

Optimized for **Vercel** (app) + **VPS or n8n Cloud** (email pipeline). See **[Production setup](docs/PRODUCTION_SETUP.md)** for the full step-by-step guide.

## Security

- Secure headers via middleware (CSP, HSTS, XFO, nosniff, Permissions-Policy)
- `/command-center` and related APIs gated by Supabase staff session (demo auth fallback when unconfigured)
- Zod validation on all form/API inputs
- Rate limiting on quote API
- No secrets in client bundles

## SEO & AEO

- Metadata, Open Graph, Twitter cards
- `sitemap.xml` / `robots.txt`
- Organization, Service, FAQ, and WebSite JSON-LD

## Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [Supabase setup](docs/SUPABASE.md)
- [API](docs/API.md)
- [Components](docs/COMPONENTS.md)
- [Deployment](docs/DEPLOYMENT.md)
- [Production setup](docs/PRODUCTION_SETUP.md)
- [Email intelligence](docs/EMAIL_INTELLIGENCE.md)
- [n8n local setup](docs/N8N_SETUP.md)

## Reference

Marketing content and visual language adapted from the Logistics-Hub prototype, rebuilt as a production Next.js SaaS for ExpressWay Logistic.
