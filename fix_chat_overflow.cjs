const fs = require('fs');

function fixOverflow(file) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/flex flex-col justify-end/g, "flex flex-col");
  fs.writeFileSync(file, content);
}

fixOverflow('src/components/CustomerFlow.tsx');
fixOverflow('src/components/SpecialistDashboard.tsx');
fixOverflow('src/components/OperatorLeadsTerminal.tsx');
