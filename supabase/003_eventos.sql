-- ═══════════════════════════════════════════════════════════════════
-- RH com Propósito — Migração 003: eventos
-- Rodar depois da 002. Pode ser executada mais de uma vez.
-- ═══════════════════════════════════════════════════════════════════

create table if not exists public.eventos (
  id           uuid primary key default gen_random_uuid(),
  nome         text not null,
  cliente_id   uuid references public.clientes(id) on delete set null,
  data         date,
  horario      text,
  local        text,
  descricao    text,
  status       text not null default 'planejado' check (status in ('planejado', 'realizado', 'cancelado')),
  formularios  text[] not null default '{}',          -- ids dos formulários do evento
  presenca     jsonb  not null default '{}'::jsonb,   -- { "<id da confirmação ou participante>": true }
  participantes jsonb not null default '[]'::jsonb,   -- quem chegou sem confirmar: [{ id, nome, setor }]
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

alter table public.eventos enable row level security;
drop policy if exists eventos_admin on public.eventos;
create policy eventos_admin on public.eventos
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop trigger if exists eventos_touch on public.eventos;
create trigger eventos_touch before update on public.eventos
  for each row execute function public.clientes_touch();

create index if not exists eventos_data_idx on public.eventos (data desc);

-- Cada resposta pode pertencer a um evento (os links enviados pelo
-- evento levam ?evento=<id>). Respostas antigas ficam sem evento até
-- serem vinculadas pela consultora.
alter table public.responses add column if not exists evento_id uuid references public.eventos(id) on delete set null;
create index if not exists responses_evento_idx on public.responses (evento_id);
