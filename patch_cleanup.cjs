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

  // Cleanup remaining UI texts
  content = content.replace(/Operator Trust/g, 'Territory Partner Trust');
  content = content.replace(/operator mediation/g, 'territory partner mediation');
  content = content.replace(/operator dashboard/g, 'territory partner dashboard');
  content = content.replace(/OPERATOR TERMINAL/g, 'TERRITORY PARTNER TERMINAL');
  content = content.replace(/Operator Added/g, 'Territory Partner Added');
  content = content.replace(/Added operator/g, 'Added territory partner');
  content = content.replace(/Operator Removed/g, 'Territory Partner Removed');
  content = content.replace(/Removed operator/g, 'Removed territory partner');
  content = content.replace(/operator ID/g, 'territory partner ID');
  content = content.replace(/operator response times/g, 'territory partner response times');
  content = content.replace(/Regional operator/g, 'Regional partner');
  content = content.replace(/Operator •/g, 'Territory Partner •');
  content = content.replace(/Select an operator/g, 'Select a territory partner');
  content = content.replace(/OPERATOR DELETION/g, 'TERRITORY PARTNER DELETION');
  content = content.replace(/remove operator/g, 'remove territory partner');
  content = content.replace(/This operator will/g, 'This territory partner will');
  content = content.replace(/An operator will/g, 'A territory partner will');
  content = content.replace(/Operator \& Specialist/g, 'Territory Partner & Specialist');
  content = content.replace(/operator capacities/g, 'territory partner capacities');
  content = content.replace(/operator audit/g, 'territory partner audit');
  content = content.replace(/operator approval/g, 'territory partner approval');
  content = content.replace(/OPERATOR WORKPLACE/g, 'TERRITORY PARTNER WORKPLACE');
  content = content.replace(/Pending operator dispatch/g, 'Pending territory partner dispatch');
  content = content.replace(/operator profile/g, 'territory partner profile');

  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log('Updated ' + file);
  }
});
console.log('Done');
