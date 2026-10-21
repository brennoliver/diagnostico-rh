// ═══════════════════════════════════════════════════
// Área da consultora — base: dados, vínculo com clientes,
// navegação, janelas e envio de links.
// ═══════════════════════════════════════════════════
window.App = (function () {
  const RH = window.RH, F = window.RHF, esc = RH.esc;
  const sb = () => RH.supabase();
  const A = { telas: {}, esc };

  // ── Utilidades ───────────────────────────────────────
  A.$ = (s, r = document) => r.querySelector(s);
  A.$$ = (s, r = document) => [...r.querySelectorAll(s)];
  A.chave = s => RH.normalizarEmpresa(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  A.chavePrograma = nome => RH.normalizarEmpresa(nome).toLowerCase();
  A.plural = (n, um, varios) => `${n} ${n === 1 ? um : varios}`;
  A.dataBR = F.dataBR;
  A.dataResp = r => F.dataResposta(r);
  A.relativo = iso => {
    if (!iso) return '';
    const d = new Date(String(iso).length <= 10 ? iso + 'T12:00:00' : iso);
    const dias = Math.floor((Date.now() - d.getTime()) / 864e5);
    if (dias <= 0) return 'hoje';
    if (dias === 1) return 'ontem';
    if (dias < 7) return `há ${dias} dias`;
    return d.toLocaleDateString('pt-BR');
  };
  A.saudacao = () => { const h = new Date().getHours(); return h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite'; };
  A.debounce = (fn, ms) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; };
  A.dentroDe = (row, dias) => !dias || (Date.now() - new Date(row.created_at || A.dataResp(row)).getTime()) <= dias * 864e5;

  // ── Dados ────────────────────────────────────────────
  let cache = {};
  A.invalidar = () => { cache = {}; };

  A.respostas = async (forcar = false) => {
    if (cache.respostas && !forcar) return cache.respostas;
    const todas = [];
    for (let de = 0; ; de += 1000) {
      const { data, error } = await sb().from('responses').select('*').order('created_at', { ascending: false }).range(de, de + 999);
      if (error) throw new Error('Não foi possível carregar as respostas: ' + error.message);
      todas.push(...data);
      if (data.length < 1000) break;
    }
    return (cache.respostas = todas);
  };

  A.clientes = async (forcar = false) => {
    if (cache.clientes && !forcar) return cache.clientes;
    const { data, error } = await sb().from('clientes').select('*').order('nome');
    if (error) throw new Error('Não foi possível carregar os clientes: ' + error.message);
    return (cache.clientes = data);
  };

  A.salvarCliente = async c => {
    const dados = { ...c };
    delete dados.id; delete dados.created_at; delete dados.updated_at;
    dados.nome = RH.normalizarEmpresa(dados.nome);
    dados.apelidos = (dados.apelidos || []).map(RH.normalizarEmpresa).filter(Boolean);
    const q = c.id ? sb().from('clientes').update(dados).eq('id', c.id) : sb().from('clientes').insert(dados);
    const { data, error } = await q.select().single();
    if (error) throw new Error(error.code === '23505' ? 'Já existe um cliente com esse nome.' : 'Não foi possível salvar: ' + error.message);
    cache.clientes = null;
    return data;
  };

  A.excluirCliente = async id => {
    const { error } = await sb().from('clientes').delete().eq('id', id);
    if (error) throw new Error('Não foi possível excluir: ' + error.message);
    cache.clientes = null;
  };

  A.excluirResposta = async id => {
    const { error } = await sb().from('responses').delete().eq('id', id);
    if (error) throw new Error('Não foi possível excluir: ' + error.message);
    if (cache.respostas) cache.respostas = cache.respostas.filter(r => r.id !== id);
  };

  A.lerDado = async (empresa, chave) => {
    const { data, error } = await sb().from('programa_dados').select('valor').eq('empresa', A.chavePrograma(empresa)).eq('chave', chave).maybeSingle();
    if (error) throw new Error(error.message);
    return data ? data.valor : null;
  };
  A.salvarDado = async (empresa, chave, valor) => {
    const { error } = await sb().from('programa_dados').upsert({ empresa: A.chavePrograma(empresa), chave, valor, updated_at: new Date().toISOString() });
    if (error) throw new Error(error.message);
  };
  A.progressos = async () => {
    const { data } = await sb().from('programa_dados').select('empresa,valor').eq('chave', 'progresso');
    return Object.fromEntries((data || []).map(d => [d.empresa, d.valor]));
  };

  // ── Vínculo resposta ↔ cliente ───────────────────────
  A.chavesCliente = c => [c.nome, ...(c.apelidos || [])].map(A.chave).filter(Boolean);
  A.indice = clientes => {
    const m = new Map();
    clientes.forEach(c => A.chavesCliente(c).forEach(k => m.set(k, c)));
    return m;
  };
  A.clienteDe = (row, indice) => indice.get(A.chave(row.company)) || null;
  A.doCliente = (c, respostas) => { const ks = new Set(A.chavesCliente(c)); return respostas.filter(r => ks.has(A.chave(r.company))); };

  // Nomes de empresa que aparecem nas respostas sem cliente correspondente.
  // A confirmação de presença antiga gravava o setor no lugar da empresa.
  const IGNORAR = new Set(['', '-', 'a', 'teste', 'rhcp']);
  A.semCadastro = (respostas, clientes) => {
    const idx = A.indice(clientes);
    const m = new Map();
    respostas.forEach(r => {
      if (r.section === 'confirmacao_evento') return;
      const k = A.chave(r.company);
      if (IGNORAR.has(k) || k.length < 2 || idx.has(k)) return;
      const e = m.get(k) || { nome: RH.normalizarEmpresa(r.company), n: 0, ultima: '' };
      e.n++;
      if ((r.created_at || '') > e.ultima) e.ultima = r.created_at;
      m.set(k, e);
    });
    return [...m.values()].sort((a, b) => b.n - a.n);
  };

  // ── Links dos formulários ────────────────────────────
  A.link = (formId, empresa) => location.origin + '/r/' + formId + '.html' + (empresa ? '?empresa=' + encodeURIComponent(empresa) : '');
  A.linkPreencher = (formId, empresa) => '/f/?f=' + encodeURIComponent(formId) + (empresa ? '&empresa=' + encodeURIComponent(empresa) : '');

  // ── Interface ────────────────────────────────────────
  A.toast = msg => {
    A.$$('.toast').forEach(t => t.remove());
    const t = document.createElement('div');
    t.className = 'toast'; t.setAttribute('role', 'status'); t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 3200);
  };

  A.copiar = async texto => {
    try { await navigator.clipboard.writeText(texto); A.toast('Link copiado!'); }
    catch { prompt('Copie o link:', texto); }
  };

  A.modal = ({ titulo, corpo = '', rodape = '', largo = false }) => {
    const back = document.createElement('div');
    back.className = 'modal-back';
    back.innerHTML = `<div class="modal${largo ? ' modal-wide' : ''}" role="dialog" aria-modal="true" aria-label="${esc(titulo)}">
      <div class="modal-head"><h2>${esc(titulo)}</h2><button class="btn btn-ghost btn-icon" data-fechar aria-label="Fechar">${RH.icone('fechar')}</button></div>
      <div class="modal-body">${corpo}</div>${rodape ? `<div class="modal-foot">${rodape}</div>` : ''}</div>`;
    const anterior = document.activeElement;
    const fechar = () => { back.remove(); document.removeEventListener('keydown', esc_); anterior && anterior.focus && anterior.focus(); };
    const esc_ = e => { if (e.key === 'Escape') fechar(); };
    back.addEventListener('click', e => { if (e.target === back || e.target.closest('[data-fechar]')) fechar(); });
    document.addEventListener('keydown', esc_);
    document.body.appendChild(back);
    setTimeout(() => (back.querySelector('input,select,textarea') || back.querySelector('[data-fechar]')).focus(), 30);
    return { el: back, fechar };
  };

  A.confirmar = (mensagem, { ok = 'Confirmar', perigo = false } = {}) => new Promise(res => {
    const m = A.modal({ titulo: 'Confirmar', corpo: `<p>${esc(mensagem)}</p>`,
      rodape: `<button class="btn btn-sec" data-fechar>Cancelar</button><button class="btn ${perigo ? 'btn-danger' : ''}" data-ok>${esc(ok)}</button>` });
    let resp = false;
    m.el.querySelector('[data-ok]').addEventListener('click', () => { resp = true; m.fechar(); });
    new MutationObserver((_, o) => { if (!document.body.contains(m.el)) { o.disconnect(); res(resp); } }).observe(document.body, { childList: true });
  });

  A.barras = (contagem, total) => {
    if (!total) return '<p class="muted small">Ainda sem respostas.</p>';
    const max = Math.max(...contagem.map(c => c.n));
    return '<div class="bars">' + contagem.map((c, i) => {
      const pct = Math.round((c.n / total) * 100);
      return `<div class="bar-row${c.n && c.n === max ? ' top' : ''}"><span class="bar-label">${esc(c.rotulo)}</span><span class="bar-count">${c.n} · ${pct}%</span><div class="bar-track"><div class="bar-fill" style="width:${pct}%;animation-delay:${i * 60}ms"></div></div></div>`;
    }).join('') + '</div>';
  };

  // ── Elementos visuais ────────────────────────────────
  A.iniciais = nome => (RH.normalizarEmpresa(nome).split(' ').filter(p => p.length > 2 || /^[A-Z]/.test(p)).slice(0, 2).map(p => p[0]).join('') || '?').toUpperCase();

  // Minigráfico de área: respostas por semana nas últimas n semanas
  A.porSemana = (respostas, n = 10) => {
    const agora = Date.now(), sem = 7 * 864e5;
    const v = Array(n).fill(0);
    respostas.forEach(r => { const i = n - 1 - Math.floor((agora - new Date(r.created_at || A.dataResp(r)).getTime()) / sem); if (i >= 0 && i < n) v[i]++; });
    return v;
  };
  A.spark = (valores, cor = '#2E7D58') => {
    const w = 200, h = 36, max = Math.max(1, ...valores), passo = w / (valores.length - 1);
    const pts = valores.map((v, i) => [i * passo, h - 4 - (v / max) * (h - 8)]);
    const linha = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
    const id = 'sg' + Math.random().toString(36).slice(2, 8);
    return `<svg class="spark" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${cor}" stop-opacity=".28"/><stop offset="1" stop-color="${cor}" stop-opacity="0"/></linearGradient></defs>
      <path d="${linha} L${w} ${h} L0 ${h} Z" fill="url(#${id})"/><path d="${linha}" fill="none" stroke="${cor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke"/></svg>`;
  };

  // Medidor semicircular do NPS (-100 a 100)
  A.medidor = score => {
    const ang = Math.PI * (1 - (score + 100) / 200);
    const x = 100 + 80 * Math.cos(ang), y = 100 - 80 * Math.sin(ang);
    const cor = score >= 75 ? '#1E7A4F' : score >= 50 ? '#2E7D58' : score >= 0 ? '#C89B3C' : '#B93A0C';
    return `<svg class="gauge" viewBox="0 0 200 112" aria-hidden="true"><defs><linearGradient id="gg" x1="0" x2="1"><stop offset="0" stop-color="#E0612A"/><stop offset=".5" stop-color="#E6C982"/><stop offset="1" stop-color="#1E7A4F"/></linearGradient></defs>
      <path d="M20 100 A80 80 0 0 1 180 100" fill="none" stroke="#EFEBE3" stroke-width="16" stroke-linecap="round"/>
      <path d="M20 100 A80 80 0 0 1 180 100" fill="none" stroke="url(#gg)" stroke-width="16" stroke-linecap="round" opacity=".9"/>
      <circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="11" fill="#fff" stroke="${cor}" stroke-width="5"/></svg>`;
  };

  // Números que contam até o valor e trilhas dos controles deslizantes
  A.animar = raiz => {
    raiz.querySelectorAll('[data-contar]').forEach(el => {
      const fim = +el.dataset.contar;
      if (isNaN(fim) || matchMedia('(prefers-reduced-motion: reduce)').matches) { el.textContent = el.dataset.contar; return; }
      const t0 = performance.now(), dur = 900;
      const passo = t => { const p = Math.min(1, (t - t0) / dur); el.textContent = Math.round(fim * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(passo); };
      requestAnimationFrame(passo);
    });
    raiz.querySelectorAll('input[type=range]').forEach(r => {
      const pinta = () => r.style.setProperty('--v', r.value + '%');
      pinta(); r.addEventListener('input', pinta);
    });
  };

  A.vazio = (icone, titulo, texto = '', acao = '') => `<div class="empty"><div class="empty-icon">${RH.icone(icone, { tamanho: 28 })}</div><strong>${esc(titulo)}</strong>${esc(texto)}${acao ? `<div style="margin-top:14px">${acao}</div>` : ''}</div>`;
  A.ic = (nome, tamanho = 18) => RH.icone(nome, { tamanho });

  // ── Enviar formulário ────────────────────────────────
  A.abrirEnvio = async ({ formId = '', empresa = '' } = {}) => {
    const clientes = await A.clientes().catch(() => []);
    const opcoes = (window.RH_CATEGORIAS || []).map(cat => {
      const fs = F.lista().filter(f => f.categoria === cat.id && !f.interno);
      return fs.length ? `<optgroup label="${esc(cat.titulo)}">${fs.map(f => `<option value="${f.id}"${f.id === formId ? ' selected' : ''}>${esc(f.titulo)}</option>`).join('')}</optgroup>` : '';
    }).join('');
    const m = A.modal({
      titulo: 'Enviar formulário',
      corpo: `
        <div class="field"><label class="label" for="ev-form">Formulário</label><select class="select" id="ev-form">${opcoes}</select></div>
        <div class="field"><label class="label" for="ev-emp">Cliente</label>
          <input class="input" id="ev-emp" list="ev-lista" placeholder="Nome da empresa (opcional)" value="${esc(empresa)}" autocomplete="off">
          <datalist id="ev-lista">${clientes.map(c => `<option value="${esc(c.nome)}">`).join('')}</datalist>
          <p class="small muted" style="margin-top:6px">O nome da empresa já vai preenchido para quem responder e as respostas aparecem no cadastro do cliente.</p></div>
        <div class="field"><label class="label" for="ev-link">Link</label><div class="row" style="flex-wrap:nowrap"><input class="input" id="ev-link" readonly><button class="btn btn-sec" id="ev-copiar">Copiar</button></div></div>
        <div class="field"><label class="label" for="ev-msg">Mensagem</label><textarea class="textarea" id="ev-msg" rows="5"></textarea></div>`,
      rodape: `<a class="btn btn-sec" id="ev-abrir" target="_blank" rel="noopener">${RH.icone('abrir',{tamanho:16})} Abrir</a><a class="btn btn-sec" id="ev-email">${RH.icone('email',{tamanho:16})} E-mail</a><a class="btn btn-wa" id="ev-wa" target="_blank" rel="noopener">${RH.icone('whatsapp',{tamanho:16})} WhatsApp</a>`
    });
    const $ = s => m.el.querySelector(s);
    const atualizar = () => {
      const f = F.get($('#ev-form').value);
      const emp = RH.normalizarEmpresa($('#ev-emp').value);
      const link = A.link(f.id, emp);
      $('#ev-link').value = link;
      if (!$('#ev-msg').dataset.editado) {
        $('#ev-msg').value = `Olá! Tudo bem?\n\nSegue o link do formulário *${f.tituloPublico || f.titulo}*${emp ? ' da ' + emp : ''}. Leva cerca de ${f.tempo || 'alguns minutos'} e as respostas são confidenciais.\n\n${link}\n\nObrigada!\n${RH_CONFIG.consultora} · RH com Propósito`;
      } else {
        $('#ev-msg').value = $('#ev-msg').value.replace(/https?:\/\/\S+\/r\/\S+/, link);
      }
      const msg = $('#ev-msg').value;
      $('#ev-wa').href = 'https://wa.me/?text=' + encodeURIComponent(msg);
      $('#ev-email').href = 'mailto:?subject=' + encodeURIComponent((f.tituloPublico || f.titulo) + ' — RH com Propósito') + '&body=' + encodeURIComponent(msg);
      $('#ev-abrir').href = A.linkPreencher(f.id, emp);
    };
    $('#ev-form').addEventListener('change', () => { delete $('#ev-msg').dataset.editado; atualizar(); });
    $('#ev-emp').addEventListener('input', atualizar);
    $('#ev-msg').addEventListener('input', () => { $('#ev-msg').dataset.editado = '1'; atualizar(); });
    $('#ev-copiar').addEventListener('click', () => A.copiar($('#ev-link').value));
    atualizar();
  };

  // ── Ver uma resposta ─────────────────────────────────
  A.abrirResposta = async (row, aoExcluir) => {
    const form = F.get(row.section);
    const clientes = await A.clientes().catch(() => []);
    const cli = A.clienteDe(row, A.indice(clientes));
    const corpo = form ? F.htmlResposta(form, row) : `<pre style="white-space:pre-wrap">${esc(JSON.stringify(row, null, 2))}</pre>`;
    const cab = `<div class="row" style="margin-bottom:18px">
        <span class="badge badge-green">${esc(form ? form.titulo : row.section)}</span>
        ${row.company ? (cli ? `<a class="badge badge-gold" href="#/clientes/${cli.id}" data-fechar>${RH.icone('clientes',{tamanho:13})} ${esc(cli.nome)}</a>` : `<span class="badge badge-gold">${RH.icone('clientes',{tamanho:13})} ${esc(row.company)}</span>`) : ''}
        <span class="badge">${RH.icone('calendario',{tamanho:13})} ${esc(A.dataBR(A.dataResp(row)))}</span></div>
      ${row.nome ? `<h3 class="serif" style="font-size:22px;margin-bottom:${row.cargo_setor ? 2 : 16}px">${esc(row.nome)}</h3>` : ''}
      ${row.cargo_setor ? `<p class="muted" style="margin-bottom:16px">${esc(row.cargo_setor)}</p>` : ''}`;
    const m = A.modal({
      titulo: 'Resposta', largo: true, corpo: cab + corpo,
      rodape: `<button class="btn btn-danger" data-excluir>Excluir</button><span class="spacer"></span><button class="btn btn-sec" data-imprimir>${RH.icone('imprimir',{tamanho:16})} Imprimir / PDF</button><button class="btn" data-fechar>Fechar</button>`
    });
    m.el.querySelector('[data-imprimir]').addEventListener('click', () => A.imprimir(form ? form.titulo : row.section, cab + corpo));
    m.el.querySelector('[data-excluir]').addEventListener('click', async () => {
      if (!await A.confirmar('Excluir esta resposta definitivamente? Não dá para desfazer.', { ok: 'Excluir', perigo: true })) return;
      try { await A.excluirResposta(row.id); m.fechar(); A.toast('Resposta excluída.'); aoExcluir && aoExcluir(); }
      catch (e) { A.toast(e.message); }
    });
  };

  A.imprimir = (titulo, html) => {
    const w = window.open('', '_blank');
    if (!w) { A.toast('Permita pop-ups para imprimir.'); return; }
    w.document.write(`<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><title>${esc(titulo)} — RH com Propósito</title>
      <link href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700;900&family=Playfair+Display:wght@700&display=swap" rel="stylesheet">
      <link rel="stylesheet" href="${location.origin}/css/rh.css">
      <style>body{background:#fff;padding:32px;max-width:820px;margin:0 auto}.badge{border:1px solid #ddd}a{color:inherit;text-decoration:none}
      .doc-head{display:flex;justify-content:space-between;align-items:center;border-bottom:2px solid var(--green);padding-bottom:12px;margin-bottom:22px}</style></head>
      <body><div class="doc-head"><span style="width:120px;display:block">${RH.logo ? RH.logo('completa', 'claro') : 'RH com Propósito'}</span><span class="small muted">${new Date().toLocaleDateString('pt-BR')}</span></div>
      <h1 class="serif" style="font-size:24px;margin-bottom:16px">${esc(titulo)}</h1>${html}
      <script>setTimeout(() => print(), 500)<\/script></body></html>`);
    w.document.close();
  };

  // ── Navegação ────────────────────────────────────────
  const ROTAS = [
    [/^\/$/, 'inicio'], [/^\/clientes$/, 'clientes'], [/^\/clientes\/([^/]+)$/, 'cliente'],
    [/^\/formularios$/, 'formularios'], [/^\/respostas(?:\/([^/]+))?$/, 'respostas'],
    [/^\/satisfacao$/, 'satisfacao'], [/^\/programa$/, 'programa'], [/^\/programa\/([^/]+)$/, 'programaCliente'],
    [/^\/materiais$/, 'materiais'], [/^\/conta$/, 'conta'], [/^\/mais$/, 'mais']
  ];
  A.ir = caminho => { location.hash = '#' + caminho; };
  A.query = () => new URLSearchParams((location.hash.split('?')[1]) || '');

  async function rotear() {
    const [caminho] = (location.hash.slice(1) || '/').split('?');
    let nome = 'inicio', params = [];
    for (const [re, n] of ROTAS) { const m = caminho.match(re); if (m) { nome = n; params = m.slice(1).map(decodeURIComponent); break; } }
    const secao = '/' + (caminho.split('/')[1] || '');
    A.$$('[data-nav]').forEach(a => a.classList.toggle('active', a.dataset.nav === secao || (secao === '/cliente' && a.dataset.nav === '/clientes')));
    const main = A.$('#main');
    main.innerHTML = '<div class="loading"><div class="spinner"></div>Carregando…</div>';
    window.scrollTo(0, 0);
    try {
      await A.telas[nome](main, params, A.query());
      A.animar(main);
      if (RH.aplicarLogo) RH.aplicarLogo(main);
      const h1 = main.querySelector('h1');
      document.title = (h1 ? h1.textContent + ' — ' : '') + 'RH com Propósito';
    } catch (e) {
      console.error(e);
      main.innerHTML = `<div class="page"><div class="card">${A.vazio('alerta', 'Algo deu errado', e.message, '<button class="btn" onclick="location.reload()">Tentar de novo</button>')}</div></div>`;
    }
  }
  A.recarregar = rotear;

  A.iniciar = async () => {
    await RH.auth.exigirLogin();
    A.email = await RH.auth.email();
    A.$('#app').classList.remove('hidden');
    A.$$('[data-email]').forEach(e => { e.textContent = A.email; });
    A.$$('[data-sair]').forEach(b => b.addEventListener('click', () => RH.auth.sair()));
    A.$$('[data-enviar]').forEach(b => b.addEventListener('click', () => A.abrirEnvio()));
    window.addEventListener('hashchange', rotear);
    rotear();
  };
  return A;
})();
