// ═══════════════════════════════════════════════════
// RH com Propósito — configuração central
// Chaves públicas por design: o que protege os dados é o RLS do
// Supabase (supabase/001_seguranca.sql), não o segredo destas chaves.
// ═══════════════════════════════════════════════════
window.RH_CONFIG = {
  supabaseUrl: 'https://jngyyterkatblntpsjbm.supabase.co',
  supabaseKey: 'sb_publishable_30rUV3wLjGCDd4DggNYePQ_CwkdB1br',
  web3formsKey: '1993f0e1-d865-477b-97bd-7a854f842224',

  // Todas as seções gravadas na tabela "responses".
  // painel: false → não aparece na grade principal do admin.
  secoes: [
    { id: 'pre_diagnostico',        icone: '📋', grupo: 'Antes das entrevistas',         titulo: 'Pré-Diagnóstico Organizacional' },
    { id: 'direcao',                icone: '🏛️', grupo: 'Construindo Juntos — Seção 1', titulo: 'Diagnóstico — Direção' },
    { id: 'gestores',               icone: '👥', grupo: 'Construindo Juntos — Seção 2', titulo: 'Diagnóstico — Gestores' },
    { id: 'colaboradores',          icone: '💬', grupo: 'Construindo Juntos — Seção 3', titulo: 'Diagnóstico — Colaboradores' },
    { id: 'identidade',             icone: '🏢', grupo: 'Construindo Juntos — Seção 4', titulo: 'Identidade Organizacional' },
    { id: 'cartilha',               icone: '📘', grupo: 'Construindo Juntos — Seção 5', titulo: 'Cartilha de Cultura' },
    { id: 'questionario',           icone: '📝', grupo: 'Palestra / Evento',             titulo: 'Questionário de Diagnóstico' },
    { id: 'pdi',                    icone: '🎯', grupo: 'Desenvolvimento',               titulo: 'PDI — Plano de Desenvolvimento' },
    { id: 'rs_m1',                  icone: '🔍', grupo: 'R&S — Módulo 1',                titulo: 'Briefing Inicial da Vaga' },
    { id: 'rs_m2',                  icone: '🔍', grupo: 'R&S — Módulo 2',                titulo: 'Reunião com o Gestor' },
    { id: 'rs_m3',                  icone: '🔍', grupo: 'R&S — Módulo 3',                titulo: 'Perfil do Cargo / Persona' },
    { id: 'rs_m4',                  icone: '🔍', grupo: 'R&S — Módulo 4',                titulo: 'Proposta Comercial' },
    { id: 'rs_m5',                  icone: '🔍', grupo: 'R&S — Módulo 5',                titulo: 'Planejamento da Divulgação' },
    { id: 'rs_m6',                  icone: '🔍', grupo: 'R&S — Módulo 6',                titulo: 'Triagem de Currículos' },
    { id: 'rs_m7',                  icone: '🔍', grupo: 'R&S — Módulo 7',                titulo: 'Pré-Entrevista' },
    { id: 'rs_m8',                  icone: '🔍', grupo: 'R&S — Módulo 8',                titulo: 'Entrevista por Competências' },
    { id: 'rs_m10',                 icone: '🔍', grupo: 'R&S — Módulo 10',               titulo: 'Relatório do Candidato' },
    { id: 'rs_m11',                 icone: '🔍', grupo: 'R&S — Módulo 11',               titulo: 'Apresentação dos Finalistas' },
    { id: 'rs_m12',                 icone: '🔍', grupo: 'R&S — Módulo 12',               titulo: 'Contratação e Formalização' },
    { id: 'rs_m13',                 icone: '🔍', grupo: 'R&S — Módulo 13',               titulo: 'Integração e Onboarding' },
    { id: 'confirmacao_evento',     icone: '🎉', grupo: 'Evento',                        titulo: 'Confirmações de Presença' },
    { id: 'pre_palestra_executivo', icone: '🎤', grupo: 'Pré-Palestra',                  titulo: 'Pré-Palestra Executivo' },
    { id: 'pesquisa_experiencia',   icone: '📋', grupo: 'Avaliação Pós-Encontro',        titulo: 'Pesquisa de Experiência' },
    { id: 'rhcp_direcao',           icone: '🏛️', grupo: 'Questionário RHCP',            titulo: 'RHCP — Direção',       painel: false },
    { id: 'rhcp_gestores',          icone: '👥', grupo: 'Questionário RHCP',            titulo: 'RHCP — Gestores',      painel: false },
    { id: 'rhcp_colaboradores',     icone: '💬', grupo: 'Questionário RHCP',            titulo: 'RHCP — Colaboradores', painel: false }
  ]
};
