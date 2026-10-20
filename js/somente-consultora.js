// Página só para a consultora logada (apresentações).
// Esconde o conteúdo até confirmar o login; sem login, vai para a entrada.
// Uso: <script src="../js/somente-consultora.js"></script> no <head>.
(function () {
  document.documentElement.style.visibility = 'hidden';
  const base = document.currentScript.src.replace(/js\/somente-consultora\.js.*$/, '');
  const carregar = src => new Promise((ok, erro) => {
    const s = document.createElement('script');
    s.src = src; s.onload = ok; s.onerror = erro;
    document.head.appendChild(s);
  });
  carregar('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.min.js')
    .then(() => carregar(base + 'js/config.js'))
    .then(() => carregar(base + 'js/api.js'))
    .then(() => carregar(base + 'js/auth.js'))
    .then(() => window.RH.auth.exigirLogin())
    .then(() => { document.documentElement.style.visibility = ''; })
    .catch(() => { location.replace('/?volta=' + encodeURIComponent(location.pathname)); });
})();
