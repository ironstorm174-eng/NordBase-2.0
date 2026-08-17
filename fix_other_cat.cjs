const fs = require('fs');

function replaceInFile(file) {
  let content = fs.readFileSync(file, 'utf-8');
  content = content.replace(/'Other'/g, "'Professional Services'");
  // Also fix "Other:"
  content = content.replace(/Other:/g, "Professional Services:");
  // For keys like 'Other':
  content = content.replace(/'Other':/g, "'Professional Services':");
  fs.writeFileSync(file, content);
}

replaceInFile('src/types.ts');
replaceInFile('src/data.ts');
replaceInFile('src/components/CustomerFlow.tsx');
replaceInFile('src/components/MarketplaceView.tsx');
replaceInFile('src/components/SpecialistDashboard.tsx');
replaceInFile('src/components/SpecialistOnboarding.tsx');
