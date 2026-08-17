const fs = require('fs');
let code = fs.readFileSync('src/components/PitchDeck.tsx', 'utf8');

// 1. Completely remove the Algarve slide block
const algarveStart = code.indexOf('{/* SLIDE 06: REGIONAL CASE STUDY — ALGARVE */}');
if (algarveStart !== -1) {
    const previousDivider = code.lastIndexOf('{/* ========================================================= */}', algarveStart);
    const algarveEnd = code.indexOf('{/* SLIDE 06: BUSINESS MODEL & UNIT ECONOMICS */}');
    const nextDivider = code.lastIndexOf('{/* ========================================================= */}', algarveEnd);
    if (previousDivider !== -1 && nextDivider !== -1) {
        code = code.substring(0, previousDivider) + code.substring(nextDivider);
    }
}

fs.writeFileSync('src/components/PitchDeck.tsx', code);
