# AI Email Intelligence Workflow

This document describes how to connect **n8n** to the ExpressWay Command Center for AI-powered email classification and structured extraction.

## Architecture

```
4 Client Email Accounts (IMAP/Gmail/Outlook)
        │
        ▼
   n8n Email Trigger (one workflow per account, or merged)
        │
        ▼
   Read Email + Attachments
        │
        ▼
   AI Classification (OpenAI / Claude node)
        │
        ├── 🚚 shipment   — Shipment / Tracking
        ├── 💰 quotation  — Quotation / Rate
        ├── 🔔 alert      — Important Alert / Action Required
        └── 📄 general    — General / Other
        │
        ▼
   AI Information Extraction (structured JSON)
        │
        ▼
   POST /api/email-intelligence/ingest  →  Supabase
        │
        ▼
   Command Center → /command-center/emails
```

## Setup

### 1. Run the database migration

In Supabase SQL Editor, run:

```
supabase/migrations/004_email_intelligence.sql
```

### 2. Configure environment variables

Add to `.env.local` (and Vercel production env):

```bash
EMAIL_INGEST_SECRET=your-long-random-secret-here
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
```

Generate a secret:

```bash
openssl rand -hex 32
```

### 3. n8n workflow nodes

**Start here:** [N8N_SETUP.md](./N8N_SETUP.md) — Docker, credentials, import, and first test.

**Ready-to-import workflow files** (in repo):

| File | Use when |
|------|----------|
| `n8n/expressway-email-intelligence.workflow.json` | **4 Gmail inboxes** (ops, quotes, alerts, info) |
| `n8n/expressway-email-intelligence-imap.workflow.json` | **Single IMAP inbox** (test or non-Gmail) |
| `n8n/expressway-email-intelligence-rediffmail.workflow.json` | **Rediffmail Pro / Enterprise** (`imap.rediffmailpro.com`) |

**Import:** n8n → Workflows → ⋮ menu → **Import from File**

**n8n variables** (Settings → Variables):

| Variable | Example |
|----------|---------|
| `EXPRESSWAY_APP_URL` | `https://expresswaylogistic.com` |
| `EMAIL_INGEST_SECRET` | same as app `.env.local` |

**Credentials to connect after import:**

- OpenAI API → on **OpenAI Classify & Extract** node
- Gmail OAuth2 → on each **Gmail — *** trigger (4 accounts)
- Or IMAP → on **IMAP Email Trigger** (single-inbox variant)

Then activate the workflow.

---

Manual node reference (if building from scratch):

#### Node 1 — Email Trigger

- **Gmail Trigger**, **Microsoft Outlook Trigger**, or **IMAP Email** node
- Connect each of your 3–4 client email accounts
- Trigger on: **New email**

#### Node 2 — Set source account

Add a **Set** node to tag which inbox received the email:

```json
{
  "sourceAccount": "ops@expresswaylogistics.com"
}
```

Use a different value per workflow/account (e.g. `quotes@`, `alerts@`, `info@`).

#### Node 3 — AI Classification + Extraction

Use an **OpenAI** or **AI Agent** node with this system prompt:

```
You are an email intelligence assistant for ExpressWay Logistics, a freight forwarding company.

Classify the email into exactly ONE category:
- shipment: tracking updates, AWB/BL numbers, container status, ETA changes
- quotation: rate quotes, freight quotations, pricing from carriers/forwarders
- alert: urgent action required — customs holds, documentation issues, delays, payment deadlines
- general: newsletters, marketing, general correspondence

Then extract structured fields based on category:

For shipment: awb, trackingNo, pickup, destination, status, eta
For quotation: quoteNo, origin, destination, carrier, price, validity
For alert: alertType, urgency (low|medium|high|critical), requiredAction, deadline
For general: sender, subject, date, summary

Respond ONLY with valid JSON:
{
  "category": "shipment|quotation|alert|general",
  "confidence": 0.0-1.0,
  "summary": "one sentence summary",
  "urgency": "low|medium|high|critical",
  "extractedData": { ... category-specific fields ... }
}
```

Pass the email subject, body, and sender to the AI node.

#### Node 4 — HTTP Request (Ingest)

- **Method:** POST
- **URL:** `https://your-domain.com/api/email-intelligence/ingest`
- **Authentication:** Header Auth
  - Name: `Authorization`
  - Value: `Bearer {{$env.EMAIL_INGEST_SECRET}}`
- **Body (JSON):**

```json
{
  "sourceAccount": "{{ $('Set').item.json.sourceAccount }}",
  "externalMessageId": "{{ $json.messageId }}",
  "senderEmail": "{{ $json.from.address }}",
  "senderName": "{{ $json.from.name }}",
  "subject": "{{ $json.subject }}",
  "receivedAt": "{{ $json.date }}",
  "category": "{{ $('AI').item.json.category }}",
  "confidence": "{{ $('AI').item.json.confidence }}",
  "summary": "{{ $('AI').item.json.summary }}",
  "urgency": "{{ $('AI').item.json.urgency }}",
  "hasAttachments": "{{ $json.attachments.length > 0 }}",
  "attachmentNames": "{{ $json.attachments.map(a => a.filename) }}",
  "extractedData": "{{ $('AI').item.json.extractedData }}"
}
```

Adjust node references (`$('Set')`, `$('AI')`) to match your workflow node names.

## API Reference

### `POST /api/email-intelligence/ingest`

**Auth:** Bearer token or `x-email-ingest-secret` header (not staff session).

**Request body:**

```json
{
  "sourceAccount": "ops@expresswaylogistics.com",
  "externalMessageId": "<message-id@mail.gmail.com>",
  "senderEmail": "tracking@carrier.com",
  "senderName": "Carrier Tracking",
  "subject": "Shipment Update — BL MAEU123456789",
  "receivedAt": "2026-08-11T10:30:00Z",
  "category": "shipment",
  "confidence": 0.94,
  "summary": "Container departed Mumbai, ETA Singapore 14 Aug.",
  "urgency": "medium",
  "hasAttachments": true,
  "attachmentNames": ["BL.pdf"],
  "extractedData": {
    "awb": "MAEU123456789",
    "trackingNo": "CONT-MSKU9876543",
    "pickup": "Mumbai, IN",
    "destination": "Singapore, SG",
    "status": "In Transit",
    "eta": "14 Aug 2026"
  }
}
```

**Response:**

```json
{ "success": true, "data": { "id": "uuid" }, "message": "Email intelligence stored" }
```

Duplicate emails (same `sourceAccount` + `externalMessageId`) are upserted.

### `GET /api/email-intelligence`

Staff-authenticated. Optional query params: `?category=shipment&status=new`.

### `PATCH /api/email-intelligence/:id`

Staff-authenticated. Body: `{ "status": "read" | "actioned" | "archived" }`.

## Category extraction fields

| Category | Fields extracted |
|----------|-----------------|
| 🚚 Shipment | AWB/BL, Tracking No., Pickup, Destination, Status, ETA |
| 💰 Quotation | Quote No., Origin, Destination, Carrier, Price, Validity |
| 🔔 Alert | Alert Type, Urgency, Required Action, Deadline |
| 📄 General | Sender, Subject, Date, Summary |

## Dashboard

Open **Command Center → Email Intelligence** at `/command-center/emails`.

Features:
- Filter by category and status
- Search by subject, sender, or account
- Click any row to view extracted fields and update status
- Auto-refreshes every 60 seconds

## Testing locally

```bash
# Set secret in .env.local
EMAIL_INGEST_SECRET=test-secret-123

# Send a test payload
curl -X POST http://localhost:3000/api/email-intelligence/ingest \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer test-secret-123" \
  -d '{
    "sourceAccount": "ops@expresswaylogistics.com",
    "externalMessageId": "test-001",
    "senderEmail": "tracking@test.com",
    "subject": "Test shipment update",
    "receivedAt": "2026-08-11T12:00:00Z",
    "category": "shipment",
    "confidence": 0.9,
    "summary": "Test email",
    "extractedData": {
      "trackingNo": "TEST-123",
      "destination": "Dubai"
    }
  }'
```

Then visit `/command-center/emails` (after logging in).
