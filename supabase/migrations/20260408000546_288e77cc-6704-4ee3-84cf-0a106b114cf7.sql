create table public.lead_stage_overrides (
  lead_id text not null,
  stage text not null,
  updated_at timestamptz not null default now(),
  primary key (lead_id)
);

alter table public.lead_stage_overrides enable row level security;

create policy "Authenticated users can manage lead stages"
  on public.lead_stage_overrides
  for all
  to authenticated
  using (true)
  with check (true);