
create table public.campaigns (
  id uuid primary key default gen_random_uuid(),
  strategy_id uuid not null references public.strategies(id) on delete cascade,
  edge_source text not null,
  edge_target text not null,
  name text not null,
  type text not null check (type in ('automatizada', 'manual')),
  channel text not null check (channel in ('whatsapp', 'email', 'sms', 'ligacao', 'evento', 'outro')),
  status text not null default 'rascunho' check (status in ('ativo', 'inativo', 'rascunho')),
  created_at timestamptz not null default now()
);

alter table public.campaigns enable row level security;

create policy "Authenticated users can manage campaigns"
  on public.campaigns
  for all
  to authenticated
  using (true)
  with check (true);

create index campaigns_strategy_edge_idx
  on public.campaigns (strategy_id, edge_source, edge_target);
