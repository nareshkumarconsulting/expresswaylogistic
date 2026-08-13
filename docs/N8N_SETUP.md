# n8n Setup — ExpressWay Email Intelligence

Step-by-step guide to run n8n locally and connect it to the Command Center.

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running
- Next.js app running on port 3000 (`npm run dev`)
- Supabase migration `004_email_intelligence.sql` applied

## 1. Start n8n

### Option A — Docker (recommended)

Requires [Docker Desktop](https://www.docker.com/products/docker-desktop/).

```bash
docker compose up n8n -d
```

### Option B — npm (no Docker)

```bash
npm run n8n
```

First run downloads n8n via `npx` (~1–2 min). Keep this terminal open.

---

Open **http://localhost:5678**

On first visit, create your **n8n owner account** (email + password). This is local-only.

Check n8n is healthy:

```bash
docker compose ps n8n
docker compose logs n8n --tail 30
```

## 2. Environment (already wired)

Docker Compose passes these from `.env.local` into n8n:

| Variable | Purpose |
|----------|---------|
| `EMAIL_INGEST_SECRET` | Auth token for `POST /api/email-intelligence/ingest` |
| `EXPRESSWAY_APP_URL` | Set to `http://host.docker.internal:3000` (Docker → host Next.js) |
| `OPENAI_API_KEY` | Used by the OpenAI node in the workflow (if set in `.env.local`) |

Verify in n8n: **Settings → Variables** — you should see `EMAIL_INGEST_SECRET` and `EXPRESSWAY_APP_URL` if env access is enabled (configured in `docker-compose.yml`).

## 3. Import the workflow

1. n8n → **Workflows** → **⋮** (top right) → **Import from File**
2. Choose one:
   - `n8n/expressway-email-intelligence.workflow.json` — **4 Gmail inboxes**
   - `n8n/expressway-email-intelligence-imap.workflow.json` — **single IMAP inbox** (easier to test first)
3. Open the imported workflow

## 4. Connect credentials

### OpenAI (required for AI classification)

1. Click **OpenAI Classify & Extract** node
2. **Credential to connect with** → **Create New** → **OpenAI API**
3. Paste your API key from [platform.openai.com](https://platform.openai.com/api-keys)
4. Save

Add to `.env.local` if not already set:

```bash
OPENAI_API_KEY=sk-...
```

Then restart n8n: `docker compose restart n8n`

### Email trigger (pick one approach)

**Option A — IMAP (recommended for first test)**

1. Use the **IMAP single inbox** workflow
2. On **IMAP Email Trigger** → create **IMAP** credential:
   - Host: `imap.gmail.com` (Gmail) or your provider
   - Port: `993`, SSL: on
   - User / password or app password
3. Edit **Set Source Account** → set `sourceAccount` to your inbox address

**Option B — Gmail OAuth (4-account workflow)**

1. Use the **4 Gmail** workflow
2. On each **Gmail — *** trigger → connect **Gmail OAuth2**
3. Follow n8n’s Google Cloud OAuth setup (Gmail API enabled)
4. Update `sourceAccount` in each **Account — *** Set node

**Option C — Microsoft Outlook**

Replace Gmail Trigger nodes with **Microsoft Outlook Trigger** and connect Outlook OAuth.

## 5. Test without email (manual)

Before connecting real inboxes, test the ingest pipeline:

1. Ensure Next.js is running: `npm run dev`
2. Run:

```bash
curl -X POST http://localhost:3000/api/email-intelligence/ingest \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $EMAIL_INGEST_SECRET" \
  -d '{
    "sourceAccount": "ops@expresswaylogistics.com",
    "externalMessageId": "manual-test-001",
    "senderEmail": "tracking@test.com",
    "subject": "Test shipment update",
    "receivedAt": "2026-08-11T12:00:00Z",
    "category": "shipment",
    "confidence": 0.9,
    "summary": "Manual ingest test",
    "extractedData": { "trackingNo": "TEST-123", "destination": "Dubai" }
  }'
```

3. Open **http://localhost:3000/command-center/emails** (log in first)

## 6. Activate the workflow

1. In n8n, open the workflow
2. Toggle **Active** (top right)
3. Send a test email to the connected inbox
4. Check **Executions** tab in n8n for success/failures
5. Refresh the Command Center emails page

## Troubleshooting

| Issue | Fix |
|-------|-----|
| n8n can't reach app (`ECONNREFUSED`) | Ensure `npm run dev` is running. Docker: use `host.docker.internal:3000`. npm n8n: use `http://localhost:3000` (set automatically) |
| Ingest returns 401 | `EMAIL_INGEST_SECRET` must match in `.env.local` and n8n env; restart n8n after changing |
| Ingest returns 503 | Add `EMAIL_INGEST_SECRET` to `.env.local` and restart Next.js |
| OpenAI node fails | Connect OpenAI credential; check API key and billing |
| Gmail trigger not firing | Enable Gmail API; use App Password if 2FA; check OAuth scopes |
| No data on dashboard | Run Supabase migration `004_email_intelligence.sql` |

## Useful commands

```bash
# Start n8n (pick one)
docker compose up n8n -d    # Docker
npm run n8n                 # npm / npx

# Stop n8n
docker compose stop n8n

# View logs
docker compose logs n8n -f

# Restart after .env.local changes
docker compose up n8n -d --force-recreate

# Remove n8n data (fresh start)
docker compose down n8n && docker volume rm expresswaylogistic_n8n_data
```

## Next steps

- [EMAIL_INTELLIGENCE.md](./EMAIL_INTELLIGENCE.md) — full architecture and API reference
- Duplicate the IMAP workflow for each additional client inbox
- Point `EXPRESSWAY_APP_URL` to production URL when deploying
