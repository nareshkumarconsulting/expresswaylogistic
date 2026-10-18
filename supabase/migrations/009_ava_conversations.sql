-- Ava receptionist transcripts for the Command Center.

create type ava_channel as enum ('browser', 'retell');

create type ava_message_role as enum ('user', 'assistant');

create type ava_outcome as enum ('none', 'quote', 'appointment', 'tracking');

create table ava_conversations (
  id uuid primary key default gen_random_uuid(),
  channel ava_channel not null,
  external_id text not null,
  visitor_name text,
  visitor_company text,
  visitor_email text,
  visitor_phone text,
  last_intent text,
  outcome ava_outcome not null default 'none',
  reference_id text,
  preview text not null default '',
  message_count integer not null default 0,
  started_at timestamptz not null default now(),
  last_message_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index ava_conversations_external_idx
  on ava_conversations (channel, external_id);

create index ava_conversations_last_message_at_idx
  on ava_conversations (last_message_at desc);

create table ava_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references ava_conversations (id) on delete cascade,
  role ava_message_role not null,
  content text not null,
  intent text,
  sequence integer not null,
  created_at timestamptz not null default now(),
  unique (conversation_id, sequence)
);

create index ava_messages_conversation_idx
  on ava_messages (conversation_id, sequence);

create trigger ava_conversations_set_updated_at
  before update on ava_conversations
  for each row
  execute function set_updated_at();

alter table ava_conversations enable row level security;
alter table ava_messages enable row level security;

create policy ava_conversations_staff_select
  on ava_conversations
  for select
  to authenticated
  using (public.is_staff());

create policy ava_messages_staff_select
  on ava_messages
  for select
  to authenticated
  using (public.is_staff());

grant select, insert, update, delete on table public.ava_conversations
  to postgres, service_role;

grant select, insert, update, delete on table public.ava_messages
  to postgres, service_role;

grant select on table public.ava_conversations to authenticated;
grant select on table public.ava_messages to authenticated;

grant usage on type public.ava_channel to postgres, anon, authenticated, service_role;
grant usage on type public.ava_message_role to postgres, anon, authenticated, service_role;
grant usage on type public.ava_outcome to postgres, anon, authenticated, service_role;
