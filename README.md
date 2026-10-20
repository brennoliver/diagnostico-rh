# RH com Propósito — Portal de Ferramentas

Site estático (HTML + JS puro, sem build) publicado na Vercel. As respostas de todos os formulários vão para a tabela `responses` do Supabase; uma cópia segue por e-mail via Web3Forms.

## Estrutura

```
index.html                 Portal (cards para todas as ferramentas)
admin/
  index.html               Painel geral: todas as respostas, Mapa de Condução, Manual   (login)
  programa.html            Painel do Programa por empresa: Seção 4, relatório,
                           cartilha e progresso                                       (login)
programa/                  Programa Construindo Juntos
  index.html               Capa, sub-seleção do diagnóstico e telas das etapas
  questionario.html        ?secao=direcao|gestores|colaboradores                      (senha)
  identidade.html          Seção 4 — Identidade Organizacional                         (senha)
  cartilha.html            Seção 5 — Cartilha de Cultura                               (senha)
  pre-diagnostico.html     Formulário enviado antes das entrevistas
  questionarios-rhcp.html  Questionários RHCP (direção, gestores, colaboradores)
  acesso.js / programa.css Identificação da empresa + senha; estilos do Programa
eventos/                   confirmacao, pre-palestra-executivo, pesquisa-experiencia,
                           questionario (Questionário de Palestra)
ferramentas/               pdi, recrutamento, apostila
apresentacoes/             lideres, *-slides
direcao.html, gestores.html, colaboradores.html
                           Links curtos enviados aos clientes (prévia no WhatsApp) que
                           redirecionam para programa/questionario.html
js/config.js               URL e chave do Supabase, chave do Web3Forms, lista de seções
js/api.js                  RH.salvarResposta, RH.enviarEmail, RH.verificarCodigo, RH.esc…
js/auth.js                 Login da consultora (Supabase Auth)
js/cartilha.js             Gerador da Cartilha de Cultura
css/base.css               Cores da marca (--rh-*)
supabase/001_seguranca.sql Políticas de acesso, tabelas e views (não é publicado)
vercel.json                Redirecionamentos das URLs antigas + cabeçalhos
```

## Segurança

- O navegador **só consegue inserir** respostas. Ler, editar e apagar exige login de um e-mail listado em `admin_users`. Isso é garantido pelo RLS do Supabase, não pelo código das páginas.
- As senhas dos questionários ficam na tabela `codigos_acesso`, conferidas pela função `verificar_codigo`. Não ficam no código.
- A chave do Supabase e a do Web3Forms em `js/config.js` são públicas por natureza.

## Implantação (nesta ordem)

1. **Supabase → Authentication → Users → Add user**: crie o usuário da consultora (e-mail + senha).
2. **Supabase → Authentication → Sign In / Providers**: desative "Allow new users to sign up".
3. Edite `supabase/001_seguranca.sql` só no SQL Editor (não faça commit dos valores): coloque o e-mail da consultora no bloco `admin_users` e rode o arquivo inteiro.
4. Ainda no SQL Editor, defina as senhas que serão passadas aos clientes:
   ```sql
   update codigos_acesso set codigo = 'nova-senha' where chave = 'direcao';
   -- chaves: direcao, gestores, colaboradores, identidade, cartilha, rs_gestor
   ```
5. Só então publique o site (merge/push → Vercel).

Se o site for publicado antes do passo 3, os questionários com senha e o login do admin não funcionam até o SQL ser aplicado.

## Adicionar um formulário novo

1. Grave com `RH.salvarResposta({ section: 'minha_secao', company, nome, cargo_setor, r1: { ...dados } })`. O `r1` pode ser um objeto: ele é salvo como JSON.
2. Acrescente `{ id: 'minha_secao', icone, grupo, titulo }` em `RH_CONFIG.secoes` (`js/config.js`). O card e a contagem aparecem no admin automaticamente.
3. O nome da seção deve seguir `^[a-z0-9_]{1,40}$` (exigência da política de inserção).

## Relatórios em SQL

```sql
select * from empresas order by ultima_resposta desc;
select nome, dados ->> 'q8_nps' as nps from respostas_detalhadas where section = 'pesquisa_experiencia';
```

## Rodar localmente

```
python -m http.server 8000
```
Abra http://localhost:8000. Os redirecionamentos do `vercel.json` só funcionam na Vercel.
