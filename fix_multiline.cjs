const fs = require('fs');

let content = fs.readFileSync('src/components/CustomerFlow.tsx', 'utf8');

// We will find `{lang === 'pt'` and follow it to the closing `}` and extract the English string (the last part of the ternary)
// Wait, parsing AST might be better, or we can just replace known blocks since there are only a few.

content = content.replace(
  /\{lang === 'pt'[\s\n]*\? 'Conexão rápida com especialistas qualificados em Portugal\. Escolha a melhor forma de criar o seu pedido:'[\s\n]*: 'Fast connection with certified service specialists in Portugal\. Choose your preferred way to request:'\}/g,
  "{t('flow.howItWorksSub', 'Fast connection with certified service specialists in Portugal. Choose your preferred way to request:')}"
);

content = content.replace(
  /\{lang === 'pt'[\s\n]*\? 'Selecione a categoria desejada e informe os detalhes do problema\.'[\s\n]*: lang === 'ru'[\s\n]*\? 'Укажите нужную категорию, город и опишите проблему\.'[\s\n]*: 'Select your required service category and location in Portugal\.'\}/g,
  "{t('flow.step1Desc', 'Select your required service category and location in Portugal.')}"
);

content = content.replace(
  /\{lang === 'pt'[\s\n]*\? 'Crie o pedido no site com registo rápido, OU sem registar fale com o Operador por Telefone \/ WhatsApp\.'[\s\n]*: lang === 'ru'[\s\n]*\? 'Оформите заявку на сайте или свяжитесь с Оператором напрямую через WhatsApp\/Телефон\.'[\s\n]*: 'Create request on site with quick registration, OR without registration contact Operator via Phone \/ WhatsApp\.'\}/g,
  "{t('flow.step2Desc', 'Create request on site with quick registration, OR without registration contact Operator via Phone / WhatsApp.')}"
);

content = content.replace(
  /\{lang === 'pt'[\s\n]*\? 'O nosso Parceiro de Território valida o pedido e envia para os especialistas locais\.'[\s\n]*: lang === 'ru'[\s\n]*\? 'Наш Территориальный Партнер валидирует заказ и передает местным специалистам\.'[\s\n]*: 'Our Territory Partner validates the request and dispatches it to local specialists\.'\}/g,
  "{t('flow.step3Desc', 'Our Territory Partner validates the request and dispatches it to local specialists.')}"
);

content = content.replace(
  /\{lang === 'pt'[\s\n]*\? 'O especialista aceita, resolve o problema e o pagamento é feito diretamente a ele\.'[\s\n]*: lang === 'ru'[\s\n]*\? 'Специалист принимает, решает проблему, и оплата производится напрямую ему\.'[\s\n]*: 'The specialist accepts, solves the problem, and payment is made directly to them\.'\}/g,
  "{t('flow.step4Desc', 'The specialist accepts, solves the problem, and payment is made directly to them.')}"
);

content = content.replace(
  /\{lang === 'pt'[\s\n]*\? 'Registo e Acompanhamento'\n\s*: 'Registration & Tracking'\}/g,
  "{t('flow.regTrack', 'Registration & Tracking')}"
);

content = content.replace(
  /\{lang === 'pt'[\s\n]*\? 'Sem registo: Despacho por Operador'\n\s*: 'No Reg: Dispatch via Operator'\}/g,
  "{t('flow.noRegDispatch', 'No Reg: Dispatch via Operator')}"
);

content = content.replace(
  /\{lang === 'pt'[\s\n]*\? 'Atendimento Premium VIP'\n\s*: 'Premium VIP Coordination'\}/g,
  "{t('flow.premiumVip', 'Premium VIP Coordination')}"
);

content = content.replace(
  /\{lang === 'pt'[\s\n]*\? 'Para gestão de propriedades, Alojamento Local e condomínios\.'\n\s*: 'For property management, Airbnb and condominium maintenance\.'\}/g,
  "{t('flow.propertyManagement', 'For property management, Airbnb and condominium maintenance.')}"
);

content = content.replace(
  /\{lang === 'pt'[\s\n]*\? 'Para serviços complexos com orçamento, faturas, e gestão dedicada de empreiteiros\.'\n\s*: 'For complex budgeted services, invoicing, and dedicated contractor management\.'\}/g,
  "{t('flow.complexServices', 'For complex budgeted services, invoicing, and dedicated contractor management.')}"
);


fs.writeFileSync('src/components/CustomerFlow.tsx', content);

