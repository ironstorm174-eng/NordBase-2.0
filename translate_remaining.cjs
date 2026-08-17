const fs = require('fs');

const ptPath = 'src/locales/pt/translation.json';
const enPath = 'src/locales/en/translation.json';

const pt = JSON.parse(fs.readFileSync(ptPath, 'utf8'));
const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));

// CustomerFlow remaining
pt.flow = {
  "step1Title": "Selecione Local e Serviço",
  "step2Title": "Descreva o Pedido",
  "step3Title": "Coordenação Direta",
  "back": "Voltar",
  "submitRequest": "Submeter Pedido",
  "tpIdentified": "Parceiro Territorial (PT) Identificado",
  "tpFor": "Parceiro Territorial PT para",
  "quickTpContacts": "Contactos Rápidos do Parceiro Territorial",
  "whatsappPartner": "WhatsApp do Parceiro",
  "callPartner": "Ligar ao Parceiro",
  "googleSignIn": "Iniciar sessão com Google",
  "statusSubmitted": "Pedido Submetido",
  "statusReview": "Revisão do Parceiro Territorial",
  "statusMatch": "Correspondência de Especialista",
  "statusBroadcasting": "A transmitir à rede...",
  "statusResolution": "Resolução",
  "jobStatus": "Estado do Trabalho:",
  "estDuration": "Duração Est.:",
  "fixedPrice": "Preço Fixo Acordado:"
};

en.flow = {
  "step1Title": "Select Location & Service",
  "step2Title": "Describe the Request",
  "step3Title": "Direct Coordination",
  "back": "Back",
  "submitRequest": "Submit Request",
  "tpIdentified": "Territorial Partner (TP) Identified",
  "tpFor": "Territorial Partner TP for",
  "quickTpContacts": "Quick Territory Partner Contacts",
  "whatsappPartner": "WhatsApp Partner",
  "callPartner": "Call Partner",
  "googleSignIn": "Sign in with Google",
  "statusSubmitted": "Request Submitted",
  "statusReview": "Territory Partner Review",
  "statusMatch": "Specialist Match",
  "statusBroadcasting": "Broadcasting to network...",
  "statusResolution": "Resolution",
  "jobStatus": "Job Status:",
  "estDuration": "Est. Duration:",
  "fixedPrice": "Fixed Contract Price:"
};

// LoginScreen
pt.auth = {
  "changeRole": "Mudar de Papel",
  "accessWorkspace": "Aceder ao Espaço de Trabalho",
  "passwordReqs": "Requisitos da Palavra-passe:",
  "minChars": "Mínimo 8 caracteres",
  "lettersAndNumbers": "Deve conter letras e números"
};

en.auth = {
  "changeRole": "Change Role",
  "accessWorkspace": "Access Workspace",
  "passwordReqs": "Password Requirements:",
  "minChars": "Minimum 8 characters",
  "lettersAndNumbers": "Must contain letters and numbers"
};

// AddressAutocomplete
pt.address = {
  "placeholder": "Introduza a sua morada exata...",
  "searching": "A pesquisar moradas...",
  "missingNumber": "Não vê o número da porta?",
  "missingNumberTip": "Selecione a rua e introduza o número da porta ou apartamento manualmente.",
  "useEntered": "Usar morada introduzida:",
  "saved": "Guardado",
  "confirm": "Confirmar",
  "savedHint": "Morada guardada! Pode editar ou adicionar detalhes do apartamento.",
  "confirmHint": "Clique em 'Confirmar' ou pressione Enter para fixar esta morada.",
  "typeHint": "Escreva a sua morada, selecione das sugestões e adicione o número da porta/apartamento."
};

en.address = {
  "placeholder": "Enter your exact address...",
  "searching": "Searching addresses...",
  "missingNumber": "Don't see your house number?",
  "missingNumberTip": "Select your street, then type the house, block, or apartment number manually.",
  "useEntered": "Use entered address:",
  "saved": "Saved",
  "confirm": "Confirm",
  "savedHint": "Address saved! You can still type to edit or add block/apartment details.",
  "confirmHint": "Click the 'Confirm' button or press Enter to lock in this address.",
  "typeHint": "Type your address, select from suggestions, and append house/apartment number."
};

fs.writeFileSync(ptPath, JSON.stringify(pt, null, 2));
fs.writeFileSync(enPath, JSON.stringify(en, null, 2));
