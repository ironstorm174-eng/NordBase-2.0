const fs = require('fs');

const pt = JSON.parse(fs.readFileSync('src/locales/pt/translation.json', 'utf8'));
const en = JSON.parse(fs.readFileSync('src/locales/en/translation.json', 'utf8'));

pt.customerDashboard = {
  "title": "Os Seus Pedidos",
  "activeJobs": "Trabalhos Ativos",
  "completedJobs": "Trabalhos Concluídos",
  "noActiveJobs": "Não tem trabalhos ativos de momento.",
  "statusPending": "A aguardar parceiro",
  "statusAssigned": "Parceiro atribuído",
  "statusInProgress": "Em curso",
  "statusCompleted": "Concluído"
};

en.customerDashboard = {
  "title": "Your Requests",
  "activeJobs": "Active Jobs",
  "completedJobs": "Completed Jobs",
  "noActiveJobs": "No active jobs at the moment.",
  "statusPending": "Awaiting partner",
  "statusAssigned": "Partner assigned",
  "statusInProgress": "In progress",
  "statusCompleted": "Completed"
};

fs.writeFileSync('src/locales/pt/translation.json', JSON.stringify(pt, null, 2));
fs.writeFileSync('src/locales/en/translation.json', JSON.stringify(en, null, 2));
