// ═══════════════════════════════════════════════════
// Área da consultora — telas
// ═══════════════════════════════════════════════════
(function () {
  const A = window.App, F = window.RHF, RH = window.RH, esc = RH.esc;
  const T = A.telas;
  const ic = A.ic;

  const cabecalho = ({ icone = '', ouro = false, eyebrow = '', titulo, sub = '', acoes = '', voltar = '' }) => `
    ${voltar ? `<a class="back" href="${voltar[0]}">${ic('voltar', 16)} ${esc(voltar[1])}</a>` : ''}
    <div class="page-head"><div class="page-title">${icone ? `<span class="page-ico${ouro ? ' gold' : ''}">${ic(icone, 24)}</span>` : ''}
      <div>${eyebrow ? `<div class="eyebrow">${eyebrow}</div>` : ''}<h1>${esc(titulo)}</h1>${sub ? `<p>${sub}</p>` : ''}</div></div>
    ${acoes ? `<div class="row">${acoes}</div>` : ''}</div>`;

  const stat = (icone, n, rotulo, ouro = false) => `<div class="stat"><span class="kpi-ico${ouro ? ' gold' : ''}">${ic(icone, 19)}</span>
    <div style="min-width:0"><div class="stat-n"${typeof n === 'number' ? ` data-contar="${n}"` : ''}>${n}</div><div class="stat-l">${esc(rotulo)}</div></div></div>`;

  const anel = (pct, grande = false) => {
    const r = 26, c = 2 * Math.PI * r;
    return `<div class="ring${grande ? ' grande' : ''}"><svg viewBox="0 0 60 60" aria-hidden="true">
      <circle cx="30" cy="30" r="${r}" fill="none" stroke="#EFEBE3" stroke-width="6"/>
      <circle cx="30" cy="30" r="${r}" fill="none" stroke="url(#anel-g)" stroke-width="6" stroke-linecap="round" stroke-dasharray="${c.toFixed(1)}" stroke-dashoffset="${(c * (1 - pct / 100)).toFixed(1)}" style="transition:stroke-dashoffset .8s var(--ease)"/>
      <defs><linearGradient id="anel-g" x1="0" x2="1"><stop offset="0" stop-color="#2E7D58"/><stop offset="1" stop-color="#C89B3C"/></linearGradient></defs></svg><strong>${pct}%</strong></div>`;
  };

  const STATUS = { ativo: ['Ativo', 'badge-green'], prospect: ['Prospect', 'badge-blue'], encerrado: ['Encerrado', ''] };
  const badgeStatus = s => { const [t, c] = STATUS[s] || STATUS.ativo; return `<span class="badge ${c}">${t}</span>`; };

  const itemResposta = (r, cli, mostrarForm = true) => {
    const f = F.get(r.section);
    const quem = [r.nome, cli ? cli.nome : r.company].filter(Boolean).join(' · ') || 'Sem identificação';
    return `<button class="list-item" data-resp="${esc(r.id)}">
      <span class="list-icon">${ic(f ? f.icone : 'documento')}</span>
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
  const desktop = () => matchMedia('(min-width: 1100px)').matches;
  // compartilhados com app/eventos.js
  A.ui = { cabecalho, stat, anel, badgeStatus, itemResposta, ligarRespostas, desktop };

  // ═════════════════════════ INÍCIO ═════════════════════════
  T.inicio = async main => {
    const [respostas, clientes, eventos] = await Promise.all([A.respostas(), A.clientes(), A.eventos().catch(() => [])]);
    const proximos = eventos.filter(A.eventoFuturo).sort((a, b) => a.data.localeCompare(b.data));
    const idx = A.indice(clientes);
    const ult7 = respostas.filter(r => A.dentroDe(r, 7)).length;
    const nps = npsDe(respostas);
    const ativos = clientes.filter(c => c.status === 'ativo').length;
    const sem = A.semCadastro(respostas, clientes);
    const hoje = new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
    const sat = respostas.filter(r => r.section === 'pesquisa_experiencia');
    const kpi = (href, icone, rotulo, valor, sub, extra = '', ouro = false) => `<a class="card kpi" href="${href}">
      <div class="kpi-top"><span class="kpi-label">${rotulo}</span><span class="kpi-ico${ouro ? ' gold' : ''}">${ic(icone, 20)}</span></div>
      <div class="kpi-value"${typeof valor === 'number' ? ` data-contar="${valor}"` : ''}>${valor}</div><div class="kpi-sub">${sub}</div>${extra}</a>`;
    // formulários mais respondidos nos últimos 90 dias
    const ranking = Object.entries(respostas.filter(r => A.dentroDe(r, 90)).reduce((m, r) => (m[r.section] = (m[r.section] || 0) + 1, m), {}))
      .sort((a, b) => b[1] - a[1]).slice(0, 5);
    const maxRank = ranking.length ? ranking[0][1] : 1;
    const atalho = (attr, icone, titulo, sub) => `<${attr.startsWith('href') ? 'a' : 'button'} class="list-item" ${attr}><span class="list-icon">${ic(icone)}</span><span class="list-main"><span class="list-title">${titulo}</span><span class="list-sub">${sub}</span></span><span class="seta">${ic('direita', 18)}</span></${attr.startsWith('href') ? 'a' : 'button'}>`;

    main.innerHTML = `<div class="page">
      <section class="hero">
        <span class="hero-folha" data-logo="simbolo" data-tema="escuro"></span>
        <div class="eyebrow">${esc(hoje)}</div>
        <h1>${A.saudacao()}, ${esc(RH_CONFIG.consultora)}</h1>
        <p>${ult7 ? `Chegaram <strong style="color:#fff">${A.plural(ult7, 'resposta nova', 'respostas novas')}</strong> nos últimos 7 dias.` : 'Nenhuma resposta nova nesta semana. Que tal enviar a pesquisa de satisfação?'} ${sem.length ? `${A.plural(sem.length, 'empresa ainda precisa', 'empresas ainda precisam')} ser ${sem.length === 1 ? 'cadastrada' : 'cadastradas'}.` : ''}</p>
        <div class="hero-acoes"><button class="btn btn-gold" data-enviar-form>${ic('enviar', 16)} Enviar formulário</button><button class="btn btn-glass" data-novo-cliente>${ic('mais', 16)} Novo cliente</button>${sem.length ? `<a class="btn btn-glass" href="#/clientes">${ic('clientes', 16)} Organizar empresas</a>` : ''}</div>
      </section>
      <div class="grid grid-4">
        ${kpi('#/respostas', 'respostas', 'Respostas', respostas.length, ult7 ? `<span class="trend up">+${ult7}</span> nos últimos 7 dias` : '<span class="trend flat">0</span> nesta semana', A.spark(A.porSemana(respostas)))}
        ${kpi('#/clientes', 'clientes', 'Clientes', clientes.length, A.plural(ativos, 'ativo', 'ativos'), A.spark(A.porSemana(respostas.filter(r => A.clienteDe(r, idx)))))}
        ${kpi('#/formularios', 'formularios', 'Formulários', F.lista().length, 'prontos para enviar', '', true)}
        ${kpi('#/satisfacao', 'estrela', 'NPS', nps ? nps.score : '—', nps ? A.plural(nps.n, 'avaliação', 'avaliações') : 'sem avaliações ainda', sat.length ? A.spark(A.porSemana(sat), '#C89B3C') : '', true)}
      </div>
      <div class="grid grid-3" style="margin-top:18px;align-items:start">
        <div class="card" style="grid-column:span 2"><div class="card-head"><h2>Respostas recentes</h2><a class="small" href="#/respostas">Ver todas</a></div>
          <div class="list">${respostas.slice(0, 6).map(r => itemResposta(r, A.clienteDe(r, idx))).join('') || A.vazio('respostas', 'Nenhuma resposta ainda', 'Envie um formulário para começar.')}</div></div>
        <div class="stack" style="gap:18px">
          ${proximos.length ? `<div class="card"><div class="card-head"><h2>Próximos eventos</h2><a class="small" href="#/eventos">Ver todos</a></div><div class="list">${A.cartoesEventos(proximos, respostas, clientes)}</div></div>` : ''}
          <div class="card"><div class="card-head"><h2>Atalhos</h2></div><div class="list">
            ${atalho('data-atalho="pesquisa_experiencia"', 'estrela', 'Pesquisa de satisfação', 'Depois de cada serviço')}
            ${atalho('data-atalho="pre_diagnostico"', 'prancheta', 'Pré-diagnóstico', 'Para um cliente novo')}
            ${atalho('data-novo-evento', 'agenda', 'Novo evento', 'Convite, presença e pesquisa')}
            ${atalho('href="#/programa"', 'broto', 'Programa', 'Progresso e relatório')}
            ${atalho('href="#/materiais"', 'livro', 'Materiais', 'Apostila, slides e guia')}
          </div></div>
          ${ranking.length ? `<div class="card card-pad"><div class="kpi-label" style="margin-bottom:14px">Mais respondidos · 90 dias</div><div class="bars">
            ${ranking.map(([id, n], i) => `<div class="bar-row${i === 0 ? ' top' : ''}"><a class="bar-label" href="#/respostas/${id}" style="text-decoration:none;color:inherit">${esc(F.rotulo(id))}</a><span class="bar-count">${n}</span><div class="bar-track"><div class="bar-fill" style="width:${Math.round(n / maxRank * 100)}%;animation-delay:${i * 60}ms"></div></div></div>`).join('')}</div></div>` : ''}
        </div>
      </div></div>`;
    ligarRespostas(main, respostas, () => A.recarregar());
    main.querySelector('[data-enviar-form]').addEventListener('click', () => A.abrirEnvio());
    main.querySelector('[data-novo-cliente]').addEventListener('click', () => editarCliente({}));
    main.querySelectorAll('[data-atalho]').forEach(b => b.addEventListener('click', () => A.abrirEnvio({ formId: b.dataset.atalho })));
    main.querySelector('[data-novo-evento]').addEventListener('click', () => A.editarEvento());
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
      rodape: `${c.id ? `<button class="btn btn-danger" data-del>${ic('lixeira', 16)} Excluir</button><span class="spacer"></span>` : ''}<button class="btn btn-sec" data-fechar>Cancelar</button><button class="btn" data-salvar>${ic('ok', 16)} Salvar</button>`
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
      rodape: `<button class="btn btn-sec" data-fechar>Cancelar</button><button class="btn" data-ok>${ic('link', 16)} Vincular</button>`
    });
    m.el.querySelector('[data-ok]').addEventListener('click', async () => {
      const c = clientes.find(x => x.id === m.el.querySelector('#v-cli').value);
      try { await A.salvarCliente({ ...c, apelidos: [...(c.apelidos || []), nome] }); m.fechar(); A.toast('Vinculado.'); depois(); }
      catch (e) { A.toast(e.message); }
    });
  }

  const lerVista = () => { try { return localStorage.getItem('rh_vista_clientes') || 'grade'; } catch { return 'grade'; } };

  T.clientes = async main => {
    const [respostas, clientes, progs] = await Promise.all([A.respostas(), A.clientes(), A.progressos()]);
    const porCliente = new Map(clientes.map(c => [c.id, A.doCliente(c, respostas)]));
    const sem = A.semCadastro(respostas, clientes);
    const vinculadas = [...porCliente.values()].reduce((s, rs) => s + rs.length, 0);
    let filtro = 'todos', busca = '', vista = lerVista();

    main.innerHTML = `<div class="page">
      ${cabecalho({ icone: 'clientes', titulo: 'Clientes', sub: 'Empresas atendidas, contatos e tudo o que cada uma respondeu.', acoes: `<button class="btn" data-novo>${ic('mais', 16)} Novo cliente</button>` })}
      <div class="stat-strip">${stat('clientes', clientes.length, 'Clientes')}${stat('ok', clientes.filter(c => c.status === 'ativo').length, 'Ativos')}${stat('tendencia', clientes.filter(c => c.status === 'prospect').length, 'Prospects', true)}${stat('respostas', vinculadas, 'Respostas')}</div>
      <div class="row" style="margin-bottom:16px"><div class="search" style="flex:1;min-width:220px"><input class="input" id="busca" placeholder="Buscar por empresa ou contato…" aria-label="Buscar cliente"></div>
        <div class="chips" id="filtro">${[['todos', 'Todos'], ['ativo', 'Ativos'], ['prospect', 'Prospects'], ['encerrado', 'Encerrados']].map(([k, t]) => `<button class="chip${k === 'todos' ? ' active' : ''}" data-f="${k}">${t}</button>`).join('')}</div>
        <div class="vista" role="group" aria-label="Modo de exibição"><button data-vista="grade" aria-label="Cartões">${ic('grade', 17)}</button><button data-vista="lista" aria-label="Lista">${ic('lista', 17)}</button></div></div>
      <div id="lista"></div>
      ${sem.length ? `<h2 class="section-title">Responderam, mas ainda não estão cadastradas</h2>
        <div class="card"><div class="list">${sem.map((e, i) => `<div class="list-item" style="cursor:default"><span class="avatar gold">${esc(A.iniciais(e.nome))}</span>
          <span class="list-main"><span class="list-title">${esc(e.nome)}</span><span class="list-sub">${A.plural(e.n, 'resposta', 'respostas')} · última ${esc(A.relativo(e.ultima))}</span></span>
          <span class="row">${clientes.length ? `<button class="btn btn-sec btn-sm" data-vincular="${i}">${ic('link', 15)} Vincular</button>` : ''}<button class="btn btn-sm" data-cadastrar="${i}">${ic('mais', 15)} Cadastrar</button></span></div>`).join('')}</div></div>` : ''}
    </div>`;

    const desenhar = () => {
      main.querySelectorAll('[data-vista]').forEach(b => b.classList.toggle('active', b.dataset.vista === vista));
      const k = A.chave(busca);
      const lista = clientes.filter(c => (filtro === 'todos' || c.status === filtro) && (!k || A.chavesCliente(c).some(x => x.includes(k)) || A.chave(c.contato).includes(k)));
      const alvo = main.querySelector('#lista');
      if (!lista.length) {
        alvo.innerHTML = `<div class="card">${A.vazio('clientes', clientes.length ? 'Nenhum cliente encontrado' : 'Nenhum cliente cadastrado', clientes.length ? 'Tente outra busca.' : 'Cadastre seus clientes para organizar as respostas por empresa.')}</div>`;
        return;
      }
      if (vista === 'grade') {
        alvo.innerHTML = `<div class="grid grid-3">${lista.map(c => {
          const rs = porCliente.get(c.id);
          const forms = new Set(rs.map(r => r.section)).size;
          const p = (progs[A.chavePrograma(c.nome)] || {}).media || 0;
          return `<a class="card cli-card" href="#/clientes/${c.id}" data-cli="${c.id}">
            <div class="cli-top"><span class="avatar">${esc(A.iniciais(c.nome))}</span><div style="min-width:0;flex:1"><div class="cli-nome">${esc(c.nome)}</div><div class="cli-meta">${esc([c.segmento, c.cidade].filter(Boolean).join(' · ') || c.contato || 'Sem detalhes')}</div></div>${badgeStatus(c.status)}</div>
            <div class="cli-nums"><div><strong class="num">${rs.length}</strong><span>respostas</span></div><div><strong>${forms}</strong><span>formulários</span></div><div><strong>${rs.length ? esc(A.relativo(rs[0].created_at).replace('há ', '')) : '—'}</strong><span>última</span></div></div>
            <div class="cli-prog">${ic('broto', 15)} Programa <div class="progress"><span style="width:${p}%"></span></div> ${p}%</div></a>`;
        }).join('')}</div>`;
      } else {
        alvo.innerHTML = `<div class="card"><div class="table-wrap"><table class="table"><thead><tr><th>Cliente</th><th>Contato</th><th class="num">Respostas</th><th>Última</th><th>Situação</th></tr></thead><tbody>
          ${lista.map(c => { const rs = porCliente.get(c.id); return `<tr class="click" data-cli="${c.id}">
            <td><div class="cell-ident"><span class="avatar">${esc(A.iniciais(c.nome))}</span><div><strong>${esc(c.nome)}</strong><div class="small muted">${esc([c.segmento, c.cidade].filter(Boolean).join(' · '))}</div></div></div></td>
            <td>${esc(c.contato || '—')}<div class="small muted">${esc(c.telefone || c.email || '')}</div></td>
            <td class="num">${rs.length}</td><td class="small muted">${rs.length ? esc(A.relativo(rs[0].created_at)) : '—'}</td><td>${badgeStatus(c.status)}</td></tr>`; }).join('')}
          </tbody></table></div></div>`;
        alvo.querySelectorAll('tr[data-cli]').forEach(tr => tr.addEventListener('click', () => A.ir('/clientes/' + tr.dataset.cli)));
      }
    };
    desenhar();
    main.querySelector('#busca').addEventListener('input', e => { busca = e.target.value; desenhar(); });
    main.querySelectorAll('[data-f]').forEach(b => b.addEventListener('click', () => {
      filtro = b.dataset.f; main.querySelectorAll('[data-f]').forEach(x => x.classList.toggle('active', x === b)); desenhar();
    }));
    main.querySelectorAll('[data-vista]').forEach(b => b.addEventListener('click', () => {
      vista = b.dataset.vista; try { localStorage.setItem('rh_vista_clientes', vista); } catch {} desenhar();
    }));
    main.querySelector('[data-novo]').addEventListener('click', () => editarCliente({}));
    main.querySelectorAll('[data-cadastrar]').forEach(b => b.addEventListener('click', () => editarCliente({ nome: sem[+b.dataset.cadastrar].nome })));
    main.querySelectorAll('[data-vincular]').forEach(b => b.addEventListener('click', () => vincular(sem[+b.dataset.vincular].nome, clientes, () => A.recarregar())));
  };

  T.cliente = async (main, [id], q) => {
    const [respostas, clientes, todosEventos] = await Promise.all([A.respostas(), A.clientes(), A.eventos().catch(() => [])]);
    const c = clientes.find(x => x.id === id);
    if (!c) { main.innerHTML = `<div class="page"><div class="card">${A.vazio('busca', 'Cliente não encontrado', '', '<a class="btn" href="#/clientes">Ver clientes</a>')}</div></div>`; return; }
    const eventosCli = todosEventos.filter(e => e.cliente_id === c.id);
    const rs = A.doCliente(c, respostas);
    const porForm = F.lista().map(f => ({ f, rs: rs.filter(r => r.section === f.id) })).filter(x => x.rs.length);
    const fone = (c.telefone || '').replace(/\D/g, '');
    const prog = await A.lerDado(c.nome, 'progresso').catch(() => null);
    const p = (prog && prog.media) || 0;
    let aba = q.get('aba') || 'respostas';

    main.innerHTML = `<div class="page">
      <a class="back" href="#/clientes">${ic('voltar', 16)} Clientes</a>
      <section class="card perfil">
        <div class="perfil-capa"><span class="logo" data-logo="simbolo" data-tema="escuro"></span></div>
        <div class="perfil-corpo">
          <span class="avatar">${esc(A.iniciais(c.nome))}</span>
          <div class="perfil-info">${badgeStatus(c.status)}<h1>${esc(c.nome)}</h1>
            <div class="perfil-contatos">
              ${c.contato ? `<span>${ic('pessoa', 14)} ${esc(c.contato)}${c.cargo ? ' · ' + esc(c.cargo) : ''}</span>` : ''}
              ${c.telefone ? `<a href="https://wa.me/${fone.length <= 11 ? '55' + fone : fone}" target="_blank" rel="noopener">${ic('whatsapp', 14)} ${esc(c.telefone)}</a>` : ''}
              ${c.email ? `<a href="mailto:${esc(c.email)}">${ic('email', 14)} ${esc(c.email)}</a>` : ''}
              ${c.cidade || c.segmento ? `<span>${ic('local', 14)} ${esc([c.segmento, c.cidade].filter(Boolean).join(' · '))}</span>` : ''}
            </div></div>
          <div class="perfil-acoes"><button class="btn btn-sec" data-editar>${ic('editar', 16)} Editar</button><a class="btn btn-sec" href="#/programa/${c.id}">${ic('broto', 16)} Programa</a><button class="btn btn-gold" data-enviar-cli>${ic('enviar', 16)} Enviar formulário</button></div>
        </div>
      </section>
      <div class="stat-strip">${stat('respostas', rs.length, 'Respostas')}${stat('formularios', porForm.length, 'Formulários')}${stat('calendario', rs.length ? A.relativo(rs[0].created_at) : '—', 'Última resposta')}${stat('broto', p + '%', 'Programa', true)}</div>
      <div class="tabs" style="margin-bottom:16px"><button class="tab" data-aba="respostas">Respostas</button><button class="tab" data-aba="formularios">Por formulário</button><button class="tab" data-aba="eventos">Eventos${eventosCli.length ? ' (' + eventosCli.length + ')' : ''}</button><button class="tab" data-aba="dados">Dados</button></div>
      <div id="c-aba"></div>
    </div>`;

    const desenhar = () => {
      main.querySelectorAll('[data-aba]').forEach(t => t.classList.toggle('active', t.dataset.aba === aba));
      const alvo = main.querySelector('#c-aba');
      if (aba === 'respostas') {
        alvo.innerHTML = rs.length ? `<div class="card"><div class="list">${rs.map(r => itemResposta(r, c)).join('')}</div></div>`
          : `<div class="card">${A.vazio('respostas', 'Nenhuma resposta ainda', 'Envie um formulário para este cliente.', `<button class="btn" data-enviar-vazio>${ic('enviar', 16)} Enviar formulário</button>`)}</div>`;
        ligarRespostas(alvo, rs, () => A.recarregar());
        alvo.querySelector('[data-enviar-vazio]')?.addEventListener('click', () => A.abrirEnvio({ empresa: c.nome }));
      } else if (aba === 'eventos') {
        alvo.innerHTML = `<div class="card"><div class="card-head"><h2>Eventos</h2><button class="btn btn-sm" data-novo-ev>${ic('mais', 15)} Novo evento</button></div><div class="list">${eventosCli.length ? A.cartoesEventos(eventosCli, respostas, clientes, 50) : A.vazio('agenda', 'Nenhum evento para esta empresa')}</div></div>`;
        alvo.querySelector('[data-novo-ev]').addEventListener('click', () => A.editarEvento({ cliente_id: c.id }));
      } else if (aba === 'formularios') {
        alvo.innerHTML = `<div class="card"><div class="list">${porForm.map(({ f, rs }) => `<a class="list-item" href="#/respostas/${f.id}?cliente=${c.id}"><span class="list-icon">${ic(f.icone)}</span>
          <span class="list-main"><span class="list-title">${esc(f.titulo)}</span><span class="list-sub">última ${esc(A.relativo(rs[0].created_at))}</span></span><span class="badge badge-green">${rs.length}</span><span class="seta">${ic('direita', 18)}</span></a>`).join('')
          || A.vazio('formularios', 'Nenhum formulário respondido')}</div></div>`;
      } else {
        alvo.innerHTML = `<div class="grid grid-2" style="align-items:start"><div class="card card-pad stack">
          <div><div class="label">Contato</div>${esc(c.contato || '—')}${c.cargo ? `<div class="small muted">${esc(c.cargo)}</div>` : ''}</div>
          <div><div class="label">Telefone</div>${esc(c.telefone || '—')}</div><div><div class="label">E-mail</div>${esc(c.email || '—')}</div>
          <div><div class="label">Cidade · segmento</div>${esc([c.cidade, c.segmento].filter(Boolean).join(' · ') || '—')}</div></div>
          <div class="card card-pad stack"><div><div class="label">Observações</div><p style="white-space:pre-wrap">${esc(c.observacoes || '—')}</p></div>
          <div><div class="label">Também aparece como</div>${(c.apelidos || []).length ? `<div class="chips">${c.apelidos.map(a => `<span class="badge">${esc(a)}</span>`).join('')}</div>` : '<span class="muted">—</span>'}</div></div></div>`;
      }
    };
    desenhar();
    main.querySelectorAll('[data-aba]').forEach(b => b.addEventListener('click', () => { aba = b.dataset.aba; desenhar(); }));
    main.querySelector('[data-editar]').addEventListener('click', () => editarCliente(c, () => A.recarregar()));
    main.querySelector('[data-enviar-cli]').addEventListener('click', () => A.abrirEnvio({ empresa: c.nome }));
  };

  // ═════════════════════════ FORMULÁRIOS ═════════════════════════
  T.formularios = async main => {
    const respostas = await A.respostas();
    const conta = id => respostas.filter(r => r.section === id).length;
    const cats = window.RH_CATEGORIAS || [];
    let cat = 'todos', k = '';
    main.innerHTML = `<div class="page">
      ${cabecalho({ icone: 'formularios', titulo: 'Formulários', sub: 'Envie o link para o cliente responder. As respostas chegam aqui automaticamente.' })}
      <div class="seg" id="cats">
        <button data-cat="todos">Todos <span class="n">${F.lista().length}</span></button>
        ${cats.map(c => `<button data-cat="${c.id}">${ic(c.icone, 15)} ${esc(c.titulo)} <span class="n">${F.lista().filter(f => f.categoria === c.id).length}</span></button>`).join('')}
      </div>
      <div class="search" style="margin-bottom:6px"><input class="input" id="busca" placeholder="Buscar formulário…" aria-label="Buscar formulário"></div>
      <div id="lista"></div></div>`;
    const cartao = f => {
      const n = conta(f.id);
      return `<div class="card form-card">
        <div class="form-card-top"><span class="list-icon">${ic(f.icone, 22)}</span><div style="min-width:0"><h3>${esc(f.titulo)}</h3>${f.modulo || f.etapa ? `<div class="small muted">${esc(f.modulo || f.etapa)}</div>` : ''}</div></div>
        <p>${esc(f.descricao || '')}</p>
        <div class="form-card-meta">${f.publico ? `<span class="badge">${ic('pessoa', 13)} ${esc(f.publico)}</span>` : ''}${f.tempo ? `<span class="badge">${ic('relogio', 13)} ${esc(f.tempo)}</span>` : ''}
          ${f.interno ? `<span class="badge badge-gold">${ic('cadeado', 13)} Uso interno</span>` : F.temInterno(f) ? `<span class="badge badge-gold">${ic('cadeado', 13)} Parte interna</span>` : ''}</div>
        <div class="form-card-actions">
          ${f.interno ? '' : `<button class="btn btn-sm" data-enviar-f="${f.id}">${ic('enviar', 15)} Enviar</button>`}
          <a class="btn btn-sec btn-sm" href="${A.linkPreencher(f.id)}" target="_blank" rel="noopener">${ic(F.temInterno(f) ? 'editar' : 'olho', 15)} ${F.temInterno(f) ? 'Preencher' : 'Visualizar'}</a>
          <a class="btn btn-ghost btn-sm" href="#/respostas/${f.id}">${ic('respostas', 15)} ${n}</a></div></div>`;
    };
    const desenhar = () => {
      main.querySelectorAll('[data-cat]').forEach(b => b.classList.toggle('active', b.dataset.cat === cat));
      const html = cats.filter(c => cat === 'todos' || c.id === cat).map(c => {
        const fs = F.lista().filter(f => f.categoria === c.id && (!k || A.chave(f.titulo + ' ' + (f.descricao || '') + ' ' + (f.modulo || '')).includes(k)));
        if (!fs.length) return '';
        return `<h2 class="section-title">${esc(c.titulo)}</h2><div class="grid grid-3">${fs.map(cartao).join('')}</div>`;
      }).join('');
      main.querySelector('#lista').innerHTML = html || `<div class="card" style="margin-top:16px">${A.vazio('busca', 'Nenhum formulário encontrado')}</div>`;
      main.querySelectorAll('[data-enviar-f]').forEach(b => b.addEventListener('click', () => A.abrirEnvio({ formId: b.dataset.enviarF })));
    };
    desenhar();
    main.querySelectorAll('[data-cat]').forEach(b => b.addEventListener('click', () => { cat = b.dataset.cat; desenhar(); }));
    main.querySelector('#busca').addEventListener('input', e => { k = A.chave(e.target.value); desenhar(); });
  };

  // ═════════════════════════ RESPOSTAS ═════════════════════════
  const PERIODOS = [['0', 'Tudo'], ['30', '30 dias'], ['90', '90 dias'], ['365', '12 meses']];

  T.respostas = async (main, [formId], q) => {
    const [respostas, clientes, eventos] = await Promise.all([A.respostas(), A.clientes(), A.eventos().catch(() => [])]);
    const idx = A.indice(clientes);
    const form = formId ? F.get(formId) : null;
    const estado = { cliente: q.get('cliente') || '', periodo: q.get('periodo') || '0', busca: '', aba: q.get('aba') || (form ? 'resumo' : 'lista'), sel: null, evento: q.get('evento') || '' };
    const evento = eventos.find(e => e.id === estado.evento);

    const opcoesForm = (window.RH_CATEGORIAS || []).map(cat => `<optgroup label="${esc(cat.titulo)}">${F.lista().filter(f => f.categoria === cat.id).map(f =>
      `<option value="${f.id}"${f.id === formId ? ' selected' : ''}>${esc(f.titulo)}</option>`).join('')}</optgroup>`).join('');

    main.innerHTML = `<div class="page">
      ${cabecalho({ icone: form ? form.icone : 'respostas', eyebrow: form ? esc(F.categoria(form.categoria)?.titulo || '') : '', titulo: form ? form.titulo : 'Respostas',
        sub: form ? esc(form.descricao || '') : 'Tudo o que os clientes responderam, em um só lugar.',
        acoes: `${form ? `<button class="btn btn-sec" data-csv>${ic('baixar', 16)} Planilha</button>` : ''}<button class="btn btn-sec" data-atualizar>${ic('atualizar', 16)} Atualizar</button>${form && !form.interno ? `<button class="btn" data-enviar-f>${ic('enviar', 16)} Enviar</button>` : ''}` })}
      <div class="card filtros"><div class="field-row c3">
        <div><label class="label" for="r-form">Formulário</label><select class="select" id="r-form"><option value="">Todos os formulários</option>${opcoesForm}</select></div>
        <div><label class="label" for="r-cli">Cliente</label><select class="select" id="r-cli"><option value="">Todos os clientes</option>${clientes.map(c => `<option value="${c.id}"${c.id === estado.cliente ? ' selected' : ''}>${esc(c.nome)}</option>`).join('')}<option value="_sem"${estado.cliente === '_sem' ? ' selected' : ''}>Sem cliente cadastrado</option></select></div>
        <div><label class="label" for="r-busca">Buscar</label><div class="search"><input class="input" id="r-busca" placeholder="Nome, empresa ou texto"></div></div></div>
        <div class="row" style="margin-top:14px"><div class="chips" id="r-per">${PERIODOS.map(([k, t]) => `<button class="chip${k === estado.periodo ? ' active' : ''}" data-p="${k}">${t}</button>`).join('')}</div>
          ${evento ? `<span class="spacer"></span><a class="badge badge-gold" href="#/eventos/${evento.id}">${ic('agenda', 13)} Evento: ${esc(evento.nome)}</a><a class="btn btn-ghost btn-sm" href="#/respostas${form ? '/' + form.id : ''}">${ic('fechar', 14)} Tirar filtro</a>` : ''}</div></div>
      ${form ? `<div class="tabs" style="margin-bottom:18px"><button class="tab" data-aba="resumo">${ic('grafico', 15)} Resumo</button><button class="tab" data-aba="lista">${ic('lista', 15)} Respostas</button></div>` : ''}
      <div id="r-conteudo"></div></div>`;

    const filtradas = () => {
      const k = A.chave(estado.busca);
      return respostas.filter(r => {
        if (form && r.section !== form.id) return false;
        if (estado.evento && r.evento_id !== estado.evento) return false;
        if (estado.cliente === '_sem' && A.clienteDe(r, idx)) return false;
        if (estado.cliente && estado.cliente !== '_sem' && A.clienteDe(r, idx)?.id !== estado.cliente) return false;
        if (!A.dentroDe(r, +estado.periodo)) return false;
        if (k && !A.chave([r.company, r.nome, r.cargo_setor, r.r1, r.r2, r.r3, r.r4, r.r5, r.r6].join(' ')).includes(k)) return false;
        return true;
      });
    };

    const painel = r => {
      const f = F.get(r.section);
      const cli = A.clienteDe(r, idx);
      return `<div class="resp-painel-head"><div style="min-width:0">
          <div class="row" style="margin-bottom:8px"><span class="badge badge-green">${ic(f ? f.icone : 'documento', 13)} ${esc(f ? f.titulo : r.section)}</span><span class="badge">${ic('calendario', 13)} ${esc(A.dataBR(A.dataResp(r)))}</span></div>
          <h2>${esc(r.nome || 'Sem identificação')}</h2>
          <p class="muted">${esc([r.cargo_setor, cli ? cli.nome : r.company].filter(Boolean).join(' · '))}</p></div>
          <div class="row">${cli ? `<a class="btn btn-sec btn-sm" href="#/clientes/${cli.id}">${ic('clientes', 15)} Cliente</a>` : ''}<button class="btn btn-sec btn-sm" data-p-imprimir>${ic('imprimir', 15)} Imprimir</button><button class="btn btn-danger btn-sm" data-p-excluir aria-label="Excluir resposta">${ic('lixeira', 15)}</button></div></div>
        <div class="resp-painel-corpo">${f ? F.htmlResposta(f, r) : ''}</div>`;
    };

    const desenhar = () => {
      const rs = filtradas();
      main.querySelectorAll('[data-aba]').forEach(t => t.classList.toggle('active', t.dataset.aba === estado.aba));
      const alvo = main.querySelector('#r-conteudo');
      if (form && estado.aba === 'resumo') { alvo.innerHTML = resumo(form, rs); ligarAbertos(alvo); A.animar(alvo); return; }
      if (!rs.length) { alvo.innerHTML = `<div class="card">${A.vazio('respostas', 'Nenhuma resposta encontrada', respostas.length ? 'Ajuste os filtros acima.' : 'Envie um formulário para começar.')}</div>`; return; }
      if (!rs.some(r => String(r.id) === estado.sel)) estado.sel = String(rs[0].id);
      alvo.innerHTML = `<div class="split">
        <div class="card"><div class="card-head"><h2>${A.plural(rs.length, 'resposta', 'respostas')}</h2></div><div class="resp-lista">
          ${rs.map(r => { const cli = A.clienteDe(r, idx); const f = F.get(r.section); const emp = cli ? cli.nome : (r.company || 'Sem empresa');
            return `<button class="resp-item${String(r.id) === estado.sel ? ' active' : ''}" data-resp="${esc(r.id)}"><span class="avatar${cli ? '' : ' gold'}">${esc(A.iniciais(emp))}</span>
              <span class="list-main"><span class="list-title">${esc(r.nome || 'Sem identificação')}</span><span class="list-sub">${esc(form ? emp : (f ? f.titulo : r.section) + ' · ' + emp)}</span></span>
              <span class="resp-quando">${esc(A.relativo(r.created_at || A.dataResp(r)))}</span></button>`; }).join('')}
        </div></div>
        <div class="card resp-painel" id="r-painel"></div></div>`;
      const mostrar = () => {
        const r = rs.find(x => String(x.id) === estado.sel);
        const el = alvo.querySelector('#r-painel');
        el.innerHTML = painel(r);
        el.querySelector('[data-p-imprimir]').addEventListener('click', () => A.imprimir(F.rotulo(r.section), el.querySelector('.resp-painel-corpo').innerHTML));
        el.querySelector('[data-p-excluir]').addEventListener('click', async () => {
          if (!await A.confirmar('Excluir esta resposta definitivamente? Não dá para desfazer.', { ok: 'Excluir', perigo: true })) return;
          try { await A.excluirResposta(r.id); A.toast('Resposta excluída.'); respostas.splice(respostas.indexOf(r), 1); estado.sel = null; desenhar(); } catch (e) { A.toast(e.message); }
        });
      };
      mostrar();
      alvo.querySelectorAll('[data-resp]').forEach(b => b.addEventListener('click', () => {
        if (!desktop()) { A.abrirResposta(rs.find(r => String(r.id) === b.dataset.resp), () => desenhar()); return; }
        estado.sel = b.dataset.resp;
        alvo.querySelectorAll('.resp-item').forEach(x => x.classList.toggle('active', x === b));
        mostrar();
      }));
    };

    const resumo = (f, rs) => {
      if (!rs.length) return `<div class="card">${A.vazio('grafico', 'Ainda sem respostas para resumir', 'Os gráficos aparecem assim que chegarem respostas.')}</div>`;
      const est = F.estatisticas(f, rs).filter(e => e.total);
      const empresas = new Set(rs.map(r => A.clienteDe(r, idx)?.id || A.chave(r.company)).filter(Boolean)).size;
      const ultima = rs[0];
      const abertos = F.campos(f).filter(c => c.tipo === 'textarea' || (c.tipo === 'texto' && !c.coluna && !['nome', 'empresa', 'cargo', 'diretor', 'setor'].includes(c.id) && !/empresa|candidato|vaga|nome/.test(c.id)));
      const cards = est.map(e => `<div class="card card-pad"><div class="row-between" style="margin-bottom:14px;align-items:flex-start;flex-wrap:nowrap"><h3 style="font-size:15px;font-family:var(--font);font-weight:900;line-height:1.35">${esc(e.campo.rotulo || e.campo.ajuda || e.campo.id)}</h3>
        ${e.media != null ? `<span class="badge badge-green">média ${e.media.toFixed(1).replace('.', ',')}</span>` : ''}</div>${A.barras(e.contagem, e.total)}<p class="small muted" style="margin-top:12px">${A.plural(e.total, 'resposta', 'respostas')}${e.campo.tipo === 'checkbox' ? ' · várias opções por pessoa' : ''}</p></div>`).join('');
      const textos = abertos.map(c => {
        const itens = F.textosAbertos(f, rs, c.id);
        if (!itens.length) return '';
        return `<div class="card"><div class="card-head"><h3 style="line-height:1.35">${esc(c.rotulo || c.id)}</h3><span class="badge">${itens.length}</span></div><div class="card-body stack" data-abertos>
          ${itens.map((x, i) => `<div class="quote${i >= 3 ? ' hidden' : ''}"><p>${esc(F.texto(c, x.valor))}</p><cite>${esc([x.row.nome, x.row.company, A.dataBR(A.dataResp(x.row))].filter(Boolean).join(' · '))}</cite></div>`).join('')}
          ${itens.length > 3 ? `<button class="btn btn-ghost btn-sm" data-mais>Ver todas (${itens.length})</button>` : ''}</div></div>`;
      }).join('');
      return `<div class="stat-strip">${stat('respostas', rs.length, 'Respostas')}${stat('clientes', empresas, 'Empresas')}${stat('grafico', est.length, 'Perguntas fechadas')}${stat('calendario', A.relativo(ultima.created_at || A.dataResp(ultima)), 'Última', true)}</div>
        ${cards ? `<div class="grid grid-2" style="align-items:start">${cards}</div>` : ''}
        ${textos ? `<h2 class="section-title">Respostas abertas</h2><div class="grid grid-2" style="align-items:start">${textos}</div>` : ''}`;
    };
    const ligarAbertos = el => el.querySelectorAll('[data-mais]').forEach(b => b.addEventListener('click', () => {
      b.closest('[data-abertos]').querySelectorAll('.quote.hidden').forEach(q => q.classList.remove('hidden')); b.remove();
    }));

    main.querySelector('#r-form').addEventListener('change', e => A.ir('/respostas' + (e.target.value ? '/' + e.target.value : '') + '?' + [estado.cliente && 'cliente=' + estado.cliente, estado.evento && 'evento=' + estado.evento].filter(Boolean).join('&')));
    main.querySelector('#r-cli').addEventListener('change', e => { estado.cliente = e.target.value; desenhar(); });
    main.querySelector('#r-busca').addEventListener('input', A.debounce(e => { estado.busca = e.target.value; desenhar(); }, 200));
    main.querySelectorAll('[data-p]').forEach(b => b.addEventListener('click', () => { estado.periodo = b.dataset.p; main.querySelectorAll('[data-p]').forEach(x => x.classList.toggle('active', x === b)); desenhar(); }));
    main.querySelectorAll('[data-aba]').forEach(b => b.addEventListener('click', () => { estado.aba = b.dataset.aba; desenhar(); }));
    main.querySelector('[data-atualizar]').addEventListener('click', async () => { await A.respostas(true); A.recarregar(); });
    main.querySelector('[data-enviar-f]')?.addEventListener('click', () => {
      const cli = clientes.find(c => c.id === estado.cliente);
      A.abrirEnvio({ formId: form.id, empresa: cli ? cli.nome : '', evento });
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
      ${cabecalho({ icone: 'estrela', ouro: true, titulo: 'Satisfação', sub: 'Resultado da Pesquisa de Experiência enviada após cada serviço.', acoes: `<button class="btn" data-enviar-p>${ic('enviar', 16)} Enviar pesquisa</button>` })}
      <div class="row" style="margin-bottom:18px"><select class="select" id="s-cli" style="max-width:320px" aria-label="Cliente"><option value="">Todos os clientes</option>${clientes.map(c => `<option value="${c.id}">${esc(c.nome)}</option>`).join('')}</select>
        <div class="chips">${PERIODOS.map(([k, t]) => `<button class="chip${k === '0' ? ' active' : ''}" data-p="${k}">${t}</button>`).join('')}</div></div>
      <div id="s-conteudo"></div></div>`;

    const desenhar = () => {
      const rs = todas.filter(r => A.dentroDe(r, +estado.periodo) && (!estado.cliente || A.clienteDe(r, idx)?.id === estado.cliente));
      const alvo = main.querySelector('#s-conteudo');
      if (!rs.length) { alvo.innerHTML = `<div class="card">${A.vazio('estrela', 'Nenhuma avaliação no período', 'Envie a Pesquisa de Experiência depois de cada serviço.', `<button class="btn" data-enviar-p2>${ic('enviar', 16)} Enviar pesquisa</button>`)}</div>`;
        alvo.querySelector('[data-enviar-p2]').addEventListener('click', () => A.abrirEnvio({ formId: form.id })); return; }
      const vs = rs.map(r => ({ r, v: F.valores(form, r).v }));
      const notas = vs.map(x => x.v.q8_nps).filter(v => v !== '' && v != null).map(Number);
      const nps = F.nps(notas);
      const est = Object.fromEntries(F.estatisticas(form, rs).map(e => [e.campo.id, e]));
      const zona = s => s >= 75 ? ['Zona de excelência', 'var(--ok)'] : s >= 50 ? ['Zona de qualidade', 'var(--green)'] : s >= 0 ? ['Zona de aperfeiçoamento', 'var(--warn)'] : ['Zona crítica', 'var(--danger)'];
      const [zTxt, zCor] = nps ? zona(nps.score) : ['', ''];
      const org = est.q2_organizacao;
      const excelente = est.q1_avaliacao.total ? Math.round(est.q1_avaliacao.contagem[0].n / est.q1_avaliacao.total * 100) : 0;
      const hist = Array.from({ length: 11 }, (_, n) => notas.filter(x => x === n).length);
      const maxH = Math.max(1, ...hist);
      const citacoes = (id, titulo, icone) => {
        const itens = vs.filter(x => x.v[id]);
        if (!itens.length) return '';
        return `<div class="card"><div class="card-head"><h3><span class="row" style="gap:8px">${ic(icone, 17)} ${esc(titulo)}</span></h3><span class="badge">${itens.length}</span></div><div class="card-body stack">
          ${itens.map(x => { const cli = A.clienteDe(x.r, idx); return `<div class="quote"><p>${esc(x.v[id])}</p><cite>${esc([x.r.nome, cli ? cli.nome : x.r.company, A.dataBR(A.dataResp(x.r))].filter(Boolean).join(' · '))}</cite></div>`; }).join('')}</div></div>`;
      };
      const grupos = new Map();
      vs.forEach(x => { const cli = A.clienteDe(x.r, idx); const k = cli ? cli.id : A.chave(x.r.company) || '_'; const g = grupos.get(k) || { nome: cli ? cli.nome : (x.r.company || 'Sem empresa'), itens: [] }; g.itens.push(x); grupos.set(k, g); });
      const linhas = [...grupos.values()].map(g => {
        const n = F.nps(g.itens.map(x => x.v.q8_nps).filter(v => v !== '' && v != null));
        const ns = g.itens.map(x => Number(x.v.q2_organizacao)).filter(Boolean);
        return `<tr><td><div class="cell-ident"><span class="avatar">${esc(A.iniciais(g.nome))}</span><strong>${esc(g.nome)}</strong></div></td><td class="num">${g.itens.length}</td><td class="num">${n ? n.score : '—'}</td><td class="num">${ns.length ? (ns.reduce((a, b) => a + b, 0) / ns.length).toFixed(1).replace('.', ',') : '—'}</td></tr>`;
      }).join('');

      alvo.innerHTML = `<div class="stat-strip">${stat('estrela', nps ? nps.score : '—', 'NPS', true)}${stat('respostas', rs.length, 'Avaliações')}${stat('feliz', excelente + '%', 'Avaliação excelente')}${stat('grafico', org.media != null ? org.media.toFixed(1).replace('.', ',') : '—', 'Organização (1 a 5)')}</div>
      <div class="grid grid-3" style="align-items:start">
        <div class="card card-pad"><div class="kpi-label">NPS — recomendação</div>
          ${nps ? `${A.medidor(nps.score)}<div style="text-align:center;margin-top:-34px"><div class="nps-big gauge-num" style="color:${zCor}" data-contar="${nps.score}">${nps.score}</div><div class="small" style="color:${zCor};font-weight:900;margin-bottom:16px">${zTxt}</div></div>
          <div class="nps-split" aria-hidden="true"><span style="width:${nps.detratores / nps.n * 100}%;background:#C2410C"></span><span style="width:${nps.neutros / nps.n * 100}%;background:#D9A441"></span><span style="width:${nps.promotores / nps.n * 100}%;background:var(--ok)"></span></div>
          <div class="row-between small muted" style="margin-top:10px;font-weight:700"><span class="row" style="gap:5px">${ic('triste', 15)} ${nps.detratores} detratores</span><span class="row" style="gap:5px">${ic('neutro', 15)} ${nps.neutros}</span><span class="row" style="gap:5px">${ic('feliz', 15)} ${nps.promotores} promotores</span></div>` : '<p class="muted" style="margin-top:10px">Sem notas no período.</p>'}</div>
        <div class="card card-pad" style="grid-column:span 2"><div class="row-between"><span class="kpi-label">Distribuição das notas (0 a 10)</span><span class="small muted">% de notas 9–10 menos % de notas 0–6</span></div>
          <div class="histo">${hist.map((n, i) => `<div><b>${n || ''}</b><i style="height:${Math.round(n / maxH * 100)}%;background:${!n ? 'var(--line)' : i <= 6 ? 'linear-gradient(#E0612A,#B93A0C)' : i <= 8 ? 'var(--grad-gold)' : 'var(--grad-green)'};animation-delay:${i * 40}ms"></i><span>${i}</span></div>`).join('')}</div></div>
      </div>
      <div class="grid grid-3" style="margin-top:18px;align-items:start">
        <div class="card card-pad"><div class="kpi-label">Avaliação geral</div><div style="margin-top:14px">${A.barras(est.q1_avaliacao.contagem, est.q1_avaliacao.total)}</div></div>
        <div class="card card-pad"><div class="kpi-label">O conteúdo fez sentido?</div><div style="margin-top:14px">${A.barras(est.q3_conteudo.contagem, est.q3_conteudo.total)}</div></div>
        <div class="card card-pad"><div class="kpi-label">Envolvimento dos colaboradores</div><div style="margin-top:14px">${A.barras(est.q4_envolvimento.contagem, est.q4_envolvimento.total)}</div></div>
      </div>
      <h2 class="section-title">Por empresa</h2>
      <div class="card"><div class="table-wrap"><table class="table"><thead><tr><th>Empresa</th><th class="num">Avaliações</th><th class="num">NPS</th><th class="num">Organização</th></tr></thead><tbody>${linhas}</tbody></table></div></div>
      <h2 class="section-title">O que os clientes disseram</h2>
      <div class="grid grid-2" style="align-items:start">${citacoes('q9_frase', 'Em uma frase', 'conversa')}${citacoes('q5_valor', 'O que gerou valor', 'brilho')}${citacoes('q6_impacto', 'Impacto percebido', 'tendencia')}${citacoes('q7_melhoria', 'Sugestões de melhoria', 'editar')}</div>`;
      A.animar(alvo);
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
    const dados = lista.map(c => {
      const rs = A.doCliente(c, respostas);
      const v = progs[A.chavePrograma(c.nome)] || {};
      const feitos = FORMS_PROGRAMA.filter(id => rs.some(r => r.section === id)).length;
      const proxima = ETAPAS.find(([k]) => ((v.pct || {})[k] || 0) < 100);
      return { c, p: v.media || 0, feitos, proxima };
    });
    const media = dados.length ? Math.round(dados.reduce((s, d) => s + d.p, 0) / dados.length) : 0;
    main.innerHTML = `<div class="page">
      ${cabecalho({ icone: 'broto', titulo: 'Programa Construindo Juntos', sub: 'Diagnóstico, identidade, cultura e desenvolvimento: acompanhe cada cliente.' })}
      <div class="stat-strip">${stat('clientes', dados.length, 'No programa')}${stat('tendencia', media + '%', 'Progresso médio', true)}${stat('ok', dados.filter(d => d.p === 100).length, 'Concluídos')}${stat('formularios', dados.reduce((s, d) => s + d.feitos, 0), 'Formulários respondidos')}</div>
      ${dados.length ? `<div class="grid grid-3">${dados.map(({ c, p, feitos, proxima }) => `<a class="card cli-card" href="#/programa/${c.id}" data-cli="${c.id}">
        <div class="cli-top">${anel(p)}<div style="min-width:0;flex:1"><div class="cli-nome">${esc(c.nome)}</div><div class="cli-meta">${feitos} de ${FORMS_PROGRAMA.length} formulários respondidos</div></div></div>
        <div class="cli-prog" style="border-top:1px solid var(--line-2);padding-top:12px">${ic(p === 100 ? 'ok' : 'seta', 15)} ${p === 100 ? 'Programa concluído' : 'Próximo: ' + esc(proxima ? proxima[1] : '')}</div></a>`).join('')}</div>`
        : `<div class="card">${A.vazio('broto', 'Cadastre um cliente para acompanhar o programa', '', '<a class="btn" href="#/clientes">Ir para clientes</a>')}</div>`}</div>`;
  };

  T.programaCliente = async (main, [id]) => {
    const [respostas, clientes] = await Promise.all([A.respostas(), A.clientes()]);
    const c = clientes.find(x => x.id === id);
    if (!c) { main.innerHTML = `<div class="page"><div class="card">${A.vazio('busca', 'Cliente não encontrado', '', '<a class="btn" href="#/programa">Voltar</a>')}</div></div>`; return; }
    const rs = A.doCliente(c, respostas);
    const [prog0, com0] = await Promise.all([A.lerDado(c.nome, 'progresso'), A.lerDado(c.nome, 'comunicacao')]);
    const prog = { pct: { ...(prog0 && prog0.pct) }, obs: { ...(prog0 && prog0.obs) } };
    const com = { itens: { ...(com0 && com0.itens) }, obs: (com0 && com0.obs) || '' };
    const media = () => Math.round(ETAPAS.reduce((s, [k]) => s + (prog.pct[k] || 0), 0) / ETAPAS.length);
    const feitos = FORMS_PROGRAMA.filter(fid => rs.some(r => r.section === fid)).length;

    main.innerHTML = `<div class="page">
      <a class="back" href="#/programa">${ic('voltar', 16)} Programa</a>
      <section class="card perfil">
        <div class="perfil-capa"><span class="logo" data-logo="simbolo" data-tema="escuro"></span></div>
        <div class="perfil-corpo"><div id="p-anel" style="background:#fff;border-radius:50%;padding:6px;box-shadow:var(--shadow-2)">${anel(media(), true)}</div>
          <div class="perfil-info"><div class="eyebrow" style="margin:0">Programa Construindo Juntos</div><h1>${esc(c.nome)}</h1>
            <div class="perfil-contatos"><span>${ic('formularios', 14)} ${feitos} de ${FORMS_PROGRAMA.length} formulários</span><span>${ic('broto', 14)} ${ETAPAS.filter(([k]) => (prog.pct[k] || 0) === 100).length} de ${ETAPAS.length} etapas concluídas</span></div></div>
          <div class="perfil-acoes"><a class="btn btn-sec" href="#/clientes/${c.id}">${ic('clientes', 16)} Ficha</a><button class="btn btn-sec" data-cartilha>${ic('baixar', 16)} Cartilha</button><button class="btn btn-gold" data-relatorio>${ic('documento', 16)} Relatório compilado</button></div>
        </div>
      </section>
      <div class="grid grid-3" style="align-items:start">
        <div class="card"><div class="card-head"><h2>Formulários</h2><span class="badge badge-green">${feitos}/${FORMS_PROGRAMA.length}</span></div>
          ${FORMS_PROGRAMA.map(fid => { const f = F.get(fid); const n = rs.filter(r => r.section === fid).length; return `<div class="passo${n ? ' feito' : ''}"><span class="passo-ico">${ic(n ? 'ok' : f.icone, 17)}</span>
            <span class="list-main"><span class="list-title" style="font-size:14px">${esc(f.titulo)}</span><span class="list-sub">${n ? `<a href="#/respostas/${fid}?cliente=${c.id}">${A.plural(n, 'resposta', 'respostas')}</a>` : esc(f.etapa || f.publico || '')}</span></span>
            <button class="btn btn-sec btn-sm btn-icon" data-enviar-f="${fid}" aria-label="Enviar ${esc(f.titulo)}">${ic('enviar', 15)}</button></div>`; }).join('')}</div>
        <div class="card"><div class="card-head"><h2>Progresso por etapa</h2><span class="badge badge-green" id="p-media">${media()}%</span></div>
          ${ETAPAS.map(([k, nome], i) => `<div class="etapa"><span class="etapa-n${(prog.pct[k] || 0) === 100 ? ' feita' : ''}" id="n-${k}">${(prog.pct[k] || 0) === 100 ? ic('ok', 15) : i + 1}</span><div>
            <div class="row-between"><strong>${esc(nome)}</strong><span class="pct" id="pct-${k}">${prog.pct[k] || 0}%</span></div>
            <input type="range" min="0" max="100" step="5" value="${prog.pct[k] || 0}" data-etapa="${k}" aria-label="Progresso: ${esc(nome)}">
            <textarea class="textarea" rows="1" style="min-height:38px;margin-top:6px;font-size:13.5px" placeholder="Observações" data-obs="${k}">${esc(prog.obs[k] || '')}</textarea></div></div>`).join('')}
          <div class="card-body small muted" id="p-salvo">As alterações são salvas automaticamente.</div></div>
        <div class="card"><div class="card-head"><h2>Comunicação interna</h2><span class="badge">Seção 4</span></div><div class="card-body">
          ${SECAO4.map((p, i) => { const it = com.itens['s4-' + (i + 1)] || {}; return `<label class="check"><input type="checkbox" data-s4="${i + 1}"${it.sim ? ' checked' : ''}><span>${esc(p)}</span></label>
            <textarea class="textarea" rows="1" style="min-height:38px;margin:0 0 8px 29px;width:calc(100% - 29px);font-size:13.5px" placeholder="Observações" data-s4obs="${i + 1}">${esc(it.obs || '')}</textarea>`; }).join('')}
          <label class="label" for="s4-obs" style="margin-top:10px">Observações gerais</label><textarea class="textarea" id="s4-obs" rows="3">${esc(com.obs)}</textarea>
          <p class="small muted" style="margin-top:10px" id="s4-salvo">Preenchido por você durante o diagnóstico. Salvo automaticamente.</p></div></div>
      </div></div>`;

    const aviso = (sel, ok) => { const el = main.querySelector(sel); el.textContent = ok ? 'Salvo' : 'Não foi possível salvar. Confira a conexão.'; el.style.color = ok ? 'var(--ok)' : 'var(--danger)'; };
    const salvarProg = A.debounce(async () => { try { await A.salvarDado(c.nome, 'progresso', { ...prog, media: media() }); aviso('#p-salvo', true); } catch { aviso('#p-salvo', false); } }, 700);
    const salvarCom = A.debounce(async () => { try { await A.salvarDado(c.nome, 'comunicacao', com); aviso('#s4-salvo', true); } catch { aviso('#s4-salvo', false); } }, 700);
    main.querySelectorAll('[data-etapa]').forEach(r => r.addEventListener('input', () => {
      const k = r.dataset.etapa;
      prog.pct[k] = +r.value;
      main.querySelector('#pct-' + k).textContent = r.value + '%';
      const n = main.querySelector('#n-' + k), feita = +r.value === 100;
      n.classList.toggle('feita', feita);
      n.innerHTML = feita ? ic('ok', 15) : ETAPAS.findIndex(e => e[0] === k) + 1;
      main.querySelector('#p-media').textContent = media() + '%';
      main.querySelector('#p-anel').innerHTML = anel(media(), true);
      salvarProg();
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
      corpo: `<p class="muted" style="margin-bottom:12px">Respostas de Direção, Gestores, Colaboradores e Identidade, mais a sua avaliação da comunicação.</p><pre style="white-space:pre-wrap;font-family:var(--font);font-size:14px;line-height:1.6;background:var(--surface-2);border:1px solid var(--line);border-radius:12px;padding:16px;max-height:60vh;overflow:auto">${esc(texto)}</pre>`,
      rodape: `<button class="btn btn-sec" data-copiar>${ic('copiar', 16)} Copiar texto</button><button class="btn" data-imprimir>${ic('imprimir', 16)} Imprimir / PDF</button>` });
    m.el.querySelector('[data-copiar]').addEventListener('click', async () => { try { await navigator.clipboard.writeText(texto); A.toast('Relatório copiado.'); } catch { A.toast('Selecione o texto e copie manualmente.'); } });
    m.el.querySelector('[data-imprimir]').addEventListener('click', () => A.imprimir('Relatório — ' + c.nome, `<pre style="white-space:pre-wrap;font-family:var(--font);font-size:13px;line-height:1.6">${esc(texto)}</pre>`));
  }

  // ═════════════════════════ MATERIAIS ═════════════════════════
  T.materiais = async main => {
    const mats = RH_CONFIG.materiais;
    const card = (m, capa) => `<div class="card mat-card">
      <div class="capa ${capa}">${ic(m.icone, 42)}<span class="folha" data-logo="simbolo" data-tema="escuro"></span></div>
      <div class="mat-corpo"><h3>${esc(m.titulo)}</h3><p>${esc(m.descricao)}</p>
        <div class="form-card-meta">${m.publico ? `<span class="badge badge-green">${ic('link', 13)} Link aberto para participantes</span>` : `<span class="badge">${ic('cadeado', 13)} Só com o seu login</span>`}</div>
        <div class="form-card-actions" style="margin-top:auto"><a class="btn btn-sm" href="${m.url}" target="_blank" rel="noopener">${ic(m.publico ? 'abrir' : 'apresentacao', 15)} ${m.publico ? 'Abrir' : 'Apresentar'}</a>
        ${m.publico ? `<button class="btn btn-sec btn-sm" data-copiar="${esc(location.origin + m.url)}">${ic('copiar', 15)} Copiar link</button><a class="btn btn-wa btn-sm" target="_blank" rel="noopener" href="https://wa.me/?text=${encodeURIComponent(m.titulo + ' — RH com Propósito\n' + location.origin + m.url)}">${ic('whatsapp', 15)}</a>` : ''}</div></div></div>`;
    main.innerHTML = `<div class="page">
      ${cabecalho({ icone: 'livro', titulo: 'Materiais', sub: 'Apostilas, apresentações e o guia de condução do Programa.' })}
      <h2 class="section-title">Para participantes</h2><div class="grid grid-3">${mats.filter(m => m.publico).map(m => card(m, '')).join('')}</div>
      <h2 class="section-title">Apresentações</h2><div class="grid grid-3">${mats.filter(m => !m.publico).map(m => card(m, 'escura')).join('')}</div>
      <h2 class="section-title">Guia do consultor</h2>
      <div class="grid grid-3">${card({ titulo: 'Mapa de condução e manual', descricao: 'As 6 etapas do Programa, os 8 módulos do guia de campo, roteiros de fala e checklists do consultor.', url: 'guia.html', icone: 'mapa' }, 'ouro').replace('target="_blank" rel="noopener"', '').replace(`${ic('apresentacao', 15)} Apresentar`, `${ic('mapa', 15)} Abrir guia`)}</div></div>`;
    main.querySelectorAll('[data-copiar]').forEach(b => b.addEventListener('click', () => A.copiar(b.dataset.copiar)));
  };

  // ═════════════════════════ PORTFÓLIOS ═════════════════════════
  T.portfolios = async main => {
    const lista = RH_CONFIG.portfolios || [];
    const mensagem = p => {
      let t = `${p.titulo} | RH com Propósito\nConheça as experiências: ${location.origin + p.url}`;
      if (p.pdf) t += `\nVersão em PDF: ${location.origin + p.pdf}`;
      if (p.formulario) t += `\n\nPara receber uma proposta, responda: ${A.link(p.formulario)}`;
      return t;
    };
    const card = (p, i) => `<div class="card mat-card">
      <a class="capa capa-foto" href="${p.url}" target="_blank" rel="noopener" aria-label="Abrir ${esc(p.titulo)}"><img src="${p.capa}" alt="" loading="lazy"></a>
      <div class="mat-corpo">${p.campanha ? `<div class="kpi-label">${esc(p.campanha)}</div>` : ''}<h3>${esc(p.titulo)}</h3><p>${esc(p.descricao)}</p>
        <div class="form-card-meta"><span class="badge badge-green">${ic('link', 13)} Link aberto para clientes</span>${p.formulario ? `<span class="badge">${ic('formularios', 13)} Com formulário de interesse</span>` : ''}</div>
        <div class="form-card-actions" style="margin-top:auto"><a class="btn btn-sm" href="${p.url}" target="_blank" rel="noopener">${ic('apresentacao', 15)} Abrir</a>
          ${p.pdf ? `<a class="btn btn-sec btn-sm" href="${p.pdf}" target="_blank" rel="noopener" title="Versão em PDF, com links">${ic('documento', 15)} PDF</a>` : ''}
          <button class="btn btn-sec btn-sm" title="Copiar link" data-copiar="${esc(location.origin + p.url)}">${ic('copiar', 15)}</button>
          <a class="btn btn-wa btn-sm" target="_blank" rel="noopener" title="Enviar pelo WhatsApp" href="https://wa.me/?text=${encodeURIComponent(mensagem(p))}">${ic('whatsapp', 15)}</a>
          <a class="btn btn-sec btn-sm" title="Enviar por e-mail" href="mailto:?subject=${encodeURIComponent(p.titulo + ' | RH com Propósito')}&body=${encodeURIComponent(mensagem(p))}">${ic('email', 15)}</a></div></div></div>`;
    main.innerHTML = `<div class="page">
      ${cabecalho({ icone: 'maleta', titulo: 'Portfólios', sub: 'Apresentações comerciais para enviar a empresas e clientes.' })}
      ${lista.length ? `<div class="grid grid-3">${lista.map(card).join('')}</div>` : A.vazio('maleta', 'Nenhum portfólio ainda', 'Os portfólios ficam em js/config.js.')}</div>`;
    main.querySelectorAll('[data-copiar]').forEach(b => b.addEventListener('click', () => A.copiar(b.dataset.copiar)));
  };

  // ═════════════════════════ CONTA / MAIS ═════════════════════════
  T.conta = async main => {
    main.innerHTML = `<div class="page" style="max-width:680px">
      ${cabecalho({ icone: 'usuario', titulo: 'Minha conta' })}
      <div class="card card-pad stack">
        <div class="cell-ident"><span class="avatar gold" style="width:52px;height:52px;border-radius:16px;font-size:17px">CR</span><div><strong>Cristiele Rodrigues</strong><div class="small muted">${esc(A.email)}</div></div></div>
        <form id="f-senha" class="stack" novalidate style="border-top:1px solid var(--line-2);padding-top:16px"><div class="kpi-label">Trocar senha</div><div><label class="label" for="nova">Nova senha</label><input class="input" id="nova" type="password" autocomplete="new-password" placeholder="Pelo menos 8 caracteres"></div>
          <div><label class="label" for="nova2">Repita a nova senha</label><input class="input" id="nova2" type="password" autocomplete="new-password"></div>
          <div class="alert hidden" id="msg"></div><div><button class="btn">${ic('cadeado', 16)} Trocar senha</button></div></form>
      </div>
      <div class="card card-pad" style="margin-top:16px"><div class="row-between"><span>Sair deste aparelho</span><button class="btn btn-danger" data-sair2>${ic('sair', 16)} Sair</button></div></div></div>`;
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
    const item = (href, icone, titulo, sub) => `<a class="list-item" href="${href}"><span class="list-icon">${ic(icone)}</span><span class="list-main"><span class="list-title">${titulo}</span><span class="list-sub">${sub}</span></span><span class="seta">${ic('direita', 18)}</span></a>`;
    main.innerHTML = `<div class="page">${cabecalho({ icone: 'menu', titulo: 'Mais' })}<div class="card"><div class="list">
      ${item('#/eventos', 'agenda', 'Eventos', 'Convites, presença e satisfação')}
      ${item('#/satisfacao', 'estrela', 'Satisfação', 'NPS e comentários dos clientes')}
      ${item('#/programa', 'broto', 'Programa Construindo Juntos', 'Progresso, relatório e cartilha')}
      ${item('#/portfolios', 'maleta', 'Portfólios', 'Apresentações comerciais para clientes')}
      ${item('#/materiais', 'livro', 'Materiais', 'Apostila, slides e guia')}
      ${item('#/conta', 'usuario', 'Minha conta', esc(A.email))}
    </div></div></div>`;
  };
})();
