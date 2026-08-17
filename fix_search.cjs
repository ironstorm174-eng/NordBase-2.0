const fs = require('fs');
let content = fs.readFileSync('src/components/MarketplaceView.tsx', 'utf-8');

content = content.replace(
  "const matchesAbout = s.aboutMe?.toLowerCase().includes(q) || s.skillsDescription?.toLowerCase().includes(q);",
  "const matchesAbout = s.aboutMe?.toLowerCase().includes(q) || s.skillsDescription?.toLowerCase().includes(q) || s.specialtiesWithLevels?.some(sp => sp.specialty.toLowerCase().includes(q));"
);

fs.writeFileSync('src/components/MarketplaceView.tsx', content);
