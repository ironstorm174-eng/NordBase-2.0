const fs = require('fs');
let code = fs.readFileSync('src/components/PitchDeck.tsx', 'utf8');

// 1. Update rpSlidesCount to 9
code = code.replace(/const rpSlidesCount = \d+;/, 'const rpSlidesCount = 9;');

// 2. Replace Nav for RP
const navStartStr = `                {[
                  { id: 0, title: lang === 'ru' ? '01. О NordBase' : '01. About NordBase' },`;
const navStartIndex = code.indexOf(navStartStr, code.indexOf('LEVEL 2: PITCH DECK FOR REGIONAL PARTNERS'));
if (navStartIndex !== -1) {
    const navEndIndex = code.indexOf('].map((s) => (', navStartIndex);
    const newNav = `                {[
                  { id: 0, title: lang === 'ru' ? '01. О NordBase' : '01. About NordBase' },
                  { id: 1, title: lang === 'ru' ? '02. Проблема' : '02. Market Problem' },
                  { id: 2, title: lang === 'ru' ? '03. Решение' : '03. Our Solution' },
                  { id: 3, title: lang === 'ru' ? '04. Обзор RP' : '04. RP Overview' },
                  { id: 4, title: lang === 'ru' ? '05. Сеть Хабов' : '05. Hub Network' },
                  { id: 5, title: lang === 'ru' ? '06. Калькулятор' : '06. Calculator' },
                  { id: 6, title: lang === 'ru' ? '07. Обязанности' : '07. Mandates' },
                  { id: 7, title: lang === 'ru' ? '08. ИИ Т-Терминал' : '08. AI Control' },
                  { id: 8, title: lang === 'ru' ? '09. Партнерство' : '09. Apply / Join' },
                `;
    code = code.substring(0, navStartIndex) + newNav + code.substring(navEndIndex);
}

fs.writeFileSync('src/components/PitchDeck.tsx', code);
console.log("Nav updated");
