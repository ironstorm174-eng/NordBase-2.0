const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /<CustomerFlow\n([\s\S]*?)onOpenDashboard=\{\(\) => setCustomerView\('dashboard'\)\}\n\s*\/>/,
  `<CustomerFlow\n$1onOpenDashboard={() => setCustomerView('dashboard')}\n                  onRequestLogin={() => { setExpectedLoginRole('customer'); setShowLoginModal(true); }}\n                />`
);

fs.writeFileSync('src/App.tsx', code);
