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
  "contactCall": "Call",
  "contactPhoneCall": "Phone Call",
  "timingUrgent": "Emergency (ASAP / Within 2 hours)"
});

addFlowKeys(ptFile, {
  "contactCall": "Ligar",
  "contactPhoneCall": "Chamada Telefónica",
  "timingUrgent": "Emergência (ASAP / Até 2 horas)"
});
