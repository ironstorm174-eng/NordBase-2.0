const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const securityCheck = `
  if (targetRole === 'super_admin') {
    const allowedSuperAdmins = ['timeplace.internal@gmail.com', 'ironstorm174@gmail.com', 'olegadmin', 'olegadmin@nordbase.pt'];
    if (!allowedSuperAdmins.includes(normalizedEmail)) {
      return { error: 'Access denied. You are not authorized as Super Admin.' };
    }
  }
`;

// Insert the security check right after targetRole assignment in authenticateOrRegisterUser
code = code.replace(
  /const targetRole = chosenRole \|\| 'customer';/g,
  "const targetRole = chosenRole || 'customer';\n" + securityCheck
);

fs.writeFileSync('server.ts', code);
