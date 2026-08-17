const fs = require('fs');
let code = fs.readFileSync('src/components/PitchDeck.tsx', 'utf8');

const level2Start = code.indexOf('LEVEL 2: PITCH DECK FOR REGIONAL PARTNERS');
const level3Start = code.indexOf('LEVEL 3: INVESTOR PITCH DECK');

if (level2Start !== -1 && level3Start !== -1) {
    let rpBlock = code.substring(level2Start, level3Start);
    
    // We expect exactly 10 slides
    let slideIndex = 0;
    
    // First, let's fix the tpSlide === inside rpBlock to rpSlide ===
    rpBlock = rpBlock.replace(/\{(?:tp|rp)Slide === \d+/g, () => {
        return `{rpSlide === ${slideIndex++}`;
    });
    
    code = code.substring(0, level2Start) + rpBlock + code.substring(level3Start);
}

fs.writeFileSync('src/components/PitchDeck.tsx', code);
console.log("Fixed RP slide indices");
