const fs = require('fs');
let code = fs.readFileSync('src/components/LoginScreen.tsx', 'utf8');

code = code.replace(
  /<\/form>[\s\S]*?<\/p>\s*<\/>\s*\)}\s*<\/>/g,
  `</form>
                <p className="text-[9px] sm:text-[10px] text-slate-500 mt-1.5 text-center leading-tight">
                  By continuing, you agree to the Terms of Service. Secure authentication.
                </p>
`
);

fs.writeFileSync('src/components/LoginScreen.tsx', code);
