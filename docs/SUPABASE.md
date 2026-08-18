# Supabase setup

Supabase powers **lead persistence** (Phase 1) and **Command Center staff login** (Phase 3).

## 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and create a project.
2. Note from **Settings → API**:
   - **Project URL**
   - **anon public** key (browser-safe, used for staff login)
   - **service role** key (server-only — never expose to the browser)

## 2. Run migrations

Open **SQL Editor** in Supabase and run, in order:

```
supabase/migrations/001_phase1_leads.sql
supabase/migrations/002_api_grants.sql
supabase/migrations/003_staff_auth.sql
supabase/migrations/004_email_intelligence.sql
supabase/migrations/006_email_quote_intelligence.sql
```

Or with the Supabase CLI:

```bash
supabase link --project-ref <your-project-ref>
supabase db push
```

| Migration | Creates |
| --- | --- |
| `001_phase1_leads` | `quote_requests`, `appointments` |
| `002_api_grants` | API role grants for service role writes |
| `003_staff_auth` | `staff_profiles`, staff RLS policies |
| `004_email_intelligence` | inbound classified emails |
| `005_quote_management` | quote statuses, forwarders, forwarder requests, quote activity |
| `006_email_quote_intelligence` | email-origin quote drafts, AI review status, email body |

## 3. Configure environment

```bash
cp .env.example .env.local
```

Set:

```env
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

Command Center auth uses the **service role key server-side** (cookie sessions). An anon key is optional and only needed for future browser-side Supabase features.

Restart the dev server after changing env vars.

## 4. Create a staff user (Command Center)

**Option A — bootstrap script (recommended):**

```bash
node scripts/bootstrap-staff.mjs
```

This creates a Supabase Auth user from `AUTH_EMAIL` / `AUTH_PASSWORD` in `.env.local` and links a `staff_profiles` row.

**Option B — manual setup:**

1. Supabase Dashboard → **Authentication → Users → Add user**
   - Email: e.g. `ops@expresswaylogistic.com`
   - Password: choose a secure password
   - Enable **Auto confirm user**
2. Copy the new user's **UUID** from the users table.
3. SQL Editor:

```sql
insert into staff_profiles (user_id, email, full_name, role)
values (
  '<auth-user-uuid>',
  'ops@expresswaylogistic.com',
  'Ops Team',
  'admin'
);
```

Only users with a `staff_profiles` row can sign in to `/command-center`.

## 5. Verify

1. `GET /api/health` → `"supabase": "configured"`, `"auth": "supabase"`
2. Sign in at `/login` with the staff user you created
3. Submit a quote at `/quote` — row appears in Supabase **Table Editor**
4. Command Center → **Quotes** — list from Supabase

## Behavior without Supabase

If `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` are missing, Command Center falls back to demo auth:

- `AUTH_EMAIL` / `AUTH_PASSWORD` (defaults: `ops@expresswaylogistic.com` / `expressway`)

Lead persistence still requires `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY`.

## Security notes

- Public form POST routes use the **service role** (bypasses RLS)
- Command Center reads use the **staff session** (RLS enforced)
- Only users in `staff_profiles` can access protected routes
- Never expose the service role key in client bundles

## Next phases

| Phase | Scope |
| --- | --- |
| **2** | Shipments, tracking events, calendar → Supabase |
| **4** | Storage (AWB/BL docs), Realtime dashboard |
