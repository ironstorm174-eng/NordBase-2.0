const fs = require('fs');

const files = [
  'src/components/OperatorLeadsTerminal.tsx',
  'src/components/SpecialistOnboarding.tsx',
  'src/components/CustomerFlow.tsx',
  'src/components/OperatorDashboard.tsx'
];

for (const file of files) {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf-8');
    content = content.replace(/type: file\.type \|\| 'image\/jpeg'/g, "type: 'image/jpeg'");
    content = content.replace(/file\.type \|\| 'image\/jpeg'/g, "'image/jpeg'");
    fs.writeFileSync(file, content);
  }
}
