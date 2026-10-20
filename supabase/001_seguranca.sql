-- ═══════════════════════════════════════════════════════════════════
-- RH com Propósito — Migração 001: segurança, login e relatórios
--
-- Como aplicar: Supabase → SQL Editor → cole este arquivo inteiro → Run.
-- O script pode ser executado mais de uma vez sem efeitos colaterais.
--
-- ANTES de rodar, edite os dois blocos marcados com  ✏️  (e-mails das
-- administradoras e códigos de acesso). Não faça commit desses valores.
-- ═══════════════════════════════════════════════════════════════════


-- ───────────────────────────────────────────────────────────────────
-- 1. Administradoras
--    Só os e-mails desta tabela conseguem LER respostas, mesmo que
--    alguém crie uma conta no Supabase Auth do projeto.
-- ───────────────────────────────────────────────────────────────────
create table if not exists public.admin_users (
  email text primary key
);
alter table public.admin_users enable row level security;
-- (sem policies: a tabela fica invisível para o navegador)

-- ✏️ Troque pelo(s) e-mail(s) cadastrado(s) em Authentication → Users
insert into public.admin_users (email) values
  ('EMAIL-DA-CONSULTORA@exemplo.com')
on conflict do nothing;

create or replace function public.is_admin()
returns boolean
language sql stable security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_users
    where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;
grant execute on function public.is_admin() to anon, authenticated;


-- ───────────────────────────────────────────────────────────────────
-- 2. Tabela responses: público só INSERE; só admin LÊ/EDITA/APAGA
-- ───────────────────────────────────────────────────────────────────
alter table public.responses enable row level security;

-- remove todas as policies antigas (inclusive o "SELECT USING (true)")
do $$
declare p record;
begin
  for p in select policyname from pg_policies
           where schemaname = 'public' and tablename = 'responses'
  loop
    execute format('drop policy %I on public.responses', p.policyname);
  end loop;
end $$;

create policy responses_insert_publico on public.responses
  for insert to anon, authenticated
  with check (
    section ~ '^[a-z0-9_]{1,40}$'
    and coalesce(length(company), 0) <= 200
    and coalesce(length(nome), 0) <= 200
    and coalesce(length(r1), 0) + coalesce(length(r2), 0) + coalesce(length(r3), 0)
      + coalesce(length(r4), 0) + coalesce(length(r5), 0) + coalesce(length(r6), 0) <= 200000
  );

create policy responses_admin_select on public.responses
  for select to authenticated using (public.is_admin());

create policy responses_admin_update on public.responses
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

create policy responses_admin_delete on public.responses
  for delete to authenticated using (public.is_admin());

create index if not exists responses_section_created_idx
  on public.responses (section, created_at);


-- ───────────────────────────────────────────────────────────────────
-- 3. Códigos de acesso dos questionários (substituem as senhas que
--    ficavam escritas no código das páginas)
-- ───────────────────────────────────────────────────────────────────
create table if not exists public.codigos_acesso (
  chave  text primary key,
  codigo text not null
);
alter table public.codigos_acesso enable row level security;
-- (sem policies: ninguém lê os códigos pelo navegador)

insert into public.codigos_acesso (chave, codigo) values
  ('direcao',       'defina-um-codigo'),
  ('gestores',      'defina-um-codigo'),
  ('colaboradores', 'defina-um-codigo'),
  ('identidade',    'defina-um-codigo'),
  ('cartilha',      'defina-um-codigo'),
  ('rs_gestor',     'defina-um-codigo')
on conflict (chave) do nothing;

-- ✏️ Defina os códigos que você vai passar aos clientes
--    (descomente, troque os valores e rode só estas linhas):
-- update public.codigos_acesso set codigo = 'NOVO-CODIGO' where chave = 'direcao';
-- update public.codigos_acesso set codigo = 'NOVO-CODIGO' where chave = 'gestores';
-- update public.codigos_acesso set codigo = 'NOVO-CODIGO' where chave = 'colaboradores';
-- update public.codigos_acesso set codigo = 'NOVO-CODIGO' where chave = 'identidade';
-- update public.codigos_acesso set codigo = 'NOVO-CODIGO' where chave = 'cartilha';
-- update public.codigos_acesso set codigo = 'NOVO-CODIGO' where chave = 'rs_gestor';

create or replace function public.verificar_codigo(p_chave text, p_codigo text)
returns boolean
language sql stable security definer
set search_path = public
as $$
  select exists (
    select 1 from public.codigos_acesso
    where chave = p_chave and codigo = trim(p_codigo) and codigo <> 'defina-um-codigo'
  );
$$;
grant execute on function public.verificar_codigo(text, text) to anon, authenticated;


-- ───────────────────────────────────────────────────────────────────
-- 4. Dados do Programa por empresa (progresso, avaliação de
--    comunicação) — antes ficavam só no navegador da consultora
-- ───────────────────────────────────────────────────────────────────
create table if not exists public.programa_dados (
  empresa    text not null,
  chave      text not null,
  valor      jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  primary key (empresa, chave)
);
alter table public.programa_dados enable row level security;

drop policy if exists programa_dados_admin on public.programa_dados;
create policy programa_dados_admin on public.programa_dados
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- percentual geral exibido na capa do Programa (só o número, sem observações)
create or replace function public.progresso_percentual(p_empresa text)
returns integer
language sql stable security definer
set search_path = public
as $$
  select coalesce((valor ->> 'media')::int, 0)
  from public.programa_dados
  where chave = 'progresso'
    and lower(empresa) = lower(regexp_replace(trim(p_empresa), '\s+', ' ', 'g'))
  limit 1;
$$;
grant execute on function public.progresso_percentual(text) to anon, authenticated;


-- ───────────────────────────────────────────────────────────────────
-- 5. Views para relatórios em SQL (respeitam o RLS de quem consulta)
-- ───────────────────────────────────────────────────────────────────
create or replace function public.try_jsonb(t text)
returns jsonb
language plpgsql immutable
as $$
begin
  if t is null or t !~ '^\s*[\{\[]' then return null; end if;
  return t::jsonb;
exception when others then
  return null;
end $$;

create or replace view public.respostas_detalhadas
with (security_invoker = true) as
select
  id, section, company,
  lower(regexp_replace(trim(coalesce(company, '')), '\s+', ' ', 'g')) as empresa_normalizada,
  nome, cargo_setor, data_resposta, created_at,
  public.try_jsonb(r1) as dados,
  r1, r2, r3, r4, r5, r6
from public.responses;

create or replace view public.empresas
with (security_invoker = true) as
select
  empresa_normalizada,
  min(company)    as nome_exibicao,
  count(*)        as respostas,
  max(created_at) as ultima_resposta
from public.respostas_detalhadas
where empresa_normalizada <> ''
group by empresa_normalizada;

create or replace view public.contagem_secoes
with (security_invoker = true) as
select section, count(*)::int as total
from public.responses
group by section;

-- Exemplos:
--   select * from empresas order by ultima_resposta desc;
--   select nome, dados ->> 'q8_nps' as nps from respostas_detalhadas where section = 'pesquisa_experiencia';
