// Gera r/<formulário>.html: links curtos enviados aos clientes.
// Cada atalho tem as meta tags da prévia (WhatsApp, e-mail) e
// redireciona para f/?f=<formulário>, mantendo ?empresa=.
//
// Rode depois de criar ou renomear um formulário:
//   node tools/gerar-atalhos.mjs
import { readFileSync, writeFileSync, mkdirSync, readdirSync, unlinkSync } from 'node:fs';
import vm from 'node:vm';

const ctx = { window: {} };
vm.createContext(ctx);
for (const f of ['js/formularios.js', 'js/formularios-rs.js']) vm.runInContext(readFileSync(f, 'utf8'), ctx);

const esc = s => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
mkdirSync('r', { recursive: true });
for (const f of readdirSync('r')) if (f.endsWith('.html')) unlinkSync('r/' + f);

let n = 0;
for (const form of ctx.window.RH_FORMULARIOS) {
  if (form.interno) continue;
  const titulo = (form.tituloPublico || form.titulo) + ' — RH com Propósito';
  const desc = (form.descricao || form.intro || '').replace(/\s+/g, ' ').slice(0, 180);
  const alvo = `../f/?f=${form.id}`;
  writeFileSync(`r/${form.id}.html`, `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="robots" content="noindex, nofollow">
<title>${esc(titulo)}</title>
<meta name="description" content="${esc(desc)}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="RH com Propósito">
<meta property="og:title" content="${esc(titulo)}">
<meta property="og:description" content="${esc(desc)}">
<meta name="twitter:card" content="summary">
<meta name="twitter:title" content="${esc(titulo)}">
<meta name="twitter:description" content="${esc(desc)}">
<!-- Gerado por tools/gerar-atalhos.mjs -->
<meta http-equiv="refresh" content="0; url=${alvo}">
<script>location.replace('${alvo}' + (location.search ? '&' + location.search.slice(1) : '') + location.hash);</script>
</head>
<body style="font-family:sans-serif;text-align:center;padding:60px 20px;color:#13241B">
<p>Abrindo o formulário… <a href="${alvo}">clique aqui</a> se não abrir.</p>
</body>
</html>
`);
  n++;
}
console.log(`${n} atalhos gerados em r/`);
