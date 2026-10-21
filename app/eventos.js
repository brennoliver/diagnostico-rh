// ═══════════════════════════════════════════════════
// Área da consultora — eventos
// Um evento reúne os formulários enviados antes, durante e depois do
// encontro, a lista de presença e a satisfação dos participantes.
// ═══════════════════════════════════════════════════
(function () {
  const A = window.App, F = window.RHF, RH = window.RH, esc = RH.esc;
  const T = A.telas, ic = A.ic;
  const { cabecalho, stat, ligarRespostas } = A.ui;

  // Formulários que fazem sentido num evento, na ordem da jornada
  const FASES = { pre_palestra_executivo: 'Antes', confirmacao_evento: 'Convite', questionario: 'Durante', pesquisa_experiencia: 'Depois' };
  const PADRAO = Object.keys(FASES);
  const STATUS = { planejado: ['Planejado', 'badge-blue'], realizado: ['Realizado', 'badge-green'], cancelado: ['Cancelado', ''] };
  const badge = s => { const [t, c] = STATUS[s] || STATUS.planejado; return `<span class="badge ${c}">${t}</span>`; };
  const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
  const tile = (ev, grande = false) => {
    if (!ev.data) return `<div class="data-tile sem${grande ? ' grande' : ''}"><span class="mes">—</span><span class="dia">sem data</span></div>`;
    const [, m, d] = ev.data.split('-');
    return `<div class="data-tile${A.eventoFuturo(ev) ? '' : ' passado'}${grande ? ' grande' : ''}"><span class="mes">${MESES[+m - 1]}</span><span class="dia">${+d}</span></div>`;
  };

  const confForm = () => F.get('confirmacao_evento');
  const doEvento = (ev, respostas) => respostas.filter(r => r.evento_id === ev.id);
  const confirmacoes = (ev, respostas) => doEvento(ev, respostas).filter(r => r.section === 'confirmacao_evento')
    .map(r => { const v = F.valores(confForm(), r).v; return { id: String(r.id), nome: v.nome || r.nome || '—', setor: v.setor || r.cargo_setor || '', participacao: v.participacao || '', motivo: v.motivo || '', row: r }; });
  const lista = (ev, respostas) => [
    ...confirmacoes(ev, respostas),
    ...(ev.participantes || []).map(p => ({ ...p, participacao: 'Sem confirmação', manual: true }))
  ].sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
  const resumo = (ev, respostas) => {
    const l = lista(ev, respostas);
    return { sim: l.filter(p => p.participacao === 'Sim').length, nao: l.filter(p => p.participacao === 'Não').length,
      presentes: l.filter(p => (ev.presenca || {})[p.id]).length, total: l.length, respostas: doEvento(ev, respostas).length };
  };

  // ── Criar / editar evento ──────────────────────────────
  async function editarEvento(ev = {}, aoSalvar) {
    const clientes = await A.clientes().catch(() => []);
    const marcados = new Set(ev.id ? ev.formularios || [] : PADRAO);
    const outros = F.lista().filter(f => !f.interno && !PADRAO.includes(f.id));
    const chk = f => `<label class="check" style="padding:6px 0"><input type="checkbox" value="${f.id}"${marcados.has(f.id) ? ' checked' : ''}><span>${esc(f.titulo)}${FASES[f.id] ? ` <span class="badge" style="margin-left:4px">${FASES[f.id]}</span>` : ''}</span></label>`;
    const m = A.modal({
      titulo: ev.id ? 'Editar evento' : 'Novo evento',
      corpo: `<div class="field"><label class="label" for="e-nome">Nome do evento *</label><input class="input" id="e-nome" value="${esc(ev.nome || '')}" placeholder="Ex.: Palestra Construindo Juntos — Loja Conceição"></div>
        <div class="field"><label class="label" for="e-cli">Empresa</label><select class="select" id="e-cli"><option value="">Sem empresa</option>${clientes.map(c => `<option value="${c.id}"${c.id === ev.cliente_id ? ' selected' : ''}>${esc(c.nome)}</option>`).join('')}</select></div>
        <div class="field-row c3"><div class="field"><label class="label" for="e-data">Data</label><input class="input" id="e-data" type="date" value="${esc(ev.data || '')}"></div>
          <div class="field"><label class="label" for="e-hora">Horário</label><input class="input" id="e-hora" value="${esc(ev.horario || '')}" placeholder="19h às 21h"></div>
          <div class="field"><label class="label" for="e-status">Situação</label><select class="select" id="e-status">${Object.entries(STATUS).map(([k, [t]]) => `<option value="${k}"${(ev.status || 'planejado') === k ? ' selected' : ''}>${t}</option>`).join('')}</select></div></div>
        <div class="field"><label class="label" for="e-local">Local</label><input class="input" id="e-local" value="${esc(ev.local || '')}" placeholder="Endereço ou nome do espaço"></div>
        <div class="field"><label class="label" for="e-desc">Descrição</label><textarea class="textarea" id="e-desc" rows="2">${esc(ev.descricao || '')}</textarea></div>
        <div class="field"><div class="label">Formulários do evento</div><div class="form-checks" id="e-forms">${PADRAO.map(id => chk(F.get(id))).join('')}</div>
          <details style="margin-top:8px"><summary class="small" style="cursor:pointer;font-weight:800;color:var(--green)">Outros formulários</summary><div class="form-checks" style="margin-top:8px">${outros.map(chk).join('')}</div></details></div>
        <div class="alert alert-error hidden" id="e-erro"></div>`,
      rodape: `${ev.id ? `<button class="btn btn-danger" data-del>${ic('lixeira', 16)} Excluir</button><span class="spacer"></span>` : ''}<button class="btn btn-sec" data-fechar>Cancelar</button><button class="btn" data-salvar>${ic('ok', 16)} Salvar</button>`
    });
    const $ = s => m.el.querySelector(s);
    $('[data-salvar]').addEventListener('click', async () => {
      const nome = $('#e-nome').value.trim();
      if (!nome) { $('#e-erro').textContent = 'Dê um nome ao evento.'; $('#e-erro').classList.remove('hidden'); return; }
      const dados = { id: ev.id, nome, cliente_id: $('#e-cli').value || null, data: $('#e-data').value || null, horario: $('#e-hora').value.trim(), local: $('#e-local').value.trim(),
        descricao: $('#e-desc').value.trim(), status: $('#e-status').value, formularios: [...m.el.querySelectorAll('.form-checks input:checked')].map(i => i.value) };
      try {
        const salvo = await A.salvarEvento(dados);
        m.fechar(); A.toast('Evento salvo.');
        if (aoSalvar) aoSalvar(salvo); else A.ir('/eventos/' + salvo.id);
      } catch (e) { $('#e-erro').textContent = e.message; $('#e-erro').classList.remove('hidden'); }
    });
    $('[data-del]')?.addEventListener('click', async () => {
      if (!await A.confirmar(`Excluir o evento "${ev.nome}"? As respostas continuam guardadas, só deixam de estar ligadas a ele.`, { ok: 'Excluir', perigo: true })) return;
      try { await A.excluirEvento(ev.id); m.fechar(); A.toast('Evento excluído.'); A.ir('/eventos'); } catch (e) { A.toast(e.message); }
    });
  }
  A.editarEvento = editarEvento;

  // ═════════════════════════ LISTA DE EVENTOS ═════════════════════════
  T.eventos = async (main, _, q) => {
    const [eventos, respostas, clientes] = await Promise.all([A.eventos(), A.respostas(), A.clientes()]);
    const cli = id => clientes.find(c => c.id === id);
    const futuros = eventos.filter(A.eventoFuturo).sort((a, b) => a.data.localeCompare(b.data));
    const outros = eventos.filter(e => !A.eventoFuturo(e));
    let filtro = q.get('ver') || (futuros.length ? 'proximos' : 'todos');
    const confirmados = eventos.reduce((s, e) => s + resumo(e, respostas).sim, 0);
    const presentes = eventos.reduce((s, e) => s + resumo(e, respostas).presentes, 0);

    main.innerHTML = `<div class="page">
      ${cabecalho({ icone: 'agenda', titulo: 'Eventos', sub: 'Palestras e encontros: formulários, lista de presença e satisfação de cada um.', acoes: `<button class="btn" data-novo>${ic('mais', 16)} Novo evento</button>` })}
      <div class="stat-strip">${stat('calendario', futuros.length, 'Próximos')}${stat('ok', eventos.filter(e => e.status === 'realizado').length, 'Realizados')}${stat('pessoas', confirmados, 'Confirmações', true)}${stat('selecao', presentes, 'Presenças')}</div>
      <div class="seg"><button data-ver="proximos">${ic('calendario', 15)} Próximos <span class="n">${futuros.length}</span></button><button data-ver="passados">${ic('relogio', 15)} Anteriores <span class="n">${outros.length}</span></button><button data-ver="todos">Todos <span class="n">${eventos.length}</span></button></div>
      <div id="lista"></div></div>`;

    const cartao = ev => {
      const r = resumo(ev, respostas), c = cli(ev.cliente_id);
      return `<a class="card ev-card" href="#/eventos/${ev.id}" data-ev="${ev.id}">
        <div class="ev-top">${tile(ev)}<div style="min-width:0;flex:1"><div class="row-between" style="flex-wrap:nowrap;align-items:flex-start"><div class="ev-nome">${esc(ev.nome)}</div>${badge(ev.status)}</div>
          <div class="ev-meta">${c ? `<span>${ic('clientes', 14)} ${esc(c.nome)}</span>` : ''}${ev.horario || ev.local ? `<span>${ic('local', 14)} ${esc([ev.horario, ev.local].filter(Boolean).join(' · '))}</span>` : ''}</div></div></div>
        <div class="cli-nums"><div><strong>${r.sim}</strong><span>confirmados</span></div><div><strong>${r.presentes}</strong><span>presentes</span></div><div><strong>${r.respostas}</strong><span>respostas</span></div></div>
        <div class="ev-forms">${(ev.formularios || []).map(id => `<span class="badge">${ic(F.get(id)?.icone || 'documento', 13)} ${esc(FASES[id] || F.rotulo(id))}</span>`).join('')}</div></a>`;
    };
    const desenhar = () => {
      main.querySelectorAll('[data-ver]').forEach(b => b.classList.toggle('active', b.dataset.ver === filtro));
      const l = filtro === 'proximos' ? futuros : filtro === 'passados' ? outros : eventos;
      main.querySelector('#lista').innerHTML = l.length ? `<div class="grid grid-3">${l.map(cartao).join('')}</div>`
        : `<div class="card">${A.vazio('agenda', eventos.length ? 'Nenhum evento aqui' : 'Nenhum evento criado ainda', eventos.length ? 'Veja as outras abas.' : 'Crie um evento para reunir convite, lista de presença, questionários e pesquisa de satisfação.', `<button class="btn" data-novo2>${ic('mais', 16)} Novo evento</button>`)}</div>`;
      main.querySelector('[data-novo2]')?.addEventListener('click', () => editarEvento());
    };
    desenhar();
    main.querySelectorAll('[data-ver]').forEach(b => b.addEventListener('click', () => { filtro = b.dataset.ver; desenhar(); }));
    main.querySelector('[data-novo]').addEventListener('click', () => editarEvento());
  };

  // ═════════════════════════ UM EVENTO ═════════════════════════
  T.evento = async (main, [id]) => {
    const [eventos, respostas, clientes] = await Promise.all([A.eventos(), A.respostas(), A.clientes()]);
    const ev = eventos.find(e => e.id === id);
    if (!ev) { main.innerHTML = `<div class="page"><div class="card">${A.vazio('busca', 'Evento não encontrado', '', '<a class="btn" href="#/eventos">Ver eventos</a>')}</div></div>`; return; }
    ev.presenca = ev.presenca || {};
    ev.participantes = ev.participantes || [];
    const c = clientes.find(x => x.id === ev.cliente_id);
    const rsEv = doEvento(ev, respostas);
    const r = resumo(ev, respostas);
    const temPesquisa = (ev.formularios || []).includes('pesquisa_experiencia');
    const fp = F.get('pesquisa_experiencia');
    const nps = F.nps(rsEv.filter(x => x.section === 'pesquisa_experiencia').map(x => F.valores(fp, x).v.q8_nps).filter(v => v !== '' && v != null));
    let busca = '';

    main.innerHTML = `<div class="page">
      <a class="back" href="#/eventos">${ic('voltar', 16)} Eventos</a>
      <section class="card perfil">
        <div class="perfil-capa"><span class="logo" data-logo="simbolo" data-tema="escuro"></span></div>
        <div class="perfil-corpo">${tile(ev, true)}
          <div class="perfil-info">${badge(ev.status)}<h1>${esc(ev.nome)}</h1>
            <div class="perfil-contatos">
              ${c ? `<a href="#/clientes/${c.id}">${ic('clientes', 14)} ${esc(c.nome)}</a>` : ''}
              <span>${ic('calendario', 14)} ${esc(A.dataEvento(ev))}${ev.horario ? ' · ' + esc(ev.horario) : ''}</span>
              ${ev.local ? `<span>${ic('local', 14)} ${esc(ev.local)}</span>` : ''}
            </div>${ev.descricao ? `<p class="muted" style="margin-top:10px">${esc(ev.descricao)}</p>` : ''}</div>
          <div class="perfil-acoes"><button class="btn btn-sec" data-editar>${ic('editar', 16)} Editar</button><button class="btn btn-sec" data-imprimir>${ic('imprimir', 16)} Lista de presença</button><button class="btn btn-gold" data-enviar>${ic('enviar', 16)} Enviar formulário</button></div>
        </div>
      </section>
      <div class="stat-strip">${stat('ok', r.sim, 'Confirmados')}${stat('fechar', r.nao, 'Não vão')}${stat('selecao', r.presentes, 'Presentes', true)}${stat(temPesquisa ? 'estrela' : 'respostas', temPesquisa ? (nps ? nps.score : '—') : r.respostas, temPesquisa ? 'NPS do evento' : 'Respostas')}</div>
      ${(ev.formularios || []).includes('confirmacao_evento') ? `
      <section class="card convite">
        <div class="convite-ico">${ic('agenda', 26)}</div>
        <div class="convite-corpo"><div class="kpi-label">Link de confirmação de presença</div>
          <p class="muted small" style="margin:4px 0 12px">Envie aos convidados. Cada confirmação entra direto na lista de presença deste evento.</p>
          <div class="row" style="flex-wrap:nowrap"><input class="input" id="cv-link" readonly value="${esc(A.link('confirmacao_evento', c ? c.nome : '', ev.id))}" aria-label="Link de confirmação"><button class="btn btn-sec" data-cv-copiar>${ic('copiar', 16)} Copiar</button></div>
          <div class="row" style="margin-top:12px"><a class="btn btn-wa btn-sm" id="cv-wa" target="_blank" rel="noopener">${ic('whatsapp', 15)} Enviar no WhatsApp</a><a class="btn btn-sec btn-sm" id="cv-email">${ic('email', 15)} E-mail</a>
            <a class="btn btn-ghost btn-sm" href="${A.linkPreencher('confirmacao_evento', c ? c.nome : '', ev.id)}" target="_blank" rel="noopener">${ic('olho', 15)} Ver como o convidado vê</a>
            <span class="spacer"></span><span class="badge badge-green">${A.plural(r.sim, 'confirmado', 'confirmados')}</span>${r.nao ? `<span class="badge badge-red">${r.nao} não ${r.nao === 1 ? 'vai' : 'vão'}</span>` : ''}</div></div>
      </section>` : `
      <section class="card card-pad row-between" style="margin-bottom:18px"><span class="row">${ic('agenda', 20)} <span><strong>Este evento ainda não tem confirmação de presença.</strong><br><span class="small muted">Adicione para ter o link do convite e a lista de presença automática.</span></span></span>
        <button class="btn btn-sm" data-add-conf>${ic('mais', 15)} Adicionar confirmação</button></section>`}
      <div class="grid grid-3" style="align-items:start">
        <div class="stack" style="gap:18px">
          <div class="card"><div class="card-head"><h2>Jornada do evento</h2><button class="btn btn-ghost btn-sm" data-vincular title="Vincular respostas recebidas sem evento">${ic('link', 15)} Vincular</button></div><div class="jornada">
            ${(ev.formularios || []).length ? ev.formularios.map(fid => { const f = F.get(fid); if (!f) return ''; const n = rsEv.filter(x => x.section === fid).length;
              return `<div class="passo${n ? ' feito' : ''}"><span class="passo-ico">${ic(n ? 'ok' : f.icone, 17)}</span>
                <span class="list-main">${FASES[fid] ? `<span class="fase">${FASES[fid]}</span>` : ''}<span class="list-title" style="font-size:14px">${esc(f.titulo)}</span>
                <span class="list-sub">${n ? `<a href="#/respostas/${fid}?evento=${ev.id}">${A.plural(n, 'resposta', 'respostas')}</a>` : 'nenhuma resposta ainda'}</span></span>
                <button class="btn btn-sec btn-sm btn-icon" data-enviar-f="${fid}" aria-label="Enviar ${esc(f.titulo)}">${ic('enviar', 15)}</button></div>`; }).join('')
              : A.vazio('formularios', 'Nenhum formulário escolhido', 'Edite o evento para escolher os formulários.')}
          </div></div>
          ${temPesquisa ? `<div class="card card-pad"><div class="kpi-label">Satisfação do evento</div>${nps ? `${A.medidor(nps.score)}<div style="text-align:center;margin-top:-30px"><div class="nps-big gauge-num" data-contar="${nps.score}">${nps.score}</div>
            <div class="small muted">${A.plural(nps.n, 'avaliação', 'avaliações')} · <a href="#/respostas/pesquisa_experiencia?evento=${ev.id}&aba=resumo">ver resumo</a></div></div>` : `<p class="muted" style="margin-top:10px">Envie a Pesquisa de Experiência depois do evento.</p><button class="btn btn-sm" style="margin-top:12px" data-enviar-f="pesquisa_experiencia">${ic('enviar', 15)} Enviar pesquisa</button>`}</div>` : ''}
        </div>
        <div class="card" style="grid-column:span 2"><div class="card-head"><h2>Lista de presença</h2>
            <div class="row"><button class="btn btn-sec btn-sm" data-csv>${ic('baixar', 15)} Planilha</button><button class="btn btn-sm" data-add>${ic('mais', 15)} Participante</button></div></div>
          <div class="card-body" style="padding-bottom:0"><div class="search"><input class="input" id="p-busca" placeholder="Buscar participante…" aria-label="Buscar participante"></div></div>
          <div id="p-lista"></div></div>
      </div></div>`;

    const salvarPresenca = A.debounce(async () => {
      try { await A.salvarEvento({ id: ev.id, presenca: ev.presenca, participantes: ev.participantes }); }
      catch (e) { A.toast(e.message); }
    }, 500);

    const desenharLista = () => {
      const k = A.chave(busca);
      const l = lista(ev, respostas).filter(p => !k || A.chave(p.nome + ' ' + p.setor).includes(k));
      const alvo = main.querySelector('#p-lista');
      if (!lista(ev, respostas).length) {
        alvo.innerHTML = A.vazio('pessoas', 'Ninguém na lista ainda', 'As confirmações de presença enviadas pelo link do evento aparecem aqui. Você também pode incluir participantes à mão.',
          (ev.formularios || []).includes('confirmacao_evento') ? `<button class="btn" data-enviar-conv>${ic('enviar', 16)} Enviar convite</button>` : '');
        alvo.querySelector('[data-enviar-conv]')?.addEventListener('click', () => A.abrirEnvio({ formId: 'confirmacao_evento', empresa: c ? c.nome : '', evento: ev }));
        return;
      }
      const conf = p => p.participacao === 'Sim' ? '<span class="badge badge-green">Confirmou</span>' : p.participacao === 'Não' ? `<span class="badge badge-red" title="${esc(p.motivo)}">Não vai</span>` : '<span class="badge">Sem confirmação</span>';
      alvo.innerHTML = `<div class="table-wrap"><table class="table presenca"><thead><tr><th>Nome</th><th>Setor</th><th>Convite</th><th>Presença</th><th></th></tr></thead><tbody>
        ${l.map(p => `<tr><td><div class="cell-ident"><span class="avatar${p.manual ? ' gold' : ''}">${esc(A.iniciais(p.nome))}</span><strong>${esc(p.nome)}</strong></div></td><td>${esc(p.setor || '—')}</td><td>${conf(p)}</td>
          <td><label class="toggle"><input type="checkbox" data-pres="${esc(p.id)}"${ev.presenca[p.id] ? ' checked' : ''}><i></i><span>${ev.presenca[p.id] ? 'Presente' : 'Ausente'}</span></label></td>
          <td class="num">${p.manual ? `<button class="btn btn-ghost btn-sm btn-icon" data-rem="${esc(p.id)}" aria-label="Remover ${esc(p.nome)}">${ic('lixeira', 15)}</button>` : `<button class="btn btn-ghost btn-sm btn-icon" data-ver="${esc(p.id)}" aria-label="Ver confirmação de ${esc(p.nome)}">${ic('olho', 15)}</button>`}</td></tr>`).join('')}
        </tbody></table></div>${!l.length ? A.vazio('busca', 'Ninguém encontrado') : ''}`;
      alvo.querySelectorAll('[data-pres]').forEach(cb => cb.addEventListener('change', () => {
        if (cb.checked) ev.presenca[cb.dataset.pres] = true; else delete ev.presenca[cb.dataset.pres];
        cb.parentElement.querySelector('span').textContent = cb.checked ? 'Presente' : 'Ausente';
        main.querySelector('.stat-strip .stat:nth-child(3) .stat-n').textContent = resumo(ev, respostas).presentes;
        salvarPresenca();
      }));
      alvo.querySelectorAll('[data-rem]').forEach(b => b.addEventListener('click', async () => {
        ev.participantes = ev.participantes.filter(p => p.id !== b.dataset.rem);
        delete ev.presenca[b.dataset.rem];
        salvarPresenca(); desenharLista();
      }));
      alvo.querySelectorAll('[data-ver]').forEach(b => b.addEventListener('click', () => A.abrirResposta(respostas.find(x => String(x.id) === b.dataset.ver), () => A.recarregar())));
    };
    desenharLista();
    A.animar(main);

    main.querySelector('#p-busca').addEventListener('input', e => { busca = e.target.value; desenharLista(); });
    main.querySelector('[data-add]').addEventListener('click', () => {
      const m = A.modal({ titulo: 'Incluir participante',
        corpo: `<p class="muted" style="margin-bottom:14px">Para quem chegou sem ter confirmado pelo link.</p><div class="field"><label class="label" for="pa-nome">Nome *</label><input class="input" id="pa-nome"></div><div class="field"><label class="label" for="pa-setor">Setor</label><input class="input" id="pa-setor"></div>
          <label class="check"><input type="checkbox" id="pa-pres" checked><span>Marcar como presente</span></label>`,
        rodape: `<button class="btn btn-sec" data-fechar>Cancelar</button><button class="btn" data-ok>${ic('mais', 16)} Incluir</button>` });
      m.el.querySelector('[data-ok]').addEventListener('click', () => {
        const nome = RH.normalizarEmpresa(m.el.querySelector('#pa-nome').value);
        if (!nome) { m.el.querySelector('#pa-nome').focus(); return; }
        const p = { id: 'm-' + Date.now().toString(36), nome, setor: m.el.querySelector('#pa-setor').value.trim() };
        ev.participantes.push(p);
        if (m.el.querySelector('#pa-pres').checked) ev.presenca[p.id] = true;
        m.fechar(); salvarPresenca(); desenharLista();
        main.querySelector('.stat-strip .stat:nth-child(3) .stat-n').textContent = resumo(ev, respostas).presentes;
      });
    });
    main.querySelector('[data-imprimir]').addEventListener('click', () => {
      const l = lista(ev, respostas).filter(p => p.participacao !== 'Não');
      const linhas = l.map((p, i) => `<tr><td style="width:36px">${i + 1}</td><td>${esc(p.nome)}</td><td>${esc(p.setor || '')}</td><td style="width:42%"></td></tr>`).join('')
        + Array.from({ length: 8 }, (_, i) => `<tr><td>${l.length + i + 1}</td><td></td><td></td><td></td></tr>`).join('');
      A.imprimir('Lista de presença — ' + ev.nome, `<p class="muted" style="margin-bottom:14px">${esc([c && c.nome, A.dataEvento(ev), ev.horario, ev.local].filter(Boolean).join(' · '))}</p>
        <table style="width:100%;border-collapse:collapse;font-size:13px">${'<tr>' + ['Nº', 'Nome', 'Setor', 'Assinatura'].map(h => `<th style="text-align:left;border-bottom:2px solid #1A5C45;padding:8px">${h}</th>`).join('') + '</tr>'}
        ${linhas.replace(/<td/g, '<td style="border-bottom:1px solid #ddd;padding:12px 8px"')}</table>`);
    });
    main.querySelector('[data-csv]').addEventListener('click', () => {
      const q = s => '"' + String(s ?? '').replace(/"/g, '""') + '"';
      const linhas = [['Nome', 'Setor', 'Convite', 'Motivo', 'Presença'], ...lista(ev, respostas).map(p => [p.nome, p.setor, p.participacao, p.motivo || '', ev.presenca[p.id] ? 'Presente' : 'Ausente'])];
      const blob = new Blob(['﻿' + linhas.map(l => l.map(q).join(';')).join('\r\n')], { type: 'text/csv;charset=utf-8' });
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `presenca_${RH.hoje()}.csv`; a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    });
    main.querySelector('[data-editar]').addEventListener('click', () => editarEvento(ev, () => A.recarregar()));
    const enviar = fid => A.abrirEnvio({ formId: fid, empresa: c ? c.nome : '', evento: ev });
    main.querySelector('[data-enviar]').addEventListener('click', () => enviar((ev.formularios || [])[0] || ''));
    main.querySelectorAll('[data-enviar-f]').forEach(b => b.addEventListener('click', () => enviar(b.dataset.enviarF)));
    main.querySelector('[data-vincular]').addEventListener('click', () => vincularRespostas(ev, respostas, c));

    // Link de confirmação
    const cvLink = main.querySelector('#cv-link');
    if (cvLink) {
      const quando = [ev.data && A.dataEvento(ev), ev.horario].filter(Boolean).join(', ');
      const msg = `Olá! Você é nosso convidado especial para *${ev.nome}*${quando ? ' — ' + quando : ''}${ev.local ? ', em ' + ev.local : ''}.\n\nConfirme sua presença por este link (leva 1 minuto):\n${cvLink.value}\n\nAté lá!\n${RH_CONFIG.consultora} · RH com Propósito`;
      main.querySelector('#cv-wa').href = 'https://wa.me/?text=' + encodeURIComponent(msg);
      main.querySelector('#cv-email').href = 'mailto:?subject=' + encodeURIComponent('Convite: ' + ev.nome) + '&body=' + encodeURIComponent(msg);
      main.querySelector('[data-cv-copiar]').addEventListener('click', () => A.copiar(cvLink.value));
    }
    main.querySelector('[data-add-conf]')?.addEventListener('click', async () => {
      try { await A.salvarEvento({ id: ev.id, formularios: ['confirmacao_evento', ...(ev.formularios || [])] }); A.toast('Confirmação de presença adicionada.'); A.recarregar(); }
      catch (e) { A.toast(e.message); }
    });
  };

  // ── Ligar respostas antigas a um evento ──────────────
  function vincularRespostas(ev, respostas, c) {
    const forms = (ev.formularios || []).length ? ev.formularios : PADRAO;
    const perto = r => !ev.data || Math.abs(new Date(r.created_at || A.dataResp(r)) - new Date(ev.data + 'T12:00:00')) <= 21 * 864e5;
    let soPerto = !!ev.data, formSel = '';
    const m = A.modal({ titulo: 'Vincular respostas ao evento', largo: true,
      corpo: `<p class="muted">Respostas recebidas antes de o evento existir no sistema (ou por um link sem evento). As escolhidas passam a contar neste evento.</p>
        <div class="row" style="margin-top:14px"><select class="select" id="vr-form" style="max-width:320px" aria-label="Formulário"><option value="">Todos os formulários do evento</option>${forms.map(id => `<option value="${id}">${esc(F.rotulo(id))}</option>`).join('')}</select>
          ${ev.data ? `<label class="check" style="padding:0"><input type="checkbox" id="vr-perto" checked><span>Só até 3 semanas antes ou depois do evento</span></label>` : ''}
          <span class="spacer"></span><label class="check" style="padding:0"><input type="checkbox" id="vr-todos"><span>Marcar todas</span></label></div>
        <div class="vinc-lista" id="vr-lista"></div>`,
      rodape: `<span class="small muted" id="vr-n"></span><span class="spacer"></span><button class="btn btn-sec" data-fechar>Cancelar</button><button class="btn" data-ok>${ic('link', 16)} Vincular</button>` });
    const $ = s => m.el.querySelector(s);
    const candidatas = () => respostas.filter(r => !r.evento_id && forms.includes(r.section) && (!formSel || r.section === formSel) && (!soPerto || perto(r)));
    const contar = () => { const n = m.el.querySelectorAll('#vr-lista input:checked').length; $('#vr-n').textContent = n ? A.plural(n, 'resposta selecionada', 'respostas selecionadas') : ''; };
    const desenhar = () => {
      const l = candidatas();
      $('#vr-lista').innerHTML = l.length ? l.map(r => `<label class="vinc-item"><input type="checkbox" value="${esc(r.id)}"><span class="list-main"><span class="list-title">${esc(r.nome || 'Sem identificação')}</span>
        <span class="list-sub">${esc(F.rotulo(r.section))} · ${esc(r.company || r.cargo_setor || '—')} · ${esc(A.dataBR(A.dataResp(r)))}</span></span></label>`).join('')
        : A.vazio('respostas', 'Nenhuma resposta sem evento', soPerto ? 'Desmarque o filtro de datas para ver mais.' : '');
      $('#vr-todos').checked = false; contar();
    };
    desenhar();
    $('#vr-form').addEventListener('change', e => { formSel = e.target.value; desenhar(); });
    $('#vr-perto')?.addEventListener('change', e => { soPerto = e.target.checked; desenhar(); });
    $('#vr-todos').addEventListener('change', e => { m.el.querySelectorAll('#vr-lista input').forEach(i => { i.checked = e.target.checked; }); contar(); });
    $('#vr-lista').addEventListener('change', contar);
    $('[data-ok]').addEventListener('click', async () => {
      const ids = [...m.el.querySelectorAll('#vr-lista input:checked')].map(i => i.value);
      if (!ids.length) { A.toast('Escolha ao menos uma resposta.'); return; }
      try { await A.vincularAoEvento(ids, ev.id); m.fechar(); A.toast(A.plural(ids.length, 'resposta vinculada', 'respostas vinculadas') + '.'); A.recarregar(); }
      catch (e) { A.toast(e.message); }
    });
  }

  // Próximos eventos (usado no Início e na ficha do cliente)
  A.cartoesEventos = (eventos, respostas, clientes, limite = 3) => eventos.slice(0, limite).map(ev => {
    const r = resumo(ev, respostas), c = clientes.find(x => x.id === ev.cliente_id);
    return `<a class="list-item" href="#/eventos/${ev.id}">${tile(ev)}<span class="list-main"><span class="list-title">${esc(ev.nome)}</span>
      <span class="list-sub">${esc([c && c.nome, ev.horario].filter(Boolean).join(' · ') || A.dataEvento(ev))}</span><span class="list-sub">${A.plural(r.sim, 'confirmado', 'confirmados')}</span></span><span class="seta">${ic('direita', 18)}</span></a>`;
  }).join('');
})();
