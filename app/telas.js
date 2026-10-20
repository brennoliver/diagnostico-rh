// ═══════════════════════════════════════════════════
// Área da consultora — telas
// ═══════════════════════════════════════════════════
(function () {
  const A = window.App, F = window.RHF, RH = window.RH, esc = RH.esc;
  const T = A.telas;

  const cabecalho = ({ eyebrow = '', titulo, sub = '', acoes = '', voltar = '' }) => `
    ${voltar ? `<a class="back" href="${voltar[0]}">← ${esc(voltar[1])}</a>` : ''}
    <div class="page-head"><div>${eyebrow ? `<div class="eyebrow">${eyebrow}</div>` : ''}<h1>${esc(titulo)}</h1>${sub ? `<p>${sub}</p>` : ''}</div>
    ${acoes ? `<div class="row">${acoes}</div>` : ''}</div>`;

  const STATUS = { ativo: ['Ativo', 'badge-green'], prospect: ['Prospect', 'badge-blue'], encerrado: ['Encerrado', ''] };
  const badgeStatus = s => { const [t, c] = STATUS[s] || STATUS.ativo; return `<span class="badge ${c}">${t}</span>`; };

  const itemResposta = (r, cli, mostrarForm = true) => {
    const f = F.get(r.section);
    const quem = [r.nome, cli ? cli.nome : r.company].filter(Boolean).join(' · ') || 'Sem identificação';
    return `<button class="list-item" data-resp="${esc(r.id)}">
      <span class="list-icon">${f ? f.icone : '📄'}</span>
      <span class="list-main"><span class="list-title">${esc(mostrarForm ? (f ? f.titulo : r.section) : quem)}</span>
      <span class="list-sub">${esc(mostrarForm ? quem : (r.cargo_setor || ''))}</span></span>
      <span class="list-end">${esc(A.relativo(r.created_at || A.dataResp(r)))}</span></button>`;
  };
  const ligarRespostas = (el, respostas, depois) => el.querySelectorAll('[data-resp]').forEach(b =>
    b.addEventListener('click', () => A.abrirResposta(respostas.find(r => String(r.id) === b.dataset.resp), depois)));

  const npsDe = respostas => {
    const f = F.get('pesquisa_experiencia');
    return F.nps(respostas.filter(r => r.section === 'pesquisa_experiencia').map(r => F.valores(f, r).v.q8_nps).filter(v => v !== '' && v != null));
  };

  // ═════════════════════════ INÍCIO ═════════════════════════
  T.inicio = async main => {
    const [respostas, clientes] = await Promise.all([A.respostas(), A.clientes()]);
    const idx = A.indice(clientes);
    const ult7 = respostas.filter(r => A.dentroDe(r, 7)).length;
    const nps = npsDe(respostas);
    const ativos = clientes.filter(c => c.status === 'ativo').length;
    const sem = A.semCadastro(respostas, clientes);
    const hoje = new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });

    main.innerHTML = `<div class="page">
      ${cabecalho({ eyebrow: esc(hoje), titulo: `${A.saudacao()}, ${RH_CONFIG.consultora}`, sub: 'Aqui está o resumo do seu trabalho.',
        acoes: '<button class="btn btn-sec" data-novo-cliente>+ Novo cliente</button><button class="btn" data-enviar-form>Enviar formulário</button>' })}
      <div class="grid grid-4">
        <a class="card kpi" href="#/respostas" style="text-decoration:none"><div class="kpi-label">Respostas</div><div class="kpi-value">${respostas.length}</div><div class="kpi-sub">${ult7 ? `+${ult7} nos últimos 7 dias` : 'nenhuma nesta semana'}</div></a>
        <a class="card kpi" href="#/clientes" style="text-decoration:none"><div class="kpi-label">Clientes</div><div class="kpi-value">${clientes.length}</div><div class="kpi-sub">${A.plural(ativos, 'ativo', 'ativos')}</div></a>
        <a class="card kpi" href="#/formularios" style="text-decoration:none"><div class="kpi-label">Formulários</div><div class="kpi-value">${F.lista().length}</div><div class="kpi-sub">prontos para enviar</div></a>
        <a class="card kpi" href="#/satisfacao" style="text-decoration:none"><div class="kpi-label">NPS</div><div class="kpi-value">${nps ? nps.score : '—'}</div><div class="kpi-sub">${nps ? A.plural(nps.n, 'avaliação', 'avaliações') : 'sem avaliações ainda'}</div></a>
      </div>
      ${sem.length ? `<div class="alert alert-warn" style="margin-top:16px">🏢 ${A.plural(sem.length, 'empresa respondeu', 'empresas responderam')} e ainda não ${sem.length === 1 ? 'está cadastrada' : 'estão cadastradas'} como cliente. <a href="#/clientes">Organizar agora</a></div>` : ''}
      <div class="grid grid-2" style="margin-top:16px;align-items:start">
        <div class="card"><div class="card-head"><h2>Respostas recentes</h2><a class="small" href="#/respostas">Ver todas</a></div>
          <div class="list">${respostas.slice(0, 8).map(r => itemResposta(r, A.clienteDe(r, idx))).join('') || A.vazio('📭', 'Nenhuma resposta ainda', 'Envie um formulário para começar.')}</div></div>
        <div class="card"><div class="card-head"><h2>Atalhos</h2></div><div class="list">
          <button class="list-item" data-atalho="pesquisa_experiencia"><span class="list-icon">⭐</span><span class="list-main"><span class="list-title">Enviar pesquisa de satisfação</span><span class="list-sub">Depois de cada serviço ou encontro</span></span><span class="list-end">→</span></button>
          <button class="list-item" data-atalho="pre_diagnostico"><span class="list-icon">📋</span><span class="list-main"><span class="list-title">Enviar pré-diagnóstico</span><span class="list-sub">Antes da primeira conversa com um cliente novo</span></span><span class="list-end">→</span></button>
          <a class="list-item" href="#/programa"><span class="list-icon">🌱</span><span class="list-main"><span class="list-title">Programa Construindo Juntos</span><span class="list-sub">Progresso, relatório e cartilha por cliente</span></span><span class="list-end">→</span></a>
          <a class="list-item" href="#/materiais"><span class="list-icon">📚</span><span class="list-main"><span class="list-title">Materiais e apresentações</span><span class="list-sub">Apostila, slides e guia do consultor</span></span><span class="list-end">→</span></a>
        </div></div>
      </div></div>`;
    ligarRespostas(main, respostas, () => A.recarregar());
    main.querySelector('[data-enviar-form]').addEventListener('click', () => A.abrirEnvio());
    main.querySelector('[data-novo-cliente]').addEventListener('click', () => editarCliente({}));
    main.querySelectorAll('[data-atalho]').forEach(b => b.addEventListener('click', () => A.abrirEnvio({ formId: b.dataset.atalho })));
  };

  // ═════════════════════════ CLIENTES ═════════════════════════
  function editarCliente(c, aoSalvar) {
    const v = k => esc(c[k] || '');
    const m = A.modal({
      titulo: c.id ? 'Editar cliente' : 'Novo cliente',
      corpo: `<form id="fc" novalidate>
        <div class="field"><label class="label" for="c-nome">Nome da empresa *</label><input class="input" id="c-nome" value="${v('nome')}" required></div>
        <div class="field-row c2"><div class="field"><label class="label" for="c-contato">Contato principal</label><input class="input" id="c-contato" value="${v('contato')}"></div>
          <div class="field"><label class="label" for="c-cargo">Cargo</label><input class="input" id="c-cargo" value="${v('cargo')}"></div></div>
        <div class="field-row c2"><div class="field"><label class="label" for="c-telefone">Telefone / WhatsApp</label><input class="input" id="c-telefone" type="tel" value="${v('telefone')}"></div>
          <div class="field"><label class="label" for="c-email">E-mail</label><input class="input" id="c-email" type="email" value="${v('email')}"></div></div>
        <div class="field-row c2"><div class="field"><label class="label" for="c-cidade">Cidade</label><input class="input" id="c-cidade" value="${v('cidade')}"></div>
          <div class="field"><label class="label" for="c-segmento">Segmento</label><input class="input" id="c-segmento" value="${v('segmento')}"></div></div>
        <div class="field"><label class="label" for="c-status">Situação</label><select class="select" id="c-status">
          ${Object.entries(STATUS).map(([k, [t]]) => `<option value="${k}"${(c.status || 'ativo') === k ? ' selected' : ''}>${t}</option>`).join('')}</select></div>
        <div class="field"><label class="label" for="c-apelidos">Outras grafias do nome</label><textarea class="textarea" id="c-apelidos" rows="3" placeholder="Uma por linha. Ex.: Loja Conceição">${esc((c.apelidos || []).join('\n'))}</textarea>
          <p class="small muted" style="margin-top:6px">Respostas enviadas com qualquer uma dessas grafias aparecem neste cliente. Maiúsculas e acentos não importam.</p></div>
        <div class="field"><label class="label" for="c-obs">Observações</label><textarea class="textarea" id="c-obs" rows="3">${v('observacoes')}</textarea></div>
        <div class="alert alert-error hidden" id="c-erro"></div></form>`,
      rodape: `${c.id ? '<button class="btn btn-danger" data-del>Excluir</button><span class="spacer"></span>' : ''}<button class="btn btn-sec" data-fechar>Cancelar</button><button class="btn" data-salvar>Salvar</button>`
    });
    const $ = s => m.el.querySelector(s);
    $('[data-salvar]').addEventListener('click', async () => {
      const dados = { id: c.id, nome: $('#c-nome').value, contato: $('#c-contato').value, cargo: $('#c-cargo').value, telefone: $('#c-telefone').value,
        email: $('#c-email').value, cidade: $('#c-cidade').value, segmento: $('#c-segmento').value, status: $('#c-status').value,
        apelidos: $('#c-apelidos').value.split('\n'), observacoes: $('#c-obs').value };
      if (!RH.normalizarEmpresa(dados.nome)) { $('#c-erro').textContent = 'Informe o nome da empresa.'; $('#c-erro').classList.remove('hidden'); return; }
      try {
        const salvo = await A.salvarCliente(dados);
        m.fechar(); A.toast('Cliente salvo.');
        if (aoSalvar) aoSalvar(salvo); else A.ir('/clientes/' + salvo.id);
      } catch (e) { $('#c-erro').textContent = e.message; $('#c-erro').classList.remove('hidden'); }
    });
    $('[data-del]')?.addEventListener('click', async () => {
      if (!await A.confirmar(`Excluir o cliente "${c.nome}"? As respostas não são apagadas.`, { ok: 'Excluir', perigo: true })) return;
      try { await A.excluirCliente(c.id); m.fechar(); A.toast('Cliente excluído.'); A.ir('/clientes'); } catch (e) { A.toast(e.message); }
    });
  }
  A.editarCliente = editarCliente;

  function vincular(nome, clientes, depois) {
    const m = A.modal({
      titulo: 'Vincular a um cliente',
      corpo: `<p class="muted" style="margin-bottom:14px">As respostas de <strong>${esc(nome)}</strong> passam a aparecer no cliente escolhido.</p>
        <div class="field"><label class="label" for="v-cli">Cliente</label><select class="select" id="v-cli">${clientes.map(c => `<option value="${c.id}">${esc(c.nome)}</option>`).join('')}</select></div>`,
      rodape: '<button class="btn btn-sec" data-fechar>Cancelar</button><button class="btn" data-ok>Vincular</button>'
    });
    m.el.querySelector('[data-ok]').addEventListener('click', async () => {
      const c = clientes.find(x => x.id === m.el.querySelector('#v-cli').value);
      try { await A.salvarCliente({ ...c, apelidos: [...(c.apelidos || []), nome] }); m.fechar(); A.toast('Vinculado.'); depois(); }
      catch (e) { A.toast(e.message); }
    });
  }

  T.clientes = async main => {
    const [respostas, clientes] = await Promise.all([A.respostas(), A.clientes()]);
    const porCliente = new Map(clientes.map(c => [c.id, A.doCliente(c, respostas)]));
    const sem = A.semCadastro(respostas, clientes);
    let filtro = 'todos', busca = '';

    main.innerHTML = `<div class="page">
      ${cabecalho({ titulo: 'Clientes', sub: A.plural(clientes.length, 'cliente cadastrado', 'clientes cadastrados'), acoes: '<button class="btn" data-novo>+ Novo cliente</button>' })}
      <div class="row" style="margin-bottom:14px"><div class="search" style="flex:1;min-width:220px"><input class="input" id="busca" placeholder="Buscar cliente…" aria-label="Buscar cliente"></div>
        <div class="chips" id="filtro">${[['todos', 'Todos'], ['ativo', 'Ativos'], ['prospect', 'Prospects'], ['encerrado', 'Encerrados']].map(([k, t]) => `<button class="chip${k === 'todos' ? ' active' : ''}" data-f="${k}">${t}</button>`).join('')}</div></div>
      <div class="card" id="lista"></div>
      ${sem.length ? `<h2 class="section-title">Responderam, mas ainda não estão cadastradas</h2>
        <div class="card"><div class="list">${sem.map((e, i) => `<div class="list-item" style="cursor:default"><span class="list-icon">🏢</span>
          <span class="list-main"><span class="list-title">${esc(e.nome)}</span><span class="list-sub">${A.plural(e.n, 'resposta', 'respostas')} · última ${esc(A.relativo(e.ultima))}</span></span>
          <span class="row">${clientes.length ? `<button class="btn btn-sec btn-sm" data-vincular="${i}">Vincular</button>` : ''}<button class="btn btn-sm" data-cadastrar="${i}">Cadastrar</button></span></div>`).join('')}</div></div>` : ''}
    </div>`;

    const desenhar = () => {
      const k = A.chave(busca);
      const lista = clientes.filter(c => (filtro === 'todos' || c.status === filtro) && (!k || A.chavesCliente(c).some(x => x.includes(k)) || A.chave(c.contato).includes(k)));
      main.querySelector('#lista').innerHTML = lista.length ? `<div class="table-wrap"><table class="table"><thead><tr><th>Cliente</th><th>Contato</th><th class="num">Respostas</th><th>Última</th><th>Situação</th></tr></thead><tbody>
        ${lista.map(c => { const rs = porCliente.get(c.id); return `<tr class="click" data-cli="${c.id}">
          <td><strong>${esc(c.nome)}</strong><div class="small muted">${esc([c.segmento, c.cidade].filter(Boolean).join(' · '))}</div></td>
          <td>${esc(c.contato || '—')}<div class="small muted">${esc(c.telefone || c.email || '')}</div></td>
          <td class="num">${rs.length}</td><td class="small muted">${rs.length ? esc(A.relativo(rs[0].created_at)) : '—'}</td><td>${badgeStatus(c.status)}</td></tr>`; }).join('')}
        </tbody></table></div>` : A.vazio('🏢', clientes.length ? 'Nenhum cliente encontrado' : 'Nenhum cliente cadastrado', clientes.length ? 'Tente outra busca.' : 'Cadastre seus clientes para organizar as respostas por empresa.');
      main.querySelectorAll('[data-cli]').forEach(tr => tr.addEventListener('click', () => A.ir('/clientes/' + tr.dataset.cli)));
    };
    desenhar();
    main.querySelector('#busca').addEventListener('input', e => { busca = e.target.value; desenhar(); });
    main.querySelectorAll('[data-f]').forEach(b => b.addEventListener('click', () => {
      filtro = b.dataset.f; main.querySelectorAll('[data-f]').forEach(x => x.classList.toggle('active', x === b)); desenhar();
    }));
    main.querySelector('[data-novo]').addEventListener('click', () => editarCliente({}));
    main.querySelectorAll('[data-cadastrar]').forEach(b => b.addEventListener('click', () => editarCliente({ nome: sem[+b.dataset.cadastrar].nome })));
    main.querySelectorAll('[data-vincular]').forEach(b => b.addEventListener('click', () => vincular(sem[+b.dataset.vincular].nome, clientes, () => A.recarregar())));
  };

  T.cliente = async (main, [id]) => {
    const [respostas, clientes] = await Promise.all([A.respostas(), A.clientes()]);
    const c = clientes.find(x => x.id === id);
    if (!c) { main.innerHTML = `<div class="page"><div class="card">${A.vazio('🔎', 'Cliente não encontrado', '', '<a class="btn" href="#/clientes">Ver clientes</a>')}</div></div>`; return; }
    const rs = A.doCliente(c, respostas);
    const porForm = F.lista().map(f => ({ f, rs: rs.filter(r => r.section === f.id) })).filter(x => x.rs.length);
    const fone = (c.telefone || '').replace(/\D/g, '');

    main.innerHTML = `<div class="page">
      ${cabecalho({ voltar: ['#/clientes', 'Clientes'], eyebrow: badgeStatus(c.status), titulo: c.nome, sub: esc([c.segmento, c.cidade].filter(Boolean).join(' · ')),
        acoes: '<button class="btn btn-sec" data-editar>Editar</button><a class="btn btn-sec" href="#/programa/' + c.id + '">Programa</a><button class="btn" data-enviar-cli>Enviar formulário</button>' })}
      <div class="grid grid-3" style="align-items:start">
        <div class="card card-pad stack">
          <div><div class="label">Contato</div>${esc(c.contato || '—')}${c.cargo ? `<div class="small muted">${esc(c.cargo)}</div>` : ''}</div>
          ${c.telefone ? `<div><div class="label">Telefone</div><a href="https://wa.me/${fone.length <= 11 ? '55' + fone : fone}" target="_blank" rel="noopener">${esc(c.telefone)}</a></div>` : ''}
          ${c.email ? `<div><div class="label">E-mail</div><a href="mailto:${esc(c.email)}">${esc(c.email)}</a></div>` : ''}
          ${c.observacoes ? `<div><div class="label">Observações</div><p style="white-space:pre-wrap">${esc(c.observacoes)}</p></div>` : ''}
          ${(c.apelidos || []).length ? `<div><div class="label">Também aparece como</div><div class="chips">${c.apelidos.map(a => `<span class="badge">${esc(a)}</span>`).join('')}</div></div>` : ''}
        </div>
        <div class="card" style="grid-column:span 2"><div class="card-head"><h2>Respostas por formulário</h2><span class="badge">${rs.length}</span></div>
          <div class="list">${porForm.map(({ f, rs }) => `<a class="list-item" href="#/respostas/${f.id}?cliente=${c.id}"><span class="list-icon">${f.icone}</span>
            <span class="list-main"><span class="list-title">${esc(f.titulo)}</span><span class="list-sub">última ${esc(A.relativo(rs[0].created_at))}</span></span><span class="badge badge-green">${rs.length}</span></a>`).join('')
            || A.vazio('📭', 'Nenhuma resposta ainda', 'Envie um formulário para este cliente.')}</div></div>
      </div>
      ${rs.length ? `<h2 class="section-title">Todas as respostas</h2><div class="card"><div class="list">${rs.map(r => itemResposta(r, c)).join('')}</div></div>` : ''}
    </div>`;
    ligarRespostas(main, rs, () => A.recarregar());
    main.querySelector('[data-editar]').addEventListener('click', () => editarCliente(c, () => A.recarregar()));
    main.querySelector('[data-enviar-cli]').addEventListener('click', () => A.abrirEnvio({ empresa: c.nome }));
  };

  // ═════════════════════════ FORMULÁRIOS ═════════════════════════
  T.formularios = async main => {
    const respostas = await A.respostas();
    const conta = id => respostas.filter(r => r.section === id).length;
    main.innerHTML = `<div class="page">
      ${cabecalho({ titulo: 'Formulários', sub: 'Envie o link para o cliente responder. As respostas chegam aqui automaticamente.' })}
      <div class="search" style="margin-bottom:6px"><input class="input" id="busca" placeholder="Buscar formulário…" aria-label="Buscar formulário"></div>
      <div id="cats"></div></div>`;
    const desenhar = k => {
      main.querySelector('#cats').innerHTML = (window.RH_CATEGORIAS || []).map(cat => {
        const fs = F.lista().filter(f => f.categoria === cat.id && (!k || A.chave(f.titulo + ' ' + (f.descricao || '') + ' ' + (f.modulo || '')).includes(k)));
        if (!fs.length) return '';
        return `<h2 class="section-title">${esc(cat.titulo)}</h2><div class="grid grid-3">${fs.map(f => {
          const n = conta(f.id);
          return `<div class="card form-card">
            <div class="form-card-top"><span class="list-icon">${f.icone}</span><div><h3>${esc(f.titulo)}</h3>${f.modulo || f.etapa ? `<div class="small muted">${esc(f.modulo || f.etapa)}</div>` : ''}</div></div>
            <p>${esc(f.descricao || '')}</p>
            <div class="form-card-meta">${f.publico ? `<span class="badge">👤 ${esc(f.publico)}</span>` : ''}${f.tempo ? `<span class="badge">⏱ ${esc(f.tempo)}</span>` : ''}
              ${f.interno ? '<span class="badge badge-gold">🔒 Uso interno</span>' : F.temInterno(f) ? '<span class="badge badge-gold">Tem parte interna</span>' : ''}
              <span class="badge ${n ? 'badge-green' : ''}">${A.plural(n, 'resposta', 'respostas')}</span></div>
            <div class="form-card-actions">
              ${f.interno ? '' : `<button class="btn btn-sm" data-enviar-f="${f.id}">Enviar</button>`}
              <a class="btn btn-sec btn-sm" href="${A.linkPreencher(f.id)}" target="_blank" rel="noopener">${F.temInterno(f) ? 'Preencher' : 'Visualizar'} ↗</a>
              <a class="btn btn-ghost btn-sm" href="#/respostas/${f.id}">Respostas</a></div></div>`;
        }).join('')}</div>`;
      }).join('') || `<div class="card" style="margin-top:16px">${A.vazio('🔎', 'Nenhum formulário encontrado')}</div>`;
      main.querySelectorAll('[data-enviar-f]').forEach(b => b.addEventListener('click', () => A.abrirEnvio({ formId: b.dataset.enviarF })));
    };
    desenhar('');
    main.querySelector('#busca').addEventListener('input', e => desenhar(A.chave(e.target.value)));
  };

  // ═════════════════════════ RESPOSTAS ═════════════════════════
  const PERIODOS = [['0', 'Tudo'], ['30', '30 dias'], ['90', '90 dias'], ['365', '12 meses']];

  T.respostas = async (main, [formId], q) => {
    const [respostas, clientes] = await Promise.all([A.respostas(), A.clientes()]);
    const idx = A.indice(clientes);
    const form = formId ? F.get(formId) : null;
    const estado = { cliente: q.get('cliente') || '', periodo: q.get('periodo') || '0', busca: '', aba: q.get('aba') || (form ? 'resumo' : 'lista') };

    const opcoesForm = (window.RH_CATEGORIAS || []).map(cat => `<optgroup label="${esc(cat.titulo)}">${F.lista().filter(f => f.categoria === cat.id).map(f =>
      `<option value="${f.id}"${f.id === formId ? ' selected' : ''}>${esc(f.titulo)}</option>`).join('')}</optgroup>`).join('');

    main.innerHTML = `<div class="page">
      ${cabecalho({ eyebrow: form ? esc(F.categoria(form.categoria)?.titulo || '') : '', titulo: form ? form.titulo : 'Respostas',
        sub: form ? esc(form.descricao || '') : 'Tudo o que os clientes responderam, em um só lugar.',
        acoes: `${form ? '<button class="btn btn-sec" data-csv>⬇️ Exportar planilha</button>' : ''}<button class="btn btn-sec" data-atualizar>Atualizar</button>${form && !form.interno ? `<button class="btn" data-enviar-f>Enviar</button>` : ''}` })}
      <div class="card card-pad" style="margin-bottom:16px"><div class="field-row c3">
        <div><label class="label" for="r-form">Formulário</label><select class="select" id="r-form"><option value="">Todos os formulários</option>${opcoesForm}</select></div>
        <div><label class="label" for="r-cli">Cliente</label><select class="select" id="r-cli"><option value="">Todos os clientes</option>${clientes.map(c => `<option value="${c.id}"${c.id === estado.cliente ? ' selected' : ''}>${esc(c.nome)}</option>`).join('')}<option value="_sem"${estado.cliente === '_sem' ? ' selected' : ''}>Sem cliente cadastrado</option></select></div>
        <div><label class="label" for="r-busca">Buscar</label><input class="input" id="r-busca" placeholder="Nome, empresa ou texto"></div></div>
        <div class="chips" style="margin-top:12px" id="r-per">${PERIODOS.map(([k, t]) => `<button class="chip${k === estado.periodo ? ' active' : ''}" data-p="${k}">${t}</button>`).join('')}</div></div>
      ${form ? `<div class="tabs" style="margin-bottom:16px"><button class="tab" data-aba="resumo">Resumo</button><button class="tab" data-aba="lista">Respostas</button></div>` : ''}
      <div id="r-conteudo"></div></div>`;

    const filtradas = () => {
      const k = A.chave(estado.busca);
      return respostas.filter(r => {
        if (form && r.section !== form.id) return false;
        if (estado.cliente === '_sem' && A.clienteDe(r, idx)) return false;
        if (estado.cliente && estado.cliente !== '_sem' && A.clienteDe(r, idx)?.id !== estado.cliente) return false;
        if (!A.dentroDe(r, +estado.periodo)) return false;
        if (k && !A.chave([r.company, r.nome, r.cargo_setor, r.r1, r.r2, r.r3, r.r4, r.r5, r.r6].join(' ')).includes(k)) return false;
        return true;
      });
    };

    const desenhar = () => {
      const rs = filtradas();
      main.querySelectorAll('[data-aba]').forEach(t => t.classList.toggle('active', t.dataset.aba === estado.aba));
      const alvo = main.querySelector('#r-conteudo');
      if (form && estado.aba === 'resumo') { alvo.innerHTML = resumo(form, rs); ligarAbertos(alvo); return; }
      if (!rs.length) { alvo.innerHTML = `<div class="card">${A.vazio('📭', 'Nenhuma resposta encontrada', respostas.length ? 'Ajuste os filtros acima.' : 'Envie um formulário para começar.')}</div>`; return; }
      alvo.innerHTML = `<div class="card"><div class="card-head"><h2>${A.plural(rs.length, 'resposta', 'respostas')}</h2></div><div class="table-wrap"><table class="table"><thead><tr>
        <th>Data</th>${form ? '' : '<th>Formulário</th>'}<th>Empresa</th><th>Nome</th></tr></thead><tbody>
        ${rs.map(r => { const cli = A.clienteDe(r, idx); const f = F.get(r.section); return `<tr class="click" data-resp="${esc(r.id)}">
          <td class="small" style="white-space:nowrap">${esc(A.dataBR(A.dataResp(r)))}</td>
          ${form ? '' : `<td>${f ? f.icone + ' ' + esc(f.titulo) : esc(r.section)}</td>`}
          <td>${cli ? `<strong>${esc(cli.nome)}</strong>` : esc(r.company || '—')}</td><td>${esc(r.nome || '—')}${r.cargo_setor ? `<div class="small muted">${esc(r.cargo_setor)}</div>` : ''}</td></tr>`; }).join('')}
        </tbody></table></div></div>`;
      ligarRespostas(alvo, rs, () => desenhar());
    };

    const resumo = (f, rs) => {
      if (!rs.length) return `<div class="card">${A.vazio('📊', 'Ainda sem respostas para resumir', 'Os gráficos aparecem assim que chegarem respostas.')}</div>`;
      const est = F.estatisticas(f, rs).filter(e => e.total);
      const abertos = F.campos(f).filter(c => c.tipo === 'textarea' || (c.tipo === 'texto' && !c.coluna && !['nome', 'empresa', 'cargo', 'diretor', 'setor'].includes(c.id) && !/empresa|candidato|vaga|nome/.test(c.id)));
      const cards = est.map(e => `<div class="card card-pad"><div class="row-between" style="margin-bottom:12px;align-items:flex-start"><h3 style="font-size:15px;font-family:var(--font);font-weight:800;line-height:1.35">${esc(e.campo.rotulo || e.campo.ajuda || e.campo.id)}</h3>
        ${e.media != null ? `<span class="badge badge-green">média ${e.media.toFixed(1).replace('.', ',')}</span>` : ''}</div>${A.barras(e.contagem, e.total)}<p class="small muted" style="margin-top:10px">${A.plural(e.total, 'resposta', 'respostas')}${e.campo.tipo === 'checkbox' ? ' · várias opções por pessoa' : ''}</p></div>`).join('');
      const textos = abertos.map(c => {
        const itens = F.textosAbertos(f, rs, c.id);
        if (!itens.length) return '';
        return `<div class="card"><div class="card-head"><h3 style="line-height:1.35">${esc(c.rotulo || c.id)}</h3><span class="badge">${itens.length}</span></div><div class="card-body stack" data-abertos>
          ${itens.map((x, i) => `<div class="quote${i >= 3 ? ' hidden' : ''}"><p>${esc(F.texto(c, x.valor))}</p><cite>${esc([x.row.nome, x.row.company, A.dataBR(A.dataResp(x.row))].filter(Boolean).join(' · '))}</cite></div>`).join('')}
          ${itens.length > 3 ? `<button class="btn btn-ghost btn-sm" data-mais>Ver todas (${itens.length})</button>` : ''}</div></div>`;
      }).join('');
      return `<div class="kpi card" style="margin-bottom:16px"><div class="kpi-label">Respostas no filtro</div><div class="kpi-value">${rs.length}</div></div>
        ${cards ? `<div class="grid grid-2" style="align-items:start">${cards}</div>` : ''}
        ${textos ? `<h2 class="section-title">Respostas abertas</h2><div class="stack">${textos}</div>` : ''}`;
    };
    const ligarAbertos = el => el.querySelectorAll('[data-mais]').forEach(b => b.addEventListener('click', () => {
      b.closest('[data-abertos]').querySelectorAll('.quote.hidden').forEach(q => q.classList.remove('hidden')); b.remove();
    }));

    main.querySelector('#r-form').addEventListener('change', e => A.ir('/respostas' + (e.target.value ? '/' + e.target.value : '') + (estado.cliente ? '?cliente=' + estado.cliente : '')));
    main.querySelector('#r-cli').addEventListener('change', e => { estado.cliente = e.target.value; desenhar(); });
    main.querySelector('#r-busca').addEventListener('input', A.debounce(e => { estado.busca = e.target.value; desenhar(); }, 200));
    main.querySelectorAll('[data-p]').forEach(b => b.addEventListener('click', () => { estado.periodo = b.dataset.p; main.querySelectorAll('[data-p]').forEach(x => x.classList.toggle('active', x === b)); desenhar(); }));
    main.querySelectorAll('[data-aba]').forEach(b => b.addEventListener('click', () => { estado.aba = b.dataset.aba; desenhar(); }));
    main.querySelector('[data-atualizar]').addEventListener('click', async () => { await A.respostas(true); A.recarregar(); });
    main.querySelector('[data-enviar-f]')?.addEventListener('click', () => {
      const cli = clientes.find(c => c.id === estado.cliente);
      A.abrirEnvio({ formId: form.id, empresa: cli ? cli.nome : '' });
    });
    main.querySelector('[data-csv]')?.addEventListener('click', () => {
      const blob = new Blob([F.csv(form, filtradas())], { type: 'text/csv;charset=utf-8' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `${form.id}_${RH.hoje()}.csv`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    });
    desenhar();
  };

  // ═════════════════════════ SATISFAÇÃO ═════════════════════════
  T.satisfacao = async (main, _, q) => {
    const [respostas, clientes] = await Promise.all([A.respostas(), A.clientes()]);
    const idx = A.indice(clientes);
    const form = F.get('pesquisa_experiencia');
    const todas = respostas.filter(r => r.section === form.id);
    const estado = { cliente: q.get('cliente') || '', periodo: '0' };

    main.innerHTML = `<div class="page">
      ${cabecalho({ titulo: 'Satisfação', sub: 'Resultado da Pesquisa de Experiência enviada após cada serviço.', acoes: '<button class="btn" data-enviar-p>Enviar pesquisa</button>' })}
      <div class="row" style="margin-bottom:16px"><select class="select" id="s-cli" style="max-width:320px" aria-label="Cliente"><option value="">Todos os clientes</option>${clientes.map(c => `<option value="${c.id}">${esc(c.nome)}</option>`).join('')}</select>
        <div class="chips">${PERIODOS.map(([k, t]) => `<button class="chip${k === '0' ? ' active' : ''}" data-p="${k}">${t}</button>`).join('')}</div></div>
      <div id="s-conteudo"></div></div>`;

    const desenhar = () => {
      const rs = todas.filter(r => A.dentroDe(r, +estado.periodo) && (!estado.cliente || A.clienteDe(r, idx)?.id === estado.cliente));
      const alvo = main.querySelector('#s-conteudo');
      if (!rs.length) { alvo.innerHTML = `<div class="card">${A.vazio('⭐', 'Nenhuma avaliação no período', 'Envie a Pesquisa de Experiência depois de cada serviço.', '<button class="btn" data-enviar-p2>Enviar pesquisa</button>')}</div>`;
        alvo.querySelector('[data-enviar-p2]').addEventListener('click', () => A.abrirEnvio({ formId: form.id })); return; }
      const vs = rs.map(r => ({ r, v: F.valores(form, r).v }));
      const nps = F.nps(vs.map(x => x.v.q8_nps).filter(v => v !== '' && v != null));
      const est = Object.fromEntries(F.estatisticas(form, rs).map(e => [e.campo.id, e]));
      const zona = s => s >= 75 ? ['Zona de excelência', 'var(--ok)'] : s >= 50 ? ['Zona de qualidade', 'var(--green)'] : s >= 0 ? ['Zona de aperfeiçoamento', 'var(--warn)'] : ['Zona crítica', 'var(--danger)'];
      const [zTxt, zCor] = nps ? zona(nps.score) : ['', ''];
      const org = est.q2_organizacao;
      const citacoes = (id, titulo) => {
        const itens = vs.filter(x => x.v[id]);
        if (!itens.length) return '';
        return `<div class="card"><div class="card-head"><h3>${esc(titulo)}</h3><span class="badge">${itens.length}</span></div><div class="card-body stack">
          ${itens.map(x => { const cli = A.clienteDe(x.r, idx); return `<div class="quote"><p>${esc(x.v[id])}</p><cite>${esc([x.r.nome, cli ? cli.nome : x.r.company, A.dataBR(A.dataResp(x.r))].filter(Boolean).join(' · '))}</cite></div>`; }).join('')}</div></div>`;
      };
      // por empresa
      const grupos = new Map();
      vs.forEach(x => { const cli = A.clienteDe(x.r, idx); const k = cli ? cli.id : A.chave(x.r.company) || '_'; const g = grupos.get(k) || { nome: cli ? cli.nome : (x.r.company || 'Sem empresa'), itens: [] }; g.itens.push(x); grupos.set(k, g); });
      const linhas = [...grupos.values()].map(g => {
        const n = F.nps(g.itens.map(x => x.v.q8_nps).filter(v => v !== '' && v != null));
        const notas = g.itens.map(x => Number(x.v.q2_organizacao)).filter(Boolean);
        return `<tr><td><strong>${esc(g.nome)}</strong></td><td class="num">${g.itens.length}</td><td class="num">${n ? n.score : '—'}</td><td class="num">${notas.length ? (notas.reduce((a, b) => a + b, 0) / notas.length).toFixed(1).replace('.', ',') : '—'}</td></tr>`;
      }).join('');

      alvo.innerHTML = `<div class="grid grid-3" style="align-items:start">
        <div class="card card-pad"><div class="kpi-label">NPS — recomendação</div>
          ${nps ? `<div class="nps-big" style="color:${zCor};margin:10px 0 4px">${nps.score}</div><div class="small" style="color:${zCor};font-weight:800;margin-bottom:14px">${zTxt}</div>
          <div class="nps-split" aria-hidden="true"><span style="width:${nps.detratores / nps.n * 100}%;background:#C2410C"></span><span style="width:${nps.neutros / nps.n * 100}%;background:#D9A441"></span><span style="width:${nps.promotores / nps.n * 100}%;background:var(--ok)"></span></div>
          <div class="row-between small muted" style="margin-top:8px"><span>😞 ${nps.detratores} detratores</span><span>😐 ${nps.neutros}</span><span>😍 ${nps.promotores} promotores</span></div>
          <p class="small muted" style="margin-top:12px">NPS = % de notas 9–10 menos % de notas 0–6.</p>` : '<p class="muted" style="margin-top:10px">Sem notas no período.</p>'}</div>
        <div class="card card-pad"><div class="kpi-label">Avaliação geral</div><div style="margin-top:12px">${A.barras(est.q1_avaliacao.contagem, est.q1_avaliacao.total)}</div></div>
        <div class="card card-pad"><div class="kpi-label">Organização do encontro</div>
          <div class="kpi-value" style="margin:10px 0">${org.media != null ? org.media.toFixed(1).replace('.', ',') : '—'}<span class="muted" style="font-size:18px"> / 5</span></div>${A.barras(org.contagem, org.total)}</div>
      </div>
      <div class="grid grid-2" style="margin-top:16px;align-items:start">
        <div class="card card-pad"><div class="kpi-label">O conteúdo fez sentido?</div><div style="margin-top:12px">${A.barras(est.q3_conteudo.contagem, est.q3_conteudo.total)}</div></div>
        <div class="card card-pad"><div class="kpi-label">Envolvimento dos colaboradores</div><div style="margin-top:12px">${A.barras(est.q4_envolvimento.contagem, est.q4_envolvimento.total)}</div></div>
      </div>
      <h2 class="section-title">Por empresa</h2>
      <div class="card"><div class="table-wrap"><table class="table"><thead><tr><th>Empresa</th><th class="num">Avaliações</th><th class="num">NPS</th><th class="num">Organização</th></tr></thead><tbody>${linhas}</tbody></table></div></div>
      <h2 class="section-title">O que os clientes disseram</h2>
      <div class="grid grid-2" style="align-items:start">${citacoes('q9_frase', 'Em uma frase')}${citacoes('q5_valor', 'O que gerou valor')}${citacoes('q6_impacto', 'Impacto percebido')}${citacoes('q7_melhoria', 'Sugestões de melhoria')}</div>`;
    };
    main.querySelector('#s-cli').addEventListener('change', e => { estado.cliente = e.target.value; desenhar(); });
    main.querySelectorAll('[data-p]').forEach(b => b.addEventListener('click', () => { estado.periodo = b.dataset.p; main.querySelectorAll('[data-p]').forEach(x => x.classList.toggle('active', x === b)); desenhar(); }));
    main.querySelector('[data-enviar-p]').addEventListener('click', () => { const c = clientes.find(x => x.id === estado.cliente); A.abrirEnvio({ formId: form.id, empresa: c ? c.nome : '' }); });
    desenhar();
  };

  // ═════════════════════════ PROGRAMA ═════════════════════════
  const ETAPAS = [
    ['direcao', 'Reunião com a Direção'], ['gestores', 'Entrevista com Gestores'], ['colaboradores', 'Conversa com Colaboradores'],
    ['comunicacao', 'Avaliação da Comunicação'], ['identidade', 'Identidade Organizacional'], ['cartilha', 'Cartilha de Cultura'],
    ['lideres', 'Líderes que Inspiram'], ['pertencimento', 'Construindo Pertencimento'], ['treinamentos', 'Treinamentos e Workshops']
  ];
  const SECAO4 = ['As informações chegam a todos os colaboradores?', 'Existem ruídos de comunicação?', 'Há alinhamento entre os setores?', 'Existem reuniões periódicas?', 'Os líderes comunicam de forma clara?'];
  const FORMS_PROGRAMA = ['pre_diagnostico', 'direcao', 'gestores', 'colaboradores', 'identidade', 'cartilha', 'rhcp_direcao', 'rhcp_gestores', 'rhcp_colaboradores'];

  T.programa = async main => {
    const [respostas, clientes, progs] = await Promise.all([A.respostas(), A.clientes(), A.progressos()]);
    const lista = clientes.filter(c => c.status !== 'encerrado');
    main.innerHTML = `<div class="page">
      ${cabecalho({ titulo: 'Programa Construindo Juntos', sub: 'Diagnóstico, identidade, cultura e desenvolvimento — acompanhe cada cliente.' })}
      <div class="card">${lista.length ? `<div class="table-wrap"><table class="table"><thead><tr><th>Cliente</th><th style="min-width:180px">Progresso</th><th class="num">Diagnóstico</th><th class="num">Identidade / cartilha</th></tr></thead><tbody>
        ${lista.map(c => {
          const rs = A.doCliente(c, respostas);
          const n = ids => rs.filter(r => ids.includes(r.section)).length;
          const p = (progs[A.chavePrograma(c.nome)] || {}).media || 0;
          return `<tr class="click" data-cli="${c.id}"><td><strong>${esc(c.nome)}</strong></td>
            <td><div class="row" style="flex-wrap:nowrap"><div class="progress" style="flex:1"><span style="width:${p}%"></span></div><span class="small" style="font-weight:800;min-width:38px;text-align:right">${p}%</span></div></td>
            <td class="num">${n(['pre_diagnostico', 'direcao', 'gestores', 'colaboradores', 'rhcp_direcao', 'rhcp_gestores', 'rhcp_colaboradores'])}</td><td class="num">${n(['identidade', 'cartilha'])}</td></tr>`;
        }).join('')}</tbody></table></div>` : A.vazio('🌱', 'Cadastre um cliente para acompanhar o programa', '', '<a class="btn" href="#/clientes">Ir para clientes</a>')}</div></div>`;
    main.querySelectorAll('[data-cli]').forEach(tr => tr.addEventListener('click', () => A.ir('/programa/' + tr.dataset.cli)));
  };

  T.programaCliente = async (main, [id]) => {
    const [respostas, clientes] = await Promise.all([A.respostas(), A.clientes()]);
    const c = clientes.find(x => x.id === id);
    if (!c) { main.innerHTML = `<div class="page"><div class="card">${A.vazio('🔎', 'Cliente não encontrado', '', '<a class="btn" href="#/programa">Voltar</a>')}</div></div>`; return; }
    const rs = A.doCliente(c, respostas);
    const [prog0, com0] = await Promise.all([A.lerDado(c.nome, 'progresso'), A.lerDado(c.nome, 'comunicacao')]);
    const prog = { pct: { ...(prog0 && prog0.pct) }, obs: { ...(prog0 && prog0.obs) } };
    const com = { itens: { ...(com0 && com0.itens) }, obs: (com0 && com0.obs) || '' };
    const media = () => Math.round(ETAPAS.reduce((s, [k]) => s + (prog.pct[k] || 0), 0) / ETAPAS.length);

    main.innerHTML = `<div class="page">
      ${cabecalho({ voltar: ['#/programa', 'Programa'], eyebrow: 'Programa Construindo Juntos', titulo: c.nome,
        acoes: `<a class="btn btn-sec" href="#/clientes/${c.id}">Ficha do cliente</a><button class="btn btn-sec" data-cartilha>🎨 Cartilha</button><button class="btn" data-relatorio>Relatório compilado</button>` })}
      <div class="card" style="margin-bottom:16px"><div class="card-head"><h2>Formulários do programa</h2><span class="small muted">envie o link já com o nome da empresa</span></div><div class="list">
        ${FORMS_PROGRAMA.map(fid => { const f = F.get(fid); const n = rs.filter(r => r.section === fid).length; return `<div class="list-item" style="cursor:default"><span class="list-icon">${f.icone}</span>
          <span class="list-main"><span class="list-title">${esc(f.titulo)}</span><span class="list-sub">${esc(f.etapa || f.publico || '')}</span></span>
          <span class="row" style="flex-wrap:nowrap">${n ? `<a class="badge badge-green" href="#/respostas/${fid}?cliente=${c.id}">${A.plural(n, 'resposta', 'respostas')}</a>` : '<span class="badge">sem respostas</span>'}
          <button class="btn btn-sm" data-enviar-f="${fid}">Enviar</button></span></div>`; }).join('')}</div></div>
      <div class="grid grid-2" style="align-items:start">
        <div class="card"><div class="card-head"><h2>Progresso por etapa</h2><span class="badge badge-green" id="p-media">${media()}%</span></div>
          ${ETAPAS.map(([k, nome], i) => `<div class="etapa" style="grid-template-columns:auto 1fr"><span class="etapa-n">${i + 1}</span><div>
            <div class="row-between"><strong>${esc(nome)}</strong><span class="pct" id="pct-${k}">${prog.pct[k] || 0}%</span></div>
            <input type="range" min="0" max="100" step="5" value="${prog.pct[k] || 0}" data-etapa="${k}" aria-label="Progresso: ${esc(nome)}">
            <textarea class="textarea" rows="1" style="min-height:38px;margin-top:6px;font-size:13.5px" placeholder="Observações" data-obs="${k}">${esc(prog.obs[k] || '')}</textarea></div></div>`).join('')}
          <div class="card-body small muted" id="p-salvo">As alterações são salvas automaticamente.</div></div>
        <div class="card"><div class="card-head"><h2>Avaliação da comunicação interna</h2><span class="badge">Seção 4</span></div><div class="card-body">
          ${SECAO4.map((p, i) => { const it = com.itens['s4-' + (i + 1)] || {}; return `<label class="check"><input type="checkbox" data-s4="${i + 1}"${it.sim ? ' checked' : ''}><span>${esc(p)}</span></label>
            <textarea class="textarea" rows="1" style="min-height:38px;margin:0 0 8px 28px;width:calc(100% - 28px);font-size:13.5px" placeholder="Observações" data-s4obs="${i + 1}">${esc(it.obs || '')}</textarea>`; }).join('')}
          <label class="label" for="s4-obs" style="margin-top:10px">Observações gerais</label><textarea class="textarea" id="s4-obs" rows="3">${esc(com.obs)}</textarea>
          <p class="small muted" style="margin-top:10px" id="s4-salvo">Preenchido por você durante o diagnóstico. Salvo automaticamente.</p></div></div>
      </div></div>`;

    const aviso = (sel, ok) => { const el = main.querySelector(sel); el.textContent = ok ? '✓ Salvo' : 'Não foi possível salvar — confira a conexão.'; el.style.color = ok ? 'var(--ok)' : 'var(--danger)'; };
    const salvarProg = A.debounce(async () => { try { await A.salvarDado(c.nome, 'progresso', { ...prog, media: media() }); aviso('#p-salvo', true); } catch { aviso('#p-salvo', false); } }, 700);
    const salvarCom = A.debounce(async () => { try { await A.salvarDado(c.nome, 'comunicacao', com); aviso('#s4-salvo', true); } catch { aviso('#s4-salvo', false); } }, 700);
    main.querySelectorAll('[data-etapa]').forEach(r => r.addEventListener('input', () => {
      prog.pct[r.dataset.etapa] = +r.value; main.querySelector('#pct-' + r.dataset.etapa).textContent = r.value + '%'; main.querySelector('#p-media').textContent = media() + '%'; salvarProg();
    }));
    main.querySelectorAll('[data-obs]').forEach(t => t.addEventListener('input', () => { prog.obs[t.dataset.obs] = t.value; salvarProg(); }));
    main.querySelectorAll('[data-s4]').forEach(cb => cb.addEventListener('change', () => { const k = 's4-' + cb.dataset.s4; com.itens[k] = { ...(com.itens[k] || {}), sim: cb.checked }; salvarCom(); }));
    main.querySelectorAll('[data-s4obs]').forEach(t => t.addEventListener('input', () => { const k = 's4-' + t.dataset.s4obs; com.itens[k] = { ...(com.itens[k] || {}), obs: t.value }; salvarCom(); }));
    main.querySelector('#s4-obs').addEventListener('input', e => { com.obs = e.target.value; salvarCom(); });
    main.querySelectorAll('[data-enviar-f]').forEach(b => b.addEventListener('click', () => A.abrirEnvio({ formId: b.dataset.enviarF, empresa: c.nome })));
    main.querySelector('[data-cartilha]').addEventListener('click', () => {
      const ct = rs.filter(r => r.section === 'cartilha');
      if (!ct.length) { A.toast('A empresa ainda não enviou a Cartilha de Cultura.'); return; }
      RH.baixarCartilha(RH.lerJson(ct[0].r1));
    });
    main.querySelector('[data-relatorio]').addEventListener('click', () => relatorio(c, rs, com));
  };

  function relatorio(c, rs, com) {
    const blocos = [];
    ['direcao', 'gestores', 'colaboradores', 'identidade'].forEach(fid => {
      const f = F.get(fid);
      const itens = rs.filter(r => r.section === fid).reverse();
      const perguntas = F.campos(f).filter(x => x.tipo === 'textarea');
      blocos.push(`${'═'.repeat(44)}\n${f.etapa ? f.etapa.toUpperCase() + ' — ' : ''}${f.titulo.toUpperCase()}\n${'═'.repeat(44)}\n\n` +
        (itens.length ? itens.map((r, i) => { const v = F.valores(f, r).v; return `=== Respondente ${i + 1}: ${r.nome || 'Anônimo'}${r.cargo_setor ? ' — ' + r.cargo_setor : ''} ===\n` + perguntas.map(p => `${p.rotulo}:\n${v[p.id] || '(não respondido)'}`).join('\n\n'); }).join('\n\n') : '(Nenhuma resposta registrada)'));
    });
    blocos.push(`${'═'.repeat(44)}\nAVALIAÇÃO DA COMUNICAÇÃO INTERNA\n${'═'.repeat(44)}\n\n` + SECAO4.map((p, i) => { const it = com.itens['s4-' + (i + 1)] || {}; return `- ${p} → ${it.sim ? 'SIM' : 'NÃO'}${it.obs ? '\n  Obs: ' + it.obs : ''}`; }).join('\n') + (com.obs ? '\n\nObservações gerais: ' + com.obs : ''));
    const texto = `DIAGNÓSTICO ORGANIZACIONAL — RH COM PROPÓSITO\nEmpresa: ${c.nome}\nData: ${new Date().toLocaleDateString('pt-BR')}\n\n` + blocos.join('\n\n\n');
    const m = A.modal({ titulo: 'Relatório compilado', largo: true,
      corpo: `<p class="muted" style="margin-bottom:12px">Respostas de Direção, Gestores, Colaboradores e Identidade, mais a sua avaliação da comunicação.</p><pre style="white-space:pre-wrap;font-family:var(--font);font-size:14px;line-height:1.6;background:var(--surface-2);border:1px solid var(--line);border-radius:10px;padding:16px;max-height:60vh;overflow:auto">${esc(texto)}</pre>`,
      rodape: '<button class="btn btn-sec" data-copiar>Copiar texto</button><button class="btn" data-imprimir>🖨️ Imprimir / PDF</button>' });
    m.el.querySelector('[data-copiar]').addEventListener('click', async () => { try { await navigator.clipboard.writeText(texto); A.toast('Relatório copiado.'); } catch { A.toast('Selecione o texto e copie manualmente.'); } });
    m.el.querySelector('[data-imprimir]').addEventListener('click', () => A.imprimir('Relatório — ' + c.nome, `<pre style="white-space:pre-wrap;font-family:var(--font);font-size:13px;line-height:1.6">${esc(texto)}</pre>`));
  }

  // ═════════════════════════ MATERIAIS ═════════════════════════
  T.materiais = async main => {
    const mats = RH_CONFIG.materiais;
    const card = m => `<div class="card form-card"><div class="form-card-top"><span class="list-icon">${m.icone}</span><div><h3>${esc(m.titulo)}</h3></div></div>
      <p>${esc(m.descricao)}</p><div class="form-card-meta">${m.publico ? '<span class="badge badge-green">🌐 Link aberto para participantes</span>' : '<span class="badge">🔒 Só você</span>'}</div>
      <div class="form-card-actions"><a class="btn btn-sm" href="${m.url}" target="_blank" rel="noopener">${m.publico ? 'Abrir' : 'Apresentar'} ↗</a>
      ${m.publico ? `<button class="btn btn-sec btn-sm" data-copiar="${esc(location.origin + m.url)}">Copiar link</button><a class="btn btn-wa btn-sm" target="_blank" rel="noopener" href="https://wa.me/?text=${encodeURIComponent(m.titulo + ' — RH com Propósito\n' + location.origin + m.url)}">WhatsApp</a>` : ''}</div></div>`;
    main.innerHTML = `<div class="page">
      ${cabecalho({ titulo: 'Materiais', sub: 'Apostilas, apresentações e o guia de condução do Programa.' })}
      <h2 class="section-title">Para participantes</h2><div class="grid grid-3">${mats.filter(m => m.publico).map(card).join('')}</div>
      <h2 class="section-title">Apresentações</h2><div class="grid grid-3">${mats.filter(m => !m.publico).map(card).join('')}</div>
      <h2 class="section-title">Guia do consultor</h2>
      <div class="grid grid-3"><div class="card form-card"><div class="form-card-top"><span class="list-icon">🗺️</span><div><h3>Mapa de condução e manual</h3></div></div>
        <p>As 6 etapas do Programa, os 8 módulos do guia de campo, roteiros de fala e checklists do consultor.</p>
        <div class="form-card-actions"><a class="btn btn-sm" href="guia.html">Abrir guia</a></div></div></div></div>`;
    main.querySelectorAll('[data-copiar]').forEach(b => b.addEventListener('click', () => A.copiar(b.dataset.copiar)));
  };

  // ═════════════════════════ CONTA / MAIS ═════════════════════════
  T.conta = async main => {
    main.innerHTML = `<div class="page" style="max-width:640px">
      ${cabecalho({ titulo: 'Minha conta' })}
      <div class="card card-pad stack">
        <div><div class="label">E-mail de acesso</div>${esc(A.email)}</div>
        <form id="f-senha" class="stack" novalidate><div><label class="label" for="nova">Nova senha</label><input class="input" id="nova" type="password" autocomplete="new-password" placeholder="Pelo menos 8 caracteres"></div>
          <div><label class="label" for="nova2">Repita a nova senha</label><input class="input" id="nova2" type="password" autocomplete="new-password"></div>
          <div class="alert hidden" id="msg"></div><div><button class="btn">Trocar senha</button></div></form>
      </div>
      <div class="card card-pad" style="margin-top:16px"><div class="row-between"><span>Sair deste aparelho</span><button class="btn btn-danger" data-sair2>Sair</button></div></div></div>`;
    main.querySelector('[data-sair2]').addEventListener('click', () => RH.auth.sair());
    main.querySelector('#f-senha').addEventListener('submit', async e => {
      e.preventDefault();
      const msg = main.querySelector('#msg'), a = main.querySelector('#nova').value, b = main.querySelector('#nova2').value;
      try {
        if (a !== b) throw new Error('As senhas não são iguais.');
        await RH.auth.trocarSenha(a);
        msg.className = 'alert alert-ok'; msg.textContent = 'Senha trocada com sucesso.'; e.target.reset();
      } catch (err) { msg.className = 'alert alert-error'; msg.textContent = err.message; }
    });
  };

  T.mais = async main => {
    main.innerHTML = `<div class="page">${cabecalho({ titulo: 'Mais' })}<div class="card"><div class="list">
      <a class="list-item" href="#/satisfacao"><span class="list-icon">⭐</span><span class="list-main"><span class="list-title">Satisfação</span><span class="list-sub">NPS e comentários dos clientes</span></span></a>
      <a class="list-item" href="#/programa"><span class="list-icon">🌱</span><span class="list-main"><span class="list-title">Programa Construindo Juntos</span><span class="list-sub">Progresso, relatório e cartilha</span></span></a>
      <a class="list-item" href="#/materiais"><span class="list-icon">📚</span><span class="list-main"><span class="list-title">Materiais</span><span class="list-sub">Apostila, slides e guia</span></span></a>
      <a class="list-item" href="#/conta"><span class="list-icon">👤</span><span class="list-main"><span class="list-title">Minha conta</span><span class="list-sub">${esc(A.email)}</span></span></a>
    </div></div></div>`;
  };
})();
