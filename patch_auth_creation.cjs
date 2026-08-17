const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

// For the DB branch
code = code.replace(
  /if \(existingOtherUser && existingOtherUser\.password/g,
  "if (['super_admin', 'regional_admin', 'operator'].includes(targetRole)) {\n          return { error: `Access denied. No ${targetRole} account found for this email. Please contact Super Admin.` };\n        }\n\n        if (existingOtherUser && existingOtherUser.password"
);

fs.writeFileSync('server.ts', code);
