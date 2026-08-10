# Architecture Overview

## Goals

Deliver a production-grade logistics SaaS for ExpressWay Logistic with:

- Public acquisition website (SEO + AEO)
- Authenticated-ready AI Command Center (operations + insights)
- API-first integrations for CRM/webhooks and future ERP/TMS connectors

## Layers

1. **Presentation** — Atomic Design components + page templates
2. **Features** — domain modules (`contact`, `tracking`, `command-center`)
3. **Application services** — typed fetchers / mock data adapters
4. **API routes** — REST handlers with Zod validation + structured logging
5. **Cross-cutting** — security middleware, providers, config, observability hooks

## Routing

- `(marketing)` route group — public pages with site header/footer
- `(dashboard)` route group — Command Center shell (sidebar + topbar)
- `api/*` — REST endpoints

## State

- Server/async: TanStack Query
- UI chrome: Zustand (`sidebarOpen`)
- Forms: React Hook Form + Zod

## Extensibility

Replace `src/services/logistics-data.ts` with Supabase/Postgres + TMS adapters without changing UI contracts. Auth can be layered with Better Auth / Auth.js on `/command-center` via middleware.
