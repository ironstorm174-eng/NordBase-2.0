const fs = require('fs');

const filesToFix = ['src/components/CustomerFlow.tsx', 'src/components/SpecialistDashboard.tsx'];

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

for (const file of filesToFix) {
  let content = fs.readFileSync(file, 'utf8');
  
  // A naive approach is to use a regular expression to find lang === 'pt' ? 'Pt string' : (lang === 'ru' ? 'Ru string' : 'En string')
  // But this might be too complex for a single regex because of nested quotes.
  // Instead, let's manually find and replace known patterns or use a general regex for the ternary.
  
  // Find all matches of `lang === 'pt' ? '...' : ...`
  // We can just use a regex to capture strings in the ternary operator and replace with t()
  // Pattern: lang === 'pt' \? ('[^']+'|`[^`]+`) : (lang === 'ru' \? ('[^']+'|`[^`]+`) : )?('[^']+'|`[^`]+`)
  
  const regex = /lang === 'pt' \? ('[^']+'|`[^`]+`) : (?:lang === 'ru' \? ('[^']+'|`[^`]+`) : )?('[^']+'|`[^`]+`)/g;
  
  let match;
  let counter = 1;
  const replacements = [];
  
  while ((match = regex.exec(content)) !== null) {
    const ptStr = match[1];
    const ruStr = match[2]; // Might be undefined
    const enStr = match[3] || match[2]; // if no ru, match[3] is undefined, enStr is match[2]
    
    // Create a key
    // enStr includes quotes, let's strip them
    const cleanEn = enStr.slice(1, -1);
    
    // We'll just generate a unique key or try to make one from the string
    const keyStr = cleanEn.replace(/[^a-zA-Z0-9]/g, '').substring(0, 15);
    const key = `inline_${keyStr}_${counter++}`;
    
    // The replacement will be: t(`spec.${key}`, ${enStr})
    // But since it's in CustomerFlow it could be flow. 
    const namespace = file.includes('CustomerFlow') ? 'flow' : 'spec';
    
    replacements.push({
      original: match[0],
      replacement: `t('${namespace}.${key}', ${enStr})`
    });
  }
  
  for (const rep of replacements) {
    content = content.replace(rep.original, rep.replacement);
  }
  
  fs.writeFileSync(file, content);
}
