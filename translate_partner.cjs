const fs = require('fs');

const pt = JSON.parse(fs.readFileSync('src/locales/pt/translation.json', 'utf8'));
const en = JSON.parse(fs.readFileSync('src/locales/en/translation.json', 'utf8'));

pt.partner = {
  "heroBadge": "Rede de Parceria Territorial • Portugal",
  "heroTitle": "Torne-se Parceiro da NordBase",
  "heroSubtitle": "Junte-se à principal rede de serviços do Algarve. Modelo comprovado, formação completa e fluxo contínuo de clientes. Escolha o seu nível de parceria.",
  "heroApplyRP": "Candidatar a Parceiro Regional",
  "heroApplyTP": "Tornar-se Parceiro Territorial",
  "rpTitle": "Parceiro Regional (RP)",
  "rpSubtitle": "Proprietário de Franquia Regional",
  "rpInvestment": "A partir de 50,000€",
  "rpFeature1": "Direitos exclusivos sobre a região ou cidade",
  "rpFeature2": "Recrutar e gerir Parceiros Territoriais",
  "rpFeature3": "Até 15% de partilha de receita sobre as vendas da região",
  "rpFeature4": "Ferramentas completas de gestão de negócios e marketing",
  "rpFeature5": "Licença para operar uma Agência NordBase completa",
  "tpTitle": "Parceiro Territorial (TP)",
  "tpSubtitle": "Operador Independente de Negócios",
  "tpInvestment": "A partir de 2,500€",
  "tpFeature1": "Território garantido e leads de clientes",
  "tpFeature2": "Modelo de negócio comprovado na sua área",
  "tpFeature3": "Ganhos elevados e independentes nos serviços",
  "tpFeature4": "Formação completa e certificação na nossa Academia",
  "tpFeature5": "Gestão e apoio de expedição da sede",
  "backBtn": "Voltar",
  "academyBadge": "Academia de Formação",
  "academyTitle": "Formação e Certificação Especializada",
  "academySubtitle": "A nossa Academia de Formação dedicada garante que domina os nossos padrões de serviço, ferramentas digitais e excelência no apoio ao cliente.",
  "module1": "Integração Digital",
  "module1Desc": "Aprenda a utilizar o sistema NordBase para gerir leads, trabalhos e clientes.",
  "module2": "Padrões de Serviço",
  "module2Desc": "Domine os protocolos de excelência da NordBase, desde a chegada até à faturação.",
  "module3": "Formação Prática",
  "module3Desc": "Formação prática no terreno com Parceiros Regionais experientes."
};

en.partner = {
  "heroBadge": "Territorial Partnership Network • Portugal",
  "heroTitle": "Become a NordBase Partner",
  "heroSubtitle": "Join the Algarve's leading service network. Proven model, comprehensive training, and steady customer flow. Choose your partnership tier.",
  "heroApplyRP": "Apply for Regional Partner",
  "heroApplyTP": "Become a Territorial Partner",
  "rpTitle": "Regional Partner (RP)",
  "rpSubtitle": "Regional Franchise Owner",
  "rpInvestment": "From €50,000",
  "rpFeature1": "Exclusive rights to region or city",
  "rpFeature2": "Recruit & manage Territorial Partners",
  "rpFeature3": "Up to 15% revenue share on region sales",
  "rpFeature4": "Full business management & marketing toolkit",
  "rpFeature5": "License to run a complete NordBase Agency",
  "tpTitle": "Territorial Partner (TP)",
  "tpSubtitle": "Independent Business Operator",
  "tpInvestment": "From €2,500",
  "tpFeature1": "Guaranteed territory & customer leads",
  "tpFeature2": "Proven business model in your area",
  "tpFeature3": "High, independent earnings on services",
  "tpFeature4": "Full training and certification in our Academy",
  "tpFeature5": "HQ dispatching and management support",
  "backBtn": "Back",
  "academyBadge": "Training Academy",
  "academyTitle": "Expert Training & Certification",
  "academySubtitle": "Our dedicated Training Academy ensures you master our service standards, digital tools, and customer excellence.",
  "module1": "Digital Onboarding",
  "module1Desc": "Learn to use the NordBase system to manage leads, jobs, and customers.",
  "module2": "Service Standards",
  "module2Desc": "Master NordBase excellence protocols, from arrival to billing.",
  "module3": "Practical Training",
  "module3Desc": "Hands-on, in-the-field training with experienced Regional Partners."
};

fs.writeFileSync('src/locales/pt/translation.json', JSON.stringify(pt, null, 2));
fs.writeFileSync('src/locales/en/translation.json', JSON.stringify(en, null, 2));
