// Módulos convertidos do antigo recrutamento.html (as chaves dos campos são as mesmas
// das respostas já gravadas). Edite este arquivo diretamente.
// Módulos de Recrutamento & Seleção. Seções "interno" só aparecem para a consultora logada.
window.RH_FORMULARIOS = (window.RH_FORMULARIOS || []).concat([
 {
  "id": "rs_m1",
  "titulo": "Briefing Inicial da Vaga",
  "modulo": "Módulo 1",
  "categoria": "recrutamento",
  "icone": "selecao",
  "descricao": "Levantamento inicial das necessidades de contratação",
  "mapa": {
   "company": [
    "m1-empresa"
   ],
   "nome": [
    "m1-candidato",
    "m1-colaborador",
    "m1-responsavel"
   ],
   "cargo_setor": [
    "m1-cargo",
    "m1-nome_vaga",
    "m1-vaga"
   ]
  },
  "secoes": [
   {
    "titulo": "Dados da Empresa",
    "campos": [
     {
      "id": "m1-empresa",
      "tipo": "texto",
      "rotulo": "Empresa",
      "largura": 2
     },
     {
      "id": "m1-responsavel",
      "tipo": "texto",
      "rotulo": "Responsável / Contato",
      "largura": 2
     },
     {
      "id": "m1-cargo",
      "tipo": "texto",
      "rotulo": "Cargo / Setor",
      "largura": 3
     },
     {
      "id": "m1-telefone",
      "tipo": "telefone",
      "rotulo": "Telefone",
      "largura": 3
     },
     {
      "id": "m1-email",
      "tipo": "email",
      "rotulo": "E-mail",
      "largura": 3
     },
     {
      "id": "m1-cidade",
      "tipo": "texto",
      "rotulo": "Cidade / UF",
      "largura": 2
     },
     {
      "id": "m1-ramo",
      "tipo": "texto",
      "rotulo": "Ramo de Atividade",
      "largura": 2
     },
     {
      "id": "m1-num_colaboradores",
      "tipo": "numero",
      "rotulo": "Número de Colaboradores"
     }
    ]
   },
   {
    "titulo": "Dados da Vaga",
    "campos": [
     {
      "id": "m1-nome_vaga",
      "tipo": "texto",
      "rotulo": "Nome da Vaga",
      "largura": 2
     },
     {
      "id": "m1-setor",
      "tipo": "texto",
      "rotulo": "Setor / Área",
      "largura": 2
     },
     {
      "id": "m1-qtd_vagas",
      "tipo": "numero",
      "rotulo": "Quantidade de Vagas",
      "padrao": "1",
      "largura": 2
     },
     {
      "id": "m1-data_inicio",
      "tipo": "data",
      "rotulo": "Data de Início Prevista",
      "largura": 2
     },
     {
      "id": "m1-tipo_vaga",
      "tipo": "radio",
      "rotulo": "Tipo de Vaga",
      "opcoes": [
       "CLT",
       "PJ",
       "Temporário",
       "Estágio",
       "Outro"
      ]
     },
     {
      "id": "m1-motivo",
      "tipo": "radio",
      "rotulo": "Motivo da Contratação",
      "opcoes": [
       "Vaga nova",
       "Substituição",
       "Expansão",
       "Outro"
      ]
     },
     {
      "id": "m1-urgencia",
      "tipo": "radio",
      "rotulo": "Urgência",
      "opcoes": [
       "Alta",
       "Média",
       "Baixa"
      ]
     }
    ]
   },
   {
    "titulo": "Contexto e Perfil",
    "campos": [
     {
      "id": "m1-historico",
      "tipo": "textarea",
      "rotulo": "Histórico / Contexto da necessidade"
     },
     {
      "id": "m1-condicoes",
      "tipo": "textarea",
      "rotulo": "Condições de Trabalho (salário, benefícios, horário, local)"
     },
     {
      "id": "m1-perfil",
      "tipo": "textarea",
      "rotulo": "Perfil Desejado"
     },
     {
      "id": "m1-decisao",
      "tipo": "texto",
      "rotulo": "Quem decide a contratação final?"
     },
     {
      "id": "m1-proximo_passo",
      "tipo": "textarea",
      "rotulo": "Próximo passo acordado",
      "linhas": 2
     }
    ]
   }
  ]
 },
 {
  "id": "rs_m2",
  "titulo": "Reunião com o Gestor da Vaga",
  "modulo": "Módulo 2",
  "categoria": "recrutamento",
  "icone": "selecao",
  "descricao": "Alinhamento aprofundado sobre a necessidade de contratação",
  "mapa": {
   "company": [
    "m2-empresa"
   ],
   "nome": [
    "m2-candidato",
    "m2-colaborador",
    "m2-responsavel"
   ],
   "cargo_setor": [
    "m2-cargo",
    "m2-nome_vaga",
    "m2-vaga"
   ]
  },
  "secoes": [
   {
    "titulo": "Identificação",
    "campos": [
     {
      "id": "m2-empresa",
      "tipo": "texto",
      "rotulo": "Empresa",
      "largura": 2
     },
     {
      "id": "m2-data_reuniao",
      "tipo": "data",
      "rotulo": "Data da Reunião",
      "largura": 2
     },
     {
      "id": "m2-gestor_vaga",
      "tipo": "texto",
      "rotulo": "Gestor responsável pela vaga",
      "largura": 2
     },
     {
      "id": "m2-participantes",
      "tipo": "texto",
      "rotulo": "Participantes",
      "largura": 2
     },
     {
      "id": "m2-nome_vaga",
      "tipo": "texto",
      "rotulo": "Nome da Vaga"
     }
    ]
   },
   {
    "titulo": "Sobre a Contratação",
    "campos": [
     {
      "id": "m2-por_que",
      "tipo": "textarea",
      "rotulo": "Por que essa vaga existe agora?"
     },
     {
      "id": "m2-impacto",
      "tipo": "textarea",
      "rotulo": "O que acontece se a vaga não for preenchida?"
     },
     {
      "id": "m2-tentativas",
      "tipo": "textarea",
      "rotulo": "Já houve tentativas anteriores? O que ocorreu?"
     },
     {
      "id": "m2-desafio",
      "tipo": "textarea",
      "rotulo": "Qual é o maior desafio que a pessoa vai enfrentar?"
     },
     {
      "id": "m2-sucesso_90d",
      "tipo": "textarea",
      "rotulo": "O que faria a empresa dizer que a contratação foi um sucesso em 90 dias?"
     }
    ]
   },
   {
    "titulo": "Missão, Atividades e Competências",
    "campos": [
     {
      "id": "m2-missao",
      "tipo": "textarea",
      "rotulo": "Missão do cargo"
     },
     {
      "id": "m2-atividades",
      "tipo": "textarea",
      "rotulo": "Principais atividades e responsabilidades"
     },
     {
      "id": "m2-tecnicos",
      "tipo": "textarea",
      "rotulo": "Conhecimentos técnicos obrigatórios"
     },
     {
      "id": "m2-comp",
      "tipo": "checkbox",
      "rotulo": "Competências comportamentais esperadas",
      "opcoes": [
       "Liderança",
       "Comunicação",
       "Trabalho em equipe",
       "Proatividade",
       "Organização",
       "Foco em resultados",
       "Resiliência",
       "Adaptabilidade"
      ]
     },
     {
      "id": "m2-cultura",
      "tipo": "textarea",
      "rotulo": "Fit cultural esperado"
     },
     {
      "id": "m2-condicoes",
      "tipo": "textarea",
      "rotulo": "Condições da vaga"
     },
     {
      "id": "m2-processo",
      "tipo": "textarea",
      "rotulo": "Processo seletivo acordado"
     }
    ]
   }
  ]
 },
 {
  "id": "rs_m3",
  "titulo": "Perfil do Cargo / Persona da Vaga",
  "modulo": "Módulo 3",
  "categoria": "recrutamento",
  "icone": "selecao",
  "descricao": "Construção detalhada do perfil ideal para a posição",
  "mapa": {
   "company": [
    "m3-empresa"
   ],
   "nome": [
    "m3-candidato",
    "m3-colaborador",
    "m3-responsavel"
   ],
   "cargo_setor": [
    "m3-cargo",
    "m3-nome_vaga",
    "m3-vaga"
   ]
  },
  "secoes": [
   {
    "titulo": "Identificação",
    "campos": [
     {
      "id": "m3-empresa",
      "tipo": "texto",
      "rotulo": "Empresa",
      "largura": 2
     },
     {
      "id": "m3-nome_vaga",
      "tipo": "texto",
      "rotulo": "Nome da Vaga",
      "largura": 2
     }
    ]
   },
   {
    "titulo": "Missão do Cargo",
    "campos": [
     {
      "id": "m3-missao_1",
      "tipo": "textarea",
      "rotulo": "Qual é o propósito dessa função? Por que ela existe?"
     },
     {
      "id": "m3-missao_2",
      "tipo": "textarea",
      "rotulo": "Qual impacto essa pessoa gera para a empresa/equipe/cliente?"
     },
     {
      "id": "m3-missao_3",
      "tipo": "textarea",
      "rotulo": "O que diferencia um desempenho médio de um excelente nessa vaga?"
     }
    ]
   },
   {
    "titulo": "Top 5 Responsabilidades",
    "campos": [
     {
      "id": "m3-resp1",
      "tipo": "textarea",
      "rotulo": "1.",
      "linhas": 2
     },
     {
      "id": "m3-resp2",
      "tipo": "textarea",
      "rotulo": "2.",
      "linhas": 2
     },
     {
      "id": "m3-resp3",
      "tipo": "textarea",
      "rotulo": "3.",
      "linhas": 2
     },
     {
      "id": "m3-resp4",
      "tipo": "textarea",
      "rotulo": "4.",
      "linhas": 2
     },
     {
      "id": "m3-resp5",
      "tipo": "textarea",
      "rotulo": "5.",
      "linhas": 2
     }
    ]
   },
   {
    "titulo": "Rotina e Relacionamentos",
    "campos": [
     {
      "id": "m3-rotina_diaria",
      "tipo": "textarea",
      "rotulo": "Rotina diária"
     },
     {
      "id": "m3-rotina_semanal",
      "tipo": "textarea",
      "rotulo": "Rotina semanal"
     },
     {
      "id": "m3-rotina_mensal",
      "tipo": "textarea",
      "rotulo": "Rotina mensal"
     },
     {
      "id": "m3-decisao",
      "tipo": "textarea",
      "rotulo": "Tomada de decisão autônoma"
     },
     {
      "id": "m3-relac",
      "tipo": "checkbox",
      "rotulo": "Relaciona-se com",
      "opcoes": [
       "Diretoria",
       "Equipe própria",
       "Outros setores",
       "Clientes",
       "Fornecedores",
       "Parceiros"
      ]
     }
    ]
   },
   {
    "titulo": "Requisitos",
    "campos": [
     {
      "id": "m3-tec_obrig",
      "tipo": "textarea",
      "rotulo": "Competências técnicas obrigatórias"
     },
     {
      "id": "m3-tec_desej",
      "tipo": "textarea",
      "rotulo": "Competências técnicas desejáveis"
     },
     {
      "id": "m3-escolaridade",
      "tipo": "radio",
      "rotulo": "Escolaridade mínima",
      "opcoes": [
       "Ensino Médio",
       "Técnico",
       "Superior Cursando",
       "Superior Completo",
       "Pós-graduação"
      ]
     },
     {
      "id": "m3-experiencia",
      "tipo": "texto",
      "rotulo": "Experiência mínima exigida"
     },
     {
      "id": "m3-ferramentas",
      "tipo": "textarea",
      "rotulo": "Ferramentas / sistemas obrigatórios",
      "linhas": 2
     },
     {
      "id": "m3-comp",
      "tipo": "checkbox",
      "rotulo": "Top 5 competências comportamentais",
      "opcoes": [
       "Liderança",
       "Comunicação",
       "Trabalho em equipe",
       "Proatividade",
       "Organização",
       "Foco em resultados",
       "Resiliência",
       "Adaptabilidade",
       "Inteligência emocional",
       "Visão sistêmica"
      ]
     }
    ]
   },
   {
    "titulo": "Perfil e Divulgação",
    "campos": [
     {
      "id": "m3-perfil_ideal",
      "tipo": "textarea",
      "rotulo": "Perfil ideal"
     },
     {
      "id": "m3-perfil_incompat",
      "tipo": "textarea",
      "rotulo": "Perfil incompatível"
     },
     {
      "id": "m3-oportunidades",
      "tipo": "textarea",
      "rotulo": "Oportunidades que a vaga oferece"
     },
     {
      "id": "m3-divulgacao",
      "tipo": "textarea",
      "rotulo": "Informações para divulgação"
     }
    ]
   }
  ]
 },
 {
  "id": "rs_m4",
  "titulo": "Proposta Comercial",
  "modulo": "Módulo 4",
  "categoria": "recrutamento",
  "icone": "selecao",
  "descricao": "Formalização das condições comerciais do processo seletivo",
  "mapa": {
   "company": [
    "m4-empresa"
   ],
   "nome": [
    "m4-candidato",
    "m4-colaborador",
    "m4-responsavel"
   ],
   "cargo_setor": [
    "m4-cargo",
    "m4-nome_vaga",
    "m4-vaga"
   ]
  },
  "secoes": [
   {
    "titulo": "Dados da Empresa Contratante",
    "campos": [
     {
      "id": "m4-empresa",
      "tipo": "texto",
      "rotulo": "Razão Social",
      "largura": 2
     },
     {
      "id": "m4-cnpj",
      "tipo": "texto",
      "rotulo": "CNPJ",
      "largura": 2
     },
     {
      "id": "m4-responsavel",
      "tipo": "texto",
      "rotulo": "Responsável",
      "largura": 2
     },
     {
      "id": "m4-email",
      "tipo": "email",
      "rotulo": "E-mail",
      "largura": 2
     },
     {
      "id": "m4-cidade",
      "tipo": "texto",
      "rotulo": "Cidade / UF",
      "largura": 2
     },
     {
      "id": "m4-telefone",
      "tipo": "telefone",
      "rotulo": "Telefone",
      "largura": 2
     }
    ]
   },
   {
    "titulo": "Escopo dos Serviços",
    "campos": [
     {
      "id": "m4-escopo",
      "tipo": "checkbox",
      "rotulo": "",
      "opcoes": [
       "Briefing e alinhamento",
       "Mapeamento do perfil",
       "Divulgação da vaga",
       "Triagem de currículos",
       "Pré-entrevista",
       "Entrevista por competências",
       "Relatório dos candidatos",
       "Apresentação dos finalistas",
       "Apoio na negociação",
       "Acompanhamento pós-contratação"
      ]
     }
    ]
   },
   {
    "titulo": "Cronograma e Condições Comerciais",
    "campos": [
     {
      "id": "m4-prazo_finalistas",
      "tipo": "texto",
      "rotulo": "Prazo para entrega dos finalistas",
      "largura": 2
     },
     {
      "id": "m4-data_inicio",
      "tipo": "data",
      "rotulo": "Data de início prevista",
      "largura": 2
     },
     {
      "id": "m4-vaga_desc",
      "tipo": "texto",
      "rotulo": "Vaga"
     },
     {
      "id": "m4-honorarios",
      "tipo": "texto",
      "rotulo": "Valor dos honorários"
     },
     {
      "id": "m4-forma_pagamento",
      "tipo": "textarea",
      "rotulo": "Forma de pagamento",
      "linhas": 2
     },
     {
      "id": "m4-politica_reposicao",
      "tipo": "textarea",
      "rotulo": "Política de reposição"
     }
    ]
   },
   {
    "titulo": "Aprovação",
    "campos": [
     {
      "id": "m4-aprovado_empresa",
      "tipo": "texto",
      "rotulo": "Aprovado por",
      "largura": 2
     },
     {
      "id": "m4-data_aprovacao",
      "tipo": "data",
      "rotulo": "Data",
      "largura": 2
     },
     {
      "id": "m4-obs",
      "tipo": "textarea",
      "rotulo": "Observações",
      "linhas": 2
     }
    ]
   }
  ]
 },
 {
  "id": "rs_m5",
  "titulo": "Planejamento e Controle da Divulgação",
  "modulo": "Módulo 5",
  "categoria": "recrutamento",
  "icone": "selecao",
  "descricao": "Estratégia de atração e divulgação da vaga",
  "mapa": {
   "company": [
    "m5-empresa"
   ],
   "nome": [
    "m5-candidato",
    "m5-colaborador",
    "m5-responsavel"
   ],
   "cargo_setor": [
    "m5-cargo",
    "m5-nome_vaga",
    "m5-vaga"
   ]
  },
  "secoes": [
   {
    "titulo": "Identificação",
    "campos": [
     {
      "id": "m5-empresa",
      "tipo": "texto",
      "rotulo": "Empresa",
      "largura": 2
     },
     {
      "id": "m5-nome_vaga",
      "tipo": "texto",
      "rotulo": "Nome da Vaga",
      "largura": 2
     },
     {
      "id": "m5-data_inicio",
      "tipo": "data",
      "rotulo": "Início da divulgação",
      "largura": 2
     },
     {
      "id": "m5-data_limite",
      "tipo": "data",
      "rotulo": "Prazo para recebimento de CVs",
      "largura": 2
     }
    ],
    "interno": true
   },
   {
    "titulo": "Canais de Divulgação",
    "campos": [
     {
      "id": "m5-canais",
      "tipo": "checkbox",
      "rotulo": "",
      "opcoes": [
       "LinkedIn",
       "Indeed",
       "Catho",
       "InfoJobs",
       "Gupy",
       "WhatsApp/redes",
       "Banco de talentos",
       "Indicações",
       "Site da empresa"
      ]
     },
     {
      "id": "m5-outros_canais",
      "tipo": "textarea",
      "rotulo": "Outros canais",
      "linhas": 2
     }
    ],
    "interno": true
   },
   {
    "titulo": "Texto da Vaga",
    "campos": [
     {
      "id": "m5-titulo_anuncio",
      "tipo": "texto",
      "rotulo": "Título do anúncio"
     },
     {
      "id": "m5-texto_vaga",
      "tipo": "textarea",
      "rotulo": "Descrição completa da vaga",
      "linhas": 8
     },
     {
      "id": "m5-palavras_chave",
      "tipo": "texto",
      "rotulo": "Palavras-chave para atração"
     }
    ],
    "interno": true
   },
   {
    "titulo": "Estratégia e Controle",
    "campos": [
     {
      "id": "m5-estrategia",
      "tipo": "textarea",
      "rotulo": "Estratégia de abordagem"
     },
     {
      "id": "m5-meta_candidatos",
      "tipo": "numero",
      "rotulo": "Meta de candidatos para triagem"
     },
     {
      "id": "m5-avaliacao",
      "tipo": "textarea",
      "rotulo": "Avaliação dos resultados"
     },
     {
      "id": "m5-obs",
      "tipo": "textarea",
      "rotulo": "Observações",
      "linhas": 2
     }
    ],
    "interno": true
   }
  ],
  "interno": true
 },
 {
  "id": "rs_m6",
  "titulo": "Triagem de Currículos",
  "modulo": "Módulo 6",
  "categoria": "recrutamento",
  "icone": "selecao",
  "descricao": "Avaliação e classificação dos candidatos recebidos",
  "mapa": {
   "company": [
    "m6-empresa"
   ],
   "nome": [
    "m6-candidato",
    "m6-colaborador",
    "m6-responsavel"
   ],
   "cargo_setor": [
    "m6-cargo",
    "m6-nome_vaga",
    "m6-vaga"
   ]
  },
  "secoes": [
   {
    "titulo": "Identificação",
    "campos": [
     {
      "id": "m6-empresa",
      "tipo": "texto",
      "rotulo": "Empresa",
      "largura": 2
     },
     {
      "id": "m6-vaga",
      "tipo": "texto",
      "rotulo": "Vaga",
      "largura": 2
     },
     {
      "id": "m6-responsavel",
      "tipo": "texto",
      "rotulo": "Responsável pela triagem",
      "largura": 2
     },
     {
      "id": "m6-data",
      "tipo": "data",
      "rotulo": "Data",
      "largura": 2
     }
    ],
    "interno": true
   },
   {
    "titulo": "Ficha do Candidato",
    "campos": [
     {
      "id": "m6-candidato",
      "tipo": "texto",
      "rotulo": "Nome do Candidato",
      "largura": 2
     },
     {
      "id": "m6-email_candidato",
      "tipo": "email",
      "rotulo": "E-mail",
      "largura": 2
     },
     {
      "id": "m6-tel_candidato",
      "tipo": "telefone",
      "rotulo": "Telefone",
      "largura": 2
     },
     {
      "id": "m6-cidade_candidato",
      "tipo": "texto",
      "rotulo": "Cidade / UF",
      "largura": 2
     },
     {
      "id": "m6-pretensao",
      "tipo": "texto",
      "rotulo": "Pretensão Salarial",
      "largura": 2
     },
     {
      "id": "m6-canal_origem",
      "tipo": "texto",
      "rotulo": "Canal de origem",
      "largura": 2
     }
    ],
    "interno": true
   },
   {
    "titulo": "Avaliação de Critérios",
    "campos": [
     {
      "id": "m6-c1-grade",
      "tipo": "grade",
      "rotulo": "",
      "colunas": [
       "Critério",
       "Obrigatório?",
       "Atende?",
       "Observação"
      ],
      "linhas": [
       {
        "rotulo": "Escolaridade mínima",
        "celulas": [
         {
          "id": "m6-c1-obrig",
          "tipo": "select",
          "opcoes": [
           "Sim",
           "Não"
          ]
         },
         {
          "id": "m6-c1-atende",
          "tipo": "select",
          "opcoes": [
           "Sim",
           "Parcial",
           "Não"
          ]
         },
         {
          "id": "m6-c1-obs",
          "tipo": "texto"
         }
        ]
       },
       {
        "rotulo": "Experiência na área",
        "celulas": [
         {
          "id": "m6-c2-obrig",
          "tipo": "select",
          "opcoes": [
           "Sim",
           "Não"
          ]
         },
         {
          "id": "m6-c2-atende",
          "tipo": "select",
          "opcoes": [
           "Sim",
           "Parcial",
           "Não"
          ]
         },
         {
          "id": "m6-c2-obs",
          "tipo": "texto"
         }
        ]
       },
       {
        "rotulo": "Conhecimento técnico",
        "celulas": [
         {
          "id": "m6-c3-obrig",
          "tipo": "select",
          "opcoes": [
           "Sim",
           "Não"
          ]
         },
         {
          "id": "m6-c3-atende",
          "tipo": "select",
          "opcoes": [
           "Sim",
           "Parcial",
           "Não"
          ]
         },
         {
          "id": "m6-c3-obs",
          "tipo": "texto"
         }
        ]
       },
       {
        "rotulo": "Pretensão salarial",
        "celulas": [
         {
          "id": "m6-c4-obrig",
          "tipo": "select",
          "opcoes": [
           "Sim",
           "Não"
          ]
         },
         {
          "id": "m6-c4-atende",
          "tipo": "select",
          "opcoes": [
           "Sim",
           "Parcial",
           "Não"
          ]
         },
         {
          "id": "m6-c4-obs",
          "tipo": "texto"
         }
        ]
       },
       {
        "rotulo": "Localidade / disponibilidade",
        "celulas": [
         {
          "id": "m6-c5-obrig",
          "tipo": "select",
          "opcoes": [
           "Sim",
           "Não"
          ]
         },
         {
          "id": "m6-c5-atende",
          "tipo": "select",
          "opcoes": [
           "Sim",
           "Parcial",
           "Não"
          ]
         },
         {
          "id": "m6-c5-obs",
          "tipo": "texto"
         }
        ]
       }
      ]
     }
    ],
    "interno": true
   },
   {
    "titulo": "Classificação Final",
    "campos": [
     {
      "id": "m6-classificacao",
      "tipo": "radio",
      "rotulo": "Classificação",
      "opcoes": [
       "Aprovado para pré-entrevista",
       "Em espera",
       "Reprovado"
      ]
     },
     {
      "id": "m6-obs_classificacao",
      "tipo": "textarea",
      "rotulo": "Motivo / Observações"
     },
     {
      "id": "m6-indicadores",
      "tipo": "textarea",
      "rotulo": "Indicadores gerais",
      "linhas": 2
     }
    ],
    "interno": true
   }
  ],
  "interno": true
 },
 {
  "id": "rs_m7",
  "titulo": "Pré-Entrevista",
  "modulo": "Módulo 7",
  "categoria": "recrutamento",
  "icone": "selecao",
  "descricao": "Triagem por telefone / online com o candidato",
  "mapa": {
   "company": [
    "m7-empresa"
   ],
   "nome": [
    "m7-candidato",
    "m7-colaborador",
    "m7-responsavel"
   ],
   "cargo_setor": [
    "m7-cargo",
    "m7-nome_vaga",
    "m7-vaga"
   ]
  },
  "secoes": [
   {
    "titulo": "Identificação",
    "campos": [
     {
      "id": "m7-candidato",
      "tipo": "texto",
      "rotulo": "Nome do Candidato",
      "largura": 2
     },
     {
      "id": "m7-data_hora",
      "tipo": "texto",
      "rotulo": "Data / Horário",
      "largura": 2
     },
     {
      "id": "m7-empresa",
      "tipo": "texto",
      "rotulo": "Empresa",
      "largura": 2
     },
     {
      "id": "m7-vaga",
      "tipo": "texto",
      "rotulo": "Vaga",
      "largura": 2
     },
     {
      "id": "m7-consultora",
      "tipo": "texto",
      "rotulo": "Consultora responsável",
      "largura": 2
     },
     {
      "id": "m7-formato",
      "tipo": "radio",
      "rotulo": "Formato",
      "opcoes": [
       "Telefone",
       "Online",
       "Presencial"
      ],
      "largura": 2
     }
    ]
   },
   {
    "titulo": "Perguntas da Consultora",
    "campos": [
     {
      "id": "m7-q1",
      "tipo": "textarea",
      "rotulo": "1. Apresentação da consultoria e da vaga — como o candidato reagiu?",
      "linhas": 2
     },
     {
      "id": "m7-q2",
      "tipo": "textarea",
      "rotulo": "2. O candidato está ativo no mercado / disponível?",
      "linhas": 2
     }
    ],
    "interno": true
   },
   {
    "titulo": "Questões para o Candidato",
    "campos": [
     {
      "id": "m7-q3",
      "tipo": "textarea",
      "rotulo": "3. O que te motivou a se candidatar para essa vaga?",
      "linhas": 2
     },
     {
      "id": "m7-q4",
      "tipo": "textarea",
      "rotulo": "4. Me fale sobre sua trajetória profissional mais recente.",
      "linhas": 2
     },
     {
      "id": "m7-q5",
      "tipo": "textarea",
      "rotulo": "5. Qual é a sua pretensão salarial?",
      "linhas": 2
     },
     {
      "id": "m7-q6",
      "tipo": "textarea",
      "rotulo": "6. Tem disponibilidade para iniciar em breve?",
      "linhas": 2
     },
     {
      "id": "m7-q7",
      "tipo": "textarea",
      "rotulo": "7. Tem alguma restrição de horário ou local de trabalho?",
      "linhas": 2
     },
     {
      "id": "m7-q8",
      "tipo": "textarea",
      "rotulo": "8. Está participando de outros processos seletivos?",
      "linhas": 2
     },
     {
      "id": "m7-q9",
      "tipo": "textarea",
      "rotulo": "9. Por que quer sair (ou saiu) da empresa atual/anterior?",
      "linhas": 2
     },
     {
      "id": "m7-q10",
      "tipo": "textarea",
      "rotulo": "10. Tem alguma dúvida sobre a vaga ou o processo?",
      "linhas": 2
     }
    ]
   },
   {
    "titulo": "Avaliação e Decisão",
    "campos": [
     {
      "id": "m7-avaliacao_consultora",
      "tipo": "textarea",
      "rotulo": "Avaliação geral da consultora",
      "linhas": 4
     },
     {
      "id": "m7-decisao",
      "tipo": "radio",
      "rotulo": "Decisão",
      "opcoes": [
       "Avançar para entrevista",
       "Em espera",
       "Encerrar participação"
      ]
     },
     {
      "id": "m7-agendamento",
      "tipo": "textarea",
      "rotulo": "Agendamento da próxima etapa",
      "linhas": 2
     }
    ],
    "interno": true
   }
  ]
 },
 {
  "id": "rs_m8",
  "titulo": "Entrevista por Competências",
  "modulo": "Módulo 8",
  "categoria": "recrutamento",
  "icone": "selecao",
  "descricao": "Roteiro estruturado de entrevista comportamental (método STAR)",
  "mapa": {
   "company": [
    "m8-empresa"
   ],
   "nome": [
    "m8-candidato",
    "m8-colaborador",
    "m8-responsavel"
   ],
   "cargo_setor": [
    "m8-cargo",
    "m8-nome_vaga",
    "m8-vaga"
   ]
  },
  "secoes": [
   {
    "titulo": "Identificação",
    "campos": [
     {
      "id": "m8-empresa",
      "tipo": "texto",
      "rotulo": "Empresa",
      "largura": 2
     },
     {
      "id": "m8-vaga",
      "tipo": "texto",
      "rotulo": "Vaga",
      "largura": 2
     },
     {
      "id": "m8-candidato",
      "tipo": "texto",
      "rotulo": "Nome do Candidato",
      "largura": 2
     },
     {
      "id": "m8-data_hora",
      "tipo": "texto",
      "rotulo": "Data / Horário",
      "largura": 2
     },
     {
      "id": "m8-entrevistador",
      "tipo": "texto",
      "rotulo": "Entrevistador(a)",
      "largura": 2
     },
     {
      "id": "m8-formato",
      "tipo": "radio",
      "rotulo": "Formato",
      "opcoes": [
       "Presencial",
       "Online"
      ],
      "largura": 2
     }
    ]
   },
   {
    "titulo": "Bloco 1 · Trajetória Profissional",
    "campos": [
     {
      "id": "m8-b1q1",
      "tipo": "textarea",
      "rotulo": "Me fale sobre você e sua trajetória mais relevante para essa vaga."
     },
     {
      "id": "m8-b1q2",
      "tipo": "textarea",
      "rotulo": "O que mais te orgulha na sua carreira até aqui?"
     }
    ]
   },
   {
    "titulo": "Bloco 2 · Resultados e Metas",
    "campos": [
     {
      "id": "m8-b2q1",
      "tipo": "textarea",
      "rotulo": "Conte uma situação em que você teve que bater uma meta desafiadora."
     },
     {
      "id": "m8-b2q2",
      "tipo": "textarea",
      "rotulo": "Me dê um exemplo de um resultado significativo que você entregou."
     }
    ]
   },
   {
    "titulo": "Bloco 3 · Trabalho em Equipe",
    "campos": [
     {
      "id": "m8-b3q1",
      "tipo": "textarea",
      "rotulo": "Conte uma situação de conflito na equipe. Como você agiu?"
     },
     {
      "id": "m8-b3q2",
      "tipo": "textarea",
      "rotulo": "Como você se relaciona com perfis diferentes dos seus?"
     }
    ]
   },
   {
    "titulo": "Bloco 4 · Resolução de Problemas",
    "campos": [
     {
      "id": "m8-b4q1",
      "tipo": "textarea",
      "rotulo": "Me conte sobre uma decisão difícil com pouca informação. Como procedeu?"
     },
     {
      "id": "m8-b4q2",
      "tipo": "textarea",
      "rotulo": "Descreva um problema complexo que você resolveu de forma criativa."
     }
    ]
   },
   {
    "titulo": "Bloco 5 · Adaptabilidade",
    "campos": [
     {
      "id": "m8-b5q1",
      "tipo": "textarea",
      "rotulo": "Conte sobre uma mudança significativa que você enfrentou. Como se adaptou?"
     },
     {
      "id": "m8-b5q2",
      "tipo": "textarea",
      "rotulo": "Qual foi a última coisa relevante que você aprendeu por iniciativa própria?"
     }
    ]
   },
   {
    "titulo": "Bloco 6 · Alinhamento e Motivação",
    "campos": [
     {
      "id": "m8-b6q1",
      "tipo": "textarea",
      "rotulo": "O que te atrai nessa vaga e nessa empresa?"
     },
     {
      "id": "m8-b6q2",
      "tipo": "textarea",
      "rotulo": "Onde você quer estar profissionalmente daqui a 3 anos?"
     }
    ]
   },
   {
    "titulo": "Avaliação e Decisão",
    "campos": [
     {
      "id": "m8-av1-grade",
      "tipo": "grade",
      "rotulo": "",
      "colunas": [
       "Competência",
       "Nota (1-5)",
       "Observação"
      ],
      "linhas": [
       {
        "rotulo": "Foco em resultados",
        "celulas": [
         {
          "id": "m8-av1-nota",
          "tipo": "texto"
         },
         {
          "id": "m8-av1-obs",
          "tipo": "texto"
         }
        ]
       },
       {
        "rotulo": "Trabalho em equipe",
        "celulas": [
         {
          "id": "m8-av2-nota",
          "tipo": "texto"
         },
         {
          "id": "m8-av2-obs",
          "tipo": "texto"
         }
        ]
       },
       {
        "rotulo": "Comunicação",
        "celulas": [
         {
          "id": "m8-av3-nota",
          "tipo": "texto"
         },
         {
          "id": "m8-av3-obs",
          "tipo": "texto"
         }
        ]
       },
       {
        "rotulo": "Resolução de problemas",
        "celulas": [
         {
          "id": "m8-av4-nota",
          "tipo": "texto"
         },
         {
          "id": "m8-av4-obs",
          "tipo": "texto"
         }
        ]
       },
       {
        "rotulo": "Adaptabilidade",
        "celulas": [
         {
          "id": "m8-av5-nota",
          "tipo": "texto"
         },
         {
          "id": "m8-av5-obs",
          "tipo": "texto"
         }
        ]
       },
       {
        "rotulo": "Alinhamento cultural",
        "celulas": [
         {
          "id": "m8-av6-nota",
          "tipo": "texto"
         },
         {
          "id": "m8-av6-obs",
          "tipo": "texto"
         }
        ]
       }
      ]
     },
     {
      "id": "m8-parecer",
      "tipo": "textarea",
      "rotulo": "Parecer da consultora",
      "linhas": 4
     },
     {
      "id": "m8-proximo",
      "tipo": "radio",
      "rotulo": "Decisão",
      "opcoes": [
       "Avançar para apresentação ao cliente",
       "Em espera",
       "Encerrar participação"
      ]
     }
    ],
    "interno": true
   }
  ]
 },
 {
  "id": "rs_m10",
  "titulo": "Relatório do Candidato",
  "modulo": "Módulo 10",
  "categoria": "recrutamento",
  "icone": "selecao",
  "descricao": "Histórico preenchido pelo candidato · Avaliação pela consultora",
  "mapa": {
   "company": [
    "m10-empresa"
   ],
   "nome": [
    "m10-candidato",
    "m10-colaborador",
    "m10-responsavel"
   ],
   "cargo_setor": [
    "m10-cargo",
    "m10-nome_vaga",
    "m10-vaga"
   ]
  },
  "secoes": [
   {
    "titulo": "Candidato",
    "campos": [
     {
      "id": "m10-candidato",
      "tipo": "texto",
      "rotulo": "Seu nome completo"
     },
     {
      "id": "m10-empresa",
      "tipo": "texto",
      "rotulo": "Empresa",
      "largura": 2
     },
     {
      "id": "m10-vaga",
      "tipo": "texto",
      "rotulo": "Vaga",
      "largura": 2
     },
     {
      "id": "m10-data",
      "tipo": "data",
      "rotulo": "Data do Relatório",
      "largura": 2
     },
     {
      "id": "m10-pretensao",
      "tipo": "texto",
      "rotulo": "Pretensão Salarial",
      "largura": 2
     },
     {
      "id": "m10-disponibilidade",
      "tipo": "texto",
      "rotulo": "Disponibilidade para início"
     }
    ]
   },
   {
    "titulo": "Resumo do Processo",
    "campos": [
     {
      "id": "m10-etapas",
      "tipo": "checkbox",
      "rotulo": "Etapas realizadas",
      "opcoes": [
       "Triagem de currículo",
       "Pré-entrevista",
       "Entrevista por competências",
       "Testes técnicos",
       "Avaliação comportamental"
      ]
     }
    ],
    "interno": true
   },
   {
    "titulo": "Histórico Profissional Relevante",
    "campos": [
     {
      "id": "m10-historico",
      "tipo": "textarea",
      "rotulo": "Resumo da trajetória profissional (últimas experiências mais relevantes)",
      "linhas": 7
     },
     {
      "id": "m10-formacao",
      "tipo": "textarea",
      "rotulo": "Formação acadêmica e cursos relevantes",
      "linhas": 3
     }
    ]
   },
   {
    "titulo": "Avaliação de Competências",
    "campos": [
     {
      "id": "m10-grade",
      "tipo": "grade",
      "rotulo": "",
      "colunas": [
       "Competência",
       "Avaliação",
       "Comentário"
      ],
      "linhas": [
       {
        "rotulo": "Competência Técnica",
        "celulas": [
         {
          "id": "m10-comp1",
          "tipo": "select",
          "opcoes": [
           "Excelente",
           "Muito Bom",
           "Bom",
           "Regular",
           "Insuficiente"
          ]
         },
         {
          "id": "m10-comp1-obs",
          "tipo": "texto"
         }
        ]
       },
       {
        "rotulo": "Comunicação",
        "celulas": [
         {
          "id": "m10-comp2",
          "tipo": "select",
          "opcoes": [
           "Excelente",
           "Muito Bom",
           "Bom",
           "Regular",
           "Insuficiente"
          ]
         },
         {
          "id": "m10-comp2-obs",
          "tipo": "texto"
         }
        ]
       },
       {
        "rotulo": "Liderança / Influência",
        "celulas": [
         {
          "id": "m10-comp3",
          "tipo": "select",
          "opcoes": [
           "Excelente",
           "Muito Bom",
           "Bom",
           "Regular",
           "Insuficiente"
          ]
         },
         {
          "id": "m10-comp3-obs",
          "tipo": "texto"
         }
        ]
       },
       {
        "rotulo": "Foco em resultados",
        "celulas": [
         {
          "id": "m10-comp4",
          "tipo": "select",
          "opcoes": [
           "Excelente",
           "Muito Bom",
           "Bom",
           "Regular",
           "Insuficiente"
          ]
         },
         {
          "id": "m10-comp4-obs",
          "tipo": "texto"
         }
        ]
       },
       {
        "rotulo": "Adaptabilidade",
        "celulas": [
         {
          "id": "m10-comp5",
          "tipo": "select",
          "opcoes": [
           "Excelente",
           "Muito Bom",
           "Bom",
           "Regular",
           "Insuficiente"
          ]
         },
         {
          "id": "m10-comp5-obs",
          "tipo": "texto"
         }
        ]
       },
       {
        "rotulo": "Alinhamento Cultural",
        "celulas": [
         {
          "id": "m10-comp6",
          "tipo": "select",
          "opcoes": [
           "Excelente",
           "Muito Bom",
           "Bom",
           "Regular",
           "Insuficiente"
          ]
         },
         {
          "id": "m10-comp6-obs",
          "tipo": "texto"
         }
        ]
       }
      ]
     }
    ],
    "interno": true
   },
   {
    "titulo": "Parecer da Consultoria",
    "campos": [
     {
      "id": "m10-pontos_fortes",
      "tipo": "textarea",
      "rotulo": "Pontos fortes do candidato",
      "linhas": 3
     },
     {
      "id": "m10-pontos_dev",
      "tipo": "textarea",
      "rotulo": "Pontos de desenvolvimento / atenção",
      "linhas": 3
     },
     {
      "id": "m10-compatibilidade",
      "tipo": "radio",
      "rotulo": "Compatibilidade com a vaga",
      "opcoes": [
       "Alta",
       "Média",
       "Baixa"
      ]
     },
     {
      "id": "m10-recomendacao",
      "tipo": "radio",
      "rotulo": "Recomendação",
      "opcoes": [
       "Recomendamos fortemente",
       "Recomendamos com ressalvas",
       "Não recomendamos"
      ]
     },
     {
      "id": "m10-parecer",
      "tipo": "textarea",
      "rotulo": "Parecer completo",
      "linhas": 5
     }
    ],
    "interno": true
   }
  ]
 },
 {
  "id": "rs_m11",
  "titulo": "Apresentação dos Finalistas ao Cliente",
  "modulo": "Módulo 11",
  "categoria": "recrutamento",
  "icone": "selecao",
  "descricao": "Comparativo e decisão final entre os candidatos aprovados",
  "mapa": {
   "company": [
    "m11-empresa"
   ],
   "nome": [
    "m11-candidato",
    "m11-colaborador",
    "m11-responsavel"
   ],
   "cargo_setor": [
    "m11-cargo",
    "m11-nome_vaga",
    "m11-vaga"
   ]
  },
  "secoes": [
   {
    "titulo": "Identificação",
    "campos": [
     {
      "id": "m11-empresa",
      "tipo": "texto",
      "rotulo": "Empresa",
      "largura": 2
     },
     {
      "id": "m11-vaga",
      "tipo": "texto",
      "rotulo": "Vaga",
      "largura": 2
     },
     {
      "id": "m11-data",
      "tipo": "data",
      "rotulo": "Data da apresentação",
      "largura": 2
     },
     {
      "id": "m11-participantes",
      "tipo": "texto",
      "rotulo": "Participantes (empresa)",
      "largura": 2
     }
    ],
    "interno": true
   },
   {
    "titulo": "Finalistas",
    "campos": [
     {
      "id": "m11-f1-nome",
      "tipo": "texto",
      "rotulo": "Finalista 1 — Nome",
      "largura": 3
     },
     {
      "id": "m11-f2-nome",
      "tipo": "texto",
      "rotulo": "Finalista 2 — Nome",
      "largura": 3
     },
     {
      "id": "m11-f3-nome",
      "tipo": "texto",
      "rotulo": "Finalista 3 — Nome",
      "largura": 3
     },
     {
      "id": "m11-f1-pretensao",
      "tipo": "texto",
      "rotulo": "Pretensão F1",
      "largura": 3
     },
     {
      "id": "m11-f2-pretensao",
      "tipo": "texto",
      "rotulo": "Pretensão F2",
      "largura": 3
     },
     {
      "id": "m11-f3-pretensao",
      "tipo": "texto",
      "rotulo": "Pretensão F3",
      "largura": 3
     }
    ],
    "interno": true
   },
   {
    "titulo": "Quadro Comparativo",
    "campos": [
     {
      "id": "m11-c1-grade",
      "tipo": "grade",
      "rotulo": "",
      "colunas": [
       "Critério",
       "F1",
       "F2",
       "F3"
      ],
      "linhas": [
       {
        "rotulo": "Competência Técnica",
        "celulas": [
         {
          "id": "m11-c1-f1",
          "tipo": "select",
          "opcoes": [
           "Excelente",
           "MB",
           "Bom",
           "Regular"
          ]
         },
         {
          "id": "m11-c1-f2",
          "tipo": "select",
          "opcoes": [
           "Excelente",
           "MB",
           "Bom",
           "Regular"
          ]
         },
         {
          "id": "m11-c1-f3",
          "tipo": "select",
          "opcoes": [
           "Excelente",
           "MB",
           "Bom",
           "Regular"
          ]
         }
        ]
       },
       {
        "rotulo": "Comunicação",
        "celulas": [
         {
          "id": "m11-c2-f1",
          "tipo": "select",
          "opcoes": [
           "Excelente",
           "MB",
           "Bom",
           "Regular"
          ]
         },
         {
          "id": "m11-c2-f2",
          "tipo": "select",
          "opcoes": [
           "Excelente",
           "MB",
           "Bom",
           "Regular"
          ]
         },
         {
          "id": "m11-c2-f3",
          "tipo": "select",
          "opcoes": [
           "Excelente",
           "MB",
           "Bom",
           "Regular"
          ]
         }
        ]
       },
       {
        "rotulo": "Foco em resultados",
        "celulas": [
         {
          "id": "m11-c3-f1",
          "tipo": "select",
          "opcoes": [
           "Excelente",
           "MB",
           "Bom",
           "Regular"
          ]
         },
         {
          "id": "m11-c3-f2",
          "tipo": "select",
          "opcoes": [
           "Excelente",
           "MB",
           "Bom",
           "Regular"
          ]
         },
         {
          "id": "m11-c3-f3",
          "tipo": "select",
          "opcoes": [
           "Excelente",
           "MB",
           "Bom",
           "Regular"
          ]
         }
        ]
       },
       {
        "rotulo": "Alinhamento Cultural",
        "celulas": [
         {
          "id": "m11-c4-f1",
          "tipo": "select",
          "opcoes": [
           "Excelente",
           "MB",
           "Bom",
           "Regular"
          ]
         },
         {
          "id": "m11-c4-f2",
          "tipo": "select",
          "opcoes": [
           "Excelente",
           "MB",
           "Bom",
           "Regular"
          ]
         },
         {
          "id": "m11-c4-f3",
          "tipo": "select",
          "opcoes": [
           "Excelente",
           "MB",
           "Bom",
           "Regular"
          ]
         }
        ]
       }
      ]
     }
    ],
    "interno": true
   },
   {
    "titulo": "Resumo e Decisão",
    "campos": [
     {
      "id": "m11-f1-resumo",
      "tipo": "textarea",
      "rotulo": "Resumo Finalista 1"
     },
     {
      "id": "m11-f2-resumo",
      "tipo": "textarea",
      "rotulo": "Resumo Finalista 2"
     },
     {
      "id": "m11-f3-resumo",
      "tipo": "textarea",
      "rotulo": "Resumo Finalista 3"
     },
     {
      "id": "m11-decisao",
      "tipo": "textarea",
      "rotulo": "Decisão da empresa"
     },
     {
      "id": "m11-plano_acao",
      "tipo": "textarea",
      "rotulo": "Plano de ação pós-decisão"
     }
    ],
    "interno": true
   }
  ],
  "interno": true
 },
 {
  "id": "rs_m12",
  "titulo": "Contratação e Formalização",
  "modulo": "Módulo 12",
  "categoria": "recrutamento",
  "icone": "selecao",
  "descricao": "Checklist de admissão e formalização do candidato aprovado",
  "mapa": {
   "company": [
    "m12-empresa"
   ],
   "nome": [
    "m12-candidato",
    "m12-colaborador",
    "m12-responsavel"
   ],
   "cargo_setor": [
    "m12-cargo",
    "m12-nome_vaga",
    "m12-vaga"
   ]
  },
  "secoes": [
   {
    "titulo": "Identificação",
    "campos": [
     {
      "id": "m12-empresa",
      "tipo": "texto",
      "rotulo": "Empresa",
      "largura": 2
     },
     {
      "id": "m12-vaga",
      "tipo": "texto",
      "rotulo": "Vaga",
      "largura": 2
     },
     {
      "id": "m12-candidato",
      "tipo": "texto",
      "rotulo": "Candidato aprovado",
      "largura": 2
     },
     {
      "id": "m12-data_inicio",
      "tipo": "data",
      "rotulo": "Data de início",
      "largura": 2
     },
     {
      "id": "m12-resp_rh",
      "tipo": "texto",
      "rotulo": "Responsável RH",
      "largura": 2
     },
     {
      "id": "m12-gestor",
      "tipo": "texto",
      "rotulo": "Gestor direto",
      "largura": 2
     }
    ],
    "interno": true
   },
   {
    "titulo": "Aprovação e Proposta",
    "campos": [
     {
      "id": "m12-aprovacao",
      "tipo": "checkbox",
      "rotulo": "",
      "opcoes": [
       "Candidato confirmou aceite",
       "Salário negociado e aprovado",
       "Proposta enviada",
       "Proposta assinada recebida",
       "Data de início confirmada"
      ]
     },
     {
      "id": "m12-salario",
      "tipo": "texto",
      "rotulo": "Salário acordado"
     },
     {
      "id": "m12-beneficios",
      "tipo": "textarea",
      "rotulo": "Benefícios acordados",
      "linhas": 3
     }
    ],
    "interno": true
   },
   {
    "titulo": "Documentação Admissional",
    "campos": [
     {
      "id": "m12-docs",
      "tipo": "checkbox",
      "rotulo": "",
      "opcoes": [
       "RG / CNH",
       "CPF",
       "CTPS",
       "PIS/PASEP",
       "Comprovante de residência",
       "Comprovante de escolaridade",
       "Foto 3x4",
       "Certidão de nascimento/casamento",
       "Comprovante de conta bancária"
      ]
     },
     {
      "id": "m12-pendencias_docs",
      "tipo": "texto",
      "rotulo": "Pendências"
     }
    ],
    "interno": true
   },
   {
    "titulo": "Exame e Integração",
    "campos": [
     {
      "id": "m12-exame",
      "tipo": "checkbox",
      "rotulo": "",
      "opcoes": [
       "Agendado",
       "Realizado",
       "Apto"
      ]
     },
     {
      "id": "m12-integracao",
      "tipo": "checkbox",
      "rotulo": "Integração planejada",
      "opcoes": [
       "Kit boas-vindas",
       "Apresentação à equipe",
       "Treinamentos iniciais",
       "Onboarding digital",
       "Buddy / padrinho"
      ]
     },
     {
      "id": "m12-confirmacao",
      "tipo": "textarea",
      "rotulo": "Observações finais",
      "linhas": 3
     }
    ],
    "interno": true
   }
  ],
  "interno": true
 },
 {
  "id": "rs_m13",
  "titulo": "Integração e Acompanhamento (Onboarding)",
  "modulo": "Módulo 13",
  "categoria": "recrutamento",
  "icone": "selecao",
  "descricao": "Monitoramento da adaptação do novo colaborador",
  "mapa": {
   "company": [
    "m13-empresa"
   ],
   "nome": [
    "m13-candidato",
    "m13-colaborador",
    "m13-responsavel"
   ],
   "cargo_setor": [
    "m13-cargo",
    "m13-nome_vaga",
    "m13-vaga"
   ]
  },
  "secoes": [
   {
    "titulo": "Identificação",
    "campos": [
     {
      "id": "m13-colaborador",
      "tipo": "texto",
      "rotulo": "Colaborador",
      "largura": 2
     },
     {
      "id": "m13-cargo",
      "tipo": "texto",
      "rotulo": "Cargo",
      "largura": 2
     },
     {
      "id": "m13-empresa",
      "tipo": "texto",
      "rotulo": "Empresa",
      "largura": 2
     },
     {
      "id": "m13-gestor",
      "tipo": "texto",
      "rotulo": "Gestor direto",
      "largura": 2
     },
     {
      "id": "m13-data_inicio",
      "tipo": "data",
      "rotulo": "Data de início",
      "largura": 2
     },
     {
      "id": "m13-data_acompanhamento",
      "tipo": "data",
      "rotulo": "Data deste acompanhamento",
      "largura": 2
     },
     {
      "id": "m13-semana",
      "tipo": "radio",
      "rotulo": "Período",
      "opcoes": [
       "1ª semana",
       "30 dias",
       "60 dias",
       "90 dias"
      ]
     }
    ]
   },
   {
    "titulo": "Checklist — Primeiro Dia",
    "campos": [
     {
      "id": "m13-dia1",
      "tipo": "checkbox",
      "rotulo": "",
      "opcoes": [
       "Boas-vindas pela equipe",
       "Local preparado",
       "Acessos liberados",
       "Processos e normas apresentados",
       "Equipe apresentada",
       "Tour pelas instalações"
      ]
     }
    ]
   },
   {
    "titulo": "Acompanhamento com o Colaborador",
    "campos": [
     {
      "id": "m13-cq1",
      "tipo": "textarea",
      "rotulo": "1. Como você está se sentindo nessa primeira fase na empresa?",
      "linhas": 2
     },
     {
      "id": "m13-cq2",
      "tipo": "textarea",
      "rotulo": "2. As expectativas que você tinha sobre a vaga estão sendo atendidas?",
      "linhas": 2
     },
     {
      "id": "m13-cq3",
      "tipo": "textarea",
      "rotulo": "3. Você está com clareza sobre suas responsabilidades e prioridades?",
      "linhas": 2
     },
     {
      "id": "m13-cq4",
      "tipo": "textarea",
      "rotulo": "4. Como está sendo sua relação com a equipe e o gestor?",
      "linhas": 2
     },
     {
      "id": "m13-cq5",
      "tipo": "textarea",
      "rotulo": "5. Há algo que está dificultando sua adaptação ou trabalho?",
      "linhas": 2
     },
     {
      "id": "m13-cq6",
      "tipo": "textarea",
      "rotulo": "6. O que você precisa para melhorar seu desempenho nesse início?",
      "linhas": 2
     }
    ]
   },
   {
    "titulo": "Acompanhamento com o Gestor",
    "campos": [
     {
      "id": "m13-gq1",
      "tipo": "textarea",
      "rotulo": "1. Como você avalia a adaptação do colaborador até agora?",
      "linhas": 2
     },
     {
      "id": "m13-gq2",
      "tipo": "textarea",
      "rotulo": "2. O colaborador está entregando o que era esperado para esse período?",
      "linhas": 2
     },
     {
      "id": "m13-gq3",
      "tipo": "textarea",
      "rotulo": "3. Como está sendo sua relação com o colaborador e a equipe?",
      "linhas": 2
     },
     {
      "id": "m13-gq4",
      "tipo": "textarea",
      "rotulo": "4. Há algum ponto de desenvolvimento que precisa de atenção já?",
      "linhas": 2
     },
     {
      "id": "m13-gq5",
      "tipo": "textarea",
      "rotulo": "5. A contratação está atendendo às expectativas da área?",
      "linhas": 2
     }
    ]
   },
   {
    "titulo": "Avaliação de Adaptação e Próximos Passos",
    "campos": [
     {
      "id": "m13-adaptacao",
      "tipo": "radio",
      "rotulo": "Avaliação geral da adaptação",
      "opcoes": [
       "Ótima",
       "Boa",
       "Regular — requer atenção",
       "Crítica"
      ]
     },
     {
      "id": "m13-plano_acao",
      "tipo": "textarea",
      "rotulo": "Plano de ação",
      "linhas": 4
     },
     {
      "id": "m13-proximo_acomp",
      "tipo": "data",
      "rotulo": "Data do próximo acompanhamento"
     },
     {
      "id": "m13-obs",
      "tipo": "textarea",
      "rotulo": "Observações adicionais",
      "linhas": 3
     }
    ],
    "interno": true
   }
  ]
 }
]);
