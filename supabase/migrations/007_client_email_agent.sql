-- Client Email Agent: outbound history + configurable email branding

create type client_email_status as enum (
  'draft',
  'sent',
  'failed'
);

create table client_email_messages (
  id uuid primary key default gen_random_uuid(),
  quote_request_id text references quote_requests (id) on delete set null,
  client_name text,
  client_company text,
  to_recipients text[] not null default '{}',
  cc_recipients text[] not null default '{}',
  bcc_recipients text[] not null default '{}',
  subject text not null,
  body_text text not null,
  body_html text not null,
  prompt text,
  status client_email_status not null default 'draft',
  provider_message_id text,
  error_message text,
  sent_by text,
  sent_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index client_email_messages_quote_idx
  on client_email_messages (quote_request_id);

create index client_email_messages_created_at_idx
  on client_email_messages (created_at desc);

create index client_email_messages_status_idx
  on client_email_messages (status);

create trigger client_email_messages_set_updated_at
  before update on client_email_messages
  for each row
  execute function set_updated_at();

create table email_branding_settings (
  id text primary key default 'default',
  company_name text not null,
  tagline text,
  website_url text,
  contact_email text,
  contact_phone text,
  contact_address text,
  logo_url text,
  signature_html text,
  updated_at timestamptz not null default now(),
  updated_by text
);

create trigger email_branding_settings_set_updated_at
  before update on email_branding_settings
  for each row
  execute function set_updated_at();

alter table client_email_messages enable row level security;
alter table email_branding_settings enable row level security;

create policy client_email_messages_staff_select
  on client_email_messages for select to authenticated
  using (public.is_staff());

create policy client_email_messages_staff_insert
  on client_email_messages for insert to authenticated
  with check (public.is_staff());

create policy client_email_messages_staff_update
  on client_email_messages for update to authenticated
  using (public.is_staff());

create policy email_branding_settings_staff_select
  on email_branding_settings for select to authenticated
  using (public.is_staff());

create policy email_branding_settings_staff_upsert
  on email_branding_settings for all to authenticated
  using (public.is_staff())
  with check (public.is_staff());

grant select, insert, update, delete on table public.client_email_messages
  to postgres, service_role;
grant select, insert, update on table public.client_email_messages to authenticated;

grant select, insert, update, delete on table public.email_branding_settings
  to postgres, service_role;
grant select, insert, update on table public.email_branding_settings to authenticated;

grant usage on type public.client_email_status
  to postgres, anon, authenticated, service_role;
