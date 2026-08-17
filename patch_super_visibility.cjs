const fs = require('fs');
let code = fs.readFileSync('src/components/SuperAdminDashboard.tsx', 'utf8');

code = code.replace(
  "if (u.role === 'super_admin' && !canManageSupers && u.id !== 'u_1') return null;",
  ""
);

fs.writeFileSync('src/components/SuperAdminDashboard.tsx', code);
