export interface Section {
  id: string;
  title: string;
}

export interface Module {
  id: string;
  number?: string;
  category?: string;
  categoryName?: string;
  title: string;
  description?: string;
  sections: Section[];
}

/**
 * SPECIALIST ACADEMY CURRICULUM (18 MODULES)
 */
export const getSpecialistCurriculum = (lang: string): Module[] => {
  const isPt = lang === 'pt';
  const isRu = lang === 'ru';

  return [
    {
      id: 'spec_mod_00',
      number: '00',
      category: 'onboarding',
      categoryName: isPt ? 'Fundamentos' : isRu ? 'Основы' : 'Foundations',
      title: isPt ? '0. Glossário — Definições Principais' : isRu ? '0. Глоссарий — Основные термины' : '0. Glossary — Essential Terminology',
      description: isPt ? 'Terminologia essencial da NordBase e conceitos do ecossistema.' : isRu ? 'Ключевая терминология NordBase и основные понятия платформы.' : 'Essential NordBase terminology, workflow concepts, and platform roles.',
      sections: [
        { id: 'sec_spec_00_1', title: isPt ? 'Participantes (Customer, Specialist, TP, RP)' : isRu ? 'Участники (Customer, Specialist, TP, RP)' : 'Platform Roles (Customer, Specialist, TP, RP)' },
        { id: 'sec_spec_00_2', title: isPt ? 'Fluxo de Pedidos (Request, Lead, Job, Hub)' : isRu ? 'Заявки и Работы (Request, Lead, Job, Hub)' : 'Order Lifecycle (Request, Lead, Job, Hub)' },
        { id: 'sec_spec_00_3', title: isPt ? 'Finanças (Lead Fee, Call-out Fee, Stripe, Wallet)' : isRu ? 'Финансы (Lead Fee, Call-out Fee, Stripe, Wallet)' : 'Financials (Lead Fee, Call-out Fee, Stripe, Wallet)' }
      ]
    },
    {
      id: 'spec_mod_01',
      number: '01',
      category: 'onboarding',
      categoryName: isPt ? 'Fundamentos' : isRu ? 'Основы' : 'Foundations',
      title: isPt ? '1. Como Funciona a NordBase' : isRu ? '1. Как работает NordBase' : '1. How NordBase Works',
      description: isPt ? 'O modelo de ponta a ponta e a divisão de papéis entre TP, Especialista e Cliente.' : isRu ? 'Полный жизненный цикл заказа и распределение ролей между TP, специалистом и клиентом.' : 'The complete end-to-end model and role distribution between Customer, TP, and Specialist.',
      sections: [
        { id: 'sec_spec_01_1', title: isPt ? 'O Ciclo Completo do Pedido' : isRu ? 'Полный жизненный цикл заказа' : 'The Complete Order Lifecycle' },
        { id: 'sec_spec_01_2', title: isPt ? 'Papéis: Cliente, Especialista, TP e NordBase' : isRu ? 'Роли: Клиент, Специалист, TP и NordBase' : 'Roles: Customer, Specialist, TP & NordBase' },
        { id: 'sec_spec_01_3', title: isPt ? 'O Trabalho Local do TP na Atração de Clientes' : isRu ? 'Локальная работа TP по привлечению клиентов' : 'The TP’s Local Marketing & Qualification Role' }
      ]
    },
    {
      id: 'spec_mod_02',
      number: '02',
      category: 'onboarding',
      categoryName: isPt ? 'Fundamentos' : isRu ? 'Основы' : 'Foundations',
      title: isPt ? '2. Porquê Trabalhar com a NordBase' : isRu ? '2. Почему стоит работать с NordBase' : '2. Why Work with NordBase',
      description: isPt ? 'Vantagens económicas para o Especialista e o fim da perda de tempo com publicidade.' : isRu ? 'Экономическая выгода для специалиста и экономия времени на поиске клиентов.' : 'Economic advantages for independent Specialists and eliminating wasted marketing hours.',
      sections: [
        { id: 'sec_spec_02_1', title: isPt ? 'Modelo Tradicional vs Modelo NordBase' : isRu ? 'Традиционная модель vs Модель NordBase' : 'Traditional Model vs NordBase Model' },
        { id: 'sec_spec_02_2', title: isPt ? 'Ideia Central: Foco no Trabalho Pago' : isRu ? 'Главный принцип: Фокус на оплачиваемой работе' : 'Core Idea: Focus on Paid Work' },
        { id: 'sec_spec_02_3', title: isPt ? 'O que é um Lead Qualificado (Sem garantias falsas)' : isRu ? 'Что такое квалифицированный лид (Без ложных гарантий)' : 'Qualified Opportunities vs Guaranteed Jobs' }
      ]
    },
    {
      id: 'spec_mod_03',
      number: '03',
      category: 'onboarding',
      categoryName: isPt ? 'Fundamentos' : isRu ? 'Основы' : 'Foundations',
      title: isPt ? '3. Início numa Nova Região' : isRu ? '3. Старт в новом регионе' : '3. Starting in a New Region',
      description: isPt ? 'O que esperar no lançamento regional e o crescimento gradual do volume.' : isRu ? 'Чего ожидать при запуске нового региона и постепенный рост потока.' : 'What to expect during a regional launch and building a sustainable local flow.',
      sections: [
        { id: 'sec_spec_03_1', title: isPt ? 'Etapas do Lançamento Regional' : isRu ? 'Этапы запуска нового региона' : 'Regional Launch Lifecycle' },
        { id: 'sec_spec_03_2', title: isPt ? 'Dinâmica do Fluxo Inicial de Pedidos' : isRu ? 'Динамика начального потока заявок' : 'Initial Order Flow Dynamics' },
        { id: 'sec_spec_03_3', title: isPt ? 'Construção do Mercado Sustentável' : isRu ? 'Формирование устойчивого локального рынка' : 'Building a Sustainable Local Network' }
      ]
    },
    {
      id: 'spec_mod_04',
      number: '04',
      category: 'operations',
      categoryName: isPt ? 'Atividade Profissional' : isRu ? 'Профессиональная деятельность' : 'Professional Operations',
      title: isPt ? '4. Registo e Estatuto Empresarial' : isRu ? '4. Регистрация и бизнес-статус' : '4. Registration & Business Status',
      description: isPt ? 'Perfil do Especialista e estatuto de empreendedor independente.' : isRu ? 'Профиль специалиста и статус независимого предпринимателя.' : 'Specialist profile, independent entrepreneurship, and legal business statuses.',
      sections: [
        { id: 'sec_spec_04_1', title: isPt ? 'Configuração do Perfil e Serviços' : isRu ? 'Настройка профиля и услуг' : 'Profile & Service Setup' },
        { id: 'sec_spec_04_2', title: isPt ? 'Estatuto Jurídico (ENI, Unipessoal LDA, Recibos Verdes)' : isRu ? 'Правовой статус (ENI, Unipessoal LDA, Recibos Verdes)' : 'Legal Status (ENI, Unipessoal LDA, Self-Employed)' },
        { id: 'sec_spec_04_3', title: isPt ? 'Autonomia e Relação com a NordBase' : isRu ? 'Автономия и отношения с NordBase' : 'Independence & Non-Employee Principles' }
      ]
    },
    {
      id: 'spec_mod_05',
      number: '05',
      category: 'operations',
      categoryName: isPt ? 'Atividade Profissional' : isRu ? 'Профессиональная деятельность' : 'Professional Operations',
      title: isPt ? '5. Verificação e Confiança' : isRu ? '5. Верификация и доверие' : '5. Verification & Trust',
      description: isPt ? 'Por que a NordBase verifica os Especialistas e como isso constrói confiança.' : isRu ? 'Зачем нужна верификация и как она формирует доверие клиентов.' : 'Why NordBase verifies Specialists and building cross-ecosystem trust.',
      sections: [
        { id: 'sec_spec_05_1', title: isPt ? 'Documentos e Verificação de Identidade' : isRu ? 'Проверка документов и личности' : 'Document Check & Identity Verification' },
        { id: 'sec_spec_05_2', title: isPt ? 'Comprovação de Competências Técnicas' : isRu ? 'Подтверждение квалификации и навыков' : 'Skill Level & Certification Check' },
        { id: 'sec_spec_05_3', title: isPt ? 'O Impacto da Verificação na Taxa de Conversão' : isRu ? 'Влияние верификации на конверсию' : 'How Verification Increases Customer Trust' }
      ]
    },
    {
      id: 'spec_mod_06',
      number: '06',
      category: 'leads_pricing',
      categoryName: isPt ? 'Leads e Preços' : isRu ? 'Лиды и Цены' : 'Leads & Pricing Economics',
      title: isPt ? '6. Anatomia de um Lead' : isRu ? '6. Анатомия Лида' : '6. Anatomy of a Lead',
      description: isPt ? 'O que é um Lead, informações contidas e como avaliar ou recusar.' : isRu ? 'Что такое лид, состав данных и принятие решений.' : 'What constitutes a Lead, evaluating customer requests, and accepting or declining.',
      sections: [
        { id: 'sec_spec_06_1', title: isPt ? 'Informações Incluídas no Lead' : isRu ? 'Содержимое карточки лида' : 'Information Inside a Lead Card' },
        { id: 'sec_spec_06_2', title: isPt ? 'Diferença entre Contacto Bruto e Lead Qualificado' : isRu ? 'Разница между контактом и квалифицированным лидом' : 'Raw Contact vs Qualified Lead' },
        { id: 'sec_spec_06_3', title: isPt ? 'Avaliação, Aceitação e Recusa de Leads' : isRu ? 'Анализ, принятие и отказ от лида' : 'Reviewing, Accepting & Declining Leads' }
      ]
    },
    {
      id: 'spec_mod_07',
      number: '07',
      category: 'leads_pricing',
      categoryName: isPt ? 'Leads e Preços' : isRu ? 'Лиды и Цены' : 'Leads & Pricing Economics',
      title: isPt ? '7. Taxa de Lead (Lead Fee) e Mecânica de Pagamento' : isRu ? '7. Комиссия за лид (Lead Fee) и механика выплат' : '7. Lead Fee & Payment Mechanics',
      description: isPt ? 'Como funciona o Lead Fee, 100% do pagamento do trabalho para o Especialista.' : isRu ? 'Как работает Lead Fee и получение 100% оплаты за работу.' : 'Understanding the Lead Fee, keeping 100% of job earnings, and economics examples.',
      sections: [
        { id: 'sec_spec_07_1', title: isPt ? 'O Conceito de Lead Fee' : isRu ? 'Концепция Lead Fee' : 'The Concept of Lead Fee' },
        { id: 'sec_spec_07_2', title: isPt ? '100% do Valor do Trabalho é do Especialista' : isRu ? '100% оплаты за работу принадлежит специалисту' : 'Specialist Keeps 100% of Job Value' },
        { id: 'sec_spec_07_3', title: isPt ? 'Exemplos Práticos de Cálculo Económico' : isRu ? 'Практические примеры расчёта экономики' : 'Practical Financial Examples' }
      ]
    },
    {
      id: 'spec_mod_08',
      number: '08',
      category: 'leads_pricing',
      categoryName: isPt ? 'Leads e Preços' : isRu ? 'Лиды и Цены' : 'Leads & Pricing Economics',
      title: isPt ? '8. Valor Mínimo de Pedido (€50) e Tempo Faturável' : isRu ? '8. Минимальный заказ (€50) и оплачиваемое время' : '8. Minimum Job Value (€50) & Billable Time',
      description: isPt ? 'A regra dos €50 mínimos e a contabilização do tempo (2h mínimas).' : isRu ? 'Правило минимального заказа €50 и минимального времени (2 часа).' : 'The €50 minimum job value rule and 2-hour minimum billable time standard.',
      sections: [
        { id: 'sec_spec_08_1', title: isPt ? 'Regra do Valor Mínimo de €50' : isRu ? 'Правило минимального заказа €50' : 'The €50 Minimum Order Rule' },
        { id: 'sec_spec_08_2', title: isPt ? 'Minímo Faturável de 2 Horas (Como registar corretamente)' : isRu ? 'Минимум 2 часа (Как правильно указывать время)' : '2-Hour Minimum Billable Standard (Reporting accurately)' },
        { id: 'sec_spec_08_3', title: isPt ? 'Trabalho Real vs Mínimo Faturável (Sem falsificar tempo)' : isRu ? 'Фактическое время vs Минимальный тариф (Честный отчёт)' : 'Actual Time vs Billable Minimum (Honest reporting)' }
      ]
    },
    {
      id: 'spec_mod_09',
      number: '09',
      category: 'leads_pricing',
      categoryName: isPt ? 'Leads e Preços' : isRu ? 'Лиды и Цены' : 'Leads & Pricing Economics',
      title: isPt ? '9. Avaliação Profissional e Ajuste de Preço' : isRu ? '9. Профессиональная оценка и корректировка цены' : '9. Pricing & Professional On-Site Assessment',
      description: isPt ? 'Estimativa inicial vs diagnóstico no local (Ajustes para cima ou para baixo).' : isRu ? 'Предварительная оценка vs диагностика на месте (Изменение цены вверх/вниз).' : 'Initial estimate vs on-site technical diagnostic (Adjusting prices UP or DOWN).',
      sections: [
        { id: 'sec_spec_09_1', title: isPt ? 'A Estimativa Inicial é Apenas uma Aproximação' : isRu ? 'Предварительная оценка — это ориентир' : 'Initial Estimate as a Baseline' },
        { id: 'sec_spec_09_2', title: isPt ? 'Diagnóstico Técnico no Local' : isRu ? 'Техническая диагностика на объекте' : 'On-Site Technical Diagnostics' },
        { id: 'sec_spec_09_3', title: isPt ? 'Comunicação Prévia de Alterações ao Cliente' : isRu ? 'Согласование изменений ДО начала работ' : 'Explaining Scope & Price Adjustments Before Starting' }
      ]
    },
    {
      id: 'spec_mod_10',
      number: '10',
      category: 'standards',
      categoryName: isPt ? 'Padrões e Normas' : isRu ? 'Стандарты и Правила' : 'Standards & Ethics',
      title: isPt ? '10. Preços Justos e Reputação de Longo Prazo' : isRu ? '10. Честные цены и долгосрочная репутация' : '10. Fair Pricing & Long-Term Trust',
      description: isPt ? 'Por que a sobrevalorização inflacionada destrói o negócio do Especialista.' : isRu ? 'Почему завышение цен разрушает бизнес специалиста.' : 'Why inflated pricing damages reputation and building long-term sustainable income.',
      sections: [
        { id: 'sec_spec_10_1', title: isPt ? 'O Perigo da Inflação Artificial de Preços' : isRu ? 'Опасность искусственного завышения цен' : 'The Danger of Artificially Inflated Quotes' },
        { id: 'sec_spec_10_2', title: isPt ? 'Visão de Longo Prazo vs Ganho Imediato' : isRu ? 'Долгосрочное мышление vs Сиюминутная выгода' : 'Long-Term Thinking vs One-Time Markup' },
        { id: 'sec_spec_10_3', title: isPt ? 'O Princípio "Maximizar a Chance de Sucesso"' : isRu ? 'Принцип «Максимизация шанса на успешную работу»' : 'Core Principle: "Maximize Job Success Rate"' }
      ]
    },
    {
      id: 'spec_mod_11',
      number: '11',
      category: 'standards',
      categoryName: isPt ? 'Padrões e Normas' : isRu ? 'Стандарты и Правила' : 'Standards & Ethics',
      title: isPt ? '11. Taxa de Deslocação / Avaliação (€20 Call-out Fee)' : isRu ? '11. Плата за выезд (€20 Call-out Fee)' : '11. Call-out / Travel Fee (€20 Rule)',
      description: isPt ? 'Quando se aplica a taxa de €20 e por que NÃO é cobrada se o trabalho for realizado.' : isRu ? 'Когда применяется плата €20 и почему она НЕ взимается при выполнении работы.' : 'When the €20 Call-out fee applies and why it is waived if the job proceeds.',
      sections: [
        { id: 'sec_spec_11_1', title: isPt ? 'O Propósito da Taxa de Deslocação de €20' : isRu ? 'Назначение платы за выезд €20' : 'Purpose of the €20 Call-out Fee' },
        { id: 'sec_spec_11_2', title: isPt ? 'Isenção da Taxa quando o Trabalho é Executado' : isRu ? 'Отмена платы при выполнении заказа' : 'Fee Waived When Job Is Performed' },
        { id: 'sec_spec_11_3', title: isPt ? 'Aviso Prévio Obrigatório ao Cliente' : isRu ? 'Обязательное предупреждение клиента ДО выезда' : 'Mandatory Prior Notice to Customer' }
      ]
    },
    {
      id: 'spec_mod_12',
      number: '12',
      category: 'standards',
      categoryName: isPt ? 'Padrões e Normas' : isRu ? 'Стандарты и Правила' : 'Standards & Ethics',
      title: isPt ? '12. Comunicação com o Cliente' : isRu ? '12. Коммуникация с клиентом' : '12. Customer Communication Standards',
      description: isPt ? 'Regras de ouro para contacto profissional, pontualidade e transparência.' : isRu ? 'Золотые правила профессионального общения, пунктуальности и прозрачности.' : 'Golden rules for professional contact, punctuality, transparency, and no price surprises.',
      sections: [
        { id: 'sec_spec_12_1', title: isPt ? 'Primeiro Contacto e Confirmação de Horário' : isRu ? 'Первый звонок и подтверждение времени' : 'First Call & Time Confirmation' },
        { id: 'sec_spec_12_2', title: isPt ? 'Regra de Ouro: "Nunca Surpreender o Cliente com Preços"' : isRu ? 'Главное правило: «Никаких неожиданных цен»' : 'Golden Rule: "Never Surprise the Customer with Higher Prices"' },
        { id: 'sec_spec_12_3', title: isPt ? 'Autonomia Comercial da Relação Cliente-Especialista' : isRu ? 'Коммерческая самостоятельность отношений с клиентом' : 'Commercial Independence of Customer-Specialist Relationship' }
      ]
    },
    {
      id: 'spec_mod_13',
      number: '13',
      category: 'workflow',
      categoryName: isPt ? 'Fluxo Prático' : isRu ? 'Практический процесс' : 'Practical Workflow',
      title: isPt ? '13. Do Lead ao Trabalho Concluído' : isRu ? '13. От Лида к завершённой работе' : '13. From Lead to Completed Job',
      description: isPt ? 'O mapa de fluxo passo a passo e tratamento de ramificações do pedido.' : isRu ? 'Пошаговая карта процесса и обработка возможный сценариев.' : 'Step-by-step workflow map and managing decision decision branches.',
      sections: [
        { id: 'sec_spec_13_1', title: isPt ? 'O Fluxo Passo a Passo do Pedido' : isRu ? 'Пошаговый процесс выполнения работы' : 'Step-by-Step Execution Sequence' },
        { id: 'sec_spec_13_2', title: isPt ? 'Cenários de Aceitação, Ajuste e Recusa' : isRu ? 'Сценарии согласия, корректировки и отказа' : 'Acceptance, Adjustment & Refusal Scenarios' },
        { id: 'sec_spec_13_3', title: isPt ? 'Trabalhos Adicionais e Materiais Não Previstos' : isRu ? 'Дополнительные работы и незапланированные материалы' : 'Additional Work & Unplanned Materials' }
      ]
    },
    {
      id: 'spec_mod_14',
      number: '14',
      category: 'workflow',
      categoryName: isPt ? 'Fluxo Prático' : isRu ? 'Практический процесс' : 'Practical Workflow',
      title: isPt ? '14. Situações Incomuns e Resolução de Problemas' : isRu ? '14. Необычные ситуации и решение проблем' : '14. Problems & Unusual Situations',
      description: isPt ? 'Guia prático para cancelamentos, ausências, recusas de taxa e disputas.' : isRu ? 'Практическое руководство при отмене, отсутствии клиента и спорах.' : 'Practical scenario playbook for cancellations, price disputes, and damaged materials.',
      sections: [
        { id: 'sec_spec_14_1', title: isPt ? 'Cliente Cancela ou Não Está Presente' : isRu ? 'Клиент отменил или отсутствует' : 'Customer Cancels or Unavailable' },
        { id: 'sec_spec_14_2', title: isPt ? 'Cliente Recusa a Taxa de Deslocação ou Novo Orçamento' : isRu ? 'Клиент отказывается от оплаты выезда или новой цены' : 'Customer Refuses Call-out Fee or Revised Price' },
        { id: 'sec_spec_14_3', title: isPt ? 'Não Pagamento ou Reclamação de Qualidade' : isRu ? 'Неоплата или претензии к качеству' : 'Non-Payment & Quality Disagreements' }
      ]
    },
    {
      id: 'spec_mod_15',
      number: '15',
      category: 'standards',
      categoryName: isPt ? 'Padrões e Normas' : isRu ? 'Стандарты и Правила' : 'Standards & Ethics',
      title: isPt ? '15. Código de Ética e Padrões Profissionais' : isRu ? '15. Кодекс ethics и стандарты' : '15. Professional Standards & Code of Ethics',
      description: isPt ? 'Pontualidade, honestidade, limpeza no local e respeito ao cliente.' : isRu ? 'Пунктуальность, честность, чистота и уважение к клиенту.' : 'Punctuality, honesty, jobsite cleanliness, and mutual respect.',
      sections: [
        { id: 'sec_spec_15_1', title: isPt ? 'Os 8 Pilares da Reputação Profissional' : isRu ? '8 столпов профессиональной репутации' : 'The 8 Pillars of Professional Reputation' },
        { id: 'sec_spec_15_2', title: isPt ? 'Responsabilidade Individual do Especialista' : isRu ? 'Личная ответственность специалиста' : 'Individual Responsibility & Entrepreneur Mindset' },
        { id: 'sec_spec_15_3', title: isPt ? 'A Reputação como Ativo Mais Valioso' : isRu ? 'Репутация как главный капитал' : 'Reputation as Your Most Valuable Capital' }
      ]
    },
    {
      id: 'spec_mod_16',
      number: '16',
      category: 'growth',
      categoryName: isPt ? 'Crescimento' : isRu ? 'Развитие' : 'Career Growth',
      title: isPt ? '16. Crescimento com a NordBase' : isRu ? '16. Рост вместе с NordBase' : '16. Growing with NordBase',
      description: isPt ? 'Como expandir o volume de trabalhos, construir clientes recorrentes e equipas.' : isRu ? 'Как увеличивать поток заказов, постоянных клиентов и масштабироваться.' : 'Expanding job volume, building repeat clients, and potential team participation.',
      sections: [
        { id: 'sec_spec_16_1', title: isPt ? 'Construção de Base de Clientes Recorrentes' : isRu ? 'Формирование базы постоянных клиентов' : 'Building a Repeat Customer Base' },
        { id: 'sec_spec_16_2', title: isPt ? 'Aumento do Rating e Prioridade de Recebimento de Leads' : isRu ? 'Рост рейтинга и приоритет получения лидов' : 'Rating Growth & Priority Lead Allocation' },
        { id: 'sec_spec_16_3', title: isPt ? 'Formação de Equipas e Escalabilidade' : isRu ? 'Создание команд и масштабирование' : 'Team Building & Service Expansion' }
      ]
    },
    {
      id: 'spec_mod_17',
      number: '17',
      category: 'certification',
      categoryName: isPt ? 'Certificação' : isRu ? 'Сертификация' : 'Certification',
      title: isPt ? '17. Teste Final de Qualificação' : isRu ? '17. Финальное тестирование' : '17. Final Qualification Test',
      description: isPt ? 'Teste prático com 10 cenários reais para certificação e liberação de Leads.' : isRu ? 'Практический тест из 10 реальных ситуаций для получения сертификации.' : 'Practical 10-scenario exam testing real-world decision making and unlocking qualified leads.',
      sections: [
        { id: 'sec_spec_17_1', title: isPt ? 'Instruções e Regras do Teste' : isRu ? 'Инструкции и правила теста' : 'Exam Rules & Instructions' },
        { id: 'sec_spec_17_2', title: isPt ? '10 Questões de Cenários Práticos' : isRu ? '10 вопросов по практическим кейсам' : '10 Practical Scenario Questions' },
        { id: 'sec_spec_17_3', title: isPt ? 'Resultado e Emissão de Certificado' : isRu ? 'Результат и выдача сертификата' : 'Scoring, Certification & Lead Activation' }
      ]
    }
  ];
};

/**
 * TP ACADEMY CURRICULUM (27 MODULES)
 */
export const getOperatorCurriculum = (lang: string): Module[] => {
  const isPt = lang === 'pt';
  const isRu = lang === 'ru';

  return [
    // --- CATEGORY 1: FOUNDATIONS (01-03) ---
    {
      id: 'tp_mod_01',
      number: '01',
      category: 'foundations',
      categoryName: isPt ? 'Obrigações e Princípios' : isRu ? 'Основы' : 'Foundations',
      title: isPt ? '01. Glossário — Glossário NordBase' : isRu ? '01. Glossary — Глоссарий NordBase' : '01. Glossary — NordBase Glossary',
      description: isPt ? 'Termos e definições oficiais da NordBase (Request, Verification, Lead, Job).' : isRu ? 'Общие термины и определения NordBase (Request → Verification → Lead → Job).' : 'Official NordBase terms & workflow lifecycle definitions.',
      sections: [
        { id: 'sec_tp_01_1', title: isPt ? 'Terminologia Principal (Customer, Specialist, TP, RP, Admin)' : isRu ? 'Основные термины (Customer, Specialist, TP, RP, Admin)' : 'Key Terminology (Customer, Specialist, TP, RP, Admin)' },
        { id: 'sec_tp_01_2', title: isPt ? 'Ciclo do Pedido (Request → Verification → Lead → Job)' : isRu ? 'Жизненный цикл (Request → Verification → Lead → Job)' : 'Workflow Lifecycle (Request → Verification → Lead → Job)' },
        { id: 'sec_tp_01_3', title: isPt ? 'Conceitos do Sistema (Hub, Território, Região, Chat, Tradutor IA)' : isRu ? 'Понятия системы (Hub, Территория, Регион, Чат, AI Translator)' : 'System Concepts (Hub, Territory, Region, Chat, AI Translator)' },
        { id: 'sec_tp_01_4', title: isPt ? 'Termos de Negócio (Seeding, Lead Fee, Win2Win, Dashboard)' : isRu ? 'Бизнес-термины (Посев, Lead Fee, Win2Win, Dashboard)' : 'Business Terms (Seeding, Lead Fee, Win2Win, Dashboard)' },
      ]
    },
    {
      id: 'tp_mod_02',
      number: '02',
      category: 'foundations',
      categoryName: isPt ? 'Obrigações e Princípios' : isRu ? 'Основы' : 'Foundations',
      title: isPt ? '02. Filosofia — Filosofia NordBase' : isRu ? '02. Philosophy — Философия NordBase' : '02. Philosophy — NordBase Philosophy',
      description: isPt ? 'Módulo unificado de filosofia para todas as funções na NordBase.' : isRu ? 'Единый модуль философии для всех ролей NordBase.' : 'Unified core philosophy module across all NordBase roles.',
      sections: [
        { id: 'sec_tp_02_1', title: isPt ? 'O Mundo em Mudança e a Ilha de Estabilidade' : isRu ? 'Мир меняется & Остров стабильности' : 'The Changing World & Island of Stability' },
        { id: 'sec_tp_02_2', title: isPt ? 'Acreditamos nas Pessoas e na Liberdade' : isRu ? 'Мы верим в людей & Свобода' : 'Believing in People & Freedom' },
        { id: 'sec_tp_02_3', title: isPt ? 'Ajuda Mútua e Filosofia Win2Win' : isRu ? 'Взаимопомощь & Win2Win' : 'Mutual Support & Win2Win Culture' },
        { id: 'sec_tp_02_4', title: isPt ? 'Oportunidade de Mudar de Vida e O Que Construímos' : isRu ? 'Возможность изменить жизнь & Что мы строим' : 'Changing Lives & What We Are Building' },
      ]
    },
    {
      id: 'tp_mod_03',
      number: '03',
      category: 'foundations',
      categoryName: isPt ? 'Obrigações e Princípios' : isRu ? 'Основы' : 'Foundations',
      title: isPt ? '03. Papel do TP — Função do Parceiro Territorial' : isRu ? '03. Role of TP — Роль TP' : '03. Role of TP — Role of Territory Partner',
      description: isPt ? 'O TP é um empreendedor independente que garante o funcionamento da NordBase no território.' : isRu ? 'TP — самостоятельный предприниматель, обеспечивающий работу NordBase на своей территории.' : 'TP is an independent entrepreneur ensuring smooth local NordBase operation.',
      sections: [
        { id: 'sec_tp_03_1', title: isPt ? 'Quem é o TP e por que existe este papel' : isRu ? 'Кто такой TP и зачем существует эта роль' : 'Who is TP & Purpose of the Role' },
        { id: 'sec_tp_03_2', title: isPt ? 'Responsabilidades e âmbito de trabalho do TP' : isRu ? 'Ответственность и объём работы TP' : 'TP Core Responsibilities & Scope' },
        { id: 'sec_tp_03_3', title: isPt ? 'O que NÃO faz parte da responsabilidade do TP' : isRu ? 'Что НЕ входит в ответственность TP' : 'What is NOT in TP Responsibility Scope' },
        { id: 'sec_tp_03_4', title: isPt ? 'Interação com RP, especialistas, clientes e outros TPs' : isRu ? 'Взаимодействие с RP, специалистами, заказчиками и другими TP' : 'Interactions with RP, Specialists, Clients & TPs' },
        { id: 'sec_tp_03_5', title: isPt ? 'Limites de autoridade e autonomia do TP' : isRu ? 'Границы полномочий и самостоятельность TP' : 'Authority Boundaries & Entrepreneurial Independence' },
      ]
    },

    // --- CATEGORY 2: ADMISSION & PREPARATION (04-06) ---
    {
      id: 'tp_mod_04',
      number: '04',
      category: 'admission',
      categoryName: isPt ? 'Admissão e Preparação' : isRu ? 'Допуск и подготовка' : 'Admission & Preparation',
      title: isPt ? '04. Entrada na NordBase — Integração de TP' : isRu ? '04. Joining NordBase — Вступление в NordBase' : '04. Joining NordBase — Onboarding TP',
      description: isPt ? 'Do processo de entrevista ao contrato, registo de empresa e conexão do Stripe.' : isRu ? 'От собеседования до соглашения, регистрации бизнеса и подключения Stripe.' : 'From interview and agreement to business registration and Stripe setup.',
      sections: [
        { id: 'sec_tp_04_1', title: isPt ? 'Entrevista e seleção bem-sucedida' : isRu ? 'Собеседование и успешное прохождение' : 'Interview & Selection Process' },
        { id: 'sec_tp_04_2', title: isPt ? 'Acordo com a NordBase e Requisitos de TP' : isRu ? 'Соглашение с NordBase и требования к TP' : 'NordBase Agreement & TP Requirements' },
        { id: 'sec_tp_04_3', title: isPt ? 'Registo de Negócio (ENI ou LDA)' : isRu ? 'Регистрация бизнеса (ИП / ENI или LDA)' : 'Business Registration (ENI or LDA)' },
        { id: 'sec_tp_04_4', title: isPt ? 'Dados Bancários e Conexão do Stripe' : isRu ? 'Платёжные реквизиты и подключение Stripe' : 'Payment Details & Stripe Integration' },
      ]
    },
    {
      id: 'tp_mod_05',
      number: '05',
      category: 'admission',
      categoryName: isPt ? 'Admissão e Preparação' : isRu ? 'Допуск и подготовка' : 'Admission & Preparation',
      title: isPt ? '05. Local de Trabalho — Instalações e Equipamento' : isRu ? '05. Workspace — Рабочее место' : '05. Workspace — Working Environment',
      description: isPt ? 'Requisitos obrigatórios para o espaço físico e equipamento técnico do TP.' : isRu ? 'Обязательные требования к помещению и техническому оснащению TP.' : 'Mandatory space and technical hardware requirements for TP.',
      sections: [
        { id: 'sec_tp_05_1', title: isPt ? 'Espaço Isolado e Ausência de Ruídos' : isRu ? 'Изолированное помещение и отсутствие шума' : 'Isolated Room & Acoustic Quietness' },
        { id: 'sec_tp_05_2', title: isPt ? 'Computador, Internet Estável e Auscultadores com Microfone' : isRu ? 'Компьютер, интернет, гарнитура, микрофон' : 'Computer, Stable Internet, Headset & Mic' },
        { id: 'sec_tp_05_3', title: isPt ? 'Por que razão estes requisitos são estritamente obrigatórios' : isRu ? 'Почему требования обязательны' : 'Why These Standards are Strictly Mandatory' },
      ]
    },
    {
      id: 'tp_mod_06',
      number: '06',
      category: 'admission',
      categoryName: isPt ? 'Admissão e Preparação' : isRu ? 'Допуск и подготовка' : 'Admission & Preparation',
      title: isPt ? '06. Painel do TP — Visão Geral do Terminal' : isRu ? '06. Dashboard — Рабочее место TP' : '06. Dashboard — TP Operational Terminal',
      description: isPt ? 'Navegação prática pelo Dashboard de gestão do TP.' : isRu ? 'Практическое знакомство с интерфейсом Dashboard TP.' : 'Hands-on walkthrough of the TP management dashboard.',
      sections: [
        { id: 'sec_tp_06_1', title: isPt ? 'Painel Principal e Navegação' : isRu ? 'Главная панель и структура' : 'Main Dashboard Overview & Navigation' },
        { id: 'sec_tp_06_2', title: isPt ? 'Gestão de Requests, Leads e Jobs' : isRu ? 'Управление Requests, Leads, Jobs' : 'Managing Requests, Leads & Jobs' },
        { id: 'sec_tp_06_3', title: isPt ? 'Rede de Especialistas e Gestão de Hub' : isRu ? 'Специалисты и управление Hub' : 'Specialist Roster & Hub Management' },
        { id: 'sec_tp_06_4', title: isPt ? 'Chats, Notificações, Finanças, Academia e Suporte RP' : isRu ? 'Чат, уведомления, финансы, Academia, связь с RP' : 'Chat, Notifications, Financials, Academy & RP Help' },
      ]
    },

    // --- CATEGORY 3: TP WORKFLOW (07-12) ---
    {
      id: 'tp_mod_07',
      number: '07',
      category: 'workflow',
      categoryName: isPt ? 'Fluxo do TP' : isRu ? 'Рабочий процесс TP' : 'TP Workflow',
      title: isPt ? '07. Verificação de Especialista — Qualificação' : isRu ? '07. Specialist Verification — Верификация специалиста' : '07. Specialist Verification — Specialist Onboarding',
      description: isPt ? 'Documentos, elegibilidade, especializações e estatuto de verificado.' : isRu ? 'Документы, квалификация, территория, статус Verified.' : 'Document audits, qualification standards, and Verified status.',
      sections: [
        { id: 'sec_tp_07_1', title: isPt ? 'Requisitos do Especialista, Documentos e Estatuto Fiscal' : isRu ? 'Требования к специалисту, документы, статус' : 'Specialist Criteria, Documents & Tax Status' },
        { id: 'sec_tp_07_2', title: isPt ? 'Qualificação, Categorias de Trabalho e Território' : isRu ? 'Квалификация, категории работ, территория' : 'Qualification, Service Categories & Territory' },
        { id: 'sec_tp_07_3', title: isPt ? 'Disponibilidade e Dados de Contacto' : isRu ? 'Доступность и контактные данные' : 'Availability & Contact Validation' },
        { id: 'sec_tp_07_4', title: isPt ? 'Estatuto Verified vs Not Verified e Acesso a Leads' : isRu ? 'Статус Verified / Not Verified и допуск к Leads' : 'Verified / Not Verified Status & Lead Eligibility' },
      ]
    },
    {
      id: 'tp_mod_08',
      number: '08',
      category: 'workflow',
      categoryName: isPt ? 'Fluxo do TP' : isRu ? 'Рабочий процесс TP' : 'TP Workflow',
      title: isPt ? '08. Receção de Pedido — Processamento de Requests' : isRu ? '08. Receiving a Request — Получение заявки' : '08. Receiving a Request — Request Handling',
      description: isPt ? 'Canais de entrada: Portal, Telefone e WhatsApp. NordBase é o sistema de registo.' : isRu ? 'Каналы: Portal, Phone, WhatsApp. NordBase — система учёта.' : 'Inbound channels: Portal, Phone, WhatsApp. NordBase as system of record.',
      sections: [
        { id: 'sec_tp_08_1', title: isPt ? 'Canais de Entrada: Portal, Telefone e WhatsApp' : isRu ? 'Каналы поступления: Portal, Phone, WhatsApp' : 'Inbound Channels: Portal, Phone & WhatsApp' },
        { id: 'sec_tp_08_2', title: isPt ? 'Procedimento Inicial do TP ao receber um Request' : isRu ? 'Первичные действия TP при получении Request' : 'Initial TP Action Protocol upon Inbound Request' },
        { id: 'sec_tp_08_3', title: isPt ? 'Recolha de Informação Obrigatória no NordBase' : isRu ? 'Какую информацию получить и зафиксировать' : 'Mandatory Information Collection & Recording' },
        { id: 'sec_tp_08_4', title: isPt ? 'Princípio: Comunicação em Canais vs NordBase como Sistema de Registo' : isRu ? 'Принцип: WhatsApp/телефон — каналы, NordBase — система учёта' : 'Principle: Communication Channels vs System of Record' },
      ]
    },
    {
      id: 'tp_mod_09',
      number: '09',
      category: 'workflow',
      categoryName: isPt ? 'Fluxo do TP' : isRu ? 'Рабочий процесс TP' : 'TP Workflow',
      title: isPt ? '09. Verificação do Cliente — Validação' : isRu ? '09. Customer Verification — Верификация заказчика' : '09. Customer Verification — Customer Audit',
      description: isPt ? 'Confirmação direta e viva do cliente, morada e necessidade real antes de criar o Lead.' : isRu ? 'Подтверждение реального заказчика, проблемы, адреса и деталей по живой связи.' : 'Live validation of customer identity, issue, location, and timeframe.',
      sections: [
        { id: 'sec_tp_09_1', title: isPt ? 'Validação da Realidade do Cliente e do Problema' : isRu ? 'Подтверждение заказчика и проблемы' : 'Verifying Customer Authenticity & Issue Reality' },
        { id: 'sec_tp_09_2', title: isPt ? 'Confirmação de Morada, Prazos e Detalhes da Obra' : isRu ? 'Подтверждение адреса, сроков и деталей' : 'Address, Timeline & Technical Scope Validation' },
        { id: 'sec_tp_09_3', title: isPt ? 'Importância da Ligação em Direto / Chamada de Voz' : isRu ? 'Важность живой связи с заказчиком' : 'Crucial Role of Live Phone Communication' },
        { id: 'sec_tp_09_4', title: isPt ? 'Regra Zero: Proibição de Envio de Pedidos Não Verificados' : isRu ? 'Правило: NordBase не передаёт неподтверждённые заявки' : 'Zero Unverified Lead Transfer Protocol' },
      ]
    },
    {
      id: 'tp_mod_10',
      number: '10',
      category: 'workflow',
      categoryName: isPt ? 'Fluxo do TP' : isRu ? 'Рабочий процесс TP' : 'TP Workflow',
      title: isPt ? '10. Criação de Lead — Formatação de Lead Qualificado' : isRu ? '10. Lead Creation — Создание Lead' : '10. Lead Creation — Qualified Lead Formatting',
      description: isPt ? 'Como formatar um Lead claro para que o especialista entenda o trabalho antes de aceitar.' : isRu ? 'Оформление квалифицированного Lead с полной информацией для специалиста.' : 'Structuring clear leads allowing specialists to evaluate job scope prior to purchase.',
      sections: [
        { id: 'sec_tp_10_1', title: isPt ? 'Estrutura Obrigatória do Lead Qualificado' : isRu ? 'Обязательная структура квалифицированного Lead' : 'Mandatory Data Structure of Qualified Lead' },
        { id: 'sec_tp_10_2', title: isPt ? 'Categoria, Descrição, Morada, Horário e Requisitos' : isRu ? 'Категория, описание, адрес, время, требования' : 'Category, Description, Address, Timeframe & Specs' },
        { id: 'sec_tp_10_3', title: isPt ? 'Condições Adicionais e Confirmação do Cliente' : isRu ? 'Дополнительные условия и подтверждение заказчика' : 'Additional Conditions & Customer Approval' },
        { id: 'sec_tp_10_4', title: isPt ? 'Princípio: O especialista deve compreender o trabalho antes de aceitar' : isRu ? 'Принцип: специалист понимает работу до её принятия' : 'Principle: Specialist understands job before accepting' },
      ]
    },
    {
      id: 'tp_mod_11',
      number: '11',
      category: 'workflow',
      categoryName: isPt ? 'Fluxo do TP' : isRu ? 'Рабочий процесс TP' : 'TP Workflow',
      title: isPt ? '11. Seleção de Especialista — Algoritmo de Correspondência' : isRu ? '11. Specialist Selection — Подбор специалиста' : '11. Specialist Selection — Matching Algorithm',
      description: isPt ? 'Critérios de seleção: qualificação, categoria, território, disponibilidade e reputação.' : isRu ? 'Критерии подбора подходящего специалиста без мифов о «самом дешёвом».' : 'Selection based on qualification, territory, availability, and reputation.',
      sections: [
        { id: 'sec_tp_11_1', title: isPt ? 'Critérios de Correspondência: Qualificação, Categoria e Território' : isRu ? 'Критерии: квалификация, категория, территория' : 'Matching Criteria: Qualification, Category & Territory' },
        { id: 'sec_tp_11_2', title: isPt ? 'Verificação de Disponibilidade, Experiência e Reputação' : isRu ? 'Доступность, опыт и репутация' : 'Availability, Experience & Reputation Matching' },
        { id: 'sec_tp_11_3', title: isPt ? 'Rejeição dos mitos de «mais barato» ou «mais próximo»' : isRu ? 'Отказ от принципа «самый дешёвый» или «самый близкий»' : 'Rejecting "Cheapest" or "Closest" Selection Patterns' },
        { id: 'sec_tp_11_4', title: isPt ? 'Critério Fundamental: O especialista certo para o trabalho certo' : isRu ? 'Главный критерий: подходящий специалист для конкретной работы' : 'Core Rule: Right Specialist for Specific Work' },
      ]
    },
    {
      id: 'tp_mod_12',
      number: '12',
      category: 'workflow',
      categoryName: isPt ? 'Fluxo do TP' : isRu ? 'Рабочий процесс TP' : 'TP Workflow',
      title: isPt ? '12. Transmissão do Lead — Oferta ao Especialista' : isRu ? '12. Lead Offer — Передача Lead специалисту' : '12. Lead Offer — Lead Dispatch & Conversion',
      description: isPt ? 'Envio do Lead, estados Accept/Decline, procuras de substituição e transição para Job.' : isRu ? 'Передача Lead, Accept/Decline, поиск замены, переход в статус Job.' : 'Offer dispatch, Accept/Decline responses, replacement protocol, and Job conversion.',
      sections: [
        { id: 'sec_tp_12_1', title: isPt ? 'Envio do Lead e Notificação do Especialista' : isRu ? 'Отправка Lead и уведомление специалиста' : 'Lead Offer Dispatch & Specialist Alerting' },
        { id: 'sec_tp_12_2', title: isPt ? 'Fluxo de Resposta: Accept vs Decline e Tempos de Espera' : isRu ? 'Ответ специалиста: Accept / Decline, ожидания' : 'Response Flow: Accept, Decline & Timers' },
        { id: 'sec_tp_12_3', title: isPt ? 'Procedimento em caso de Recusa e Procura de Substituição' : isRu ? 'Отказ, поиск замены, повторная передача' : 'Decline Handling, Search for Alternative & Re-dispatch' },
        { id: 'sec_tp_12_4', title: isPt ? 'Transição Fundamental de Estado: Lead → Job' : isRu ? 'Переход статуса: Lead → Job после принятия' : 'Core Status Transition: Lead → Job Upon Acceptance' },
      ]
    },
    {
      id: 'tp_mod_13',
      number: '13',
      category: 'job_ops',
      categoryName: isPt ? 'Operações de Job' : isRu ? 'Работа с Job' : 'Job Operations',
      title: isPt ? '13. Gestão de Job — Acompanhamento Operacional' : isRu ? '13. Job Management — Работа с Job' : '13. Job Management — Execution Supervision',
      description: isPt ? 'Criação do Job, confirmação da visita, comunicação e controlo do estado.' : isRu ? 'Создание Job, подтверждение встречи, коммуникация, контроль статуса.' : 'Job creation, meeting confirmations, messaging, and status tracking.',
      sections: [
        { id: 'sec_tp_13_1', title: isPt ? 'Criação de Job e Confirmação da Visita do Especialista' : isRu ? 'Создание Job и подтверждение встречи' : 'Job Initialization & Meeting Confirmation' },
        { id: 'sec_tp_13_2', title: isPt ? 'Comunicação Tripartida e Acompanhamento do Processo' : isRu ? 'Коммуникация в ходе работы и контроль процесса' : 'Communication Standards & Monitoring' },
        { id: 'sec_tp_13_3', title: isPt ? 'Atualização de Estados e Procedimento de Finalização' : isRu ? 'Изменение статусов и подготовка к завершению' : 'Status Transitions & Closure Protocol' },
      ]
    },
    {
      id: 'tp_mod_14',
      number: '14',
      category: 'job_ops',
      categoryName: isPt ? 'Operações de Job' : isRu ? 'Работа с Job' : 'Job Operations',
      title: isPt ? '14. Encontro Cliente-Especialista — Reunião Inicial' : isRu ? '14. Customer-Specialist Meeting — Встреча на объекте' : '14. Customer-Specialist Meeting — Initial On-Site Meeting',
      description: isPt ? 'Chegada ao local, avaliação do trabalho, orçamento e confirmação do início.' : isRu ? 'Прибытие на место, оценка объема, согласование сметы и подтверждение старта.' : 'Arrival on site, scope assessment, price confirmation, and job authorization.',
      sections: [
        { id: 'sec_tp_14_1', title: isPt ? 'Chegada ao Local e Pontualidade' : isRu ? 'Прибытие на место и пунктуальность' : 'On-Site Arrival & Punctuality Protocols' },
        { id: 'sec_tp_14_2', title: isPt ? 'Avaliação do Trabalho e Confirmação do Valor' : isRu ? 'Оценка объема и окончательное согласование цены' : 'Scope Assessment & Final Price Confirmation' },
        { id: 'sec_tp_14_3', title: isPt ? 'Confirmação do Início dos Trabalhos' : isRu ? 'Подтверждение начала работ в системе' : 'Job Start Authorization & System Logging' },
      ]
    },
    {
      id: 'tp_mod_15',
      number: '15',
      category: 'job_ops',
      categoryName: isPt ? 'Operações de Job' : isRu ? 'Работа с Job' : 'Job Operations',
      title: isPt ? '15. Execução do Trabalho — Conclusão e Entrega' : isRu ? '15. Work in Progress — Выполнение и завершение' : '15. Work in Progress — Execution & Completion',
      description: isPt ? 'Acompanhamento do progresso, resolução de alterações e encerramento do Job.' : isRu ? 'Контроль хода работ, изменение параметров и закрытие заявки.' : 'Monitoring execution, scope adjustments, customer sign-off, and closure.',
      sections: [
        { id: 'sec_tp_15_1', title: isPt ? 'Acompanhamento do Progresso e Comunicação' : isRu ? 'Контроль выполнения и поддержка связи' : 'Execution Monitoring & Communication Flow' },
        { id: 'sec_tp_15_2', title: isPt ? 'Alterações de Âmbito e Trabalhos Adicionais' : isRu ? 'Изменение объема работ и дополнительные услуги' : 'Scope Changes & Additional Services Management' },
        { id: 'sec_tp_15_3', title: isPt ? 'Conclusão do Trabalho e Confirmação do Cliente' : isRu ? 'Завершение работ и подтверждение заказчика' : 'Job Completion, Sign-Off & Status Closure' },
      ]
    },

    // --- CATEGORY 5: EDGE CASES & MODERATION (16-20) ---
    {
      id: 'tp_mod_16',
      number: '16',
      category: 'edge_cases',
      categoryName: isPt ? 'Casos Especiais e Segurança' : isRu ? 'Нестандартные ситуации' : 'Edge Cases & Security',
      title: isPt ? '16. Cancelamentos e Faltas — Gestão de Imprevistos' : isRu ? '16. Cancellations & No-Show — Отмены и неявка' : '16. Cancellations & No-Show — Handling Interruptions',
      description: isPt ? 'Procedimentos para cancelamentos do cliente, especialista, faltas no local e reagendamentos.' : isRu ? 'Сценарии: отмена заказчиком/специалистом, отсутствие на месте, перенос времени.' : 'Handling customer cancellations, specialist cancellations, site no-shows, and rescheduling.',
      sections: [
        { id: 'sec_tp_16_1', title: isPt ? 'Cancelamento pelo Cliente' : isRu ? 'Отмена заказчиком' : 'Customer Cancellation Protocol' },
        { id: 'sec_tp_16_2', title: isPt ? 'Cancelamento pelo Especialista' : isRu ? 'Отмена специалистом' : 'Specialist Cancellation Protocol' },
        { id: 'sec_tp_16_3', title: isPt ? 'Ausência do Cliente vs Falta do Especialista (No-Show)' : isRu ? 'Неявка заказчика / Неявка специалиста' : 'Customer No-Show vs Specialist No-Show' },
        { id: 'sec_tp_16_4', title: isPt ? 'Reagendamento de Horários' : isRu ? 'Перенос времени встречи' : 'Rescheduling Protocols' },
      ]
    },
    {
      id: 'tp_mod_17',
      number: '17',
      category: 'edge_cases',
      categoryName: isPt ? 'Casos Especiais e Segurança' : isRu ? 'Нестандартные ситуации' : 'Edge Cases & Security',
      title: isPt ? '17. Situações de Conflito — Litígios Comerciais' : isRu ? '17. Disputes — Спорные ситуации' : '17. Disputes — Customer & Specialist Disputes',
      description: isPt ? 'A NordBase NÃO é parte do contrato comercial entre Cliente e Especialista.' : isRu ? 'NordBase не является стороной договора. TP фиксирует факты и сохраняет нейтралитет.' : 'Understanding the boundary between NordBase and the commercial contract between Customer and Specialist.',
      sections: [
        { id: 'sec_tp_17_1', title: isPt ? 'Princípio Fundamental: NordBase Não É Parte do Contrato' : isRu ? 'NordBase не является стороной договора' : 'NordBase Is Not a Party to Commercial Contracts' },
        { id: 'sec_tp_17_2', title: isPt ? 'Litígios Comerciais Típicos' : isRu ? 'Типовые коммерческие споры' : 'Typical Commercial Disputes' },
        { id: 'sec_tp_17_3', title: isPt ? 'O que o TP NÃO Pode Fazer vs O que o TP PODE Fazer' : isRu ? 'Что TP НЕ МОЖЕТ делать vs Что TP МОЖЕТ делать' : 'What TP Must NOT Do vs What TP CAN Do' },
        { id: 'sec_tp_17_4', title: isPt ? 'Quando a NordBase Pode Intervir' : isRu ? 'Когда NordBase может вмешаться' : 'When NordBase Can Intervene' },
      ]
    },
    {
      id: 'tp_mod_18',
      number: '18',
      category: 'edge_cases',
      categoryName: isPt ? 'Casos Especiais e Segurança' : isRu ? 'Нестандартные ситуации' : 'Edge Cases & Security',
      title: isPt ? '18. Reclamações e Moderação — Manutenção do Serviço' : isRu ? '18. Moderation — Модерация и жалобы' : '18. Complaints & Moderation — Service Quality Audit',
      description: isPt ? 'Gestão de reclamações, moderação de perfis e conduta profissional na rede.' : isRu ? 'Обработка жалоб, проверка нарушений и модерация профилей специалистов.' : 'Handling quality complaints, platform policy compliance, and profile moderation.',
      sections: [
        { id: 'sec_tp_18_1', title: isPt ? 'Processamento de Reclamações de Qualidade' : isRu ? 'Поступившие жалобы на качество' : 'Quality Complaint Processing' },
        { id: 'sec_tp_18_2', title: isPt ? 'Moderação de Perfil de Especialista e Suspensão' : isRu ? 'Модерация профиля и временная блокировка' : 'Specialist Profile Moderation & Suspension' },
        { id: 'sec_tp_18_3', title: isPt ? 'Prevenção de Abuso da Plataforma' : isRu ? 'Предотвращение нарушений и обхода платформы' : 'Platform Policy Compliance & Anti-Abuse' },
      ]
    },
    {
      id: 'tp_mod_19',
      number: '19',
      category: 'edge_cases',
      categoryName: isPt ? 'Casos Especiais e Segurança' : isRu ? 'Нестандартные ситуации' : 'Edge Cases & Security',
      title: isPt ? '19. Regras de Comunicação — Padrões e Tradutor IA' : isRu ? '19. Communication Rules — Правила общения' : '19. Communication Rules — Standards & AI Translation',
      description: isPt ? 'Comunicação profissional, canais oficiais, barreira linguística e tradutor inteligente.' : isRu ? 'Стандарты общения, языковой барьер, каналы связи и встроенный переводчик.' : 'Professional communication standards, handling language barriers, and AI translation.',
      sections: [
        { id: 'sec_tp_19_1', title: isPt ? 'Padrões de Comunicação Profissional' : isRu ? 'Стандарты профессионального общения' : 'Professional Tone & Protocol' },
        { id: 'sec_tp_19_2', title: isPt ? 'Superação de Barreiras Linguísticas' : isRu ? 'Преодоление языкового барьера' : 'Handling Multilingual Interactions' },
        { id: 'sec_tp_19_3', title: isPt ? 'Uso do Tradutor IA nos Chats NordBase' : isRu ? 'Использование AI-переводчика в чатах' : 'AI Translator Integration in NordBase Chats' },
      ]
    },
    {
      id: 'tp_mod_20',
      number: '20',
      category: 'edge_cases',
      categoryName: isPt ? 'Casos Especiais e Segurança' : isRu ? 'Нестандартные ситуации' : 'Edge Cases & Security',
      title: isPt ? '20. Pagamentos e Fluxo Financeiro — Lead Fee e Comissão' : isRu ? '20. Payments & Money Flow — Платежи и комиссия' : '20. Payments & Money Flow — Lead Fee & Commissions',
      description: isPt ? 'Modelo financeiro: Lead Fee do especialista, taxa de 40% do TP e liquidação via Stripe.' : isRu ? 'Финансовая модель: плата за лид, 40% комиссия TP и выплаты через Stripe.' : 'Financial model: specialist Lead Fee, 40% TP commission, and Stripe payout settlement.',
      sections: [
        { id: 'sec_tp_20_1', title: isPt ? 'Modelo de Negócio NordBase: Lead Fee do Especialista' : isRu ? 'Финансовая модель NordBase: оплата за лид' : 'NordBase Business Model: Specialist Lead Fee' },
        { id: 'sec_tp_20_2', title: isPt ? 'Distribuição de Receita: 40% de Comissão para o TP' : isRu ? 'Распределение дохода: 40% комиссия TP' : 'Revenue Share: 40% TP Lead Fee Commission' },
        { id: 'sec_tp_20_3', title: isPt ? 'Processamento via Stripe e Prazos de Transferência' : isRu ? 'Проведение платежей через Stripe и вывод средств' : 'Stripe Payout Settlement & Banking Schedules' },
      ]
    },

    // --- CATEGORY 6: GOVERNANCE & ESCALATION (21-23) ---
    {
      id: 'tp_mod_21',
      number: '21',
      category: 'governance',
      categoryName: isPt ? 'Gestão e Escalamento' : isRu ? 'Управление' : 'Governance & Escalation',
      title: isPt ? '21. TP e RP — Trabalho com o Parceiro Regional' : isRu ? '21. TP & RP — Работа с региональным партнером' : '21. TP & RP — Working With the Regional Partner',
      description: isPt ? 'Responsabilidades do TP, apoio do RP, quando contactar e cooperação em equipa.' : isRu ? 'Зоны ответственности TP и RP, когда обращаться к RP, командная работа.' : 'Responsibilities of TP vs RP, support triggers, non-escalation guidelines, and teamwork.',
      sections: [
        { id: 'sec_tp_21_1', title: isPt ? 'Responsabilidade do TP e Autonomia de Decisão' : isRu ? 'Ответственность TP и самостоятельность' : 'TP Responsibility & Independent Decision Authority' },
        { id: 'sec_tp_21_2', title: isPt ? 'Responsabilidade do RP e Suporte Regional' : isRu ? 'Ответственность RP и региональная поддержка' : 'RP Responsibility & Regional Operational Support' },
        { id: 'sec_tp_21_3', title: isPt ? 'Quando Contactar o RP vs Não Escalar' : isRu ? 'Когда обращаться к RP и когда не эскалировать' : 'When to Contact RP vs When NOT to Escalate' },
      ]
    },
    {
      id: 'tp_mod_22',
      number: '22',
      category: 'governance',
      categoryName: isPt ? 'Gestão e Escalamento' : isRu ? 'Управление' : 'Governance & Escalation',
      title: isPt ? '22. Escalamento — Quando e Como Escalar' : isRu ? '22. Escalation — Как и когда эскалировать' : '22. Escalation — When and How to Escalate',
      description: isPt ? 'Cadeia de escalamento TP → RP → Admin, recolha de factos e situações urgentes.' : isRu ? 'Схема TP → RP → Admin, сбор фактов, правильная эскалация и экстренные случаи.' : 'Hierarchy TP → RP → Admin, pre-escalation fact gathering, concise reporting, and emergency rules.',
      sections: [
        { id: 'sec_tp_22_1', title: isPt ? 'Cadeia de Escalamento Hierárquica: TP → RP → Admin / Super Admin' : isRu ? 'Схема эскалации: TP → RP → Admin / Super Admin' : 'Basic Escalation Hierarchy: TP → RP → Admin / Super Admin' },
        { id: 'sec_tp_22_2', title: isPt ? 'Recolha de Factos e Estrutura de Escalamento' : isRu ? 'Сбор фактов и структура обращения' : 'Pre-Escalation Checklist & Structured Communication' },
        { id: 'sec_tp_22_3', title: isPt ? 'Situações Urgentes de Segurança e Profissionalismo' : isRu ? 'Экстренная безопасность и профессионализм' : 'Urgent Safety Protocols & Professional Escalation Mindset' },
      ]
    },
    {
      id: 'tp_mod_23',
      number: '23',
      category: 'governance',
      categoryName: isPt ? 'Gestão e Escalamento' : isRu ? 'Управление' : 'Governance & Escalation',
      title: isPt ? '23. Qualidade e KPI — Medir o Desempenho do TP' : isRu ? '23. Quality & KPI — Оценка работы TP' : '23. Quality & KPI — Measuring TP Performance',
      description: isPt ? 'Métricas operacionais, qualidade vs quantidade, auto-auditoria e saúde do território.' : isRu ? 'Операционные показатели, качество превыше количества, самопроверка, здоровье территории.' : 'Operational metrics, quality over quantity, self-audit questions, and territory health.',
      sections: [
        { id: 'sec_tp_23_1', title: isPt ? 'Objetivo dos KPIs: Qualidade, Confiança e Crescimento' : isRu ? 'Цель KPI: качество, доверие и рост территории' : 'Purpose of KPIs: Quality, Trust & Territory Growth' },
        { id: 'sec_tp_23_2', title: isPt ? 'Indicadores Operacionais e Prioridade da Qualidade' : isRu ? 'Показатели работы и качество превыше количества' : 'Operational Indicators & Quality Over Quantity' },
        { id: 'sec_tp_23_3', title: isPt ? 'Auto-Auditoria Pessoal e Saúde do Ecossistema' : isRu ? 'Самопроверка TP и здоровье экосистемы' : 'Personal Performance Review & Territory Health' },
      ]
    }
  ];
};

export const getRpCurriculum = (lang: string): Module[] => {
  return [
    // --- MODULE 0: RP FOUNDATION ---
    {
      id: 'rp_mod_00',
      number: '0',
      category: 'rp_foundation',
      categoryName: 'Section 0 — RP Foundation',
      title: 'Module 0 — RP Foundation',
      description: 'Who is an RP, Senior Partner mindset vs boss, personal characteristics, starting generator concept, and regional mission.',
      sections: [
        { id: 'sec_rp_00_1', title: '0.1 Who Is an RP?' },
        { id: 'sec_rp_00_2', title: '0.2 RP Is a Senior Partner, Not a Boss' },
        { id: 'sec_rp_00_3', title: '0.3 What Kind of Person Can Become an RP?' },
        { id: 'sec_rp_00_4', title: '0.4 The RP as the Regional Starting Generator' },
        { id: 'sec_rp_00_5', title: '0.5 The RP Mission' },
        { id: 'sec_rp_00_6', title: 'Practical Scenario — Module 0' },
      ]
    },

    // --- MODULE 1: NORDBASE PHILOSOPHY ---
    {
      id: 'rp_mod_01',
      number: '1',
      category: 'nordbase_mastery',
      categoryName: 'Section 1 — NordBase Mastery',
      title: 'Module 1 — NordBase Philosophy',
      description: 'Core idea in a changing world, mutual help, freedom & individuality, Win-Win principle, trust + responsibility, and RP stewardship.',
      sections: [
        { id: 'sec_rp_01_1', title: '1.1 Core Idea & The Changing World' },
        { id: 'sec_rp_01_2', title: '1.2 NordBase Philosophy: People Are Stronger Together' },
        { id: 'sec_rp_01_3', title: '1.3 Freedom and Individuality' },
        { id: 'sec_rp_01_4', title: '1.4 The Win-Win Principle' },
        { id: 'sec_rp_01_5', title: '1.5 Trust + Responsibility + Verification + Transparency' },
        { id: 'sec_rp_01_6', title: '1.6 RP Responsibility & Practical Scenario' },
      ]
    },

    // --- MODULE 2: GLOSSARY & SYSTEM ---
    {
      id: 'rp_mod_02',
      number: '2',
      category: 'nordbase_mastery',
      categoryName: 'Section 1 — NordBase Mastery',
      title: 'Module 2 — NordBase Glossary & System',
      description: 'Complete NordBase vocabulary, definitions, visual system flow from Request to Job closure, and role interactions.',
      sections: [
        { id: 'sec_rp_02_1', title: '2.1 Complete NordBase Glossary' },
        { id: 'sec_rp_02_2', title: '2.2 System Flow: Request → Verification → Lead → Job' },
        { id: 'sec_rp_02_3', title: '2.3 Role Dynamics & Practical Scenario' },
      ]
    },

    // --- MODULE 3: COMPLETE TP ACADEMY MASTERY ---
    {
      id: 'rp_mod_03',
      number: '3',
      category: 'nordbase_mastery',
      categoryName: 'Section 1 — NordBase Mastery',
      title: 'Module 3 — Complete TP Academy Mastery',
      description: 'Mandatory requirement: RP must know all 27 TP Academy modules, operational workflows, responsibilities, and boundaries.',
      sections: [
        { id: 'sec_rp_03_1', title: '3.1 Mandatory TP Academy Knowledge Requirement' },
        { id: 'sec_rp_03_2', title: '3.2 TP Operational Workflow & Responsibilities' },
        { id: 'sec_rp_03_3', title: '3.3 TP Boundaries (What TP Is NOT)' },
        { id: 'sec_rp_03_4', title: '3.4 TP Academy Reference Tracker & Practical Scenario' },
      ]
    },

    // --- MODULE 4: NORDBASE ROLES & RESPONSIBILITIES ---
    {
      id: 'rp_mod_04',
      number: '4',
      category: 'nordbase_mastery',
      categoryName: 'Section 1 — NordBase Mastery',
      title: 'Module 4 — NordBase Roles & Responsibilities',
      description: 'Operational structure: Customer → Specialist → TP → RP → Admin. RP authority, limits (TBD), boundaries, and dispute handling.',
      sections: [
        { id: 'sec_rp_04_1', title: '4.1 Operational Value Chain & Hierarchy' },
        { id: 'sec_rp_04_2', title: '4.2 Detailed Role Breakdown' },
        { id: 'sec_rp_04_3', title: '4.3 RP Authority & System Limits' },
        { id: 'sec_rp_04_4', title: '4.4 RP Boundaries & Practical Scenario' },
      ]
    },

    // --- MODULE 5: REGIONAL STRUCTURE ---
    {
      id: 'rp_mod_05',
      number: '5',
      category: 'building_region',
      categoryName: 'Section 2 — Building the Region',
      title: 'Module 5 — Regional Structure',
      description: 'Architecture of a NordBase Region (3–25 Hubs), Hub topology, creating Hubs, regional community, and expansion triggers.',
      sections: [
        { id: 'sec_rp_05_1', title: '5.1 Region & Hub Architecture (3–25 Hubs)' },
        { id: 'sec_rp_05_2', title: '5.2 Factors for Creating Hubs' },
        { id: 'sec_rp_05_3', title: '5.3 Building a Connected Regional Community' },
        { id: 'sec_rp_05_4', title: '5.4 Regional Expansion Triggers & Practical Scenario' },
      ]
    },

    // --- MODULE 6: CREATING HUBS ---
    {
      id: 'rp_mod_06',
      number: '6',
      category: 'building_region',
      categoryName: 'Section 2 — Building the Region',
      title: 'Module 6 — Creating Hubs',
      description: 'How to turn a geographic territory into a practical network of working Hubs, territory study, operational boundaries, structure, and readiness checklist.',
      sections: [
        { id: 'sec_rp_06_1', title: '6.1 What Is a Working Hub?' },
        { id: 'sec_rp_06_2', title: '6.2 What RP Must Understand Before Creating a Hub' },
        { id: 'sec_rp_06_3', title: '6.3 Practical Hub Boundaries & Operational Coverage' },
        { id: 'sec_rp_06_4', title: '6.4 Hub Structure & Readiness Checklist' },
        { id: 'sec_rp_06_5', title: 'Practical Scenario — Module 6' }
      ]
    },

    // --- MODULE 7: SELECTING & ONBOARDING TP ---
    {
      id: 'rp_mod_07',
      number: '7',
      category: 'selecting_tp',
      categoryName: 'Section 3 — Selecting & Onboarding TP',
      title: 'Module 7 — Selecting & Onboarding TP',
      description: 'Identifying capable TPs, conducting interviews, evaluating red flags, 8-step onboarding, and RP personal confirmation responsibility.',
      sections: [
        { id: 'sec_rp_07_1', title: '7.1 Building a Team: Key TP Qualities' },
        { id: 'sec_rp_07_2', title: '7.2 Conducting the TP Interview' },
        { id: 'sec_rp_07_3', title: '7.3 Red Flags & Holistic Evaluation' },
        { id: 'sec_rp_07_4', title: '7.4 TP Onboarding Steps & RP Responsibility' },
        { id: 'sec_rp_07_5', title: 'Practical Scenario — Module 7' }
      ]
    },

    // --- MODULE 8: KNOW YOUR TEAM ---
    {
      id: 'rp_mod_08',
      number: '8',
      category: 'selecting_tp',
      categoryName: 'Section 3 — Selecting & Onboarding TP',
      title: 'Module 8 — Know Your Team',
      description: 'Core RP principle: personally knowing every TP in the region, first conversation topics, trust architecture, and regional team identity.',
      sections: [
        { id: 'sec_rp_08_1', title: '8.1 Personal Introduction & RP-TP Relationship' },
        { id: 'sec_rp_08_2', title: '8.2 What RP Should Understand & First Conversation Topics' },
        { id: 'sec_rp_08_3', title: '8.3 Trust Architecture: Know → Trust → Support → Monitor' },
        { id: 'sec_rp_08_4', title: '8.4 Team Identity & Regional Cooperation' },
        { id: 'sec_rp_08_5', title: 'Practical Scenario — Module 8' }
      ]
    },

    // --- MODULE 9: TP TRAINING ---
    {
      id: 'rp_mod_09',
      number: '9',
      category: 'tp_training',
      categoryName: 'Section 4 — TP Training & Preparation',
      title: 'Module 9 — TP Training',
      description: 'Turning Academy graduates into confident TPs through RP training role, 7 training stages, practical observations, and final check.',
      sections: [
        { id: 'sec_rp_09_1', title: '9.1 RP Training Role & Methodology' },
        { id: 'sec_rp_09_2', title: '9.2 The 7 Training Stages (Knowledge to Difficult Situations)' },
        { id: 'sec_rp_09_3', title: '9.3 Practical Observation & Final Readiness Check' },
        { id: 'sec_rp_09_4', title: 'Practical Scenario — Module 9' }
      ]
    },

    // --- MODULE 10: PRACTICAL TP TRAINING & ROLE PLAY ---
    {
      id: 'rp_mod_10',
      number: '10',
      category: 'tp_training',
      categoryName: 'Section 4 — TP Training & Preparation',
      title: 'Module 10 — Practical TP Training & Role Play',
      description: '10 realistic operational role-plays, RP evaluation feedback, "One Hub — One Team" group exercise, and TP Training Foundation completion.',
      sections: [
        { id: 'sec_rp_10_1', title: '10.1 Training Environment & Role-Plays 1–5' },
        { id: 'sec_rp_10_2', title: '10.2 Role-Plays 6–10 (Barrier, Complaint, Priority, Support)' },
        { id: 'sec_rp_10_3', title: '10.3 RP Evaluation & "One Hub — One Team" Group Exercise' },
        { id: 'sec_rp_10_4', title: '10.4 TP Training Foundation Completion Checklist' }
      ]
    },

    // --- MODULE 11: TEAMWORK & MUTUAL SUPPORT ---
    {
      id: 'rp_mod_11',
      number: '11',
      category: 'regional_launch',
      categoryName: 'Section 5 — Regional Launch & Seeding',
      title: 'Module 11 — Teamwork & Mutual Support',
      description: 'Building a regional team where TPs cooperate rather than compete destructively, maintaining independence while building community, and fairness rules.',
      sections: [
        { id: 'sec_rp_11_1', title: '11.1 Core Principle: Healthy vs. Destructive Competition' },
        { id: 'sec_rp_11_2', title: '11.2 Why Mutual Support Matters in Daily Operations' },
        { id: 'sec_rp_11_3', title: '11.3 What RP Should Build & What RP Should Avoid' },
        { id: 'sec_rp_11_4', title: '11.4 Fairness, Objective Rules & Unbiased Lead Handling' },
        { id: 'sec_rp_11_5', title: 'Practical Scenario — Module 11' }
      ]
    },

    // --- MODULE 12: TEAM BUILDING THROUGH LOCAL MISSIONS ---
    {
      id: 'rp_mod_12',
      number: '12',
      category: 'regional_launch',
      categoryName: 'Section 5 — Regional Launch & Seeding',
      title: 'Module 12 — Team Building Through Local Missions',
      description: 'Creating practical team-building formats that produce real business value, local missions, territory field study, and practical brainstorming sessions.',
      sections: [
        { id: 'sec_rp_12_1', title: '12.1 The Concept of a Local Mission' },
        { id: 'sec_rp_12_2', title: '12.2 The 4-Part Mission Format' },
        { id: 'sec_rp_12_3', title: '12.3 Practical Brainstorming Session' },
        { id: 'sec_rp_12_4', title: '12.4 Local Launch Action List Task' }
      ]
    },

    // --- MODULE 13: REGIONAL LAUNCH STRATEGY ---
    {
      id: 'rp_mod_13',
      number: '13',
      category: 'regional_launch',
      categoryName: 'Section 5 — Regional Launch & Seeding',
      title: 'Module 13 — Regional Launch Strategy',
      description: 'Transforming a geographic territory into an operating NordBase region through a structured 6-phase launch sequence and practical launch plan.',
      sections: [
        { id: 'sec_rp_13_1', title: '13.1 Launch Principle: Structure → People → Specialists → Customers' },
        { id: 'sec_rp_13_2', title: '13.2 The 6 Launch Phases' },
        { id: 'sec_rp_13_3', title: '13.3 Practical RP Launch Plan Structure' },
        { id: 'sec_rp_13_4', title: '13.4 Real-World Action Over Perfection' }
      ]
    },

    // --- MODULE 14: THE SEEDING MONTH ---
    {
      id: 'rp_mod_14',
      number: '14',
      category: 'regional_launch',
      categoryName: 'Section 5 — Regional Launch & Seeding',
      title: 'Module 14 — The Seeding Month',
      description: 'The initial 4-week launch period of a new region, weekly operational focus, constraint removal, and the Seeding Month progress board.',
      sections: [
        { id: 'sec_rp_14_1', title: '14.1 Objective of the Seeding Month' },
        { id: 'sec_rp_14_2', title: '14.2 Week-by-Week Operational Sequence' },
        { id: 'sec_rp_14_3', title: '14.3 Daily RP Question: Identifying Constraints' },
        { id: 'sec_rp_14_4', title: '14.4 The Seeding Month Dashboard' }
      ]
    },

    // --- MODULE 15: BUILDING THE SPECIALIST BASE ---
    {
      id: 'rp_mod_15',
      number: '15',
      category: 'specialist_base',
      categoryName: 'Section 6 — Specialist & Customer Base',
      title: 'Module 15 — Building the Specialist Base',
      description: 'Creating the initial supply pool of verified independent Specialists in every Hub across real service categories.',
      sections: [
        { id: 'sec_rp_15_1', title: '15.1 What Is the Specialist Base?' },
        { id: 'sec_rp_15_2', title: '15.2 Recruitment Channels & Principles' },
        { id: 'sec_rp_15_3', title: '15.3 Verification Reference & Category Balance' },
        { id: 'sec_rp_15_4', title: '15.4 Practical Hub Specialist Plan Task' }
      ]
    },

    // --- MODULE 16: CUSTOMER ACQUISITION ---
    {
      id: 'rp_mod_16',
      number: '16',
      category: 'specialist_base',
      categoryName: 'Section 6 — Specialist & Customer Base',
      title: 'Module 16 — Customer Acquisition',
      description: 'Creating initial local Customer demand, active community outreach, core value proposition messaging, and local channel discovery.',
      sections: [
        { id: 'sec_rp_16_1', title: '16.1 Active Customer Acquisition Principle' },
        { id: 'sec_rp_16_2', title: '16.2 Local Acquisition Channels & TP Knowledge' },
        { id: 'sec_rp_16_3', title: '16.3 Simple Value Proposition & Learning from First Customers' },
        { id: 'sec_rp_16_4', title: '16.4 Practical Hub Customer Acquisition Plan Task' }
      ]
    },

    // --- MODULE 17: SMM & LOCAL MARKETING ---
    {
      id: 'rp_mod_17',
      number: '17',
      category: 'specialist_base',
      categoryName: 'Section 6 — Specialist & Customer Base',
      title: 'Module 17 — SMM & Local Marketing',
      description: 'Working with the SMM/marketing function, division of responsibility, local story sharing, online/offline feedback loops, and Final Practical Assignment.',
      sections: [
        { id: 'sec_rp_17_1', title: '17.1 Division of Responsibility: RP, TP & SMM' },
        { id: 'sec_rp_17_2', title: '17.2 Authentic Local Content & Online + Offline Combination' },
        { id: 'sec_rp_17_3', title: '17.3 Feedback Loops & Controlled Local Experiments' },
        { id: 'sec_rp_17_4', title: '17.4 Final Practical Assignment & Modules 11–17 Completion' }
      ]
    },

    // --- MODULE 18: FIRST LEADS & FIRST JOBS ---
    {
      id: 'rp_mod_18',
      number: '18',
      category: 'operations',
      categoryName: 'Section 7 — Regional Operations',
      title: 'Module 18 — First Leads & First Jobs',
      description: 'Transitioning from preparation to real work, RP observation role without micro-intervention, first Lead and Job complete lifecycle, and learning from early problems.',
      sections: [
        { id: 'sec_rp_18_1', title: '18.1 Transition: From Preparation to Real Work' },
        { id: 'sec_rp_18_2', title: '18.2 First Lead & Job Lifecycle Observation' },
        { id: 'sec_rp_18_3', title: '18.3 Early Problems as Learning Opportunities & Root Cause Analysis' },
        { id: 'sec_rp_18_4', title: 'Practical Scenario — Module 18' }
      ]
    },

    // --- MODULE 19: MOVING TO STABLE OPERATIONS ---
    {
      id: 'rp_mod_19',
      number: '19',
      category: 'operations',
      categoryName: 'Section 7 — Regional Operations',
      title: 'Module 19 — Moving to Stable Operations',
      description: 'Moving from launch mode to a stable regional plateau, RP role transition from doing to coordinating, warning signs of over-intervention, and regional stability checklist.',
      sections: [
        { id: 'sec_rp_19_1', title: '19.1 Progression: Launch → Growth → Stable Plateau' },
        { id: 'sec_rp_19_2', title: '19.2 The RP Generator Shift: Doing to Coordinating' },
        { id: 'sec_rp_19_3', title: '19.3 Warning Signs & Over-Intervention Risk' },
        { id: 'sec_rp_19_4', title: '19.4 Regional Stability Checklist' }
      ]
    },

    // --- MODULE 20: REGIONAL KPI & PERFORMANCE ---
    {
      id: 'rp_mod_20',
      number: '20',
      category: 'quality_growth',
      categoryName: 'Section 8 — Quality, Growth & Authorization',
      title: 'Module 20 — Regional KPI & Performance',
      description: 'Understanding regional health through data, reading systemic patterns (Situations A, B, C), structured review framework, and metric integrity.',
      sections: [
        { id: 'sec_rp_20_1', title: '20.1 Core Indicators & Operational Metrics' },
        { id: 'sec_rp_20_2', title: '20.2 Reading Systemic Patterns (Situations A, B, C)' },
        { id: 'sec_rp_20_3', title: '20.3 Regional Performance Review Structure' },
        { id: 'sec_rp_20_4', title: '20.4 Quality Over Manipulation & Metric Integrity' }
      ]
    },

    // --- MODULE 21: QUALITY CONTROL & HIDDEN CUSTOMER ---
    {
      id: 'rp_mod_21',
      number: '21',
      category: 'quality_growth',
      categoryName: 'Section 8 — Quality, Growth & Authorization',
      title: 'Module 21 — Quality Control & Hidden Customer',
      description: 'Protecting NordBase quality and trust, quality monitoring areas, Mystery Customer testing methodology, systemic testing rules, and RP integrity.',
      sections: [
        { id: 'sec_rp_21_1', title: '21.1 Quality Control & Trust Foundations' },
        { id: 'sec_rp_21_2', title: '21.2 Hidden Customer / Mystery Customer Methodology' },
        { id: 'sec_rp_21_3', title: '21.3 Systemic Testing & RP Integrity Rules' },
        { id: 'sec_rp_21_4', title: 'Practical Scenario — Module 21' }
      ]
    },

    // --- MODULE 22: PROBLEMS, CONFLICTS & CRISIS MANAGEMENT ---
    {
      id: 'rp_mod_22',
      number: '22',
      category: 'quality_growth',
      categoryName: 'Section 8 — Quality, Growth & Authorization',
      title: 'Module 22 — Problems, Conflicts & Crisis Management',
      description: 'Calm crisis leadership, separating facts/risk/responsibility/action, initial RP questions, escalation pathways, and handling commercial disputes.',
      sections: [
        { id: 'sec_rp_22_1', title: '22.1 First Principle: Facts → Risk → Responsibility → Action' },
        { id: 'sec_rp_22_2', title: '22.2 RP First Questions & Problem Assessment' },
        { id: 'sec_rp_22_3', title: '22.3 Structured Escalation & Commercial Dispute Boundaries' },
        { id: 'sec_rp_22_4', title: '22.4 Crisis Stabilization Cycle' }
      ]
    },

    // --- MODULE 23: CONTINUOUS IMPROVEMENT & REGIONAL GROWTH ---
    {
      id: 'rp_mod_23',
      number: '23',
      category: 'quality_growth',
      categoryName: 'Section 8 — Quality, Growth & Authorization',
      title: 'Module 23 — Continuous Improvement & Regional Growth',
      description: 'Continuous improvement cycle, local feedback to NordBase, responsible hub expansion criteria, and developing future RP leadership.',
      sections: [
        { id: 'sec_rp_23_1', title: '23.1 Continuous Improvement Cycle' },
        { id: 'sec_rp_23_2', title: '23.2 Local Eyes & Ears: Feedback to NordBase' },
        { id: 'sec_rp_23_3', title: '23.3 Responsible Expansion & New Hub Readiness' },
        { id: 'sec_rp_23_4', title: '23.4 Future RP Leadership Pipeline' }
      ]
    },

    // --- MODULE 24: FINAL RP ASSESSMENT & REGIONAL LAUNCH AUTHORIZATION ---
    {
      id: 'rp_mod_24',
      number: '24',
      category: 'quality_growth',
      categoryName: 'Section 8 — Quality, Growth & Authorization',
      title: 'Module 24 — Final RP Assessment & Regional Launch Authorization',
      description: 'Comprehensive 6-part final assessment, practical 30-day regional launch question, authorization status workflow, final RP message, and completion status.',
      sections: [
        { id: 'sec_rp_24_1', title: '24.1 Assessment Structure (Parts 1–6)' },
        { id: 'sec_rp_24_2', title: '24.2 Practical 30-Day Launch Readiness Test' },
        { id: 'sec_rp_24_3', title: '24.3 Regional Launch Authorization Workflow' },
        { id: 'sec_rp_24_4', title: '24.4 Final RP Message & Academy Completion Status' }
      ]
    }
  ];
};
