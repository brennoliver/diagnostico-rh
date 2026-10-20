-- ═══════════════════════════════════════════════════════════════════
-- RH com Propósito — Migração 002: cadastro de clientes
-- Rodar depois da 001. Pode ser executada mais de uma vez.
-- ═══════════════════════════════════════════════════════════════════

create table if not exists public.clientes (
  id          uuid primary key default gen_random_uuid(),
  nome        text not null,
  apelidos    text[] not null default '{}',   -- outras grafias do nome usadas nas respostas
  contato     text,
  cargo       text,
  telefone    text,
  email       text,
  cidade      text,
  segmento    text,
  status      text not null default 'ativo' check (status in ('prospect', 'ativo', 'encerrado')),
  observacoes text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create unique index if not exists clientes_nome_unico
  on public.clientes (lower(regexp_replace(trim(nome), '\s+', ' ', 'g')));

alter table public.clientes enable row level security;
drop policy if exists clientes_admin on public.clientes;
create policy clientes_admin on public.clientes
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create or replace function public.clientes_touch() returns trigger
language plpgsql as $$ begin new.updated_at = now(); return new; end $$;
drop trigger if exists clientes_touch on public.clientes;
create trigger clientes_touch before update on public.clientes
  for each row execute function public.clientes_touch();

-- Os códigos de acesso deixaram de ser usados: os formulários compartilhados
-- abrem sem senha e a área da consultora exige login. A tabela e a função
-- ficam no banco (inofensivas) caso seja preciso voltar atrás.
