const fs = require('fs');
let code = fs.readFileSync('src/components/PitchDeck.tsx', 'utf8');

// 1. Remove Algarve section completely
const algarveStr = '{/* SLIDE 06: REGIONAL CASE STUDY — ALGARVE */}';
const algarveIdx = code.indexOf(algarveStr);
if (algarveIdx !== -1) {
    const businessStr = '{/* SLIDE 06: BUSINESS MODEL & UNIT ECONOMICS */}';
    const businessIdx = code.indexOf(businessStr);
    
    // Find previous divider
    let startIdx = code.lastIndexOf('{/* =================', algarveIdx);
    let endIdx = code.lastIndexOf('{/* =================', businessIdx);
    
    if (startIdx !== -1 && endIdx !== -1) {
        code = code.substring(0, startIdx) + code.substring(endIdx);
    }
}

// 2. Fix the numbering of `rpSlide === X`
// Because I messed up the numbering, let's just do a clean sequential replacement.
// Only inside the RP section (after "LEVEL 2: PITCH DECK FOR REGIONAL PARTNERS")

const level2Start = code.indexOf('LEVEL 2: PITCH DECK FOR REGIONAL PARTNERS');
const level3Start = code.indexOf('LEVEL 3: INVESTOR PITCH DECK');

if (level2Start !== -1 && level3Start !== -1) {
    let rpBlock = code.substring(level2Start, level3Start);
    
    // We expect exactly 10 slides now (since Algarve is removed)
    // 0: INTRO
    // 1: PROBLEM
    // 2: SOLUTION
    // 3: COVER & MISSION
    // 4: REGIONAL NETWORK ARCHITECTURE
    // 5: BUSINESS MODEL & UNIT ECONOMICS
    // 6: FINANCIAL CALCULATOR
    // 7: OPERATIONAL MANDATES
    // 8: AI CONTROL TERMINAL
    // 9: PARTNERSHIP & JOIN
    
    // We will match `{rpSlide === N` and replace sequentially
    let slideIndex = 0;
    rpBlock = rpBlock.replace(/\{rpSlide === \d+/g, () => {
        return `{rpSlide === ${slideIndex++}`;
    });
    
    code = code.substring(0, level2Start) + rpBlock + code.substring(level3Start);
}

fs.writeFileSync('src/components/PitchDeck.tsx', code);
