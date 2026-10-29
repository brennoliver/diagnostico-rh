# RH com Propósito — sistema da Cristiele

Site estático (HTML + JavaScript puro, sem build) publicado na Vercel. Os dados ficam no Supabase.

- **Entrada (`/`)**: login da consultora. Tudo de gestão fica atrás desse login.
- **Formulários compartilhados**: abrem sem senha, pelo link que a Cristiele envia. Só conseguem *enviar* respostas.
- **Materiais para participantes** (apostila e "Líderes que Inspiram"): abertos por link.

## Estrutura

```
index.html                Login (com "esqueci minha senha")
app/                      Área da consultora (login obrigatório)
  index.html  core.js  telas.js  eventos.js
                          Início · Clientes · Eventos · Formulários · Respostas ·
                          Satisfação · Programa · Materiais · Minha conta
  guia.html               Guia do consultor: mapa de condução, manual e checklists
f/index.html              Página única que exibe qualquer formulário: f/?f=<id>&empresa=<nome>
r/<id>.html               Links curtos enviados ao cliente (prévia no WhatsApp) → f/
direcao.html, gestores.html, colaboradores.html
                          Links curtos antigos, já enviados a clientes → f/
materiais/                Apostila e material de leitura (públicos)
apresentacoes/            Slides (login obrigatório)
js/config.js              Chaves públicas, nome da consultora, lista de materiais
js/formularios.js         Catálogo de formulários (perguntas, opções, textos)
js/formularios-rs.js      Módulos de Recrutamento & Seleção
js/form-engine.js         Desenha os formulários, valida, grava e resume respostas
js/api.js  js/auth.js     Acesso ao Supabase e login
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

## Banco de dados (Supabase)

- `responses`: todas as respostas. O público só insere; ler, editar e apagar exige login de um e-mail em `admin_users` (RLS).
- `clientes`: cadastro de clientes. As respostas são ligadas ao cliente pelo nome da empresa e pelas *outras grafias* cadastradas (sem diferenciar maiúsculas e acentos).
- `programa_dados`: progresso do Programa e avaliação da comunicação, por cliente.
- `eventos`: palestras e encontros (data, local, formulários do evento, presença marcada no dia e participantes incluídos à mão). Respostas enviadas pelo link de um evento levam `?evento=<id>` e ficam com `responses.evento_id`; respostas antigas podem ser vinculadas pela página do evento.
- `empresas`, `contagem_secoes`, `respostas_detalhadas`: views para relatórios em SQL.

Migrações em `supabase/` (rodar em ordem no SQL Editor; podem ser repetidas):
1. `001_seguranca.sql`: políticas de acesso, administradoras, views.
2. `002_clientes.sql`: tabela de clientes.
3. `003_eventos.sql`: eventos e a coluna `evento_id` nas respostas.

**Administradora nova**: crie o usuário em Authentication → Users e rode
`insert into admin_users (email) values ('email@exemplo.com');`

**Esqueci minha senha**: em Authentication → URL Configuration, o *Site URL* precisa ser o endereço do site, para o link do e-mail voltar para cá.

## Publicar

A Vercel está ligada ao repositório no GitHub: tudo o que entra no branch `master` vai para o ar sozinho em cerca de um minuto. Outros branches geram só uma prévia.

Os endereços antigos (`admin.html`, `diagnostico.html?dl=…`, `eventos/…`, `ferramentas/…`) são redirecionados pelo `vercel.json`.

## Rodar localmente

```
python -m http.server 8000
```

Abra http://localhost:8000. A cópia local usa o Supabase de verdade: respostas enviadas localmente são gravadas no banco real. Os redirecionamentos do `vercel.json` só funcionam na Vercel.
