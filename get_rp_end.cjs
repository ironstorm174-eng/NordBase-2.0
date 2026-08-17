const fs = require('fs');
let code = fs.readFileSync('src/components/PitchDeck.tsx', 'utf8');

const level3Start = code.indexOf('{/* LEVEL 3: INVESTOR PITCH DECK');
const slide5Start = code.indexOf('{/* SLIDE 06: BUSINESS MODEL & UNIT ECONOMICS */}', code.indexOf('LEVEL 2: PITCH DECK FOR REGIONAL PARTNERS'));

console.log("slide5Start:", slide5Start);
console.log("level3Start:", level3Start);
