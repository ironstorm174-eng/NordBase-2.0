const fs = require('fs');

function cleanRu(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');

  // Regex to remove `lang === 'ru' ? ... : `
  const regexTernary = /lang === 'ru'[\s\n]*\?[\s\n]*(?:'[^']*'|"[^"]*"|`[^`]*`)[\s\n]*:[\s\n]*/g;
  content = content.replace(regexTernary, '');
  
  // also `{lang === 'ru' && '...'}`
  const regexAnd = /\{lang === 'ru' && (?:'[^']*'|"[^"]*"|`[^`]*`)\}/g;
  content = content.replace(regexAnd, '');

  fs.writeFileSync(filePath, content);
}

cleanRu('src/components/academy/OperatorContent.tsx');
cleanRu('src/components/academy/SpecialistContent.tsx');
