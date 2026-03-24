-- Liam's Reward Tracker — Supabase setup
-- Paste this into Supabase SQL Editor and run it

-- Points log table
create table if not exists points_log (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now() not null,
  points int not null,
  label text not null,
  type text not null check (type in ('earn', 'spend'))
);

-- Weekly reset marker table
create table if not exists weekly_reset (
  id uuid default gen_random_uuid() primary key,
  reset_at timestamptz default now() not null
);

-- Enable Row Level Security (open access via anon key for this household app)
alter table points_log enable row level security;
alter table weekly_reset enable row level security;

-- Allow all operations for anonymous users (household app — no auth needed)
create policy "Allow all for anon" on points_log for all using (true) with check (true);
create policy "Allow all for anon" on weekly_reset for all using (true) with check (true);
