const fs = require('fs');

function cleanRuTernary(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');

  // We are looking for something like:
  // lang === 'ru' ? '...' : 
  // lang === 'ru' ? "..." : 
  // lang === 'ru' ? `...` : 
  
  // This regex matches `lang === 'ru' ? ` followed by a string literal (single, double, or backticks, handling simple cases), followed by ` : `
  // We replace it with nothing, effectively making the ternary fall through to the else branch (English).
  
  const regex = /lang === 'ru'[\s\n]*\?[\s\n]*(?:'[^']*'|"[^"]*"|`[^`]*`)[\s\n]*:[\s\n]*/g;
  
  content = content.replace(regex, '');
  
  // Also clean up any `lang === 'ru'` leftovers that might not have been caught due to nested ternaries or special formatting
  // For instance `lang === 'ru' ? (something else) :`
  // But let's see if the regex caught them all.

  fs.writeFileSync(filePath, content);
}

cleanRuTernary('src/components/CustomerDashboard.tsx');
cleanRuTernary('src/components/OperatorDashboard.tsx');
