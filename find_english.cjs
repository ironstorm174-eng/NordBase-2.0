const fs = require('fs');

function checkFile(filePath) {
  const code = fs.readFileSync(filePath, 'utf8');
  const lines = code.split('\n');
  const results = [];
  
  lines.forEach((line, idx) => {
    // find tags like >Some Text< or placeholders="Some text"
    const textMatches = line.match(/>([A-Z][a-zA-Z0-9\s,\.\?\!\'\":\-\(\)\/\#]+)</g);
    if (textMatches) {
      textMatches.forEach(m => {
        const clean = m.replace(/^>|<$/g, '').trim();
        if (clean.length > 2 && !clean.includes('{') && !clean.includes('t(')) {
          results.push(`${filePath}:${idx+1}: ${clean}`);
        }
      });
    }
    const phMatches = line.match(/placeholder="([A-Za-z0-9\s,\.\?\!\'\":\-\(\)\/\#]+)"/g);
    if (phMatches) {
      phMatches.forEach(m => {
        results.push(`${filePath}:${idx+1}: ${m}`);
      });
    }
  });
  return results;
}

console.log("--- CustomerFlow.tsx ---");
console.log(checkFile('src/components/CustomerFlow.tsx').slice(0, 40).join('\n'));

console.log("--- PartnerLandingPage.tsx ---");
console.log(checkFile('src/components/PartnerLandingPage.tsx').slice(0, 30).join('\n'));

console.log("--- LoginScreen.tsx ---");
console.log(checkFile('src/components/LoginScreen.tsx').slice(0, 20).join('\n'));

console.log("--- SpecialistDashboard.tsx ---");
console.log(checkFile('src/components/SpecialistDashboard.tsx').slice(0, 20).join('\n'));

console.log("--- OperatorDashboard.tsx ---");
console.log(checkFile('src/components/OperatorDashboard.tsx').slice(0, 20).join('\n'));
