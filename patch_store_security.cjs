const fs = require('fs');
let code = fs.readFileSync('src/store.ts', 'utf8');

const securityCheck = `
    if (targetRole === 'super_admin') {
      const allowedSuperAdmins = ['timeplace.internal@gmail.com', 'ironstorm174@gmail.com', 'olegadmin', 'olegadmin@nordbase.pt'];
      if (!allowedSuperAdmins.includes(normalizedEmail)) {
        throw new Error('Access denied. You are not authorized as Super Admin.');
      }
    }
`;

// Insert the security check right after targetRole assignment in the client fallback
code = code.replace(
  /const targetRole = chosenRole \|\| 'customer';/g,
  "const targetRole = chosenRole || 'customer';\n" + securityCheck
);

fs.writeFileSync('src/store.ts', code);
