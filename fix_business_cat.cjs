const fs = require('fs');

function replaceInFile(file) {
  let content = fs.readFileSync(file, 'utf-8');
  content = content.replace(/'Professional Services'/g, "'Business'");
  content = content.replace(/Professional Services:/g, "Business:");
  fs.writeFileSync(file, content);
}

replaceInFile('src/types.ts');
replaceInFile('src/data.ts');
replaceInFile('src/components/CustomerFlow.tsx');
replaceInFile('src/components/MarketplaceView.tsx');
replaceInFile('src/components/SpecialistDashboard.tsx');
replaceInFile('src/components/SpecialistOnboarding.tsx');
