const fs = require('fs');
let content = fs.readFileSync('src/data.ts', 'utf-8');

content = content.replace(
  "'Professional Services': ['Office Help', 'Accountant', 'Realtor', 'Photo', 'Video', 'Designer', 'Marketing', 'Events', 'Translator', 'Lawyer', 'Legalization']",
  "'Professional Services': ['Office Help', 'Accountant', 'Realtor', 'Photo', 'Video', 'Designer', 'Marketing', 'Events', 'Translator', 'Lawyer', 'Legalization', 'Other']"
);

fs.writeFileSync('src/data.ts', content);
