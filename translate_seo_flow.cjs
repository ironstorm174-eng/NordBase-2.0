const fs = require('fs');
const pt = JSON.parse(fs.readFileSync('src/locales/pt/translation.json', 'utf8'));
const en = JSON.parse(fs.readFileSync('src/locales/en/translation.json', 'utf8'));

pt.seo.categoryTitle = "Serviços de {{category}} Urgentes em Portugal | NordBase";
pt.seo.categoryDescription = "Precisa de {{category}} urgente? A NordBase liga-o aos melhores especialistas em Portugal. Despacho 24/7 e suporte ao cliente humano.";

en.seo.categoryTitle = "Urgent {{category}} Services in Portugal | NordBase";
en.seo.categoryDescription = "Need urgent {{category}}? NordBase connects you with top specialists across Portugal. 24/7 dispatch and human support.";

fs.writeFileSync('src/locales/pt/translation.json', JSON.stringify(pt, null, 2));
fs.writeFileSync('src/locales/en/translation.json', JSON.stringify(en, null, 2));
