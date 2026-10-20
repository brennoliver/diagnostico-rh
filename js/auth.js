// ═══════════════════════════════════════════════════
// RH com Propósito — login da administradora (Supabase Auth)
// Requer supabase-js, js/config.js e js/api.js.
//
// A tela de login usa estes ids: login-screen, login-email,
// login-senha, login-btn, login-erro. O conteúdo protegido fica em
// um elemento que começa oculto e é exibido por onEntrar().
// ═══════════════════════════════════════════════════
(function () {
  const RH = window.RH;

  async function verificarAdmin() {
    const { data, error } = await RH.supabase().rpc('is_admin');
    return !error && data === true;
  }

  RH.auth = {
    async sessaoAdmin() {
      const { data: { session } } = await RH.supabase().auth.getSession();
      if (!session) return null;
      return (await verificarAdmin()) ? session : null;
    },

    async entrar(email, senha) {
      const sb = RH.supabase();
      const { error } = await sb.auth.signInWithPassword({ email: email.trim(), password: senha });
      if (error) throw new Error('E-mail ou senha incorretos.');
      if (!(await verificarAdmin())) {
        await sb.auth.signOut();
        throw new Error('Este usuário não tem acesso de administradora.');
      }
    },

    async sair() {
      await RH.supabase().auth.signOut();
      location.reload();
    },

    // Liga a tela de login; chama onEntrar(session) quando houver acesso.
    async protegerPagina(onEntrar) {
      const tela = document.getElementById('login-screen');
      const email = document.getElementById('login-email');
      const senha = document.getElementById('login-senha');
      const btn = document.getElementById('login-btn');
      const erro = document.getElementById('login-erro');

      const liberar = session => { tela.style.display = 'none'; onEntrar(session); };

      const session = await RH.auth.sessaoAdmin().catch(() => null);
      if (session) return liberar(session);
      tela.style.display = '';

      async function tentar() {
        erro.textContent = '';
        btn.disabled = true;
        try {
          await RH.auth.entrar(email.value, senha.value);
          liberar(await RH.auth.sessaoAdmin());
        } catch (e) {
          erro.textContent = e.message;
          senha.value = '';
        } finally {
          btn.disabled = false;
        }
      }
      btn.addEventListener('click', tentar);
      [email, senha].forEach(el => el.addEventListener('keydown', e => { if (e.key === 'Enter') tentar(); }));
    }
  };
})();
