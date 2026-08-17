const fs = require('fs');

const enKeys = JSON.parse(fs.readFileSync('spec_en_keys.json', 'utf8'));
const enFile = 'src/locales/en/translation.json';
const ptFile = 'src/locales/pt/translation.json';
const ruFile = 'src/locales/ru/translation.json';

// I will populate the english file
function updateJson(filePath, ns, newKeys) {
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, 'utf8');
  const json = JSON.parse(content);
  if (!json[ns]) json[ns] = {};
  Object.assign(json[ns], newKeys);
  fs.writeFileSync(filePath, JSON.stringify(json, null, 2));
}

updateJson(enFile, 'spec', enKeys);

// We need PT and RU. I'll provide a simplified translation mapping for the most visible ones, 
// and default the rest to English if I can't translate all in code. But since I'm generating the file, I can just write them.
