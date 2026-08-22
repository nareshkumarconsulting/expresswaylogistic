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

### `GET /api/shipments/:id`

Shipment detail for the ops detail sheet.

### `PATCH /api/shipments/:id`

Update shipment status and operational fields (phone / manual ops).

Body (at least one field):

```json
{
  "status": "In Transit",
  "carrierName": "Maersk",
  "carrierRef": "MAEU123456",
  "estimatedEta": "2026-08-25T10:00:00.000Z",
  "assignedTo": "Ops desk",
  "internalNotes": "Confirmed on phone — cargo ready Monday"
}
```

Status values: `Processing` · `In Transit` · `Customs Hold` · `Delivered` · `Delayed`

## `GET /api/ai/insights`

Current AI insight feed.

## Email Intelligence

See [EMAIL_INTELLIGENCE.md](./EMAIL_INTELLIGENCE.md) for the full n8n workflow setup.

### `POST /api/email-intelligence/ingest`

n8n webhook — stores classified email data, then the app may create an email-origin quote draft. Auth: `Authorization: Bearer <EMAIL_INGEST_SECRET>`. Body should include `body` (email text) so quote completeness can be checked.

### `GET /api/email-intelligence`

Command Center email board. Query: `?category=shipment&status=new`.

### `PATCH /api/email-intelligence/:id`

Update email status: `{ "status": "read" | "actioned" | "archived" }`.

## Quote management

Staff-only (`/api/quotes`, `/api/forwarders`).

### `GET /api/quotes`

List quote requests with repeat-customer flags.

### `GET /api/quotes/:id`

Quote detail including previous quotes, forwarder requests, and activity.

### `PATCH /api/quotes/:id`

Save status, amounts, notes, validity, margin, or `aiReviewStatus` (`needs_review` | `needs_info` | `confirmed` | `dismissed`). Confirming an email AI draft moves **New** → **Under Review**.

### `POST /api/quotes/:id/send`

Save and email the customer quotation. Status becomes `Quoted` only when Resend succeeds; otherwise `Quote Ready / Email Failed`.

### `POST /api/quotes/:id/forwarders`

Body: `{ "forwarderIds": ["uuid"] }`. Emails RFQs and tracks each forwarder.

### `POST /api/quotes/:id/forwarder-quotes`

Record a forwarder response.

### `POST /api/quotes/:id/select-forwarder`

Select a preferred forwarder quote and apply margin.

### `GET|POST /api/forwarders` and `PATCH|DELETE /api/forwarders/:id`

Forwarder directory. Delete returns `409` if the forwarder is already used on a quote.

## `POST /api/ai/insights`

Natural-language operations query.

Body:

```json
{ "query": "customs hold" }
```
