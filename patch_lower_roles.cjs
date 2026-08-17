const fs = require('fs');

function findFiles(dir, ext) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = dir + '/' + file;
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(findFiles(file, ext));
    } else { 
      if (file.endsWith(ext)) results.push(file);
    }
  });
  return results;
}

const files = findFiles('src', '.tsx').concat(findFiles('src', '.ts'));

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf-8');
  let original = content;

  // Specific replacements for lowercase sentences in UI
  content = content.replace(/Waiting for the operator/g, 'Waiting for the Territory Partner');
  content = content.replace(/regional operator/g, 'regional partner');
  content = content.replace(/Regional Operators/g, 'Regional Partners');
  content = content.replace(/territory partners/g, 'territory partners'); // wait
  content = content.replace(/our operators/g, 'our territory partners');
  content = content.replace(/Waiting for operator/g, 'Waiting for Territory Partner');
  content = content.replace(/operator coordinator/g, 'territory partner');

  // CustomerFlow.tsx specific
  content = content.replace(/local controller/g, 'territory partner');
  content = content.replace(/The nearest local Territory Partner will contact you shortly/g, 'The nearest Territory Partner will contact you shortly');

  // OperatorLeadsTerminal.tsx
  content = content.replace(/Incoming Order/g, 'Incoming Order');

  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log('Updated ' + file);
  }
});
console.log('Done');
