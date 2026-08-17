const fs = require('fs');

const enFile = 'src/locales/en/translation.json';
const ptFile = 'src/locales/pt/translation.json';
const ruFile = 'src/locales/ru/translation.json';

function updateJson(filePath, ns, newKeys) {
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, 'utf8');
  const json = JSON.parse(content);
  if (!json[ns]) json[ns] = {};
  Object.assign(json[ns], newKeys);
  fs.writeFileSync(filePath, JSON.stringify(json, null, 2));
}

const en = {
  "howItWorksSub": "Fast connection with certified service specialists in Portugal. Choose your preferred way to request:",
  "step1Desc": "Select your required service category and location in Portugal.",
  "step2Desc": "Create request on site with quick registration, OR without registration contact Operator via Phone / WhatsApp.",
  "step3Desc": "Our Territory Partner validates the request and dispatches it to local specialists.",
  "step4Desc": "The specialist accepts, solves the problem, and payment is made directly to them.",
  "regTrack": "Registration & Tracking",
  "noRegDispatch": "No Reg: Dispatch via Operator",
  "premiumVip": "Premium VIP Coordination",
  "propertyManagement": "For property management, Airbnb and condominium maintenance.",
  "complexServices": "For complex budgeted services, invoicing, and dedicated contractor management.",
  "step3Desc2": "Verified territory partner dispatches specialist. Payment only after job completion.",
  "step4Quote": "«Work completed & accepted, payment made in full, no claims.»",
  "creationOptions": "2 Convenient Ways to Create an Order",
  "option1Title": "1. On website (with quick registration)",
  "option1Desc": "When creating a request via the website form, quick registration is required to access your customer dashboard, live order tracking, chat with the specialist, and order history.",
  "option2Title": "2. Without registration (direct to Operator)",
  "option2Desc": "If you prefer not to register, you can contact the Operator (Territorial Partner) directly by Phone or WhatsApp without registration. The Operator will process your request for you.",
  "inline_HowNordBaseWork_1": "How NordBase Works",
  "inline_1ChooseCityServ_2": "1. Choose City & Service",
  "inline_2OnSiteorWithou_3": "2. On Site or Without Reg",
  "inline_3DispatchExecut_4": "3. Dispatch & Execution",
  "inline_4OrderCompletio_5": "4. Order Completion",
  "inline_Livetrackinginp_6": "Live tracking in personal dashboard"
};

const pt = {
  "howItWorksSub": "Conexão rápida com especialistas qualificados em Portugal. Escolha a melhor forma de criar o seu pedido:",
  "step1Desc": "Selecione a categoria desejada e informe os detalhes do problema.",
  "step2Desc": "Crie o pedido no site com registo rápido, OU sem registar fale com o Operador por Telefone / WhatsApp.",
  "step3Desc": "O nosso Parceiro de Território valida o pedido e envia para os especialistas locais.",
  "step4Desc": "O especialista aceita, resolve o problema e o pagamento é feito diretamente a ele.",
  "regTrack": "Registo e Acompanhamento",
  "noRegDispatch": "Sem registo: Despacho por Operador",
  "premiumVip": "Atendimento Premium VIP",
  "propertyManagement": "Para gestão de propriedades, Alojamento Local e condomínios.",
  "complexServices": "Para serviços complexos com orçamento, faturas, e gestão dedicada de empreiteiros.",
  "step3Desc2": "O Parceiro Territorial envia o especialista. Pagamento feito apenas após a conclusão.",
  "step4Quote": "«Trabalhos concluídos e aceites, pagamento efetuado na totalidade, sem reclamações.»",
  "creationOptions": "2 Opções de Criação de Pedidos no NordBase",
  "option1Title": "1. No site (com registo rápido)",
  "option1Desc": "Ao criar o pedido através do formulário no site, é necessário fazer o registo rápido ou iniciar sessão para acompanhar o estado do pedido em tempo real, aceder ao chat com o especialista e ao histórico.",
  "option2Title": "2. Sem registo (diretamente ao Operador)",
  "option2Desc": "Se não pretender registar-se, pode contactar o Operador (Parceiro Territorial) diretamente por Telefone ou WhatsApp sem registo. O Operador registará o pedido rapidamente por si!",
  "inline_HowNordBaseWork_1": "Como Funciona o NordBase",
  "inline_1ChooseCityServ_2": "1. Escolha a Cidade e Serviço",
  "inline_2OnSiteorWithou_3": "2. No Site ou sem Registar",
  "inline_3DispatchExecut_4": "3. Atribuição e Execução",
  "inline_4OrderCompletio_5": "4. Conclusão do Pedido",
  "inline_Livetrackinginp_6": "Acompanhamento em tempo real no Gabinete"
};

const ru = {
  "howItWorksSub": "Быстрая связь с сертифицированными специалистами в Португалии. Выберите удобный способ оформления:",
  "step1Desc": "Укажите нужную категорию, город и опишите проблему.",
  "step2Desc": "Оформите заявку на сайте или свяжитесь с Оператором напрямую через WhatsApp/Телефон.",
  "step3Desc": "Наш Территориальный Партнер валидирует заказ и передает местным специалистам.",
  "step4Desc": "Специалист принимает, решает проблему, и оплата производится напрямую ему.",
  "regTrack": "Регистрация и отслеживание",
  "noRegDispatch": "Без регистрации: через Оператора",
  "premiumVip": "Премиум VIP-координация",
  "propertyManagement": "Для управления недвижимостью, Airbnb и кондоминиумов.",
  "complexServices": "Для сложных услуг с бюджетом, счетами и выделенным управлением подрядчиками.",
  "step3Desc2": "Территориальный Партнёр направляет проверенного специалиста. Оплата только после выполнения.",
  "step4Quote": "«Работы приняты, Оплату произвел в полном объеме, претензий не имею.»",
  "creationOptions": "2 удобных способа создать заказ",
  "option1Title": "1. На сайте (с быстрой регистрацией)",
  "option1Desc": "При создании заявки через сайт требуется быстрая регистрация для доступа к личному кабинету, отслеживанию статуса, чату со специалистом и истории заказов.",
  "option2Title": "2. Без регистрации (напрямую Оператору)",
  "option2Desc": "Если вы не хотите регистрироваться, можете связаться с Оператором напрямую по телефону или WhatsApp. Оператор быстро оформит заказ за вас!",
  "inline_HowNordBaseWork_1": "Как работает NordBase",
  "inline_1ChooseCityServ_2": "1. Выберите Город и Услугу",
  "inline_2OnSiteorWithou_3": "2. На сайте или по Телефону",
  "inline_3DispatchExecut_4": "3. Назначение и Выполнение",
  "inline_4OrderCompletio_5": "4. Завершение Заказа",
  "inline_Livetrackinginp_6": "Отслеживание статуса в личном кабинете"
};

updateJson(enFile, 'flow', en);
updateJson(ptFile, 'flow', pt);
updateJson(ruFile, 'flow', ru);

