-- Operational shipments (manual booking + future quote conversion).

create type shipment_status as enum (
  'Processing',
  'In Transit',
  'Customs Hold',
  'Delivered',
  'Delayed'
);

create type booking_basis as enum (
  'po_received',
  'email_ok',
  'payment_received',
  'verbal_ok'
);

create table shipments (
  id text primary key,
  quote_request_id text references quote_requests (id) on delete set null,
  client_company text not null,
  contact_name text not null,
  contact_email text not null,
  contact_phone text,
  origin text not null,
  destination text not null,
  freight_mode text not null,
  status shipment_status not null default 'Processing',
  booking_basis booking_basis not null,
  pickup_location text,
  delivery_location text,
  cargo_ready_date date,
  target_delivery_date date,
  product_type text,
  total_packages integer,
  approx_weight text,
  container_size text,
  container_type text,
  value_inr numeric(14, 2),
  carrier_name text,
  carrier_ref text,
  forwarder_id uuid references forwarders(id) on delete set null,
  estimated_eta timestamptz,
  internal_notes text,
  assigned_to text,
  risk_score integer not null default 15,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index shipments_status_idx on shipments (status);
create index shipments_created_at_idx on shipments (created_at desc);
create index shipments_quote_request_id_idx on shipments (quote_request_id);

grant select, insert, update, delete on table public.shipments
  to postgres, service_role;

grant usage on type public.shipment_status to postgres, anon, authenticated, service_role;
grant usage on type public.booking_basis to postgres, anon, authenticated, service_role;
