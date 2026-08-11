-- Phase 1: quote requests + appointments (lead intake)
-- Run in Supabase SQL Editor or via Supabase CLI: supabase db push

create type quote_request_status as enum (
  'New',
  'In Review',
  'Quoted',
  'Won',
  'Closed'
);

create type quote_request_source as enum (
  'contact_form',
  'quote_wizard',
  'voice_agent'
);

create type appointment_source as enum (
  'form',
  'voice_agent'
);

create type appointment_status as enum (
  'pending',
  'confirmed',
  'completed',
  'cancelled'
);

create table quote_requests (
  id text primary key,
  source quote_request_source not null,
  status quote_request_status not null default 'New',
  name text not null,
  company text not null,
  company_address text,
  email text not null,
  phone text,
  origin text not null,
  destination text not null,
  service_type text,
  product_type text,
  total_packages integer,
  approx_weight text,
  container_size text,
  container_type text,
  value_inr numeric(14, 2),
  message text not null default '',
  payload jsonb not null default '{}'::jsonb,
  internal_notes text,
  quoted_amount text,
  submitted_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table appointments (
  id text primary key,
  source appointment_source not null default 'form',
  status appointment_status not null default 'pending',
  name text not null,
  company text not null,
  email text not null,
  phone text not null,
  appointment_type text not null,
  preferred_date date not null,
  preferred_time text not null,
  meeting_mode text not null,
  notes text,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index quote_requests_submitted_at_idx
  on quote_requests (submitted_at desc);

create index quote_requests_status_idx
  on quote_requests (status);

create index appointments_preferred_date_idx
  on appointments (preferred_date desc);

create index appointments_created_at_idx
  on appointments (created_at desc);

create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger quote_requests_set_updated_at
  before update on quote_requests
  for each row
  execute function set_updated_at();

create trigger appointments_set_updated_at
  before update on appointments
  for each row
  execute function set_updated_at();

-- RLS enabled for future auth phases; service role bypasses RLS from API routes.
alter table quote_requests enable row level security;
alter table appointments enable row level security;

-- API grants (tables created via SQL do not inherit Supabase dashboard defaults).
grant usage on schema public to postgres, anon, authenticated, service_role;

grant select, insert, update, delete on table public.quote_requests
  to postgres, service_role;

grant select, insert, update, delete on table public.appointments
  to postgres, service_role;

grant usage on type public.quote_request_status to postgres, anon, authenticated, service_role;
grant usage on type public.quote_request_source to postgres, anon, authenticated, service_role;
grant usage on type public.appointment_source to postgres, anon, authenticated, service_role;
grant usage on type public.appointment_status to postgres, anon, authenticated, service_role;
