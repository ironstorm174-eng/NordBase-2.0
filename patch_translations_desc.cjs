const fs = require('fs');

const ptFile = 'src/locales/pt/translation.json';
const enFile = 'src/locales/en/translation.json';

function addFlowKeys(filePath, newKeys) {
  const content = fs.readFileSync(filePath, 'utf8');
  const json = JSON.parse(content);
  
  if (json.flow) {
    Object.assign(json.flow, newKeys);
  }
  
  fs.writeFileSync(filePath, JSON.stringify(json, null, 2));
}

addFlowKeys(enFile, {
  "specialtyLabel": "Specialty",
  "urgencyLabel": "Urgency & Schedule",
  "contactLabel": "Preferred Contact"
});

addFlowKeys(ptFile, {
  "specialtyLabel": "Especialidade",
  "urgencyLabel": "Urgência e Horário",
  "contactLabel": "Contacto Preferido"
});
