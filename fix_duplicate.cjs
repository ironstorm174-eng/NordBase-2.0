const fs = require('fs');
let code = fs.readFileSync('src/components/PitchDeck.tsx', 'utf8');

const str = '{/* LEVEL 2: PITCH DECK FOR REGIONAL PARTNERS / DIRECTORS (RP) */}';
const first = code.indexOf(str);
const second = code.indexOf(str, first + 1);

if (second !== -1) {
    const third = code.indexOf('{/* LEVEL 3: INVESTOR PITCH DECK', second);
    if (third !== -1) {
        // Find the start of the divider before the second block
        const prevDivider = code.lastIndexOf('{/* =================', second);
        code = code.substring(0, prevDivider) + code.substring(third);
        fs.writeFileSync('src/components/PitchDeck.tsx', code);
        console.log("Duplicate removed.");
    }
}
