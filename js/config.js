// ═══════════════════════════════════════════════════
// RH com Propósito — configuração central
// Chaves públicas por design: o que protege os dados é o RLS do
// banco (supabase/001_seguranca.sql), não o segredo destas chaves.
// Banco, login e API rodam na VPS (componentes do Supabase em /opt/rh-db).
// Os formulários ficam em js/formularios.js e js/formularios-rs.js.
// ═══════════════════════════════════════════════════
window.RH_CONFIG = {
  supabaseUrl: 'https://rh-api.179-236-73-24.sslip.io',
  supabaseKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzkzMjcyNTgzLCJleHAiOjIxMDg2MzI1ODN9.ovVc5PNV6hKpPtfd-TfPSfbAmTOAwE2SAz3E6i9me1U',
  web3formsKey: '1993f0e1-d865-477b-97bd-7a854f842224',
  consultora: 'Cristiele',

  // Portfólios comerciais exibidos em "Portfólios" (páginas públicas em /portfolios).
  // capa: imagem 1200×630, usada no cartão e na prévia do WhatsApp.
  // formulario: formulário de interesse enviado junto com o portfólio (opcional).
  portfolios: [
    { titulo: 'Encerrar Ciclos, Celebrar Pessoas', descricao: 'Experiências de final de ano 2026: seis caminhos, formatos, local, investimento e como contratar.', url: '/portfolios/encerramento-2026.html', capa: '/img/portfolios/encerramento-2026.jpg', campanha: 'Final de ano 2026', formulario: 'encerramento_2026' }
  ],

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
