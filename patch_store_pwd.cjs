const fs = require('fs');
let code = fs.readFileSync('src/store.ts', 'utf8');

code = code.replace(
  /if \(user\.password && password && user\.password !== password\) \{[\s\S]*?\}/g,
  ""
);
code = code.replace(
  /if \(!user\.password && password\) \{[\s\S]*?\}/g,
  ""
);

fs.writeFileSync('src/store.ts', code);
