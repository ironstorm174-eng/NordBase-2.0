const fs = require('fs');
const pt = JSON.parse(fs.readFileSync('src/locales/pt/translation.json', 'utf8'));
const en = JSON.parse(fs.readFileSync('src/locales/en/translation.json', 'utf8'));

pt.seo = {
  "homeTitle": "NordBase.pt - Serviços Locais Urgentes em Portugal",
  "homeDescription": "Despacho rápido e coordenação de serviços locais urgentes em Portugal. Ligue-se a eletricistas, canalizadores e técnicos de confiança.",
  "partnerTitle": "Franquia e Parcerias NordBase em Portugal",
  "partnerDescription": "Junte-se à NordBase como Parceiro Regional ou Territorial. Oportunidades exclusivas de negócios e fluxo contínuo de clientes em Portugal."
};

en.seo = {
  "homeTitle": "NordBase.pt - Urgent Local Services in Portugal",
  "homeDescription": "Quick dispatch and coordination of urgent local services in Portugal. Connect with reliable electricians, plumbers, and technicians.",
  "partnerTitle": "NordBase Franchise & Partnerships in Portugal",
  "partnerDescription": "Join NordBase as a Regional or Territorial Partner. Exclusive business opportunities and steady customer flow in Portugal."
};

fs.writeFileSync('src/locales/pt/translation.json', JSON.stringify(pt, null, 2));
fs.writeFileSync('src/locales/en/translation.json', JSON.stringify(en, null, 2));
