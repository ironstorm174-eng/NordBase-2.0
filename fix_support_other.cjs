const fs = require('fs');
let content = fs.readFileSync('src/types.ts', 'utf-8');
content = content.replace(
  "| 'Appeal' | 'Business';",
  "| 'Appeal' | 'Other';"
);
fs.writeFileSync('src/types.ts', content);
