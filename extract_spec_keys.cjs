const fs = require('fs');
const content = fs.readFileSync('src/components/SpecialistDashboard.tsx', 'utf8');

const regex = /t\('spec\.(inline_[^']+)', '([^']+)'\)/g;
let match;
const enKeys = {};

while ((match = regex.exec(content)) !== null) {
  enKeys[match[1]] = match[2];
}

fs.writeFileSync('spec_en_keys.json', JSON.stringify(enKeys, null, 2));
