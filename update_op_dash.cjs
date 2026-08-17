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
  "createLead": "+ Create Lead",
  "reqWaiting": "new requests waiting",
  "todayEarnings": "Today's earnings (40% share)",
  "completedLeads": "Completed leads:",
  "avgShare": "Avg. Territory Partner share:",
  "serviceRequests": "Service Requests",
  "newestFirst": "Newest first",
  "byUrgency": "By urgency",
  "byCost": "By cost",
  "allCategories": "All categories",
  "noOrdersFound": "No orders found.",
  "noRequestSelected": "No request selected",
  "pressSpace": "or select any request from the left queue to begin work.",
  "serviceAddress": "Service address (Primary location)",
  "customerName": "Customer name",
  "contactPhone": "Contact phone",
  "reqQual": "Request qualification & complexity",
  "internalNotes": "Internal notes for dispatch team (Private)",
  "priceEst": "Price & fee estimation",
  "leadFee": "Lead fee (€)",
  "commAmount": "Commission Amount",
  "assignSpec": "Assign Specialist",
  "sendWA": "Send via WhatsApp",
  "sendWebChat": "Send to Web Chat",
  "transferRegion": "Transfer to other region",
  "finalizeOrder": "Finalize & Close Order",
  "chatCustomer": "Customer chat",
  "chatSpecialist": "Specialist chat",
  "teamNote": "Team note",
  "quickReply": "Quick reply:",
  "callingNow": "\"Calling now...\"",
  "specNotified": "\"Specialists notified...\"",
  
  "modalTitle": "Create New Dispatch Lead",
  "modalName": "Customer Name",
  "modalPhone": "Customer Phone",
  "modalCity": "City / Region",
  "modalAddress": "Exact Address / Locality",
  "modalCat": "Service Category",
  "modalDesc": "Problem Description / Requirements",
  "modalTools": "Specialist Required Tools / Parts",
  "modalPhotos": "Attach Photos or Documents",
  "modalDrag": "Drag & drop photos or click to browse",
  "modalFin": "Financial Configuration",
  "modalEst": "Estimated Job Value (€)",
  "modalLead": "Lead Price (€)",
  "modalRouting": "Routing Method",
  "modalGen": "General Marketplace Broadcasting",
  "modalDirect": "Direct Personal Offer",
  "modalCreate": "Create Dispatch Lead",
  "modalCancel": "Cancel"
};

const opKeysPT = {
  "createLead": "+ Criar Pedido",
  "reqWaiting": "novos pedidos em espera",
  "todayEarnings": "Ganhos de hoje (40% de comissão)",
  "completedLeads": "Pedidos concluídos:",
  "avgShare": "Comissão média (Parceiro):",
  "serviceRequests": "Pedidos de Serviço",
  "newestFirst": "Mais recentes",
  "byUrgency": "Por urgência",
  "byCost": "Por custo",
  "allCategories": "Todas as categorias",
  "noOrdersFound": "Nenhum pedido encontrado.",
  "noRequestSelected": "Nenhum pedido selecionado",
  "pressSpace": "ou selecione qualquer pedido da fila à esquerda para começar a trabalhar.",
  "serviceAddress": "Morada do serviço (Localização principal)",
  "customerName": "Nome do cliente",
  "contactPhone": "Telefone de contacto",
  "reqQual": "Qualificação do pedido e complexidade",
  "internalNotes": "Notas internas para a equipa (Privado)",
  "priceEst": "Estimativa de preço e taxas",
  "leadFee": "Taxa do lead (€)",
  "commAmount": "Valor da comissão",
  "assignSpec": "Atribuir Especialista",
  "sendWA": "Enviar por WhatsApp",
  "sendWebChat": "Enviar para o Web Chat",
  "transferRegion": "Transferir para outra região",
  "finalizeOrder": "Finalizar e Fechar Pedido",
  "chatCustomer": "Chat com cliente",
  "chatSpecialist": "Chat com especialista",
  "teamNote": "Nota da equipa",
  "quickReply": "Resposta rápida:",
  "callingNow": "\"A ligar agora...\"",
  "specNotified": "\"Especialistas notificados...\"",
  
  "modalTitle": "Criar Novo Pedido de Despacho",
  "modalName": "Nome do Cliente",
  "modalPhone": "Telefone do Cliente",
  "modalCity": "Cidade / Região",
  "modalAddress": "Morada Exata / Localidade",
  "modalCat": "Categoria de Serviço",
  "modalDesc": "Descrição do Problema / Requisitos",
  "modalTools": "Ferramentas / Peças Necessárias",
  "modalPhotos": "Anexar Fotos ou Documentos",
  "modalDrag": "Arraste e largue fotos ou clique para procurar",
  "modalFin": "Configuração Financeira",
  "modalEst": "Valor Estimado do Trabalho (€)",
  "modalLead": "Preço do Lead (€)",
  "modalRouting": "Método de Encaminhamento",
  "modalGen": "Transmissão Geral no Marketplace",
  "modalDirect": "Oferta Direta Pessoal",
  "modalCreate": "Criar Pedido",
  "modalCancel": "Cancelar"
};

updateJson(enFile, 'op', opKeysEN);
updateJson(ptFile, 'op', opKeysPT);

