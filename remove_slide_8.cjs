const fs = require('fs');
let code = fs.readFileSync('src/components/PitchDeck.tsx', 'utf8');

// Update rpSlidesCount to 8
code = code.replace(/const rpSlidesCount = 9;/, 'const rpSlidesCount = 8;');

// Update the RP nav buttons
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
                  { id: 7, title: lang === 'ru' ? '08. Партнерство' : '08. Apply / Join' },
                `;
    code = code.substring(0, navStartIndex) + newNav + code.substring(navEndIndex);
}

// Remove the slide with rpSlide === 7
const slide7Start = code.indexOf('{/* SLIDE 08: AI CONTROL TERMINAL */}');
if (slide7Start !== -1) {
    const slide7End = code.indexOf('{/* ========================================================= */}', slide7Start + 10);
    if (slide7End !== -1) {
        // Also remove the divider before it
        const prevDivider = code.lastIndexOf('{/* ========================================================= */}', slide7Start);
        code = code.substring(0, prevDivider) + code.substring(slide7End);
    }
}

// Update the slide index of the last slide from 8 to 7, and its UI numbers from 09 to 08
const slide8Start = code.indexOf('{/* SLIDE 09: PARTNERSHIP & JOIN */}');
if (slide8Start !== -1) {
    let nextEnd = code.indexOf('</div>\n          </div>\n        )}', slide8Start);
    if (nextEnd !== -1) {
        let block = code.substring(slide8Start, nextEnd);
        block = block.replace('{rpSlide === 8', '{rpSlide === 7');
        block = block.replace('09\n                      </div>', '08\n                      </div>');
        block = block.replace('{/* SLIDE 09: PARTNERSHIP & JOIN */}', '{/* SLIDE 08: PARTNERSHIP & JOIN */}');
        
        code = code.substring(0, slide8Start) + block + code.substring(nextEnd);
    }
}

fs.writeFileSync('src/components/PitchDeck.tsx', code);
console.log("Slide 8 removed.");
