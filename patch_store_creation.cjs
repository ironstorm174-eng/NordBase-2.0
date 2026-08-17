const fs = require('fs');
let code = fs.readFileSync('src/store.ts', 'utf8');

code = code.replace(
  /if \(existingOtherUser && existingOtherUser\.password/g,
  "if (['super_admin', 'regional_admin', 'operator'].includes(targetRole)) {\n      throw new Error(`Access denied. No ${targetRole} account found for this email. Please contact Super Admin.`);\n    }\n\n    if (existingOtherUser && existingOtherUser.password"
);

fs.writeFileSync('src/store.ts', code);
