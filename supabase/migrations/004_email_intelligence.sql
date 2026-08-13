-- Phase 4: AI Email Intelligence — n8n ingest + Command Center dashboard

create type email_category as enum (
  'shipment',
  'quotation',
  'alert',
  'general'
);

create type email_urgency as enum (
  'low',
  'medium',
  'high',
  'critical'
);

create type email_intelligence_status as enum (
  'new',
  'read',
  'actioned',
  'archived'
);

create table email_intelligence (
  id uuid primary key default gen_random_uuid(),
  source_account text not null,
  external_message_id text,
  sender_email text not null,
  sender_name text,
  subject text not null,
  received_at timestamptz not null,
  category email_category not null,
  confidence numeric(4, 3),
  summary text,
  extracted_data jsonb not null default '{}'::jsonb,
  status email_intelligence_status not null default 'new',
  urgency email_urgency,
  has_attachments boolean not null default false,
  attachment_names text[] not null default '{}',
  processed_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index email_intelligence_category_idx on email_intelligence (category);
create index email_intelligence_status_idx on email_intelligence (status);
create index email_intelligence_received_at_idx on email_intelligence (received_at desc);
create index email_intelligence_source_account_idx on email_intelligence (source_account);

create unique index email_intelligence_dedup_idx
  on email_intelligence (source_account, external_message_id)
  where external_message_id is not null;

create trigger email_intelligence_set_updated_at
  before update on email_intelligence
  for each row
  execute function set_updated_at();

alter table email_intelligence enable row level security;

create policy email_intelligence_staff_select
  on email_intelligence
  for select
  to authenticated
  using (public.is_staff());

create policy email_intelligence_staff_update
  on email_intelligence
  for update
  to authenticated
  using (public.is_staff());

grant select, insert, update, delete on table public.email_intelligence
  to postgres, service_role;

grant select, update on table public.email_intelligence to authenticated;

grant usage on type public.email_category to postgres, anon, authenticated, service_role;
grant usage on type public.email_urgency to postgres, anon, authenticated, service_role;
grant usage on type public.email_intelligence_status to postgres, anon, authenticated, service_role;
