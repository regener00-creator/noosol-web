-- NOOSOL — Supabase schema
-- รันไฟล์นี้ใน Supabase Dashboard > SQL Editor ครั้งเดียว

create table if not exists products (
  code text primary key,
  size text,
  logo_area text,
  style text,
  category text,
  image text,
  retail numeric,
  wholesale jsonb,
  screen1 jsonb,
  screen2 jsonb,
  screen3 jsonb,
  screen4 jsonb,
  sort_order int default 0
);

create table if not exists colors (
  no int primary key,
  name text not null,
  image text
);

create table if not exists faq (
  id serial primary key,
  q text not null,
  a text not null
);

create table if not exists gallery (
  id serial primary key,
  image text not null,
  title text default '',
  created_at timestamptz default now()
);

-- เปิดให้เว็บอ่านข้อมูลได้ (อ่านอย่างเดียว)
alter table products enable row level security;
alter table colors enable row level security;
alter table faq enable row level security;
alter table gallery enable row level security;

create policy "public read products" on products for select using (true);
create policy "public read colors" on colors for select using (true);
create policy "public read faq" on faq for select using (true);
create policy "public read gallery" on gallery for select using (true);
