const fs = require('fs');
let code = fs.readFileSync('src/components/CustomerFlow.tsx', 'utf8');

code = code.replace(
  /const finalDescription = \`Specialty: \$\{selectedSpecialty\}\\nUrgency & Schedule: \$\{timingLabel\}\\nPreferred Contact: \$\{contactLabel\}\\n\\n\$\{description\}\`;/,
  `const finalDescription = \`\${t('flow.specialtyLabel', 'Specialty')}: \${t('specialties.' + selectedSpecialty, selectedSpecialty)}\\n\${t('flow.urgencyLabel', 'Urgency & Schedule')}: \${timingLabel}\\n\${t('flow.contactLabel', 'Preferred Contact')}: \${contactLabel}\\n\\n\${description}\`;`
);

fs.writeFileSync('src/components/CustomerFlow.tsx', code);
