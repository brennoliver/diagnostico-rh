// ═══════════════════════════════════════════════════
// RH com Propósito — motor de formulários
// Requer js/api.js e js/formularios*.js.
//   RHF.renderizar(el, form, opts)  formulário público (f/index.html)
//   RHF.valores / htmlResposta      leitura de respostas gravadas
//   RHF.estatisticas / nps / csv    resumo para o painel
// ═══════════════════════════════════════════════════
(function () {
  const RH = window.RH;
  const esc = RH.esc;
  const F = window.RHF = {};

  F.lista = () => window.RH_FORMULARIOS || [];
  F.get = id => F.lista().find(f => f.id === id);
  F.categoria = id => (window.RH_CATEGORIAS || []).find(c => c.id === id);
  F.rotulo = id => { const f = F.get(id); return f ? f.titulo : id; };

  F.campos = (form, interno = true) => {
    const out = [];
    form.secoes.forEach(s => {
      if (s.interno && !interno) return;
      s.campos.forEach(c => { if (!c.interno || interno) out.push(c); });
    });
    return out;
  };
  F.temInterno = form => !!form.interno || form.secoes.some(s => s.interno || s.campos.some(c => c.interno));
  F.usaJson = form => F.campos(form).some(c => !c.coluna);
  const OBJETIVOS = ['radio', 'select', 'checkbox', 'escala', 'nps'];

  // ── Leitura de uma resposta gravada ──────────────────
  F.valores = (form, row) => {
    const json = F.usaJson(form) ? RH.lerJson(row.r1) : {};
    const v = {};
    const conhecidas = new Set();
    F.campos(form).forEach(c => {
      if (c.tipo === 'grade') c.linhas.forEach(l => l.celulas.forEach(cel => { v[cel.id] = json[cel.id]; conhecidas.add(cel.id); }));
      else { v[c.id] = c.coluna ? row[c.coluna] : json[c.id]; conhecidas.add(c.id); }
    });
    const extras = {};
    Object.keys(json).forEach(k => { if (!conhecidas.has(k) && json[k] !== '' && json[k] != null) extras[k] = json[k]; });
    return { v, extras };
  };

  const vazio = val => val == null || val === '' || (Array.isArray(val) && !val.length);

  F.texto = (c, val) => {
    if (vazio(val)) return '';
    if (c.tipo === 'consentimento') return (val === true || val === 'true') ? 'Sim' : 'Não';
    if (c.tipo === 'lista') {
      return (Array.isArray(val) ? val : []).filter(r => r && Object.values(r).some(Boolean))
        .map(r => c.colunas.map(k => r[k.id] || '—').join(' | ')).join('\n');
    }
    if (Array.isArray(val)) return val.join(', ');
    if (typeof val === 'object') return Object.values(val).filter(Boolean).join(' | ');
    if (c.tipo === 'data' && /^\d{4}-\d{2}-\d{2}$/.test(val)) return val.split('-').reverse().join('/');
    if (c.rotulosOpcoes && c.rotulosOpcoes[val]) return c.rotulosOpcoes[val];
    return String(val);
  };

  F.dataBR = s => {
    if (!s) return '';
    const d = String(s).slice(0, 10);
    return /^\d{4}-\d{2}-\d{2}$/.test(d) ? d.split('-').reverse().join('/') : String(s);
  };
  F.dataResposta = row => row.data_resposta || (row.created_at || '').slice(0, 10);

  F.htmlResposta = (form, row, interno = true) => {
    const { v, extras } = F.valores(form, row);
    let html = '', semResposta = 0;
    form.secoes.forEach(s => {
      if (s.interno && !interno) return;
      let inner = '';
      s.campos.forEach(c => {
        const pergunta = c.rotulo || s.titulo;
        if (c.tipo === 'grade') {
          const temAlgo = c.linhas.some(l => l.celulas.some(cel => !vazio(v[cel.id])));
          if (!temAlgo) { semResposta++; return; }
          inner += `<div class="answer"><div class="answer-q">${esc(pergunta)}</div><div class="table-wrap"><table><tr>${c.colunas.map(h => `<th>${esc(h)}</th>`).join('')}</tr>` +
            c.linhas.map(l => `<tr><td>${esc(l.rotulo)}</td>${l.celulas.map(cel => `<td>${esc(v[cel.id] || '')}</td>`).join('')}</tr>`).join('') + '</table></div></div>';
          return;
        }
        if (c.tipo === 'lista') {
          const linhas = (Array.isArray(v[c.id]) ? v[c.id] : []).filter(r => r && Object.values(r).some(Boolean));
          if (!linhas.length) { semResposta++; return; }
          inner += `<div class="answer"><div class="answer-q">${esc(pergunta)}</div><div class="table-wrap"><table><tr>${c.colunas.map(k => `<th>${esc(k.titulo)}</th>`).join('')}</tr>` +
            linhas.map(r => `<tr>${c.colunas.map(k => `<td>${esc(r[k.id] || '')}</td>`).join('')}</tr>`).join('') + '</table></div></div>';
          return;
        }
        const t = F.texto(c, v[c.id]);
        if (!t) { semResposta++; return; }
        inner += `<div class="answer"><div class="answer-q">${esc(pergunta)}</div><div class="answer-a">${esc(t)}</div></div>`;
      });
      if (inner) html += `<div class="answer-sec"><h4>${esc(s.titulo)}${s.interno ? ' · uso interno' : ''}</h4>${inner}</div>`;
    });
    const ex = Object.entries(extras);
    if (ex.length) {
      html += '<div class="answer-sec"><h4>Outros dados</h4>' + ex.map(([k, val]) =>
        `<div class="answer"><div class="answer-q">${esc(k.replace(/^m\d+-/, '').replace(/[_-]/g, ' '))}</div><div class="answer-a">${esc(Array.isArray(val) ? val.join(', ') : typeof val === 'object' ? JSON.stringify(val) : val)}</div></div>`).join('') + '</div>';
    }
    if (!html) html = '<div class="empty"><strong>Resposta vazia</strong>Nenhum campo foi preenchido.</div>';
    else if (semResposta) html += `<p class="small muted">${semResposta} ${semResposta === 1 ? 'pergunta ficou' : 'perguntas ficaram'} sem resposta.</p>`;
    return html;
  };

  F.textoResposta = (form, vals) => {
    const linhas = [form.titulo.toUpperCase(), '═'.repeat(40)];
    form.secoes.forEach(s => {
      const itens = [];
      s.campos.forEach(c => {
        if (c.tipo === 'grade') {
          c.linhas.forEach(l => { const t = l.celulas.map(cel => vals[cel.id]).filter(Boolean).join(' | '); if (t) itens.push(`${l.rotulo}: ${t}`); });
          return;
        }
        const t = F.texto(c, vals[c.id]);
        if (t) itens.push(`${c.rotulo || s.titulo}\n${t}`);
      });
      if (itens.length) linhas.push('', `— ${s.titulo.toUpperCase()} —`, ...itens.map(i => i + '\n'));
    });
    return linhas.join('\n');
  };

  // ── Resumo para o painel ─────────────────────────────
  const inclui = (val, opcao) => {
    if (Array.isArray(val)) return val.some(x => x === opcao || (opcao === 'Outro' && /^outro/i.test(x)));
    if (typeof val !== 'string') return false;
    if (val === opcao) return true;
    return val.split(/;\s*|,\s+/).some(x => x === opcao || (opcao === 'Outro' && /^outro/i.test(x)));
  };

  F.estatisticas = (form, rows) => {
    const valores = rows.map(r => F.valores(form, r).v);
    return F.campos(form).filter(c => OBJETIVOS.includes(c.tipo)).map(c => {
      const respondidas = valores.filter(v => !vazio(v[c.id]));
      let opcoes = c.opcoes;
      if (c.tipo === 'escala' || c.tipo === 'nps') {
        const min = c.tipo === 'nps' ? 0 : (c.min || 1), max = c.tipo === 'nps' ? 10 : (c.max || 5);
        opcoes = Array.from({ length: max - min + 1 }, (_, i) => String(min + i));
      }
      const contagem = (opcoes || []).map(o => ({
        opcao: o, rotulo: (c.rotulosOpcoes && c.rotulosOpcoes[o]) || o,
        n: respondidas.filter(v => (c.tipo === 'checkbox' ? inclui(v[c.id], o) : String(v[c.id]) === o || (o === 'Outro' && /^outro/i.test(v[c.id])))).length
      }));
      const r = { campo: c, total: respondidas.length, contagem };
      if (c.tipo === 'escala' || c.tipo === 'nps') {
        const nums = respondidas.map(v => Number(v[c.id])).filter(n => !isNaN(n));
        r.media = nums.length ? nums.reduce((a, b) => a + b, 0) / nums.length : null;
      }
      return r;
    });
  };

  F.textosAbertos = (form, rows, id) => rows.map(r => ({ row: r, valor: F.valores(form, r).v[id] })).filter(x => !vazio(x.valor));

  F.nps = notas => {
    const n = notas.map(Number).filter(x => !isNaN(x) && x >= 0 && x <= 10);
    if (!n.length) return null;
    const p = n.filter(x => x >= 9).length, d = n.filter(x => x <= 6).length;
    return { n: n.length, promotores: p, neutros: n.length - p - d, detratores: d, score: Math.round(((p - d) / n.length) * 100) };
  };

  F.csv = (form, rows) => {
    const cols = [];
    F.campos(form).forEach(c => {
      if (c.tipo === 'grade') c.linhas.forEach(l => l.celulas.forEach((cel, i) => cols.push({ id: cel.id, titulo: `${l.rotulo} — ${c.colunas[i + 1] || ''}`, c: { tipo: 'texto' } })));
      else cols.push({ id: c.id, titulo: c.rotulo || c.id, c });
    });
    const q = s => '"' + String(s ?? '').replace(/"/g, '""') + '"';
    const head = ['Data', 'Empresa', 'Nome', ...cols.map(c => c.titulo)];
    const linhas = rows.map(r => { const { v } = F.valores(form, r); return [F.dataBR(F.dataResposta(r)), r.company, r.nome, ...cols.map(c => F.texto(c.c, v[c.id]))]; });
    return '﻿' + [head, ...linhas].map(l => l.map(q).join(';')).join('\r\n');
  };

  // ── Montagem da linha para "responses" ────────────────
  F.montarLinha = (form, vals, empresaUrl, eventoId) => {
    const row = { section: form.id };
    const json = {};
    F.campos(form).forEach(c => {
      if (c.tipo === 'grade') { c.linhas.forEach(l => l.celulas.forEach(cel => { if (cel.id in vals) json[cel.id] = vals[cel.id]; })); return; }
      if (!(c.id in vals) && !c.padraoVazio) return;
      let val = vals[c.id];
      if (c.padraoVazio && vazio(val)) val = c.padraoVazio;
      if (c.coluna) row[c.coluna] = Array.isArray(val) ? val.join(', ') : val;
      else json[c.id] = val;
    });
    if (Object.keys(json).length) row.r1 = json;
    Object.entries(form.mapa || {}).forEach(([col, ids]) => {
      if (row[col]) return;
      const v = ids.map(i => json[i]).find(x => !vazio(x));
      if (v) row[col] = Array.isArray(v) ? v.join(', ') : String(v);
    });
    Object.entries(form.colunasFixas || {}).forEach(([col, v]) => { if (!row[col]) row[col] = v; });
    if (!row.company && empresaUrl) row.company = empresaUrl;
    if (eventoId) row.evento_id = eventoId;
    return row;
  };

  // ═══════════════════════════════════════════════════
  // Renderização do formulário público
  // ═══════════════════════════════════════════════════
  const safe = id => 'c_' + String(id).replace(/[^\w-]/g, '_');

  function controle(c) {
    const id = safe(c.id);
    const ph = c.placeholder ? ` placeholder="${esc(c.placeholder)}"` : '';
    const tipos = { texto: 'text', email: 'email', telefone: 'tel', numero: 'number', data: 'date' };
    if (tipos[c.tipo]) {
      const extra = c.tipo === 'telefone' ? ' inputmode="tel" autocomplete="tel"' : c.tipo === 'email' ? ' autocomplete="email"' : '';
      return `<input class="input" id="${id}" type="${tipos[c.tipo]}" data-campo="${esc(c.id)}"${ph}${extra}>`;
    }
    if (c.tipo === 'textarea') return `<textarea class="textarea" id="${id}" rows="${c.linhas || 4}" data-campo="${esc(c.id)}"${ph}></textarea>`;
    if (c.tipo === 'select') return `<select class="select" id="${id}" data-campo="${esc(c.id)}"><option value="">Selecione…</option>${c.opcoes.map(o => `<option>${esc(o)}</option>`).join('')}</select>`;
    if (c.tipo === 'radio' || c.tipo === 'checkbox') {
      const box = c.tipo === 'checkbox';
      const longas = c.opcoes.some(o => String((c.rotulosOpcoes || {})[o] || o).length > 34);
      const cols = !longas && c.opcoes.length > 3 ? ' cols' : '';
      return `<div class="opts${cols}" role="${box ? 'group' : 'radiogroup'}">` + c.opcoes.map(o =>
        `<label class="opt${box ? ' box' : ''}"><input type="${box ? 'checkbox' : 'radio'}" name="${id}" value="${esc(o)}" data-campo="${esc(c.id)}"><span class="opt-mark"></span><span>${esc((c.rotulosOpcoes || {})[o] || o)}</span></label>`).join('') +
        '</div>' + (c.outro ? `<input class="input opt-outro hidden" data-outro="${esc(c.id)}" placeholder="Qual?">` : '');
    }
    if (c.tipo === 'escala' || c.tipo === 'nps') {
      const min = c.tipo === 'nps' ? 0 : (c.min || 1), max = c.tipo === 'nps' ? 10 : (c.max || 5);
      const nums = Array.from({ length: max - min + 1 }, (_, i) => min + i);
      const ends = c.rotulosEscala ? `<div class="scale-ends"><span>${esc(c.rotulosEscala[0])}</span><span>${esc(c.rotulosEscala[1])}</span></div>` : '';
      return `<div class="scale${c.tipo === 'nps' ? ' nps' : ''}" style="--n:${nums.length}" data-escala="${esc(c.id)}">` +
        nums.map(n => `<button type="button" data-v="${n}" class="${c.tipo === 'nps' ? (n <= 6 ? 'd' : n <= 8 ? 'p' : '') : ''}" aria-label="${n}">${n}</button>`).join('') + '</div>' + ends;
    }
    if (c.tipo === 'consentimento') return `<label class="consent"><input type="checkbox" data-campo="${esc(c.id)}" data-consent="1"><span>${esc(c.rotulo)}${c.obrigatorio ? '<span class="pf-req">*</span>' : ''}</span></label>`;
    if (c.tipo === 'grade') {
      return `<div class="table-wrap"><table class="grade"><thead><tr>${c.colunas.map(h => `<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>` +
        c.linhas.map(l => `<tr><td>${esc(l.rotulo)}</td>${l.celulas.map((cel, i) => `<td data-col="${esc(c.colunas[i + 1] || '')}">` +
          (cel.tipo === 'select'
            ? `<select class="select" data-campo="${esc(cel.id)}">${cel.opcoes.map(o => `<option>${esc(o)}</option>`).join('')}</select>`
            : `<input class="input" data-campo="${esc(cel.id)}">`) + '</td>').join('')}</tr>`).join('') + '</tbody></table></div>';
    }
    if (c.tipo === 'lista') {
      return `<div class="table-wrap"><table class="grade"><thead><tr><th>#</th>${c.colunas.map(k => `<th>${esc(k.titulo)}</th>`).join('')}</tr></thead><tbody>` +
        Array.from({ length: c.linhasLista || 5 }, (_, i) => `<tr><td>${i + 1}</td>${c.colunas.map(k =>
          `<td data-col="${esc(k.titulo)}"><input class="input" data-lista="${esc(c.id)}" data-i="${i}" data-k="${esc(k.id)}" placeholder="${esc(k.placeholder || '')}"></td>`).join('')}</tr>`).join('') + '</tbody></table></div>';
    }
    return '';
  }

  function blocoCampo(c, num, primeiro) {
    const classes = ['pf-q'];
    if (c.largura === 2) classes.push('w2');
    if (c.largura === 3) classes.push('w3');
    if (c.sub) classes.push('sub');
    if (primeiro) classes.push('pf-q-first');
    const req = c.obrigatorio ? '<span class="pf-req">*</span>' : '';
    const n = num ? `<span class="pf-num">${num}</span>` : '';
    const usaFor = ['texto', 'email', 'telefone', 'numero', 'data', 'textarea', 'select'].includes(c.tipo);
    const rotulo = c.tipo === 'consentimento' || !c.rotulo ? '' :
      `<${usaFor ? `label for="${safe(c.id)}"` : 'div'} class="pf-label">${n}<span>${esc(c.rotulo)}${req}</span></${usaFor ? 'label' : 'div'}>`;
    const ajuda = c.ajuda ? `<div class="pf-help">${esc(c.ajuda)}</div>` : '';
    const se = c.mostrarSe ? ` data-se='${esc(JSON.stringify(c.mostrarSe))}'` : '';
    return `<div class="${classes.join(' ')}" data-q="${esc(c.id)}"${se}>${rotulo}${ajuda}${controle(c)}<div class="pf-err" role="alert"></div></div>`;
  }

  F.renderizar = function (root, form, opts = {}) {
    const interno = !!opts.interno;
    const empresa = RH.normalizarEmpresa(opts.empresa || '');
    const secoes = form.secoes.filter(s => !s.interno || interno)
      .map(s => ({ ...s, campos: s.campos.filter(c => !c.interno || interno) }))
      .filter(s => s.campos.length);
    const passo = !!form.passoAPasso && secoes.length > 1;
    const chaveRascunho = 'rh_rascunho_' + form.id + (empresa ? '_' + empresa.toLowerCase() : '');
    let vals = {};
    let atual = 0;

    let numero = 0;
    const secoesHtml = secoes.map((s, i) => {
      const campos = s.campos.map((c, j) => {
        const num = form.numerar && !s.identificacao && !c.sub && c.tipo !== 'consentimento' ? ++numero : 0;
        return blocoCampo(c, num, j === 0);
      }).join('');
      const badge = s.interno ? `<span class="badge badge-gold" style="margin-bottom:8px">${RH.icone('cadeado',{tamanho:13})} Uso interno da consultora</span>` : '';
      return `<section class="pf-sec${s.interno ? ' pf-sec-interno' : ''}" data-sec="${i}">
        <div class="pf-sec-head">${badge}<h2>${esc(s.titulo)}</h2>${s.descricao ? `<p>${esc(s.descricao)}</p>` : ''}</div>
        <div class="pf-grid">${campos}</div></section>`;
    }).join('');

    const cat = F.categoria(form.categoria);
    const meta = [form.tempo ? `<span class="badge">${RH.icone('relogio',{tamanho:13})} ${esc(form.tempo)}</span>` : '', `<span class="badge badge-green">${RH.icone('escudo',{tamanho:13})} Respostas confidenciais</span>`,
      empresa ? `<span class="badge badge-gold">${RH.icone('clientes',{tamanho:13})} ${esc(empresa)}</span>` : '', interno ? '<span class="badge badge-blue">Modo consultora</span>' : ''].join('');

    root.innerHTML = `
      <div class="pf-hero">
        <div class="eyebrow">${esc([cat && cat.titulo, form.etapa || form.modulo].filter(Boolean).join(' · '))}</div>
        <h1>${esc(form.tituloPublico || form.titulo)}</h1>
        ${form.intro ? `<p class="pf-intro">${esc(form.intro)}</p>` : ''}
        <div class="pf-meta">${meta}</div>
      </div>
      <div class="alert alert-ok hidden no-print" id="pf-rascunho" style="margin-bottom:14px">Recuperamos o que você já tinha preenchido neste aparelho. <a href="#" id="pf-limpar">Começar do zero</a></div>
      ${passo ? `<div class="pf-steps no-print"><div class="pf-steps-top"><span id="pf-step-nome"></span><span id="pf-step-n"></span></div><div class="progress"><span id="pf-step-bar"></span></div></div>` : ''}
      <form id="pf-form" novalidate>${secoesHtml}</form>
      ${form.encerramento ? `<p class="pf-closing">${esc(form.encerramento)}</p>` : ''}
      <div class="alert alert-error hidden" id="pf-erro" role="alert"></div>
      ${form.imprimivel ? `<p class="no-print" style="text-align:center;margin-top:18px"><button type="button" class="btn btn-ghost btn-sm" id="pf-imprimir">${RH.icone('imprimir')} Imprimir formulário</button></p>` : ''}
      <nav class="pf-nav no-print"><div class="pf-nav-in">
        <span class="pf-draft hidden" id="pf-salvo">Rascunho salvo</span><span class="spacer"></span>
        ${passo ? '<button type="button" class="btn btn-sec btn-lg" id="pf-voltar">Voltar</button>' : ''}
        <button type="button" class="btn btn-lg" id="pf-avancar">Enviar respostas</button>
      </div></nav>`;

    const $ = s => root.querySelector(s);
    const $$ = s => [...root.querySelectorAll(s)];
    const secEls = $$('.pf-sec');
    const todos = secoes.flatMap(s => s.campos);
    const porId = Object.fromEntries(todos.map(c => [c.id, c]));

    // ── leitura e escrita dos controles ──
    function ler(campoId) {
      const c = porId[campoId];
      if (!c) return;
      const els = $$(`[data-campo="${CSS.escape(campoId)}"]`);
      if (c.tipo === 'radio') {
        const el = els.find(e => e.checked);
        let v = el ? el.value : '';
        if (c.outro && /^outro/i.test(v)) { const t = $(`[data-outro="${CSS.escape(campoId)}"]`).value.trim(); v = t ? 'Outro: ' + t : 'Outro'; }
        vals[campoId] = v;
      } else if (c.tipo === 'checkbox') {
        vals[campoId] = els.filter(e => e.checked).map(e => {
          if (c.outro && /^outro/i.test(e.value)) { const t = $(`[data-outro="${CSS.escape(campoId)}"]`).value.trim(); return t ? 'Outro: ' + t : 'Outro'; }
          return e.value;
        });
      } else if (c.tipo === 'consentimento') vals[campoId] = els[0].checked;
      else if (els[0]) vals[campoId] = els[0].value;
    }

    function escrever() {
      todos.forEach(c => {
        const v = vals[c.id];
        if (c.tipo === 'grade') { c.linhas.forEach(l => l.celulas.forEach(cel => { const el = $(`[data-campo="${CSS.escape(cel.id)}"]`); if (el && vals[cel.id] != null) el.value = vals[cel.id]; })); return; }
        if (c.tipo === 'lista') {
          (Array.isArray(v) ? v : []).forEach((r, i) => Object.entries(r || {}).forEach(([k, x]) => { const el = $(`[data-lista="${CSS.escape(c.id)}"][data-i="${i}"][data-k="${CSS.escape(k)}"]`); if (el) el.value = x || ''; }));
          return;
        }
        if (c.tipo === 'escala' || c.tipo === 'nps') { $$(`[data-escala="${CSS.escape(c.id)}"] button`).forEach(b => b.classList.toggle('on', String(v) === b.dataset.v)); return; }
        const els = $$(`[data-campo="${CSS.escape(c.id)}"]`);
        if (c.tipo === 'radio' || c.tipo === 'checkbox') {
          const lista = c.tipo === 'checkbox' ? (Array.isArray(v) ? v : String(v || '').split(/;\s*|,\s+/)) : [v];
          els.forEach(e => {
            const outro = c.outro && /^outro/i.test(e.value);
            const marcado = lista.some(x => x === e.value || (outro && /^outro/i.test(x || '')));
            e.checked = marcado;
            e.closest('.opt').classList.toggle('on', marcado);
            if (outro) {
              const campoOutro = $(`[data-outro="${CSS.escape(c.id)}"]`);
              campoOutro.classList.toggle('hidden', !marcado);
              const txt = lista.find(x => /^outro:\s*/i.test(x || ''));
              if (txt) campoOutro.value = txt.replace(/^outro:\s*/i, '');
            }
          });
          return;
        }
        if (c.tipo === 'consentimento') { els[0].checked = !!v; return; }
        if (els[0] && v != null) els[0].value = v;
      });
      condicionais();
    }

    function condicionais() {
      $$('[data-se]').forEach(el => {
        const cond = JSON.parse(el.dataset.se);
        // { campo: 'valor' } ou { campo: ['valor1', 'valor2'] } (qualquer um deles)
        el.classList.toggle('hidden', !Object.entries(cond).every(([k, x]) => Array.isArray(x) ? x.includes(vals[k]) : vals[k] === x));
      });
    }

    let timer;
    function salvarRascunho() {
      clearTimeout(timer);
      timer = setTimeout(() => {
        try { localStorage.setItem(chaveRascunho, JSON.stringify(vals)); $('#pf-salvo').classList.remove('hidden'); } catch {}
      }, 500);
    }

    // ── eventos ──
    root.addEventListener('input', e => {
      const t = e.target;
      if (t.dataset.lista) {
        const arr = vals[t.dataset.lista] = Array.isArray(vals[t.dataset.lista]) ? vals[t.dataset.lista] : [];
        const i = +t.dataset.i;
        arr[i] = { ...(arr[i] || {}), [t.dataset.k]: t.value };
      } else if (t.dataset.outro) ler(t.dataset.outro);
      else if (t.dataset.campo) {
        if (porId[t.dataset.campo]) ler(t.dataset.campo); else vals[t.dataset.campo] = t.value;
      } else return;
      t.closest('.pf-q')?.classList.remove('invalid');
      salvarRascunho();
    });
    root.addEventListener('change', e => {
      const t = e.target;
      if (!t.dataset.campo) return;
      const c = porId[t.dataset.campo];
      if (c && c.tipo === 'checkbox' && c.max) {
        const marcados = $$(`[data-campo="${CSS.escape(c.id)}"]:checked`);
        if (marcados.length > c.max) { t.checked = false; aviso(t, `Escolha no máximo ${c.max} opções.`); }
      }
      if (c && (c.tipo === 'radio' || c.tipo === 'checkbox')) {
        $$(`[data-campo="${CSS.escape(c.id)}"]`).forEach(x => x.closest('.opt').classList.toggle('on', x.checked));
        const outro = $(`[data-outro="${CSS.escape(c.id)}"]`);
        if (outro) {
          const ativo = $$(`[data-campo="${CSS.escape(c.id)}"]`).some(x => x.checked && /^outro/i.test(x.value));
          outro.classList.toggle('hidden', !ativo);
          if (ativo && t.checked && /^outro/i.test(t.value)) outro.focus();
        }
      }
      if (c) ler(c.id); else vals[t.dataset.campo] = t.value;
      t.closest('.pf-q')?.classList.remove('invalid');
      condicionais();
      salvarRascunho();
    });
    root.addEventListener('click', e => {
      const b = e.target.closest('[data-escala] button');
      if (!b) return;
      const id = b.parentElement.dataset.escala;
      vals[id] = b.dataset.v;
      b.parentElement.querySelectorAll('button').forEach(x => x.classList.toggle('on', x === b));
      b.closest('.pf-q').classList.remove('invalid');
      salvarRascunho();
    });

    function aviso(el, msg) {
      const q = el.closest('.pf-q');
      q.querySelector('.pf-err').textContent = msg;
      q.classList.add('invalid');
    }

    function validar(indices) {
      let primeiro = null;
      indices.forEach(i => secoes[i].campos.forEach(c => {
        const q = $(`.pf-q[data-q="${CSS.escape(c.id)}"]`);
        if (!q || q.classList.contains('hidden')) return;
        q.classList.remove('invalid');
        const v = vals[c.id];
        let msg = '';
        if (c.obrigatorio && (vazio(v) || v === false)) msg = c.tipo === 'consentimento' ? 'É preciso marcar para continuar.' : 'Responda esta pergunta para continuar.';
        else if (c.tipo === 'email' && v && !/^\S+@\S+\.\S+$/.test(v)) msg = 'Confira o e-mail.';
        if (msg) { q.querySelector('.pf-err').textContent = msg; q.classList.add('invalid'); primeiro = primeiro || q; }
      }));
      if (primeiro) { primeiro.scrollIntoView({ behavior: 'smooth', block: 'center' }); return false; }
      return true;
    }

    function mostrarPasso(i) {
      atual = i;
      secEls.forEach((el, j) => { el.classList.toggle('hidden', j !== i); el.classList.toggle('hidden-step', j !== i); });
      $('#pf-step-nome').textContent = secoes[i].titulo;
      $('#pf-step-n').textContent = `Etapa ${i + 1} de ${secoes.length}`;
      $('#pf-step-bar').style.width = ((i + 1) / secoes.length * 100) + '%';
      $('#pf-voltar').classList.toggle('hidden', i === 0);
      $('#pf-avancar').textContent = i === secoes.length - 1 ? 'Enviar respostas' : 'Continuar';
      window.scrollTo({ top: i === 0 ? 0 : root.querySelector('.pf-steps').offsetTop - 4, behavior: 'smooth' });
    }

    async function enviar() {
      if (!validar(secoes.map((_, i) => i))) {
        if (passo) { const q = $('.pf-q.invalid'); const i = +q.closest('.pf-sec').dataset.sec; mostrarPasso(i); setTimeout(() => q.scrollIntoView({ block: 'center' }), 300); }
        return;
      }
      const btn = $('#pf-avancar');
      btn.disabled = true; btn.textContent = 'Enviando…';
      $('#pf-erro').classList.add('hidden');
      const row = F.montarLinha(form, vals, empresa, opts.evento);
      try {
        await RH.salvarResposta(row);
      } catch (e) {
        btn.disabled = false; btn.textContent = 'Enviar respostas';
        const err = $('#pf-erro');
        err.textContent = 'Não foi possível enviar agora. Confira sua conexão e tente de novo — suas respostas continuam aqui.';
        err.classList.remove('hidden');
        err.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }
      try { localStorage.removeItem(chaveRascunho); } catch {}
      const quem = [row.nome, row.company].filter(Boolean).join(' — ');
      RH.enviarEmail({ subject: `[${form.titulo}] ${quem || 'Nova resposta'}`, message: F.textoResposta(form, vals), from_name: 'RH com Propósito · Formulários' });
      if (opts.aoEnviar) opts.aoEnviar(row, vals);
      telaFinal(row);
    }

    function telaFinal(row) {
      const extras = [];
      if (form.aoEnviar === 'cartilha') extras.push(`<button class="btn btn-gold btn-lg" id="pf-cartilha">${RH.icone('baixar')} Baixar a Cartilha de Cultura</button>`);
      extras.push(`<button class="btn btn-sec btn-lg" id="pf-print">${RH.icone('imprimir')} Imprimir minhas respostas</button>`);
      if (interno) extras.push('<a class="btn btn-sec btn-lg" href="../app/#/respostas/' + encodeURIComponent(form.id) + '">Ver no painel</a>');
      const copia = root.querySelector('#pf-form').outerHTML;
      root.innerHTML = `<div class="pf-end">
        <div class="pf-end-ico">${RH.logo('simbolo', 'escuro')}</div>
        <h1>Respostas enviadas!</h1>
        <p>${esc(form.agradecimento || 'Obrigada pela sua participação. Suas respostas foram recebidas e contribuirão para o desenvolvimento da equipe.')}</p>
        <div class="row" style="justify-content:center">${extras.join('')}</div>
      </div><div class="hidden" id="pf-copia">${copia}</div>`;
      window.scrollTo({ top: 0 });
      root.querySelector('#pf-cartilha')?.addEventListener('click', () => RH.baixarCartilha(vals));
      root.querySelector('#pf-print').addEventListener('click', () => {
        const c = root.querySelector('#pf-copia');
        c.classList.remove('hidden');
        c.querySelectorAll('.pf-sec').forEach(s => s.classList.remove('hidden'));
        const pend = root.querySelector('.pf-end');
        pend.classList.add('no-print');
        // repõe os valores na cópia para impressão
        const cont = c;
        Object.entries(vals).forEach(([k, v]) => {
          cont.querySelectorAll(`[data-campo="${CSS.escape(k)}"]`).forEach(el => {
            if (el.type === 'radio' || el.type === 'checkbox') el.checked = Array.isArray(v) ? v.includes(el.value) : (el.type === 'checkbox' && el.dataset.consent ? !!v : el.value === v);
            else el.value = v ?? '';
          });
        });
        window.print();
        setTimeout(() => { c.classList.add('hidden'); pend.classList.remove('no-print'); }, 400);
      });
    }

    // ── navegação ──
    $('#pf-avancar').addEventListener('click', () => {
      if (!passo || atual === secoes.length - 1) return enviar();
      if (validar([atual])) mostrarPasso(atual + 1);
    });
    $('#pf-voltar')?.addEventListener('click', () => mostrarPasso(atual - 1));
    $('#pf-imprimir')?.addEventListener('click', () => {
      secEls.forEach(s => s.classList.remove('hidden'));
      window.print();
      if (passo) mostrarPasso(atual);
    });
    root.querySelector('#pf-form').addEventListener('submit', e => e.preventDefault());

    // ── valores iniciais ──
    try {
      const r = JSON.parse(localStorage.getItem(chaveRascunho) || 'null');
      if (r && Object.keys(r).length) { vals = r; $('#pf-rascunho').classList.remove('hidden'); }
    } catch {}
    todos.forEach(c => {
      if (vazio(vals[c.id]) && c.hoje) vals[c.id] = RH.hoje();
      if (vazio(vals[c.id]) && empresa && (c.preencherComEmpresa || c.id === 'company')) vals[c.id] = empresa;
      if (vazio(vals[c.id]) && c.padrao) vals[c.id] = c.padrao;
      if (c.tipo === 'grade') c.linhas.forEach(l => l.celulas.forEach(cel => { if (cel.tipo === 'select' && vals[cel.id] == null) vals[cel.id] = cel.opcoes[0]; }));
    });
    escrever();
    $('#pf-limpar').addEventListener('click', e => {
      e.preventDefault();
      try { localStorage.removeItem(chaveRascunho); } catch {}
      location.reload();
    });
    if (passo) mostrarPasso(0);
  };
})();
