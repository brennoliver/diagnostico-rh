// ═══════════════════════════════════════════════════
// RH com Propósito — catálogo de formulários
//
// Cada formulário é renderizado por f/index.html e lido pelo painel.
// As chaves (id dos campos) são as mesmas gravadas pelas páginas antigas,
// para que as respostas já salvas continuem aparecendo.
//
// Campo:   { id, tipo, rotulo, ajuda?, placeholder?, opcoes?, obrigatorio?,
//            largura?: 2|3, linhas?, outro?, max?, sub?, coluna?, interno? }
// tipos:   texto email telefone numero data textarea select radio checkbox
//          escala nps grade lista consentimento
// coluna:  grava direto numa coluna de "responses" (company, nome,
//          cargo_setor, data_resposta, r1…r6) em vez do JSON em r1.
// mapa:    copia campos do JSON para as colunas (primeiro valor preenchido).
// sub:     campo complementar exibido junto da pergunta anterior.
// ═══════════════════════════════════════════════════
window.RH_CATEGORIAS = [
  { id: 'programa',      icone: 'broto',      titulo: 'Programa Construindo Juntos', descricao: 'Diagnóstico organizacional, identidade e cultura.' },
  { id: 'eventos',       icone: 'agenda',     titulo: 'Palestras e eventos',         descricao: 'Antes, durante e depois dos encontros.' },
  { id: 'satisfacao',    icone: 'estrela',    titulo: 'Satisfação',                  descricao: 'Pesquisas pós-serviço.' },
  { id: 'desenvolvimento', icone: 'alvo',     titulo: 'Desenvolvimento',           descricao: 'Planos individuais.' },
  { id: 'recrutamento',  icone: 'maleta',     titulo: 'Recrutamento & Seleção',      descricao: 'Do briefing da vaga à integração.' },
  { id: 'campanhas',     icone: 'brilho',     titulo: 'Campanhas e propostas',       descricao: 'Formulários de interesse para montar propostas personalizadas.' }
];

(function () {
  const ESCREVA = 'Escreva sua resposta aqui...';
  const id_empresa = (extra = {}) => ({ id: 'company', coluna: 'company', tipo: 'texto', rotulo: 'Empresa', placeholder: 'Nome da empresa', obrigatorio: true, largura: 2, ...extra });

  const aberta = (id, rotulo, ajuda, extra = {}) => ({ id, tipo: 'textarea', rotulo, ajuda, placeholder: ESCREVA, ...extra });

  // RHCP: cada questão tem uma parte objetiva e uma subjetiva
  const rhcp = (n, pergunta, objetiva, subjetiva, placeholder, extra) => [
    { id: `q${n}_obj`, rotulo: pergunta, ajuda: objetiva, ...extra },
    { id: `q${n}_subj`, tipo: 'textarea', rotulo: subjetiva, placeholder, sub: true }
  ];
  const escala5 = (esq, dir) => ({ tipo: 'escala', min: 1, max: 5, rotulosEscala: [esq, dir] });

  // ── Molde de formulário de interesse (campanhas, encerramentos, treinamentos) ──
  // Já traz os dados da empresa, o aviso de privacidade com autorização de
  // contato e a mensagem final. Para uma campanha nova, copie o bloco
  // "encerramento_2026" lá embaixo e troque id, títulos, textos e "perguntas".
  const PRIVACIDADE = 'Usamos estas informações apenas para preparar e apresentar a proposta à sua empresa. Os dados ficam guardados com segurança na base do RH com Propósito e não são compartilhados com terceiros. Você pode pedir a exclusão a qualquer momento.';
  const interesse = ({ perguntas, ...cfg }) => ({
    categoria: 'campanhas', icone: 'brilho', tempo: '3 minutos', passoAPasso: true, numerar: true,
    publico: 'Empresas interessadas',
    agradecimento: 'Obrigada pelo interesse em viver essa experiência com o RH com Propósito!\n\nCom as informações recebidas, nossa equipe poderá elaborar uma proposta personalizada, considerando as necessidades e a realidade da sua empresa.\n\nPorque todo resultado começa com pessoas.',
    mapa: { company: ['empresa'], nome: ['responsavel'], cargo_setor: ['cargo'] },
    ...cfg,
    secoes: [
      { titulo: 'Dados da empresa', campos: [
        { id: 'empresa', tipo: 'texto', rotulo: 'Nome da empresa', placeholder: 'Nome da empresa', obrigatorio: true, preencherComEmpresa: true },
        { id: 'responsavel', tipo: 'texto', rotulo: 'Nome do responsável', placeholder: 'Seu nome', obrigatorio: true, largura: 2 },
        { id: 'cargo', tipo: 'texto', rotulo: 'Cargo ou função', placeholder: 'Ex.: Diretora, Gerente de RH', largura: 2 },
        { id: 'whatsapp', tipo: 'telefone', rotulo: 'WhatsApp para contato', placeholder: '(00) 00000-0000', obrigatorio: true, largura: 2 },
        { id: 'cidade', tipo: 'texto', rotulo: 'Cidade/UF', placeholder: 'Ex.: Estância/SE', largura: 2 },
        { id: 'colaboradores', tipo: 'radio', rotulo: 'Quantos colaboradores participarão?', opcoes: ['Até 20', 'De 21 a 50', 'De 51 a 100', 'De 101 a 200', 'Acima de 200'], obrigatorio: true }
      ]},
      ...perguntas,
      { titulo: 'Privacidade e contato', descricao: PRIVACIDADE, campos: [
        { id: 'autorizado', tipo: 'consentimento', rotulo: 'Autorizo o RH com Propósito a entrar em contato pelo WhatsApp informado para apresentar a proposta.', obrigatorio: true }
      ]}
    ]
  });

  window.RH_FORMULARIOS = (window.RH_FORMULARIOS || []).concat([

  // ─────────────────────────── CAMPANHAS ───────────────────────────
  interesse({
    id: 'encerramento_2026',
    titulo: 'Encerramento de Ano 2026',
    tituloPublico: 'Encerramento de Ano 2026 | RH com Propósito',
    descricao: 'Interesse das empresas nas ações de encerramento de ano — base para propostas personalizadas.',
    intro: 'O ano está chegando ao fim, e esse é o momento de celebrar conquistas, reconhecer pessoas e fortalecer os laços entre as equipes!\n\nO RH com Propósito prepara experiências personalizadas, respeitando o perfil de cada empresa, a quantidade de colaboradores e o tempo disponível.\n\nResponda às perguntas abaixo para construirmos juntos um encerramento de ano especial!',
    imagem: 'img/og-encerramento.png',
    perguntas: [
      { titulo: 'Sobre a experiência', campos: [
        { id: 'objetivo', tipo: 'checkbox', rotulo: 'Qual é o principal objetivo da ação?', ajuda: 'Pode marcar mais de uma opção.', obrigatorio: true, outro: true,
          opcoes: ['Celebrar as conquistas de 2026', 'Reconhecer e valorizar os colaboradores', 'Fortalecer a união da equipe', 'Motivar para 2027', 'Proporcionar um momento de descontração', 'Outros'] },
        { id: 'experiencia', tipo: 'radio', rotulo: 'Qual tipo de experiência desperta mais interesse?', obrigatorio: true,
          opcoes: ['Palestra interativa', 'Dinâmicas de integração', 'Reconhecimento e homenagens', 'Confraternização com Propósito', 'Gostaria de receber sugestões do RHCP'] },
        { id: 'tempo', tipo: 'radio', rotulo: 'Quanto tempo a empresa tem disponível?', opcoes: ['30 minutos', '1 hora', '1h30', '2 horas ou mais', 'Ainda não definido'] },
        { id: 'turmas', tipo: 'radio', rotulo: 'A empresa tem interesse em realizar a ação dividindo os colaboradores em turmas?', opcoes: ['Sim', 'Não', 'Gostaria de avaliar essa possibilidade'] },
        { id: 'qtd_turmas', tipo: 'texto', rotulo: 'Caso a ação seja dividida em turmas, quantas turmas seriam necessárias?', ajuda: 'Opcional.', placeholder: 'Ex.: 3 turmas',
          mostrarSe: { turmas: ['Sim', 'Gostaria de avaliar essa possibilidade'] } }
      ]},
      { titulo: 'Organização do evento', campos: [
        { id: 'data_prevista', tipo: 'data', rotulo: 'Qual a data prevista para a realização?', largura: 2 },
        { id: 'turno', tipo: 'radio', rotulo: 'Qual o turno de preferência?', opcoes: ['Manhã', 'Tarde', 'Noite', 'Mais de um turno', 'A definir'] },
        { id: 'local', tipo: 'radio', rotulo: 'Onde a empresa deseja realizar a ação?', opcoes: ['Em espaço próprio da empresa', 'Em espaço disponibilizado pelo RH com Propósito', 'Ainda não definido'] },
        { id: 'confraternizacao', tipo: 'radio', rotulo: 'A empresa já possui uma confraternização programada?', opcoes: ['Sim, queremos incluir uma ação do RHCP', 'Não, queremos organizar um encerramento especial', 'Ainda estamos planejando'] },
        { id: 'observacoes', tipo: 'textarea', rotulo: 'Existe alguma necessidade ou informação importante que gostaria de compartilhar?', ajuda: 'Opcional.', placeholder: 'Conte o que for importante para a proposta...' }
      ]}
    ]
  }),

  // ─────────────────────────── PROGRAMA ───────────────────────────
  {
    id: 'pre_diagnostico', categoria: 'programa', icone: 'prancheta',
    titulo: 'Pré-Diagnóstico Organizacional',
    descricao: 'Enviado ao cliente antes das entrevistas — equipe, liderança, cultura e objetivos.',
    publico: 'Responsável pela empresa', tempo: '10 minutos', passoAPasso: true,
    intro: 'Antes da nossa primeira conversa, gostaria de conhecer um pouco mais sobre sua empresa. Este questionário foi elaborado para que nosso encontro seja mais produtivo, direcionado às reais necessidades do seu negócio.\n\nDesde já, obrigada pela confiança.',
    agradecimento: 'Suas respostas foram enviadas com sucesso. Obrigada pela confiança. Até nossa próxima conversa.',
    mapa: { company: ['empresa'], nome: ['responsavel'], cargo_setor: ['cargo'] },
    secoes: [
      { titulo: 'Informações da empresa', campos: [
        { id: 'empresa', tipo: 'texto', rotulo: 'Nome da empresa', placeholder: 'Nome da empresa', obrigatorio: true, largura: 2, preencherComEmpresa: true },
        { id: 'segmento', tipo: 'texto', rotulo: 'Segmento', placeholder: 'Ex: Varejo, Saúde, Educação...', largura: 2 },
        { id: 'responsavel', tipo: 'texto', rotulo: 'Nome do responsável', placeholder: 'Seu nome completo', largura: 2 },
        { id: 'cargo', tipo: 'texto', rotulo: 'Cargo', placeholder: 'Seu cargo ou função', largura: 2 },
        { id: 'cidade', tipo: 'texto', rotulo: 'Cidade', placeholder: 'Cidade', largura: 2 },
        { id: 'anos_empresa', tipo: 'select', rotulo: 'Há quantos anos a empresa existe?', opcoes: ['Menos de 1 ano', '1 a 3 anos', '4 a 10 anos', 'Mais de 10 anos'], largura: 2 },
        { id: 'num_colaboradores', tipo: 'radio', rotulo: 'Quantos colaboradores possui atualmente?', opcoes: ['1 a 10', '11 a 30', '31 a 50', '51 a 100', 'Mais de 100'] }
      ]},
      { titulo: 'Sobre a equipe', descricao: 'Como está sua equipe hoje?', campos: [
        { id: 'desc_equipe', tipo: 'textarea', rotulo: 'Como você descreveria sua equipe hoje?', placeholder: 'Descreva em suas palavras...' },
        { id: 'maiores_desafios', tipo: 'textarea', rotulo: 'Quais são os três maiores desafios relacionados às pessoas dentro da empresa?', placeholder: 'Liste os três principais...' },
        { id: 'maior_preocupacao', tipo: 'textarea', rotulo: 'O que mais preocupa você atualmente?', placeholder: 'Compartilhe o que mais te preocupa...' },
        { id: 'dific_contratar', tipo: 'radio', rotulo: 'Existe dificuldade para contratar pessoas?', opcoes: ['Sim', 'Não', 'Às vezes'] },
        { id: 'dific_manter', tipo: 'radio', rotulo: 'Existe dificuldade para manter bons colaboradores?', opcoes: ['Sim', 'Não'] }
      ]},
      { titulo: 'Liderança', descricao: 'Como funciona a liderança?', campos: [
        { id: 'tem_lideres', tipo: 'radio', rotulo: 'Sua empresa possui líderes ou gestores?', opcoes: ['Sim', 'Não'] },
        { id: 'avaliacao_lideres', tipo: 'radio', rotulo: 'Como você avalia a preparação desses líderes?', opcoes: ['Excelente', 'Boa', 'Regular', 'Precisa melhorar'] },
        { id: 'desafio_lideranca', tipo: 'textarea', rotulo: 'Qual é o maior desafio da liderança hoje?', placeholder: 'Descreva o principal desafio...' }
      ]},
      { titulo: 'Comunicação', descricao: 'Como fluem as informações?', campos: [
        { id: 'avaliacao_comunicacao', tipo: 'radio', rotulo: 'Como você avalia a comunicação entre gestores e colaboradores?', opcoes: ['Excelente', 'Boa', 'Regular', 'Ruim'] },
        { id: 'feedback_frequencia', tipo: 'radio', rotulo: 'Os colaboradores recebem feedback com frequência?', opcoes: ['Sempre', 'Às vezes', 'Raramente', 'Nunca'] }
      ]},
      { titulo: 'Cultura da empresa', descricao: 'Qual é a identidade da empresa?', campos: [
        { id: 'tem_mvv', tipo: 'radio', rotulo: 'A empresa possui Missão, Visão e Valores definidos?', opcoes: ['Sim', 'Parcialmente', 'Não'] },
        { id: 'colab_conhecem_mvv', tipo: 'radio', rotulo: 'Os colaboradores conhecem esses valores?', opcoes: ['Sim', 'Parcialmente', 'Não'] },
        { id: 'frase_cultura', tipo: 'textarea', rotulo: 'Como você definiria a cultura da sua empresa em uma frase?', placeholder: 'Em uma frase...', linhas: 2 }
      ]},
      { titulo: 'Clima organizacional', descricao: 'Como está o ambiente de trabalho?', campos: [
        { id: 'clima', tipo: 'radio', rotulo: 'Como você acredita que os colaboradores chegam para trabalhar?', opcoes: ['Motivados', 'Comprometidos', 'Indiferentes', 'Desmotivados'] },
        { id: 'conflitos', tipo: 'radio', rotulo: 'O ambiente de trabalho possui conflitos frequentes?', opcoes: ['Sim', 'Às vezes', 'Não'] }
      ]},
      { titulo: 'Desenvolvimento', descricao: 'Como a empresa investe em pessoas?', campos: [
        { id: 'realiza_treinamentos', tipo: 'radio', rotulo: 'Sua empresa realiza treinamentos?', opcoes: ['Frequentemente', 'Algumas vezes ao ano', 'Raramente', 'Nunca'] },
        { id: 'temas_importantes', tipo: 'checkbox', rotulo: 'Quais temas você considera mais importantes hoje?', ajuda: 'Pode marcar mais de um.', opcoes: ['Liderança', 'Comunicação', 'Atendimento', 'Trabalho em equipe', 'Inteligência emocional', 'Cultura organizacional', 'Feedback', 'Outro'], outro: true }
      ]},
      { titulo: 'Objetivos', descricao: 'O que você espera alcançar?', campos: [
        { id: 'motivacao', tipo: 'textarea', rotulo: 'O que motivou você a procurar o RH com Propósito?', placeholder: 'Conte o que te trouxe até aqui...' },
        { id: 'expectativa', tipo: 'textarea', rotulo: 'O que você espera alcançar nos próximos seis meses?', placeholder: 'Descreva seus objetivos...' },
        { id: 'prioridade', tipo: 'textarea', rotulo: 'Se pudesse resolver apenas um problema relacionado à gestão de pessoas, qual seria?', placeholder: 'Qual seria a prioridade número 1?' },
        { id: 'sucesso', tipo: 'textarea', rotulo: 'Se ao final do nosso trabalho você pudesse dizer que valeu cada investimento, o que precisaria ter acontecido?', placeholder: 'O que significaria sucesso para você...' }
      ]},
      { titulo: 'Encerramento', descricao: 'Quase lá!', campos: [
        { id: 'adicional', tipo: 'textarea', rotulo: 'Existe alguma informação importante que você gostaria de compartilhar antes da nossa conversa?', placeholder: 'Qualquer informação que considere relevante...' },
        { id: 'como_conheceu', tipo: 'radio', rotulo: 'Como conheceu o RH com Propósito?', opcoes: ['Instagram', 'Indicação', 'Evento ou Palestra', 'Google', 'Outro'], outro: true },
        { id: 'autorizado', tipo: 'consentimento', rotulo: 'Autorizo que essas informações sejam utilizadas exclusivamente para elaboração do diagnóstico inicial da empresa.', obrigatorio: true }
      ]}
    ]
  },

  {
    id: 'direcao', categoria: 'programa', icone: 'instituicao', etapa: 'Seção 1',
    titulo: 'Reunião com a Direção',
    descricao: 'Visão estratégica e expectativas para a empresa.',
    publico: 'Diretores e sócios', tempo: '10 minutos',
    intro: 'Suas respostas são confidenciais e servirão exclusivamente para personalizar o trabalho de desenvolvimento da equipe.',
    numerar: true,
    secoes: [
      { titulo: 'Identificação', identificacao: true, campos: [
        id_empresa(),
        { id: 'nome', coluna: 'nome', tipo: 'texto', rotulo: 'Nome', placeholder: 'Seu nome completo', largura: 2 },
        { id: 'cargo_setor', coluna: 'cargo_setor', tipo: 'texto', rotulo: 'Cargo', placeholder: 'Seu cargo', largura: 2 },
        { id: 'data_resposta', coluna: 'data_resposta', tipo: 'data', rotulo: 'Data', hoje: true, largura: 2 }
      ]},
      { titulo: 'Visão estratégica e expectativas', campos: [
        aberta('r1', 'Conte brevemente a história da empresa.', 'Como surgiu, principais marcos e onde está hoje.', { coluna: 'r1' }),
        aberta('r2', 'Quais são os principais objetivos da empresa para os próximos anos?', 'Metas, crescimento, novos mercados, produtos ou serviços.', { coluna: 'r2' }),
        aberta('r3', 'Quais são os maiores desafios enfrentados atualmente?', 'Internos, externos, de mercado ou de equipe.', { coluna: 'r3' }),
        aberta('r4', 'Quais comportamentos você espera dos colaboradores?', 'Atitudes, valores e postura que considera essenciais.', { coluna: 'r4' }),
        aberta('r5', 'O que você acredita que precisa melhorar na equipe?', 'Habilidades, comportamentos, processos ou comunicação.', { coluna: 'r5' }),
        aberta('r6', 'Como você gostaria que a empresa fosse reconhecida pelos clientes?', 'Imagem, reputação e diferenciais que deseja construir.', { coluna: 'r6' })
      ]}
    ]
  },

  {
    id: 'gestores', categoria: 'programa', icone: 'pessoas', etapa: 'Seção 2',
    titulo: 'Entrevista com Gestores',
    descricao: 'Desafios de liderança e gestão de equipes.',
    publico: 'Gestores e líderes', tempo: '10 minutos',
    intro: 'Suas respostas são confidenciais e servirão para identificar como fortalecer sua liderança e o desempenho da equipe.',
    numerar: true,
    secoes: [
      { titulo: 'Identificação', identificacao: true, campos: [
        id_empresa(),
        { id: 'nome', coluna: 'nome', tipo: 'texto', rotulo: 'Nome', placeholder: 'Seu nome completo', largura: 2 },
        { id: 'cargo_setor', coluna: 'cargo_setor', tipo: 'texto', rotulo: 'Setor / equipe', placeholder: 'Área que você lidera', largura: 2 },
        { id: 'data_resposta', coluna: 'data_resposta', tipo: 'data', rotulo: 'Data', hoje: true, largura: 2 }
      ]},
      { titulo: 'Liderança e equipe', campos: [
        aberta('r1', 'Qual o principal desafio da sua equipe atualmente?', 'O que mais dificulta o trabalho e os resultados do seu time.', { coluna: 'r1' }),
        aberta('r2', 'Quais conflitos são mais frequentes?', 'Entre pessoas, setores ou sobre processos e prioridades.', { coluna: 'r2' }),
        aberta('r3', 'Como ocorre a comunicação entre os setores?', 'O que funciona bem e o que gera ruídos ou falhas.', { coluna: 'r3' }),
        aberta('r4', 'O que mais impacta os resultados da equipe?', 'Fatores positivos e negativos que influenciam o desempenho.', { coluna: 'r4' }),
        aberta('r5', 'Que apoio você precisa da empresa para liderar melhor?', 'Recursos, treinamentos, processos ou suporte da direção.', { coluna: 'r5' })
      ]}
    ]
  },

  {
    id: 'colaboradores', categoria: 'programa', icone: 'conversa', etapa: 'Seção 3',
    titulo: 'Conversa com Colaboradores',
    descricao: 'Percepção da equipe sobre a empresa e o trabalho.',
    publico: 'Colaboradores', tempo: '8 minutos',
    intro: 'Suas respostas são confidenciais. Não há respostas certas ou erradas — o importante é a sua visão honesta.',
    numerar: true,
    secoes: [
      { titulo: 'Identificação', identificacao: true, campos: [
        id_empresa(),
        { id: 'nome', coluna: 'nome', tipo: 'texto', rotulo: 'Nome (opcional)', placeholder: 'Seu nome (opcional)', largura: 2, padraoVazio: 'Anônimo' },
        { id: 'cargo_setor', coluna: 'cargo_setor', tipo: 'texto', rotulo: 'Setor', placeholder: 'Seu setor ou área', largura: 2 },
        { id: 'data_resposta', coluna: 'data_resposta', tipo: 'data', rotulo: 'Data', hoje: true, largura: 2 }
      ]},
      { titulo: 'Sua percepção', campos: [
        aberta('r1', 'O que você mais gosta de trabalhar nesta empresa?', 'O que te motiva, satisfaz ou faz sentir orgulho.', { coluna: 'r1' }),
        aberta('r2', 'O que poderia melhorar?', 'Processos, comunicação, ambiente ou qualquer aspecto do trabalho.', { coluna: 'r2' }),
        aberta('r3', 'Você se sente ouvido pela liderança?', 'Conte como é a relação com seus líderes no dia a dia.', { coluna: 'r3' }),
        aberta('r4', 'Como você avalia a comunicação interna?', 'As informações chegam a você? Com clareza e no tempo certo?', { coluna: 'r4' }),
        aberta('r5', 'O que faz uma pessoa ter sucesso nesta empresa?', 'Comportamentos, atitudes ou habilidades que você percebe serem valorizados.', { coluna: 'r5' })
      ]}
    ]
  },

  {
    id: 'identidade', categoria: 'programa', icone: 'clientes', etapa: 'Seção 4',
    titulo: 'Identidade Organizacional',
    descricao: 'História, cultura, missão, visão, valores e compromisso da empresa.',
    publico: 'Direção', tempo: '20 minutos',
    intro: 'Registre a essência da empresa — sua história, propósito, valores e o que espera do seu time. Não há resposta errada; o que importa é a verdade de quem vocês são.',
    secoes: [
      { titulo: 'Identificação', identificacao: true, campos: [
        id_empresa(),
        { id: 'nome', coluna: 'nome', tipo: 'texto', rotulo: 'Responsável', placeholder: 'Nome do responsável', largura: 2, padraoVazio: 'Equipe' },
        { id: 'cargo_setor', coluna: 'cargo_setor', tipo: 'texto', rotulo: 'Cargo / setor', placeholder: 'Cargo ou setor', largura: 2 },
        { id: 'data_resposta', coluna: 'data_resposta', tipo: 'data', rotulo: 'Data', hoje: true, largura: 2 }
      ]},
      { titulo: 'Quem somos', campos: [
        { id: 'r1', tipo: 'textarea', rotulo: 'Nossa História', ajuda: 'Como surgiu a empresa? Qual é a trajetória até hoje? Fale sobre a origem, os fundadores, os marcos importantes e a evolução ao longo do tempo.', placeholder: 'Conte a história da empresa...', linhas: 5 },
        { id: 'r2', tipo: 'textarea', rotulo: 'Cultura Organizacional', ajuda: 'Como as coisas funcionam aqui? Descreva os comportamentos, hábitos e formas de trabalhar que definem o ambiente da empresa.', placeholder: 'Descreva a cultura da empresa...', linhas: 4 },
        { id: 'r3', tipo: 'textarea', rotulo: 'Missão', ajuda: 'Por que a empresa existe? A missão responde "o que fazemos, para quem e por quê".', placeholder: 'Ex.: Oferecer soluções de qualidade que transformam a vida dos nossos clientes...', linhas: 3 },
        { id: 'r4', tipo: 'textarea', rotulo: 'Visão', ajuda: 'Onde a empresa quer chegar? A visão é a imagem do futuro que a empresa quer construir — ambiciosa e inspiradora.', placeholder: 'Ex.: Ser referência em excelência e inovação em nossa região até 2030...', linhas: 3 },
        { id: 'r5', tipo: 'textarea', rotulo: 'Valores', ajuda: 'Os princípios inegociáveis que guiam as decisões. Um valor por linha.', placeholder: 'Ética\nExcelência\nRespeito\nInovação', linhas: 5 },
        { id: 'r6', tipo: 'textarea', rotulo: 'O Que Esperamos do Nosso Time', ajuda: 'Comportamentos e atitudes que a empresa espera de todos no dia a dia.', placeholder: 'Ex.: Agir com integridade, buscar a melhoria contínua, respeitar colegas e clientes...', linhas: 5 },
        { id: 'r7', tipo: 'textarea', rotulo: 'Nosso Compromisso', ajuda: 'O compromisso da empresa com colaboradores, clientes e comunidade.', placeholder: 'Descreva o compromisso da empresa...', linhas: 4 }
      ]}
    ]
  },

  {
    id: 'cartilha', categoria: 'programa', icone: 'caderno', etapa: 'Seção 5',
    titulo: 'Cartilha de Cultura',
    descricao: 'Conteúdo da Cartilha de Cultura Organizacional — gera o documento pronto para imprimir.',
    publico: 'Direção', tempo: '25 minutos', passoAPasso: true, aoEnviar: 'cartilha',
    intro: 'Preencha as informações da empresa. Ao enviar, você poderá baixar a Cartilha de Cultura completa e pronta para impressão.',
    mapa: { company: ['empresa'], nome: ['diretorNome'], cargo_setor: ['diretorCargo'] },
    secoes: [
      { titulo: 'Identificação da empresa', campos: [
        { id: 'empresa', tipo: 'texto', rotulo: 'Nome da empresa', placeholder: 'Nome completo da empresa', obrigatorio: true, largura: 2, preencherComEmpresa: true },
        { id: 'segmento', tipo: 'texto', rotulo: 'Segmento / ramo', placeholder: 'Ex.: Materiais para construção, Varejo...', largura: 2 },
        { id: 'diretorNome', tipo: 'texto', rotulo: 'Nome do diretor(a) / assinante', placeholder: 'Nome de quem assina a mensagem', largura: 2 },
        { id: 'diretorCargo', tipo: 'texto', rotulo: 'Cargo', placeholder: 'Ex.: Diretor, Sócio-fundador...', largura: 2 }
      ]},
      { titulo: 'Mensagem e história', campos: [
        { id: 'msgDirecao', tipo: 'textarea', rotulo: 'Mensagem da Direção', ajuda: 'Carta pessoal endereçada a "Prezados colaboradores", apresentando a empresa e seus princípios.', linhas: 5,
          placeholder: 'Prezados colaboradores, \n\n[Nome da empresa] construiu sua história com muito trabalho, dedicação e respeito às pessoas. Esta cartilha apresenta nossa cultura, nossos princípios e a forma como desejamos construir juntos um ambiente cada vez melhor...' },
        { id: 'historia', tipo: 'textarea', rotulo: 'Nossa História', ajuda: 'Fale sobre a origem, os fundadores, os marcos e a trajetória da empresa.', placeholder: 'A [Nome da empresa] nasceu com o propósito de...', linhas: 4 }
      ]},
      { titulo: 'Missão, visão e valores', campos: [
        { id: 'missao', tipo: 'textarea', rotulo: 'Nossa Missão', ajuda: 'Por que a empresa existe? O que entrega, para quem e como?', placeholder: 'Ex.: Ter compromisso com nossos clientes na venda de [produtos], facilitando suas vidas com respeito e atendimento especializado.', linhas: 3 },
        { id: 'visao', tipo: 'textarea', rotulo: 'Nossa Visão', ajuda: 'Onde a empresa quer chegar? Qual é o futuro desejado?', placeholder: 'Ex.: Ser líder no ramo de [segmento] na região [X], criando laços de fidelidade, confiança e credibilidade.', linhas: 3 },
        { id: 'valores', tipo: 'textarea', rotulo: 'Nossos Valores', ajuda: 'Um valor por linha.', placeholder: 'Respeito\nHonestidade\nCompromisso\nTrabalho em Equipe\nConfiança\nExcelência', linhas: 6 }
      ]},
      { titulo: 'Atendimento e comportamento', campos: [
        { id: 'jeitoTitulo', tipo: 'texto', rotulo: 'Título da seção de atendimento', placeholder: 'Ex.: "O Jeito Conceição de Atender"' },
        { id: 'jeito', tipo: 'textarea', rotulo: 'Comportamentos esperados no atendimento ao cliente', ajuda: 'Um comportamento por linha.', linhas: 5,
          placeholder: 'Cumprimentar o cliente com cordialidade.\nDemonstrar interesse em ajudar.\nOferecer soluções adequadas.\nAgir com respeito e profissionalismo.\nAgradecer pela preferência.' },
        { id: 'esperamos', tipo: 'textarea', rotulo: 'O Que Esperamos dos Colaboradores', ajuda: 'Um item por linha.', placeholder: 'Pontualidade\nOrganização\nResponsabilidade\nComprometimento\nRespeito aos colegas\nPostura ética', linhas: 6 },
        { id: 'naoNegociamos', tipo: 'textarea', rotulo: 'O Que Não Negociamos', ajuda: 'Comportamentos absolutamente inaceitáveis. Um item por linha.', placeholder: 'Falta de respeito\nDesonestidade\nMau atendimento ao cliente\nDescumprimento das normas internas', linhas: 4 }
      ]},
      { titulo: 'Pessoas e propósito', campos: [
        { id: 'cliente', tipo: 'textarea', rotulo: 'O Cliente é Nossa Prioridade', placeholder: 'Nosso objetivo não é apenas vender produtos, mas construir relacionamentos duradouros baseados na confiança.', linhas: 3 },
        { id: 'reconhecimento', tipo: 'textarea', rotulo: 'Reconhecimento e Valorização', placeholder: 'Valorizamos colaboradores que demonstram comprometimento, proatividade, espírito de equipe, boa comunicação, responsabilidade e foco em resultados.', linhas: 3 },
        { id: 'ambiente', tipo: 'textarea', rotulo: 'Compromisso com um Ambiente Saudável', placeholder: 'A empresa não tolera assédio moral, discriminação, humilhações ou desrespeito entre colaboradores.', linhas: 3 },
        { id: 'equipe', tipo: 'textarea', rotulo: 'Nossa Equipe Faz a Diferença', ajuda: 'Mensagem de encerramento valorizando a equipe.', placeholder: 'O sucesso da empresa é resultado do trabalho de cada colaborador. Juntos construímos confiança, relacionamentos e resultados.', linhas: 3 },
        { id: 'termo', tipo: 'textarea', rotulo: 'Termo de Compromisso', ajuda: 'Texto que o colaborador assina ao receber a cartilha.', placeholder: 'Declaro que recebi a Cartilha de Cultura Organizacional da [Nome da empresa] e me comprometo a contribuir para um ambiente de trabalho pautado no respeito, ética, compromisso e excelência.', linhas: 4 }
      ]}
    ]
  },

  {
    id: 'rhcp_direcao', categoria: 'programa', icone: 'instituicao', etapa: 'Diagnóstico 3.5',
    titulo: 'Questionário RHCP — Direção',
    descricao: '10 questões objetivas e subjetivas para diretores e sócios.',
    publico: 'Diretores e sócios', tempo: '15 minutos', numerar: true, imprimivel: true,
    intro: 'Destinado a diretores, sócios e responsáveis estratégicos. Suas respostas são confidenciais e fundamentais para um diagnóstico preciso da organização.',
    secoes: [
      { titulo: 'Identificação', identificacao: true, campos: [
        { id: 'nome', coluna: 'nome', tipo: 'texto', rotulo: 'Nome completo', placeholder: 'Nome do respondente', largura: 2 },
        { id: 'cargo_setor', coluna: 'cargo_setor', tipo: 'texto', rotulo: 'Cargo / função', placeholder: 'Ex: Diretor, Sócio', largura: 2 },
        id_empresa(),
        { id: 'data_resposta', coluna: 'data_resposta', tipo: 'data', rotulo: 'Data', hoje: true, largura: 2 }
      ]},
      { titulo: 'Questionário', campos: [
        ...rhcp(1, 'Há quanto tempo a empresa existe e como surgiu?', 'Tempo de existência', 'Conte brevemente a história da empresa', 'Como surgiu a empresa? Quais foram os momentos mais marcantes da trajetória?',
          { tipo: 'radio', opcoes: ['Menos de 2 anos', '2 a 5 anos', '5 a 10 anos', '10 a 20 anos', 'Mais de 20 anos'] }),
        ...rhcp(2, 'Como você avalia o momento atual da empresa?', 'Avaliação do momento', 'Quais são os principais desafios que a empresa enfrenta hoje?', 'Descreva os desafios mais urgentes...', escala5('Muito crítico', 'Muito positivo')),
        ...rhcp(3, 'Como você avalia a atuação das lideranças da empresa?', 'Nível da liderança atual', 'Quais competências precisam ser desenvolvidas nas lideranças?', 'Feedback, comunicação, delegação...',
          { tipo: 'radio', opcoes: ['Precisa de desenvolvimento significativo', 'Em desenvolvimento — ainda há muitas lacunas', 'Adequada — cumpre o básico', 'Boa — tem pontos de melhoria', 'Excelente — referência na empresa'] }),
        ...rhcp(4, 'Como você avalia a comunicação interna da empresa?', 'Qualidade da comunicação', 'Quais são as principais dificuldades de comunicação na empresa?', 'Entre setores, entre liderança e equipe...', escala5('Muito falha', 'Excelente')),
        ...rhcp(5, 'Os colaboradores conhecem e praticam os valores da empresa?', 'Nível de adesão aos valores', 'Como os valores são transmitidos aos colaboradores?', 'Integração, mural, reuniões, pelo exemplo...',
          { tipo: 'radio', opcoes: ['Não conhecem — não temos MVV definido', 'Conhecem parcialmente — ainda não praticam', 'A maioria conhece e pratica de forma razoável', 'Todos conhecem e a maioria pratica'] }),
        ...rhcp(6, 'Como você avalia o clima organizacional da empresa hoje?', 'Clima geral', 'O que mais impacta o clima da empresa atualmente?', 'Conflitos, comunicação, sobrecarga, reconhecimento...', escala5('Muito ruim', 'Muito bom')),
        ...rhcp(7, 'A empresa possui processos de gestão de pessoas estruturados?', 'Marque os processos que JÁ EXISTEM na empresa', 'Quais processos são mais urgentes de estruturar?', 'Ex: Integração é o mais urgente porque...',
          { tipo: 'checkbox', opcoes: ['Processo de Recrutamento e Seleção', 'Programa de Integração de novos colaboradores', 'Avaliação de Desempenho', 'Processo de Feedback estruturado', 'Treinamentos periódicos', 'Descrição de Cargos', 'Política salarial definida', 'Nenhum dos acima'] }),
        ...rhcp(8, 'Se a empresa fosse uma pessoa, como ela seria? Qual palavra ou frase definiria a cultura atual?', 'Como você descreveria a cultura atual?', 'Em uma frase, qual é a cultura que DESEJA construir?', 'Ex: Uma empresa onde as pessoas chegam felizes e saem realizadas...',
          { tipo: 'radio', opcoes: ['Rígida e hierarquizada', 'Informal e desorganizada', 'Colaborativa mas sem processos', 'Organizada e em crescimento', 'Forte, com identidade clara'] }),
        ...rhcp(9, 'Quais são as prioridades da empresa para os próximos 12 meses?', 'Marque as 3 maiores prioridades', 'Quais objetivos específicos você espera alcançar com a consultoria?', 'Resultados concretos esperados ao final do projeto...',
          { tipo: 'checkbox', max: 3, opcoes: ['Aumentar as vendas / faturamento', 'Reduzir a rotatividade da equipe', 'Melhorar o clima organizacional', 'Estruturar processos de RH', 'Desenvolver lideranças', 'Expandir / abrir novas unidades', 'Melhorar a comunicação interna'] }),
        ...rhcp(10, 'O que motivou a contratação do RH com Propósito? Existe alguma informação adicional importante?', 'Principal motivação', 'Há alguma informação importante que devemos saber antes de iniciar?', 'Contextos, situações sensíveis, histórico...',
          { tipo: 'radio', opcoes: ['Alta rotatividade de colaboradores', 'Conflitos internos frequentes', 'Falta de processos de RH', 'Liderança que precisa de desenvolvimento', 'Desejo de estruturar e crescer com organização', 'Indicação / recomendação'] })
      ]}
    ]
  },

  {
    id: 'rhcp_gestores', categoria: 'programa', icone: 'pessoas', etapa: 'Diagnóstico 3.7',
    titulo: 'Questionário RHCP — Gestores',
    descricao: '10 questões para líderes: equipe, comunicação, feedback e processos.',
    publico: 'Gestores e líderes', tempo: '15 minutos', numerar: true, imprimivel: true,
    intro: 'Destinado a gestores e líderes de equipe. Suas respostas são confidenciais e essenciais para compreender a liderança e os processos da organização.',
    secoes: [
      { titulo: 'Identificação', identificacao: true, campos: [
        { id: 'nome', coluna: 'nome', tipo: 'texto', rotulo: 'Nome completo', placeholder: 'Nome do respondente', largura: 2 },
        { id: 'cargo_setor', coluna: 'cargo_setor', tipo: 'texto', rotulo: 'Cargo / setor', placeholder: 'Ex: Gerente Comercial', largura: 2 },
        id_empresa(),
        { id: 'data_resposta', coluna: 'data_resposta', tipo: 'data', rotulo: 'Data', hoje: true, largura: 2 }
      ]},
      { titulo: 'Questionário', campos: [
        ...rhcp(1, 'Há quanto tempo você lidera esta equipe e como avalia seu papel como líder?', 'Tempo na função de liderança', 'Quais são as maiores dificuldades que você encontra para liderar sua equipe?', 'Descreva os principais desafios da sua função de liderança...',
          { tipo: 'radio', opcoes: ['Menos de 1 ano', '1 a 3 anos', '3 a 5 anos', 'Mais de 5 anos'] }),
        ...rhcp(2, 'Como você descreve o nível de engajamento e comprometimento da sua equipe?', 'Engajamento da equipe', 'Quais são os pontos fortes e os maiores desafios da sua equipe?', 'Pontos fortes: ... / Desafios: ...', escala5('Muito baixo', 'Muito alto')),
        ...rhcp(3, 'Com que frequência você realiza feedback com sua equipe?', 'Frequência de feedback', 'Como você conduz os momentos de feedback? O que poderia melhorar neste processo?', 'Descreva como você aborda o feedback com sua equipe...',
          { tipo: 'radio', opcoes: ['Não realizo feedback de forma estruturada', 'Raramente — somente quando há problemas', 'Às vezes — sem periodicidade definida', 'Regularmente — mensalmente ou bimestralmente', 'Com frequência — semanalmente ou quinzenalmente'] }),
        ...rhcp(4, 'Como ocorre a comunicação entre a sua equipe e os demais setores da empresa?', 'Qualidade da comunicação entre setores', 'Quais são os maiores gargalos de comunicação que você percebe?', 'Entre setores, com a diretoria, com a equipe...', escala5('Muito falha', 'Excelente')),
        ...rhcp(5, 'Quais são os conflitos mais frequentes dentro ou envolvendo a sua equipe?', 'Tipo de conflito mais comum', 'Como esses conflitos costumam ser resolvidos atualmente?', 'Descreva como os conflitos são tratados...',
          { tipo: 'radio', opcoes: ['Não há conflitos relevantes', 'Conflitos entre colaboradores da mesma equipe', 'Conflitos entre setores diferentes', 'Conflitos entre liderança e equipe', 'Múltiplos tipos de conflito'] }),
        ...rhcp(6, 'Os processos e responsabilidades da sua área estão claramente definidos?', 'Clareza de processos', 'O que tornaria a rotina da sua área mais eficiente?', 'Processos, ferramentas, comunicação...', escala5('Muito confuso', 'Muito claro')),
        ...rhcp(7, 'Quais treinamentos você considera mais necessários para sua equipe hoje?', 'Áreas prioritárias de desenvolvimento', 'Por que esses temas são prioritários para sua equipe?', 'Explique o contexto e as situações que motivam essa necessidade...',
          { tipo: 'checkbox', opcoes: ['Comunicação e relacionamento interpessoal', 'Atendimento ao cliente', 'Organização e produtividade', 'Trabalho em equipe e colaboração', 'Liderança e tomada de decisão', 'Treinamentos técnicos da função', 'Inteligência emocional'] }),
        ...rhcp(8, 'Você recebe o suporte necessário da diretoria para liderar sua equipe?', 'Suporte recebido da liderança superior', 'Que tipo de apoio você precisaria para liderar ainda melhor?', 'Ferramentas, autonomia, treinamento, mais clareza...', escala5('Nenhum suporte', 'Suporte total')),
        ...rhcp(9, 'Como você acompanha o desempenho e os resultados da sua equipe?', 'Método de acompanhamento', 'O que poderia melhorar no processo de acompanhamento da sua equipe?', 'Metas mais claras, reuniões mais frequentes, ferramentas...',
          { tipo: 'radio', opcoes: ['Não tenho processo definido para acompanhamento', 'Acompanho informalmente no dia a dia', 'Uso reuniões periódicas de alinhamento', 'Uso metas e indicadores definidos', 'Processo estruturado com avaliação formal'] }),
        ...rhcp(10, 'O que você espera alcançar com a consultoria e quais informações adicionais gostaria de compartilhar?', 'Principal expectativa com a consultoria', 'Há algo importante que não foi perguntado e que você gostaria de compartilhar?', 'Situações, contextos, dificuldades que acha relevantes...',
          { tipo: 'radio', opcoes: ['Melhorar minha habilidade de liderar', 'Reduzir conflitos na equipe', 'Melhorar a comunicação interna', 'Ter processos mais claros e organizados', 'Desenvolver e engajar minha equipe'] })
      ]}
    ]
  },

  {
    id: 'rhcp_colaboradores', categoria: 'programa', icone: 'conversa', etapa: 'Diagnóstico 3.8',
    titulo: 'Questionário RHCP — Colaboradores',
    descricao: '10 questões sobre clima, liderança, comunicação e percepção geral.',
    publico: 'Colaboradores', tempo: '12 minutos', numerar: true, imprimivel: true,
    intro: 'Suas respostas são anônimas e confidenciais. Não há respostas certas ou erradas — queremos entender sua percepção honesta sobre a empresa. Isso é fundamental para que possamos construir melhorias reais juntos.',
    mapa: { cargo_setor: ['tempo_empresa'] },
    secoes: [
      { titulo: 'Identificação', identificacao: true, campos: [
        { id: 'nome', coluna: 'nome', tipo: 'texto', rotulo: 'Setor / área (opcional)', placeholder: 'Ex: Vendas, Produção, Administrativo', largura: 2 },
        { id: 'tempo_empresa', tipo: 'texto', rotulo: 'Tempo de empresa', placeholder: 'Ex: 2 anos e 3 meses', largura: 2 },
        id_empresa(),
        { id: 'data_resposta', coluna: 'data_resposta', tipo: 'data', rotulo: 'Data', hoje: true, largura: 2 }
      ]},
      { titulo: 'Questionário', campos: [
        ...rhcp(1, 'Como foi sua integração quando você entrou na empresa?', 'Qualidade da integração recebida', 'O que poderia ter sido diferente ou melhor na sua chegada à empresa?', 'O que faltou ou o que foi muito bom...',
          { tipo: 'radio', opcoes: ['Não recebi nenhuma orientação', 'Recebi poucas orientações — aprendi na prática', 'Fui apresentado às pessoas e às tarefas básicas', 'Tive uma boa integração com suporte inicial', 'Excelente integração — me senti bem acolhido'] }),
        ...rhcp(2, 'Como você avalia o ambiente de trabalho e o relacionamento entre os colegas?', 'Clima e relacionamento', 'O que você mais aprecia no ambiente de trabalho? O que poderia melhorar?', 'Pontos positivos e pontos de melhoria...', escala5('Muito ruim', 'Muito bom')),
        ...rhcp(3, 'Você se sente ouvido e respeitado pela sua liderança?', 'Percepção sobre a liderança', 'Como é a relação com sua liderança direta? O que poderia melhorar?', 'Descreva como é a relação com seu líder no dia a dia...',
          { tipo: 'radio', opcoes: ['Não — raramente me sinto ouvido', 'Às vezes — depende da situação', 'Na maioria das vezes sim', 'Sim — me sinto sempre respeitado'] }),
        ...rhcp(4, 'Como você avalia a comunicação interna da empresa?', 'Qualidade da comunicação interna', 'As informações importantes chegam até você de forma clara e no tempo certo?', 'Dê exemplos de situações onde a comunicação funcionou bem ou mal...', escala5('Muito falha', 'Excelente')),
        ...rhcp(5, 'Você recebe feedback sobre o seu trabalho?', 'Frequência de feedback recebido', 'Como você gostaria de receber feedback do seu líder?', 'Frequência ideal, formato, o que tornaria mais útil...',
          { tipo: 'radio', opcoes: ['Nunca recebi feedback', 'Raramente — somente quando algo dá errado', 'Às vezes recebo feedback', 'Com frequência recebo feedback positivo e construtivo'] }),
        ...rhcp(6, 'Você acredita que a empresa investe no seu desenvolvimento profissional?', 'Percepção de investimento em desenvolvimento', 'Quais treinamentos ou oportunidades você gostaria de ter?', 'O que te ajudaria a crescer na empresa ou na carreira...', escala5('Não investe', 'Investe muito')),
        ...rhcp(7, 'Você conhece e pratica os valores e a cultura da empresa?', 'Alinhamento com a cultura', 'O que você considera inegociável dentro da empresa? O que nunca deveria mudar?', 'Valores, práticas, formas de trabalhar que são importantes...',
          { tipo: 'radio', opcoes: ['Não sei quais são os valores da empresa', 'Conheço superficialmente mas não os pratico ativamente', 'Conheço e procuro agir de acordo com eles', 'Me identifico muito com a cultura da empresa'] }),
        ...rhcp(8, 'O que você mais gosta de trabalhar nesta empresa?', 'Principal aspecto positivo', 'Descreva com suas palavras o que te faz querer continuar na empresa.', 'O que te motiva a vir trabalhar todos os dias...',
          { tipo: 'radio', opcoes: ['O ambiente e os colegas de trabalho', 'As oportunidades de crescimento', 'A liderança e o suporte recebido', 'A estabilidade e os benefícios', 'A missão e os valores da empresa', 'As atividades e desafios do trabalho em si'] }),
        ...rhcp(9, 'Se você pudesse mudar uma coisa na empresa hoje, o que seria?', 'Área que mais precisa melhorar na sua visão', 'Explique por que essa mudança seria importante e como poderia acontecer.', 'O que você sugere para melhorar...',
          { tipo: 'radio', opcoes: ['A comunicação interna', 'A forma como a liderança trata a equipe', 'Os processos e a organização do trabalho', 'O reconhecimento e a valorização dos colaboradores', 'As oportunidades de desenvolvimento e crescimento', 'O clima e o relacionamento entre as pessoas'] }),
        ...rhcp(10, 'Você se sente feliz e realizado trabalhando nesta empresa? Há algo que gostaria de compartilhar?', 'Satisfação geral', 'Existe algo importante que não foi perguntado e que você gostaria de compartilhar?', 'Situações, sentimentos, observações que considera importante...', escala5('Muito insatisfeito', 'Muito satisfeito'))
      ]}
    ]
  },

  // ─────────────────────────── EVENTOS ───────────────────────────
  {
    id: 'pre_palestra_executivo', categoria: 'eventos', icone: 'microfone',
    titulo: 'Pré-Palestra Executivo',
    descricao: 'Conversa com a direção antes da palestra — orienta a personalização do encontro.',
    publico: 'Direção executiva', tempo: '10 a 15 minutos', numerar: true,
    intro: 'Objetivo: compreender a percepção da direção sobre cultura, pessoas e os pontos que orientam a palestra.',
    agradecimento: 'As respostas foram registradas com sucesso. Essas informações serão fundamentais para personalizar o encontro e criar uma experiência significativa para todos.',
    mapa: { company: ['empresa'], nome: ['diretor'], data_resposta: ['data'] },
    colunasFixas: { cargo_setor: 'Direção Executiva' },
    secoes: [
      { titulo: 'Identificação', identificacao: true, campos: [
        { id: 'diretor', tipo: 'texto', rotulo: 'Diretor(a)', placeholder: 'Nome completo', obrigatorio: true, largura: 2 },
        { id: 'empresa', tipo: 'texto', rotulo: 'Empresa', placeholder: 'Nome da empresa', obrigatorio: true, largura: 2, preencherComEmpresa: true },
        { id: 'data', tipo: 'data', rotulo: 'Data', hoje: true, largura: 2 },
        { id: 'projeto', tipo: 'texto', rotulo: 'Projeto', placeholder: 'RH com Propósito', largura: 2 }
      ]},
      { titulo: 'Cultura e pessoas', campos: [
        { id: 'q1_alternativa', tipo: 'radio', rotulo: 'Como você definiria hoje a cultura da empresa em poucas palavras?', opcoes: ['Colaborativa e unida', 'Focada em resultados', 'Tradicional e hierarquizada', 'Familiar e acolhedora', 'Em processo de transformação', 'Outra'] },
        { id: 'q1_texto', tipo: 'textarea', rotulo: 'Descreva com suas próprias palavras:', placeholder: 'Complemente ou detalhe sua resposta…', sub: true, linhas: 2 },
        { id: 'q2_alternativas', tipo: 'checkbox', max: 3, rotulo: 'Quais são os três comportamentos que você mais gostaria de fortalecer nos colaboradores?', ajuda: 'Selecione até 3 opções.', opcoes: ['Responsabilidade e comprometimento', 'Comunicação e diálogo', 'Trabalho em equipe', 'Proatividade e iniciativa', 'Respeito e empatia', 'Foco no cliente', 'Liderança e influência positiva', 'Disciplina e organização', 'Adaptabilidade e resiliência'] },
        { id: 'q2_texto', tipo: 'textarea', rotulo: 'Outro comportamento ou complemento:', placeholder: 'Adicione outro comportamento ou detalhe…', sub: true, linhas: 2 },
        { id: 'q3_alternativa', tipo: 'radio', rotulo: 'Hoje, qual é o principal desafio relacionado às pessoas que você percebe dentro da empresa?', opcoes: ['Comunicação interna', 'Engajamento e motivação', 'Alta rotatividade', 'Qualidade da liderança', 'Clima organizacional', 'Produtividade e desempenho', 'Alinhamento com a cultura', 'Outro'] },
        { id: 'q3_texto', tipo: 'textarea', rotulo: 'Descreva o desafio com mais detalhes:', placeholder: 'Detalhe a situação…', sub: true, linhas: 2 },
        { id: 'q4_alternativas', tipo: 'checkbox', rotulo: 'O que você gostaria que os colaboradores compreendessem melhor sobre a empresa e talvez ainda não compreendam?', ajuda: 'Selecione quantas quiser.', opcoes: ['O propósito e os valores da empresa', 'A estratégia e os objetivos do negócio', 'O impacto do trabalho de cada um nos resultados', 'As expectativas de comportamento e atitude', 'A importância do trabalho em equipe', 'Os desafios e pressões que a empresa enfrenta'] },
        { id: 'q4_texto', tipo: 'textarea', rotulo: 'Complemento ou outro ponto:', placeholder: 'Descreva o que gostaria que compreendessem…', sub: true, linhas: 2 },
        { id: 'q5_alternativas', tipo: 'checkbox', rotulo: 'Existe algum comportamento ou atitude que a empresa considera inegociável?', ajuda: 'Selecione quantos quiser.', opcoes: ['Ética e honestidade', 'Respeito entre todos', 'Comprometimento com os resultados', 'Pontualidade e assiduidade', 'Sigilo e confidencialidade', 'Postura e apresentação pessoal'] },
        { id: 'q5_texto', tipo: 'textarea', rotulo: 'Outro inegociável ou complemento:', placeholder: 'Detalhe ou acrescente…', sub: true, linhas: 2 }
      ]},
      { titulo: 'O encontro', campos: [
        { id: 'q6_resposta', tipo: 'radio', rotulo: 'Existe algum assunto ou situação interna que eu precise conhecer para conduzir esse encontro com mais cuidado?', opcoes: ['Sim', 'Não'], rotulosOpcoes: { 'Sim': 'Sim — há algo importante a compartilhar', 'Não': 'Não — pode conduzir normalmente' } },
        { id: 'q6_texto', tipo: 'textarea', rotulo: 'Descreva a situação (tratado com sigilo):', placeholder: 'Compartilhe o que julgar necessário…', sub: true, linhas: 3 },
        { id: 'q7_alternativas', tipo: 'checkbox', max: 3, rotulo: 'Se essa palestra realmente cumprir o propósito dela, o que você gostaria que os colaboradores saíssem pensando, sentindo ou fazendo diferente?', ajuda: 'Selecione até 3 opções.', opcoes: ['Sentindo mais orgulho de fazer parte da empresa', 'Mais comprometidos com os resultados', 'Comunicando-se melhor com a equipe', 'Com maior senso de pertencimento', 'Valorizando mais o trabalho em equipe', 'Com mais proatividade no dia a dia', 'Reconhecendo o impacto do próprio trabalho'] },
        { id: 'q7_texto', tipo: 'textarea', rotulo: 'Outro resultado esperado ou complemento:', placeholder: 'Descreva o que espera como resultado…', sub: true, linhas: 2 },
        { id: 'q8_mensagem', tipo: 'textarea', rotulo: 'Se você pudesse deixar uma única mensagem para todos os colaboradores nesse encontro, qual seria?', placeholder: 'Escreva a mensagem que gostaria de transmitir…' }
      ]},
      { titulo: 'Pergunta de fechamento', descricao: 'Se você pudesse escolher três atitudes que gostaria de ver sendo cultivadas todos os dias dentro da empresa, quais seriam?', campos: [
        { id: 'atitude1', tipo: 'texto', rotulo: 'Atitude 1', placeholder: 'Ex: Respeito…', largura: 3 },
        { id: 'atitude2', tipo: 'texto', rotulo: 'Atitude 2', placeholder: 'Ex: Proatividade…', largura: 3 },
        { id: 'atitude3', tipo: 'texto', rotulo: 'Atitude 3', placeholder: 'Ex: Comprometimento…', largura: 3 }
      ]}
    ]
  },

  {
    id: 'questionario', categoria: 'eventos', icone: 'formularios',
    titulo: 'Questionário de Diagnóstico — Palestra',
    descricao: 'Levantamento de diagnóstico em contexto de palestras e eventos (14 perguntas).',
    publico: 'Direção', tempo: '10 minutos', passoAPasso: true, numerar: true,
    intro: 'Preencha as questões abaixo com atenção. As informações serão utilizadas para personalizar o trabalho de desenvolvimento da equipe e compreender melhor a realidade da empresa.',
    agradecimento: 'Obrigada pelo tempo e atenção dedicados a este diagnóstico. As informações compartilhadas serão utilizadas com cuidado e sigilo para personalizar o programa de desenvolvimento da equipe. Em breve entraremos em contato para apresentar as próximas etapas.',
    mapa: { nome: ['nome'], cargo_setor: ['cargo'], data_resposta: ['data'] },
    secoes: [
      { titulo: 'Identificação', identificacao: true, campos: [
        { id: 'nome', tipo: 'texto', rotulo: 'Nome completo', placeholder: 'Seu nome', largura: 2 },
        { id: 'cargo', tipo: 'texto', rotulo: 'Cargo', placeholder: 'Seu cargo', largura: 2 },
        { id: 'data', tipo: 'data', rotulo: 'Data', hoje: true, largura: 2 }
      ]},
      { titulo: 'A equipe hoje', campos: [
        { id: 'q1', tipo: 'radio', rotulo: 'Como você avalia o clima organizacional da empresa atualmente?', opcoes: ['Excelente', 'Bom', 'Regular', 'Precisa melhorar'] },
        { id: 'q2', tipo: 'radio', rotulo: 'Como você avalia a comunicação entre líderes e colaboradores?', opcoes: ['Excelente', 'Boa', 'Regular', 'Ruim'] },
        { id: 'q3', tipo: 'radio', rotulo: 'Como você avalia o comprometimento da equipe?', opcoes: ['Muito alto', 'Alto', 'Médio', 'Baixo'] },
        { id: 'q4', tipo: 'checkbox', max: 3, rotulo: 'Quais desafios você percebe com maior frequência?', ajuda: 'Marque até 3 opções.', opcoes: ['Comunicação', 'Falta de comprometimento', 'Trabalho em equipe', 'Liderança', 'Atendimento ao cliente', 'Conflitos internos', 'Resistência a mudanças', 'Falta de iniciativa', 'Outro'], outro: true },
        { id: 'q5', tipo: 'radio', rotulo: 'Os colaboradores compreendem claramente os objetivos da empresa?', opcoes: ['Sim', 'Parcialmente', 'Não'] },
        { id: 'q6', tipo: 'radio', rotulo: 'Você acredita que os líderes estão preparados para desenvolver suas equipes?', opcoes: ['Sim', 'Parcialmente', 'Não'] },
        { id: 'q7', tipo: 'radio', rotulo: 'Como você avalia o alinhamento da equipe com os valores da empresa?', opcoes: ['Muito alinhada', 'Alinhada', 'Parcialmente alinhada', 'Pouco alinhada'] }
      ]},
      { titulo: 'Desafios e expectativas', campos: [
        { id: 'q8', tipo: 'textarea', rotulo: 'Quais são os três maiores desafios da empresa atualmente?', placeholder: 'Descreva os três principais desafios que a empresa enfrenta hoje...' },
        { id: 'q9', tipo: 'textarea', rotulo: 'O que você espera que melhore após este trabalho?', placeholder: 'Descreva suas expectativas com o resultado deste trabalho...' },
        { id: 'q10', tipo: 'textarea', rotulo: 'Quais comportamentos gostaria de ver mais presentes na equipe?', placeholder: 'Descreva os comportamentos que você gostaria de observar com mais frequência...' },
        { id: 'q11', tipo: 'textarea', rotulo: 'Quais comportamentos precisam ser reduzidos ou eliminados?', placeholder: 'Descreva os comportamentos que precisam de ajuste ou eliminação...' }
      ]},
      { titulo: 'Cultura', campos: [
        { id: 'q12', tipo: 'textarea', rotulo: 'O que você considera inegociável dentro da cultura da empresa?', placeholder: 'Descreva os valores ou comportamentos que são inegociáveis para você e a empresa...' },
        { id: 'q13', tipo: 'textarea', rotulo: 'Se pudesse mudar apenas uma coisa na empresa hoje, o que seria?', placeholder: 'Se pudesse escolher apenas uma mudança imediata...' },
        { id: 'q14', tipo: 'textarea', rotulo: 'Existe alguma informação que você considera importante para a construção deste trabalho?', ajuda: 'Opcional.', placeholder: 'Sinta-se à vontade para compartilhar qualquer informação adicional que julgar relevante...' }
      ]}
    ]
  },

  {
    id: 'confirmacao_evento', categoria: 'eventos', icone: 'agenda',
    titulo: 'Confirmação de Presença',
    descricao: 'Convite do evento do Projeto Construindo Juntos — sorteio de brindes, prêmio surpresa e coffee break.',
    publico: 'Convidados', tempo: '1 minuto',
    tituloPublico: 'Você é o nosso convidado especial!',
    intro: 'Estamos preparando um momento pensado especialmente para você: sorteio de vários brindes, prêmio surpresa e coffee break.',
    agradecimento: 'Obrigado! Estamos felizes em contar com a sua presença. Prepare-se para um momento incrível. Até lá!',
    mapa: { nome: ['nome'], cargo_setor: ['setor'] },
    secoes: [
      { titulo: 'Confirme sua presença', campos: [
        { id: 'nome', tipo: 'texto', rotulo: 'Nome completo', placeholder: 'Seu nome completo', obrigatorio: true },
        { id: 'setor', tipo: 'texto', rotulo: 'Setor', placeholder: 'Ex: Financeiro, RH, Operações…', obrigatorio: true },
        { id: 'participacao', tipo: 'radio', rotulo: 'Você irá participar do evento?', obrigatorio: true, opcoes: ['Sim', 'Não'],
          rotulosOpcoes: { 'Sim': 'Sim, estarei presente!', 'Não': 'Não poderei comparecer' } },
        { id: 'motivo', tipo: 'textarea', rotulo: 'Motivo da ausência (opcional)', placeholder: 'Se quiser, nos conte o motivo…', linhas: 3, mostrarSe: { participacao: 'Não' } }
      ]}
    ]
  },

  // ─────────────────────────── SATISFAÇÃO ───────────────────────────
  {
    id: 'pesquisa_experiencia', categoria: 'satisfacao', icone: 'estrela',
    titulo: 'Pesquisa de Experiência',
    descricao: 'Enviada após o serviço — percepção da experiência, envolvimento da equipe e NPS.',
    publico: 'Clientes', tempo: '2 minutos', numerar: true, satisfacao: { nps: 'q8_nps', geral: 'q1_avaliacao', escala: 'q2_organizacao', frase: 'q9_frase', comentarios: ['q5_valor', 'q6_impacto', 'q7_melhoria'] },
    intro: 'Sua percepção é muito importante para nós. Esta pesquisa tem como objetivo compreender como foi a experiência da empresa com o RH com Propósito e identificar oportunidades para tornar nossos próximos encontros ainda mais significativos.',
    agradecimento: 'Sua percepção foi registrada com sucesso. Cada resposta nos ajuda a construir encontros cada vez mais significativos.\n\nPorque todo resultado começa com pessoas.',
    encerramento: 'Obrigada por fazer parte dessa construção. Cada encontro nos ajuda a reafirmar aquilo em que acreditamos: porque todo resultado começa com pessoas.',
    mapa: { company: ['empresa'], nome: ['nome'], cargo_setor: ['cargo'] },
    secoes: [
      { titulo: 'Identificação', identificacao: true, campos: [
        { id: 'empresa', tipo: 'texto', rotulo: 'Empresa', placeholder: 'Nome da empresa', obrigatorio: true, preencherComEmpresa: true },
        { id: 'nome', tipo: 'texto', rotulo: 'Nome', placeholder: 'Seu nome completo', obrigatorio: true, largura: 2 },
        { id: 'cargo', tipo: 'texto', rotulo: 'Cargo / setor', placeholder: 'Ex: Diretor(a), Gestor(a)…', largura: 2 }
      ]},
      { titulo: 'Avaliação da experiência', campos: [
        { id: 'q1_avaliacao', tipo: 'radio', rotulo: 'De forma geral, como você avalia a experiência com o RH com Propósito?', opcoes: ['Excelente', 'Muito boa', 'Boa', 'Regular', 'Abaixo das expectativas'] },
        { id: 'q2_organizacao', tipo: 'escala', min: 1, max: 5, rotulosEscala: ['Precisa melhorar', 'Excelente'], rotulo: 'Como você avalia a organização e preparação do encontro?' },
        { id: 'q3_conteudo', tipo: 'radio', rotulo: 'O conteúdo e as experiências propostas fizeram sentido para a realidade da empresa?', opcoes: ['Sim, totalmente', 'Sim, em grande parte', 'Parcialmente', 'Pouco'] },
        { id: 'q4_envolvimento', tipo: 'radio', rotulo: 'Na sua percepção, como foi o envolvimento dos colaboradores durante o encontro?', opcoes: ['Muito alto', 'Alto', 'Satisfatório', 'Baixo'] }
      ]},
      { titulo: 'Percepções e sugestões', campos: [
        { id: 'q5_valor', tipo: 'textarea', rotulo: 'O que mais chamou sua atenção ou gerou valor durante a experiência?', placeholder: 'Compartilhe o que mais te marcou…' },
        { id: 'q6_impacto', tipo: 'textarea', rotulo: 'Você percebeu algum impacto, comentário ou comportamento dos colaboradores após o encontro que gostaria de compartilhar?', placeholder: 'Conte o que observou depois do encontro…' },
        { id: 'q7_melhoria', tipo: 'textarea', rotulo: 'O que poderíamos melhorar nas próximas experiências?', placeholder: 'Sua sugestão é muito bem-vinda…' }
      ]},
      { titulo: 'Recomendação', campos: [
        { id: 'q8_nps', tipo: 'nps', rotulo: 'Você recomendaria o RH com Propósito para outras empresas?', rotulosEscala: ['Não recomendaria', 'Com certeza recomendaria'] },
        { id: 'q9_frase', tipo: 'textarea', rotulo: 'Em uma frase, como você descreveria a experiência da sua empresa com o RH com Propósito?', placeholder: 'Em poucas palavras…', linhas: 2 }
      ]}
    ]
  },

  // ─────────────────────────── DESENVOLVIMENTO ───────────────────────────
  {
    id: 'pdi', categoria: 'desenvolvimento', icone: 'alvo',
    titulo: 'PDI — Plano de Desenvolvimento Individual',
    descricao: 'Transforma os resultados do diagnóstico em ações práticas de desenvolvimento.',
    publico: 'Líder e colaborador', tempo: '20 minutos', passoAPasso: true, imprimivel: true,
    intro: 'Este formulário orienta a construção do PDI — transformando os resultados do diagnóstico em ações práticas de desenvolvimento, alinhando as necessidades da empresa ao crescimento profissional do colaborador.',
    agradecimento: 'O Plano de Desenvolvimento Individual foi registrado com sucesso. Este é um passo importante para o crescimento profissional do colaborador.',
    mapa: { nome: ['nome'], cargo_setor: ['cargo', 'setor'], data_resposta: ['data'] },
    secoes: [
      { titulo: 'Identificação', identificacao: true, campos: [
        { id: 'nome', tipo: 'texto', rotulo: 'Nome do colaborador', placeholder: 'Nome completo', obrigatorio: true, largura: 2 },
        { id: 'cargo', tipo: 'texto', rotulo: 'Cargo', placeholder: 'Cargo atual', largura: 2 },
        { id: 'setor', tipo: 'texto', rotulo: 'Setor', placeholder: 'Setor / departamento', largura: 2 },
        { id: 'lider', tipo: 'texto', rotulo: 'Líder imediato', placeholder: 'Nome do líder', largura: 2 },
        { id: 'data', tipo: 'data', rotulo: 'Data de elaboração', hoje: true, largura: 2 }
      ]},
      { titulo: 'Resumo do diagnóstico', descricao: 'Registre os principais achados do diagnóstico realizado com o colaborador.', campos: [
        { id: 'pontos_fortes', tipo: 'textarea', rotulo: 'Principais pontos fortes identificados', placeholder: 'Descreva os pontos fortes observados no colaborador durante o diagnóstico…' },
        { id: 'oportunidades', tipo: 'textarea', rotulo: 'Principais oportunidades de desenvolvimento', placeholder: 'Descreva as oportunidades de crescimento e áreas que precisam de desenvolvimento…' }
      ]},
      { titulo: 'Competências prioritárias', descricao: 'Defina até 3 competências prioritárias para o desenvolvimento deste colaborador.', campos: [
        { id: 'comp1', tipo: 'texto', rotulo: 'Competência 1', placeholder: 'Ex.: Comunicação assertiva' },
        { id: 'comp2', tipo: 'texto', rotulo: 'Competência 2', placeholder: 'Ex.: Gestão de tempo e prioridades' },
        { id: 'comp3', tipo: 'texto', rotulo: 'Competência 3', placeholder: 'Ex.: Liderança e influência positiva' }
      ]},
      { titulo: 'Objetivos de desenvolvimento', descricao: 'Defina objetivos claros e mensuráveis para o período de desenvolvimento.', campos: [
        { id: 'obj1_titulo', tipo: 'texto', rotulo: 'Objetivo 1', placeholder: 'Título do objetivo…' },
        { id: 'obj1_desc', tipo: 'textarea', rotulo: 'Como será atingido e medido', placeholder: 'Descreva como este objetivo será atingido e como será medido…', sub: true, linhas: 2 },
        { id: 'obj2_titulo', tipo: 'texto', rotulo: 'Objetivo 2', placeholder: 'Título do objetivo…' },
        { id: 'obj2_desc', tipo: 'textarea', rotulo: 'Como será atingido e medido', placeholder: 'Descreva como este objetivo será atingido e como será medido…', sub: true, linhas: 2 },
        { id: 'obj3_titulo', tipo: 'texto', rotulo: 'Objetivo 3', placeholder: 'Título do objetivo…' },
        { id: 'obj3_desc', tipo: 'textarea', rotulo: 'Como será atingido e medido', placeholder: 'Descreva como este objetivo será atingido e como será medido…', sub: true, linhas: 2 }
      ]},
      { titulo: 'Plano de ação', descricao: 'Detalhe as ações concretas para cada competência, com responsável e prazo definidos.', campos: [
        { id: 'plano', tipo: 'lista', rotulo: '', linhasLista: 5,
          colunas: [{ id: 'comp', titulo: 'Competência' }, { id: 'acao', titulo: 'Ação de desenvolvimento' }, { id: 'responsavel', titulo: 'Responsável' }, { id: 'prazo', titulo: 'Prazo', placeholder: 'dd/mm/aa' }] }
      ]},
      { titulo: 'Indicadores de evolução', descricao: 'Selecione os indicadores que serão utilizados para monitorar o progresso do colaborador.', campos: [
        { id: 'indicadores', tipo: 'checkbox', rotulo: 'Indicadores', opcoes: ['Melhoria da comunicação', 'Maior produtividade', 'Melhor relacionamento interpessoal', 'Cumprimento de prazos', 'Redução de erros', 'Maior comprometimento', 'Maior autonomia'] },
        { id: 'ind_outros', tipo: 'texto', rotulo: 'Outros indicadores', placeholder: 'Descreva outros indicadores relevantes…' }
      ]},
      { titulo: 'Acompanhamento', descricao: 'Registre as observações de cada reunião de acompanhamento do PDI.', campos: [
        { id: 'rev1_data', tipo: 'data', rotulo: '1ª revisão — data', largura: 3 },
        { id: 'rev1_evolucoes', tipo: 'textarea', rotulo: '1ª revisão — evoluções observadas', placeholder: 'Descreva os progressos percebidos desde o início do PDI…', linhas: 2 },
        { id: 'rev1_ajustes', tipo: 'textarea', rotulo: '1ª revisão — ajustes necessários', placeholder: 'Indique mudanças de rota, novas ações ou ajustes no plano…', linhas: 2 },
        { id: 'rev2_data', tipo: 'data', rotulo: '2ª revisão — data', largura: 3 },
        { id: 'rev2_evolucoes', tipo: 'textarea', rotulo: '2ª revisão — evoluções observadas', placeholder: 'Descreva os progressos percebidos desde a última revisão…', linhas: 2 },
        { id: 'rev2_ajustes', tipo: 'textarea', rotulo: '2ª revisão — ajustes necessários', placeholder: 'Indique mudanças de rota, novas ações ou ajustes no plano…', linhas: 2 },
        { id: 'rev3_data', tipo: 'data', rotulo: '3ª revisão — data', largura: 3 },
        { id: 'rev3_evolucoes', tipo: 'textarea', rotulo: '3ª revisão — evoluções observadas', placeholder: 'Descreva os progressos percebidos desde a última revisão…', linhas: 2 },
        { id: 'rev3_ajustes', tipo: 'textarea', rotulo: '3ª revisão — ajustes necessários', placeholder: 'Indique mudanças de rota, novas ações ou ajustes no plano…', linhas: 2 }
      ]},
      { titulo: 'Encerramento', descricao: 'Registre o resultado final do ciclo de desenvolvimento e formalize o encerramento.', campos: [
        { id: 'resultado', tipo: 'radio', rotulo: 'Resultado final do desenvolvimento', opcoes: ['Objetivos alcançados', 'Objetivos parcialmente alcançados', 'Necessita continuidade'] },
        { id: 'assin_colaborador', tipo: 'texto', rotulo: 'Assinatura — colaborador', placeholder: 'Nome completo', largura: 2 },
        { id: 'assin_lider', tipo: 'texto', rotulo: 'Assinatura — líder imediato', placeholder: 'Nome completo', largura: 2 }
      ]}
    ]
  }

  ]);
})();
