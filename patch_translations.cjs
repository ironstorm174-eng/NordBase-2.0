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
  "contactLocationSection": "Contact & Location",
  "preferredContact": "Preferred Contact Method",
  "urgencyHeading": "Urgency & Preferred Schedule",
  "preferredTimeSlot": "Time slot:",
  "detailsMediaSection": "Details & Media",
  "noPrepayments": "No pre-payments required",
  "directDispatch": "Direct specialist dispatch",
  "errorMaxFiles": "You can only upload up to 10 photos or documents per request.",
  "errorOversizedFiles": "Some files exceed 15MB limit and were skipped: {{names}}",
  "errorUploadFailed": "File upload failed. Please try again."
});

addFlowKeys(ptFile, {
  "contactLocationSection": "Contacto e Localização",
  "preferredContact": "Método de Contacto Preferido",
  "urgencyHeading": "Urgência e Horário Preferido",
  "preferredTimeSlot": "Horário:",
  "detailsMediaSection": "Detalhes e Media",
  "noPrepayments": "Sem necessidade de pré-pagamentos",
  "directDispatch": "Despacho direto de especialista",
  "errorMaxFiles": "Apenas pode carregar até 10 fotos ou documentos por pedido.",
  "errorOversizedFiles": "Alguns ficheiros excedem o limite de 15MB e foram ignorados: {{names}}",
  "errorUploadFailed": "Falha no carregamento do ficheiro. Por favor, tente novamente."
});
