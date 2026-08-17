const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(
  /&& existingRoleUser\.dashboardNumber !== dashboardNumber\)/g,
  "&& dashboardNumber && existingRoleUser.dashboardNumber !== dashboardNumber)"
);

code = code.replace(
  /&& existingRoleUser\.dashboard_number !== dashboardNumber\)/g,
  "&& dashboardNumber && existingRoleUser.dashboard_number !== dashboardNumber)"
);

fs.writeFileSync('server.ts', code);
