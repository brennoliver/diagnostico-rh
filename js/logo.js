// ═══════════════════════════════════════════════════
// RH com Propósito — logomarca (folha original + "RH COM PROPÓSITO")
// A folha é o traço original da marca; "RH" e "COM PROPÓSITO" usam as
// fontes do site (Playfair Display e Lato), que todos os aparelhos têm.
//
// Uso no HTML: <span class="logo" data-logo="completa|compacta|simbolo"
//              data-tema="claro|escuro"></span>
// ═══════════════════════════════════════════════════
(function () {
  const FOLHA = 'M403.28,261.57c-.83.35-1.09.02-.54-.67,1.02-4.13,2.26-8.24,3.71-12.35,1.49-4.52,3.22-8.83,5.2-12.93l-.65-.82c.24-1.23,1.85-5.36,3.2-5.22,1.83-4.96,4.4-10.39,7.09-15.12.05-.1.24-.12.46-.12-.19-.15-.36-.3-.42-.49-.18-.55,3.92-7.53,4.61-8.5l1.13-.11c.27-1.56,1.75-3.76,2.97-4.7,1.01-3.45,2.81-6.64,5.42-9.57,2.3-3.73,5.11-6.83,8.43-9.31l.57-1.66c5.75-7.98,12.8-15.04,19.86-21.9,1.48-.74,2.91-1.62,4.27-2.64l-.18-1.03c6.17-4.51,11.89-9.55,17.19-15.13l7.72-10.09,1.12-.53c2.33-2.92,4.78-5.46,7.33-7.64l-.37-.95,23.24-24.44,1.02.04c.38-1.42-.45-1.1-1.51-.67.16.33.35.86.14,1-8.62,5.88-18.3,12.08-27.25,17.47l-.96-.48-1.34,1.34c-7.79,6.07-15.63,12.14-23.51,18.21l-1.8.76c-1.9,2.18-4.09,4.35-6.58,6.49.54.78,0,1.35-.79.85-1,1.48-2.17,2.91-3.51,4.29l-1.11-.2c-1.5,2.32-3.83,4.58-5.98,6.15-.4,1.05-.84,2.11-1.57,2.98-3.46,4.12-6.92,8.26-10.38,12.38-.73.87-1.7,1.49-2.67,2.07-.97,2.09-2.91,5.17-4.72,6.54l-.25,1.4c-3.76,5.69-7.39,11.48-10.89,17.37l-2.01,1.84c-.36,1.84-1.56,4.19-2.86,5.58,1.28.56.44,3.26-.94,3.18-1.85,2.98-3.46,6.13-4.82,9.45l-.42.14c-.16,1.24-.53,2.44-1.1,3.61.5.93-.19,2.16-1.36,1.96-.96,3.06-2.05,6.12-3.27,9.19-1.49,3.97-3.02,7.82-4.61,11.56-.89,4.01-2.53,8.89-4.36,12.67l.72.71c-1.55,5.13-3.8,11.29-5.84,16.27-.85,2.07-1.71,3.83-3.02,5.67-5.94,12.72-20.4,29.32-33.68,34.42-3.48,1.34-7.42.67-10.29-1.5-2.47-1.86-4.21-5.38-3.76-8.86.64-4.89,3.59-8.92,7.68-11.61,6.11-4.02,10.95-9.06,14.23-15.68,7.84-15.78,10.86-44.32,9.25-61.99l-2.72-29.94c-4.06-44.62,14.8-88.21,46.76-118.84,14.62-14.01,31.39-25.61,50.85-31.51,6.81-2.07,13.08-4.44,19.71-6.99,7.23-2.78,14.39-4.88,22.04-6.48,14.1-2.95,27.95-4.98,42.38-6l35.26-2.49c13.92-.98,27.51-1.73,41.2-4.2,6.4-1.16,9-5.09,11.66-3.44.76.47,1.82,1.64,2.02,2.93,1.02,6.42.97,12.63.95,19.24-.06,15.85-1.36,31.14-3.1,46.93-4.46,40.65-15.24,77.61-38.7,111.31-6.59,9.47-13.61,18.07-22.12,25.8-14.44,13.11-31.29,22.39-49.91,28.31-16.44,5.23-33.04,8.41-50.19,10.09l-28.18,2.77c-10.3,1.01-20,3.68-29.83,6.9-5.48,1.79-10.5,4.22-15.32,6.9Z';
  const CORES = {
    claro:  { folha: '#1A5C45', texto: '#13241B' },
    escuro: { folha: '#E6C982', texto: '#F8F1EB' }
  };
  const VIEW = { completa: '0 0 900.76 921.01', compacta: '0 0 900.76 730', simbolo: '330 -8 320 330' };

  function svg(variante = 'completa', tema = 'claro') {
    const c = CORES[tema] || CORES.claro;
    const rh = variante === 'simbolo' ? '' :
      `<text x="10" y="702" textLength="880" lengthAdjust="spacing" style="font-family:'Playfair Display',Georgia,serif;font-size:600px;font-weight:700" fill="${c.texto}">RH</text>`;
    const cp = variante === 'completa' ?
      `<text x="20" y="840" textLength="860" lengthAdjust="spacingAndGlyphs" style="font-family:Lato,system-ui,sans-serif;font-size:104px;font-weight:700;letter-spacing:4px" fill="${c.texto}">COM PROPÓSITO</text>` : '';
    return `<svg viewBox="${VIEW[variante]}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="RH com Propósito"><path fill="${c.folha}" d="${FOLHA}"/>${rh}${cp}</svg>`;
  }

  window.RH = window.RH || {};
  window.RH.logo = svg;
  window.RH.FOLHA = FOLHA;

  function aplicar(raiz = document) {
    raiz.querySelectorAll('[data-logo]:not([data-pronto])').forEach(el => {
      el.innerHTML = svg(el.dataset.logo, el.dataset.tema);
      el.dataset.pronto = '1';
    });
  }
  window.RH.aplicarLogo = aplicar;
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => aplicar());
  else aplicar();
})();
