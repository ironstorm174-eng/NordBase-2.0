const fs = require('fs');

const pt = JSON.parse(fs.readFileSync('src/locales/pt/translation.json', 'utf8'));
const en = JSON.parse(fs.readFileSync('src/locales/en/translation.json', 'utf8'));

pt.categories = {
  'Home Services': 'Serviços Domésticos',
  'Cleaning': 'Limpeza',
  'Gardening': 'Jardinagem',
  'Moving': 'Mudanças',
  'Transport': 'Transporte',
  'Repairs': 'Reparações',
  'Construction': 'Construção',
  'Pools': 'Piscinas',
  'Hospitality': 'Hotelaria',
  'Care': 'Cuidados',
  'Lessons': 'Aulas',
  'Business': 'Negócios'
};

en.categories = {
  'Home Services': 'Home Services',
  'Cleaning': 'Cleaning',
  'Gardening': 'Gardening',
  'Moving': 'Moving',
  'Transport': 'Transport',
  'Repairs': 'Repairs',
  'Construction': 'Construction',
  'Pools': 'Pools',
  'Hospitality': 'Hospitality',
  'Care': 'Care',
  'Lessons': 'Lessons',
  'Business': 'Business'
};

fs.writeFileSync('src/locales/pt/translation.json', JSON.stringify(pt, null, 2));
fs.writeFileSync('src/locales/en/translation.json', JSON.stringify(en, null, 2));
