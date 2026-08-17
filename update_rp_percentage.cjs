const fs = require('fs');
let code = fs.readFileSync('src/components/PitchDeck.tsx', 'utf8');

// Replace textual 20%
code = code.replace(/Ваш доход с 1 лида \(20%\):/g, 'Ваш доход с 1 лида (10%):');
code = code.replace(/Your earn per lead \(20%\):/g, 'Your earn per lead (10%):');
code = code.replace(/RP получает пассивный доход в размере 20%/g, 'RP получает пассивный доход в размере 10%');
code = code.replace(/RP receives a passive income of 20%/g, 'RP receives a passive income of 10%');

// Replace code 0.20 and 0.2
code = code.replace(/\(rpAvgLeadPrice \* 0\.20\)/g, '(rpAvgLeadPrice * 0.10)');
code = code.replace(/\* 0\.2 \*/g, '* 0.1 *');

fs.writeFileSync('src/components/PitchDeck.tsx', code);
console.log('Updated 20% to 10% in PitchDeck.tsx');
