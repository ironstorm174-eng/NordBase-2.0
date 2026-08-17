const fs = require('fs');
let code = fs.readFileSync('src/components/SpecialistDashboard.tsx', 'utf8');

code = code.replace(
  /Create Contractor Profile/g,
  "{lang === 'pt' ? 'Criar Perfil de Prestador' : 'Create Contractor Profile'}"
);
code = code.replace(
  /Add a new regional professional to test automatic dispatches, board notifications and territorial routing\./g,
  "{lang === 'pt' ? 'Adicionar um novo profissional regional para testar os despachos.' : 'Add a new regional professional to test automatic dispatches, board notifications and territorial routing.'}"
);
code = code.replace(
  /Full Legal Name/g,
  "{lang === 'pt' ? 'Nome Completo' : 'Full Legal Name'}"
);
code = code.replace(
  /Mobile Phone/g,
  "{lang === 'pt' ? 'Telemóvel' : 'Mobile Phone'}"
);
code = code.replace(
  /Territory Lead Category/g,
  "{lang === 'pt' ? 'Categoria do Lead Territorial' : 'Territory Lead Category'}"
);
code = code.replace(
  /Est. Customer Contract Value/g,
  "{lang === 'pt' ? 'Valor Est. Contrato Cliente' : 'Est. Customer Contract Value'}"
);
code = code.replace(
  /Lead Unlock Fee/g,
  "{lang === 'pt' ? 'Taxa de Desbloqueio do Lead' : 'Lead Unlock Fee'}"
);
code = code.replace(
  /Stripe Payment Simulator Mode/g,
  "{lang === 'pt' ? 'Modo de Simulador de Pagamento Stripe' : 'Stripe Payment Simulator Mode'}"
);
code = code.replace(
  /GATEWAY/g,
  "{lang === 'pt' ? 'PORTA DE PAGAMENTO' : 'GATEWAY'}"
);

fs.writeFileSync('src/components/SpecialistDashboard.tsx', code);
