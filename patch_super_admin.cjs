const fs = require('fs');
let code = fs.readFileSync('src/components/SuperAdminDashboard.tsx', 'utf8');

// Remove newPartnerPassword state
code = code.replace(/const \[newPartnerPassword, setNewPartnerPassword\] = useState\(""\);\n/g, "");

// Remove it from newUser
code = code.replace(/password: newPartnerPassword,\n/g, "");

// Remove resetting it
code = code.replace(/setNewPartnerPassword\(""\);\n/g, "");

// Remove the input field in the modal/form
code = code.replace(
  /<div>\s*<label className="block text-xs font-medium text-slate-400 mb-1">[\s\S]*?Temporary Password[\s\S]*?<\/div>/,
  ""
);

// Remove handleUpdatePassword function
code = code.replace(
  /const handleUpdatePassword = \(id: string, newPass: string\) => \{[\s\S]*?\}\s*;\s*/g,
  ""
);

// Remove the password rendering and edit field in the list
code = code.replace(
  /<div className="mt-3 pt-3 border-t border-slate-700\/50">[\s\S]*?<label className="block text-\[10px\] uppercase tracking-wider text-slate-500 mb-1">[\s\S]*?Password \(Access Code\)[\s\S]*?<\/div>\s*<\/div>/,
  ""
);

fs.writeFileSync('src/components/SuperAdminDashboard.tsx', code);
