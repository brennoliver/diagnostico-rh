// ═══════════════════════════════════════════════════
// Gerador da Cartilha de Cultura (usado em programa/cartilha.html
// e em admin/programa.html)
// ═══════════════════════════════════════════════════
function buildCartilhaHTML(d) {
  const esc = s => (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  const nl2br = s => esc(s||'').replace(/\n/g,'<br>');
  const bullets = s => (s||'').split('\n').filter(l=>l.trim()).map(l=>`<li>${esc(l.trim())}</li>`).join('');
  const empresa      = esc(d.empresa || 'Empresa');
  const segmento     = esc(d.segmento || '');
  const jeitoTit     = esc(d.jeitoTitulo || `O Jeito ${d.empresa || ''} de Atender`);
  const diretorNome  = esc(d.diretorNome || '');
  const diretorCargo = esc(d.diretorCargo || '');

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Cartilha de Cultura Organizacional — ${empresa}</title>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Lato:wght@300;400;700;900&display=swap" rel="stylesheet">
<style>
:root{--green:#1A5C45;--gold:#C89B3C;--cream:#F8F5F0;--text:#1e2d24}
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Lato',sans-serif;background:#d8d8d8;color:var(--text)}
.page{width:210mm;min-height:297mm;margin:0 auto 24px;background:#fff;position:relative;overflow:hidden;box-shadow:0 4px 32px rgba(0,0,0,.18)}
/* ── COVER ── */
.cover{background:var(--green);min-height:297mm;display:flex;flex-direction:column;justify-content:space-between;padding:0}
.cover-top{padding:52px 52px 0;flex:1;display:flex;flex-direction:column;justify-content:center}
.cover-eyebrow{font-size:11px;letter-spacing:3px;text-transform:uppercase;color:rgba(248,245,240,.6);margin-bottom:28px;font-weight:700}
.cover-empresa{font-family:'Playfair Display',serif;font-size:52px;font-weight:700;color:#fff;line-height:1.1;margin-bottom:16px}
.cover-segmento{font-size:15px;color:rgba(248,245,240,.7);letter-spacing:.5px}
.cover-bar{height:4px;background:var(--gold);width:80px;margin:32px 0}
.cover-title{font-size:16px;color:var(--gold);letter-spacing:2px;text-transform:uppercase;font-weight:700}
.cover-footer{padding:44px 52px;display:flex;justify-content:space-between;align-items:flex-end;border-top:1px solid rgba(255,255,255,.1)}
.rh-brand{font-size:10px;letter-spacing:3px;text-transform:uppercase;color:rgba(248,245,240,.45);font-weight:700}
.cover-year{font-size:12px;color:rgba(248,245,240,.3)}
/* ── INTERIOR PAGES ── */
.interior{min-height:297mm;display:flex;flex-direction:column}
.page-header{background:var(--green);padding:36px 52px 30px;position:relative}
.page-header::after{content:'';position:absolute;bottom:0;left:0;right:0;height:4px;background:var(--gold)}
.page-header-num{font-size:10px;letter-spacing:3px;text-transform:uppercase;color:rgba(248,245,240,.5);margin-bottom:8px;font-weight:700}
.page-header h2{font-family:'Playfair Display',serif;font-size:30px;color:#fff;font-weight:600}
.page-body{padding:44px 52px;flex:1}
.page-body p{font-size:15px;line-height:1.85;color:#333;margin-bottom:16px}
.page-body ul{padding-left:20px;margin-top:8px}
.page-body ul li{font-size:15px;line-height:1.8;color:#333;margin-bottom:6px}
.page-body ul li::marker{color:var(--gold)}
/* Signature */
.assinatura{margin-top:40px;padding-top:24px;border-top:1px solid rgba(26,92,69,.15)}
.assinatura-nome{font-weight:700;font-size:15px;color:var(--green)}
.assinatura-cargo{font-size:13px;color:#777;margin-top:4px;letter-spacing:.5px}
/* Values pills */
.valores-grid{display:flex;flex-wrap:wrap;gap:12px;margin-top:16px}
.valor-pill{background:rgba(26,92,69,.07);border:1px solid rgba(26,92,69,.18);border-radius:40px;padding:10px 24px;font-size:14px;font-weight:700;color:var(--green);letter-spacing:.5px}
/* Bullet list with green dot */
.dot-list{list-style:none;padding:0;margin-top:12px}
.dot-list li{padding:10px 0 10px 28px;position:relative;font-size:15px;color:#333;line-height:1.6;border-bottom:1px solid rgba(26,92,69,.07)}
.dot-list li:last-child{border-bottom:none}
.dot-list li::before{content:'';position:absolute;left:0;top:18px;width:8px;height:8px;border-radius:50%;background:var(--gold)}
/* Non-negotiables */
.red-list{list-style:none;padding:0;margin-top:12px}
.red-list li{padding:10px 0 10px 28px;position:relative;font-size:15px;color:#333;line-height:1.6;border-bottom:1px solid rgba(200,50,50,.07)}
.red-list li:last-child{border-bottom:none}
.red-list li::before{content:'✗';position:absolute;left:0;top:10px;color:#c0392b;font-weight:900;font-size:12px}
/* Highlight box */
.highlight-box{background:rgba(26,92,69,.05);border-left:4px solid var(--gold);border-radius:0 8px 8px 0;padding:20px 24px;margin-top:16px}
.highlight-box p{margin-bottom:0}
/* Termo */
.termo-box{border:1px solid rgba(26,92,69,.2);border-radius:8px;padding:28px 32px;margin-top:16px}
.termo-text{font-size:14px;color:#555;line-height:1.8;margin-bottom:28px}
.termo-field{display:flex;flex-direction:column;gap:20px}
.campo{display:flex;gap:0;flex-direction:column}
.campo label{font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#999;font-weight:700;margin-bottom:4px}
.campo-line{height:1px;background:rgba(26,92,69,.2);margin-top:6px;width:100%}
.campo-text{font-size:14px;color:#555;padding-bottom:4px}
/* Print */
@media print{
  body{background:#fff}
  .page{width:100%;margin:0;box-shadow:none;min-height:unset}
  .page{page-break-after:always}
  .page:last-child{page-break-after:auto}
  .no-print{display:none}
}
@page{size:A4 portrait;margin:0}
/* Print toolbar */
.print-bar{position:fixed;bottom:24px;right:24px;display:flex;gap:10px;z-index:999}
.print-btn{background:var(--green);color:#fff;border:none;border-radius:10px;padding:12px 22px;font-size:14px;font-weight:700;cursor:pointer;box-shadow:0 4px 16px rgba(0,0,0,.2);letter-spacing:.3px}
.print-btn.gold{background:var(--gold)}
</style>
</head>
<body>

<!-- PRINT TOOLBAR -->
<div class="print-bar no-print">
  <button class="print-btn gold" onclick="window.print()">Imprimir / Salvar PDF</button>
  <button class="print-btn" onclick="this.closest('.print-bar').style.display='none'">Fechar barra</button>
</div>

<!-- 1. CAPA -->
<div class="page cover">
  <div class="cover-top">
    <div class="cover-eyebrow">Cartilha de Cultura Organizacional</div>
    <h1 class="cover-empresa">${empresa}</h1>
    <div class="cover-segmento">${segmento}</div>
    <div class="cover-bar"></div>
    <div class="cover-title">Nossa Cultura, Nosso Jeito de Ser</div>
  </div>
  <div class="cover-footer">
    <div class="rh-brand">RH com Propósito</div>
    <div class="cover-year">${new Date().getFullYear()}</div>
  </div>
</div>

<!-- 2. MENSAGEM DA DIREÇÃO -->
<div class="page interior">
  <div class="page-header">
    <div class="page-header-num">01</div>
    <h2>Mensagem da Direção</h2>
  </div>
  <div class="page-body">
    <p>${nl2br(d.msgDirecao) || 'Prezados colaboradores,<br><br>Esta cartilha apresenta nossa cultura, nossos princípios e a forma como desejamos construir juntos um ambiente cada vez melhor para trabalhar e servir nossos clientes.'}</p>
    ${diretorNome ? `<div class="assinatura"><div class="assinatura-nome">${diretorNome}</div><div class="assinatura-cargo">${diretorCargo}</div></div>` : ''}
  </div>
</div>

<!-- 3. NOSSA HISTÓRIA -->
<div class="page interior">
  <div class="page-header">
    <div class="page-header-num">02</div>
    <h2>Nossa História</h2>
  </div>
  <div class="page-body">
    <p>${nl2br(d.historia) || 'A empresa nasceu com o propósito de...'}</p>
  </div>
</div>

<!-- 4. MISSÃO + VISÃO -->
<div class="page interior">
  <div class="page-header">
    <div class="page-header-num">03</div>
    <h2>Missão &amp; Visão</h2>
  </div>
  <div class="page-body">
    <h3 style="color:var(--green);font-size:14px;letter-spacing:2px;text-transform:uppercase;margin-bottom:14px;font-weight:700">Nossa Missão</h3>
    <div class="highlight-box"><p>${nl2br(d.missao) || '...'}</p></div>
    <h3 style="color:var(--green);font-size:14px;letter-spacing:2px;text-transform:uppercase;margin:36px 0 14px;font-weight:700">Nossa Visão</h3>
    <div class="highlight-box"><p>${nl2br(d.visao) || '...'}</p></div>
  </div>
</div>

<!-- 5. VALORES -->
<div class="page interior">
  <div class="page-header">
    <div class="page-header-num">04</div>
    <h2>Nossos Valores</h2>
  </div>
  <div class="page-body">
    <p style="color:#666;font-size:14px">Os princípios que guiam cada decisão e cada atitude em ${empresa}.</p>
    <div class="valores-grid">
      ${(d.valores||'').split('\n').filter(v=>v.trim()).map(v=>`<div class="valor-pill">${esc(v.trim())}</div>`).join('')}
    </div>
  </div>
</div>

<!-- 6. O JEITO DE ATENDER -->
<div class="page interior">
  <div class="page-header">
    <div class="page-header-num">05</div>
    <h2>${jeitoTit}</h2>
  </div>
  <div class="page-body">
    <ul class="dot-list">${bullets(d.jeito)}</ul>
  </div>
</div>

<!-- 7. O QUE ESPERAMOS + O QUE NÃO NEGOCIAMOS -->
<div class="page interior">
  <div class="page-header">
    <div class="page-header-num">06</div>
    <h2>Nossa Equipe</h2>
  </div>
  <div class="page-body">
    <h3 style="color:var(--green);font-size:14px;letter-spacing:2px;text-transform:uppercase;margin-bottom:10px;font-weight:700">O Que Esperamos dos Colaboradores</h3>
    <ul class="dot-list">${bullets(d.esperamos)}</ul>
    <h3 style="color:#c0392b;font-size:14px;letter-spacing:2px;text-transform:uppercase;margin:32px 0 10px;font-weight:700">O Que Não Negociamos</h3>
    <ul class="red-list">${bullets(d.naoNegociamos)}</ul>
  </div>
</div>

<!-- 8. CLIENTE + RECONHECIMENTO -->
<div class="page interior">
  <div class="page-header">
    <div class="page-header-num">07</div>
    <h2>Pessoas &amp; Propósito</h2>
  </div>
  <div class="page-body">
    <h3 style="color:var(--green);font-size:14px;letter-spacing:2px;text-transform:uppercase;margin-bottom:14px;font-weight:700">O Cliente é Nossa Prioridade</h3>
    <p>${nl2br(d.cliente) || '...'}</p>
    <h3 style="color:var(--green);font-size:14px;letter-spacing:2px;text-transform:uppercase;margin:32px 0 14px;font-weight:700">Reconhecimento e Valorização</h3>
    <p>${nl2br(d.reconhecimento) || '...'}</p>
    <h3 style="color:var(--green);font-size:14px;letter-spacing:2px;text-transform:uppercase;margin:32px 0 14px;font-weight:700">Compromisso com um Ambiente Saudável</h3>
    <p>${nl2br(d.ambiente) || '...'}</p>
  </div>
</div>

<!-- 9. NOSSA EQUIPE FAZ A DIFERENÇA -->
<div class="page interior">
  <div class="page-header">
    <div class="page-header-num">08</div>
    <h2>Nossa Equipe Faz a Diferença</h2>
  </div>
  <div class="page-body">
    <div class="highlight-box" style="margin-top:0"><p style="font-size:17px;font-style:italic;color:var(--green);line-height:2">${nl2br(d.equipe) || '...'}</p></div>
  </div>
</div>

<!-- 10. TERMO DE COMPROMISSO -->
<div class="page interior">
  <div class="page-header">
    <div class="page-header-num">09</div>
    <h2>Termo de Compromisso</h2>
  </div>
  <div class="page-body">
    <div class="termo-box">
      <div class="termo-text">${nl2br(d.termo) || `Declaro que recebi a Cartilha de Cultura Organizacional da ${empresa} e me comprometo a contribuir para um ambiente de trabalho pautado no respeito, ética, compromisso e excelência.`}</div>
      <div class="termo-field">
        <div class="campo"><div class="campo-text">Nome: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div><div class="campo-line"></div></div>
        <div class="campo"><div class="campo-text">Cargo: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div><div class="campo-line"></div></div>
        <div style="display:flex;gap:40px">
          <div class="campo" style="flex:1"><div class="campo-text">Data: ____/____/________</div><div class="campo-line"></div></div>
          <div class="campo" style="flex:2"><div class="campo-text">Assinatura:</div><div class="campo-line"></div></div>
        </div>
      </div>
    </div>
  </div>
</div>

</body>
</html>`;
}

window.RH = window.RH || {};
RH.baixarCartilha = function (d) {
  const html = buildCartilhaHTML(d);
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `Cartilha_Cultura_${(d.empresa || 'Empresa').replace(/\s+/g,'_')}.html`;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 2000);
};
