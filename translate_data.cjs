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

pt.specialties = {
  'Plumber': 'Canalizador', 'Electrician': 'Eletricista', 'Handyman': 'Faz-tudo', 'Locksmith': 'Serralheiro', 'Carpenter': 'Carpinteiro', 'Painter': 'Pintor', 'Glazier': 'Vidraceiro', 'Blinds': 'Estores', 'Doors': 'Portas',
  'House Clean': 'Limpeza Doméstica', 'Office Clean': 'Limpeza de Escritório', 'Deep Clean': 'Limpeza Profunda', 'Window Clean': 'Limpeza de Janelas', 'Carpet Clean': 'Limpeza de Tapetes', 'Upholstery': 'Estofos', 'Airbnb Clean': 'Limpeza Airbnb',
  'Gardener': 'Jardineiro', 'Landscaper': 'Paisagista', 'Tree Surgeon': 'Cirurgião de Árvores', 'Irrigation': 'Irrigação', 'Lawn Care': 'Cuidado com o Relvado', 'Hedges': 'Sebes',
  'Mover': 'Empresa de Mudanças', 'Furniture': 'Móveis', 'Packing': 'Embalamento', 'Loading': 'Carregamento', 'Assembly': 'Montagem', 'Piano Mover': 'Transporte de Pianos',
  'Driver': 'Motorista', 'Airport': 'Aeroporto', 'Courier': 'Estafeta', 'Delivery': 'Entrega', 'Van Driver': 'Motorista de Carrinha', 'Chauffeur': 'Chauffeur',
  'Appliances': 'Eletrodomésticos', 'HVAC': 'AVAC', 'Refrigerator': 'Frigorífico', 'Washer': 'Máquina de Lavar', 'Dishwasher': 'Máquina de Lavar Louça', 'Oven': 'Forno', 'TV': 'TV', 'Computers': 'Computadores', 'Phones': 'Telemóveis',
  'Builder': 'Construtor', 'Mason': 'Pedreiro', 'Roofer': 'Telhador', 'Tiler': 'Ladrilhador', 'Drywall': 'Pladur', 'Concrete': 'Betão', 'Renovation': 'Renovação', 'Scaffolding': 'Andaime',
  'Pool Cleaner': 'Limpeza de Piscinas', 'Maintenance': 'Manutenção', 'Pool Repair': 'Reparação de Piscinas', 'Water Care': 'Tratamento de Água', 'Equipment': 'Equipamento',
  'Waiter': 'Empregado de Mesa', 'Bartender': 'Barman', 'Barista': 'Barista', 'Chef': 'Chef', 'Kitchen Help': 'Ajudante de Cozinha', 'Housekeeper': 'Governanta', 'Receptionist': 'Rececionista',
  'Babysitter': 'Babysitter', 'Elderly Care': 'Cuidado a Idosos', 'Home Care': 'Cuidados ao Domicílio', 'Disability': 'Deficiência', 'Pet Care': 'Cuidados com Animais', 'Dog Walker': 'Passeador de Cães',
  'English': 'Inglês', 'Portuguese': 'Português', 'Spanish': 'Espanhol', 'Music': 'Música', 'Piano': 'Piano', 'Guitar': 'Guitarra', 'Math': 'Matemática', 'IT': 'Informática', 'Programming': 'Programação', 'Fitness': 'Fitness', 'Yoga': 'Yoga',
  'Office Help': 'Apoio de Escritório', 'Accountant': 'Contabilista', 'Realtor': 'Agente Imobiliário', 'Photo': 'Fotografia', 'Video': 'Vídeo', 'Designer': 'Designer', 'Marketing': 'Marketing', 'Events': 'Eventos', 'Translator': 'Tradutor', 'Lawyer': 'Advogado', 'Legalization': 'Legalização', 'Other': 'Outro'
};

const enSpecialties = Object.keys(pt.specialties).reduce((acc, key) => {
  acc[key] = key;
  return acc;
}, {});
en.specialties = enSpecialties;

fs.writeFileSync('src/locales/pt/translation.json', JSON.stringify(pt, null, 2));
fs.writeFileSync('src/locales/en/translation.json', JSON.stringify(en, null, 2));
