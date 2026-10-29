# RH com Propósito — sistema da Cristiele

Site estático (HTML + JavaScript puro, sem build) publicado na Vercel. Os dados ficam na VPS, em componentes do Supabase (Postgres, login e API).

- **Entrada (`/`)**: login da consultora. Tudo de gestão fica atrás desse login.
- **Formulários compartilhados**: abrem sem senha, pelo link que a Cristiele envia. Só conseguem *enviar* respostas.
- **Materiais para participantes** (apostila e "Líderes que Inspiram"): abertos por link.

## Estrutura

```
index.html                Login (com "esqueci minha senha")
app/                      Área da consultora (login obrigatório)
  index.html  core.js  telas.js  eventos.js
                          Início · Clientes · Eventos · Formulários · Respostas ·
                          Satisfação · Programa · Portfólios · Materiais · Minha conta
  guia.html               Guia do consultor: mapa de condução, manual e checklists
f/index.html              Página única que exibe qualquer formulário: f/?f=<id>&empresa=<nome>
r/<id>.html               Links curtos enviados ao cliente (prévia no WhatsApp) → f/
direcao.html, gestores.html, colaboradores.html
                          Links curtos antigos, já enviados a clientes → f/
portfolios/               Portfólios comerciais (públicos), listados em Portfólios
materiais/                Apostila e material de leitura (públicos)
apresentacoes/            Slides (login obrigatório)
js/config.js              Chaves públicas, nome da consultora, lista de materiais
js/formularios.js         Catálogo de formulários (perguntas, opções, textos)
js/formularios-rs.js      Módulos de Recrutamento & Seleção
js/form-engine.js         Desenha os formulários, valida, grava e resume respostas
js/api.js  js/auth.js     Acesso ao banco e login
js/cartilha.js            Gera a Cartilha de Cultura em HTML para imprimir
css/rh.css                Visual do sistema (claro, verde e dourado da marca)
css/base.css              Cores da marca usadas pelos materiais e slides
supabase/*.sql            Migrações do banco (não são publicadas)
tools/gerar-atalhos.mjs   Recria os links curtos em r/
```

## Formulários

Cada formulário é um objeto em `js/formularios.js`. O mesmo objeto define o que o cliente vê, como a resposta é gravada e como o painel mostra e resume os dados.

**Criar ou mudar um formulário**
1. Edite `js/formularios.js` (veja o comentário no topo do arquivo com os tipos de campo).
2. Rode `node tools/gerar-atalhos.mjs` para criar o link curto em `r/`.
3. Publique. O formulário aparece em **Formulários** e as respostas em **Respostas**, com gráficos automáticos para perguntas de múltipla escolha, escalas e NPS.

Não renomeie o `id` de um formulário nem de um campo que já tenha respostas: é por ele que as respostas antigas são encontradas.

**Campanhas e formulários de interesse.** O molde `interesse({...})` em `js/formularios.js` já traz os dados da empresa, o aviso de privacidade com autorização de contato e a mensagem final. Para uma campanha nova (por exemplo, treinamentos de 2027):
1. Copie o bloco `encerramento_2026`, troque `id` (ex.: `treinamentos_2027`), títulos, texto de apresentação e as `perguntas` do meio.
2. Para a imagem de prévia no WhatsApp/Instagram, acrescente um tipo em `tools/imagem-previa.html`, capture em 1200×630, salve em `img/` e aponte `imagem` no formulário.
3. Rode `node tools/gerar-atalhos.mjs`. Se quiser um link curto (como `/encerramento`), acrescente o redirecionamento no `vercel.json`.

**Partes internas.** Seções ou campos com `interno: true` só aparecem quando a Cristiele abre o formulário logada (botão *Preencher*). Formulários inteiros com `interno: true` não podem ser enviados a clientes.

## Portfólios

Apresentações comerciais que a Cristiele envia para empresas (abrem sem login). Para incluir um novo:
1. Salve o HTML em `portfolios/` (ex.: `portfolios/treinamentos-2027.html`) com as tags `og:` no `<head>`, como em `encerramento-2026.html`.
2. Gere a capa em 1200×630 (o primeiro slide) e salve em `img/portfolios/`.
3. Acrescente o item em `portfolios` no `js/config.js`. Com `formulario`, o envio por WhatsApp/e-mail já leva o link do formulário de interesse.

## Banco de dados (VPS)

Desde 29/10/2026 o banco roda na VPS (`179.236.73.24`, pasta `/opt/rh-db`), e não mais no Supabase em nuvem, que pausava o projeto por inatividade no plano gratuito. São os mesmos componentes do Supabase, sem o painel:

- `db` (Postgres), `auth` (login, GoTrue) e `rest` (API, PostgREST), em `docker compose`.
- Endereço público: `https://rh-api.179-236-73-24.sslip.io`, servido pelo Caddy (`/auth/v1` → login, `/rest/v1` → API).
- Segredos (senha do banco, segredo JWT, chave `service_role`) ficam só em `/opt/rh-db/.env`. A chave em `js/config.js` é a `anon`, pública.
- SQL direto: `cd /opt/rh-db && docker compose exec db psql -U supabase_admin -d postgres`.


- `responses`: todas as respostas. O público só insere; ler, editar e apagar exige login de um e-mail em `admin_users` (RLS).
- `clientes`: cadastro de clientes. As respostas são ligadas ao cliente pelo nome da empresa e pelas *outras grafias* cadastradas (sem diferenciar maiúsculas e acentos).
- `programa_dados`: progresso do Programa e avaliação da comunicação, por cliente.
- `eventos`: palestras e encontros (data, local, formulários do evento, presença marcada no dia e participantes incluídos à mão). Respostas enviadas pelo link de um evento levam `?evento=<id>` e ficam com `responses.evento_id`; respostas antigas podem ser vinculadas pela página do evento.
- `empresas`, `contagem_secoes`, `respostas_detalhadas`: views para relatórios em SQL.

Migrações em `supabase/` (histórico; já aplicadas no banco atual):
1. `001_seguranca.sql`: políticas de acesso, administradoras, views.
2. `002_clientes.sql`: tabela de clientes.
3. `003_eventos.sql`: eventos e a coluna `evento_id` nas respostas.

**Administradora nova** (na VPS, em `/opt/rh-db`):
```sh
. ./.env && curl -s -X POST localhost:9998/admin/users -H "Authorization: Bearer $SERVICE_ROLE_KEY"   -H "Content-Type: application/json" -d '{"email":"email@exemplo.com","password":"...","email_confirm":true}'
docker compose exec db psql -U supabase_admin -d postgres -c "insert into admin_users (email) values ('email@exemplo.com')"
```

**Esqueci minha senha**: o envio de e-mail ainda não está configurado (falta um SMTP nas variáveis `GOTRUE_SMTP_*` do serviço `auth`). Até lá, a troca de senha é feita logada, em *Minha conta*.

## Publicar

Ao mudar arquivos da área (`app/`, `js/`, `css/`), troque o `?v=...` em `app/index.html` para o celular não usar uma versão guardada.

A Vercel está ligada ao repositório no GitHub: tudo o que entra no branch `master` vai para o ar sozinho em cerca de um minuto. Outros branches geram só uma prévia.

Os endereços antigos (`admin.html`, `diagnostico.html?dl=…`, `eventos/…`, `ferramentas/…`) são redirecionados pelo `vercel.json`.

## Rodar localmente

```
python -m http.server 8000
```

Abra http://localhost:8000. A cópia local usa o banco de verdade: respostas enviadas localmente são gravadas no banco real. Os redirecionamentos do `vercel.json` só funcionam na Vercel.
