const fs = require('fs');
let code = fs.readFileSync('src/store.ts', 'utf8');

// Replace the fallback 'olegadmin' user in returnToSuperAdmin
code = code.replace(
  /email: 'olegadmin',/g,
  "email: 'super_admin@nordbase.pt'," // Wait, better to use one of the allowed emails
);

code = code.replace(
  /super_admin@nordbase\.pt/g,
  "ironstorm174@gmail.com"
);

fs.writeFileSync('src/store.ts', code);
