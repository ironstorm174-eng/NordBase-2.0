const fs = require('fs');
let content = fs.readFileSync('src/components/CustomerFlow.tsx', 'utf-8');

const importStr = "import MarketplaceView from './MarketplaceView';\n";
if (!content.includes('MarketplaceView from')) {
    content = content.replace("import React", importStr + "import React");
}

let lines = content.split('\n');
let newLines = [];
let skip = false;
let foundOnce = false;

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes('// --- MARKETPLACE INTERCEPT ---')) {
        if (foundOnce) {
            skip = true;
        } else {
            foundOnce = true;
        }
    }
    if (skip && line.includes('// --- STEP 1 & 2: HOMEPAGE (CATEGORY / SPECIALTY GRID) ---')) {
        skip = false;
    }
    if (!skip) {
        newLines.push(line);
    }
}

fs.writeFileSync('src/components/CustomerFlow.tsx', newLines.join('\n'));
