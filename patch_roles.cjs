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

  // Replacements in text and string literals.
  
  // Replace Local Operator
  content = content.replace(/Local Operator/g, 'Territory Partner');
  content = content.replace(/local operator/g, 'territory partner');
  content = content.replace(/local Operator/g, 'territory partner');

  // Replace Regional Admin / Local Admin
  content = content.replace(/Regional Admin/g, 'Regional Partner');
  content = content.replace(/Local Admin/g, 'Regional Partner');
  content = content.replace(/regional admin/g, 'regional partner');
  content = content.replace(/local admin/g, 'regional partner');
  content = content.replace(/Admin Panel/g, 'Regional Partner Panel');
  
  // Replace Super Admin / HQ
  content = content.replace(/Super Admin/g, 'National Partner');
  content = content.replace(/NordBase HQ/g, 'National Partner');
  content = content.replace(/super admin/g, 'national partner');

  // Replace standalone "Operator" only in display text.
  content = content.replace(/Operator Academy/g, 'Territory Partner Academy');
  content = content.replace(/Operator Review/g, 'Territory Partner Review');
  content = content.replace(/Operator Coordinator/g, 'Territory Partner');
  content = content.replace(/Operator Mediator/g, 'Territory Partner Mediator');
  content = content.replace(/WhatsApp Operator/g, 'WhatsApp Partner');
  content = content.replace(/Call Operator/g, 'Call Partner');
  content = content.replace(/Your Operator/g, 'Your Partner');
  content = content.replace(/'Operator'/g, "'Territory Partner'");
  content = content.replace(/"Operator"/g, '"Territory Partner"');
  content = content.replace(/>Operator</g, '>Territory Partner<');
  content = content.replace(/Hello Operator!/g, 'Hello Partner!');
  content = content.replace(/Operator assigned/g, 'Territory Partner assigned');
  content = content.replace(/Role of the Local Operator/g, 'Role of the Territory Partner');
  content = content.replace(/Role of the Operator/g, 'Role of the Territory Partner');
  content = content.replace(/Operator Terminal/g, 'Territory Partner Terminal');

  // Additional generic 'operator' string replacements where it's capitalized like ' Operator '
  content = content.replace(/ an Operator /g, ' a Territory Partner ');
  content = content.replace(/ An Operator /g, ' A Territory Partner ');
  content = content.replace(/ a Operator /g, ' a Territory Partner ');
  content = content.replace(/ A Operator /g, ' A Territory Partner ');
  content = content.replace(/ Operator /g, ' Territory Partner ');
  content = content.replace(/ Operator,/g, ' Territory Partner,');
  content = content.replace(/ Operator\./g, ' Territory Partner.');
  content = content.replace(/ Operator!/g, ' Territory Partner!');
  content = content.replace(/Operator Earnings/g, 'Territory Partner Earnings');
  content = content.replace(/Operator Rating/g, 'Territory Partner Rating');
  content = content.replace(/>Operator</g, '>Territory Partner<');

  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log('Updated ' + file);
  }
});
console.log('Done');
