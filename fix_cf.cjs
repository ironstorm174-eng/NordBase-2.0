const fs = require('fs');
let code = fs.readFileSync('src/components/CustomerFlow.tsx', 'utf8');

code = code.replace(
  `      <section className="w-full" id="customer-seo-container">\n        {content}\n      </div>`,
  `      <section className="w-full" id="customer-seo-container">\n        {content}\n      </section>`
);

fs.writeFileSync('src/components/CustomerFlow.tsx', code);
