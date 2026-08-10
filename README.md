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
| `/login` | Command Center sign-in (demo auth) |
| `/command-center` | AI Logistics Command Center (auth required) |
| `/command-center/ai` | Natural-language copilot |
| `/api/health` | Health check |

Demo login: `ops@expresswaylogistic.com` / `expressway` (override with `AUTH_EMAIL` / `AUTH_PASSWORD`).

## Scripts

```bash
npm run dev          # local development
npm run build        # production build
npm run start        # start production server
npm run typecheck    # TypeScript
npm run lint         # ESLint
npm run test         # Vitest unit/component tests
npm run test:e2e     # Playwright
```

## Environment

See `.env.example`:

- `NEXT_PUBLIC_APP_URL` — canonical site URL
- `CONTACT_WEBHOOK_URL` — optional CRM / n8n webhook for quote, appointment, and contact submissions
- `RESEND_API_KEY` — optional; emails leads when webhook is missing or fails
- `LEAD_NOTIFY_EMAIL` — inbox for lead emails (default `sales@expresswaylogistics.com`)
- `LEAD_NOTIFY_FROM` — Resend from address (verify domain in production)
- `AUTH_EMAIL` / `AUTH_PASSWORD` — Command Center demo credentials (defaults above)
- `AUTH_SESSION_SECRET` — optional session cookie value
- `OPENAI_API_KEY` — optional; enables natural Ava TTS (recommended)
- `OPENAI_TTS_VOICE` — `nova` (default), `shimmer`, `coral`, etc.
- Observability hooks for GA4, GTM, Clarity, Sentry

## Docker

```bash
docker compose up --build
```

## Deployment

Optimized for **Vercel**. Set `NEXT_PUBLIC_APP_URL=https://expresswaylogistic.com` and optional webhook/observability secrets.

## Security

- Secure headers via middleware (CSP, HSTS, XFO, nosniff, Permissions-Policy)
- `/command-center` and related APIs gated by session cookie (static demo credentials for now)
- Zod validation on all form/API inputs
- Rate limiting on quote API
- No secrets in client bundles

## SEO & AEO

- Metadata, Open Graph, Twitter cards
- `sitemap.xml` / `robots.txt`
- Organization, Service, FAQ, and WebSite JSON-LD

## Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [API](docs/API.md)
- [Components](docs/COMPONENTS.md)
- [Deployment](docs/DEPLOYMENT.md)

## Reference

Marketing content and visual language adapted from the Logistics-Hub prototype, rebuilt as a production Next.js SaaS for ExpressWay Logistic.
