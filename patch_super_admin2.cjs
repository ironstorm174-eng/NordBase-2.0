const fs = require('fs');
let code = fs.readFileSync('src/components/SuperAdminDashboard.tsx', 'utf8');

code = code.replace(
  /<div>\s*<div className="text-xs text-slate-500 font-bold mb-1">\s*Password\s*<\/div>[\s\S]*?Hidden\s*<\/div>\s*<\/div>\s*<\/div>/,
  ""
);

// We also need to remove it from the Add Partner modal.
code = code.replace(
  /<div>\s*<label className="block text-xs font-bold text-slate-400 mb-1">\s*Temporary Password[\s\S]*?<\/div>/,
  ""
);

fs.writeFileSync('src/components/SuperAdminDashboard.tsx', code);
