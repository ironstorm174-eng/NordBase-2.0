const fs = require('fs');

const ptFile = 'src/locales/pt/translation.json';
const enFile = 'src/locales/en/translation.json';

function updateJson(filePath, ns, newKeys) {
  const content = fs.readFileSync(filePath, 'utf8');
  const json = JSON.parse(content);
  if (!json[ns]) json[ns] = {};
  Object.assign(json[ns], newKeys);
  fs.writeFileSync(filePath, JSON.stringify(json, null, 2));
}

const opKeysEN = {
  "completionChecklist": "Tripartite Order Completion Checklist",
  "specialist": "Specialist",
  "customer": "Customer",
  "waSpecialist": "WhatsApp Specialist",
  "noMsgChat": "No messages in this chat yet.",
  "selectReqChat": "Select a request to view chat messages.",
  "uploadedDoc": "Uploaded document",
  "download": "Download",
  "history": "History",
  "chat": "Chat",
  "files": "Files",
  "confirmedTP": "Confirmation & Rating (Visible to TP)",
  "waitConfirm": "Waiting for confirmation",
  "workDone": "Services performed, no claims",
  "workDoneSpec": "Work performed, payment received, no claims",
  "specRating": "Specialist Rating:"
};

const opKeysPT = {
  "completionChecklist": "Lista de Verificação de Conclusão Tripartida",
  "specialist": "Especialista",
  "customer": "Cliente",
  "waSpecialist": "WhatsApp Especialista",
  "noMsgChat": "Ainda sem mensagens neste chat.",
  "selectReqChat": "Selecione um pedido para ver as mensagens do chat.",
  "uploadedDoc": "Documento carregado",
  "download": "Descarregar",
  "history": "Histórico",
  "chat": "Chat",
  "files": "Ficheiros",
  "confirmedTP": "Confirmação e Avaliação (Visível para TP)",
  "waitConfirm": "Aguardando confirmação",
  "workDone": "Serviços realizados, sem reclamações",
  "workDoneSpec": "Trabalho realizado, pagamento recebido, sem reclamações",
  "specRating": "Avaliação do Especialista:"
};

updateJson(enFile, 'op', opKeysEN);
updateJson(ptFile, 'op', opKeysPT);

let code = fs.readFileSync('src/components/OperatorLeadsTerminal.tsx', 'utf8');

const replacements = [
  ['>Tripartite Order Completion Checklist #', '>{t("op.completionChecklist", "Tripartite Order Completion Checklist")} #'],
  ['>1. Specialist</', '>1. {t("op.specialist", "Specialist")}</'],
  ['>2. Customer</', '>2. {t("op.customer", "Customer")}</'],
  ['>💬 WhatsApp Specialist</', '>💬 {t("op.waSpecialist", "WhatsApp Specialist")}</'],
  ['>No messages in this chat yet.</', '>{t("op.noMsgChat", "No messages in this chat yet.")}</'],
  ['>Select a request to view chat messages.</', '>{t("op.selectReqChat", "Select a request to view chat messages.")}</'],
  ['>Uploaded document</', '>{t("op.uploadedDoc", "Uploaded document")}</'],
  ['>Download</', '>{t("op.download", "Download")}</'],
  ['>History</', '>{t("op.history", "History")}</'],
  ['>Chat</', '>{t("op.chat", "Chat")}</'],
  ['>Files (', '>{t("op.files", "Files")} ('],
  ['>Confirmação & Avaliação (Visível para TP)</', '>{t("op.confirmedTP", "Confirmation & Rating (Visible to TP)")}</'],
  ['Cliente:</', '{t("op.customer", "Customer")}:</'],
  ["? 'Serviços realizados, sem reclamações' : 'Aguardando confirmação'", "? t('op.workDone', 'Services performed, no claims') : t('op.waitConfirm', 'Waiting for confirmation')"],
  ['Especialista:</', '{t("op.specialist", "Specialist")}:</'],
  ["? 'Trabalho realizado, pagamento recebido, sem reclamações' : 'Aguardando confirmação'", "? t('op.workDoneSpec', 'Work performed, payment received, no claims') : t('op.waitConfirm', 'Waiting for confirmation')"],
  ['>Avaliação do Especialista:</', '>{t("op.specRating", "Specialist Rating:")}</']
];

for (const [find, replace] of replacements) {
  code = code.split(find).join(replace);
}

fs.writeFileSync('src/components/OperatorLeadsTerminal.tsx', code);
