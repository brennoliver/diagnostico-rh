// ═══════════════════════════════════════════════════
// RH com Propósito — acesso a dados compartilhado
// Requer js/config.js. Formulários públicos usam só fetch (sem
// supabase-js); RH.supabase() é para páginas de admin que carregam
// a biblioteca.
// ═══════════════════════════════════════════════════
(function () {
  const C = window.RH_CONFIG;
  const RH = window.RH = window.RH || {};

  RH.esc = s => String(s ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  RH.escBr = s => RH.esc(s).replace(/\n/g, '<br>');
  RH.normalizarEmpresa = s => String(s || '').trim().replace(/\s+/g, ' ');
  RH.hoje = () => new Date().toISOString().split('T')[0];

  // Lê JSON de r1 tanto em texto (formato atual) quanto em objeto
  RH.lerJson = v => {
    if (v && typeof v === 'object') return v;
    try { return JSON.parse(v || '{}') || {}; } catch { return {}; }
  };

  function headers() {
    return {
      apikey: C.supabaseKey,
      Authorization: 'Bearer ' + C.supabaseKey,
      'Content-Type': 'application/json'
    };
  }

  // Grava uma linha em "responses". Lança erro se não gravar.
  RH.salvarResposta = async function (row) {
    const body = { ...row };
    body.company = RH.normalizarEmpresa(row.company);
    body.data_resposta = row.data_resposta || RH.hoje();
    ['r1', 'r2', 'r3', 'r4', 'r5', 'r6'].forEach(k => {
      if (body[k] && typeof body[k] === 'object') body[k] = JSON.stringify(body[k]);
    });
    const res = await fetch(C.supabaseUrl + '/rest/v1/responses', {
      method: 'POST',
      headers: { ...headers(), Prefer: 'return=minimal' },
      body: JSON.stringify(body)
    });
    if (!res.ok) {
      const txt = await res.text().catch(() => '');
      throw new Error('Não foi possível salvar (HTTP ' + res.status + ') ' + txt);
    }
  };

  async function rpc(nome, args) {
    const res = await fetch(C.supabaseUrl + '/rest/v1/rpc/' + nome, {
      method: 'POST', headers: headers(), body: JSON.stringify(args)
    });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    return res.json();
  }

  // Confere um código de acesso no servidor (tabela codigos_acesso)
  RH.verificarCodigo = async (chave, codigo) =>
    (await rpc('verificar_codigo', { p_chave: chave, p_codigo: codigo })) === true;

  RH.progressoPercentual = async empresa => {
    try { return (await rpc('progresso_percentual', { p_empresa: RH.normalizarEmpresa(empresa) })) || 0; }
    catch { return 0; }
  };

  // Envio por e-mail (Web3Forms). Nunca lança: devolve true/false.
  RH.enviarEmail = async function ({ subject, message, from_name, ...extra }) {
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: C.web3formsKey, subject, message,
          from_name: from_name || 'RH com Propósito', ...extra
        })
      });
      const j = await res.json();
      return !!j.success;
    } catch { return false; }
  };

  let _sb = null;
  RH.supabase = function () {
    if (!_sb) _sb = window.supabase.createClient(C.supabaseUrl, C.supabaseKey);
    return _sb;
  };

  RH.rotuloSecao = id => {
    const f = (window.RH_FORMULARIOS || []).find(x => x.id === id);
    return f ? `${f.icone} ${f.titulo}` : id;
  };
})();
