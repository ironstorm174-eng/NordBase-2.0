const fs = require('fs');
let code = fs.readFileSync('src/main.tsx', 'utf8');

if (!code.includes("BrowserRouter")) {
  code = code.replace("import { HelmetProvider } from 'react-helmet-async';", "import { HelmetProvider } from 'react-helmet-async';\nimport { BrowserRouter } from 'react-router-dom';");
  
  code = code.replace("<App />", "<BrowserRouter><App /></BrowserRouter>");
  
  fs.writeFileSync('src/main.tsx', code);
}
