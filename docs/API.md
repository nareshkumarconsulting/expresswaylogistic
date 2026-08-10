# API Documentation

Base URL: `/api`

All responses follow:

```json
{ "success": true, "data": {}, "message": "optional" }
```

Errors:

```json
{ "success": false, "error": "message" }
```

## `GET /api/health`

Liveness check.

## `POST /api/contact`

Submit a freight quote request.

- Validated by `quoteFormSchema`
- Rate limited (8 req / IP / minute)
- Delivered via `CONTACT_WEBHOOK_URL`, with Resend email fallback (`RESEND_API_KEY` + `LEAD_NOTIFY_EMAIL`)

## `POST /api/quote`

Submit the multi-step quote wizard request.

- Validated by `quoteWizardSchema`
- Rate limited (6 req / IP / minute)
- Same webhook + email fallback delivery as contact

## `POST /api/appointment`

Book a logistics appointment (freight planning, customs, project cargo, EXIM advisory, packing, warehouse visit, or onboarding).

- Validated by `appointmentFormSchema` (weekday IST slots)
- Rate limited (8 req / IP / minute)
- Delivered via webhook with Resend email fallback as `appointment_request`

## `GET /api/tracking?id=EW-10847`

Public shipment tracking lookup.

## `GET /api/shipments`

Command Center shipment board data.

## `GET /api/ai/insights`

Current AI insight feed.

## `POST /api/ai/insights`

Natural-language operations query.

Body:

```json
{ "query": "customs hold" }
```
