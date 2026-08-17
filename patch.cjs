const fs = require('fs');
let code = fs.readFileSync('src/components/PitchDeck.tsx', 'utf8');

code = code.replace(/const rpSlidesCount = 11;/, 'const rpSlidesCount = 10;');

const navOld = `                {[
                  { id: 0, title: lang === 'ru' ? '01. О NordBase' : '01. About NordBase' },
                  { id: 1, title: lang === 'ru' ? '02. Проблема' : '02. Market Problem' },
                  { id: 2, title: lang === 'ru' ? '03. Решение' : '03. Our Solution' },
                  { id: 3, title: lang === 'ru' ? '04. Обзор RP' : '04. RP Overview' },
                  { id: 4, title: lang === 'ru' ? '05. Сеть Хабов' : '05. Hub Network' },
                  { id: 5, title: lang === 'ru' ? '06. Кейс Алгарве' : '06. Algarve Case' },
                  { id: 6, title: lang === 'ru' ? '07. Экономика' : '07. Economics' },
                  { id: 7, title: lang === 'ru' ? '08. Калькулятор' : '08. Calculator' },
                  { id: 8, title: lang === 'ru' ? '09. Обязанности' : '09. Mandates' },
                  { id: 9, title: lang === 'ru' ? '10. ИИ Т-Терминал' : '10. AI Control' },
                  { id: 10, title: lang === 'ru' ? '11. Партнерство' : '11. Apply / Join' },
                ].map((s) => (`;

const navNew = `                {[
                  { id: 0, title: lang === 'ru' ? '01. О NordBase' : '01. About NordBase' },
                  { id: 1, title: lang === 'ru' ? '02. Проблема' : '02. Market Problem' },
                  { id: 2, title: lang === 'ru' ? '03. Решение' : '03. Our Solution' },
                  { id: 3, title: lang === 'ru' ? '04. Обзор RP' : '04. RP Overview' },
                  { id: 4, title: lang === 'ru' ? '05. Сеть Хабов' : '05. Hub Network' },
                  { id: 5, title: lang === 'ru' ? '06. Экономика' : '06. Economics' },
                  { id: 6, title: lang === 'ru' ? '07. Калькулятор' : '07. Calculator' },
                  { id: 7, title: lang === 'ru' ? '08. Обязанности' : '08. Mandates' },
                  { id: 8, title: lang === 'ru' ? '09. ИИ Т-Терминал' : '09. AI Control' },
                  { id: 9, title: lang === 'ru' ? '10. Партнерство' : '10. Apply / Join' },
                ].map((s) => (`;

code = code.replace(navOld, navNew);

code = code.replace(/rpSlide === 10/g, 'rpSlide === 9999');
code = code.replace(/rpSlide === 9/g, 'rpSlide === 8');
code = code.replace(/rpSlide === 8/g, 'rpSlide === 7');
code = code.replace(/rpSlide === 7/g, 'rpSlide === 6');
code = code.replace(/rpSlide === 6/g, 'rpSlide === 5');
code = code.replace(/rpSlide === 9999/g, 'rpSlide === 9');

code = code.replace(/SLIDE 07: BUSINESS/g, 'SLIDE 06: BUSINESS');
code = code.replace(/07\s+<\/div>\s+<span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-wider">\s+BUSINESS MODEL/g, '06\n                      </div>\n                      <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-wider">\n                        BUSINESS MODEL');

code = code.replace(/SLIDE 08: FINANCIAL/g, 'SLIDE 07: FINANCIAL');
code = code.replace(/08\s+<\/div>\s+<span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-wider">\s+FINANCIAL CALCULATOR/g, '07\n                      </div>\n                      <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-wider">\n                        FINANCIAL CALCULATOR');

code = code.replace(/SLIDE 09: OPERATIONAL/g, 'SLIDE 08: OPERATIONAL');
code = code.replace(/09\s+<\/div>\s+<span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-wider">\s+KEY RESPONSIBILITIES/g, '08\n                      </div>\n                      <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-wider">\n                        KEY RESPONSIBILITIES');

code = code.replace(/SLIDE 10: AI CONTROL/g, 'SLIDE 09: AI CONTROL');
code = code.replace(/10\s+<\/div>\s+<span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-wider">\s+AI CONTROL TERMINAL/g, '09\n                      </div>\n                      <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-wider">\n                        AI CONTROL TERMINAL');

code = code.replace(/SLIDE 11: PARTNERSHIP/g, 'SLIDE 10: PARTNERSHIP');
code = code.replace(/11\s+<\/div>\s+<span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-widest">\s+BECOME A REGIONAL/g, '10\n                      </div>\n                      <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-widest">\n                        BECOME A REGIONAL');

// For Slide 06 case study, it starts with /* SLIDE 06: REGIONAL CASE STUDY
const slide06Regex = /\/\* ========================================================= \*\/\s*\/\* SLIDE 06: REGIONAL CASE STUDY — ALGARVE \*\/[\s\S]*?(?=\/\* ========================================================= \*\/\s*\/\* SLIDE 06: BUSINESS)/;
code = code.replace(slide06Regex, '');

fs.writeFileSync('src/components/PitchDeck.tsx', code);
