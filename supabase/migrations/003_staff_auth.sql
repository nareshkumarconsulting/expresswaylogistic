-- Phase 3: Command Center staff auth + RLS for authenticated staff reads/updates

create type staff_role as enum ('admin', 'ops', 'viewer');

create table staff_profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text,
  role staff_role not null default 'ops',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index staff_profiles_email_idx on staff_profiles (email);

create trigger staff_profiles_set_updated_at
  before update on staff_profiles
  for each row
  execute function set_updated_at();

alter table staff_profiles enable row level security;

create policy staff_profiles_select_own
  on staff_profiles
  for select
  to authenticated
  using (user_id = auth.uid());

create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from staff_profiles
    where user_id = auth.uid()
  );
$$;

create policy quote_requests_staff_select
  on quote_requests
  for select
  to authenticated
  using (public.is_staff());

create policy quote_requests_staff_update
  on quote_requests
  for update
  to authenticated
  using (public.is_staff());

create policy appointments_staff_select
  on appointments
  for select
  to authenticated
  using (public.is_staff());

create policy appointments_staff_update
  on appointments
  for update
  to authenticated
  using (public.is_staff());

grant select, update on table public.quote_requests to authenticated;
grant select, update on table public.appointments to authenticated;
grant select, insert, update, delete on table public.staff_profiles to service_role;
grant select on table public.staff_profiles to authenticated;

grant usage on type public.staff_role to postgres, anon, authenticated, service_role;

-- After creating a user in Supabase Auth (Authentication → Users), link them here:
-- insert into staff_profiles (user_id, email, full_name, role)
-- values ('<auth-user-uuid>', 'ops@expresswaylogistic.com', 'Ops Team', 'admin');
