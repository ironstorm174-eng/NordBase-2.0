const fs = require('fs');

function fixSuperAdmin() {
  const file = 'src/components/SuperAdminDashboard.tsx';
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace("Все имитационные аккаунты и следы деятельности успешно удалены!", "All simulation accounts and activity traces successfully cleared!");
  content = content.replace("Очистить все имитационные аккаунты и следы активности", "Clear all simulation accounts and activity traces");
  content = content.replace("Очистить имитационные аккаунты", "Clear simulation accounts");
  content = content.replace("Полное управление дашбордом RP", "Full management of RP dashboard");
  content = content.replace("Управлять (", "Manage (");
  content = content.replace("Управлять дашбордом (Переключить на себя)", "Manage dashboard (Switch to self)");
  content = content.replace("Управлять<", "Manage<");
  fs.writeFileSync(file, content);
}

function fixSpecialistWelcome() {
  const file = 'src/components/SpecialistWelcomeNotice.tsx';
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/'🚀 Первая волна специалистов'/g, "'🚀 First wave of specialists'");
  content = content.replace(/'Добро пожаловать в NordBase!'/g, "'Welcome to NordBase!'");
  content = content.replace(/'Важная информация для активации вашего профиля специалиста'/g, "'Important information for activating your specialist profile'");
  content = content.replace(/'Спасибо за регистрацию. Вы присоединились к первой волне специалистов NordBase в вашем регионе.'/g, "'Thank you for registering. You have joined the first wave of NordBase specialists in your region.'");
  content = content.replace(/'NordBase строит не просто каталог исполнителей, а локальное сообщество проверенных специалистов, где качество работы и доверие клиентов являются главным приоритетом.'/g, "'NordBase is building not just a directory of workers, but a local community of verified specialists, where work quality and customer trust are the top priorities.'");
  content = content.replace(/'Сейчас ваш город находится на этапе запуска. В первые недели количество заказов может быть ограниченным — это естественный процесс формирования новой локальной сети.'/g, "'Your city is currently in the launch phase. In the first few weeks, the number of orders may be limited — this is a natural process of forming a new local network.'");
  content = content.replace(/'📍 В первую очередь — заполните Профиль специалиста:'/g, "'📍 First of all — fill out your Specialist Profile:'");
  content = content.replace(/'Первым делом необходимо полностью заполнить ваш Профиль специалиста \(добавить фото профиля, контактные данные и загрузить документы на верификацию\).'/g, "'First, you need to completely fill out your Specialist Profile (add a profile photo, contact details, and upload verification documents).'");
  content = content.replace(/'💡 Вы можете указывать и совмещать несколько специальностей одновременно в одном профиле \(например: Электрик \+ Сантехник \+ Монтажник кондиционеров\).'/g, "'💡 You can specify and combine multiple specialties at once in one profile (e.g.: Electrician + Plumber + AC Installer).'");
  content = content.replace(/'Чтобы подготовиться к первым заказам:'/g, "'To prepare for the first orders:'");
  content = content.replace(/'Заполните профиль и добавьте примеры выполненных работ'/g, "'Fill out your profile and add examples of completed work'");
  content = content.replace(/'Укажите все ваши направления и специальности для получения большего числа заказов'/g, "'Specify all your areas and specialties to receive more orders'");
  content = content.replace(/'Ознакомьтесь с правилами работы в NordBase Academy'/g, "'Familiarize yourself with the operating rules in NordBase Academy'");
  content = content.replace(/'Подготовьтесь к взаимодействию с клиентами через платформу'/g, "'Prepare to interact with customers through the platform'");
  content = content.replace(/'В NordBase Academy вы узнаете:'/g, "'In NordBase Academy you will learn:'");
  content = content.replace(/'Как работает платформа NordBase;'/g, "'How the NordBase platform works;'");
  content = content.replace(/'Как получать и выполнять заказы;'/g, "'How to receive and complete orders;'");
  content = content.replace(/'Правила и этику общения с клиентами;'/g, "'Rules and ethics of customer communication;'");
  content = content.replace(/'Стандарты качества и гарантии;'/g, "'Quality standards and guarantees;'");
  content = content.replace(/'Принципы работы с отзывами и рейтингом;'/g, "'Principles of working with reviews and ratings;'");
  content = content.replace(/'Как строить долгосрочную репутацию в сообществе.'/g, "'How to build a long-term reputation in the community.'");
  content = content.replace(/'После прохождения основных материалов и проверки профиля ваш аккаунт будет готов к полной активации.'/g, "'After reviewing the core materials and profile verification, your account will be ready for full activation.'");
  content = content.replace(/'Вы не просто регистрируетесь на платформе. Вы становитесь одним из первых специалистов, которые создают NordBase в своём городе.'/g, "'You are not just registering on the platform. You are becoming one of the first specialists building NordBase in your city.'");
  content = content.replace(/'Открыть NordBase Academy'/g, "'Open NordBase Academy'");
  content = content.replace(/'Показать приветствие и правила Академии'/g, "'Show welcome and Academy rules'");
  content = content.replace(/'Свернуть текст приветствия'/g, "'Collapse welcome text'");
  content = content.replace(/'Я ознакомился с приветственным руководством и правилами NordBase Academy'/g, "'I have read the welcome guide and NordBase Academy rules'");
  fs.writeFileSync(file, content);
}

function fixTerminal() {
  const file = 'src/components/OperatorLeadsTerminal.tsx';
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(", 'бассейн', 'водн'", "");
  content = content.replace(", 'чистка бассейн'", "");
  content = content.replace(", 'электр'", "");
  content = content.replace(", 'свет', 'розетк'", "");
  content = content.replace(", 'сантех'", "");
  content = content.replace(", 'труб', 'утечк'", "");
  content = content.replace(", 'слив'", "");
  content = content.replace(", 'кондиционер', 'отоплен'", "");
  content = content.replace(", 'уборка'", "");
  content = content.replace(", 'клининг'", "");
  content = content.replace(", 'сад'", "");
  content = content.replace(", 'газон'", "");
  content = content.replace(", 'ремонт', 'строитель'", "");
  content = content.replace(", 'маляр', 'плитк'", "");
  content = content.replace(", 'бытов'", "");
  content = content.replace(", 'стирал', 'холодил'", "");
  fs.writeFileSync(file, content);
}

fixSuperAdmin();
fixSpecialistWelcome();
fixTerminal();
