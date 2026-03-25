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

-- Curriculum Data
create table if not exists curriculum_tasks (
  id uuid default gen_random_uuid() primary key,
  scheduled_date date, -- e.g., '2026-04-08'
  week_number int default 1, -- e.g., week 1 to 10 for Q2
  day_of_week int, -- 0-6 (Sun-Sat) for recurring tasks
  subject text not null,
  title text not null,
  description text,
  interactive_type text, -- 'quiz', 'flashcard', 'reading', 'typing'
  interactive_content jsonb, -- The actual questions or vocabulary words
  created_at timestamptz default now() not null
);

-- Liam's Study Progress
create table if not exists task_progress (
  id uuid default gen_random_uuid() primary key,
  task_id uuid references curriculum_tasks(id) on delete cascade,
  completed_at timestamptz default now() not null,
  score int
);

alter table curriculum_tasks enable row level security;
alter table task_progress enable row level security;

create policy "Allow all for anon" on curriculum_tasks for all using (true) with check (true);
create policy "Allow all for anon" on task_progress for all using (true) with check (true);
