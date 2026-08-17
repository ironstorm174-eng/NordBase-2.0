const fs = require('fs');
let code = fs.readFileSync('src/components/LoginScreen.tsx', 'utf8');

// The block starts around 372: `{isAdminRole ? (`

code = code.replace(
  /\{isAdminRole \? \(/g,
  `
              <>
                {/* Google OAuth Button */}
                <div className="w-full flex justify-center py-0.5" id="google-signin-wrapper">
                  <div id="google-signin-container" className="w-full max-w-[280px] sm:max-w-[320px] min-h-[40px] flex justify-center items-center overflow-hidden"></div>
                </div>
                <div className="relative flex py-0.5 items-center">
                  <div className="flex-grow border-t border-blue-950/60"></div>
                  <span className="flex-shrink mx-2 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    {t('auth.orPhone', 'OR CONTINUE WITH')}
                  </span>
                  <div className="flex-grow border-t border-blue-950/60"></div>
                </div>
                
                {isAdminRole ? (`
);

// We need to remove the existing Google OAuth Button from the else branch
code = code.replace(
  /\{\/\* Google OAuth Button \*\/\}[\s\S]*?<div id="google-signin-container"[\s\S]*?<\/div>\s*<\/div>/g,
  ""
);

// We need to remove the previous "OR CONTINUE WITH PHONE" separator from the else branch since we moved it up.
code = code.replace(
  /<div className="relative flex py-0\.5 items-center">[\s\S]*?\{t\('auth\.orPhone', 'OR CONTINUE WITH PHONE'\)\}[\s\S]*?<\/div>\s*<\/div>/g,
  ""
);

// Finally, we need to balance the <></> tags
code = code.replace(
  /\{\/\* Registration vs Sign-In Mode Switcher \*\/\}/g,
  "{/* Registration vs Sign-In Mode Switcher */}"
);

// Wait, the new logic wraps `{isAdminRole ? (` with `<> ... {isAdminRole ? (`, so we need to close the tag after the ternary ends.
// Let's just find the end of the ternary.
code = code.replace(
  /<\/p>\s*<\/>\s*\)}/g,
  "</p>\n              </>\n            )}\n            </>"
);

fs.writeFileSync('src/components/LoginScreen.tsx', code);
