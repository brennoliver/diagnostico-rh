// ═══════════════════════════════════════════════════
// RH com Propósito — login da consultora (Supabase Auth)
// Requer supabase-js, js/config.js e js/api.js.
// O acesso aos dados é garantido no banco (RLS + is_admin());
// estas funções só cuidam da experiência de login.
// ═══════════════════════════════════════════════════
(function () {
  const RH = window.RH;
  const ENTRADA = '/';

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
      location.href = ENTRADA;
    },

    // Para páginas internas: sem login, volta para a entrada.
    async exigirLogin() {
      const s = await RH.auth.sessaoAdmin().catch(() => null);
      if (s) return s;
      location.replace(ENTRADA + '?volta=' + encodeURIComponent(location.pathname + location.search + location.hash));
      return new Promise(() => {});
    },

    async enviarRedefinicao(email) {
      const { error } = await RH.supabase().auth.resetPasswordForEmail(email.trim(), { redirectTo: location.origin + ENTRADA + '?redefinir=1' });
      if (error) throw new Error('Não foi possível enviar o e-mail agora. Tente de novo em alguns minutos.');
    },

    async trocarSenha(nova) {
      if (!nova || nova.length < 8) throw new Error('A senha precisa ter pelo menos 8 caracteres.');
      const { error } = await RH.supabase().auth.updateUser({ password: nova });
      if (error) throw new Error('Não foi possível trocar a senha: ' + error.message);
    },

    async email() {
      const { data: { session } } = await RH.supabase().auth.getSession();
      return session ? session.user.email : '';
    }
  };
})();
