const fs = require('fs');
let geo = fs.readFileSync('src/lib/geo.ts', 'utf8');

const oldDistricts = `districts: [
      { id: '11-1', name: 'Baixa, Chiado & Rossio' },
      { id: '11-2', name: 'Bairro Alto, Príncipe Real & Santos' },
      { id: '11-3', name: 'Avenidas Novas & Saldanha' },
      { id: '11-4', name: 'Parque das Nações (Expo)' },
      { id: '11-5', name: 'Belém & Alcântara' },
      { id: '11-6', name: 'Alfama, Graça & Arroios' }
    ]`;

const newDistricts = `districts: [
      { id: '11-1', name: 'Ajuda' },
      { id: '11-2', name: 'Alcântara' },
      { id: '11-3', name: 'Alvalade' },
      { id: '11-4', name: 'Areeiro' },
      { id: '11-5', name: 'Arroios' },
      { id: '11-6', name: 'Avenidas Novas' },
      { id: '11-7', name: 'Beato' },
      { id: '11-8', name: 'Belém' },
      { id: '11-9', name: 'Benfica' },
      { id: '11-10', name: 'Campo de Ourique' },
      { id: '11-11', name: 'Campolide' },
      { id: '11-12', name: 'Carnide' },
      { id: '11-13', name: 'Estrela' },
      { id: '11-14', name: 'Lumiar' },
      { id: '11-15', name: 'Marvila' },
      { id: '11-16', name: 'Misericórdia' },
      { id: '11-17', name: 'Olivais' },
      { id: '11-18', name: 'Parque das Nações' },
      { id: '11-19', name: 'Penha de França' },
      { id: '11-20', name: 'Santa Clara' },
      { id: '11-21', name: 'Santa Maria Maior' },
      { id: '11-22', name: 'Santo António' },
      { id: '11-23', name: 'São Domingos de Benfica' },
      { id: '11-24', name: 'São Vicente' }
    ]`;

geo = geo.replace(oldDistricts, newDistricts);
fs.writeFileSync('src/lib/geo.ts', geo);
