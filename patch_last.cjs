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

updateJson(enFile, 'categories', {
  "Home Services": "Home Services",
  "Cleaning": "Cleaning",
  "Gardening": "Gardening",
  "Moving": "Moving",
  "Transport": "Transport",
  "Repairs": "Repairs",
  "Construction": "Construction",
  "Pools": "Pools",
  "Hospitality": "Hospitality",
  "Care": "Care",
  "Lessons": "Lessons",
  "Business": "Business"
});

