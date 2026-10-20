// ═══════════════════════════════════════════════════
// Programa Construindo Juntos — identificação da empresa + senha
// Usado por questionario.html, identidade.html e cartilha.html.
// A senha é conferida no servidor (RPC verificar_codigo); nada de
// senha fica escrita nesta página.
// ═══════════════════════════════════════════════════
window.Acesso = (function () {
  const $ = id => document.getElementById(id);
  let cfg = null;

  function showView(id) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    $('view-' + id).classList.add('active');
    window.scrollTo(0, 0);
  }

  const empresaAtual = () => RH.normalizarEmpresa(localStorage.getItem('diag_company') || '');

  function iniciar(c) {
    cfg = c;
    const param = new URLSearchParams(location.search).get('empresa');
    if (param) localStorage.setItem('diag_company', RH.normalizarEmpresa(param));

    $('empresa-titulo').textContent = c.titulo;
    $('companyName').value = empresaAtual();
    $('companyName').addEventListener('keydown', e => { if (e.key === 'Enter') confirmarEmpresa(); });
    $('pwdModal').addEventListener('click', e => { if (e.target === $('pwdModal')) closeModal(); });
    showView('empresa');
    if (empresaAtual()) pedirCodigo();
  }

  function confirmarEmpresa() {
    const input = $('companyName');
    const empresa = RH.normalizarEmpresa(input.value);
    if (!empresa) {
      input.focus();
      input.style.borderColor = '#F87171';
      setTimeout(() => { input.style.borderColor = ''; }, 2500);
      return;
    }
    localStorage.setItem('diag_company', empresa);
    pedirCodigo();
  }

  function pedirCodigo() {
    if (sessionStorage.getItem('acesso_' + cfg.chave) === '1') return liberar();
    $('modal-icon').textContent = cfg.icone;
    $('modal-title').textContent = cfg.titulo;
    $('modal-sub').textContent = cfg.sub + '\n\nDigite a senha para acessar.';
    $('modal-error').style.display = 'none';
    $('pwdInput').value = '';
    $('pwdInput').classList.remove('error');
    $('pwdModal').classList.add('open');
    setTimeout(() => $('pwdInput').focus(), 100);
  }

  function liberar() {
    $('pwdModal').classList.remove('open');
    cfg.onLiberado(empresaAtual());
  }

  function erro(msg) {
    $('modal-error').textContent = msg;
    $('modal-error').style.display = 'block';
    $('pwdInput').classList.add('error');
    $('pwdInput').value = '';
    setTimeout(() => $('pwdInput').classList.remove('error'), 500);
  }

  async function checkPassword() {
    const codigo = $('pwdInput').value.trim();
    if (!codigo) return;
    let ok = false;
    try {
      ok = await RH.verificarCodigo(cfg.chave, codigo);
    } catch {
      return erro('Não foi possível verificar agora. Confira sua conexão.');
    }
    if (!ok) return erro('Senha incorreta. Tente novamente.');
    sessionStorage.setItem('acesso_' + cfg.chave, '1');
    liberar();
  }

  function closeModal() { $('pwdModal').classList.remove('open'); }

  return { iniciar, confirmarEmpresa, checkPassword, closeModal, showView, empresaAtual };
})();

// Nomes usados pelos onclick do HTML
function showView(id)       { Acesso.showView(id); }
function checkPassword()    { Acesso.checkPassword(); }
function closeModal()       { Acesso.closeModal(); }
function confirmarEmpresa() { Acesso.confirmarEmpresa(); }
