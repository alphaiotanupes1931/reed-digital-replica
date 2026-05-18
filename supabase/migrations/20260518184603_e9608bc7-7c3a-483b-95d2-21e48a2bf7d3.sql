create table if not exists public.tax_reminders (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  amount numeric not null default 0,
  due_date date,
  notes text,
  paid boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.tax_reminders enable row level security;

create policy "Anyone can read tax_reminders" on public.tax_reminders for select using (true);
create policy "Only service role can insert tax_reminders" on public.tax_reminders for insert to service_role with check (true);
create policy "Only service role can update tax_reminders" on public.tax_reminders for update to service_role using (true);
create policy "Only service role can delete tax_reminders" on public.tax_reminders for delete to service_role using (true);

create trigger update_tax_reminders_updated_at before update on public.tax_reminders
  for each row execute function public.update_updated_at_column();