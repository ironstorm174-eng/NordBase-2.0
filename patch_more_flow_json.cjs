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
  "footerSMM": "SMM & Contacts coming soon",
  "footerSupport": "Support",
  "regionLabel": "Region",
  "accepted": "accepted",
  "hours": "Hours"
});

addFlowKeys(ptFile, {
  "footerSMM": "SMM & Contactos em breve",
  "footerSupport": "Suporte",
  "regionLabel": "Região",
  "accepted": "aceitou",
  "hours": "Horas"
});
