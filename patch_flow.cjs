const fs = require('fs');
let code = fs.readFileSync('src/components/CustomerFlow.tsx', 'utf8');

code = code.replace(
  /onClick=\{\(\) => \{ setSelectedSpecialty\(specialty\); \}\}/g,
  `onClick={() => { 
    if (!currentUser) {
      if (onRequestLogin) onRequestLogin();
      return;
    }
    setSelectedSpecialty(specialty); 
  }}`
);

fs.writeFileSync('src/components/CustomerFlow.tsx', code);
