const fs = require('fs');

const pt = JSON.parse(fs.readFileSync('src/locales/pt/translation.json', 'utf8'));
const en = JSON.parse(fs.readFileSync('src/locales/en/translation.json', 'utf8'));

pt.operator = {
  "dashboardTitle": "Portal de Operador",
  "activeRequests": "Pedidos Ativos",
  "history": "Histórico",
  "newRequest": "Novo Pedido",
  "searchPlaceholder": "Pesquisar pedidos por ID, nome, categoria...",
  "statusPending": "Pendente",
  "statusInProgress": "Em Curso",
  "statusCompleted": "Concluído",
  "assignSpecialist": "Atribuir Especialista",
  "noRequests": "Nenhum pedido encontrado"
};

en.operator = {
  "dashboardTitle": "Operator Portal",
  "activeRequests": "Active Requests",
  "history": "History",
  "newRequest": "New Request",
  "searchPlaceholder": "Search requests by ID, name, category...",
  "statusPending": "Pending",
  "statusInProgress": "In Progress",
  "statusCompleted": "Completed",
  "assignSpecialist": "Assign Specialist",
  "noRequests": "No requests found"
};

pt.specialist = {
  "dashboardTitle": "Gabinete Pro",
  "availableJobs": "Trabalhos Disponíveis",
  "myJobs": "Os Meus Trabalhos",
  "earnings": "Ganhos",
  "acceptJob": "Aceitar Trabalho",
  "completeJob": "Concluir Trabalho",
  "noJobs": "Nenhum trabalho disponível"
};

en.specialist = {
  "dashboardTitle": "Pro Cabinet",
  "availableJobs": "Available Jobs",
  "myJobs": "My Jobs",
  "earnings": "Earnings",
  "acceptJob": "Accept Job",
  "completeJob": "Complete Job",
  "noJobs": "No available jobs"
};

fs.writeFileSync('src/locales/pt/translation.json', JSON.stringify(pt, null, 2));
fs.writeFileSync('src/locales/en/translation.json', JSON.stringify(en, null, 2));
