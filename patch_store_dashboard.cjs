const fs = require('fs');
let code = fs.readFileSync('src/store.ts', 'utf8');

code = code.replace(
  /&& existingRoleUser\.dashboardNumber !== dashboardNumber\)/g,
  "&& dashboardNumber && existingRoleUser.dashboardNumber !== dashboardNumber)"
);

fs.writeFileSync('src/store.ts', code);
