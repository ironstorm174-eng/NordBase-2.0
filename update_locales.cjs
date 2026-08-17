const fs = require('fs');

const ptPath = 'src/locales/pt/translation.json';
const enPath = 'src/locales/en/translation.json';

const ptData = JSON.parse(fs.readFileSync(ptPath, 'utf8'));
const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));

// Helper to deep merge objects
function mergeDeep(target, source) {
  for (const key in source) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      if (!target[key]) target[key] = {};
      mergeDeep(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  }
}

const ptAdditions = {
  flow: {
    requestTitle: "Solicitar {{specialty}}",
    fullName: "Nome Completo",
    fullNamePlaceholder: "ex: João Silva",
    phoneNumber: "Número de Telefone (Para chamada de verificação)",
    phonePlaceholder: "ex: 912 345 678",
    exactAddress: "Morada Exata",
    addressPlaceholder: "ex: Marina de Alvor, Bloco B Apt 412",
    requestDetails: "Detalhes do Pedido",
    detailsPlaceholder: "Descreva o que precisa de reparação, montagem ou limpeza.",
    attachments: "Anexos / Fotos e Documentos (Opcional)",
    dragDrop: "Arraste e largue fotos ou documentos aqui, ou clique para procurar",
    uploading: "A processar e a anexar ficheiros...",
    uploadSubtext: "Carregue fotos, relatórios de danos, recibos ou PDFs (até 10 ficheiros, máx. 15MB cada)",
    fileNum: "Ficheiro #{{num}}",
    removeFile: "Remover ficheiro",
    categoryDescFallback: "Despacho rápido e seguro. Sem pré-pagamentos necessários.",
    errorName: "Por favor, introduza o seu nome completo.",
    errorPhone: "Por favor, introduza um número de telefone válido.",
    errorAddress: "Por favor, introduza e confirme a sua morada exata.",
    errorDescription: "Por favor, descreva o que precisa de reparação, montagem ou limpeza."
  },
  address: {
    placeholder: "Introduza a sua morada exata...",
    searching: "A pesquisar moradas...",
    missingNumber: "Não vê o número da porta?",
    missingNumberTip: "Selecione a rua e introduza o número da porta ou apartamento manualmente.",
    useEntered: "Usar morada introduzida:",
    saved: "Guardado",
    confirm: "Confirmar",
    savedHint: "Morada guardada! Pode editar ou adicionar detalhes do apartamento.",
    confirmHint: "Clique em 'Confirmar' para fixar esta morada.",
    typeHint: "Escreva a sua morada, selecione das sugestões e adicione o número da porta/apartamento.",
    locateMe: "Usar a minha localização atual",
    clearAddress: "Limpar morada"
  },
  validation: {
    phoneEmpty: "Por favor, introduza um número de telefone de contacto.",
    phoneInvalidChars: "O número de telefone só pode conter dígitos, espaços, hífenes e um código de país '+' opcional.",
    phoneTooShort: "Número de telefone demasiado curto (mínimo 7 dígitos). Inclua o código de país (ex. +351 912 345 678).",
    phoneTooLong: "Número de telefone demasiado longo (máximo 15 dígitos). Verifique se há erros de digitação.",
    phoneMissingPlus: "Por favor, inclua o código de país a começar por '+' (ex. +351 para Portugal).",
    emailEmpty: "Por favor, introduza um endereço de e-mail.",
    emailMissingAt: "O endereço de e-mail deve conter '@' (ex. utilizador@exemplo.com).",
    emailInvalid: "Por favor, introduza um formato de e-mail válido (ex. utilizador@exemplo.com)."
  },
  auth: {
    orPhone: "OU CONTINUE COM TELEFONE",
    createAccount: "Criar Conta",
    signIn: "Iniciar Sessão",
    nameOrg: "Nome / Organização",
    nameOrgPlaceholder: "ex: Hotel Resort Lda ou João",
    phoneNumber: "Número de Telefone",
    phonePlaceholder: "ex: +351 912 345 678",
    createPassword: "Criar Palavra-passe",
    password: "Palavra-passe",
    min8Chars: "Mín. 8 carateres, letras e números",
    enterPassword: "Introduza a sua palavra-passe",
    confirmPassword: "Confirmar Palavra-passe",
    reEnterPassword: "Reintroduza a sua palavra-passe",
    username: "Nome de Utilizador",
    enterUsername: "Introduza o nome de utilizador",
    showPassword: "Mostrar palavra-passe",
    hidePassword: "Ocultar palavra-passe"
  },
  partner: {
    becomePartner: "Tornar-se Parceiro",
    learnMore: "Saber Mais",
    verifiedSpecialist: "Especialista Verificado",
    territorialPartner: "Parceiro Territorial",
    regionalPartner: "Parceiro Regional",
    becomeSpecialist: "Tornar-se Especialista",
    becomeRegionalPartner: "Tornar-se Parceiro Regional",
    offerServices: "Ofereça os seus serviços profissionais.",
    receiveRequests: "Receba pedidos de clientes qualificados.",
    chooseLeads: "Escolha quais os pedidos a aceitar.",
    setPrices: "Defina os seus próprios preços de serviço.",
    successNote: "O seu sucesso depende das suas competências, reputação e satisfação do cliente.",
    coordinateRequests: "Coordene pedidos de clientes.",
    supportSpecialists: "Apoie especialistas verificados.",
    maintainQuality: "Mantenha a qualidade do serviço.",
    developCommunity: "Desenvolva a comunidade NordBase na sua cidade.",
    developNetwork: "Desenvolva a rede NordBase em toda uma região.",
    supportTP: "Apoie Parceiros Territoriais.",
    expandNetwork: "Expanda a rede de especialistas verificados.",
    maintainRegionalQuality: "Mantenha padrões de qualidade regionais.",
    whyPartner: "Porquê Ser Parceiro da NordBase?",
    turnkeySoftware: "Software Chave na Mão",
    highDemand: "Elevada Procura de Clientes",
    qualityStandards: "Padrões de Qualidade",
    faqTitle: "Perguntas Frequentes",
    faqSubtitle: "Tudo o que precisa de saber sobre o Programa de Parceria da NordBase.",
    readyToBuild: "Pronto para Construir a NordBase no seu Território?"
  }
};

const enAdditions = {
  flow: {
    requestTitle: "Request {{specialty}}",
    fullName: "Full Name",
    fullNamePlaceholder: "e.g. Robert Vance",
    phoneNumber: "Phone Number (For verification call)",
    phonePlaceholder: "e.g. 912 345 678",
    exactAddress: "Exact Address",
    addressPlaceholder: "e.g. Alvor Marina, Block B Apt 412",
    requestDetails: "Request Details",
    detailsPlaceholder: "Describe what needs repair, assembly, or cleaning.",
    attachments: "Attachments / Photos & Documents (Optional)",
    dragDrop: "Drag & drop photos or documents here, or click to browse",
    uploading: "Processing and attaching files...",
    uploadSubtext: "Upload photos, damage reports, receipts, or PDFs (up to 10 files, max 15MB each)",
    fileNum: "File #{{num}}",
    removeFile: "Remove file",
    categoryDescFallback: "Fast, secure dispatch. No pre-payments required.",
    errorName: "Please enter your full name.",
    errorPhone: "Please enter a valid phone number.",
    errorAddress: "Please enter and confirm your exact address.",
    errorDescription: "Please describe what needs repair, assembly, or cleaning."
  },
  address: {
    placeholder: "Enter your exact address...",
    searching: "Searching addresses...",
    missingNumber: "Don't see house number?",
    missingNumberTip: "Select street, then type house or apartment number manually.",
    useEntered: "Use entered address:",
    saved: "Saved",
    confirm: "Confirm",
    savedHint: "Address saved! You can edit or add apartment details.",
    confirmHint: "Click 'Confirm' to pin this address.",
    typeHint: "Type your address, select from suggestions, and append house/apartment number.",
    locateMe: "Use my current location",
    clearAddress: "Clear address"
  },
  validation: {
    phoneEmpty: "Please enter a contact phone number.",
    phoneInvalidChars: "Phone number can only contain digits, spaces, hyphens, and an optional '+' country code.",
    phoneTooShort: "Phone number is too short (min 7 digits). Please include country code (e.g. +351 912 345 678).",
    phoneTooLong: "Phone number is too long (max 15 digits). Please check for typos.",
    phoneMissingPlus: "Please include country code starting with '+' (e.g. +351 for Portugal).",
    emailEmpty: "Please enter an email address.",
    emailMissingAt: "Email address must contain '@' (e.g. user@example.com).",
    emailInvalid: "Please enter a valid email address format (e.g. user@example.com)."
  },
  auth: {
    orPhone: "OR CONTINUE WITH PHONE",
    createAccount: "Create Account",
    signIn: "Sign In",
    nameOrg: "Name / Organization",
    nameOrgPlaceholder: "e.g. Resort Hotel Ltd or John",
    phoneNumber: "Phone Number",
    phonePlaceholder: "e.g. +351 912 345 678",
    createPassword: "Create Password",
    password: "Password",
    min8Chars: "Min. 8 chars, letters & numbers",
    enterPassword: "Enter your password",
    confirmPassword: "Confirm Password",
    reEnterPassword: "Re-enter your password",
    username: "Username",
    enterUsername: "Enter username",
    showPassword: "Show password",
    hidePassword: "Hide password"
  },
  partner: {
    becomePartner: "Become a Partner",
    learnMore: "Learn More",
    verifiedSpecialist: "Verified Specialist",
    territorialPartner: "Territorial Partner",
    regionalPartner: "Regional Partner",
    becomeSpecialist: "Become a Specialist",
    becomeRegionalPartner: "Become a Regional Partner",
    offerServices: "Offer your professional services.",
    receiveRequests: "Receive qualified customer requests.",
    chooseLeads: "Choose which leads to accept.",
    setPrices: "Set your own service prices.",
    successNote: "Your success depends on your skills, reputation and customer satisfaction.",
    coordinateRequests: "Coordinate customer requests.",
    supportSpecialists: "Support verified specialists.",
    maintainQuality: "Maintain service quality.",
    developCommunity: "Develop the NordBase community in your city.",
    developNetwork: "Develop the NordBase network across an entire region.",
    supportTP: "Support Territorial Partners.",
    expandNetwork: "Expand the verified specialist network.",
    maintainRegionalQuality: "Maintain regional quality standards.",
    whyPartner: "Why Partner with NordBase?",
    turnkeySoftware: "Turnkey Software",
    highDemand: "High Client Demand",
    qualityStandards: "Quality Standards",
    faqTitle: "Frequently Asked Questions",
    faqSubtitle: "Everything you need to know about joining the NordBase Partner Program.",
    readyToBuild: "Ready to Build NordBase in Your Territory?"
  }
};

mergeDeep(ptData, ptAdditions);
mergeDeep(enData, enAdditions);

fs.writeFileSync(ptPath, JSON.stringify(ptData, null, 2));
fs.writeFileSync(enPath, JSON.stringify(enData, null, 2));

console.log('Successfully updated locales JSON files for PT and EN!');
