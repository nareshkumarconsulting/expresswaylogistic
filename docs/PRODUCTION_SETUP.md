# Production Setup — Step by Step

Complete guide to deploy **ExpressWay Logistic** (Vercel) + **Email Intelligence** (n8n + Supabase) for production.

**Time estimate:** ~2–3 hours first time.

---

## Overview

| Layer | Where it runs | You configure |
|-------|---------------|---------------|
| Website + API | **Vercel** | Env vars, domain |
| Database | **Supabase** | Migration SQL, staff users |
| Email AI pipeline | **n8n server** (VPS or n8n Cloud) | Workflow, Gmail/IMAP, OpenAI |

```
Client emails → n8n (24/7) → AI classify → POST ingest API → Supabase → Command Center
                                    ↓
                         https://expresswaylogistic.com/api/email-intelligence/ingest
```

---

## Phase 1 — Supabase (database)

### Step 1.1 — Open Supabase project

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Open your project (same as `SUPABASE_URL` in `.env.local`)

### Step 1.2 — Run migrations (if not done)

In **SQL Editor**, run each file in order:

```
supabase/migrations/001_phase1_leads.sql
supabase/migrations/002_api_grants.sql
supabase/migrations/003_staff_auth.sql
supabase/migrations/004_email_intelligence.sql   ← required for email dashboard
supabase/migrations/005_quote_management.sql     ← quote workflow + forwarders
```

### Step 1.3 — Create staff user for Command Center

1. **Authentication → Users → Add user** (email + password for ops team)
2. Copy the user's **UUID**
3. In SQL Editor:

```sql
insert into staff_profiles (user_id, email, full_name, role)
values (
  '<paste-auth-user-uuid>',
  'ops@expresswaylogistic.com',
  'Operations Team',
  'admin'
);
```

### Step 1.4 — Verify table exists

```sql
select count(*) from email_intelligence;
```

Should return `0` (empty table, no error).

---

## Phase 2 — Secrets (generate once)

Run locally:

```bash
# Ingest webhook secret (n8n → Vercel) — MUST be identical in both places
openssl rand -hex 32

# n8n credential encryption (n8n server only — never change after first start)
openssl rand -hex 32

# Demo auth fallback secret (optional if using Supabase Auth only)
openssl rand -hex 32
```

Save these in a password manager. Label them:

- `EMAIL_INGEST_SECRET`
- `N8N_ENCRYPTION_KEY`
- `AUTH_SESSION_SECRET` (optional)

---

## Phase 3 — Vercel (Next.js app)

### Step 3.1 — Connect repository

1. [vercel.com/new](https://vercel.com/new) → Import GitHub repo
2. Framework: **Next.js** (auto-detected)
3. Do **not** deploy yet — set env vars first

### Step 3.2 — Production environment variables

**Settings → Environment Variables → Production:**

| Variable | Value | Notes |
|----------|-------|-------|
| `NEXT_PUBLIC_APP_URL` | `https://expresswaylogistic.com` | Your production domain |
| `SUPABASE_URL` | `https://xxxxx.supabase.co` | From Supabase dashboard |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJ...` | **Server only** — never expose client-side |
| `NEXT_PUBLIC_SUPABASE_URL` | Same as `SUPABASE_URL` | For staff login |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | From Supabase → Settings → API | For staff login |
| `EMAIL_INGEST_SECRET` | *(from Phase 2)* | Same value as n8n server |
| `RESEND_API_KEY` | *(optional)* | Lead + quote emails |
| `LEAD_NOTIFY_EMAIL` | `sales@expresswaylogistics.com` | |
| `LEAD_NOTIFY_FROM` | `ExpressWay Logistic <noreply@...>` | |
| `QUOTE_EMAIL_FROM` | `ExpressWay Logistic <quotes@...>` | Verified domain required |
| `QUOTE_EMAIL_REPLY_TO` | `sales@expresswaylogistics.com` | |
| `CONTACT_WEBHOOK_URL` | *(optional)* | Other n8n webhooks for leads |

### Step 3.3 — Deploy

```bash
# Or push to main — Vercel auto-deploys
git push origin main
```

Wait for build to succeed.

### Step 3.4 — Custom domain

1. Vercel → Project → **Domains**
2. Add `expresswaylogistic.com` (+ `www` if needed)
3. Update DNS at your registrar (Vercel shows records)

### Step 3.5 — Verify app

```bash
curl -s -o /dev/null -w "%{http_code}" https://expresswaylogistic.com/api/health
# Expect: 200

curl -s -o /dev/null -w "%{http_code}" https://expresswaylogistic.com/command-center
# Expect: 307/302 → login (protected)
```

### Step 3.6 — Verify ingest endpoint (no auth = rejected)

```bash
curl -s -X POST https://expresswaylogistic.com/api/email-intelligence/ingest \
  -H "Content-Type: application/json" \
  -d '{}'
# Expect: {"success":false,"error":"Unauthorized"} with status 401
```

If you get `503` → `EMAIL_INGEST_SECRET` is missing on Vercel. Add it and redeploy.

---

## Phase 4 — n8n server (email pipeline)

n8n must run **24/7** on a server — not on Vercel, not on your laptop.

### Option A — VPS + Docker (recommended)

**Requirements:** Ubuntu 22/24, 2 GB RAM, Docker installed.

#### Step 4.1 — Provision server

Examples: DigitalOcean Droplet, Hetzner CX22, AWS EC2 t3.small.

#### Step 4.2 — Install Docker

```bash
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
# Log out and back in
```

#### Step 4.3 — Copy project files to server

On the server:

```bash
mkdir -p ~/expressway-n8n && cd ~/expressway-n8n
```

Copy these from your repo:

- `docker-compose.n8n.prod.yml`
- `.env.n8n.production.example` → rename to `.env.n8n`

#### Step 4.4 — Configure `.env.n8n`

```bash
cp .env.n8n.production.example .env.n8n
nano .env.n8n
```

Fill in:

```bash
N8N_HOST=n8n.expresswaylogistic.com          # your n8n subdomain
N8N_ENCRYPTION_KEY=<from Phase 2>
EMAIL_INGEST_SECRET=<same as Vercel>
EXPRESSWAY_APP_URL=https://expresswaylogistic.com
OPENAI_API_KEY=sk-...
```

#### Step 4.5 — DNS for n8n

Add an **A record**:

```
n8n.expresswaylogistic.com → <your-server-ip>
```

#### Step 4.6 — Start n8n

```bash
docker compose -f docker-compose.n8n.prod.yml up -d
docker compose -f docker-compose.n8n.prod.yml logs -f n8n
```

Wait for: `Editor is now accessible`

#### Step 4.7 — HTTPS with Caddy (recommended)

Install Caddy on the VPS:

```bash
sudo apt install -y caddy
```

Create `/etc/caddy/Caddyfile`:

```
n8n.expresswaylogistic.com {
    reverse_proxy localhost:5678
}
```

```bash
sudo systemctl reload caddy
```

Open **https://n8n.expresswaylogistic.com** and create your **owner account**.

Update `.env.n8n`:

```bash
N8N_PROTOCOL=https
WEBHOOK_URL=https://n8n.expresswaylogistic.com/
```

Restart n8n:

```bash
docker compose -f docker-compose.n8n.prod.yml up -d --force-recreate
```

### Option B — n8n Cloud

1. Sign up at [n8n.io/cloud](https://n8n.io/cloud)
2. Settings → **Variables**:
   - `EXPRESSWAY_APP_URL` = `https://expresswaylogistic.com`
   - `EMAIL_INGEST_SECRET` = *(same as Vercel)*
3. Settings → **Environment** → allow `$env` access (or use n8n Cloud env vars)
4. Skip Docker/Caddy steps — use their hosted URL

---

## Phase 5 — Import & configure workflow

### Step 5.1 — Import workflow

1. Open n8n UI (https://n8n.expresswaylogistic.com or n8n Cloud)
2. **Workflows → Import from File**
3. Choose one:
   - `n8n/expressway-email-intelligence.workflow.json` (4 Gmail accounts)
   - `n8n/expressway-email-intelligence-imap.workflow.json` (single IMAP inbox)
   - `n8n/expressway-email-intelligence-rediffmail.workflow.json` (Rediffmail Pro)

### Step 5.2 — Connect OpenAI

1. Click **OpenAI Classify & Extract** node
2. **Credential → Create → OpenAI API**
3. Paste `OPENAI_API_KEY`
4. Save

### Step 5.3 — Connect email accounts

**Gmail (4-account workflow):**

For each **Gmail — *** trigger:

1. Create **Gmail OAuth2** credential
2. Requires [Google Cloud Console](https://console.cloud.google.com):
   - Enable **Gmail API**
   - OAuth consent screen (External → add test users or publish)
   - Credentials → OAuth Client ID → Web application
   - Redirect URI: `https://n8n.expresswaylogistic.com/rest/oauth2-credential/callback`
     (or n8n Cloud callback URL shown in credential setup)
3. Connect each of the 4 inboxes

**IMAP (simpler test):**

- Host: `imap.gmail.com`, port `993`, SSL on
- Use [Google App Password](https://myaccount.google.com/apppasswords) if 2FA enabled

### Step 5.4 — Update source account labels

In each **Account — *** Set node, set `sourceAccount` to the real inbox address.

### Step 5.5 — Activate workflow

Toggle **Active** (top right). Confirm status shows **Active**.

---

## Phase 6 — End-to-end test

### Step 6.1 — Manual ingest test (production API)

From your machine:

```bash
export EMAIL_INGEST_SECRET="your-secret"
export APP_URL="https://expresswaylogistic.com"

curl -X POST "$APP_URL/api/email-intelligence/ingest" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $EMAIL_INGEST_SECRET" \
  -d '{
    "sourceAccount": "ops@expresswaylogistics.com",
    "externalMessageId": "prod-test-001",
    "senderEmail": "tracking@test.com",
    "subject": "Production ingest test",
    "receivedAt": "2026-08-12T09:00:00Z",
    "category": "shipment",
    "confidence": 0.95,
    "summary": "Production pipeline verification",
    "extractedData": {
      "trackingNo": "PROD-TEST-001",
      "destination": "Dubai",
      "eta": "15 Aug 2026"
    }
  }'
```

Expected: `{"success":true,"data":{"id":"..."},"message":"Email intelligence stored"}`

Or run the repo script:

```bash
EMAIL_INGEST_SECRET=xxx APP_URL=https://expresswaylogistic.com npm run verify:email-intelligence
```

### Step 6.2 — Dashboard check

1. Go to `https://expresswaylogistic.com/login`
2. Sign in with staff credentials (Supabase Auth)
3. Open **Command Center → Email Intelligence**
4. Confirm the test email appears

### Step 6.3 — Live email test

1. Send a real email to one connected inbox (subject: "Test shipment EW-99999")
2. n8n → **Executions** → confirm success (green)
3. Refresh dashboard within 1–2 minutes

---

## Phase 7 — Go-live checklist

### Vercel
- [ ] `EMAIL_INGEST_SECRET` set in Production env
- [ ] Supabase vars set
- [ ] Custom domain live with HTTPS
- [ ] `/api/health` returns 200
- [ ] Staff can log in at `/login`

### Supabase
- [ ] All 4 migrations applied
- [ ] `email_intelligence` table exists
- [ ] Staff user in `staff_profiles`

### n8n
- [ ] Running 24/7 (Docker restart policy or n8n Cloud)
- [ ] HTTPS enabled on n8n UI
- [ ] `EXPRESSWAY_APP_URL` = production domain
- [ ] `EMAIL_INGEST_SECRET` matches Vercel **exactly**
- [ ] OpenAI credential connected
- [ ] All 4 email accounts connected
- [ ] Workflow **Active**
- [ ] Test execution succeeded

### Security
- [ ] `EMAIL_INGEST_SECRET` is 64-char hex (not a guessable password)
- [ ] `N8N_ENCRYPTION_KEY` backed up securely
- [ ] n8n UI not publicly open without owner login (default after setup)
- [ ] Supabase service role key only on Vercel (never in client code)

---

## Operations

### Monitoring

| What | Where |
|------|-------|
| n8n failures | n8n → Executions (filter: Error) |
| Ingest 401/500 | Vercel → Logs → filter `/api/email-intelligence/ingest` |
| Dashboard empty | Supabase → Table Editor → `email_intelligence` |

### Restart n8n (VPS)

```bash
cd ~/expressway-n8n
docker compose -f docker-compose.n8n.prod.yml restart n8n
```

### Rotate ingest secret

1. Generate new secret: `openssl rand -hex 32`
2. Update Vercel env → redeploy
3. Update n8n `.env.n8n` → recreate container
4. Old secret stops working immediately

### Backup n8n

```bash
docker run --rm -v expressway-n8n_n8n_data:/data -v $(pwd):/backup alpine \
  tar czf /backup/n8n-backup-$(date +%F).tar.gz -C /data .
```

---

## Troubleshooting

| Symptom | Cause | Fix |
|---------|-------|-----|
| Ingest 401 | Secret mismatch | Match `EMAIL_INGEST_SECRET` on Vercel and n8n |
| Ingest 503 | Secret missing on Vercel | Add env var, redeploy |
| n8n execution OK, no dashboard data | Wrong `EXPRESSWAY_APP_URL` | Must be `https://expresswaylogistic.com` |
| Gmail trigger silent | OAuth / API not enabled | Google Cloud Gmail API + correct redirect URI |
| Duplicate emails | Same message re-processed | `externalMessageId` should be email Message-ID |
| Staff can't see emails | Not in `staff_profiles` | Run Step 1.3 SQL |

---

## Related docs

- [N8N_SETUP.md](./N8N_SETUP.md) — local development
- [EMAIL_INTELLIGENCE.md](./EMAIL_INTELLIGENCE.md) — architecture & API
- [DEPLOYMENT.md](./DEPLOYMENT.md) — Vercel & CI/CD
- [SUPABASE.md](./SUPABASE.md) — database & auth details
