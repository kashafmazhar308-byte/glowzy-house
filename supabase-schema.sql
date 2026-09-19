-- Glowzy House admin database
-- Run this in Supabase SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  price numeric(12,2) not null default 0,
  image text not null,
  category text not null default 'general',
  badge text,
  description text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  phone text not null,
  email text,
  address text not null,
  payment_method text not null,
  order_details jsonb not null default '[]'::jsonb,
  total text,
  status text not null default 'New',
  created_at timestamptz not null default now()
);

create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  occasion text not null,
  budget text not null,
  preferred_date date,
  gift_details text not null,
  status text not null default 'New',
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = auth.uid()
  );
$$;

alter table public.admin_users enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.inquiries enable row level security;

drop policy if exists "public can read active products" on public.products;
create policy "public can read active products"
on public.products
for select
to anon, authenticated
using (active = true or public.is_admin());

drop policy if exists "admins manage products" on public.products;
create policy "admins manage products"
on public.products
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "customers can create orders" on public.orders;
create policy "customers can create orders"
on public.orders
for insert
to anon, authenticated
with check (true);

drop policy if exists "admins read orders" on public.orders;
create policy "admins read orders"
on public.orders
for select
to authenticated
using (public.is_admin());

drop policy if exists "admins update orders" on public.orders;
create policy "admins update orders"
on public.orders
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "customers can create inquiries" on public.inquiries;
create policy "customers can create inquiries"
on public.inquiries
for insert
to anon, authenticated
with check (true);

drop policy if exists "admins read inquiries" on public.inquiries;
create policy "admins read inquiries"
on public.inquiries
for select
to authenticated
using (public.is_admin());

drop policy if exists "admins update inquiries" on public.inquiries;
create policy "admins update inquiries"
on public.inquiries
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());
