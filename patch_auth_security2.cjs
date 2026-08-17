const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(
  /const allowedSuperAdmins = \['timeplace\.internal@gmail\.com', 'ironstorm174@gmail\.com', 'olegadmin', 'olegadmin@nordbase\.pt'\];/g,
  "const allowedSuperAdmins = ['timeplace.internal@gmail.com', 'ironstorm174@gmail.com'];"
);

fs.writeFileSync('server.ts', code);
