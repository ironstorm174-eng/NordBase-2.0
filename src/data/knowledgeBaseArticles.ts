export interface KBArticle {
  id: string;
  slug: string;
  category: 'customer' | 'pricing' | 'how-it-works' | 'services';
  categoryLabel: { en: string; pt: string };
  title: { en: string; pt: string };
  summary: { en: string; pt: string };
  readingTime: string;
  dateUpdated: string;
  contentSections: {
    title: { en: string; pt: string };
    body: { en: string; pt: string };
  }[];
  faqList: {
    question: { en: string; pt: string };
    answer: { en: string; pt: string };
  }[];
  keywords: string[];
  relatedServiceSlugs?: string[];
}

export const KNOWLEDGE_BASE_ARTICLES: KBArticle[] = [
  {
    id: 'kb_price_change_after_visit',
    slug: 'can-final-price-change-after-specialist-visits',
    category: 'pricing',
    categoryLabel: {
      en: 'Pricing & Estimates',
      pt: 'Preços e Estimativas'
    },
    title: {
      en: 'Can the final price change after the specialist visits?',
      pt: 'O preço final pode mudar após a visita do especialista?'
    },
    summary: {
      en: 'Yes. Initial online or phone estimates are preliminary guidance. The Specialist assesses exact on-site conditions and provides a final price before work begins.',
      pt: 'Sim. As estimativas iniciais por telefone ou online são preliminares. O especialista avalia o local e apresenta o preço final antes de iniciar o trabalho.'
    },
    readingTime: '2 min read',
    dateUpdated: '2026-08-14',
    contentSections: [
      {
        title: {
          en: 'Preliminary Estimate vs On-Site Assessment',
          pt: 'Estimativa Preliminar vs Avaliação no Local'
        },
        body: {
          en: 'When you describe your problem online or over the phone, NordBase provides an initial preliminary estimate based on typical jobs. However, actual on-site conditions—such as hidden pipe corrosion, electrical wiring access, or specific replacement parts—can only be verified upon physical inspection.',
          pt: 'Ao descrever o problema online ou por telefone, a NordBase fornece uma estimativa preliminar com base em trabalhos típicos. No entanto, as condições reais no local—como corrosão oculta, acesso ao quadro elétrico ou peças específicas—só podem ser verificadas após inspeção física.'
        }
      },
      {
        title: {
          en: 'Your Approval Is Required Before Work Begins',
          pt: 'A Sua Aprovação É Obrigatória Antes do Início'
        },
        body: {
          en: 'If the Specialist determines after inspection that the work requires additional scope or different materials, they will present a revised final price. No work will ever begin until you explicitly review and approve this final price.',
          pt: 'Se o Especialista determinar após a inspeção que o trabalho exige verificações adicionais ou peças diferentes, apresentará um preço final revisto. Nenhum trabalho é iniciado sem a sua aprovação prévia e explícita.'
        }
      }
    ],
    faqList: [
      {
        question: {
          en: 'Must I accept the revised price on site?',
          pt: 'Sou obrigado a aceitar o preço revisto no local?'
        },
        answer: {
          en: 'No. You have complete freedom to decline the revised quote. If you choose not to proceed, you pay only the standard €20 call-out fee for the Specialist’s travel and on-site evaluation time.',
          pt: 'Não. Tem total liberdade para recusar o orçamento revisto. Se optar por não prosseguir, paga apenas a taxa padrão de deslocação de 20€ referente ao tempo de viagem e diagnóstico.'
        }
      }
    ],
    keywords: ['final price change', 'specialist visit estimate', 'nordbase pricing rule'],
    relatedServiceSlugs: ['plumbing', 'electrical', 'handyman', 'repairs']
  },
  {
    id: 'kb_why_price_different_estimate',
    slug: 'why-price-different-from-initial-estimate',
    category: 'pricing',
    categoryLabel: {
      en: 'Pricing & Estimates',
      pt: 'Preços e Estimativas'
    },
    title: {
      en: 'Why can the price be different from the initial estimate?',
      pt: 'Por que razão o preço pode ser diferente da estimativa inicial?'
    },
    summary: {
      en: 'Initial estimates are based on the description provided. Hidden damage, required materials, or extra access work revealed during physical inspection can modify the scope.',
      pt: 'As estimativas iniciais baseiam-se na descrição dada. Danos ocultos, materiais necessários ou dificuldades de acesso revelados no local alteram o âmbito.'
    },
    readingTime: '2 min read',
    dateUpdated: '2026-08-14',
    contentSections: [
      {
        title: {
          en: 'Factors Influencing On-Site Scope',
          pt: 'Fatores que Influenciam o Âmbito no Local'
        },
        body: {
          en: 'A preliminary description (e.g. "leaking tap") might hide underlying issues like rusted pipe joints, damaged wall tile backing, or non-standard fittings requiring specialized local supplier parts. The Specialist carefully checks these factors on-site.',
          pt: 'Uma descrição preliminar (ex: "torneira a pingar") pode esconder problemas subjacentes como tubos corroídos, azulejos danificados ou conexões não padrão que exigem peças específicas de fornecedores locais.'
        }
      }
    ],
    faqList: [],
    keywords: ['estimate vs quote', 'why price changes', 'nordbase inspection'],
    relatedServiceSlugs: ['plumbing', 'electrical', 'repairs']
  },
  {
    id: 'kb_decline_final_price',
    slug: 'what-happens-if-i-do-not-accept-final-price',
    category: 'pricing',
    categoryLabel: {
      en: 'Pricing & Estimates',
      pt: 'Preços e Estimativas'
    },
    title: {
      en: 'What happens if I do not accept the final price?',
      pt: 'O que acontece se eu não aceitar o preço final?'
    },
    summary: {
      en: 'If you do not approve the Specialist’s final price proposal, no repair work is performed and you only cover the standard €20 call-out fee.',
      pt: 'Se não aprovar a proposta de preço final do especialista, nenhum trabalho é realizado e apenas paga a taxa de deslocação de 20€.'
    },
    readingTime: '2 min read',
    dateUpdated: '2026-08-14',
    contentSections: [
      {
        title: {
          en: 'Zero Obligation to Proceed',
          pt: 'Zero Obrigação de Continuar'
        },
        body: {
          en: 'NordBase gives Customers full control over their decision. If the final price exceeds your budget or expectations, simply inform the Specialist. You are under no obligation to proceed with the work.',
          pt: 'A NordBase garante aos clientes total controlo na decisão. Se o preço final exceder o seu orçamento ou expectativas, basta informar o Especialista. Não tem qualquer obrigação de aceitar a realização da obra.'
        }
      }
    ],
    faqList: [],
    keywords: ['decline final price', 'cancel repair', '20 euro callout'],
    relatedServiceSlugs: ['plumbing', 'electrical', 'handyman', 'cleaning', 'gardening', 'moving', 'pools', 'repairs']
  },
  {
    id: 'kb_who_pays_visit',
    slug: 'who-pays-for-the-specialist-visit',
    category: 'pricing',
    categoryLabel: {
      en: 'Pricing & Estimates',
      pt: 'Preços e Estimativas'
    },
    title: {
      en: 'Who pays for the specialist’s visit?',
      pt: 'Quem paga a deslocação e visita do especialista?'
    },
    summary: {
      en: 'The Customer covers the standard €20 call-out fee for the Specialist’s travel and diagnostic visit. If the job proceeds, this call-out fee is included within the agreed final price.',
      pt: 'O cliente cobre a taxa padrão de deslocação de 20€ referente à viagem e diagnóstico do especialista. Se a obra avançar, este valor fica incluído no preço final acordado.'
    },
    readingTime: '2 min read',
    dateUpdated: '2026-08-14',
    contentSections: [
      {
        title: {
          en: 'Understanding the Call-Out Standard',
          pt: 'Compreender a Taxa de Deslocação'
        },
        body: {
          en: 'Specialists invest time and vehicle fuel to inspect your property in Portimão or surrounding areas. The €20 call-out fee compensates their physical travel and professional evaluation time.',
          pt: 'Os especialistas investem tempo e combustível para inspecionar a sua propriedade em Portimão e áreas circundantes. A taxa de 20€ compensa a viagem e o diagnóstico profissional.'
        }
      }
    ],
    faqList: [],
    keywords: ['who pays visit', 'callout fee', 'specialist travel cost'],
    relatedServiceSlugs: ['plumbing', 'electrical', 'handyman']
  },
  {
    id: 'kb_what_is_callout_fee',
    slug: 'what-is-the-20-euro-call-out-fee',
    category: 'pricing',
    categoryLabel: {
      en: 'Pricing & Estimates',
      pt: 'Preços e Estimativas'
    },
    title: {
      en: 'What is the €20 call-out fee?',
      pt: 'O que é a taxa de deslocação de 20€?'
    },
    summary: {
      en: 'The €20 call-out fee is the fixed charge covering the Specialist’s physical travel to your property and on-site job evaluation.',
      pt: 'A taxa de deslocação de 20€ é o valor fixo que cobre a deslocação física do especialista à sua propriedade e a avaliação do trabalho no local.'
    },
    readingTime: '2 min read',
    dateUpdated: '2026-08-14',
    contentSections: [
      {
        title: {
          en: 'Fair Compensation for On-Site Inspection',
          pt: 'Compensação Justa pela Inspeção'
        },
        body: {
          en: 'The €20 call-out fee ensures that independent local technicians are fairly compensated for arriving at your address, assessing the problem, and detailing the exact scope required for the fix.',
          pt: 'A taxa de 20€ garante que os técnicos locais independentes são remunerados de forma justa por se deslocarem à sua morada, avaliarem o problema e explicarem o trabalho necessário.'
        }
      }
    ],
    faqList: [],
    keywords: ['20 euro call-out fee', 'taxa de deslocacao', 'nordbase callout rule'],
    relatedServiceSlugs: ['plumbing', 'electrical', 'handyman', 'cleaning', 'gardening', 'moving', 'pools', 'repairs']
  },
  {
    id: 'kb_when_callout_charged',
    slug: 'when-is-the-20-euro-call-out-fee-charged',
    category: 'pricing',
    categoryLabel: {
      en: 'Pricing & Estimates',
      pt: 'Preços e Estimativas'
    },
    title: {
      en: 'When is the €20 call-out fee charged?',
      pt: 'Quando é cobrada a taxa de deslocação de 20€?'
    },
    summary: {
      en: 'The €20 call-out fee applies upon the Specialist’s arrival at your property to perform the on-site evaluation.',
      pt: 'A taxa de deslocação de 20€ é devida após a chegada do especialista à propriedade para efetuar o diagnóstico no local.'
    },
    readingTime: '2 min read',
    dateUpdated: '2026-08-14',
    contentSections: [
      {
        title: {
          en: 'No Charge for Online Request Submission',
          pt: 'Sem Custo na Submissão Online do Pedido'
        },
        body: {
          en: 'Submitting a service request on NordBase is completely free. The €20 call-out fee is only payable on-site when the Specialist arrives at your location to inspect the job.',
          pt: 'Submeter um pedido de serviço na NordBase é 100% gratuito. A taxa de 20€ só se aplica no local quando o especialista chega à sua morada para inspecionar o trabalho.'
        }
      }
    ],
    faqList: [],
    keywords: ['when callout charged', 'payment timing', 'free online request'],
    relatedServiceSlugs: ['plumbing', 'electrical', 'handyman']
  },
  {
    id: 'kb_callout_included_if_job_proceeds',
    slug: 'is-call-out-fee-charged-if-job-goes-ahead',
    category: 'pricing',
    categoryLabel: {
      en: 'Pricing & Estimates',
      pt: 'Preços e Estimativas'
    },
    title: {
      en: 'Is the €20 call-out fee charged if the job goes ahead?',
      pt: 'A taxa de 20€ é cobrada se o trabalho for realizado?'
    },
    summary: {
      en: 'When you approve the final price and the job proceeds, the €20 call-out fee is included as part of the total agreed price rather than an extra fee.',
      pt: 'Quando aprova o preço final e o trabalho avança, os 20€ de deslocação ficam integrados no valor total acordado, não constituindo um custo extra.'
    },
    readingTime: '2 min read',
    dateUpdated: '2026-08-14',
    contentSections: [
      {
        title: {
          en: 'Integrated Pricing Structure',
          pt: 'Estrutura de Preço Integrada'
        },
        body: {
          en: 'For approved jobs, the €20 call-out fee forms part of the agreed contract total. For instance, if the total agreed price for a repair is €80, you pay €80 in total, which includes the inspection.',
          pt: 'Em trabalhos aprovados, a taxa de 20€ faz parte do total acordado. Por exemplo, se o preço total combinado para a reparação for 80€, paga 80€ no total, valor que já inclui a visita.'
        }
      }
    ],
    faqList: [],
    keywords: ['callout fee included', 'total job price', 'no double charge'],
    relatedServiceSlugs: ['plumbing', 'electrical', 'handyman', 'repairs']
  },
  {
    id: 'kb_insufficient_funds_for_estimated_work',
    slug: 'what-happens-if-i-do-not-have-enough-money-for-estimated-work',
    category: 'pricing',
    categoryLabel: {
      en: 'Pricing & Estimates',
      pt: 'Preços e Estimativas'
    },
    title: {
      en: 'What happens if I do not have enough money for the estimated work?',
      pt: 'O que acontece se eu não tiver orçamento suficiente para o trabalho estimado?'
    },
    summary: {
      en: 'You can discuss reducing the scope of work with the Specialist or decline the full repair, paying only the €20 call-out fee.',
      pt: 'Pode combinar com o especialista a redução do âmbito dos trabalhos ou recusar a obra completa, pagando apenas a taxa de deslocação de 20€.'
    },
    readingTime: '2 min read',
    dateUpdated: '2026-08-14',
    contentSections: [
      {
        title: {
          en: 'Options for Adjusting Scope or Budget',
          pt: 'Opções para Ajustar o Âmbito ou Orçamento'
        },
        body: {
          en: 'If the total repair cost exceeds your available budget, you have two options: ask the Specialist if essential emergency containment can be performed as a smaller first step, or decline the full job and pay only the €20 call-out fee.',
          pt: 'Se o custo total exceder o seu orçamento, tem duas opções: perguntar ao especialista se pode realizar apenas uma intervenção prioritária de contenção, ou recusar o serviço completo e pagar apenas a taxa de 20€.'
        }
      }
    ],
    faqList: [],
    keywords: ['budget limit repair', 'adjust job scope', 'decline quote'],
    relatedServiceSlugs: ['plumbing', 'electrical', 'handyman', 'repairs']
  },
  {
    id: 'kb_smaller_job_scope',
    slug: 'can-specialist-complete-smaller-job-than-estimated',
    category: 'services',
    categoryLabel: {
      en: 'Services & Scope',
      pt: 'Serviços e Âmbito'
    },
    title: {
      en: 'Can the specialist complete a smaller job than originally estimated?',
      pt: 'O especialista pode fazer um trabalho menor do que o estimado originalmente?'
    },
    summary: {
      en: 'Yes. Upon mutual agreement on-site, the Specialist can adjust the job scope to focus only on critical immediate needs.',
      pt: 'Sim. Por acordo mútuo no local, o especialista pode ajustar o âmbito do trabalho para se focar apenas nas necessidades imediatas.'
    },
    readingTime: '2 min read',
    dateUpdated: '2026-08-14',
    contentSections: [
      {
        title: {
          en: 'Flexible On-Site Adjustments',
          pt: 'Ajustes Flexíveis no Local'
        },
        body: {
          en: 'If you originally requested full bathroom fixture replacement but choose on-site to fix only the leaking main valve, the Specialist can recalculate a revised final price for just the smaller scope.',
          pt: 'Se inicialmente pediu a substituição de várias peças de casa de banho mas no local preferir reparar apenas a válvula com fuga, o especialista recalcula o preço para essa intervenção mais reduzida.'
        }
      }
    ],
    faqList: [],
    keywords: ['smaller job scope', 'partial repair', 'custom scope'],
    relatedServiceSlugs: ['plumbing', 'electrical', 'handyman']
  },
  {
    id: 'kb_approve_before_start',
    slug: 'do-i-have-to-approve-final-price-before-work-starts',
    category: 'pricing',
    categoryLabel: {
      en: 'Pricing & Estimates',
      pt: 'Preços e Estimativas'
    },
    title: {
      en: 'Do I have to approve the final price before work starts?',
      pt: 'Tenho de aprovar o preço final antes do início do trabalho?'
    },
    summary: {
      en: 'Yes, absolutely. NordBase policy strictly requires Customer approval of the final price before any physical repair or maintenance begins.',
      pt: 'Sim, absolutamente. A política da NordBase exige obrigatoriamente a aprovação do cliente sobre o preço final antes de qualquer trabalho.'
    },
    readingTime: '2 min read',
    dateUpdated: '2026-08-14',
    contentSections: [
      {
        title: {
          en: 'Strict Pre-Approval Rule',
          pt: 'Regra Estrita de Pré-Aprovação'
        },
        body: {
          en: 'Specialists are strictly instructed never to start work or dismantle property fittings without your prior explicit agreement on the final price. This ensures 100% price transparency and zero surprises.',
          pt: 'Os especialistas estão instruídos a nunca iniciar trabalhos sem o seu acordo prévio sobre o preço final. Isto garante 100% de transparência e evita surpresas.'
        }
      }
    ],
    faqList: [],
    keywords: ['approve before work', 'price approval rule', 'no surprise fees'],
    relatedServiceSlugs: ['plumbing', 'electrical', 'handyman', 'cleaning', 'gardening', 'moving', 'pools', 'repairs']
  },
  {
    id: 'kb_after_describe_problem',
    slug: 'what-happens-after-i-describe-my-problem',
    category: 'how-it-works',
    categoryLabel: {
      en: 'How NordBase Works',
      pt: 'Como Funciona'
    },
    title: {
      en: 'What happens after I describe my problem?',
      pt: 'O que acontece depois de descrever o meu problema?'
    },
    summary: {
      en: 'Your request is routed to local coordination in Portimão, matching you with an available qualified independent Specialist.',
      pt: 'O seu pedido é encaminhado para a coordenação local em Portimão, que o liga a um especialista local qualificado e disponível.'
    },
    readingTime: '2 min read',
    dateUpdated: '2026-08-14',
    contentSections: [
      {
        title: {
          en: 'Local Service Coordination Flow',
          pt: 'Fluxo de Coordenação Local de Serviço'
        },
        body: {
          en: 'Once submitted, our local coordination reviews your job requirements and contacts a verified local Specialist in Portimão. You receive prompt confirmation and the Specialist contacts you to confirm the visit time.',
          pt: 'Após o envio, a nossa coordenação local analisa o pedido e liga-o a um especialista verificado em Portimão. Recebe confirmação rápida e o especialista entra em contacto para combinar a visita.'
        }
      }
    ],
    faqList: [],
    keywords: ['after request submitted', 'nordbase dispatch flow', 'local specialist contact'],
    relatedServiceSlugs: ['plumbing', 'electrical', 'handyman', 'cleaning', 'gardening', 'moving', 'pools', 'repairs']
  },
  {
    id: 'kb_how_find_specialist',
    slug: 'how-does-nordbase-find-a-local-specialist',
    category: 'how-it-works',
    categoryLabel: {
      en: 'How NordBase Works',
      pt: 'Como Funciona'
    },
    title: {
      en: 'How does NordBase find a local specialist?',
      pt: 'Como é que o NordBase encontra um especialista local?'
    },
    summary: {
      en: 'NordBase uses local territory coordination in Portugal to match your job category and location with verified independent contractors.',
      pt: 'A NordBase utiliza coordenação territorial local em Portugal para cruzar a categoria do pedido e a localização com profissionais independentes verificados.'
    },
    readingTime: '2 min read',
    dateUpdated: '2026-08-14',
    contentSections: [
      {
        title: {
          en: 'Verified Local Contractor Network',
          pt: 'Rede de Profissionais Locais Verificados'
        },
        body: {
          en: 'Our local dispatch team maintains contacts with qualified independent plumbers, electricians, handymen, and technicians operating in Portimão and Western Algarve. We connect you directly with a specialist suited to your specific problem.',
          pt: 'A nossa equipa de coordenação local mantém contacto com canalizadores, eletricistas e técnicos qualificados em Portimão e Barlavento. Ligamo-lo diretamente a um profissional adequado ao seu problema.'
        }
      }
    ],
    faqList: [],
    keywords: ['find local specialist', 'verified contractor portugal', 'portimao plumber network'],
    relatedServiceSlugs: ['plumbing', 'electrical', 'handyman', 'repairs']
  },
  {
    id: 'kb_can_refuse_specialist',
    slug: 'can-i-refuse-a-specialist',
    category: 'customer',
    categoryLabel: {
      en: 'Customer Expectations',
      pt: 'Apoio ao Cliente'
    },
    title: {
      en: 'Can I refuse a specialist?',
      pt: 'Posso recusar um especialista?'
    },
    summary: {
      en: 'Yes. You have full right to decline a Specialist or request a different contractor if you feel uncomfortable or disagree with their approach.',
      pt: 'Sim. Tem o direito de recusar um especialista ou solicitar outro profissional caso não se sinta confortável ou discorde da abordagem.'
    },
    readingTime: '2 min read',
    dateUpdated: '2026-08-14',
    contentSections: [
      {
        title: {
          en: 'Customer Comfort and Choice',
          pt: 'Conforto e Escolha do Cliente'
        },
        body: {
          en: 'Customer safety and peace of mind are paramount. If for any reason you choose not to work with a assigned Specialist prior to on-site work starting, notify our local coordination to request an alternative arrangement.',
          pt: 'A segurança e tranquilidade do cliente são prioritárias. Se por qualquer motivo não desejar trabalhar com o especialista atribuído antes do início da obra, informe a nossa coordenação local.'
        }
      }
    ],
    faqList: [],
    keywords: ['refuse specialist', 'change contractor', 'customer rights'],
    relatedServiceSlugs: ['plumbing', 'electrical', 'handyman', 'cleaning']
  },
  {
    id: 'kb_specialist_cannot_solve',
    slug: 'what-happens-if-the-specialist-cannot-solve-the-problem',
    category: 'customer',
    categoryLabel: {
      en: 'Customer Expectations',
      pt: 'Apoio ao Cliente'
    },
    title: {
      en: 'What happens if the specialist cannot solve the problem?',
      pt: 'O que acontece se o especialista não conseguir resolver o problema?'
    },
    summary: {
      en: 'If a Specialist cannot diagnose or resolve the issue, you are not charged for repair work. Local coordination can reassign a senior master specialist.',
      pt: 'Se o especialista não conseguir diagnosticar ou resolver o problema, não lhe é cobrada a reparação. A coordenação local pode reatribuir um técnico sénior.'
    },
    readingTime: '2 min read',
    dateUpdated: '2026-08-14',
    contentSections: [
      {
        title: {
          en: 'Fair Outcome Policy',
          pt: 'Política de Resolução Justa'
        },
        body: {
          en: 'If a complex technical issue cannot be resolved due to specialist limitations, NordBase local coordination steps in to reassign a specialized master contractor without additional penalty.',
          pt: 'Se um problema técnico complexo não puder ser resolvido por limitações do técnico, a coordenação local intervém para reatribuir um especialista sénior.'
        }
      }
    ],
    faqList: [],
    keywords: ['unresolved problem', 'specialist cannot fix', 'master contractor reassign'],
    relatedServiceSlugs: ['plumbing', 'electrical', 'repairs']
  },
  {
    id: 'kb_how_payment_works',
    slug: 'how-does-payment-work',
    category: 'pricing',
    categoryLabel: {
      en: 'Pricing & Estimates',
      pt: 'Preços e Estimativas'
    },
    title: {
      en: 'How does payment work?',
      pt: 'Como funciona o pagamento?'
    },
    summary: {
      en: 'Payment is settled directly with the Specialist upon agreed completion of the job using MB WAY, Multibanco card, cash, or bank transfer.',
      pt: 'O pagamento é efetuado diretamente com o especialista após a conclusão do trabalho via MB WAY, cartão Multibanco, numerário ou transferência.'
    },
    readingTime: '2 min read',
    dateUpdated: '2026-08-14',
    contentSections: [
      {
        title: {
          en: 'Direct & Convenient Payment Options',
          pt: 'Opções de Pagamento Diretas e Convenientes'
        },
        body: {
          en: 'You pay the Specialist directly after work is completed to your satisfaction. All Specialists are required to provide official Portuguese fiscal invoices (Fatura-Recibo).',
          pt: 'Paga diretamente ao especialista após o trabalho ser concluído a seu gosto. Todos os especialistas emitem fatura-recibo oficial comunicada à Autoridade Tributária.'
        }
      }
    ],
    faqList: [],
    keywords: ['how payment works', 'MBWAY payment plumber', 'fatura recibo NIF'],
    relatedServiceSlugs: ['plumbing', 'electrical', 'handyman', 'cleaning', 'gardening', 'moving', 'pools', 'repairs']
  },
  {
    id: 'kb_when_job_completed',
    slug: 'when-is-a-job-considered-completed',
    category: 'how-it-works',
    categoryLabel: {
      en: 'How NordBase Works',
      pt: 'Como Funciona'
    },
    title: {
      en: 'When is a job considered completed?',
      pt: 'Quando é que um trabalho é considerado concluído?'
    },
    summary: {
      en: 'A job is officially completed only when the work has been tested, demonstrated on-site, and mutually confirmed by both Customer and Specialist.',
      pt: 'Um trabalho só é oficialmente concluído quando a intervenção é testada no local e confirmada mutuamente pelo cliente e pelo especialista.'
    },
    readingTime: '2 min read',
    dateUpdated: '2026-08-14',
    contentSections: [
      {
        title: {
          en: 'Mutual Sign-Off Requirement',
          pt: 'Requisito de Confirmação Mútua'
        },
        body: {
          en: 'The Specialist tests the repair in your presence (e.g. testing water flow, turning circuit breakers on). Once both sides agree the issue is resolved, the job is marked complete.',
          pt: 'O especialista testa a reparação na sua presença (ex: testar o fluxo de água, ligar o quadro elétrico). Quando ambos concordarem que o problema está resolvido, o serviço é dado como concluído.'
        }
      }
    ],
    faqList: [],
    keywords: ['job completed rule', 'mutual sign off', 'work quality check'],
    relatedServiceSlugs: ['plumbing', 'electrical', 'handyman', 'cleaning', 'gardening', 'moving', 'pools', 'repairs']
  }
];

export function getKBArticleBySlug(slug: string): KBArticle | undefined {
  return KNOWLEDGE_BASE_ARTICLES.find(
    a => a.slug.toLowerCase() === slug.toLowerCase() || a.id.toLowerCase() === slug.toLowerCase()
  );
}

export function getKBArticlesByCategory(category: string): KBArticle[] {
  if (category === 'all') return KNOWLEDGE_BASE_ARTICLES;
  return KNOWLEDGE_BASE_ARTICLES.filter(a => a.category === category);
}
