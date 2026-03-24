create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create or replace function public.normalize_member_fields()
returns trigger
language plpgsql
as $$
begin
  new.full_name = trim(coalesce(new.full_name, ''));
  new.phone = trim(coalesce(new.phone, ''));
  new.notes = nullif(trim(coalesce(new.notes, '')), '');

  if new.full_name = '' then
    raise exception 'Full name is required';
  end if;

  if new.phone = '' then
    raise exception 'Phone number is required';
  end if;

  return new;
end;
$$;

create table if not exists public.members (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text not null,
  notes text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

drop trigger if exists members_normalize_fields on public.members;
create trigger members_normalize_fields
before insert or update on public.members
for each row
execute function public.normalize_member_fields();

drop trigger if exists members_set_updated_at on public.members;
create trigger members_set_updated_at
before update on public.members
for each row
execute function public.set_updated_at();

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.members(id) on delete cascade,
  amount numeric(10, 2) not null default 200,
  payment_date date not null,
  expiry_date date not null,
  created_at timestamptz not null default timezone('utc', now()),
  check (amount >= 0),
  check (expiry_date = payment_date + 30)
);

create index if not exists members_full_name_idx on public.members(full_name);
create index if not exists members_phone_idx on public.members(phone);
create index if not exists subscriptions_member_id_idx on public.subscriptions(member_id);
create index if not exists subscriptions_payment_date_idx on public.subscriptions(payment_date desc);

alter table public.members enable row level security;
alter table public.subscriptions enable row level security;

drop policy if exists "Authenticated users can read members" on public.members;
drop policy if exists "Authenticated users can insert members" on public.members;
drop policy if exists "Authenticated users can update members" on public.members;
drop policy if exists "Authenticated users can delete members" on public.members;

create policy "Authenticated users can read members"
on public.members
for select
to authenticated
using (true);

create policy "Authenticated users can insert members"
on public.members
for insert
to authenticated
with check (true);

create policy "Authenticated users can update members"
on public.members
for update
to authenticated
using (true)
with check (true);

create policy "Authenticated users can delete members"
on public.members
for delete
to authenticated
using (true);

drop policy if exists "Authenticated users can read subscriptions" on public.subscriptions;
drop policy if exists "Authenticated users can insert subscriptions" on public.subscriptions;
drop policy if exists "Authenticated users can update subscriptions" on public.subscriptions;
drop policy if exists "Authenticated users can delete subscriptions" on public.subscriptions;

create policy "Authenticated users can read subscriptions"
on public.subscriptions
for select
to authenticated
using (true);

create policy "Authenticated users can insert subscriptions"
on public.subscriptions
for insert
to authenticated
with check (true);

create policy "Authenticated users can update subscriptions"
on public.subscriptions
for update
to authenticated
using (true)
with check (true);

create policy "Authenticated users can delete subscriptions"
on public.subscriptions
for delete
to authenticated
using (true);

create or replace function public.create_member_with_subscription(
  p_full_name text,
  p_phone text,
  p_notes text default null,
  p_payment_date date default current_date
)
returns uuid
language plpgsql
security invoker
set search_path = public
as $$
declare
  new_member_id uuid;
begin
  insert into public.members (full_name, phone, notes)
  values (p_full_name, p_phone, p_notes)
  returning id into new_member_id;

  insert into public.subscriptions (member_id, amount, payment_date, expiry_date)
  values (new_member_id, 200, p_payment_date, p_payment_date + 30);

  return new_member_id;
end;
$$;

create or replace function public.renew_membership(
  p_member_id uuid,
  p_payment_date date default current_date
)
returns uuid
language plpgsql
security invoker
set search_path = public
as $$
declare
  new_subscription_id uuid;
begin
  if not exists (
    select 1
    from public.members
    where id = p_member_id
  ) then
    raise exception 'Member not found';
  end if;

  insert into public.subscriptions (member_id, amount, payment_date, expiry_date)
  values (p_member_id, 200, p_payment_date, p_payment_date + 30)
  returning id into new_subscription_id;

  return new_subscription_id;
end;
$$;

grant execute on function public.create_member_with_subscription(text, text, text, date) to authenticated;
grant execute on function public.renew_membership(uuid, date) to authenticated;
