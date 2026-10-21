// ═══════════════════════════════════════════════════
// RH com Propósito — configuração central
// Chaves públicas por design: o que protege os dados é o RLS do
// Supabase (supabase/001_seguranca.sql), não o segredo destas chaves.
// Os formulários ficam em js/formularios.js e js/formularios-rs.js.
// ═══════════════════════════════════════════════════
window.RH_CONFIG = {
  supabaseUrl: 'https://jngyyterkatblntpsjbm.supabase.co',
  supabaseKey: 'sb_publishable_30rUV3wLjGCDd4DggNYePQ_CwkdB1br',
  web3formsKey: '1993f0e1-d865-477b-97bd-7a854f842224',
  consultora: 'Cristiele',

  // Materiais de apoio exibidos em "Materiais"
  materiais: [
    { titulo: 'Apostila — Liderança com Propósito', descricao: 'Material do workshop de liderança: conteúdo, atividades práticas e dinâmicas.', url: '/materiais/apostila.html', publico: true, icone: 'livro' },
    { titulo: 'Líderes que Inspiram — material de leitura', descricao: 'Os 4 módulos do treinamento de liderança, com reflexões e atividade final.', url: '/materiais/lideres.html', publico: true, icone: 'caderno' },
    { titulo: 'Líderes que Inspiram', descricao: 'Apresentação do treinamento de liderança — 22 slides.', url: '/apresentacoes/lideres-slides.html', icone: 'apresentacao' },
    { titulo: 'Construindo Pertencimento', descricao: 'Programa de engajamento — 14 slides com os 4 módulos.', url: '/apresentacoes/pertencimento-slides.html', icone: 'apresentacao' },
    { titulo: 'Treinamentos e Workshops', descricao: 'Etapa 5 — os 5 workshops comportamentais.', url: '/apresentacoes/treinamentos-slides.html', icone: 'apresentacao' },
    { titulo: 'Acompanhamento Estratégico', descricao: 'Etapa 6 — presença contínua durante 6 meses.', url: '/apresentacoes/acompanhamento-slides.html', icone: 'apresentacao' }
  ]
};
