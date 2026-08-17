const fs = require('fs');

function cleanRuTernary(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');

  // We are looking for something like:
  // lang === 'pt' ? '...' : lang === 'ru' ? '...' : '...'
  // we will replace ` : lang === 'ru' \? ('[^']+'|`[^`]+`) : ` with ` : `
  // this might be a bit tricky because of nested strings and variables.
  
  // Let's use a regex to match the pattern:
  // `: lang === 'ru' ? <expr1> : <expr2>` => `: <expr2>`
  
  // For `SpecialistDashboard.tsx`:
  content = content.replace(/: lang === 'ru' \? 'Перейдите в \\'Ленту срочных заказов\\' и разблокируйте заказ, чтобы увидеть данные клиента и чат\.' : /g, ': ');
  content = content.replace(/: lang === 'ru' \? "Загрузка файла\.\.\." : /g, ': ');
  content = content.replace(/: lang === 'ru' \? "Расскажите о своем опыте, инструментах, наличии авто\.\.\." : /g, ': ');
  
  content = content.replace(/lang === 'ru' \? \(l === 'English' \? 'Английский' : l === 'Portuguese' \? 'Португальский' : l === 'Russian' \? 'Русский' : l === 'German' \? 'Немецкий' : l === 'Spanish' \? 'Испанский' : l === 'French' \? 'Французский' : l\) :/g, '');

  content = content.replace(/: lang === 'ru' \? "Укажите другой язык \(например, Итальянский\)\.\.\." : /g, ': ');
  content = content.replace(/: lang === 'ru' \? 'Водительские права' : /g, ': ');

  fs.writeFileSync(filePath, content);
}

function cleanAcademy(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');

  content = content.replace(/: lang === 'ru' \? 'Академия NordBase' : /g, ': ');
  content = content.replace(/: lang === 'ru' \? 'Прогресс' : /g, ': ');
  content = content.replace(/: lang === 'ru' \? 'Специалист' : /g, ': ');
  content = content.replace(/: lang === 'ru' \? 'Территориальный Партнер' : /g, ': ');
  content = content.replace(/: lang === 'ru' \? 'Академия Специалистов' : /g, ': ');
  content = content.replace(/: lang === 'ru' \? 'Академия Территориального Партнера' : /g, ': ');
  content = content.replace(/: lang === 'ru' \? 'Выберите тему\.\.\.' : /g, ': ');
  content = content.replace(/: lang === 'ru' \? 'Академия' : /g, ': ');
  content = content.replace(/: lang === 'ru' \? 'Предыдущий урок' : /g, ': ');
  content = content.replace(/: lang === 'ru' \? 'Следующий урок' : /g, ': ');

  fs.writeFileSync(filePath, content);
}

cleanRuTernary('src/components/SpecialistDashboard.tsx');
cleanAcademy('src/components/Academy.tsx');
