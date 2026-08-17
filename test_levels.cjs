const fs = require('fs');
let code = fs.readFileSync('src/components/PitchDeck.tsx', 'utf8');
const lines = code.split('\n');
lines.forEach((line, i) => {
    if (line.includes('LEVEL 2: PITCH DECK FOR REGIONAL PARTNERS')) {
        console.log(`Found at line ${i + 1}`);
    }
});
