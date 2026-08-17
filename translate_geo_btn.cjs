const fs = require('fs');
const ptPath = 'src/locales/pt/translation.json';
const enPath = 'src/locales/en/translation.json';

const pt = JSON.parse(fs.readFileSync(ptPath, 'utf8'));
const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));

pt.address.locateMe = "Usar a minha localização atual";
en.address.locateMe = "Use my current location";

fs.writeFileSync(ptPath, JSON.stringify(pt, null, 2));
fs.writeFileSync(enPath, JSON.stringify(en, null, 2));
