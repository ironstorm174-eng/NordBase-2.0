const fs = require('fs');
let content = fs.readFileSync('src/components/CustomerFlow.tsx', 'utf8');

content = content.replace(
  /\{lang === 'pt'[\s\n]*\? 'O Parceiro Territorial envia o especialista\. Pagamento feito apenas após a conclusão\.'[\s\n]*: lang === 'ru'[\s\n]*\? 'Территориальный Партнёр направляет проверенного специалиста\. Оплата только после выполнения\.'[\s\n]*: 'Verified territory partner dispatches specialist\. Payment only after job completion\.'\}/g,
  "{t('flow.step3Desc2', 'Verified territory partner dispatches specialist. Payment only after job completion.')}"
);

content = content.replace(
  /\{lang === 'pt'[\s\n]*\? '«Trabalhos concluídos e aceites, pagamento efetuado na totalidade, sem reclamações\.»'[\s\n]*: lang === 'ru'[\s\n]*\? '«Работы приняты, Оплату произвел в полном объеме, претензий не имею\.»'[\s\n]*: '«Work completed & accepted, payment made in full, no claims\.»'\}/g,
  "{t('flow.step4Quote', '«Work completed & accepted, payment made in full, no claims.»')}"
);

content = content.replace(
  /\{lang === 'pt'[\s\n]*\? '2 Opções de Criação de Pedidos no NordBase'[\s\n]*: '2 Convenient Ways to Create an Order'\}/g,
  "{t('flow.creationOptions', '2 Convenient Ways to Create an Order')}"
);

content = content.replace(
  /\{lang === 'pt'[\s\n]*\? '1\. No site \(com registo rápido\)'[\s\n]*: '1\. On website \(with quick registration\)'\}/g,
  "{t('flow.option1Title', '1. On website (with quick registration)')}"
);

content = content.replace(
  /\{lang === 'pt'[\s\n]*\? 'Ao criar o pedido através do formulário no site, é necessário fazer o registo rápido ou iniciar sessão para acompanhar o estado do pedido em tempo real, aceder ao chat com o especialista e ao histórico\.'[\s\n]*: 'When creating a request via the website form, quick registration is required to access your customer dashboard, live order tracking, chat with the specialist, and order history\.'\}/g,
  "{t('flow.option1Desc', 'When creating a request via the website form, quick registration is required to access your customer dashboard, live order tracking, chat with the specialist, and order history.')}"
);

content = content.replace(
  /\{lang === 'pt'[\s\n]*\? '2\. Sem registo \(diretamente ao Operador\)'[\s\n]*: '2\. Without registration \(direct to Operator\)'\}/g,
  "{t('flow.option2Title', '2. Without registration (direct to Operator)')}"
);

content = content.replace(
  /\{lang === 'pt'[\s\n]*\? 'Se não pretender registar-se, pode contactar o Operador \(Parceiro Territorial\) diretamente por Telefone ou WhatsApp sem registo\. O Operador registará o pedido rapidamente por si!'[\s\n]*: 'If you prefer not to register, you can contact the Operator \(Territorial Partner\) directly by Phone or WhatsApp without registration\. The Operator will process your request for you\.'\}/g,
  "{t('flow.option2Desc', 'If you prefer not to register, you can contact the Operator (Territorial Partner) directly by Phone or WhatsApp without registration. The Operator will process your request for you.')}"
);

fs.writeFileSync('src/components/CustomerFlow.tsx', content);

