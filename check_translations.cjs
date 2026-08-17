const fs = require('fs');

const en = JSON.parse(fs.readFileSync('src/locales/en/translation.json', 'utf8'));
const pt = JSON.parse(fs.readFileSync('src/locales/pt/translation.json', 'utf8'));

// Check missing keys in PT relative to EN
const enKeys = new Set();
const ptKeys = new Set();

function traverse(obj, prefix, set) {
  for (let key in obj) {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      traverse(obj[key], prefix + key + '.', set);
    } else {
      set.add(prefix + key);
    }
  }
}

traverse(en, '', enKeys);
traverse(pt, '', ptKeys);

let missingInPt = [];
for (let key of enKeys) {
  if (!ptKeys.has(key)) missingInPt.push(key);
}

console.log('Missing in PT:', missingInPt.length);
if (missingInPt.length > 0) {
  console.log(missingInPt.slice(0, 20).join('\n'));
}

// Check if any pt translations are literally identical to english, suggesting it's not translated (except maybe short terms)
let untranslated = [];
function checkUntranslated(enObj, ptObj, prefix) {
  for (let key in enObj) {
    if (typeof enObj[key] === 'object' && enObj[key] !== null) {
      if (ptObj && ptObj[key]) {
        checkUntranslated(enObj[key], ptObj[key], prefix + key + '.');
      }
    } else {
      if (ptObj && ptObj[key] && ptObj[key] === enObj[key] && typeof enObj[key] === 'string' && enObj[key].length > 10) {
         untranslated.push(prefix + key + ': ' + enObj[key]);
      }
    }
  }
}
checkUntranslated(en, pt, '');
console.log('Untranslated in PT:', untranslated.length);
if (untranslated.length > 0) {
  console.log(untranslated.slice(0, 10).join('\n'));
}
