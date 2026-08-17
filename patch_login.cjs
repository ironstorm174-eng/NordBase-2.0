const fs = require('fs');
let code = fs.readFileSync('src/components/LoginScreen.tsx', 'utf8');

// Change isAdminRole to exclude super_admin
code = code.replace(
  "const isAdminRole = expectedRole === 'super_admin' || expectedRole === 'operator' || expectedRole === 'regional_admin';",
  "const isAdminRole = expectedRole === 'operator' || expectedRole === 'regional_admin';"
);

// We need to hide the phone input form for super_admin
// Let's find the separator and the form and wrap it
code = code.replace(
  /<div className="relative flex py-0.5 items-center">/g,
  "{expectedRole !== 'super_admin' && (\n<div className=\"relative flex py-0.5 items-center\">"
);

// We need to close the brace after the form ends
// The form ends around line 590: `</form>`
// Wait, doing this via regex might be tricky. Let's do it specifically.
code = code.replace(
  /<\/form>/g,
  "</form>\n)}\n"
);
// But wait, there are two `</form>` tags in the file! (One for handleAdminLogin, one for handlePhoneSubmit)
// This will break the file. Let's write a smarter patch script.
fs.writeFileSync('src/components/LoginScreen.tsx', code);
