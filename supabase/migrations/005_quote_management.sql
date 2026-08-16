-- Quote management: expanded statuses, quotation fields, forwarders, tracking, audit.

alter type quote_request_status rename to quote_request_status_old;

create type quote_request_status as enum (
  'New',
  'Under Review',
  'Sent to Forwarders',
  'Awaiting Forwarder Quotes',
  'Quote Received',
  'Quoted',
  'Quote Ready / Email Failed',
  'Accepted',
  'Rejected',
  'Expired'
);

alter table quote_requests alter column status drop default;

alter table quote_requests
  alter column status type quote_request_status
  using (
    case status::text
      when 'In Review' then 'Under Review'
      when 'Won' then 'Accepted'
      when 'Closed' then 'Rejected'
      else status::text
    end
  )::quote_request_status;

alter table quote_requests
  alter column status set default 'New';

drop type quote_request_status_old;

alter table quote_requests
  add column if not exists pickup_location text,
  add column if not exists delivery_location text,
  add column if not exists required_delivery_date date,
  add column if not exists additional_requirements text,
  add column if not exists currency text not null default 'INR',
  add column if not exists additional_charges numeric(14, 2),
  add column if not exists discount numeric(14, 2),
  add column if not exists quote_validity text,
  add column if not exists quote_sent_at timestamptz,
  add column if not exists quote_sent_to text,
  add column if not exists quote_sent_by text,
  add column if not exists assigned_to text,
  add column if not exists forwarder_cost numeric(14, 2),
  add column if not exists margin numeric(14, 2),
  add column if not exists selected_forwarder_id uuid;

create type forwarder_status as enum ('Active', 'Inactive');

create type quote_forwarder_request_status as enum (
  'Pending',
  'Sent',
  'Delivered',
  'Awaiting Response',
  'Quote Received',
  'No Response',
  'Declined'
);

create table forwarders (
  id uuid primary key default gen_random_uuid(),
  company_name text not null,
  contact_person text,
  email text not null,
  phone text,
  address text,
  country text,
  service_types text[] not null default '{}',
  origin_locations text[] not null default '{}',
  destination_locations text[] not null default '{}',
  preferred_routes text,
  notes text,
  status forwarder_status not null default 'Active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index forwarders_status_idx on forwarders (status);
create index forwarders_company_name_idx on forwarders (company_name);

create trigger forwarders_set_updated_at
  before update on forwarders
  for each row
  execute function set_updated_at();

create table quote_forwarder_requests (
  id uuid primary key default gen_random_uuid(),
  quote_request_id text not null references quote_requests (id) on delete cascade,
  forwarder_id uuid not null references forwarders (id) on delete restrict,
  status quote_forwarder_request_status not null default 'Pending',
  sent_at timestamptz,
  response_at timestamptz,
  response_deadline timestamptz,
  quotation_amount numeric(14, 2),
  currency text not null default 'INR',
  shipping_charges numeric(14, 2),
  additional_charges numeric(14, 2),
  transit_time text,
  validity text,
  carrier text,
  notes text,
  attachments jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (quote_request_id, forwarder_id)
);

create index quote_forwarder_requests_quote_idx
  on quote_forwarder_requests (quote_request_id);

create trigger quote_forwarder_requests_set_updated_at
  before update on quote_forwarder_requests
  for each row
  execute function set_updated_at();

alter table quote_requests
  add constraint quote_requests_selected_forwarder_fk
  foreign key (selected_forwarder_id) references forwarders (id);

create table quote_activity (
  id uuid primary key default gen_random_uuid(),
  quote_request_id text not null references quote_requests (id) on delete cascade,
  action text not null,
  message text not null,
  actor text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index quote_activity_quote_idx
  on quote_activity (quote_request_id, created_at desc);

alter table forwarders enable row level security;
alter table quote_forwarder_requests enable row level security;
alter table quote_activity enable row level security;

create policy forwarders_staff_select
  on forwarders for select to authenticated using (public.is_staff());
create policy forwarders_staff_write
  on forwarders for all to authenticated using (public.is_staff()) with check (public.is_staff());

create policy quote_forwarder_requests_staff_select
  on quote_forwarder_requests for select to authenticated using (public.is_staff());
create policy quote_forwarder_requests_staff_write
  on quote_forwarder_requests for all to authenticated using (public.is_staff()) with check (public.is_staff());

create policy quote_activity_staff_select
  on quote_activity for select to authenticated using (public.is_staff());
create policy quote_activity_staff_insert
  on quote_activity for insert to authenticated with check (public.is_staff());

grant select, insert, update, delete on table public.forwarders to service_role;
grant select, insert, update, delete on table public.quote_forwarder_requests to service_role;
grant select, insert, update, delete on table public.quote_activity to service_role;

grant select, insert, update on table public.forwarders to authenticated;
grant select, insert, update on table public.quote_forwarder_requests to authenticated;
grant select, insert on table public.quote_activity to authenticated;

grant usage on type public.quote_request_status to postgres, anon, authenticated, service_role;
grant usage on type public.forwarder_status to postgres, anon, authenticated, service_role;
grant usage on type public.quote_forwarder_request_status to postgres, anon, authenticated, service_role;
