const fs = require('fs');

const filesToFix = [
  'src/components/Footer.tsx',
  'src/components/SpecialistDashboard.tsx'
];

filesToFix.forEach(file => {
  let code = fs.readFileSync(file, 'utf8');
  code = code.replace(/import\s*from\s*['"][^'"]+['"];?/g, '');
  fs.writeFileSync(file, code);
  console.log(`Fixed ${file}`);
});
