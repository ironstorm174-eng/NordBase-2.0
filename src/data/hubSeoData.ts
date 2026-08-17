import { ServiceCategory } from '../types';
import { KNOWLEDGE_BASE_ARTICLES } from './knowledgeBaseArticles';

export type HubOperationalStatus = 'active' | 'coming_soon' | 'inactive';

export interface HubServiceConfig {
  serviceId: string;       // e.g. 'plumbing'
  serviceSlug: string;     // e.g. 'plumbing'
  serviceName: string;     // e.g. 'Plumbing Services'
  subTitle?: string;       // e.g. 'Local Plumber Coordination'
  category: ServiceCategory; // e.g. 'Home Services'
  enabled: boolean;        // whether service is supported in hub
  indexable: boolean;      // whether search engines should index
  title: { en: string; pt: string };
  metaDescription: { en: string; pt: string };
  h1: { en: string; pt: string };
  description: { en: string; pt: string };
  typicalProblems: { en: string; pt: string }[];
  faqs: { q: { en: string; pt: string }; a: { en: string; pt: string } }[];
}

export interface HubConfig {
  id: string;               // e.g. 'portimao'
  slug: string;             // e.g. 'portimao'
  regionSlug: string;       // e.g. 'algarve'
  regionName: string;       // e.g. 'Algarve'
  cityName: string;         // e.g. 'Portimão'
  hubName: string;          // e.g. 'Portimão Hub'
  operationalStatus: HubOperationalStatus;
  title: { en: string; pt: string };
  metaDescription: { en: string; pt: string };
  h1: { en: string; pt: string };
  description: { en: string; pt: string };
  surroundingAreas: string[];
  services: HubServiceConfig[];
}

export const HUBS_DATA: HubConfig[] = [
  {
    id: 'portimao',
    slug: 'portimao',
    regionSlug: 'algarve',
    regionName: 'Algarve',
    cityName: 'Portimão',
    hubName: 'Portimão Hub',
    operationalStatus: 'active',
    title: {
      en: 'Portimão Hub — Local Services Coordination in Algarve | NordBase',
      pt: 'Hub de Portimão — Coordenação de Serviços Locais no Algarve | NordBase'
    },
    metaDescription: {
      en: 'Describe your problem and NordBase coordinates verified local specialists in Portimão, Alvor, and Praia da Rocha. Transparent pricing and direct connection.',
      pt: 'Descreva o seu problema e a NordBase coordena especialistas locais em Portimão, Alvor e Praia da Rocha. Preço transparente e ligação direta.'
    },
    h1: {
      en: 'Portimão Local Services Coordination',
      pt: 'Coordenação de Serviços Locais em Portimão'
    },
    description: {
      en: 'Primary operational coordination hub for Portimão, Alvor, Praia da Rocha, and surrounding Western Algarve areas. Connect with verified independent specialists without having to search or compare.',
      pt: 'Hub operacional de coordenação em Portimão, Alvor, Praia da Rocha e concelhos vizinhos do Barlavento Algarvio. Ligação direta a especialistas qualificados sem ter de procurar ou comparar.'
    },
    surroundingAreas: ['Praia da Rocha', 'Alvor', 'Mexilhoeira Grande', 'Ferragudo', 'Parchal'],
    services: [
      {
        serviceId: 'plumbing',
        serviceSlug: 'plumbing',
        serviceName: 'Plumbing Services',
        subTitle: 'Canalizadores & Desentupimentos',
        category: 'Home Services',
        enabled: true,
        indexable: true,
        title: {
          en: 'Plumber in Portimão & Water Leak Repairs | NordBase Algarve',
          pt: 'Canalizador em Portimão e Desentupimentos | NordBase Algarve'
        },
        metaDescription: {
          en: 'Water leaks, burst pipes, blocked drains, or water heater issues in Portimão? Describe your problem. NordBase coordinates a verified local plumber.',
          pt: 'Fuga de água, canos rotos, desentupimentos ou esquentador avariado em Portimão? Descreva o seu problema. A NordBase coordena o canalizador local.'
        },
        h1: {
          en: 'Plumbing & Emergency Water Repairs in Portimão',
          pt: 'Canalizador e Reparações de Canalização em Portimão'
        },
        description: {
          en: 'Coordination for emergency water leak fixes, pipe repairs, boiler installations, drain unblocking, and sanitary fitting installations across Portimão and Alvor.',
          pt: 'Coordenação de reparações de fugas de água, desentupimentos urgentes, esquentadores, torneiras e canalização geral em Portimão e Alvor.'
        },
        typicalProblems: [
          { en: 'Water leaking from kitchen sink, ceiling, or bathroom pipes', pt: 'Fuga de água no lava-loiça, teto ou tubagens da casa de banho' },
          { en: 'Blocked toilet, shower drain, or slow sewer line', pt: 'Sanita ou ralo entupido e escoamento lento de águas' },
          { en: 'Water heater (esquentador/termoacumulador) not igniting or low water pressure', pt: 'Esquentador/termoacumulador não liga ou pressão de água muito baixa' },
          { en: 'Tap replacement, leaking cistern, or toilet flush repair', pt: 'Substituição de torneiras, autoclismo a correr ou reparação de louças' }
        ],
        faqs: [
          {
            q: { en: 'How quickly can a plumber visit in Portimão?', pt: 'Com que rapidez pode um canalizador deslocar-se em Portimão?' },
            a: { en: 'For urgent issues like active leaks or overflows, local coordination dispatches available specialists as quickly as possible. For standard repairs, flexible same-day or next-day appointments are scheduled.', pt: 'Para situações urgentes de fuga de água ativa, a coordenação local ativa o especialista disponível com rapidez. Para trabalhos normais, pode agendar no mesmo dia ou no dia seguinte.' }
          },
          {
            q: { en: 'Do I have to approve the repair price before the plumber begins?', pt: 'Tenho de aprovar o orçamento antes de o canalizador começar o trabalho?' },
            a: { en: 'Yes. The specialist assesses the exact pipework on site and presents the final price. Physical work only starts once you approve.', pt: 'Sim. O especialista avalia a canalização no local e apresenta o valor final exato. O trabalho só começa após a sua aprovação explícita.' }
          }
        ]
      },
      {
        serviceId: 'electrical',
        serviceSlug: 'electrical',
        serviceName: 'Electrical Services',
        subTitle: 'Eletricistas Certificados',
        category: 'Home Services',
        enabled: true,
        indexable: true,
        title: {
          en: 'Electrician in Portimão & Power Fault Repairs | NordBase Algarve',
          pt: 'Eletricista em Portimão e Reparação de Avarias | NordBase Algarve'
        },
        metaDescription: {
          en: 'Circuit breaker tripping, power outage, or lighting installation in Portimão? Describe your issue and NordBase coordinates a qualified local electrician.',
          pt: 'Quadro elétrico a disparar, falha de luz ou instalação de candeeiros em Portimão? Descreva o problema e a NordBase coordena o eletricista.'
        },
        h1: {
          en: 'Electrician & Electrical Repairs in Portimão',
          pt: 'Eletricista e Reparações Elétricas em Portimão'
        },
        description: {
          en: 'Electrical fault diagnosis, circuit breaker trips, wiring upgrades, lighting installations, and power socket repairs across Portimão.',
          pt: 'Diagnóstico de avarias elétricas, disjuntores a disparar, substituição de tomadas, instalação de iluminação e reparação de quadros em Portimão.'
        },
        typicalProblems: [
          { en: 'Main circuit breaker or residual current device (RCD) keeps tripping', pt: 'Quadro elétrico ou disjuntor diferencial dispara constantemente' },
          { en: 'Power outage isolated to specific room or kitchen appliances', pt: 'Falta de corrente numa divisão específica ou tomada queimada' },
          { en: 'Installation of ceiling fans, lamps, spotlights, or exterior lighting', pt: 'Instalação de candeeiros, ventiladores de teto ou focos LED' },
          { en: 'Wiring safety inspection, short circuit diagnosis, and grounding check', pt: 'Inspeção de segurança da instalação elétrica e reparação de curto-circuitos' }
        ],
        faqs: [
          {
            q: { en: 'Can the electrician handle sudden power cuts in Portimão apartments?', pt: 'O eletricista resolve cortes de eletricidade súbitos em apartamentos?' },
            a: { en: 'Yes. Specialists isolate short-circuited lines, replace faulty breakers, and restore safe power supply according to Portuguese electrical standards.', pt: 'Sim. O especialista isola a linha em curto-circuito, substitui disjuntores avariados e repõe a segurança da instalação.' }
          }
        ]
      },
      {
        serviceId: 'handyman',
        serviceSlug: 'handyman',
        serviceName: 'Handyman Services',
        subTitle: 'Pequenas Obras & Marido das Obras',
        category: 'Home Services',
        enabled: true,
        indexable: true,
        title: {
          en: 'Handyman in Portimão — Home Repairs & Assembly | NordBase Algarve',
          pt: 'Marido das Obras em Portimão — Pequenas Reparações | NordBase Algarve'
        },
        metaDescription: {
          en: 'Need furniture assembly, TV wall mounting, door lock repair, or small home repairs in Portimão? Describe your task and NordBase coordinates a local handyman.',
          pt: 'Precisa de montar móveis, pendurar TV, trocar fechaduras ou pequenas reparações em Portimão? Descreva o trabalho e a NordBase coordena o técnico.'
        },
        h1: {
          en: 'Handyman & Property Maintenance in Portimão',
          pt: 'Pequenas Reparações e Manutenção em Portimão'
        },
        description: {
          en: 'General property maintenance, flat-pack furniture assembly (IKEA/Leroy Merlin), door lock replacements, TV mounting, silicone sealing, and minor interior touch-ups in Portimão.',
          pt: 'Montagem de móveis (IKEA/Leroy Merlin), substituição de fechaduras, fixação de suportes de TV, calafetagem de silicone e pequenas reparações gerais em Portimão.'
        },
        typicalProblems: [
          { en: 'Flat-pack furniture assembly (wardrobes, beds, desks, shelves)', pt: 'Montagem de móveis em kit (roupeiros, camas, mesas, cómodas)' },
          { en: 'TV wall bracket mounting, curtain rods, and mirror hanging', pt: 'Fixação de suportes de TV na parede, varões de cortinados e espelhos' },
          { en: 'Door lock jammed, sticking handle, or lock cylinder replacement', pt: 'Fechadura encravada, puxador solto ou substituição de canhão' },
          { en: 'Silicone renewal around shower/bath, minor plaster repair and touch-ups', pt: 'Renovação de silicone em banheiras e pequenas reparações de gesso/pintura' }
        ],
        faqs: [
          {
            q: { en: 'Can I combine multiple small tasks in one handyman visit?', pt: 'Posso juntar várias pequenas tarefas numa única visita?' },
            a: { en: 'Yes. Describe all your pending home tasks (e.g. hanging a TV, assembling a table, replacing a door handle) in your request for efficient single-visit coordination.', pt: 'Sim. Pode listar várias tarefas na descrição para que o técnico leve as ferramentas certas e resolva tudo numa só deslocação.' }
          }
        ]
      },
      {
        serviceId: 'cleaning',
        serviceSlug: 'cleaning',
        serviceName: 'Cleaning Services',
        subTitle: 'Limpeza Residencial & Alojamento Local',
        category: 'Cleaning',
        enabled: true,
        indexable: true,
        title: {
          en: 'Cleaning Services in Portimão & Airbnb Turnover | NordBase Algarve',
          pt: 'Serviços de Limpeza em Portimão e Alojamento Local | NordBase Algarve'
        },
        metaDescription: {
          en: 'Residential cleaning, Airbnb turnover cleans, post-renovation deep cleaning, and window cleaning in Portimão and Praia da Rocha. Describe your cleaning needs.',
          pt: 'Limpeza doméstica, rotatividade de Alojamento Local (AL), limpeza pós-obra e vidros em Portimão e Praia da Rocha. Descreva o que precisa.'
        },
        h1: {
          en: 'Residential & Holiday Rental Cleaning in Portimão',
          pt: 'Limpeza Doméstica e Alojamento Local em Portimão'
        },
        description: {
          en: 'Professional residential cleaning, holiday home turnover cleans with laundry coordination, deep post-renovation cleaning, and balcony window cleaning across Portimão.',
          pt: 'Limpeza profissional de apartamentos e moradias, rotatividade de Alojamento Local (check-in/check-out), limpeza profunda pós-obra e janelas em Portimão.'
        },
        typicalProblems: [
          { en: 'Fast turnover cleaning between holiday guests for Airbnb/AL properties', pt: 'Limpeza rápida de rotatividade entre hóspedes em Alojamento Local' },
          { en: 'Deep cleaning after renovation, building work, or move-out', pt: 'Limpeza profunda pós-obra, fim de arrendamento ou mudanças' },
          { en: 'Regular weekly or fortnightly domestic home cleaning', pt: 'Limpeza doméstica regular semanal ou quinzenal' },
          { en: 'Balcony glass, window pane, and outdoor terrace cleaning', pt: 'Limpeza de vidros, varandas e terraços com acumulação de poeiras' }
        ],
        faqs: [
          {
            q: { en: 'Do cleaners bring their own cleaning products and equipment?', pt: 'Os profissionais trazem os próprios produtos de limpeza?' },
            a: { en: 'Yes, specialists arrive equipped with professional cleaning supplies, or can use your preferred domestic products if specified.', pt: 'Sim, os especialistas levam materiais e produtos adequados, ou podem utilizar os seus se preferir.' }
          }
        ]
      },
      {
        serviceId: 'gardening',
        serviceSlug: 'gardening',
        serviceName: 'Gardening & Landscaping',
        subTitle: 'Jardinagem & Manutenção de Espaços Verdes',
        category: 'Gardening',
        enabled: true,
        indexable: true,
        title: {
          en: 'Gardener in Portimão — Garden Care & Irrigation | NordBase Algarve',
          pt: 'Jardineiro em Portimão — Manutenção e Rega | NordBase Algarve'
        },
        metaDescription: {
          en: 'Lawn mowing, hedge trimming, palm tree pruning, or irrigation repairs in Portimão villas? Describe your garden needs for local specialist coordination.',
          pt: 'Corte de relva, poda de sebes e palmeiras ou reparação de rega automática em Portimão? Descreva o seu jardim e a NordBase coordena o jardineiro.'
        },
        h1: {
          en: 'Gardening & Outdoor Maintenance in Portimão',
          pt: 'Jardinagem e Manutenção de Jardins em Portimão'
        },
        description: {
          en: 'Lawn care, hedge trimming, palm tree surgeon work, automatic irrigation system troubleshooting, weed clearing, and seasonal garden cleanup across Portimão.',
          pt: 'Corte e tratamento de relvados, poda de sebes e árvores, reparação de sistemas de rega automática e limpeza de terrenos em Portimão e Alvor.'
        },
        typicalProblems: [
          { en: 'Overgrown lawn needing mowing, edging, and weeding', pt: 'Relvado alto a precisar de corte, arejamento e monda de ervas' },
          { en: 'Automatic irrigation timer failure, broken pipe, or clogged sprinkler nozzles', pt: 'Programador de rega avariado, tubo furado ou aspersores entupidos' },
          { en: 'Hedge shaping, shrub trimming, and palm frond pruning', pt: 'Poda e corte de sebes, arbustos e limpeza de palmeiras' },
          { en: 'Seasonal green waste disposal and general garden refresh', pt: 'Limpeza sazonal de folhas secas e recolha de resíduos verdes' }
        ],
        faqs: [
          {
            q: { en: 'Is green waste removal included in the gardening service?', pt: 'A remoção e transporte de resíduos verdes está incluída?' },
            a: { en: 'Yes. Green waste bagging and removal is agreed with the specialist as part of the on-site scope.', pt: 'Sim. O ensacamento e transporte de sobrantes de poda fica acordado na avaliação com o jardineiro.' }
          }
        ]
      },
      {
        serviceId: 'moving',
        serviceSlug: 'moving',
        serviceName: 'Moving & Transport',
        subTitle: 'Mudanças & Transporte de Carga',
        category: 'Moving',
        enabled: true,
        indexable: true,
        title: {
          en: 'Moving Services in Portimão & Furniture Transport | NordBase Algarve',
          pt: 'Mudanças em Portimão e Transporte de Móveis | NordBase Algarve'
        },
        metaDescription: {
          en: 'Apartment moving, heavy furniture transport, or appliance pickup in Portimão and Western Algarve. Describe your move for coordinated local transport.',
          pt: 'Mudanças de casa, transporte de eletrodomésticos ou móveis pesados em Portimão e Barlavento Algarvio. Descreva a carga e nós coordenamos o transporte.'
        },
        h1: {
          en: 'Moving & Cargo Transport Services in Portimão',
          pt: 'Serviço de Mudanças e Transporte em Portimão'
        },
        description: {
          en: 'Local apartment and villa relocations, furniture pickup from retail stores (IKEA/Conforama), heavy item handling, van loading assistance, and packing support.',
          pt: 'Mudanças residenciais e comerciais em Portimão, recolha de compras volumosas em lojas, transporte de eletrodomésticos e apoio de carga/descarga.'
        },
        typicalProblems: [
          { en: 'Full or partial apartment moving across Portimão, Alvor, or Algarve', pt: 'Mudança completa ou parcial de apartamento no concelho de Portimão' },
          { en: 'Single heavy furniture or appliance pickup and delivery (sofa, fridge, wardrobe)', pt: 'Transporte de sofá, frigorífico, máquina de lavar ou móvel volumoso' },
          { en: 'Van loading/unloading assistance and staircase handling', pt: 'Ajudantes para carga e descarga em prédios sem elevador' },
          { en: 'Protective furniture wrapping and dismantling before transit', pt: 'Desmontagem e embalamento de proteção de mobiliário delicado' }
        ],
        faqs: [
          {
            q: { en: 'Can the moving specialist handle moves in buildings without an elevator?', pt: 'O serviço de mudanças inclui prédios sem elevador?' },
            a: { en: 'Yes. Specify the floor number and stair access in your description so the right team and equipment are assigned.', pt: 'Sim. Indique o piso e as condições de escadas na descrição para que a equipa venha com o pessoal adequado.' }
          }
        ]
      },
      {
        serviceId: 'pools',
        serviceSlug: 'pools',
        serviceName: 'Pool Maintenance',
        subTitle: 'Manutenção de Piscinas & Tratamento de Água',
        category: 'Pools',
        enabled: true,
        indexable: true,
        title: {
          en: 'Pool Maintenance in Portimão & Green Water Fix | NordBase Algarve',
          pt: 'Manutenção de Piscinas em Portimão e Tratamento | NordBase Algarve'
        },
        metaDescription: {
          en: 'Green pool water, pump breakdown, filter replacement, or regular chemical balancing in Portimão villas. Describe your pool issue for local specialist care.',
          pt: 'Água verde na piscina, bomba avariada, troca de areia do filtro ou tratamento químico em Portimão. Descreva o problema da piscina.'
        },
        h1: {
          en: 'Swimming Pool Maintenance & Repairs in Portimão',
          pt: 'Manutenção e Reparação de Piscinas em Portimão'
        },
        description: {
          en: 'Regular swimming pool chemical balancing, green water recovery shock treatments, pump noise repair, sand filter replacement, and salt chlorinator servicing in Portimão villas.',
          pt: 'Tratamento de choque para água verde, equilíbrio de pH/cloro, reparação de bombas de piscina, troca de carga filtrante e eletrólise de sal em Portimão.'
        },
        typicalProblems: [
          { en: 'Pool water turned green, cloudy, or has algae buildup on walls', pt: 'Água da piscina verde, turva ou com algas nas paredes e fundo' },
          { en: 'Pool circulation pump not pulling water, humming, or making grinding noise', pt: 'Bomba de circulação não puxa água, faz ruído estranho ou desarmou' },
          { en: 'Sand filter leaking or pressure gauge abnormally high', pt: 'Filtro de areia a perder água ou pressão demasiado alta no manómetro' },
          { en: 'Weekly or fortnightly routine water testing, skimming, and vacuuming', pt: 'Manutenção periódica de aspiração, limpeza de cesto e controlo químico' }
        ],
        faqs: [
          {
            q: { en: 'How fast can a green pool be restored to clear water?', pt: 'Quanto tempo demora a recuperar uma piscina com água verde?' },
            a: { en: 'With proper chemical shock treatment and filtration cycling, most green pools clear within 24 to 48 hours.', pt: 'Com tratamento de choque e filtração contínua, a água recupera habitualmente a transparência em 24 a 48 horas.' }
          }
        ]
      },
      {
        serviceId: 'repairs',
        serviceSlug: 'repairs',
        serviceName: 'Appliance & HVAC Repairs',
        subTitle: 'Ar Condicionado & Eletrodomésticos',
        category: 'Repairs',
        enabled: true,
        indexable: true,
        title: {
          en: 'AC Repair & Appliance Fix in Portimão | NordBase Algarve',
          pt: 'Reparação de Ar Condicionado e Eletrodomésticos em Portimão | NordBase Algarve'
        },
        metaDescription: {
          en: 'Air conditioning not cooling, washing machine not draining, or oven breakdown in Portimão? Describe your issue for local diagnostic and repair.',
          pt: 'Ar condicionado não arrefece, máquina de lavar não despeja água ou forno avariado em Portimão? Descreva o problema para diagnóstico e reparação.'
        },
        h1: {
          en: 'Air Conditioning & Domestic Appliance Repairs in Portimão',
          pt: 'Reparação de Ar Condicionado e Eletrodomésticos em Portimão'
        },
        description: {
          en: 'Air conditioning servicing, gas top-ups, filter sanitization, washing machine repairs, refrigerator cooling diagnostics, and electric oven troubleshooting in Portimão.',
          pt: 'Reparação e recarga de gás em ar condicionado, máquinas de lavar roupa e loiça, frigoríficos que não arrefecem e fornos elétricos em Portimão.'
        },
        typicalProblems: [
          { en: 'Air conditioning unit blowing warm air, leaking water indoors, or smelling musty', pt: 'Ar condicionado só deita ar morno, pinga água para dentro ou cheira mal' },
          { en: 'Washing machine error code, not draining water, or failing to spin', pt: 'Máquina de lavar roupa não escoa água, não centrifuga ou dá código de erro' },
          { en: 'Refrigerator or freezer not cooling properly or compressor running hot', pt: 'Frigorífico não gela, alimentos a estragar-se ou motor sempre a trabalhar' },
          { en: 'Electric oven not heating up or induction hob tripping the breaker', pt: 'Forno elétrico não aquece ou placa vitrocerâmica/indução desliga-se' }
        ],
        faqs: [
          {
            q: { en: 'Do technicians carry replacement parts for common appliance brands in Portimão?', pt: 'Os técnicos têm peças para as marcas de eletrodomésticos mais comuns?' },
            a: { en: 'Yes, specialists carry diagnostic tools and standard replacement parts (pumps, capacitors, sensors, thermostats) for major brands.', pt: 'Sim, os técnicos levam peças de desgaste rápido (bombas de esgoto, condensadores, sensores) para marcas comuns no mercado.' }
          }
        ]
      }
    ]
  },

  // Future / Inactive Expansion Hubs for Data Integrity
  {
    id: 'faro',
    slug: 'faro',
    regionSlug: 'algarve',
    regionName: 'Algarve',
    cityName: 'Faro',
    hubName: 'Faro Hub',
    operationalStatus: 'coming_soon',
    title: {
      en: 'Faro Hub — Planned Operational Expansion | NordBase Algarve',
      pt: 'Hub de Faro — Expansão Operacional Planeada | NordBase Algarve'
    },
    metaDescription: {
      en: 'NordBase territorial expansion in Faro capital area. Regional services coordinated via Portimão Hub.',
      pt: 'Expansão territorial da NordBase em Faro. Coordenação regional disponível através do Hub de Portimão.'
    },
    h1: {
      en: 'Faro Territory — Operational Expansion',
      pt: 'Território de Faro — Expansão Operacional'
    },
    description: {
      en: 'Planned coordination hub for Faro capital area and airport territory.',
      pt: 'Hub de coordenação planeado para a capital do Algarve e zona do aeroporto.'
    },
    surroundingAreas: ['Montenegro', 'Gambelas', 'Olhão border'],
    services: []
  },
  {
    id: 'albufeira',
    slug: 'albufeira',
    regionSlug: 'algarve',
    regionName: 'Algarve',
    cityName: 'Albufeira',
    hubName: 'Albufeira Hub',
    operationalStatus: 'coming_soon',
    title: {
      en: 'Albufeira Hub — Planned Operational Expansion | NordBase Algarve',
      pt: 'Hub de Albufeira — Expansão Operacional Planeada | NordBase Algarve'
    },
    metaDescription: {
      en: 'NordBase territorial expansion in Albufeira coastal area. Regional services coordinated via Portimão Hub.',
      pt: 'Expansão territorial da NordBase em Albufeira. Coordenação regional disponível através do Hub de Portimão.'
    },
    h1: {
      en: 'Albufeira Territory — Operational Expansion',
      pt: 'Território de Albufeira — Expansão Operacional'
    },
    description: {
      en: 'Planned coordination hub for Central Algarve coastal area.',
      pt: 'Hub de coordenação planeado para a zona costeira central do Algarve.'
    },
    surroundingAreas: ['Montechoro', 'Oura', 'Olhos de Água', 'Gale'],
    services: []
  },
  {
    id: 'lagos',
    slug: 'lagos',
    regionSlug: 'algarve',
    regionName: 'Algarve',
    cityName: 'Lagos',
    hubName: 'Lagos Hub',
    operationalStatus: 'coming_soon',
    title: {
      en: 'Lagos Hub — Planned Operational Expansion | NordBase Algarve',
      pt: 'Hub de Lagos — Expansão Operacional Planeada | NordBase Algarve'
    },
    metaDescription: {
      en: 'NordBase territorial expansion in Lagos and Western Algarve. Services coordinated via Portimão Hub.',
      pt: 'Expansão territorial da NordBase em Lagos. Coordenação disponível através do Hub de Portimão.'
    },
    h1: {
      en: 'Lagos Territory — Operational Expansion',
      pt: 'Território de Lagos — Expansão Operacional'
    },
    description: {
      en: 'Planned coordination hub for Western Algarve coastal area.',
      pt: 'Hub de coordenação planeado para a zona costeira ocidental do Algarve.'
    },
    surroundingAreas: ['Meia Praia', 'Luz', 'Burgau'],
    services: []
  }
];

// Helper to look up active Hubs
export function getHubBySlug(regionSlug: string, hubSlug: string): HubConfig | undefined {
  return HUBS_DATA.find(
    (h) => h.regionSlug.toLowerCase() === regionSlug.toLowerCase() && h.slug.toLowerCase() === hubSlug.toLowerCase()
  );
}

// Helper to look up active Hub Service
export function getHubServiceBySlug(
  regionSlug: string,
  hubSlug: string,
  serviceSlug: string
): { hub: HubConfig; service: HubServiceConfig } | undefined {
  const hub = getHubBySlug(regionSlug, hubSlug);
  if (!hub) return undefined;
  const service = hub.services.find(
    (s) => s.serviceSlug.toLowerCase() === serviceSlug.toLowerCase()
  );
  if (!service) return undefined;
  return { hub, service };
}

// Helper to determine indexability of a route
export function isRouteIndexable(
  regionSlug?: string,
  hubSlug?: string,
  serviceSlug?: string
): boolean {
  if (!regionSlug) return true; // root or general public page
  if (regionSlug === 'portugal') return true;
  if (regionSlug === 'algarve' && !hubSlug) return true;

  if (regionSlug === 'algarve' && hubSlug) {
    const hub = getHubBySlug(regionSlug, hubSlug);
    if (!hub || hub.operationalStatus !== 'active') return false;

    if (serviceSlug) {
      const service = hub.services.find((s) => s.serviceSlug.toLowerCase() === serviceSlug.toLowerCase());
      if (!service || !service.enabled || !service.indexable) return false;
    }
    return true;
  }

  return false;
}

// Helper to generate list of all active indexable URLs for Sitemap
export function getIndexableSitemapUrls(): { url: string; priority: number; changefreq: string }[] {
  const urls: { url: string; priority: number; changefreq: string }[] = [
    { url: 'https://nordbase.pt/', priority: 1.0, changefreq: 'daily' },
    { url: 'https://nordbase.pt/how-it-works', priority: 0.9, changefreq: 'weekly' },
    { url: 'https://nordbase.pt/partner', priority: 0.8, changefreq: 'weekly' },
    { url: 'https://nordbase.pt/knowledge-base', priority: 0.8, changefreq: 'weekly' },
    { url: 'https://nordbase.pt/portugal', priority: 0.9, changefreq: 'weekly' },
    { url: 'https://nordbase.pt/algarve', priority: 0.9, changefreq: 'weekly' },
  ];

  for (const hub of HUBS_DATA) {
    if (hub.operationalStatus === 'active') {
      const hubUrl = `https://nordbase.pt/${hub.regionSlug}/${hub.slug}`;
      urls.push({ url: hubUrl, priority: 0.9, changefreq: 'weekly' });

      for (const service of hub.services) {
        if (service.enabled && service.indexable) {
          const serviceUrl = `https://nordbase.pt/${hub.regionSlug}/${hub.slug}/${service.serviceSlug}`;
          urls.push({ url: serviceUrl, priority: 0.8, changefreq: 'weekly' });
        }
      }
    }
  }

  // Knowledge Base Categories
  urls.push(
    { url: 'https://nordbase.pt/knowledge-base/customer', priority: 0.8, changefreq: 'weekly' },
    { url: 'https://nordbase.pt/knowledge-base/pricing', priority: 0.8, changefreq: 'weekly' },
    { url: 'https://nordbase.pt/knowledge-base/how-it-works', priority: 0.8, changefreq: 'weekly' },
    { url: 'https://nordbase.pt/knowledge-base/services', priority: 0.8, changefreq: 'weekly' }
  );

  // All 16 public Customer Q&A articles
  for (const art of KNOWLEDGE_BASE_ARTICLES) {
    urls.push({
      url: `https://nordbase.pt/knowledge-base/${art.slug}`,
      priority: 0.7,
      changefreq: 'monthly'
    });
  }

  return urls;
}
